import { Route, Routes } from "react-router-dom";
import LoginPage from "./features/auth/login";
import ForbiddenPage from "./features/errors/403";
import PageNotFound from "./features/errors/404";

function App() {
	return (
		<Routes>
			<Route path="/login" element={<LoginPage />} />
			<Route path="/403" element={<ForbiddenPage />} />
			{/* <Route
				path="/*"
				element={
					<PrivateRoute>
						<Dashboard />
					</PrivateRoute>
				}
			/> */}
			<Route path="*" element={<PageNotFound />} />
		</Routes>
	);
}

export default App;
