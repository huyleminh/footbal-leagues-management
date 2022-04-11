import { HomeRounded } from "@mui/icons-material";
import Dashboard from "../../components/dashboard/Dashboard";

function ManagerDashboard() {
	let user = null;
	user = localStorage.getItem("user");
	user = user ? JSON.parse(user) : null;

	const pathname = "/manager";

	// Sample navigation list
	const navigationList = [
		{
			label: "Nav 1",
			icon: <HomeRounded />,
			path: `${pathname}`, // Should place the route after the pathname
		},
		{
			label: "Nav 4",
			icon: <HomeRounded />,
			subMenu: [
				{
					label: "Nav 5",
					icon: <HomeRounded />,
					path: `${pathname}/nav-5`,
				},
				{
					label: "Nav 6",
					icon: <HomeRounded />,
					path: `${pathname}/nav-6`,
				},
			],
		},
	];

	return (
		<Dashboard navigationList={navigationList} userFullname={user ? user.fullname : undefined}>
			{/* Put component here to render */}
		</Dashboard>
	);
}
export default ManagerDashboard;
