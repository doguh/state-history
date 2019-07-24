# state-history

A basic state history manager.

## Example

```js
// create history
const history = new StateHistory();

// push some states
history.push({ a: 1 });
history.push({ a: 2 });
history.push({ a: 3 }); // current history is { a: 3 }

history.goPrev(); // current history is now { a: 2 }
history.goNext(); // current history is now { a: 3 }
history.go(-2); // current history is now { a: 1 }

// create history emitter
const historyEmitter = new StateHistoryEmitter();

// listen to history changes
historyEmitter.subscribe(newState => console.log(newState));
historyEmitter.push({ a: 1 }); // triggers an history change
```

## TODO

- Write tests
- Write API doc
