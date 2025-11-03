// 🎬 PERFECT DEMO CODE for YC Agent Jam 2025
// This inefficient Fibonacci implementation will showcase amazing AI optimizations!

function fibonacci(n) {
    if (n <= 1) return n;
    return fibonacci(n - 1) + fibonacci(n - 2);
}

function calculateFibonacci(num) {
    let result = [];
    for (let i = 0; i < num; i++) {
        result.push(fibonacci(i));
    }
    return result;
}

function findFibonacciSum(count) {
    let sum = 0;
    for (let i = 0; i < count; i++) {
        sum += fibonacci(i);
    }
    return sum;
}

// Usage example:
// calculateFibonacci(30) - This will be VERY slow!
// The AI will optimize this with memoization, iteration, DP, etc.