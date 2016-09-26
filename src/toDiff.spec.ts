'use strict';

import 'jest';
require('babel-core/register');
require('babel-polyfill');

import { Observable } from 'rxjs';
import './toDiff';

describe('toDiff operator', () => {
    it('Should be pass sanity', () => {
        expect(typeof (<any>Observable.prototype).toDiff).toBe('function');
    });

    it('emits basic changes', () => {
        let obs: Observable<number> = Observable.of(1, 2, 3, 4, 5);

        return obs.toDiff().bufferCount(6).toPromise().then(msgs => {
            expect(typeof msgs).toBe('object');
            expect(msgs[0].type).toBe('init');
            expect(msgs[5].type).toBe('complete');
            expect(msgs).toMatchSnapshot();
        });
    });

    it('emits object changes', () => {
        let obs: Observable<{ value: number }> = Observable.of(1, 2, 3, 4, 5).map((v) => ({ value: v}));

        return obs.toDiff().bufferCount(6).toPromise().then(msgs => {
            expect(typeof msgs).toBe('object');
            expect(msgs[0].type).toBe('init');
            expect(msgs[5].type).toBe('complete');
            expect(msgs).toMatchSnapshot();
        });
    });
});
