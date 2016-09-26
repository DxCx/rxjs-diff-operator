'use strict';

import 'jest';
require('babel-core/register');
require('babel-polyfill');

import { Observable } from 'rxjs';
import { IObservableDiff } from './interfaces';
import './index';

describe('fromDiff operator', () => {
    it('Should be pass sanity', () => {
        expect(typeof (<any>Observable.prototype).fromDiff).toBe('function');
    });

    it('emits basic changes', () => {
        let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
            'isObject': false,
            'payload': 1,
            'type': 'init',
        }, {
            'payload': 2,
            'type': 'update',
        }, {
            'payload': 3,
            'type': 'update',
        }, {
            'payload': 4,
            'type': 'update',
        }, {
            'payload': 5,
            'type': 'update',
        }, {
            'type': 'complete',
        });

        return obs.fromDiff().bufferCount(6).toPromise().then(msgs => {
            expect(typeof msgs).toBe('object');
            expect(Array.isArray(msgs)).toBe(true);
            expect(msgs).toMatchSnapshot();
        });
    });

    it('emits objects changes', () => {
        let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
            'isObject': true,
            'payload': {
                'value': 1,
            },
            'type': 'init',
        },
        {
            'payload': [
                {
                    'kind': 'E',
                    'lhs': 1,
                    'path': [
                        'value',
                    ],
                    'rhs': 2,
                },
            ],
            'type': 'update',
        },
        {
            'payload': [
                {
                    'kind': 'E',
                    'lhs': 2,
                    'path': [
                        'value',
                    ],
                    'rhs': 3,
                },
            ],
            'type': 'update',
        },
        {
            'payload': [
                {
                    'kind': 'E',
                    'lhs': 3,
                    'path': [
                        'value',
                    ],
                    'rhs': 4,
                },
            ],
            'type': 'update',
        },
        {
            'payload': [
                {
                    'kind': 'E',
                    'lhs': 4,
                    'path': [
                        'value',
                    ],
                    'rhs': 5,
                },
            ],
            'type': 'update',
        },
        {
            'type': 'complete',
        });

        return obs.fromDiff().bufferCount(6).toPromise().then(msgs => {
            expect(typeof msgs).toBe('object');
            expect(Array.isArray(msgs)).toBe(true);
            expect(msgs).toMatchSnapshot();
        });
    });
});
