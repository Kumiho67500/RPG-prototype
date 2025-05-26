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

  const setPlayerHP = val => playerHP = val;
  const setEnemyHP = val => enemyHP = val;
  const setIsPlayerTurn = val => isPlayerTurn = val;

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

    let start = performance.now();
    const duration = 750;
    let direction = 1;

    let animationId;

    function animate() {
      let now = performance.now();
      let elapsed = now - start;
      let pct = elapsed / duration;

      if (pct >= 1) {
        direction *= -1;
        start = now;
        pct = 0;
      }

      let pos = direction === 1 ? pct * 290 : 290 - pct * 290;
      bar.style.left = `${pos}px`;

      animationId = requestAnimationFrame(animate);
    }

  function endQTE(result) {
    const resultDiv = document.getElementById("qte-result");
    if (result === "perfect") {
      resultDiv.textContent = "Splendide";
    } else if (result === "good") {
      resultDiv.textContent = "Passable";
    } else if (result === "fail") {
      resultDiv.textContent = "Médiocre";
    }
  }

  function onKey(e) {
    if (e.key === 'a' || e.key === 'A') {
      const x = parseFloat(bar.style.left);
      if (x >= 130 && x <= 170) return endQTE("perfect");
      else if (x >= 100 && x <= 200) return endQTE("good");
      else return endQTE("fail");
    }
  }

    window.addEventListener("keydown", onKey);
    animate();
  }

  window.attackEnemy = () => playerAttack({
    isPlayerTurn, setIsPlayerTurn,
    enemyHP, setEnemyHP,
    enemy, startQTE, showMessage,
    resultText, updateArrow
  });

  window.healPlayer = () => healPlayer({
    isPlayerTurn, setIsPlayerTurn,
    playerHP, setPlayerHP,
    player, updateHP, updateArrow
  });

  window.startEnemyTurn = () => {{
      const damage = ennemyAttack(result, showMessage);
      playerHP -= damage;
      updateHP();

      if (playerHP <= 0) {
        resultText.innerHTML = "Vous avez perdu !";
        resultText.style.display = 'block';
      } else {
        isPlayerTurn = true;
        updateArrow();
      }
    };
  };

  window.addEventListener("keydown", onKey => {
    if (e.key === 'a' || e.key === 'A') window.endQTE();
  });

  window.addEventListener('keydown', e => {
    if (e.key === 'a' || e.key === 'A') window.attackEnemy();
    if (e.key === 'w' || e.key === 'W') window.healPlayer();
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
