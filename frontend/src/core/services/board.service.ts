import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from 'src/core/services/http.service';
import { BoardInfoModel } from 'src/core/models/board/board-info-model';
import {
  IBoard,
  IBoardKey,
  IUserCard,
} from 'src/shared/components/select-users/Models';
import { BoardModel } from '../models/board/board-model';

@Injectable({
  providedIn: 'root',
})

// localStorage is used for tests only. It will be removed when we have a proper BoardService
export class BoardService {
  public routePrefix = '/api/board';

  constructor(public httpService: HttpService) { }

  public getUsers(board: IBoard): Observable<IUserCard[]> {
    const key = this.createKey(board);

    // change to Http.getAll
    let storedBoard = JSON.parse(localStorage.getItem(key) as string);
    if (board != storedBoard) {
      storedBoard = board;
      this.save(storedBoard);
    }
    const users: IUserCard[] = board ? board.users : [];
    return new Observable((observer) => {
      observer.next(users);
      observer.complete();
    });
    //this.httpService.getFullRequest(this.routePrefix + '/')
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

  getUserBoards(userId: number): Observable<HttpResponse<BoardInfoModel[]>> {
    return this.httpService.getFullRequest<BoardInfoModel[]>(
      this.routePrefix + `/getUserBoards/${userId}`,
    );
  }

  getProjectBoard(projectId: number): Observable<HttpResponse<BoardModel>> {
    return this.httpService.getFullRequest<BoardModel>( this.routePrefix + `/${projectId}`);
  }

  updateProjectBoard(board: BoardModel): Observable<HttpResponse<BoardModel>> {
    return this.httpService.putFullRequest<BoardModel>( this.routePrefix + `/${board.projectId}`, board);
  }
}
