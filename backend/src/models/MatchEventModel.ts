import { Schema, model } from "mongoose";
import { IMatchEventModel } from "./interfaces/IMatchEventModel";
import PlayerModel from "./PlayerModel";

const MatchEventShema = new Schema<IMatchEventModel>({
	ocurringMinute: { type: Number, required: true },
	isHome: { type: Boolean, required: true },
	goal: {
		type: {
			type: { type: String, required: true },
			assist: { type: Schema.Types.ObjectId, ref: PlayerModel },
			player: { type: Schema.Types.ObjectId, required: true, ref: PlayerModel },
		},
	},
	card: {
		type: {
			type: { type: String, required: true },
			player: { type: Schema.Types.ObjectId, required: true, ref: PlayerModel },
		},
	},
	substitution: {
		type: {
			inPlayer: { type: Schema.Types.ObjectId, required: true, ref: PlayerModel },
			outPlayer: { type: Schema.Types.ObjectId, required: true, ref: PlayerModel },
		},
	},
});

export default model("match_event", MatchEventShema);
