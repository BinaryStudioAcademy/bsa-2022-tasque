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
    board = JSON.parse(localStorage.getItem(key) as string);
    return new Observable(observer => { observer.next(board.users); observer.complete() });
  }

  public addUser(email: string, board: IBoard): Observable<any> {
    // change to HttpClient.getOne
    let user: IUserCard | null = {
      email: email,
      username: email,
      profileURL: "something",
      avatarURL: "https://www.w3schools.com/howto/img_avatar.png",
      role: board.hasRoles ? BusinessRole.Participant : null
    }

    // for simulation during the tests. Math random to be removed
    if (Math.random() >= 0.9 || user == null) {
      throw Error("User was not found");
    }

    // change to HttpClient.put for Board entity
    board.users.push(user);

    this.save(board);
    return new Observable(observer => { observer.next("done"); observer.complete() });
  }

  public deleteUser(board: IBoard, email: string): Observable<any> {
    // change to HttpClient.delete
    board.users = board.users.filter(u => u.email != email);

    this.save(board);
    return new Observable(observer => { observer.next("done"); observer.complete() });
  }

  public updateUser(board: IBoard, user: IUserCard): Observable<any> {
    // change to HttpClient.put for user
    let updateUser = board.users.filter(u => u.email == user.email)[0];
    let updateIndex = board.users.indexOf(updateUser);
    board.users[updateIndex] = user;

    this.save(board);
    return new Observable(observer => { observer.next("done"); observer.complete() });
  }

  public createKey(board: IBoard): string {
    let key: IBoardKey = {
      id: board.id,
      type: board.type
    }

    return JSON.stringify(key);
  }

  private save(board: IBoard): void {
    let key = this.createKey(board);
    localStorage.setItem(key, JSON.stringify(board));
  }
}
