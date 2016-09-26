import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { IObservableDiff } from './interfaces';
import { diff } from 'deep-diff';

export interface ToDiffSignature<T> {
  (): Observable<IObservableDiff>;
}

export function toDiff<T>(): Observable<IObservableDiff> {
  return this.lift(new ToDiffOperator());
}

export class ToDiffOperator<T> implements Operator<T, T> {
  public call(subscriber: Subscriber<T>, source: any): any {
    return source._subscribe(new ToDiffSubscriber(subscriber));
  }
}

class ToDiffSubscriber<T> extends Subscriber<T> {
  private count: number = 0;
  private lastValue: any;

  constructor(destination: Subscriber<T>) {
    super(destination);
  }

  protected _next(value: T) {
      if ( 0 === this.count ) {
          this.destination.next({type: 'init', payload: value});
      } else {
          this.destination.next({type: 'update', payload: diff(this.lastValue, value)});
      }

      this.lastValue = value;
      this.count ++;
  }

  protected _error(e: Error) {
      this.destination.next({type: 'error', payload: e});
      this.destination.complete();
  }

  protected _complete() {
      this.destination.next({type: 'complete'});
      this.destination.complete();
  }
}

Observable.prototype.toDiff = toDiff;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    toDiff: ToDiffSignature<T>;
  }
}
