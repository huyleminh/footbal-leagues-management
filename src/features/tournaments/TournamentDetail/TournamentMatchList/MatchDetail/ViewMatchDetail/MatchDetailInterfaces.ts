import { IBaseComponentProps } from "../../../../../../@types/ComponentInterfaces";
import { MatchListItemType } from "../../MatchList/MatchListItem";

export interface ILineupType {
	playerId: string;
	stripNumber: number;
	name: string;
	position: string;
	captain?: boolean;
}

export interface ISubstitutionType {
	playerId: string;
	stripNumber: number;
	name: string;
}

export interface ITeamMatchDetailType {
	id: string;
	name: string;
	point?: number;
	logo: string;
	totalShot?: number;
	shotsOnTarget?: number;
	possessions?: number;
	totalPasses?: number;
	passAccuracy?: number;
	offside?: number;
	corners?: number;
	fouls?: number;
	lineup: Array<ILineupType>;
	substitution: Array<ISubstitutionType>;
}

export interface IMatchDetailType {
	id: string;
	homeTeam: ITeamMatchDetailType;
	awayTeam: ITeamMatchDetailType;
	stadium: string;
	date: string | Date | null;
}

export interface ICompetitorItem {
	conners: number;
	fouls: number;
	goal: number;
	isWinner: boolean;
	offsides: number;
	passAccuracy: number;
	possessions: number;
	shotsOntarget: number;
	teamId: string;
	teamType: 0 | 1; // 0 is home, 1 is away
	totalPass: number;
	totalShot: number;
	lineup: {
		playerId: string;
		playerName: string;
		playerType: 0 | 1; // 0 is main player, 1 is substitution player
		inMatchPosition: string;
		stripNumber: number;
	}[];
}

export interface IMatchDetailResData {
	competitors: ICompetitorItem[];
	round: number;
	scheduledDate: string;
	stadiumName: string;
	_id: string;
}

export type GoalType = "normal" | "og" | "penalty";

export type CardType = "red" | "yellow";

export interface IMatchEventResData {
	_id: string;
	ocurringMinute: string;
	isHome: boolean;
	goal: {
		type: GoalType;
		player: string;
		assist?: string;
		playerName: string;
		assistName?: string;
		playerStrip: string;
		assistStrip?: string;
		_id: string;
	} | null;
	card: {
		type: CardType;
		player: string;
		playerName: string;
		playerStrip: string;
		_id: string;
	} | null;
	substitution: {
		inPlayer: string;
		outPlayer: string;
		inName: string;
		outName: string;
		inStrip: string;
		outStrip: string;
		_id: string;
	} | null;
}

export interface IMatchDetailProps extends IBaseComponentProps {
	open: boolean;
	onClose: Function;
	match: MatchListItemType | null;
}
