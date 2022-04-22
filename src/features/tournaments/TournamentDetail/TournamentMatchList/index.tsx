import { Navigate, Route, Routes } from "react-router-dom";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";
import PrivateRoute from "../../../../components/routes/PrivateRoute";
import MatchList from "./MatchList";

export interface ITournamentMatchListProps extends IBaseComponentProps {}

function TournamentMatchList(props: ITournamentMatchListProps) {
	return (
		<Routes>
			<Route index element={<PrivateRoute role="all" element={<MatchList />}/>}/>
			<Route path="*" element={<Navigate to="/404" replace />} />
		</Routes>
	)
}

export default TournamentMatchList;
