# priority-queue-ts

A lightweight, generic, type-safe **Priority Queue** implementation in TypeScript — built on a binary heap.

No dependencies. Fully tested. O(log n) enqueue and dequeue.

---

## Installation

```bash
npm install priority-queue-ts
```

---

## Quick Start

```typescript
import { PriorityQueue } from 'priority-queue-ts';

// Min-heap — smallest number has highest priority
const pq = new PriorityQueue<number>((a, b) => a - b);

pq.enqueue(5);
pq.enqueue(1);
pq.enqueue(3);

pq.peek();    // → 1  (doesn't remove)
pq.dequeue(); // → 1  (removes and returns)
pq.size;      // → 2
```

---

## The Comparator

The queue's behaviour is entirely driven by the comparator function you pass in.
This is the same convention as `Array.prototype.sort()`.

| Comparator returns | Meaning |
|---|---|
| Negative | `a` has higher priority than `b` |
| Zero | Equal priority |
| Positive | `b` has higher priority than `a` |

```typescript
// Min-heap (smallest = highest priority)
new PriorityQueue<number>((a, b) => a - b);

// Max-heap (largest = highest priority)
new PriorityQueue<number>((a, b) => b - a);

// Objects — highest urgency first
new PriorityQueue<Task>((a, b) => b.urgency - a.urgency);
```

---

## API

### `new PriorityQueue<T>(comparator)`
Creates a new empty priority queue.

### `.enqueue(element)` — O(log n)
Adds an element to the queue.

### `.dequeue()` — O(log n)
Removes and returns the highest-priority element. Returns `undefined` if empty.

### `.peek()` — O(1)
Returns the highest-priority element without removing it. Returns `undefined` if empty.

### `.size` — O(1)
Returns the number of elements in the queue.

### `.isEmpty()` — O(1)
Returns `true` if the queue has no elements.

### `.clear()`
Removes all elements from the queue.

### `PriorityQueue.fromArray(elements, comparator)` — O(n)
Builds a priority queue from an existing array using the heapify algorithm.
Does **not** mutate the original array.

```typescript
const pq = PriorityQueue.fromArray([5, 3, 8, 1, 4], (a, b) => a - b);
pq.dequeue(); // → 1
```

---

## Examples

### Task Scheduler

```typescript
interface Task {
  name: string;
  urgency: number;
}

const queue = new PriorityQueue<Task>((a, b) => b.urgency - a.urgency);

queue.enqueue({ name: 'Update docs',  urgency: 1  });
queue.enqueue({ name: 'Fix crash',    urgency: 10 });
queue.enqueue({ name: 'Send email',   urgency: 3  });

queue.dequeue(); // → { name: 'Fix crash', urgency: 10 }
```

### Dijkstra's Algorithm

```typescript
// [distance, nodeId]
const frontier = new PriorityQueue<[number, string]>((a, b) => a[0] - b[0]);
frontier.enqueue([0, 'start']);

while (!frontier.isEmpty()) {
  const [dist, node] = frontier.dequeue()!;
  // process node...
}
```

---

## Complexity

| Operation    | Time     |
|---|---|
| enqueue      | O(log n) |
| dequeue      | O(log n) |
| peek         | O(1)     |
| size/isEmpty | O(1)     |
| fromArray    | O(n)     |

---

## How It Works

This implementation uses a **binary heap** stored as a flat array.
The tree structure is navigated purely with index arithmetic — no node objects or pointers.

If you want to understand the full implementation — including the mathematical
proof of the index formulas — I wrote a 3-part series explaining everything from scratch:

- [Part 1 — What is a Queue, and Why Does Priority Matter?](https://medium.com/@sabouri.dev/what-is-a-queue-and-why-does-priority-matter-69936d3c7b9c)
- [Part 2 — Heaps Explained: The Math Behind Priority Queues](https://medium.com/@sabouri.dev/heaps-explained-the-math-behind-priority-queues-d43c6746f0d6)
- [Part 3 — Building a Priority Queue from Scratch in TypeScript](https://medium.com/@sabouri.dev/building-a-priority-queue-from-scratch-in-typescript-f2b7ae866bfa)

---

## License

MIT
