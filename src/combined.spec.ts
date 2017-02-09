'use strict';

import 'jest';

import { Observable } from 'rxjs';
import './index';

describe('diff operator combined', () => {
    it.only('works togather', () => {
        let obs: Observable<number> = Observable.of(1, 2, 3, 4, 5);

        return obs.toDiff().fromDiff().bufferCount(6).toPromise().then((msgs) => {
            expect(typeof msgs).toBe('object');
            expect(msgs).toMatchSnapshot();
        });
    });
});
