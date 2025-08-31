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
let isLocked = false;
let matchedPairs = 0;
let attempts = [];
let isExamActive = false;

const cardFront = document.querySelector("#card-front h1");
const cardBack = document.querySelector("#card-back h1");
const cardExample = document.querySelector("#card-back span");
const currentWordSpan = document.getElementById("current-word");
const totalWordSpan = document.getElementById("total-word");
const wordProgress = document.getElementById("words-progress");
const backButton = document.getElementById("back");
const nextButton = document.getElementById("next");
const shuffleButton = document.getElementById("shuffle-words");
const flipCardElement = document.querySelector(".flip-card");
const examButton = document.getElementById("exam");
const examMode = document.getElementById("exam-mode");
const studyMode = document.getElementById("study-mode");
const studyCards = document.querySelector(".study-cards");
const examCardsContainer = document.getElementById("exam-cards");
const closeResultsButton = document.getElementById("close-results");

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
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

function createExamCard(value) {
  const div = document.createElement("div");
  div.classList.add("card", "face-down");
  div.textContent = value;
  return div;
}

function startMatchingTest() {
  isExamActive = true;
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
  
  examCardsData = shuffleWordsArray(examCardsData);
  
  examCardsContainer.innerHTML = "";
  
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < examCardsData.length; i++) {
    fragment.appendChild(examCardsData[i].element);
  }
  examCardsContainer.appendChild(fragment);
  
  setupMatchingLogic();
}

function handleCardClick(event) {
  if (isLocked || !isExamActive) return;
  
  const clickedCard = event.target;
  if (!clickedCard.classList.contains("card") || 
      clickedCard.classList.contains("fade-out")) {
    return;
  }
  
  clickedCard.classList.remove("face-down");
  
  if (firstCard === null) {
    firstCard = clickedCard;
    firstCard.classList.add("correct");
    return;
  }
  
  if (clickedCard === firstCard) return;
  
  secondCard = clickedCard;
  isLocked = true;
  
  let firstData = null;
  let secondData = null;
  
  for (let i = 0; i < examCardsData.length; i++) {
    if (examCardsData[i].element === firstCard) {
      firstData = examCardsData[i];
    }
    if (examCardsData[i].element === secondCard) {
      secondData = examCardsData[i];
    }
    if (firstData && secondData) break;
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
}

function setupMatchingLogic() {
  examCardsContainer.addEventListener("click", handleCardClick);
}

function resetSelection() {
  firstCard = null;
  secondCard = null;
  isLocked = false;
}

function checkCompletion() {
  if (matchedPairs === words.length) {
    isExamActive = false;
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
  
  const fragment = document.createDocumentFragment();
  for (let i = 0; i < words.length; i++) {
    const template = document.getElementById("word-stats");
    const clone = template.content.cloneNode(true);
    
    clone.querySelector(".word span").textContent = `${words[i].front} - ${words[i].back}`;
    clone.querySelector(".attempts span").textContent = attempts[i];
    
    fragment.appendChild(clone);
  }
  content.appendChild(fragment);
  
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
  examCardsContainer.innerHTML = "";
  isExamActive = false;
}

function initApp() {
  showWord(currentIndex);
  updateNavigationButtons();
  
  shuffleButton.addEventListener("click", () => {
    const shuffledWords = shuffleWordsArray(words);
    words.splice(0, words.length, ...shuffledWords);
    currentIndex = 0;
    showWord(currentIndex);
    updateNavigationButtons();
    flipCardElement.classList.remove("active");
  });
  
  flipCardElement.addEventListener("click", () => {
    flipCardElement.classList.toggle("active");
  });
  
  backButton.addEventListener("click", () => {
    if (currentIndex > 0) {
      currentIndex--;
      showWord(currentIndex);
      updateNavigationButtons();
      flipCardElement.classList.remove("active");
    }
  });
  
  nextButton.addEventListener("click", () => {
    if (currentIndex < words.length - 1) {
      currentIndex++;
      showWord(currentIndex);
      updateNavigationButtons();
      flipCardElement.classList.remove("active");
    }
  });
  
  examButton.addEventListener("click", () => {
    studyMode.classList.add("hidden");
    examMode.classList.remove("hidden");
    studyCards.classList.add("hidden");
    startMatchingTest();
  });
  
  closeResultsButton.addEventListener("click", closeResultsModal);
}

document.addEventListener('DOMContentLoaded', initApp);