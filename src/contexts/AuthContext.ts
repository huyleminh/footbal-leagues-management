import { createContext } from "react";
import { IAuthContext } from "../@types/AppInterfaces";

const AuthContext = createContext<IAuthContext>({
	role: "",
});

export default AuthContext;
