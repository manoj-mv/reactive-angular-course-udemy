import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

@Injectable()
export class LoadingService {
  private loadingSubject: BehaviorSubject<boolean> = new BehaviorSubject(false);
  loading$: Observable<boolean> = this.loadingSubject.asObservable();

  showLoaderUntillCompleted<T>(obs$: Observable<T>): Observable<T> {
    return of(null).
      pipe(
        tap(() => this.loadingStart()),
        concatMap(() => {
          return obs$
        }),
        finalize(
          () => this.loadingEnd()
        )
      )
  }

  loadingStart() {
    this.loadingSubject.next(true);
  }

  loadingEnd() {
    this.loadingSubject.next(false);
  }
}
