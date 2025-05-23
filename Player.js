export function playerAttack(){
window.playerAttack = () => {
        if (!isPlayerTurn || playerHP <= 0 || enemyHP <= 0) return;
        isPlayerTurn = false;
        updateArrow();

        startQTE((result) => {
          setTimeout(() => {
            const dmg = result === "perfect" ? 40 : result === "good" ? 30 : 20;
            enemyHP -= dmg;
            console.log(enemy.material.diffuseColor)
            enemy.material.diffuseColor = result === "perfect" ? BABYLON.Color3.Yellow() : BABYLON.Color3.Red();
            setTimeout(() => enemy.material.diffuseColor = BABYLON.Color3.White(), 300);

            if (result !== "fail") showMessage("Coup critique !", "gold");

            if (enemyHP <= 0) {
              resultText.innerHTML = "Vous avez gagné !";
              resultText.style.display = 'block';
            } else {
              enemyAttack();
            }
          }, 100);
        });
      };

      window.healPlayer = () => {
        if (!isPlayerTurn || playerHP <= 0) return;
        isPlayerTurn = false;
        updateArrow();
        setTimeout(() => {
          playerHP = Math.min(100, playerHP + 15);
          player.material.diffuseColor = BABYLON.Color3.Green();
          setTimeout(() => player.material.diffuseColor = BABYLON.Color3.White(), 300);
          updateHP();
          enemyAttack();
        }, 100);
      };
    }