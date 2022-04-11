import * as moment from "moment";
import { IAppRequest, IAppResponse } from "../../@types/AppBase";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import UserModel from "../../models/schemas/UserSchema";
import UserTokenModel from "../../models/schemas/UserTokenSchema";
import AppResponse from "../../shared/AppResponse";
import BcryptUtil from "../../utils/BcryptUtil";
import { Logger } from "../../utils/Logger";
import TokenUtil from "../../utils/TokenUtil";
import AppController from "../AppController";
export default class AuthController extends AppController {
	constructor() {
		super();
	}

	init(): void {
		this._router.post("/auth/login", [AuthMiddlewares.validateLoginData], this.postLoginAsync);
		this._router.post(
			"/auth/refresh",
			[AuthMiddlewares.validateRefreshTokenData],
			this.postRefreshTokenAsync,
		);

		this._router.get("/verify-token", this.getVerifyTokenAsync);
	}

	async postLoginAsync(req: IAppRequest, res: IAppResponse) {
		const { username, password } = res.locals.payload;
		const apiResponse = new AppResponse(res);

		try {
			const user = await UserModel.findOne({ username });
			if (user === null || !BcryptUtil.verifyHashedString(password, user.password)) {
				return apiResponse
					.code(400)
					.message("Bad Request")
					.data("Tên đăng nhập hoặc mật khẩu không đúng")
					.send();
			}

			const accessToken = TokenUtil.generateAccessToken({
				scope: "leagues:all",
				role: user.role,
			});
			const { refreshToken, iv } = TokenUtil.generateRefreshToken(
				JSON.stringify({
					scope: "leagues:all",
					role: user.role,
				}),
			);
			const idToken = TokenUtil.generateIdToken(user._id.toString(), {
				email: user.email,
				fullname: user.fullname,
			});

			// delete old token
			UserTokenModel.deleteMany({ userId: user._id })
				.exec()
				.catch((err) => {
					Logger.error({
						message: {
							class: "AuthController",
							method: "postLoginAsync",
							msg: err.message,
						},
					});
				});

			// store refresh token + iv to mongo
			UserTokenModel.create({
				userId: user._id,
				refreshToken,
				initVector: iv,
				expireDate: moment().add(7, "days").toDate(),
			}).catch((err) => {
				Logger.error({
					message: {
						class: "AuthController",
						method: "postLoginAsync",
						msg: err.message,
					},
				});
			});

			apiResponse
				.data({
					token: {
						accessToken,
						refreshToken,
						idToken,
						expireIn: 5 * 60 * 1000, // 5 mins
						expireAt: moment().add(5, "minutes").toISOString(),
					},
					user: {
						fullname: user.fullname,
						role: user.role
					},
				})
				.send();
		} catch (error) {
			Logger.error({
				message: {
					class: "AuthController",
					method: "postLoginAsync",
					msg: error.message,
				},
			});
			apiResponse
				.code(400)
				.message("Bad Request")
				.data("Không thể đăng nhập, vui lòng thử lại")
				.send();
		}
	}

	async postRefreshTokenAsync(req: IAppRequest, res: IAppResponse) {
		const { refreshToken, idToken } = res.locals.payload;
		const apiRes = new AppResponse(res);
		try {
			const payload = await TokenUtil.verifyToken(idToken, "id_token");
			const userToken = await UserTokenModel.findOne({ userId: payload.sub });

			if (userToken === null) {
				throw new Error(`User is not logged in or Invalid idToken: ${idToken}`);
			}
			if (
				refreshToken !== userToken.refreshToken ||
				moment().isAfter(moment(userToken.expireDate))
			) {
				await UserTokenModel.findByIdAndRemove(userToken._id);
				throw new Error(`Malicious refresh token: ${refreshToken}`);
			}

			const data = TokenUtil.decryptRefreshToken(
				userToken.refreshToken,
				userToken.initVector,
			);
			const accessToken = TokenUtil.generateAccessToken(JSON.parse(data));
			const newRefreshToken = TokenUtil.generateRefreshToken(data);

			UserTokenModel.findByIdAndUpdate(userToken._id, {
				refreshToken: newRefreshToken.refreshToken,
				initVector: newRefreshToken.iv,
				expireDate: moment().add(7, "days").toDate(),
			}).exec();

			apiRes
				.code(200)
				.message("OK")
				.data({
					accessToken,
					refreshToken: newRefreshToken.refreshToken,
					idToken,
					expireIn: 5 * 60 * 1000,
					expireAt: moment().add(5, "minutes").toISOString(),
				})
				.send();
		} catch (error) {
			Logger.error({
				message: {
					class: "AuthController",
					method: "postRefreshTokenAsync",
					msg: error.message,
				},
			});
			apiRes
				.code(401)
				.message("Unauthorized")
				.data("Không thể làm mới phiên đăng nhập, vui lòng đăng nhập lại")
				.send();
		}
	}

	async getVerifyTokenAsync(req: IAppRequest, res: IAppResponse) {
		const { tokenPayload } = res.locals;
		new AppResponse(res, 200, "OK", {
			scope: tokenPayload.scope,
			role: tokenPayload.role,
		}).send();
	}
}
