import { IAppNextFuction, IAppRequest, IAppResponse } from "../@types/AppBase";
import TokenUtil from "../utils/TokenUtil";
import AppResponse from "../shared/AppResponse";

export function validateLoginData(req: IAppRequest, res: IAppResponse, next: IAppNextFuction) {
	const { body } = req;

	const apiResponse = new AppResponse(res, 400, "Bad Request");

	let { username, password } = body;

	if (!username || !username.toString().trim()) {
		return apiResponse.data("Thiếu tên đăng nhập").send();
	}

	if (!password || !password.toString().trim()) {
		return apiResponse.data("Thiếu mật khẩu").send();
	}

	res.locals.payload = {
		username,
		password,
	};
	next();
}

export function validateRefreshTokenData(
	req: IAppRequest,
	res: IAppResponse,
	next: IAppNextFuction,
) {
	const { authorization } = req.headers;
	const { refreshToken } = req.body;
	const apiRes = new AppResponse(res, 401, "Unauthorized");
	if (!authorization || !refreshToken) {
		return apiRes.send();
	}

	const idToken = authorization.split(" ")[1];
	if (!idToken) {
		return apiRes.send();
	}

	res.locals.payload = {
		refreshToken,
		idToken,
	};
	next();
}

export function verifyUserToken(req: IAppRequest, res: IAppResponse, next: IAppNextFuction) {
	const { path } = req;
	if (path && path.match("/auth")) {
		next();
		return;
	}

	const { authorization } = req.headers;
	const apiRes = new AppResponse(res, 401, "Unauthorized");
	if (!authorization) {
		return apiRes.send();
	}

	const accessToken = authorization.split(" ")[1];
	if (!accessToken) {
		return apiRes.send();
	}

	TokenUtil.verifyToken(accessToken, "access_token")
		.then((data) => {
			res.locals.tokenPayload = data;
			next();
		})
		.catch((err) => {
			if (err.message === "jwt expired") {
				apiRes.data("Token expired");
			}
			apiRes.send();
		});
}

export default { validateLoginData, validateRefreshTokenData, verifyUserToken };
