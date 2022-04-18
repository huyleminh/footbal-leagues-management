import { Stack } from "@mui/material";
import React, { useContext } from "react";
import { IBaseComponentProps } from "../../../../../@types/ComponentInterfaces";
import AuthContext from "../../../../../contexts/AuthContext";

export interface ITeamDetailProps extends IBaseComponentProps {}

function TeamDetail(props: ITeamDetailProps) {
	const authContext = useContext(AuthContext);

	return <Stack spacing={2}>Team detail</Stack>;
}

export default TeamDetail;
