export interface IStateHistory<T> {
  /**
   * number of past states in the history
   */
  numPrev: number;
  /**
   * number of future states in the history
   */
  numNext: number;
  /**
   * push a new entry onto the history stack
   * @param state the new entry to push
   * @returns {T} the new current state
   */
  push(state: T): T;
  /**
   * moves the pointer in the history stack to the previous entry
   *
   * equivalent to `go(-1)`
   *
   * @returns {T} the new current state
   */
  goPrev(): T;
  /**
   * moves the pointer in the history stack to the next entry
   *
   * equivalent to `go(1)`
   *
   * @returns {T} the new current state
   */
  goNext(): T;
  /**
   * moves the pointer in the history stack to the last entry
   *
   * equivalent to `go(numNext)`
   *
   * @returns {T} the new current state
   */
  goLast(): T;
  /**
   * moves the pointer in the history stack by `i` entries
   * @param i
   * a negative number will go to the `-i`th previous entry
   * and a positive number will go to the `i`th next entry
   */
  go(i: number): T;
  /**
   * get a specific entry from the history stack
   *
   * ie:
   * `-1` for the previous entry, `1` for the next entry
   *
   * @param i
   * a negative number will get the `-i`th previous entry
   * and a positive number will get the `i`th next entry
   * @returns {T} the new current state
   */
  get(i: number): T;
  /**
   * register a callback function that will be called every time
   * a new entry is added or when the pointer in the history stack is moved
   */
  subscribe: (callback: StateHistorySubscriber<T>) => void;
  /**
   * unregister a callback function
   */
  unsubscribe: (callback: StateHistorySubscriber<T>) => void;
  /**
   * unregister all callback functions
   */
  unsubscribeAll: () => void;
}

type StateHistorySubscriber<T> = (state: T) => void;

export default class StateHistory<T> implements IStateHistory<T> {
  public maxLength: number;

  private past: T[] = [];
  private present: T = null;
  private future: T[] = [];
  private subscribers: StateHistorySubscriber<T>[] = [];

  constructor(maxLength: number = 50) {
    this.maxLength = maxLength;
  }

  get numPrev(): number {
    return this.past.length;
  }

  get numNext(): number {
    return this.future.length;
  }

  push(state: T): T {
    if (this.present) this.past.push(this.present);
    this.present = state;
    if (this.future.length) this.future = [];
    if (this.past.length > this.maxLength) {
      this.past.splice(0, this.past.length - this.maxLength);
    }
    this.emit(this.present);
    return this.present;
  }

  goPrev(): T {
    // could do go(-1) but this is faster
    const newPresent = this.past.pop();
    this.future.splice(0, 0, this.present);
    this.present = newPresent;
    this.emit(this.present);
    return this.present;
  }

  goNext(): T {
    const newPresent = this.future.shift();
    this.past.push(this.present);
    this.present = newPresent;
    this.emit(this.present);
    return this.present;
  }

  goLast(): T {
    const newPresent = this.future.pop();
    this.past.push(...this.future);
    this.present = newPresent;
    this.emit(this.present);
    return this.present;
  }

  go(i: number): T {
    if (i === 0) {
      return this.present;
    }
    if (i > 0) {
      const newPresent = this.future.splice(i - 1, 1)[0];
      this.past = [...this.past, this.present, ...this.future.splice(0, i - 1)];
      this.present = newPresent;
      this.emit(this.present);
      return this.present;
    } else {
      const start = this.past.length + i;
      const newPresent = this.past.splice(start, 1)[0];
      this.future = [
        ...this.past.splice(start, this.past.length - start),
        this.present,
        ...this.future,
      ];
      this.present = newPresent;
      this.emit(this.present);
      return this.present;
    }
  }

  get(i: number): T {
    if (i === 0) {
      return this.present;
    }
    if (i > 0) {
      return this.future[i - 1];
    } else {
      return this.past[this.past.length + i];
    }
  }

  subscribe(callback: StateHistorySubscriber<T>): void {
    this.subscribers.push(callback);
  }

  unsubscribe(callback: StateHistorySubscriber<T>): void {
    const index: number = this.subscribers.indexOf(callback);
    if (~index) {
      this.subscribers.splice(index, 1);
    }
  }

  unsubscribeAll(): void {
    this.subscribers.length = 0;
  }

  private emit(state: T): void {
    this.subscribers.forEach(callback => callback(state));
  }
}
