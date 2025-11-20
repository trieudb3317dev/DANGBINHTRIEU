# Sum to N — README

This project contains three implementations of a function that returns the summation from 1 to n:
- Iterative
- Recursive
- Mathematical formula

Files:
- index.ts — TypeScript implementations and a small test runner (runTests()).

Prerequisites
- Node.js (includes npm)
- Optionally install TypeScript tools: tsc and ts-node

Quick steps

1) Run TypeScript directly (no compile step)
- Install ts-node (one-time):
  npm install -D ts-node typescript @types/node
- Run:
  npx ts-node d:\work\freelances\DANGBINHTRIEU\problem_4\index.ts
- Or run the test runner by importing and calling runTests() in a small script.

2) Compile to JavaScript with tsc, then run with node
- Initialize TypeScript config (optional but recommended):
  npx tsc --init
- Compile a single file:
  npx tsc d:\work\freelances\DANGBINHTRIEU\problem_4\index.ts --outDir d:\work\freelances\DANGBINHTRIEU\problem_4\dist
  (or simply `npx tsc` if you used --init and configured "outDir")
- Run the compiled file:
  node d:\work\freelances\DANGBINHTRIEU\problem_4\dist\index.js

3) Add helpful npm scripts (optional)
- In package.json:
  {
    "scripts": {
      "build": "tsc",
      "start": "node dist/index.js",
      "dev": "ts-node index.ts"
    }
  }
- Then use:
  npm run build
  npm start
  npm run dev

Test cases included
- The TypeScript file contains a runTests() function that checks:
  - n = 5 -> 15
  - n = 1 -> 1
  - n = 0 -> 0
  - n = -3 -> 0 (this implementation chooses to return 0 for n <= 0)
  - n = 10 -> 55

Expected sample output when running runTests() (order may vary):

Iterative n=5 => 15 ✓
Recursive n=5 => 15 ✓
Formula n=5 => 15 ✓
Iterative n=1 => 1 ✓
Recursive n=1 => 1 ✓
Formula n=1 => 1 ✓
Iterative n=0 => 0 ✓
Recursive n=0 => 0 ✓
Formula n=0 => 0 ✓
Iterative n=-3 => 0 ✓
Recursive n=-3 => 0 ✓
Formula n=-3 => 0 ✓
Iterative n=10 => 55 ✓
Recursive n=10 => 55 ✓
Formula n=10 => 55 ✓

Notes
- The recursive implementation uses a guard to return 0 for n <= 0 to avoid incorrect results or uncontrolled recursion.
- The formula implementation also returns 0 for n <= 0.
- If you prefer a different behavior for negative n (e.g., sum from n to 1 or arithmetic progression with negatives), adjust the functions accordingly.