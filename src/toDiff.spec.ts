'use strict';

import 'jest';

import { Observable } from 'rxjs';
import './index';

describe('toDiff operator', () => {
  it('Should be pass sanity', () => {
    expect(typeof (Observable.prototype as any).toDiff).toBe('function');
  });

  it('emits basic changes', () => {
    const obs: Observable<number> = Observable.of(1, 2, 3, 4, 5);

    return obs.toDiff().bufferCount(6).toPromise().then((msgs) => {
      expect(typeof msgs).toBe('object');
      expect(msgs[0].type).toBe('init');
      expect(msgs[5].type).toBe('complete');
      expect(msgs).toMatchSnapshot();
    });
  });

  it('emits object changes', () => {
    const obs: Observable<{ value: number }> = Observable.of(1, 2, 3, 4, 5).map((v) => ({ value: v}));

    return obs.toDiff().bufferCount(6).toPromise().then((msgs) => {
      expect(typeof msgs).toBe('object');
      expect(msgs[0].type).toBe('init');
      expect(msgs[5].type).toBe('complete');
      expect(msgs).toMatchSnapshot();
    });
  });

  it('emits errors as well', () => {
    const obs: Observable<{ value: number }> = Observable.of(1, 2, 3, 4, 5)
      .map((v: number, i: number) => {
        if ( i === 2 ) {
          throw new Error('testing errors');
        }

        return { value: v };
      });

    return obs.toDiff().bufferCount(6).toPromise().then((msgs) => {
      expect(typeof msgs).toBe('object');
      expect(msgs[0].type).toBe('init');
      expect(msgs[2].type).toBe('error');
      expect(msgs).toMatchSnapshot();
    });
  });
});
