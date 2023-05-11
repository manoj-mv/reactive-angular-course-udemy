import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

@Injectable()
export class MessagesService {
  private _subject = new BehaviorSubject<string[]>([]);
  errors$: Observable<string[]> = this._subject.asObservable()
    .pipe(
      filter(errors => errors && errors.length > 0)
    );
  constructor() { }

  showErros(...errors: string[]) {
    this._subject.next(errors);
  }
}
