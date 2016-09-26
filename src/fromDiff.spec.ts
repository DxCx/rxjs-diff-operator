'use strict';

import 'jest';
require('babel-core/register');
require('babel-polyfill');

import { Observable } from 'rxjs';
import { IObservableDiff } from './interfaces';
import './fromDiff';

describe('fromDiff operator', () => {
    it('Should be pass sanity', () => {
        expect(typeof (<any>Observable.prototype).fromDiff).toBe('function');
    });

    it('emits basic changes', () => {
        let obs: Observable<IObservableDiff> = Observable.of({
            "isObject": false,
            "payload": {
                "p": 1
            },
            "type": "init"
        }, {
            "isObject": false,
            "payload": [
                {
                    "kind": "E",
                    "lhs": 1,
                    "path": [
                        "p"
                    ],
                    "rhs": 2
                }
            ],
            "type": "update"
        }, {
            "isObject": false,
            "payload": [
                {
                    "kind": "E",
                    "lhs": 2,
                    "path": [
                        "p"
                    ],
                    "rhs": 3
                }
            ],
            "type": "update"
        }, {
            "isObject": false,
            "payload": [
                {
                    "kind": "E",
                    "lhs": 3,
                    "path": [
                        "p"
                    ],
                    "rhs": 4
                }
            ],
            "type": "update"
        }, {
            "isObject": false,
            "payload": [
                {
                    "kind": "E",
                    "lhs": 4,
                    "path": [
                        "p"
                    ],
                    "rhs": 5
                }
            ],
            "type": "update"
        }, {
            "type": "complete"
        });

        return obs.fromDiff().bufferCount(6).toPromise().then(msgs => {
            expect(typeof msgs).toBe('object');
            expect(Array.isArray(msgs)).toBe(true);
            expect(msgs).toMatchSnapshot();
        });
    });
});
