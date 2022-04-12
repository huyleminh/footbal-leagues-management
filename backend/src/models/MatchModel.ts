import { model, Schema } from "mongoose";
import { ICompetitor, IMatchModel } from "./interfaces/IMatchModel";
import LineupModel from "./LineupModel";
import MatchEventModel from "./MatchEventModel";
import TeamModel from "./TeamModel";

const CompetitorModel = new Schema<ICompetitor>({
	teamId: { type: Schema.Types.ObjectId, required: true, ref: TeamModel },
	teamType: { type: String, required: true },
	isWinner: { type: Boolean, required: true },
	totalShot: { type: Number, required: true },
	shotsOntarget: { type: Number, required: true },
	possessions: { type: Number, required: true },
	totalPass: { type: Number, required: true },
	passAccuracy: { type: Number, required: true },
	offsides: { type: Number, required: true },
	conners: { type: Number, required: true },
	fouls: { type: Number, required: true },
	lineupId: { type: Schema.Types.ObjectId, required: true, ref: LineupModel },
});

const MatchSchema = new Schema<IMatchModel>({
	scheduleDate: { type: Date, required: true },
	kickedOffDate: { type: Date, required: true },
	location: { type: String },
	stadiumName: { type: String },
	round: { type: Number, required: true },
	season: { type: Number, required: true },
	events: { type: [{ type: Schema.Types.ObjectId, ref: MatchEventModel }], required: true },
	competitors: { type: [CompetitorModel], required: true },
});

export default model("match", MatchSchema);
