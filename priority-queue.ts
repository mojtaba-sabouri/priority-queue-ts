export type Comparator<T> = (a: T, b: T) => number;

export class PriorityQueue<T> {
  private heap: T[] = [];
  private comparator: Comparator<T>;

  constructor(comparator: Comparator<T>) {
    this.comparator = comparator;
  }

  public get size(): number {
    return this.heap.length;
  }

  public isEmpty(): boolean {
    return this.heap.length === 0;
  }

  public peek(): T | undefined {
    return this.heap[0];
  }

  public clear(): void {
    this.heap = [];
  }

  public enqueue(element: T): void {
    this.heap.push(element);
    this.siftUp();
  }

  public dequeue(): T | undefined {
    if (this.isEmpty()) return undefined;

    const root = this.heap[0];
    const last = this.heap.pop()!;

    if (!this.isEmpty()) {
      this.heap[0] = last;
      this.siftDown(0);
    }

    return root;
  }

  public static fromArray<U>(
    elements: U[],
    comparator: Comparator<U>
  ): PriorityQueue<U> {
    const pq = new PriorityQueue<U>(comparator);
    pq.heap = [...elements];
    const lastNonLeaf = Math.floor((pq.heap.length - 2) / 2);
    for (let i = lastNonLeaf; i >= 0; i--) {
      pq.siftDown(i);
    }
    return pq;
  }

  private siftUp(): void {
    let current = this.heap.length - 1;
    while (current > 0) {
      const parent = this.getParentIndex(current);
      if (this.comparator(this.heap[parent], this.heap[current]) <= 0) break;
      this.swap(current, parent);
      current = parent;
    }
  }

  private siftDown(start: number): void {
    let current = start;
    const length = this.heap.length;
    while (true) {
      const left  = this.getLeftChildIndex(current);
      const right = this.getRightChildIndex(current);
      let highest = current;
      if (left  < length && this.comparator(this.heap[left],  this.heap[highest]) < 0) highest = left;
      if (right < length && this.comparator(this.heap[right], this.heap[highest]) < 0) highest = right;
      if (highest === current) break;
      this.swap(current, highest);
      current = highest;
    }
  }

  private getParentIndex(i: number): number {
    return Math.floor((i - 1) / 2);
  }

  private getLeftChildIndex(i: number): number {
    return 2 * i + 1;
  }

  private getRightChildIndex(i: number): number {
    return 2 * i + 2;
  }

  private swap(i: number, j: number): void {
    [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]];
  }
}
