import { model, Schema } from "mongoose";
import { ITournamentModel } from "./interfaces/ITournamentModel";
import UserModel from "./UserModel";

export enum TOURNAMENT_STATUS_ENUM {
	INPROGRESS,
	END,
	CANCEL,
}

const TournamentSchema = new Schema<ITournamentModel>({
	createdBy: { type: Schema.Types.ObjectId, required: true, ref: UserModel },
	name: { type: String, required: true },
	logoUrl: { type: String, required: true },
	sponsorName: { type: [String], required: true },
	totalTeam: { type: Number },
	status: {
		type: Number,
		enum: [
			TOURNAMENT_STATUS_ENUM.INPROGRESS,
			TOURNAMENT_STATUS_ENUM.END,
			TOURNAMENT_STATUS_ENUM.CANCEL,
		],
		default: TOURNAMENT_STATUS_ENUM.INPROGRESS,
	},
	config: {
		maxAdditionalPlayer: { type: Number, required: true },
		maxChangingPlayer: { type: Number, required: true },
		maxPlayerAge: { type: Number, required: true },
		maxAbroardPlayer: { type: Number, required: true },
		maxTeam: { type: Number, required: true },
		maxPlayerPerMatch: { type: Number, required: true },
	},
	createdAt: { type: Date, default: () => new Date() },
	updatedAt: { type: Date, default: () => new Date() },
});

export default model("tournament", TournamentSchema);
