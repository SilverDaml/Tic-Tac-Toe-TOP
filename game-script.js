const gameBoard = (() => {
  const board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => board;

  const markSpot = (index, mark) => {
    if (board[index] === "") {
      board[index] = mark;
      return true;
    }
    return false;
  };

  const checkWin = () => {
    const winningCombos = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];

    for (const combo of winningCombos) {
      const [a, b, c] = combo;
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }

    if (board.every(mark => mark !== "")) return "tie";

    return null;
  };

  const resetBoard = () => {
    for (let i = 0; i < board.length; i++) {
      board[i] = "";
    }
  };

  return { getBoard, markSpot, checkWin, resetBoard };
})();

const displayController = (() => {
  const gameBoardElement = document.getElementById("game-board");
  const statusElement = document.getElementById("status");
  const restartButton = document.getElementById("restart-btn");
  const backToMainButton = document.getElementById("back-to-main-btn");

  const renderBoard = () => {
    gameBoardElement.innerHTML = "";
    gameBoard.getBoard().forEach((mark, index) => {
      const square = document.createElement("div");
      square.classList.add("square");
      if (mark === "X") {
        square.classList.add("X"); // Add class for X
      } else if (mark === "O") {
        square.classList.add("O"); // Add class for O
      }
      square.textContent = mark;
      square.addEventListener("click", () => {
        if (!mark && !gameController.isGameOver()) {
          const currentPlayer = gameController.getCurrentPlayer();
          if (gameBoard.markSpot(index, currentPlayer.getMark())) {
            renderBoard();
            const winner = gameBoard.checkWin();
            if (winner) {
              gameController.endGame(winner);
              renderStatus();
            } else if (winner === "tie") {
              gameController.endGame("tie");
              renderStatus();
            } else {
              gameController.switchPlayer();
              renderStatus();
            }
          }
        }
      });
      gameBoardElement.appendChild(square);
    });
  };

  const renderStatus = () => {
    const winner = gameController.getWinner();
    if (winner === "tie") {
      statusElement.textContent = "It's a tie!";
    } else if (winner) {
      statusElement.textContent = `${winner.getName()} wins!`;
    } else {
      statusElement.textContent = `Current Player: ${gameController.getCurrentPlayer().getName()}`;
    }
  };

  restartButton.addEventListener("click", () => {
    gameController.restartGame();
  });

  backToMainButton.addEventListener("click", () => {
    window.location.href = 'index.html';
  });

  return { renderBoard, renderStatus };
})();

const Player = (name, mark) => {
  const getName = () => name;
  const getMark = () => mark;
  return { getName, getMark };
};

const gameController = (() => {
  let players = [];
  let currentPlayerIndex = 0;
  let winner = null;
  let gameOver = false;

  const addPlayer = (name, mark) => {
    players.push(Player(name, mark));
  };

  const getCurrentPlayer = () => players[currentPlayerIndex];

  const switchPlayer = () => {
    currentPlayerIndex = currentPlayerIndex === 0 ? 1 : 0;
  };

  const isGameOver = () => gameOver;

  const endGame = (result) => {
    gameOver = true;
    if (result === "tie") {
      winner = "tie";
    } else {
      winner = getCurrentPlayer();
    }
  };

  const getWinner = () => winner;

  const restartGame = () => {
    gameBoard.resetBoard();
    gameOver = false;
    winner = null;
    currentPlayerIndex = 0;
    displayController.renderBoard();
    displayController.renderStatus();
  };

  const checkTie = () => {
    if (gameBoard.getBoard().every(mark => mark !== "") && !winner) {
      endGame("tie");
      return true;
    }
    return false;
  };

  return { addPlayer, getCurrentPlayer, switchPlayer, isGameOver, endGame, getWinner, restartGame, checkTie };
})();

// Game initialization
gameController.addPlayer("Player 1", "X");
gameController.addPlayer("Player 2", "O");
displayController.renderBoard();
displayController.renderStatus();

