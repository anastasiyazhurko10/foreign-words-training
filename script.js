const words = [
  {
    front: "achieve",
    back: "достигать",
    example: "She worked hard to achieve her goals."
  },
  {
    front: "comfortable",
    back: "удобный, комфортный",
    example: "This sofa is very comfortable to sit on."
  },
  {
    front: "decision",
    back: "решение",
    example: "It was a difficult decision to make."
  },
  {
    front: "experience",
    back: "опыт",
    example: "He has a lot of experience in marketing."
  },
  {
    front: "improve",
    back: "улучшать",
    example: "I want to improve my English skills."
  },
  {
    front: "journey",
    back: "путешествие, поездка",
    example: "The journey took more than five hours."
  },
  {
    front: "opportunity",
    back: "возможность",
    example: "This job is a great opportunity for me."
  },
  {
    front: "suggest",
    back: "предлагать",
    example: "Can you suggest a good restaurant nearby?"
  },
  {
    front: "responsible",
    back: "ответственный",
    example: "She is responsible for managing the team."
  },
  {
    front: "prepare",
    back: "готовиться, подготавливать",
    example: "He needs to prepare for the exam tomorrow."
  }
];

let currentIndex = 0;

const cardFront = document.getElementById("card-front").querySelector("h1");
const cardBack = document.getElementById("card-back").querySelector("h1");
const cardExample = document.getElementById("card-back").querySelector("span");

const currentWordSpan = document.getElementById("current-word");
const totalWordSpan = document.getElementById("total-word");
const wordProgress = document.getElementById("words-progress");

function showWord(index) {
    const word = words[index];
    cardFront.textContent = word.front;
    cardBack.textContent = word.back;
    cardExample.textContent = word.example;
}