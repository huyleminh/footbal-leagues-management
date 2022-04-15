import React, { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { IAPIResponse } from "../../@types/AppInterfaces";
import HttpService from "../../services/HttpService";
import Loading from "../loading/Loading";
import Swal from "sweetalert2";
import AppConstants from "../../shared/AppConstants";
import { PrivateRouteType } from "../../@types/ComponentInterfaces";
import Dashboard from "../../features/dashboard/Dashboard";

function PrivateRoute(props: PrivateRouteType) {
	const [isChecking, setIsChecking] = useState(true);
	const [isValid, setIsValid] = useState(false);
	const [type, setType] = useState<"admin" | "manager">("admin");

	useEffect(() => {
		const verify = async () => {
			try {
				const res = await HttpService.get<IAPIResponse<any | string>>("/verify-token");

				const role =
					props.role === "all"
						? "all"
						: props.role === "admin"
						? AppConstants.ADMIN_ROLE
						: AppConstants.MANAGER_ROLE;

				if (res.code === 200 && (role === res.data.role || role === "all")) {
					setType(res.data.role === AppConstants.ADMIN_ROLE ? "admin" : "manager");
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
		props.element ? (
			React.cloneElement(props.element, { userRole: type })
			// props.element
		) : (
			<Dashboard type={type} />
		)
	) : (
		<Navigate to="/login" />
	);
}

export default PrivateRoute;
