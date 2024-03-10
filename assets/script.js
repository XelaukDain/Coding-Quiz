// Get DOM elements
var startContent = document.getElementById("start-content"); // Start content section
var gameContent = document.getElementById("quiz-content"); // Quiz content section
var endContent = document.getElementById("end-content"); // End content section
var scoreContent = document.getElementById("score-content"); // Score content section
var scoreElement = document.getElementById("final-score"); // Final score elements
var scores = document.getElementById("scores"); // High scores list

// Get buttons
var startGame = document.getElementById("start-button"); // Start game button
var restartGame = document.getElementById("restart-button"); // Restart game button
var submitScore = document.getElementById("save-name"); // Submit score button
var openScore = document.getElementById("score-button"); // Open score button
var clearButton = document.getElementById("clear-button"); // Clear high scores button

// Get timer elements
var timerElement = document.getElementById("timer"); // Timer element
var timeLeft = 60; // Initial time left
var timerInterval; // Timer interval

// Define correct answers
var correctAnswers = 0;

// Define questions list
var questionsList = [
  {
    question: "What is the document in html?", // Question
    options: ["index file", "css file", "javascript file", "none of the above"], // Answer options
    answer: "index file", // Correct answer
  },
  {
    question: "What does a for loop start with?",
    options: ["if", "then", "function", "for"],
    answer: "for",
  },
  {
    question: "What does an index start with?",
    options: ["link to style sheet", "footer", "body", "none of the above"],
    answer: "none of the above",
  },
  {
    question: "Where should the javascript file be linked in the index file?",
    options: ["head", "top of body", "bottom of body", "stylesheet file"],
    answer: "bottom of body",
  },
  {
    question: "How do you declare a variable in javascript?",
    options: ["let", "const", "var", "all of the above"],
    answer: "all of the above",
  },
];

// Function to start the timer
function startTimer() {
  timerInterval = setInterval(function () {
    timeLeft--;
    timerElement.textContent = "Time: " + timeLeft;

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      endGame(correctAnswers);
    }
  }, 1000);
}

// Function to shuffle an array
function shuffleArray(array) {
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

// Function to generate a question
function generateQuestion() {
  shuffleArray(questionsList);
  var question = questionsList[0];
  var questionElement = document.getElementById("question");
  var optionsElement = document.getElementById("options");
  questionElement.textContent = question.question;

  for (var i = 0; i < question.options.length; i++) {
    var option = question.options[i];

    var optionContainer = document.createElement("li");
    var optionButton = document.createElement("button");
    optionButton.textContent = option;
    optionButton.setAttribute(
      "class",
      "btn btn-primary custom-btn-purple mb-2"
    );
    optionButton.setAttribute("value", option);
    optionContainer.appendChild(optionButton);
    optionsElement.appendChild(optionContainer);

    optionButton.addEventListener("click", function (event) {
      var element = event.target;
      var answer = element.value;

      if (answer === question.answer) {
        correctAnswers++;
        console.log("Total correct: " + correctAnswers);
        questionsList.shift();
        optionsElement.innerHTML = "";
        if (questionsList.length > 0) {
          generateQuestion();
        } else {
          clearInterval(timerInterval);
          endGame(correctAnswers);
        }
      } else {
        timeLeft -= 10;
        if (timeLeft < 0) {
          timeLeft = 0;
        }
        timerElement.textContent = "Time: " + timeLeft;
      }
    });
  }
}

// Event listener for start game button
startGame.addEventListener("click", function () {
  // Open game content
  startContent.style.display = "none";
  gameContent.style.display = "block";
  // Start timer and generate question
  startTimer();
  generateQuestion();
});

// Event listener for open score button
openScore.addEventListener("click", function () {
  // Reset timer and open score content
  clearInterval(timerInterval);
  if (timeLeft <= 60) {
    timeLeft = 60;
    timerElement.textContent = "Time: " + timeLeft;
  }
  scoresPage();
  gameContent.style.display = "none";
  startContent.style.display = "none";
  endContent.style.display = "none";
  scoreContent.style.display = "block";
});

// Event listener for restart game button
restartGame.addEventListener("click", function () {
    location.reload();
  // Open start content
  gameContent.style.display = "none";
  endContent.style.display = "none";
  scoreContent.style.display = "none";
  startContent.style.display = "block";
});

// Function to end the game
function endGame(answers) {
  clearInterval(timerInterval);
  // Calculate final score
  console.log("Final correct: " + answers);
  var score = timeLeft + 10 * answers;
  var finalScore = score;

  // Display final score
  scoreElement.textContent = "Final Score: " + finalScore;
  gameContent.style.display = "none";
  endContent.style.display = "block";

  // Event listener for submit score button
  submitScore.addEventListener("submit", function (event) {
    event.preventDefault(); // Prevent default form submission behavior

    // Get user initials
    var initials = document.getElementById("save-name-content").value;
    if (initials === "") {
      alert("Initials cannot be blank");
      return;
    }

    // Get high scores from local storage
    var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
    var score = initials + " - " + finalScore;
    highScores.push(score);
    // Sort high scores
    highScores.sort(function (a, b) {
      return parseInt(b.split(" - ")[1]) - parseInt(a.split(" - ")[1]);
    });
    // Store high scores in local storage
    localStorage.setItem("highScores", JSON.stringify(highScores));
    console.log(highScores);
    // Open score content
    endContent.style.display = "none";
    scoresPage();
    scoreContent.style.display = "block";
  });
}

clearButton.addEventListener("click", function (event) {
  localStorage.clear();
  scores.innerHTML = "";
});

function scoresPage() {
  scores.innerHTML = "";
  // Get high scores from local storage
  var highScores = JSON.parse(localStorage.getItem("highScores")) || [];
  // Create list of high scores
  for (var i = 0; i < highScores.length; i++) {
    var score = highScores[i];
    var scoreItem = document.createElement("li");
    scoreItem.setAttribute("class", "list-group-item list-group-item-dark");
    scoreItem.textContent = score;
    scores.appendChild(scoreItem);
  }
}
