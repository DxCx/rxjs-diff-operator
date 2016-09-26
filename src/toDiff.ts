import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';
import { IObservableDiff } from './interfaces';
import { diff } from 'deep-diff';

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
  private isObject: boolean = false;
  private lastValue: any;

  constructor(destination: Subscriber<T>) {
    super(destination);
  }

  protected _next(value: T) {
      if ( 0 === this.count ) {
          this.isObject = (typeof value === 'object');
          this.destination.next({type: 'init', payload: value, isObject: this.isObject});
      } else if ( this.isObject ) {
          this.destination.next({type: 'update', payload: diff(this.lastValue, value)});
      } else {
          this.destination.next({type: 'update', payload: value});
      }

      this.lastValue = value;
      this.count ++;
  }

  protected _error(e: Error) {
      this.destination.next({type: 'error', payload: e.message});
      this.destination.complete();
  }

  protected _complete() {
      this.destination.next({type: 'complete'});
      this.destination.complete();
  }
}

Observable.prototype.toDiff = toDiff;
