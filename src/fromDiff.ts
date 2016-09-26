import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { IObservableDiff } from './interfaces';
import { applyChange } from 'deep-diff';
import * as deepFreeze from 'deep-freeze';
import * as clone from 'clone';

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
  private isObject: boolean = false;

  constructor(destination: Subscriber<T>) {
    super(destination);
  }

  protected _next(value: IObservableDiff) {
      if ( 0 === this.count ) {
          this._process_init(value);
      } else {
          this._process_diff(value);
      }
      this.count ++;
  }

  private _updateValue(newValue: any) {
      this.lastValue = clone(newValue);
      if ( this.isObject ) {
          deepFreeze(this.lastValue);
      }

      this.destination.next(this.lastValue);
  }

  private _process_diff({type, payload}: IObservableDiff) {
      switch ( type ) {
          case 'init':
              this.destination.error(new Error('Init message emitted while in sequance'));
              break;
          case 'update':
              let copyValue = payload;
              if ( this.isObject ) {
                  copyValue = clone(this.lastValue);
                  payload.forEach((changeset: any) => {
                      applyChange(copyValue, true, changeset);
                  });
              };
              this._updateValue(copyValue);
              break;
          case 'error':
              this.destination.error(new Error(payload));
              break;
          case 'complete':
              this.destination.complete();
              break;
          default:
              this.destination.error(new Error('unexpected message'));
              break;
      }
  }

  private _process_init({type, payload, isObject}: IObservableDiff) {
      if ( type !== 'init') {
          this.destination.error(new Error('Init message was not emitted.'));
          return;
      }
      this.isObject = isObject;

      this._updateValue(payload);
  }
}

Observable.prototype.fromDiff = fromDiff;
