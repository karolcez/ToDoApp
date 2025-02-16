import React from 'react';
import './style/main.css'
import ToDoApp from './ToDoApp.tsx';

// (1)  algorithmic task

// Write a function that receives two sequences: A and B of integers and returns one sequence C. 
// Sequence C should contain all elements from sequence A (maintaining the order) except those, 
// that are present in sequence B p times, where p is a prime number.

// Example:
function isPrimeNumber(number) {
  if (number < 2) {
    return false; 
  }
  const sqrt = Math.sqrt(number);
  for (let index = 2; index <= sqrt; index++) {
    if (number % index === 0) {
      return false; 
    }
  }
  return true; 
}

function filterPrimeOccurrences(arrayA, arrayB) {
  const occurrences = new Map();
  const primeCache = new Set();

  for (const num of arrayB) {
    occurrences.set(num, (occurrences.get(num) || 0) + 1);
  }

  return arrayA.filter(num => {
    const count = occurrences.get(num) || 0;

    if (count > 1 && !primeCache.has(count) && isPrimeNumber(count)) {
      primeCache.add(count);
    }

    return !primeCache.has(count);
  });
}

// Example Usage
const A = [2, 3, 9, 2, 5, 1, 3, 7, 10];
const B = [2, 1, 3, 4, 3, 10, 6, 6, 1, 7, 10, 10, 10];

const C = filterPrimeOccurrences(A, B);
console.log(C); // Expected output: [2, 9, 2, 5, 7, 10]

// Notes: 

// 1. The time complexity is important – try to write an algorithm with good time complexity and specify it in your answer. 
// 2. You can choose any reasonable type present in your chosen language to represent the sequence. 
// 3. Make sure the function signature is correct. 
// 4. Write your own code to test primality. 

function App() {
  return (
    <div className="App">
      <ToDoApp></ToDoApp>
    </div>
  );
}

export default App;
