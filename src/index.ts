import { IObservableDiff } from 'observable-diff-operator';
import { Observable } from 'rxjs/Observable';
export { toDiff } from './toDiff';
export { fromDiff } from './fromDiff';

export type ToDiffSignature<T> = () => Observable<IObservableDiff>;
export type FromDiffSignature<T> = () => Observable<IObservableDiff>;

declare module 'rxjs/Observable' {
  interface Observable<T> {
    toDiff: ToDiffSignature<T>;
    fromDiff: FromDiffSignature<T>;
  }
}
