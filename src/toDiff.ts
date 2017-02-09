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
  constructor(destination: Subscriber<IObservableDiff>) {
    super(toDiffObserver<T>(destination));
  }
}

Observable.prototype.toDiff = toDiff;
