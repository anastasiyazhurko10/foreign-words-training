const words = [
  { foreign: "apple", translation: "яблоко", example: "I eat an apple every day." },
  { foreign: "book", translation: "книга", example: "She is reading a book." },
  { foreign: "sun", translation: "солнце", example: "The sun is shining." },
  { foreign: "water", translation: "вода", example: "Drink more water." },
  { foreign: "friend", translation: "друг", example: "He is my best friend." }
];

const flipCard = document.querySelector(".flip-card"); 
const cardFront = document.querySelector("#card-front h1"); 
const cardBack = document.querySelector("#card-back h1");   
const cardExample = document.querySelector("#card-back span"); 

const currentWordSpan = document.getElementById("current-word");
const totalWordSpan = document.getElementById("total-word");
const progressBar = document.getElementById("words-progress");

const btnBack = document.getElementById("back");
const btnNext = document.getElementById("next");
const btnExam = document.getElementById("exam");

let currentIndex = 0;
