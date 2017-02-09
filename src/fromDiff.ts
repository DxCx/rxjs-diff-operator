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
  protected diffObserver: Observer<IObservableDiff>;

  constructor(destination: Subscriber<T>) {
    super(destination);
    this.diffObserver = fromDiffObserver<T>(this.destination);
  }

  protected _next(value: IObservableDiff) {
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

Observable.prototype.fromDiff = fromDiff;
