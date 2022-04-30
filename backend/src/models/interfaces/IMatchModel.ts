import { Types } from "mongoose";

export interface ICompetitor {
	teamId: Types.ObjectId;
	teamType: number;
	goal: number;
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
	tournamentId: Types.ObjectId;
	scheduledDate: Date;
	kickedOffDate: Date;
	stadiumName: string;
	round: number;
	events: Array<Types.ObjectId>;
	competitors: Array<ICompetitor>;
}
