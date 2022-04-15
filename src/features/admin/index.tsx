import { Route, Routes } from "react-router-dom";
import { IBaseComponentProps } from "../../@types/ComponentInterfaces";
import ManagerList from "./ManagerList";

export interface IManagerProps extends IBaseComponentProps {}

function ManagerFeature(props: IManagerProps) {
    return (
        <Routes>
            <Route index element={<ManagerList />}/>
        </Routes>
    )
}

export default ManagerFeature;
