import { ThemeProvider } from "@mui/material";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { ToastContainer } from "material-react-toastify";
import "material-react-toastify/dist/ReactToastify.css";
import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./assets/scss/index.scss";
import { GlobalTheme } from "./assets/themes/GlobalTheme";
import reportWebVitals from "./reportWebVitals";

ReactDOM.render(
	<React.StrictMode>
		<BrowserRouter>
			<ThemeProvider theme={GlobalTheme}>
				<LocalizationProvider dateAdapter={AdapterDateFns}>
					<App />
				</LocalizationProvider>
				<ToastContainer
					position="top-right"
					autoClose={3000}
					hideProgressBar
					newestOnTop={true}
					closeOnClick
					pauseOnFocusLoss
					draggable
					pauseOnHover
				/>
			</ThemeProvider>
		</BrowserRouter>
	</React.StrictMode>,
	document.getElementById("root"),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
