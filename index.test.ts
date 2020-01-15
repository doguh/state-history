import * as chai from 'chai';
import { StateHistory } from './index';

const expect = chai.expect;

describe('StateHistory', () => {
  let h: StateHistory<number>;

  beforeEach(() => {
    h = new StateHistory<number>();
    h.push(0);
    h.push(1);
    h.push(2);
    h.push(3);
  });

  it('should push new state and return it', () => {
    expect(h.push(4)).to.equal(4);
  });

  it('should push a few states and return the current state', () => {
    expect(h.get(0)).to.equal(3);
  });

  it('should go back to previous state', () => {
    h.goPrev();
    expect(h.get(0)).to.equal(2);
  });

  it('should go back twice and forward once', () => {
    h.goPrev();
    h.goPrev();
    h.goNext();
    expect(h.get(0)).to.equal(2);
  });

  it('should count past states', () => {
    expect(h.numPrev).to.equals(3);
    h.goPrev();
    expect(h.numPrev).to.equals(2);
  });

  it('should count future states', () => {
    expect(h.numNext).to.equals(0);
    h.goPrev();
    expect(h.numNext).to.equals(1);
  });

  it('should go to the desired state', () => {
    expect(h.go(-2)).to.equals(1);
    expect(h.go(1)).to.equals(2);
    expect(h.go(0)).to.equals(2);
  });

  it('should return the desired state', () => {
    h.goPrev();
    expect(h.get(-1)).to.equals(1);
    expect(h.get(0)).to.equals(2);
    expect(h.get(1)).to.equals(3);
  });

  it('should erase next entries after go back and push', () => {
    h.goPrev();
    h.goPrev();
    h.push(5);
    expect(h.numNext).to.equals(0);
    expect(h.numPrev).to.equals(2);
    expect(h.get(0)).to.equals(5);
  });

  it('should go to the last entry', () => {
    h.go(-2);
    expect(h.goLast()).to.equals(3);
  });

  it('should remove oldest entries', () => {
    h.maxLength = 3;
    h.push(4);
    h.push(5);
    expect(h.numPrev).to.equals(3);
    expect(h.get(-3)).to.equal(2);
  });

  it('should clear history', () => {
    expect(h.numPrev).to.equal(3);
    h.clear();
    expect(h.numPrev).to.equal(0);
    expect(h.numNext).to.equal(0);
    expect(h.get(0)).to.equal(undefined);
  });
});

describe('StateHistory subcriber', () => {
  let h: StateHistory<number>;

  beforeEach(() => {
    h = new StateHistory<number>();
  });

  afterEach(() => {
    h.unsubscribeAll();
  });

  it('should be notified of new current state', () => {
    h.subscribe(state => {
      expect(state).to.equal(1);
    });
    h.push(1);
  });

  it('should be notified after a go back', () => {
    h.push(1);
    h.push(2);
    h.push(3);
    h.subscribe(state => {
      expect(state).to.equal(2);
    });
    h.goPrev();
  });

  it('should unsubscribe', () => {
    let numCalls: number = 0;
    const listener = () => {
      numCalls++;
    };
    h.subscribe(listener);
    h.push(1);
    h.push(2);
    h.unsubscribe(listener);
    h.push(3);
    h.push(4);
    expect(numCalls).to.equal(2);
  });

  it('should unsubscribe all', () => {
    let numCalls1: number = 0;
    let numCalls2: number = 0;
    const listener1 = () => {
      numCalls1++;
    };
    const listener2 = () => {
      numCalls2++;
    };
    h.subscribe(listener1);
    h.subscribe(listener2);
    h.push(1);
    h.push(2);
    h.unsubscribeAll();
    h.push(3);
    h.push(4);
    expect(numCalls1).to.equal(2);
    expect(numCalls2).to.equal(2);
  });

  it('should do nothing', () => {
    h.unsubscribe(() => {});
  });
});

describe('StateHistory with initial maxLength', () => {
  let h: StateHistory<number>;

  beforeEach(() => {
    h = new StateHistory<number>(3);
  });

  it('should have the correct max length', () => {
    expect(h.maxLength).to.equal(3);
  });

  it('should remove oldest entries', () => {
    h.push(1);
    h.push(2);
    h.push(3);
    h.push(4);
    h.push(5);
    expect(h.numPrev).to.equal(3);
    expect(h.get(-3)).to.equal(2);
  });
});
