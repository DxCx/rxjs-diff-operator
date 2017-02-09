import { diff } from 'deep-diff';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { IObservableDiff } from './interfaces';

export function toDiff<T>(): Observable<IObservableDiff> {
  return this.lift(new ToDiffOperator());
}

export class ToDiffOperator<T> implements Operator<T, T> {
  public call(subscriber: Subscriber<T>, source: any): any {
    return source.subscribe(new ToDiffSubscriber(subscriber));
  }
}

class ToDiffSubscriber<T> extends Subscriber<T> {
  private count: number = 0;
  private isObject: boolean = false;
  private lastValue: any;

  constructor(destination: Subscriber<T>) {
    super(destination);
  }

  /** onNext hook. */
  protected _next(value: T) {
    /* is this the first message? */
    if ( 0 === this.count ) {
      /* check for isObject property */
      this.isObject = (typeof value === 'object');
      /* emit the init message */
      this.destination.next({type: 'init', payload: value, isObject: this.isObject});
    } else if ( this.isObject ) {
      /* this is an object, sending diff update */
      this.destination.next({type: 'update', payload: diff(this.lastValue, value)});
    } else {
      /* this is a simple value, sending as-is */
      this.destination.next({type: 'update', payload: value});
    }

    this.lastValue = value;
    this.count ++;
  }

  /** onError hook. */
  protected _error(e: Error) {
    /* emit the error message, then complete the observable */
    this.destination.next({type: 'error', payload: e.message});
    this.destination.complete();
  }

  /** onComplete hook. */
  protected _complete() {
    /* emit the complete message, then complete the observable */
    this.destination.next({type: 'complete'});
    this.destination.complete();
  }
}

Observable.prototype.toDiff = toDiff;
