import { TypographyOptions } from "@mui/material/styles/createTypography";

export const AppTypography: TypographyOptions = {
	fontFamily: ["Inter", "sans-serif"].join(","),
	fontSize: 15,
	h1: {
		fontStyle: "normal",
		fontWeight: "700",
		fontSize: "64px",
		lineHeight: "80px",
	},
	h2: {
		fontStyle: "normal",
		fontWeight: "600",
		fontSize: "48px",
		lineHeight: "64px",
	},
	h3: {
		fontStyle: "normal",
		fontWeight: "600",
		fontSize: "36px",
		lineHeight: "54px",
	},
	h4: {
		fontStyle: "normal",
		fontWeight: "bold",
		fontSize: "24px",
		lineHeight: "36px",
	},
	h5: {
		fontStyle: "normal",
		fontWeight: 600,
		fontSize: "20px",
		lineHeight: "30px",
	},
	h6: {
		fontStyle: "normal",
		fontWeight: 600,
		fontSize: "18px",
		lineHeight: "28px",
	},
	subtitle1: {
		fontStyle: "normal",
		fontWeight: 400,
		fontSize: "16px",
		lineHeight: "28px",
		color: "#A4AFB9",
	},
	subtitle2: {
		fontStyle: "normal",
		fontWeight: 400,
		fontSize: "14px",
		lineHeight: "26px",
		color: "#A4AFB9",
	},
	body2: {
		fontWeight: 500,
	}
};
