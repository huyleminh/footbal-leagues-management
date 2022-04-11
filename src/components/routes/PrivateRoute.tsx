import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IAPIResponse } from "../../@types/AppInterfaces";
import HttpService from "../../services/HttpService";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import AppConstants from "../../shared/AppConstants";

type PrivateRouteType = {
	children: JSX.Element;
	role: "admin" | "manager";
};

function PrivateRoute(props: PrivateRouteType) {
	const [isChecking, setIsChecking] = useState(true);
	const [isValid, setIsValid] = useState(false);

	useEffect(() => {
		const verify = async () => {
			try {
				const res = await HttpService.get<IAPIResponse<any | string>>("/verify-token");
				const role =
					props.role === "admin" ? AppConstants.ADMIN_ROLE : AppConstants.MANAGER_ROLE;

				if (res.code === 200 && role === res.data.role) {
					setIsValid(true);
					setIsChecking(false);
				} else {
					Swal.fire({
						title: "Truy cập không được cho phép",
						text: "Bạn không có quyền truy cập trang này",
						icon: "warning",
						confirmButtonText: "Đồng ý",
					}).then((res) => {
						if (res.isConfirmed || res.isDismissed) setIsChecking(false);
					});
				}
			} catch (err) {
				console.log(err);
			}
		};

		verify();
	}, [props.role]);

	return isChecking ? (
		<Loading message="Đang kiểm tra quyền truy cập" />
	) : isValid ? (
		props.children
	) : (
		<Navigate to="/login" />
	);
}

export default PrivateRoute;
