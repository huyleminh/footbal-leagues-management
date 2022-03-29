import * as dotenv from "dotenv";

dotenv.config();

export class AppConfigs {
	static get AUTH_CLIENT_URLS(): string[] | string {
		return process.env.AUTH_CLIENT_URLS ? process.env.AUTH_CLIENT_URLS.split(" ") : "*";
	}

	static get PORT(): number {
		return process.env.PORT ? +process.env.PORT : 5000;
	}

	static get APP_DOMAIN(): string {
		return process.env.APP_DOMAIN ? process.env.APP_DOMAIN : "http://localhost";
	}

	static get DB_CONNECTION(): string {
		return process.env.DB_CONNECTION ? process.env.DB_CONNECTION : "";
	}
}
