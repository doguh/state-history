# state-history

[![NPM](https://img.shields.io/npm/v/state-history.svg)](https://www.npmjs.com/package/state-history)

A basic state history manager.

## Install

`npm i state-history`

## Example

```js
import StateHistory from 'state-history';
// or
const StateHistory = require('state-history');

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

## TODO

- Write tests
- Write API doc
