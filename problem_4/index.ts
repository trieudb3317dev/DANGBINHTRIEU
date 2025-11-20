{
  /**
    Provide 3 unique implementations of the following function in TypeScript.

    - Comment on the complexity or efficiency of each function.

    **Input**: `n` - any integer

    *Assuming this input will always produce a result lesser than `Number.MAX_SAFE_INTEGER`*.

    **Output**: `return` - summation to `n`, i.e. `sum_to_n(5) === 1 + 2 + 3 + 4 + 5 === 15`.
*/
}

// Implementation 1: Iterative approach
export function sumToNIterative(n: number): number {
  let sum = 0;
  for (let i = 1; i <= n; i++) {
    sum += i;
  }
  return sum;
}

// Complexity: O(n) time complexity due to the loop iterating n times, O(1) space complexity.

// Implementation 2: Recursive approach
export function sumToNRecursive(n: number): number {
  // Guard negative and zero inputs to avoid incorrect return values or infinite descent
  if (n <= 0) {
    return 0;
  }
  if (n === 1) {
    return 1;
  }
  return n + sumToNRecursive(n - 1);
}

// Complexity: O(n) time complexity due to the recursive calls, O(n) space complexity due to the call stack.  

// Implementation 3: Mathematical formula
export function sumToNFormula(n: number): number {
  if (n <= 0) {
    return 0;
  }
  return (n * (n + 1)) / 2;
}

// Complexity: O(1) time complexity due to the direct mathematical calculation, O(1) space complexity.

// Simple test runner printing pass/fail for each implementation
export function runTests(): void {
  const cases: Array<{ n: number; expected: number }> = [
    { n: 5, expected: 15 },
    { n: 1, expected: 1 },
    { n: 0, expected: 0 },
    { n: -3, expected: 0 }, // defined behaviour: for n <= 0 we return 0
    { n: 10, expected: 55 },
  ];

  const impls: Array<{ name: string; fn: (n: number) => number }> = [
    { name: 'Iterative', fn: sumToNIterative },
    { name: 'Recursive', fn: sumToNRecursive },
    { name: 'Formula', fn: sumToNFormula },
  ];

  for (const test of cases) {
    for (const impl of impls) {
      const result = impl.fn(test.n);
      const pass = result === test.expected;
      console.log(`${impl.name} n=${test.n} => ${result} ${pass ? '✓' : `✗ (expected ${test.expected})`}`);
    }
  }
}

// If you run this file directly (via ts-node or after compiling), call runTests.