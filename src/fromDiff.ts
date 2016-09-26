import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { IObservableDiff } from './interfaces';
import { applyChange } from 'deep-diff';
import * as deepFreeze from 'deep-freeze';
import * as clone from 'clone';

export interface FromDiffSignature<T> {
  (): Observable<IObservableDiff>;
}

export function fromDiff<T extends IObservableDiff, R>(): Observable<R> {
  return this.lift(new FromDiffOperator<T>());
}

export class FromDiffOperator<T extends IObservableDiff> implements Operator<T, T> {
  public call(subscriber: Subscriber<T>, source: any): any {
    return source._subscribe(new FromDiffSubscriber(subscriber));
  }
}

class FromDiffSubscriber<T extends IObservableDiff> extends Subscriber<T> {
  private count: number = 0;
  private lastValue: any;

  constructor(destination: Subscriber<T>) {
    super(destination);
  }

  private _updateValue(newValue: any, isObject: boolean) {
      this.lastValue = clone(newValue);
      deepFreeze(this.lastValue);
      this.destination.next(isObject ? this.lastValue : this.lastValue.p);
  }

  private _process_diff({type, payload, isObject}: IObservableDiff) {
      if ( 0 === this.count ) {
          if ( type !== "init") {
              this.destination.error(new Error('Init message was not emitted.'));
              return;
          }
          this._updateValue(payload, isObject);
          return;
      }

      switch ( type ) {
          case "init":
              this.destination.error(new Error('Init message emitted while in sequance'));
              break;
          case "update":
              let copyValue = clone(this.lastValue);
              payload.forEach((changeset: any) => {
                  applyChange(copyValue, true, changeset);
              });
              this._updateValue(copyValue, isObject);
              break;
          case "error":
              this.destination.error(new Error(payload));
              break;
          case "complete":
              this.destination.complete();
              break;
      }
  }

  protected _next(value: IObservableDiff) {
      this._process_diff(value);
      this.count ++;
  }
}

Observable.prototype.fromDiff = fromDiff;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    fromDiff: FromDiffSignature<T>;
  }
}
