import { Observable } from 'rxjs/Observable';
import { IObservableDiff } from './interfaces';
export * from './interfaces';
export { toDiff } from './toDiff';
export { fromDiff } from './fromDiff';

export interface ToDiffSignature<T> {
  (): Observable<IObservableDiff>;
}

export interface FromDiffSignature<T> {
  (): Observable<IObservableDiff>;
}

declare module 'rxjs/Observable' {
  interface Observable<T> {
    toDiff: ToDiffSignature<T>;
    fromDiff: FromDiffSignature<T>;
  }
}
