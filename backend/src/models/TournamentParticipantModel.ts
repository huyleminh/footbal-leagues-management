import { model, Schema } from "mongoose";
import { ITournamentParticipantModel } from "./interfaces/ITournamentParticipantModel";
import TeamModel from "./TeamModel";
import TournamentModel from "./TournamentModel";

const TournamentParticipantSchema = new Schema<ITournamentParticipantModel>({
	tournamentId: { type: Schema.Types.ObjectId, required: true, ref: TournamentModel },
	teams: {
		type: [
			{
				teamId: { type: Schema.Types.ObjectId, required: true, ref: TeamModel },
				participatedAt: { type: Date, required: true },
				totalWon: { type: Number, required: true },
				totalLost: { type: Number, required: true },
				totalTied: { type: Number, required: true },
				totalPoint: { type: Number, required: true },
			},
		],
		minlength: 0,
		required: true,
	},
});

export default model("tournament_participant", TournamentParticipantSchema);
