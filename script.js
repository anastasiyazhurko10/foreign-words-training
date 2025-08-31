'use strict';

const words = [
  {
    front: "achieve",
    back: "достигать",
    example: "She worked hard to achieve her goals."
  },
  {
    front: "comfortable",
    back: "удобный",
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
    back: "путешествие",
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
    back: "готовиться",
    example: "He needs to prepare for the exam tomorrow."
  }
];

let currentIndex = 0;
let timerInterval = null;
let startTime = 0;
let examCardsData = [];
let firstCard = null;
let secondCard = null;
let lock = false;
let matchedPairs = 0;
let attempts = [];
let examActive = false;

const cardFront = document.querySelector("#card-front h1");
const cardBack = document.querySelector("#card-back h1");
const cardExample = document.querySelector("#card-back span");
const currentWordSpan = document.getElementById("current-word");
const totalWordSpan = document.getElementById("total-word");
const wordProgress = document.getElementById("words-progress");
const backButton = document.getElementById("back");
const nextButton = document.getElementById("next");
const shuffleWords = document.getElementById("shuffle-words");
const flipCard = document.querySelector(".flip-card");
const examButton = document.getElementById("exam");
const examMode = document.getElementById("exam-mode");
const studyMode = document.getElementById("study-mode");
const studyCards = document.querySelector(".study-cards");
const examCards = document.getElementById("exam-cards");
const closeResults = document.getElementById("close-results");

function showWord(index) {
  const word = words[index];
  cardFront.textContent = word.front;
  cardBack.textContent = word.back;
  cardExample.textContent = word.example;
  currentWordSpan.textContent = index + 1;
  totalWordSpan.textContent = words.length;
  wordProgress.value = ((index + 1) / words.length) * 100;
}

function updateNavigationButtons() {
  backButton.disabled = currentIndex === 0;
  nextButton.disabled = currentIndex === words.length - 1;
}

function shuffleWordsArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
  return array;
}

function createExamCard(value) {
  const div = document.createElement("div");
  div.classList.add("card", "face-down");
  div.textContent = value;
  return div;
}

function startMatchingTest() {
  examActive = true;
  resetTimer();
  startTimer();
  
  examCardsData = [];
  matchedPairs = 0;
  attempts = Array(words.length).fill(0);
  
  for (let i = 0; i < words.length; i++) {
    examCardsData.push({
      element: createExamCard(words[i].front),
      type: "word",
      index: i,
      value: words[i].front
    });
    
    examCardsData.push({
      element: createExamCard(words[i].back),
      type: "translation",
      index: i,
      value: words[i].back
    });
  }
  
  shuffleWordsArray(examCardsData);
  
  examCards.innerHTML = "";
  for (let i = 0; i < examCardsData.length; i++) {
    examCards.appendChild(examCardsData[i].element);
  }
  
  setupMatchingLogic();
}

function setupMatchingLogic() {
  examCards.addEventListener("click", function(e) {
    if (lock || !examActive) return;
    
    const clicked = e.target;
    if (!clicked.classList.contains("card") || 
        clicked.classList.contains("fade-out")) {
      return;
    }
    
    clicked.classList.remove("face-down");
    
    if (!firstCard) {
      firstCard = clicked;
      firstCard.classList.add("correct");
      return;
    }
    
    if (clicked === firstCard) return;
    
    secondCard = clicked;
    lock = true;
    
    let firstData = null;
    let secondData = null;
    
    for (let i = 0; i < examCardsData.length; i++) {
      if (examCardsData[i].element === firstCard) {
        firstData = examCardsData[i];
      }
      if (examCardsData[i].element === secondCard) {
        secondData = examCardsData[i];
      }
    }
    
    if (firstData && secondData && 
        firstData.index === secondData.index && 
        firstData.type !== secondData.type) {
    
      attempts[firstData.index]++;
      matchedPairs++;
      
      updateExamProgress();
      
      setTimeout(() => {
        firstCard.classList.add("fade-out");
        secondCard.classList.add("fade-out");
        resetSelection();
        checkCompletion();
      }, 500);
    } else {
      
      if (firstData) attempts[firstData.index]++;
      secondCard.classList.add("wrong");
      
      setTimeout(() => {
        
        firstCard.classList.remove("correct");
        firstCard.classList.add("face-down");
        
        secondCard.classList.remove("wrong");
        secondCard.classList.add("face-down");
        
        resetSelection();
      }, 1000);
    }
  });
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  lock = false;
}

function checkCompletion() {
  if (matchedPairs === words.length) {
    examActive = false;
    stopTimer();
    setTimeout(() => {
      showResults();
    }, 500);
  }
}

function updateExamProgress() {
  const percent = (matchedPairs / words.length) * 100;
  document.getElementById("correct-percent").textContent = `${Math.round(percent)}%`;
  document.getElementById("exam-progress").value = percent;
}

function startTimer() {
  startTime = Date.now();
  timerInterval = setInterval(updateTimer, 1000);
}

function updateTimer() {
  const elapsedTime = Date.now() - startTime;
  const seconds = Math.floor(elapsedTime / 1000);
  const minutes = Math.floor(seconds / 60);
  
  const displaySeconds = seconds % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${displaySeconds.toString().padStart(2, '0')}`;
  
  document.getElementById("time").textContent = timeString;
}

function stopTimer() {
  clearInterval(timerInterval);
}

function resetTimer() {
  stopTimer();
  document.getElementById("time").textContent = "00:00";
  document.getElementById("correct-percent").textContent = "0%";
  document.getElementById("exam-progress").value = 0;
}

function showResults() {
  const modal = document.querySelector(".results-modal");
  const content = document.querySelector(".results-content");
  const timeElement = document.getElementById("timer");
  
  timeElement.textContent = document.getElementById("time").textContent;
  
  content.innerHTML = "";
  
  for (let i = 0; i < words.length; i++) {
    const template = document.getElementById("word-stats");
    const clone = template.content.cloneNode(true);
    
    clone.querySelector(".word span").textContent = `${words[i].front} - ${words[i].back}`;
    clone.querySelector(".attempts span").textContent = attempts[i];
    
    content.appendChild(clone);
  }
  
  const overlay = document.createElement("div");
  overlay.classList.add("overlay");
  document.body.appendChild(overlay);
  
  modal.classList.remove("hidden");
}

function closeResultsModal() {
  const modal = document.querySelector(".results-modal");
  const overlay = document.querySelector(".overlay");
  
  modal.classList.add("hidden");
  if (overlay) {
    overlay.remove();
  }
  
  studyMode.classList.remove("hidden");
  examMode.classList.add("hidden");
  studyCards.classList.remove("hidden");
  examCards.innerHTML = "";
  examActive = false;
}

function initApp() {
  showWord(currentIndex);
  updateNavigationButtons();
  
  shuffleWords.addEventListener("click", () => {
    shuffleWordsArray(words);
    currentIndex = 0;
    showWord(currentIndex);
    updateNavigationButtons();
    flipCard.classList.remove("active");
  });
  
  flipCard.addEventListener("click", () => {
    flipCard.classList.toggle("active");
  });
  
  backButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showWord(currentIndex);
      updateNavigationButtons();
      flipCard.classList.remove("active");
    }
  });
  
  nextButton.addEventListener("click", () => {
    if (currentIndex < words.length - 1) {
      currentIndex++;
      showWord(currentIndex);
      updateNavigationButtons();
      flipCard.classList.remove("active");
    }
  });
  
  examButton.addEventListener("click", () => {
    studyMode.classList.add("hidden");
    examMode.classList.remove("hidden");
    studyCards.classList.add("hidden");
    startMatchingTest();
  });
  
  closeResults.addEventListener("click", closeResultsModal);
}

document.addEventListener('DOMContentLoaded', initApp);