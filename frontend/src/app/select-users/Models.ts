export enum BusinessRole {
	Administrator = 1,
	Organizer = 2,
	Participant = 3
}

export enum BoardType {
	Organization = 1,
	Board = 2
}

export interface EnumToArrayElement {
	id: number,
	name: string
}

export interface IUserCard {
	email: string,
	username: string,
	profileURL: string,
	avatarURL: string,
	role: BusinessRole | null
}

export interface IBoardKey {
	id: number,
	type: BoardType
}

export interface IBoard extends IBoardKey {
	hasRoles: boolean,
	users: IUserCard[]
}
