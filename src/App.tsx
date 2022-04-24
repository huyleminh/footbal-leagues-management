import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
import LoginPage from "./features/auth/login";
import ForbiddenPage from "./features/errors/403";
import PageNotFound from "./features/errors/404";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/403" element={<ForbiddenPage />} />
			<Route path="/404" element={<PageNotFound />} />
			<Route path="/*" element={<PrivateRoute role="all" showChecking />} />
			<Route path="*" element={<Navigate to="/404" replace />} />
		</Routes>
	);
}

export default App;
