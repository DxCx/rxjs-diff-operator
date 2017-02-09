# rxjs-diff-operator

[![Greenkeeper badge](https://badges.greenkeeper.io/DxCx/rxjs-diff-operator.svg)](https://greenkeeper.io/)
[![NPM version](https://img.shields.io/npm/v/rxjs-diff-operator.svg)](https://www.npmjs.com/package/rxjs-diff-operator)
[![Build Status](https://travis-ci.org/DxCx/rxjs-diff-operator.svg?branch=master)](https://travis-ci.org/DxCx/rxjs-diff-operator)
[![Coverage Status](https://coveralls.io/repos/github/DxCx/rxjs-diff-operator/badge.svg?branch=master)](https://coveralls.io/github/DxCx/rxjs-diff-operator?branch=master)
[![Standard Version](https://img.shields.io/badge/release-standard%20version-brightgreen.svg)](https://github.com/conventional-changelog/standard-version)

this package adds toDiff/fromDiff operators for [RxJs 5](https://github.com/ReactiveX/rxjs).
for more deep information about the operator and the protocol, please check [observable-diff-operator](https://www.github.com/DxCx/observable-diff-operator)

## Operators:
### toDiff
#### signature: `toDiff(): Observable<IObservableDiff>`
#### Description

toDiff operator is used to convert output of an obsersvable stream,
into a stream that contains diff information.
this operator is inteded to be used on the server.

##### Example

```typescript
//emit (1,2,3,4,5)
const source = Rx.Observable.from([1,2,3,4,5]);
//add 10 to each value
const example = source.toDiff();
//output: { type: "init", payload: 1, isObject: false }, { type: "update", payload: 2 }, ...
const subscribe = example.subscribe(val => console.log(val));
```

### fromDiff
##### signature: `fromDiff(): Observable<any>`
#### Description

fromDiff operator is used to convert output of an diff obsersvable stream (see toDiff above),
into a stream that contains diff information.
this operator is inteded to be used on the client.

##### Example

```typescript
//emit diff information
const source = Rx.Observable.from([{ type: "init", payload: 1, isObject: false }, { type: "update", payload: 2 }, { type: "complete" }]);
//add 10 to each value
const example = source.fromDiff();
//output: 1, 2
const subscribe = example.subscribe(val => console.log(val));
```

## Contributions

Contributions, issues and feature requests are very welcome. If you are using this package and fixed a bug for yourself, please consider submitting a PR!
