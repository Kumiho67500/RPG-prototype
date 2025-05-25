export function playerAttack({ 
  isPlayerTurn, 
  setIsPlayerTurn, 
  enemyHP, 
  setEnemyHP, 
  enemy, 
  startQTE, 
  showMessage, 
  resultText, 
  updateArrow 
}) {
  if (!isPlayerTurn || enemyHP <= 0) return;

  setIsPlayerTurn(false);
  updateArrow();

  startQTE((result) => {
    setTimeout(() => {
      const dmg = result === "perfect" ? 40 : result === "good" ? 30 : 20;
      const newEnemyHP = Math.max(0, enemyHP - dmg);
      setEnemyHP(newEnemyHP);

      enemy.material.diffuseColor = result === "perfect" ? BABYLON.Color3.Yellow() : BABYLON.Color3.Red();
      setTimeout(() => enemy.material.diffuseColor = BABYLON.Color3.White(), 300);

      if (result !== "fail") showMessage("Coup critique !", "gold");

      if (newEnemyHP <= 0) {
        resultText.innerHTML = "Vous avez gagné !";
        resultText.style.display = 'block';
      }
    }, 100);
  });
}

export function healPlayer({ 
  isPlayerTurn, 
  setIsPlayerTurn, 
  playerHP, 
  setPlayerHP, 
  player, 
  updateHP, 
  updateArrow 
}) {
  if (!isPlayerTurn || playerHP <= 0) return;

  setIsPlayerTurn(false);
  updateArrow();

  setTimeout(() => {
    const newHP = Math.min(100, playerHP + 15);
    setPlayerHP(newHP);
    player.material.diffuseColor = BABYLON.Color3.Green();
    setTimeout(() => player.material.diffuseColor = BABYLON.Color3.White(), 300);
    updateHP();
  }, 100);
}
