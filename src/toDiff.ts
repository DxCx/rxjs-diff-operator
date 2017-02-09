import { IObservableDiff, Observer, toDiffObserver } from 'observable-diff-operator';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';

export function toDiff<T>(): Observable<IObservableDiff> {
  return this.lift(new ToDiffOperator());
}

export class ToDiffOperator<T> implements Operator<T, IObservableDiff> {
  public call(subscriber: Subscriber<IObservableDiff>, source: any): any {
    return source.subscribe(new ToDiffSubscriber<T>(subscriber));
  }
}

class ToDiffSubscriber<T> extends Subscriber<T> {
  protected diffObserver: Observer<T>;

  constructor(destination: Subscriber<IObservableDiff>) {
    super(destination);
    this.diffObserver = toDiffObserver<T>(this.destination);
  }

  protected _next(value: T) {
    if ( this.diffObserver.next ) {
      return this.diffObserver.next(value);
    } else {
      return this.destination.next(value);
    }
  }

  protected _error(err: Error) {
    if ( this.diffObserver.error ) {
      return this.diffObserver.error(err);
    } else {
      return this.destination.error(err);
    }
  }

  protected _complete() {
    if ( this.diffObserver.complete ) {
      return this.diffObserver.complete();
    } else {
      return this.destination.complete();
    }
  }
}

Observable.prototype.toDiff = toDiff;
