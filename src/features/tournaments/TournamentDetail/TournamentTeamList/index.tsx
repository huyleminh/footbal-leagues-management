import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import PrivateRoute from "../../../../components/routes/PrivateRoute";
import { IBaseComponentProps } from "../../../../@types/ComponentInterfaces";
import TeamList from "./TeamList";
import TeamDetail from "./TeamDetail";

export interface ITournamentTeamListProps extends IBaseComponentProps {}

function TournamentTeamList(props: ITournamentTeamListProps) {
	return (
		<Routes>
			<Route path="/:id" element={<PrivateRoute role="all" element={<TeamDetail />} />} />
			<Route index element={<PrivateRoute role="all" element={<TeamList />} />} />
			<Route path="*" element-={<Navigate to="/404" replace />} />
		</Routes>
	);
}

export default TournamentTeamList;
