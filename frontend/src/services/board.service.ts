import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  BusinessRole,
  IBoard,
  IBoardKey,
  IUserCard,
} from 'src/shared/components/select-users/Models';

@Injectable({
  providedIn: 'root',
})

// localStorage is used for tests only. It will be removed when we have a proper BoardService
export class BoardService {
  constructor() { }

  public getUsers(board: IBoard): Observable<IUserCard[]> {
    const key = this.createKey(board);

    // change to Http.getAll
    board = JSON.parse(localStorage.getItem(key) as string);
    const users: IUserCard[] = board ? board.users : [];
    return new Observable((observer) => {
      observer.next(users);
      observer.complete();
    });
  }

  public addUser(email: string, board: IBoard): Observable<unknown> {
    // change to HttpClient.getOne
    const user: IUserCard | null = {
      email: email,
      username: email,
      profileURL: 'something',
      avatarURL: 'https://www.w3schools.com/howto/img_avatar.png',
      role: board.hasRoles ? BusinessRole.Participant : null,
    };

    // change to HttpClient.put for Board entity
    board.users.push(user);

    this.save(board);
    return new Observable((observer) => {
      // For simulation during the tests. Math random should be removed later
      if (Math.random() <= 0.9) {
        observer.next('done');
        observer.complete();
      }
      observer.error();
    });
  }

  public deleteUser(board: IBoard, email: string): Observable<unknown> {
    // change to HttpClient.delete
    board.users = board.users.filter((u) => u.email != email);

    this.save(board);
    return new Observable((observer) => {
      observer.next('done');
      observer.complete();
    });
  }

  public updateUser(board: IBoard, user: IUserCard): Observable<unknown> {
    // change to HttpClient.put for user
    const updateUser = board.users.filter((u) => u.email == user.email)[0];
    const updateIndex = board.users.indexOf(updateUser);
    board.users[updateIndex] = user;

    this.save(board);
    return new Observable((observer) => {
      observer.next('done');
      observer.complete();
    });
  }

  public createKey(board: IBoard): string {
    const key: IBoardKey = {
      id: board.id,
      type: board.type,
    };

    return JSON.stringify(key);
  }

  private save(board: IBoard): void {
    const key = this.createKey(board);
    localStorage.setItem(key, JSON.stringify(board));
  }
}
