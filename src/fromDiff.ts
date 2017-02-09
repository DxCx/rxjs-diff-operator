import * as clone from 'clone';
import { applyChange } from 'deep-diff';
import * as deepFreeze from 'deep-freeze';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { IObservableDiff } from './interfaces';

export function fromDiff<T extends IObservableDiff, R>(): Observable<R> {
  return this.lift(new FromDiffOperator<T>());
}

export class FromDiffOperator<T extends IObservableDiff> implements Operator<T, T> {
  public call(subscriber: Subscriber<T>, source: any): any {
    return source.subscribe(new FromDiffSubscriber(subscriber));
  }
}

class FromDiffSubscriber<T extends IObservableDiff> extends Subscriber<T> {
  private count: number = 0;
  private lastValue: any;
  private isObject: boolean = false;

  constructor(destination: Subscriber<T>) {
    super(destination);
  }

  /** onNext hook. */
  protected _next(value: IObservableDiff) {
    /* is this the first message? */
    if ( 0 === this.count ) {
      /* start init sequance. */
      this._process_init(value);
    } else {
      /* general message processing */
      this._process_diff(value);
    }
    this.count ++;
  }

  /** emits a new value, while saving it for patching in the future */
  private _emitValue(newValue: any) {
    this.lastValue = clone(newValue);
    if ( this.isObject ) {
      deepFreeze(this.lastValue);
    }

    this.destination.next(this.lastValue);
  }

  /** general message handler */
  private _process_diff({type, payload}: IObservableDiff) {
    switch ( type ) {
      case 'init':
        /* init message cannot be sent more then once. */
        this.destination.error(new Error('Init message emitted while in sequance'));
        break;
      case 'update':
        /* update message */
        let copyValue = payload;
        if ( this.isObject ) {
          copyValue = clone(this.lastValue);
          payload.forEach((changeset: any) => {
            applyChange(copyValue, true, changeset);
          });
        };
        this._emitValue(copyValue);
        break;
 case 'error':
   /* error message, throw it */
   this.destination.error(new Error(payload));
   break;
 case 'complete':
   /* complete message, completes the observable */
   this.destination.complete();
   break;
 default:
   this.destination.error(new Error('unexpected message'));
   break;
    }
  }

  /** init message handler */
  private _process_init({type, payload, isObject}: IObservableDiff) {
    /* if the first message is not init message, throw error. */
    if ( type !== 'init') {
      this.destination.error(new Error('Init message was not emitted.'));
      return;
    }
    this.isObject = isObject;

    this._emitValue(payload);
  }
}

Observable.prototype.fromDiff = fromDiff;
