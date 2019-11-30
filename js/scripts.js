(function() {
  "use strict";

  // Create a list that holds all of your cards
  var cards = [
    "fa-dog",
    "fa-dog",
    "fa-frog",
    "fa-frog",
    "fa-hippo",
    "fa-hippo",
    "fa-dove",
    "fa-dove",
    "fa-pizza-slice",
    "fa-pizza-slice",
    "fa-hotdog",
    "fa-hotdog",
    "fa-ice-cream",
    "fa-ice-cream",
    "fa-candy-cane",
    "fa-candy-cane"
  ];

  //   Shows How to Play box

  window.onload = function() {
    document.querySelector(".btn").onclick = function() {
      document.querySelector(".box").style.display = "block";
    };
    document.querySelector(".exit-btn").onclick = function() {
      document.querySelector(".box").style.display = "none";
    };
  };

  //   Deck of Cards

  function generateCard(card) {
    return `<li class="card" data-card="${card}"> <i class="fa ${card}"> </i></li>`;
  }

  // Shuffle function from http://stackoverflow.com/a/2450976
  function shuffle(array) {
    var currentIndex = array.length,
      temporaryValue,
      randomIndex;
    while (currentIndex !== 0) {
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
    return array;
  }

  // Timer Variables
  var time = 0;
  var increment;
  var minutes = 0;
  var seconds = 0;
  var minutesContainer = document.querySelector(".minutes");
  var secondsContainer = document.querySelector(".seconds");

  // start timer
  function startTimer() {
    // Constantly increments
    increment = setInterval(function() {
      // Add by 1
      time += 1;

      // Converts time to M:S format
      calculateTime(time);

      // Change the values in containers
      minutesContainer.innerHTML = minutes;
      secondsContainer.innerHTML = seconds;
    }, 1000);
  }

  // Convert given time to M:S format
  function calculateTime(time) {
    minutes = Math.floor((time / 60) % 60);
    seconds = time % 60;
  }

  // stop time
  function stopTimer() {
    time = 0;
    clearInterval(increment);
  }

  // Star Rating variables
  var stars = document.querySelectorAll(".fa-star");
  var starsList = document.querySelectorAll(".stars li");

  // Function to calculate score and display a fixed amount of stars
  function calculateScore() {
    // If the total amount of moves is less than 20, 3 stars
    if (moves < 15) {
      console.log("3 star");
      for (var i = 0; i < stars.length; i++) {
        stars[i].style.color = "#2e3d49";
      }
    } else if (moves > 15 && moves < 22) {
      // If the total amount of moves is more than 20 but less than 30, 2 stars
      console.log("2 star");
      for (i = 0; i < 3; i++) {
        if (i > 1) {
          stars[i].style.color = "#dff6f0";
        }
      }
    } else if (moves > 25) {
      // If the total amount of moves is more than 40, 1 star
      console.log("1 star");
      for (i = 0; i < 3; i++) {
        if (i > 0) {
          stars[i].style.color = "#dff6f0";
        }
      }
    }
  }

  // Amount of User's moves
  var moves = 0;
  var moveCounter = document.querySelector(".moves");

  // Initialize the game
  function startGame() {
    clicked = false;
    var deck = document.querySelector(".deck");
    var cardHTML = shuffle(cards).map(function(card) {
      return generateCard(card);
    });

    // Set number of moves to 0
    moves = 0;
    moveCounter.innerText = moves;

    // Create game board
    deck.innerHTML = cardHTML.join("");

    // Stop timer if running, set timer to 0
    stopTimer();
    minutes = 0;
    seconds = 0;
    minutesContainer.innerHTML = minutes;
    secondsContainer.innerHTML = seconds;

    // Reset stars
    calculateScore();
  }

  // Begin Game
  startGame();

  // Holds all cards
  var allCards = document.querySelectorAll(".card");
  addListenerToCard(allCards);

  // Stores cards that are opened
  var openCards = [];

  // Counter to keep track of matched pairs
  var matchedPairs = 0;

  // Get the modal
  var modal = document.getElementById("WinnerBox");

  // Get the <span> element that closes the modal
  var span = document.getElementsByClassName("close")[0];

  // Modal variables
  var finalMoves = document.querySelector(".finalMoves");
  var finalMinutes = document.querySelector(".finalMinutes");
  var finalSeconds = document.querySelector(".finalSeconds");
  var finalRating = document.querySelector(".finalRating");
  var clicked = false;

  // Displays modal
  function displayModal() {
    finalMoves.innerText = moves + 1;
    finalRating.innerHTML = document.querySelector(".stars").innerHTML;
    finalMinutes.innerText = minutes;
    finalSeconds.innerText = seconds;
    modal.style.display = "block";
  }

  // Closes out modal
  span.onclick = function() {
    modal.style.display = "none";
  };

  // Function that resets game if button is pressed
  var restart = document.querySelector(".restart");

  restart.onclick = function() {
    // Initialize Game
    initializeGame();
  };

  var restartButton = document.getElementById("restartButton");
  // Closes out modal, restarts game
  restartButton.onclick = function() {
    modal.style.display = "none";
    initializeGame();
  };

  function initializeGame() {
    startGame();
    allCards = document.querySelectorAll(".card");
    addListenerToCard(allCards);
    openCards = [];
    matchedPairs = 0;
  }

  // Adds a listener to each individual card
  function addListenerToCard(allCards) {
    allCards.forEach(function(card) {
      card.addEventListener("click", function(e) {
        if (clicked) {
          cleanBoard();
          return;
        }
        // If the card is not already matched or showing
        if (
          !card.classList.contains("open") &&
          !card.classList.contains("show") &&
          !card.classList.contains("match")
        ) {
          // Store the current card in array as it is opened
          openCards.push(card);
          // Card flips and displays as opened
          card.classList.add("open", "show");
          // When you have two open cards...

          if (openCards.length == 2) {
            clicked = true;
            // If cards match, add the needed classes to the card and clear the array
            if (openCards[0].dataset.card == openCards[1].dataset.card) {
              openCards[0].classList.add("match");
              openCards[0].classList.add("open");
              openCards[0].classList.add("show");
              openCards[1].classList.add("match");
              openCards[1].classList.add("open");
              openCards[1].classList.add("show");
              openCards = [];

              // Take note of matched pair
              matchedPairs += 1;
              console.log(matchedPairs);

              // Check if total of matched pairs is eight
              if (matchedPairs == 8) {
                // Stop the timer
                stopTimer();

                // Display winning prompt
                displayModal();
              }
              clicked = false;
            } else {
              // If cards do not match, hide cards and clear the array
              setTimeout(function() {
                cleanBoard();
              }, 1000);
            }

            // For every turn, meaning two cards opened, increment the move count
            moves += 1;
            moveCounter.innerText = moves;

            // When the user makes the first move, begin the timer
            if (moves == 1) {
              startTimer();
            }

            // Calculate the star rating after each move
            calculateScore();
          }
        }
      });
    });

    function cleanBoard() {
      clicked = false;
      openCards.forEach(function(card) {
        card.classList.remove("open", "show");
      });
      openCards = [];
    }
  }
})();
