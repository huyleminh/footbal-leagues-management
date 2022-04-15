import { IAPIPaginationMetadata, IAppRequest, IAppResponse } from "../../@types/AppBase";
import AuthMiddlewares from "../../middlewares/AuthMiddlewares";
import ManagerMiddlewares from "../../middlewares/ManagerMiddlewares";
import TournamentModel from "../../models/TournamentModel";
import UserModel, { USER_ROLE_ENUM, USER_STATUS } from "../../models/UserModel";
import UserTokenModel from "../../models/UserTokenModel";
import EmailService from "../../services/EmailService";
import AppResponse from "../../shared/AppResponse";
import BcryptUtil from "../../utils/BcryptUtil";
import { Logger } from "../../utils/Logger";
import AppController from "../AppController";

export default class ManagerController extends AppController {
	constructor() {
		super();
	}

	init(): void {
		this._router.get(
			"/managers",
			[AuthMiddlewares.verifyAdminRole, ManagerMiddlewares.verifyGetParams],
			this.getLocalManagerListAsync,
		);

		this._router.get(
			"/managers/:id",
			[AuthMiddlewares.verifyAdminRole],
			this.getLocalManagerByIdAsync,
		);

		this._router.post(
			"/managers",
			[AuthMiddlewares.verifyAdminRole, ManagerMiddlewares.validateRergisterData],
			this.postRegisterLocalManagerAsync,
		);

		this._router.patch(
			"/managers/:id/password",
			[AuthMiddlewares.verifyAdminRole],
			this.patchResetPasswordAsync,
		);

		this._router.delete(
			"/managers/:id",
			[AuthMiddlewares.verifyAdminRole],
			this.deleteLocalManageAsync,
		);
	}

	async getLocalManagerListAsync(req: IAppRequest, res: IAppResponse) {
		const {
			payload: { limitItems, currentPage, userStatus },
		} = res.locals;
		const apiRes = new AppResponse(res);

		const filter = {
			role: USER_ROLE_ENUM.LOCAL_MANAGER,
			status: userStatus,
		};
		if (userStatus === undefined) {
			delete filter.status;
		}

		try {
			const userList = await UserModel.find(filter, null, {
				limit: limitItems,
				skip: limitItems * (currentPage - 1),
			})
				.select(["-__v", "-password"])
				.exec();
			const totalRecord = await UserModel.find(filter).countDocuments();

			const metadata: IAPIPaginationMetadata = {
				createdDate: new Date(),
				pagination: {
					page: currentPage,
					pageSize: userList.length,
					totalRecord,
				},
			};
			apiRes.code(200).message("OK").data(userList).metadata(metadata).send();
		} catch (error) {
			Logger.error({
				message: {
					class: "ManagerController",
					method: "getLocalManagerListAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể lấy danh sách manager").send();
		}
	}

	async getLocalManagerByIdAsync(req: IAppRequest, res: IAppResponse) {
		const { id } = req.params;
		const apiRes = new AppResponse(res, 200, "OK");

		try {
			const user = await UserModel.findById(id).select(["-__v", "-password"]).exec();
			if (user === null) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Không tìm thấy quản lý")
					.send();
			}
			const tournamentList = await TournamentModel.find({ createdBy: user._id }).exec();
			apiRes.data({ user, tournamentList }).send();
		} catch (error) {
			Logger.error({
				message: {
					class: "ManagerController",
					method: "getLocalManagerByIdAsync",
					msg: error.message,
				},
			});
			apiRes
				.code(400)
				.message("Bad Request")
				.data("Không thể lấy danh sách chi tiết manager")
				.send();
		}
	}

	async postRegisterLocalManagerAsync(req: IAppRequest, res: IAppResponse) {
		const { payload } = res.locals;
		const apiRes = new AppResponse(res);
		try {
			const allRes = await Promise.allSettled([
				UserModel.findOne({ username: payload.username }),
				UserModel.findOne({ email: payload.email }),
			]);
			const allResMsg = ["Tên đăng nhập đã tồn tại", "Email đã tồn tại"];
			for (let i = 0; i < allRes.length; ++i) {
				const result = allRes[i];
				if (result.status === "rejected") {
					throw new Error(result.reason);
				} else {
					if (result.value !== null) {
						return apiRes.code(400).message("Bad Request").data(allResMsg[i]).send();
					}
				}
			}

			await UserModel.create(payload);
			EmailService.sendUsernamePassword(payload.email, payload.username, payload.password);
			apiRes.code(201).message("Created").send();
		} catch (error) {
			Logger.error({
				message: {
					class: "ManagerController",
					method: "postRegisterLocalManagerAsync",
					msg: error.message,
				},
			});
			apiRes
				.code(400)
				.message("Bad Request")
				.data("Không thể tạo mới quản lý, vui lòng thử lại")
				.send();
		}
	}

	async patchResetPasswordAsync(req: IAppRequest, res: IAppResponse) {
		const { id } = req.params;
		const { password } = req.body;
		const apiRes = new AppResponse(res);

		if (!password || !password.toString().trim()) {
			return apiRes.code(400).message("Bad Request").data("Thiếu mật khẩu").send();
		}

		try {
			const queryResponse = await UserModel.findByIdAndUpdate(id, {
				password: BcryptUtil.generateHash(password.trim()),
			}).exec();

			if (queryResponse === null) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Không tìm thấy quản lý")
					.send();
			}

			UserTokenModel.findByIdAndRemove(id).exec();
			EmailService.sendResetPassword(queryResponse.email, password);

			apiRes.code(200).message("OK").data("Cấp lại mật khẩu thành công").send();
		} catch (error) {
			Logger.error({
				message: {
					class: "ManagerController",
					method: "patchResetPasswordAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể cấp lại mật khẩu").send();
		}
	}

	async deleteLocalManageAsync(req: IAppRequest, res: IAppResponse) {
		const { id } = req.params;
		const apiRes = new AppResponse(res);

		try {
			const user = await UserModel.findById(id).exec();
			if (user === null) {
				return apiRes
					.code(400)
					.message("Bad Request")
					.data("Không tìm thấy quản lý")
					.send();
			}

			let data = "";
			const tournamentList = await TournamentModel.find({ createdBy: user._id }).exec();
			if (tournamentList !== null && tournamentList.length > 0) {
				await UserModel.findByIdAndUpdate(user._id, { status: USER_STATUS.INACTIVE });
				data = "Vô hiệu hóa quản lý thành công";
			} else {
				await UserModel.findByIdAndRemove(user._id);
				data = "Xóa quản lý thành công";
			}
			await UserTokenModel.findByIdAndRemove(user._id);

			apiRes.code(200).message("OK").data(data).send();
		} catch (error) {
			Logger.error({
				message: {
					class: "ManagerController",
					method: "deleteLocalManageAsync",
					msg: error.message,
				},
			});
			apiRes.code(400).message("Bad Request").data("Không thể xóa quản lý").send();
		}
	}
}