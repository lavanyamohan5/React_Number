import React, { useState, useEffect, useCallback, useMemo } from 'react';
import './App.css';

function NumberGame() {
  const [total, setTotal] = useState(0);
  const [currentPlayer, setCurrentPlayer] = useState(1); // 1 = User, 2 = System
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [userMoves, setUserMoves] = useState([]);
  const [systemMoves, setSystemMoves] = useState([]);

  const winningSequences = useMemo(
    () => [
      [1, 2, 3, 4, 5],
      [2, 3, 4, 5, 6],
      [3, 4, 5, 6, 7],
      [4, 5, 6, 7, 8],
      [5, 6, 7, 8, 9],
      [6, 7, 8, 9, 10],
    ],
    []
  );

  const handlePlayerMove = (number) => {
    if (gameOver || currentPlayer !== 1) return;

    const newTotal = total + number;
    const newUserMoves = [...userMoves, number];

    setUserMoves(newUserMoves);
    setTotal(newTotal);

    if (checkForWinningSequence(newUserMoves)) {
      setGameOver(true);
      setWinner('User');
      return;
    }

    if (newTotal >= 100) {
      setGameOver(true);
      setWinner('User');
      return;
    }

    setCurrentPlayer(2);
  };

  const checkForWinningSequence = useCallback(
    (moves) => {
      return winningSequences.some((sequence) =>
        sequence.every((num) => moves.includes(num))
      );
    },
    [winningSequences]
  );

  const chooseSystemMove = useCallback(
    (userMoves, systemMoves, availableNumbers) => {
      for (const seq of winningSequences) {
        if (seq.some((num) => userMoves.includes(num) && !userMoves.includes(num))) {
          const nextNumber = seq.find((num) => !userMoves.includes(num));
          if (availableNumbers.includes(nextNumber)) return nextNumber;
        }
      }
      return availableNumbers.find((num) => !systemMoves.includes(num)) || 1;
    },
    [winningSequences]
  );

  const systemMove = useCallback(() => {
    if (gameOver || currentPlayer !== 2) return;

    const availableNumbers = Array.from({ length: 10 }, (_, i) => i + 1);
    const systemChoice = chooseSystemMove(userMoves, systemMoves, availableNumbers);
    const newTotal = total + systemChoice;
    const newSystemMoves = [...systemMoves, systemChoice];

    setSystemMoves(newSystemMoves);
    setTotal(newTotal);

    if (checkForWinningSequence(newSystemMoves)) {
      setGameOver(true);
      setWinner('System');
      return;
    }

    if (newTotal >= 100) {
      setGameOver(true);
      setWinner('System');
      return;
    }

    setCurrentPlayer(1);
  }, [gameOver, total, userMoves, systemMoves, chooseSystemMove, checkForWinningSequence, currentPlayer]);

  useEffect(() => {
    if (currentPlayer === 2 && !gameOver) {
      setTimeout(systemMove, 1000);
    }
  }, [currentPlayer, gameOver, systemMove]);

  return (
    <div className="game-container">
      <h1>🎲 Number Game 🎮</h1>
      <p>Total: <strong>{total}</strong> 🔢</p>
      <p>It's {currentPlayer === 1 ? '👤 User' : '🤖 System'}'s turn</p>

      <div className="number-buttons">
        {[...Array(10)].map((_, index) => (
          <button
            key={index + 1}
            onClick={() => handlePlayerMove(index + 1)}
            disabled={gameOver || currentPlayer !== 1}
          >
            {index + 1}️⃣
          </button>
        ))}
      </div>

      {gameOver && (
        <div className="result">
          {winner === 'User' ? (
            <>
              <h2>🎉 Congratulations! You followed the sequence and won the game! 🏆</h2>
              <div className="winning-sticker">🏆 🎉</div>
            </>
          ) : (
            <>
              <h2>😢 Sorry! The system won the game! 🤖</h2>
              <div className="losing-sticker">😢 ❌</div>
            </>
          )}
          <button onClick={() => window.location.reload()}>🔄 Play Again</button>
        </div>
      )}
    </div>
  );
}

export default NumberGame;
