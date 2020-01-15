# state-history

[![NPM](https://img.shields.io/npm/v/state-history.svg)](https://www.npmjs.com/package/state-history)

A basic state history manager.

## Install

`npm i state-history`

## Basic usage

```js
import { StateHistory } from 'state-history';
// or
const { StateHistory } = require('state-history');

// create history
const history = new StateHistory();

// push some states
history.push({ a: 1 });
history.push({ a: 2 });
history.push({ a: 3 }); // current history is { a: 3 }

history.goPrev(); // current history is now { a: 2 }
history.goNext(); // current history is now { a: 3 }
history.go(-2); // current history is now { a: 1 }

// listen to history changes
history.subscribe(newState => console.log(newState));
history.push({ a: 1 }); // triggers an history change
history.goPrev(); // also triggers an history change
```

## Properties

```ts
// number of past states in the history
// it should be checked to be greater than 0 before calling `goPrev`
numPrev: number;

// number of future states in the history
// it should be checked to be greater than 0 before calling `goNext`
numNext: number;
```

## Methods

```ts
// push a new entry onto the history stack
// and returns it
push(state: T): T;

// moves the pointer in the history stack to the previous entry
// and returns the new current state
// it is equivalent to `go(-1)`
goPrev(): T;

// moves the pointer in the history stack to the next entry
// and returns the new current state
// it is equivalent to `go(1)`
goNext(): T;

// moves the pointer in the history stack to the last entry
// and returns the new current state
// it is  equivalent to `go(numNext)`
goLast(): T;

// moves the pointer in the history stack by `i` entries
// a negative number will go to the `-i`th previous entry
// and a positive number will go to the `i`th next entry
go(i: number): T;

// get a specific entry from the history stack
// ie: `-1` for the previous entry, `1` for the next entry
get(i: number): T;

// register a callback function that will be called every time
// a new entry is added or when the pointer in the history stack is moved
subscribe(callback: (state: T) => void): void;

// unregister a callback function
unsubscribe(callback: (state: T) => void): void;

// unregister all callback functions
unsubscribeAll(): void;

// remove all entries from the state history
clear(): void
```
