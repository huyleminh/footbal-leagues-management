import { Navigate, Route, Routes } from "react-router-dom";
import { IBaseComponentProps } from "../../@types/ComponentInterfaces";
import ManagerList from "./ManagerList";

export interface IManagerProps extends IBaseComponentProps {}

function ManagerFeature(props: IManagerProps) {
	return (
		<Routes>
			<Route index element={<ManagerList />} />
			<Route path="*" element={<Navigate to="/404" replace />} />
		</Routes>
	);
}

export default ManagerFeature;
