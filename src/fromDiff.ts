import { fromDiffObserver, IObservableDiff, Observer } from 'observable-diff-operator';
import { Observable } from 'rxjs/Observable';
import { Operator } from 'rxjs/Operator';
import { Subscriber } from 'rxjs/Subscriber';

export function fromDiff<T extends IObservableDiff, R>(): Observable<R> {
  return this.lift(new FromDiffOperator<T>());
}

export class FromDiffOperator<T extends IObservableDiff> implements Operator<T, T> {
  public call(subscriber: Subscriber<T>, source: any): any {
    return source.subscribe(new FromDiffSubscriber(subscriber));
  }
}

class FromDiffSubscriber<T extends IObservableDiff> extends Subscriber<T> {
  constructor(destination: Subscriber<T>) {
    super(fromDiffObserver<T>(destination));
  }
}

Observable.prototype.fromDiff = fromDiff;
