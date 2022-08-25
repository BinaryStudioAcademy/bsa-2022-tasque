export enum BusinessRole {
  Administrator = 1,
  Organizer = 2,
  Participant = 3,
}

export enum BoardType {
  Organization = 1,
  Board = 2,
}

export interface EnumToArrayElement {
  id: number;
  name: string;
}

export interface IUserCard {
  email: string;
  username: string;
  profileURL: string;
  avatarURL: string;
  role: BusinessRole | null;
}

export interface IBoardKey {
  id: number;
  type: BoardType;
}

export interface IBoard extends IBoardKey {
  hasRoles: boolean;
  users: IUserCard[];
}

export function getRolesAsArray(): [color: string, text: string, id: number][] {
  return Object.keys(BusinessRole)
    .filter((v) => isNaN(Number(v)))
    .map((name) => {
      let color = 'white';
      let text = name;
      let id: number = BusinessRole[name as keyof typeof BusinessRole]
      return [color, text, id];
    });
}
