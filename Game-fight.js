import { ennemyAttack } from "./Ennemy.js";
import { playerAttack, healPlayer } from "./Player.js";

const canvas = document.getElementById("renderCanvas");
const engine = new BABYLON.Engine(canvas, true);

const createScene = function () {
  const scene = new BABYLON.Scene(engine);
  scene.clearColor = new BABYLON.Color3(0.5, 0.8, 1);

  const camera = new BABYLON.ArcRotateCamera("camera", Math.PI/2, Math.PI/3, 20, BABYLON.Vector3.Zero(), scene);
  camera.attachControl(canvas, true);

  const light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(1, 1, 0), scene);
  BABYLON.MeshBuilder.CreateGround("ground", {width: 50, height: 50}, scene);

  const player = BABYLON.MeshBuilder.CreateBox("player", {size: 2}, scene);
  player.position.y = 1;
  const enemy = BABYLON.MeshBuilder.CreateSphere("enemy", {diameter: 2.5}, scene);
  enemy.position = new BABYLON.Vector3(5, 1.25, 0);

  const arrow = BABYLON.MeshBuilder.CreateCylinder("arrow", {diameterTop: 0, diameterBottom: 0.5, height: 1}, scene);
  arrow.rotation.x = Math.PI;
  arrow.material = new BABYLON.StandardMaterial("arrowMat", scene);
  arrow.material.diffuseColor = BABYLON.Color3.Yellow();

  const hpText = document.getElementById("hpText");
  const resultText = document.getElementById("result");

  let playerHP = 100;
  let enemyHP = 100;
  let isPlayerTurn = true;

  function setEnemyHP(val) { enemyHP = val; }
  function setIsPlayerTurn(val) { isPlayerTurn = val; }

  const updateArrow = () => {
    const target = isPlayerTurn ? player : enemy;
    arrow.position = target.position.clone();
    arrow.position.y += 2.5;
  };

  const updateHP = () => hpText.innerText = `PV Joueur: ${Math.max(playerHP, 0)}`;

  function showMessage(msg, color) {
    const div = document.createElement("div");
    div.innerText = msg;
    Object.assign(div.style, {
      position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
      fontSize: "32px", color, fontFamily: "sans-serif"
    });
    document.body.appendChild(div);
    setTimeout(() => div.remove(), 1000);
  }

function startQTE(callback) {
  const container = document.getElementById("qteContainer");
  const bar = document.getElementById("qteBar");
  container.style.display = "block";
  bar.style.left = "0px";

  const duration = 750;
  let animationId;
  let finished = false;

  function animate() {
    const now = performance.now();
    const elapsed = now - start;
    const pct = Math.min(elapsed / duration, 1);
    const pos = pct * 290;
    bar.style.left = `${pos}px`;

    if (pct < 1) {
      animationId = requestAnimationFrame(animate);
    } else if (!finished) {
      finished = true;
      endQTE("fail");
    }
  }

  function endQTE(result) {
    cancelAnimationFrame(animationId);
    container.style.display = "none";
    window.removeEventListener("keydown", onKey);
    callback(result);
  }

  function onKey(e) {
    if (finished) return;
    if (e.key === 'a' || e.key === 'A') {
      finished = true;
      const x = parseFloat(bar.style.left);
      if (x >= 130 && x <= 170) return endQTE("perfect");
      else if (x >= 100 && x <= 200) return endQTE("good");
      else return endQTE("fail");
    }
  }

  const start = performance.now();
  window.addEventListener("keydown", onKey);
  animate();
}

  function startDefQTE(callback) {
    const container = document.getElementById("qteContainer");
    const bar = document.getElementById("qteBar");
    container.style.display = "block";
    bar.style.left = "0px";

    const duration = 750;
    let animationId;
    let finished = false;

    function animate() {
      const now = performance.now();
      const elapsed = now - start;
      const pct = Math.min(elapsed / duration, 1);
      const pos = pct * 290;
      bar.style.left = `${pos}px`;

      if (pct < 1) {
        animationId = requestAnimationFrame(animate);
      } else if (!finished) {
        finished = true;
        endQTE("fail");
      }
    }

    function endQTE(result) {
      cancelAnimationFrame(animationId);
      container.style.display = "none";
      window.removeEventListener("keydown", onKey);
      callback(result);
    }

    function onKey(e) {
      if (finished) return;
      if (e.key === 'd' || e.key === 'D') {
        finished = true;
        const x = parseFloat(bar.style.left);
        if (x >= 130 && x <= 170) return endQTE("perfect");
        else if (x >= 100 && x <= 200) return endQTE("good");
        else return endQTE("fail");
      }
    }

    const start = performance.now();
    window.addEventListener("keydown", onKey);
    animate();
  }

  function handleEnemyAttack(damage) {
    startDefQTE(defResult => {
      let finalDamage = damage;
      if (defResult === "perfect") {
        finalDamage = Math.floor(damage * 1);
      } else if (defResult === "good") {
        finalDamage = Math.floor(damage * 0.5);
      }

      playerHP -= finalDamage;
      if (finalDamage > 0) animateDamage(player); // Animation dégâts joueur
      updateHP();

      if (playerHP <= 0) {
        resultText.innerHTML = "Anéantis...";
        resultText.style.display = 'block';
      } else {
        isPlayerTurn = true;
        updateArrow();
      }
    });
  }

  function playerAttack() {
    if (!isPlayerTurn) return;
    startQTE(result => {
      if (result === "perfect") {
        enemyHP -= 20;
        animateDamage(enemy); // Animation dégâts ennemi
      } else if (result === "good") {
        enemyHP -= 10;
        animateDamage(enemy); // Animation dégâts ennemi
      }
      updateHP();
      if (enemyHP <= 0) {
        resultText.innerHTML = "Victoire !";
        resultText.style.display = 'block';
      } else {
        isPlayerTurn = false;
        updateArrow();
        setTimeout(() => ennemyAttack(enemy, handleEnemyAttack), 500);
      }
      updateArrow();
    });
  }

  window.addEventListener('keydown', e => {
    if (!isPlayerTurn) return;
    if (e.key === 'a' || e.key === 'A') {
      playerAttack({
        isPlayerTurn,
        startQTE,
        showMessage,
        updateHP,
        updateArrow,
        ennemyAttack,
        enemy,
        handleEnemyAttack,
        resultText,
        enemyHP,
        setEnemyHP,
        setIsPlayerTurn
      });
    }
    if (e.key === 'w' || e.key === 'W') {
      healPlayer();
      updateHP();
      isPlayerTurn = false;
      updateArrow();
      setTimeout(() => ennemyAttack(enemy, handleEnemyAttack), 500);
    }
  });

  updateArrow();
  updateHP();

  return scene;
};

const scene = createScene();
engine.runRenderLoop(() => {
  const arrow = scene.getMeshByName("arrow");
  arrow.position.y += Math.sin(performance.now()/200) * 0.005;
  scene.render();
});

window.addEventListener("resize", () => engine.resize());

function animateDamage(mesh) {
  const originalColor = mesh.material.diffuseColor.clone();
  mesh.material.diffuseColor = BABYLON.Color3.Red();
  setTimeout(() => {
    mesh.material.diffuseColor = originalColor;
  }, 250);
}
