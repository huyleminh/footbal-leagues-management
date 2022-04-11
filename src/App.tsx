import { Navigate, Route, Routes } from "react-router-dom";
import PrivateRoute from "./components/routes/PrivateRoute";
import AdminDashboard from "./features/admin/AdminDashboard";
import LoginPage from "./features/auth/login";
import ForbiddenPage from "./features/errors/403";
import PageNotFound from "./features/errors/404";
import ManagerDashboard from "./features/manager/ManagerDashboard";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/403" element={<ForbiddenPage />} />
			<Route
				path="manager/*"
				element={
					<PrivateRoute role="manager">
						<ManagerDashboard />
					</PrivateRoute>
				}
			/>
			<Route
				path="admin/*"
				element={
					<PrivateRoute role="admin">
						<AdminDashboard />
					</PrivateRoute>
				}
			/>
			<Route path="/" element={<Navigate to="/login" />}/>
			<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
}

export default App;
