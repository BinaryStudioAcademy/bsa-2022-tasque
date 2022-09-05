import { TasqueDropdownOption } from '../tasque-dropdown/dropdown.component';

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
  id: number,
  email: string;
  username: string;
  profileURL: string;
  avatarURL?: string;
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

export function getRolesAsArray(): TasqueDropdownOption[] {
  return Object.keys(BusinessRole)
    .filter((v) => isNaN(Number(v)))
    .map((name) => {
      return {
        color: '',
        title: name,
        id: BusinessRole[name as keyof typeof BusinessRole]
      };
    });
}
