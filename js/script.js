/*
 *  A list that holds all of the cards
 */
const deck = [

  "fa-diamond", "fa-anchor", "fa-paper-plane-o", "fa-cube", "fa-bolt", "fa-leaf", "fa-bicycle", "fa-bomb",
  "fa-diamond", "fa-anchor", "fa-paper-plane-o", "fa-cube", "fa-bolt", "fa-leaf", "fa-bicycle", "fa-bomb"
]

//Constants and variables required for the game
const modal = document.querySelector('.modal');
const deckHTML = document.querySelector('.deck');
const timerDisplay = document.querySelector('.timer');
let moves = 0;
let openCards = [];
let pairs = [];
let star_rating=3;

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

function display() {
  shufledDeck1 = shuffle(deck);
  let id = 1;

  for (card of deck) {
    const cardHTML = `<li id = ${id} class="card">
         <i class="fa ${card}"></i>
     </li>`;
    deckHTML.insertAdjacentHTML('beforeend', cardHTML);
    id++;
  }
}

//function for timer
function start_timer() {

  let startTime = new Date().getTime();

  timer = setInterval(function() {
    let now = new Date().getTime();

    let elapsed = now - startTime;

    let minutes = Math.floor((elapsed % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((elapsed % (1000 * 60)) / 1000);

    if (seconds < 10) {
      seconds = "0" + seconds;
    }

    let currentTime = minutes + ":" + seconds;

    timerDisplay.innerHTML = currentTime;
  }, 750);



}

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length,
    temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }

  return array;
}


//checks if card is matched

function checkCard(evt) {
  const card = evt.classList[1];
  const id = evt.parentNode.id;
  let obj = {
    "card": card,
    "id": id
  }

  if (pairs.indexOf(id) === -1) {

    if (!openCards[0])
      openCards.push(obj);

    else if (openCards[0] && openCards[0].card === card && openCards[0].id != id) {
      evt.parentNode.classList.toggle('match');
      document.getElementById(openCards[0].id).classList.toggle('match');
      pairs.push(id);
      pairs.push(openCards[0].id);
      openCards.pop();

    } else {

      setTimeout(function() {
        let matched = document.querySelectorAll('.open');
        for (let m of matched) {
          m.classList.remove('open', 'show');
        }
      }, 500);

      openCards.pop();
    }
    checkMoves(true);

    checkWinCondition();
  }

}

//checking for winning condition
function checkWinCondition() {
  if (pairs.length === 16) {
    showModal();
    clearInterval(timer); //need to clear "timer" interval created in the beginning of the game
    let final_time = document.querySelector('.timer').innerHTML;
    document.querySelector('#final_time').innerHTML = final_time;
    document.querySelector('#final_moves').innerHTML = moves;
    document.querySelector('#star_rating').innerHTML =` And ${star_rating} stars`;

  }
}

function showModal() {
  modal.classList.remove('hide');
  modal.classList.add('.display');
}

function hideModal() {
  modal.classList.add('hide');
  modal.classList.remove('.display');
}

function flip(id1, id2) {
  document.getElementById(id2).classList.toggle('open');
  document.getElementById(id1).classList.toggle('open');
}


function cardClicked(event) {

  if (event.target.nodeName === 'LI') {
    event.target.classList.toggle('open');
    checkCard(event.target.firstElementChild);
  }

  if (event.target.nodeName === 'I') {
    event.target.parentNode.classList.toggle('open');
    checkCard(event.target);
  }
}

function checkMoves(isMoved) {
  if (isMoved)
    moves++;
  else
    moves = 0;
  document.querySelector('.moves').innerHTML = moves;
  checkStars();

}

//checking for number of stars to display
function checkStars() {
  let stars = document.getElementsByClassName('star');

  if (moves < 33) {
    stars[0].classList.add('level');
    stars[1].classList.add('level');
    stars[2].classList.add('level');
  }

  if (moves > 32 && moves < 49) {
    stars[2].classList.remove('level');
    star_rating=2;
  } else if (moves > 48 && moves < 65) {
    stars[1].classList.remove('level');
    star_rating=1;
  }
}

//resets the game
function restartGame(event) {
  checkMoves(false);
  openCards = [];
  pairs = [];
  deckHTML.innerHTML = "";
  display();
  reset_timer();
  start_timer();
  hideModal();
}

//adding event listeners
function startListening() {
  const cardElement = document.querySelector('.deck');
  cardElement.addEventListener('click', cardClicked);

  const restart = document.querySelector('.restart');
  restart.addEventListener('click', restartGame);

  const restart_after_win = document.querySelector('.restart_button');
  restart_after_win.addEventListener('click', restartGame);
}

function reset_timer() {
  clearInterval(timer);
  timerDisplay.innerHTML = "0:00";
}

display();
startListening();
start_timer();
