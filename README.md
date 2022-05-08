# Assessment description:

Create a grid of 50x50. When you click on a cell, all values in the cells in the same row and column are increased  by 1. If a cell is empty, it will get a value of 1. After each change a cell will briefly turn yellow. If 5 consecutive numbers in the Fibonacci sequence are next to each other, these cells will briefly turn green and will be cleared. Use the programming language of your choice.

# My assumptions:

- Any sequence where f(n + 2) = f(n) + f(n + 1) is considered a Fibonacci sequence.
- If there are six consecutive fibonacci numbers (0, 1, 1, 2, 3, 5), they are considered two separate five numbers long sequences (0, 1, 1, 2, 3) and (1, 1, 2, 3, 5). All the six numbers will be removed.
- No recursion is used: if clearing the fibonacci sequence would lead to creation of another one, this wouldn't be removed. I assume we read left to right and top to bottom - that means 3, 2, 1, 1, 0 is not considered a fibonacci sequence.

# Install dependencies

`npm i`

# Run in dev mode

`npm run dev`

# Tune settings

Edit `src/config.ts`.

# Run tests

`npm run test`

# Alternative solution

Checkout to `feat/one-dimensional-array` branch.
