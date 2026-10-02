// ============ CONFIG ============
const PIN = "1111";

// ============ PIN GATE ============
const boxes = Array.from(document.querySelectorAll(".pin-box"));
const pinError = document.getElementById("pinError");
const lockScreen = document.getElementById("lock-screen");
const site = document.getElementById("site");
const unlockBtn = document.getElementById("unlockBtn");
const player = document.getElementById("player");
const audio = document.getElementById("audio");

boxes[0].focus();

boxes.forEach((box, i) => {
  box.addEventListener("input", () => {
    box.value = box.value.replace(/[^0-9]/g, "");
    if (box.value && i < boxes.length - 1) boxes[i + 1].focus();
    pinError.classList.remove("show");
  });
  box.addEventListener("keydown", (e) => {
    if (e.key === "Backspace" && !box.value && i > 0) boxes[i - 1].focus();
    if (e.key === "Enter") tryUnlock();
  });
});

unlockBtn.addEventListener("click", tryUnlock);

function tryUnlock() {
  const entered = boxes.map(b => b.value).join("");
  if (entered === PIN) {
    unlock();
  } else {
    pinError.classList.add("show");
    lockScreen.querySelector(".lock-card").animate(
      [{ transform: "translateX(0)" }, { transform: "translateX(-8px)" },
       { transform: "translateX(8px)" }, { transform: "translateX(0)" }],
      { duration: 300 }
    );
    boxes.forEach(b => (b.value = ""));
    boxes[0].focus();
  }
}

function unlock() {
  lockScreen.classList.add("leaving");
  setTimeout(() => {
    lockScreen.hidden = true;
    site.hidden = false;
    player.hidden = false;
    requestAnimationFrame(() => site.classList.add("show"));
  }, 850);
}

// ============ LIGHTBOX ============
const lightbox = document.getElementById("lightbox");
const lightboxImg = document.getElementById("lightboxImg");
const lightboxClose = document.getElementById("lightboxClose");

document.querySelectorAll(".m-item img").forEach(img => {
  img.addEventListener("click", () => {
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightbox.hidden = false;
  });
});
lightboxClose.addEventListener("click", () => (lightbox.hidden = true));
lightbox.addEventListener("click", (e) => {
  if (e.target === lightbox) lightbox.hidden = true;
});

// ============ MUSIC PLAYER ============
const playerToggle = document.getElementById("playerToggle");
const playerState = document.getElementById("playerState");

playerToggle.addEventListener("click", () => {
  if (audio.paused) {
    audio.play().catch(() => {});
    player.classList.add("playing");
    playerState.textContent = "sedang diputar";
  } else {
    audio.pause();
    player.classList.remove("playing");
    playerState.textContent = "tap untuk putar";
  }
});

// ============ AMBIENT EMBERS (subtle floating gold flecks) ============
const canvas = document.getElementById("embers");
const ctx = canvas.getContext("2d");
let w, h, particles;

function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
function makeParticles() {
  const count = Math.min(36, Math.floor((w * h) / 42000));
  particles = Array.from({ length: count }, () => ({
    x: Math.random() * w,
    y: Math.random() * h,
    r: Math.random() * 1.6 + 0.4,
    speed: Math.random() * 0.25 + 0.05,
    drift: Math.random() * 0.4 - 0.2,
    alpha: Math.random() * 0.5 + 0.15,
  }));
}
function tick() {
  ctx.clearRect(0, 0, w, h);
  ctx.fillStyle = "#c9a876";
  particles.forEach(p => {
    ctx.globalAlpha = p.alpha;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fill();
    p.y -= p.speed;
    p.x += p.drift * 0.1;
    if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w; }
  });
  requestAnimationFrame(tick);
}

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
resize();
makeParticles();
window.addEventListener("resize", () => { resize(); makeParticles(); });
if (!prefersReducedMotion) tick();
