export default class AppConfigs {
	static get API_URL(): string {
		return process.env.REACT_APP_API_URL || "";
	}
}
