import { model, Schema } from "mongoose";
import { ICompetitor, IMatchModel } from "./interfaces/IMatchModel";
import LineupModel from "./LineupModel";
import MatchEventModel from "./MatchEventModel";
import TeamModel from "./TeamModel";

export enum MATCH_COMPETITOR_ENUM {
	HOME,
	AWAY,
}

const CompetitorModel = new Schema<ICompetitor>({
	teamId: { type: Schema.Types.ObjectId, required: true, ref: TeamModel },
	teamType: {
		type: Number,
		enum: [MATCH_COMPETITOR_ENUM.HOME, MATCH_COMPETITOR_ENUM.AWAY],
		required: true,
	},
	isWinner: { type: Boolean, required: true },
	goal: { type: Number },
	totalShot: { type: Number },
	shotsOntarget: { type: Number },
	possessions: { type: Number },
	totalPass: { type: Number },
	passAccuracy: { type: Number },
	offsides: { type: Number },
	conners: { type: Number },
	fouls: { type: Number },
	lineupId: { type: Schema.Types.ObjectId, ref: LineupModel },
});

const MatchSchema = new Schema<IMatchModel>({
	tournamentId: { type: Schema.Types.ObjectId, required: true },
	scheduledDate: { type: Date, required: true },
	kickedOffDate: { type: Date },
	stadiumName: { type: String, required: true },
	round: { type: Number, required: true },
	// season: { type: Number, required: true },
	events: { type: [{ type: Schema.Types.ObjectId, ref: MatchEventModel }], default: [] },
	competitors: { type: [CompetitorModel], required: true },
});

export default model("match", MatchSchema);
