'use strict';

import 'jest';
import { Observable } from 'rxjs';
import './index';
import { IObservableDiff } from './interfaces';

describe('fromDiff operator', () => {
  it('Should be pass sanity', () => {
    expect(typeof (<any> Observable.prototype).fromDiff).toBe('function');
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

    return obs.fromDiff().bufferCount(6).toPromise().then((msgs) => {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
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
    }, {
      'type': 'complete',
    });

    return obs.fromDiff().bufferCount(6).toPromise().then((msgs) => {
      expect(typeof msgs).toBe('object');
      expect(Array.isArray(msgs)).toBe(true);
      expect(msgs).toMatchSnapshot();
    });
  });

  it('throws when get error', () => {
    let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': 'init',
    }, {
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
    }, {
      'payload': 'testing errors',
      'type': 'error',
    });

    return obs.fromDiff().toPromise().then((msgs) => {
      throw new Error('shouldn\'t get here because of the promise');
    }, (e: Error) => {
      expect(() => { throw e; }).toThrow('testing errors');
    });
  });

  it('throws when missing init message', () => {
    let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
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
    }, {
      'payload': 'testing errors',
      'type': 'error',
    });

    return obs.fromDiff().toPromise().then((msgs) => {
      throw new Error('shouldn\'t get here because of the promise');
    }, (e: Error) => {
      expect(() => { throw e; }).toThrow('Init message was not emitted');
    });
  });

  it('throws when init message repeated', () => {
    let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': 'init',
    }, {
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
    }, {
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': 'init',
    }, {
      'payload': 'testing errors',
      'type': 'error',
    });

    return obs.fromDiff().toPromise().then((msgs) => {
      throw new Error('shouldn\'t get here because of the promise');
    }, (e: Error) => {
      expect(() => { throw e; }).toThrow('Init message emitted while in sequance');
    });
  });

  it('throws when no type provided', () => {
    let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': 'init',
    }, {
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': undefined,
    });

    return obs.fromDiff().toPromise().then((msgs) => {
      throw new Error('shouldn\'t get here because of the promise');
    }, (e: Error) => {
      expect(() => { throw e; }).toThrow('unexpected message');
    });
  });

  it('throws when no type malformed', () => {
    let obs: Observable<IObservableDiff> = Observable.of<IObservableDiff>({
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': 'init',
    }, {
      'isObject': true,
      'payload': {
        'value': 1,
      },
      'type': 'something',
    });

    return obs.fromDiff().toPromise().then((msgs) => {
      throw new Error('shouldn\'t get here because of the promise');
    }, (e: Error) => {
      expect(() => { throw e; }).toThrow('unexpected message');
    });
  });

  it('throws when input is malformed', () => {
    let obs: Observable<any> = Observable.of<any>(123);

    return obs.fromDiff().toPromise().then((msgs) => {
      throw new Error('shouldn\'t get here because of the promise');
    }, (e: Error) => {
      expect(() => { throw e; }).toThrow('Init message was not emitted.');
    });
  });
});
