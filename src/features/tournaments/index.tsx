import { Navigate, Route, Routes } from "react-router-dom";
import { IBaseComponentProps } from "../../@types/ComponentInterfaces";
import PrivateRoute from "../../components/routes/PrivateRoute";
import CreateTournament from "./CreateTournament";
import TournamentDetail from "./TournamentDetail";
import TournamentList from "./TournamentList";

export interface ITournamentFeatureProps extends IBaseComponentProps {}

function TournamentFeature(props: ITournamentFeatureProps) {
	return (
		<Routes>
			<Route
				path="/create"
				element={<PrivateRoute role="manager" element={<CreateTournament />} />}
			/>
			<Route
				path="/:id/*"
				element={<PrivateRoute role="all" element={<TournamentDetail />} />}
			/>
			<Route index element={<PrivateRoute role="all" element={<TournamentList />} />} />
			<Route path="*" element={<Navigate to="/404" replace />} />
		</Routes>
	);
}

export default TournamentFeature;
