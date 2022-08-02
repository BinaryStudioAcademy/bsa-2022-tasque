import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class SpinnerService {

    private isLoading$$ = new BehaviorSubject<boolean>(false);
    isLoading$ = this.isLoading$$.asObservable();

    constructor() { }

    show = (): void => this.isLoading$$.next(true);

    hide = (): void => this.isLoading$$.next(false);
}
