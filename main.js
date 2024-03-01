document.getElementById('human-btn').addEventListener('click', () => {
    localStorage.setItem('gameMode', 'human');
    window.location.href = 'game.html';
  });
  
  document.getElementById('ai-btn').addEventListener('click', () => {
    localStorage.setItem('gameMode', 'ai');
    window.location.href = 'game.html';
  });