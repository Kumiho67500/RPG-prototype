export function ennemyAttack(){
function ennemyAttack() {
        const isCritical = Math.random() < 0.1;
        const baseDamage = Math.floor(Math.random() * 20) + 5;

        }
          let damage;

          if (result === "perfect") {
            damage = 0;
            showMessage("Esquive parfaite !", "lime");
          } else if (result === "good") {
            damage = Math.floor(baseDamage / 2);
            showMessage("Bonne esquive !", "orange");
          } else {
            damage = isCritical ? baseDamage * 2 : baseDamage;
            showMessage(isCritical ? "Coup critique ennemi !" : "Touché !", "red");
          }
        }