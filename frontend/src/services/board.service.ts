import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { BoardType, BusinessRole, IBoard, IBoardKey, IUserCard } from 'src/app/select-users/Models';

@Injectable({
  providedIn: 'root'
})
  
// localStorage is used for tests only. It will be removed when we have a proper BoardService
  
export class BoardService {

  constructor() { }

  public getUsers(board: IBoard): Observable<IUserCard[]> {
    let key = this.createKey(board);

    // change to Http.getAll
    board = JSON.parse(key);
    return new Observable(observer => { observer.next(board.users); observer.complete() });
  }

  public addUser(email: string, board: IBoard): void {

    // change to HttpClient.getOne
    let user: IUserCard | null = {
      id: Math.random() * Number.MAX_SAFE_INTEGER,
      email: email,
      username: email,
      profileURL: "something",
      avatarURL: "https://www.w3schools.com/howto/img_avatar.png",
      role: board.hasRoles ? BusinessRole.Participant : null
    }

    // for simulation during the tests. Math random to be removed
    if (Math.random() <= 0.9 || user == null) {
      throw Error("User was not found");
    }

    board.users.push(user);

    let key = this.createKey(board);

    // change to HttpClient.put
    localStorage.setItem(key, JSON.stringify(board));
  }

  public removeUser(board: IBoard, user: IUserCard): void {
    board.users = board.users.filter(u => u.id != user.id);

    let key = this.createKey(board);

    // change to HttpClient.delete
    localStorage.setItem(key, JSON.stringify(board));
  }

  private createKey(board: IBoard): string {
    let key: IBoardKey = {
      id: board.id,
      type: board.type
    }

    return JSON.stringify(key);
  }
}
