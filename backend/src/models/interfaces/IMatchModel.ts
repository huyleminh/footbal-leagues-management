import { Types } from "mongoose";

export type TeamType = "home" | "away";

export interface ICompetitor {
	teamId: Types.ObjectId;
	teamType: TeamType;
	isWinner: boolean;
	totalShot: number;
	shotsOntarget: number;
	possessions: number;
	totalPass: number;
	passAccuracy: number;
	offsides: number;
	conners: number;
	fouls: number;
	lineupId: Types.ObjectId;
}

export interface IMatchModel {
	scheduleDate: Date;
	kickedOffDate: Date;
	location?: string;
	stadiumName?: string;
	round: number;
	season: number;
	events: Array<Types.ObjectId>;
	competitors: Array<ICompetitor>;
}
