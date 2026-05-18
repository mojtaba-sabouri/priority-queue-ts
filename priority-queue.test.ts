import { describe, it, expect, beforeEach } from 'vitest';
import { PriorityQueue } from './priority-queue';

// ─── Min-Heap ───────────────────────────────────────────────────────────────

describe('PriorityQueue — min-heap', () => {
  let pq: PriorityQueue<number>;

  beforeEach(() => {
    pq = new PriorityQueue<number>((a, b) => a - b);
  });

  it('dequeues elements in ascending order', () => {
    pq.enqueue(5);
    pq.enqueue(1);
    pq.enqueue(3);
    pq.enqueue(2);
    pq.enqueue(4);

    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBe(2);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(4);
    expect(pq.dequeue()).toBe(5);
  });

  it('peek returns the top element without removing it', () => {
    pq.enqueue(3);
    pq.enqueue(1);
    pq.enqueue(2);

    expect(pq.peek()).toBe(1);
    expect(pq.size).toBe(3);
    expect(pq.peek()).toBe(1);
  });

  it('size updates correctly after enqueue and dequeue', () => {
    expect(pq.size).toBe(0);
    pq.enqueue(1);
    pq.enqueue(2);
    expect(pq.size).toBe(2);
    pq.dequeue();
    expect(pq.size).toBe(1);
  });

  it('isEmpty returns true on empty queue and false otherwise', () => {
    expect(pq.isEmpty()).toBe(true);
    pq.enqueue(1);
    expect(pq.isEmpty()).toBe(false);
    pq.dequeue();
    expect(pq.isEmpty()).toBe(true);
  });

  it('clear empties the queue', () => {
    pq.enqueue(1);
    pq.enqueue(2);
    pq.clear();
    expect(pq.size).toBe(0);
    expect(pq.isEmpty()).toBe(true);
  });
});

// ─── Max-Heap ───────────────────────────────────────────────────────────────

describe('PriorityQueue — max-heap', () => {
  it('dequeues elements in descending order', () => {
    const pq = new PriorityQueue<number>((a, b) => b - a);
    [3, 1, 4, 1, 5, 9, 2, 6].forEach(n => pq.enqueue(n));

    expect(pq.dequeue()).toBe(9);
    expect(pq.dequeue()).toBe(6);
    expect(pq.dequeue()).toBe(5);
    expect(pq.dequeue()).toBe(4);
  });
});

// ─── Edge Cases ─────────────────────────────────────────────────────────────

describe('PriorityQueue — edge cases', () => {
  it('returns undefined when dequeuing an empty queue', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    expect(pq.dequeue()).toBeUndefined();
  });

  it('returns undefined when peeking an empty queue', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    expect(pq.peek()).toBeUndefined();
  });

  it('handles a single element correctly', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.enqueue(42);

    expect(pq.peek()).toBe(42);
    expect(pq.size).toBe(1);
    expect(pq.dequeue()).toBe(42);
    expect(pq.isEmpty()).toBe(true);
  });

  it('handles duplicate values correctly', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    pq.enqueue(3);
    pq.enqueue(3);
    pq.enqueue(3);

    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(3);
    expect(pq.isEmpty()).toBe(true);
  });
});

// ─── Objects ────────────────────────────────────────────────────────────────

describe('PriorityQueue — objects with custom comparator', () => {
  interface Task {
    name: string;
    urgency: number;
  }

  it('dequeues tasks by highest urgency first', () => {
    const pq = new PriorityQueue<Task>((a, b) => b.urgency - a.urgency);

    pq.enqueue({ name: 'Update docs',  urgency: 1  });
    pq.enqueue({ name: 'Fix crash',    urgency: 10 });
    pq.enqueue({ name: 'Send email',   urgency: 3  });

    expect(pq.dequeue()?.name).toBe('Fix crash');
    expect(pq.dequeue()?.name).toBe('Send email');
    expect(pq.dequeue()?.name).toBe('Update docs');
  });
});

// ─── fromArray ──────────────────────────────────────────────────────────────

describe('PriorityQueue.fromArray', () => {
  it('builds a valid min-heap from an array', () => {
    const pq = PriorityQueue.fromArray([5, 3, 8, 1, 4], (a, b) => a - b);

    expect(pq.size).toBe(5);
    expect(pq.dequeue()).toBe(1);
    expect(pq.dequeue()).toBe(3);
    expect(pq.dequeue()).toBe(4);
    expect(pq.dequeue()).toBe(5);
    expect(pq.dequeue()).toBe(8);
  });

  it('does not mutate the original array', () => {
    const original = [3, 1, 2];
    PriorityQueue.fromArray(original, (a, b) => a - b);
    expect(original).toEqual([3, 1, 2]);
  });

  it('handles an empty array', () => {
    const pq = PriorityQueue.fromArray([], (a, b) => a - b);
    expect(pq.isEmpty()).toBe(true);
    expect(pq.dequeue()).toBeUndefined();
  });

  it('handles a single element array', () => {
    const pq = PriorityQueue.fromArray([42], (a, b) => a - b);
    expect(pq.dequeue()).toBe(42);
    expect(pq.isEmpty()).toBe(true);
  });
});

// ─── Stress Test ────────────────────────────────────────────────────────────

describe('PriorityQueue — stress test', () => {
  it('correctly orders 1000 random elements', () => {
    const pq = new PriorityQueue<number>((a, b) => a - b);
    const input = Array.from({ length: 1000 }, () =>
      Math.floor(Math.random() * 10000)
    );

    input.forEach(n => pq.enqueue(n));

    const output: number[] = [];
    while (!pq.isEmpty()) {
      output.push(pq.dequeue()!);
    }

    for (let i = 1; i < output.length; i++) {
      expect(output[i]).toBeGreaterThanOrEqual(output[i - 1]);
    }
  });
});
