const EVENT = {
  bride: "D/O M. Mushtaq Ahmed",
  groom: "Shakeeb Raza Ullah",
  start: "2026-11-08T19:00:00",
  end: "2026-11-08T23:30:00",
  venue: "Good Luck Marriage Hall",
  address: "Manno Abad near Ravi Rehan",
  title: "Walima of Shakeeb Raza Ullah & D/O M. Mushtaq Ahmed",
};

const intro = document.getElementById("intro");
const envelope = document.getElementById("envelope");
const openBtn = document.getElementById("openInvite");
const header = document.getElementById("header");
const cursor = document.querySelector(".cursor");
const cursorDot = document.querySelector(".cursor-dot");
const canvas = document.getElementById("dust");
const ctx = canvas.getContext("2d");
const coupleStage = document.getElementById("coupleStage");
const ayahCeremony = document.getElementById("ayahCeremony");
const ayahAudio = document.getElementById("ayahAudio");
const audioToggle = document.getElementById("audioToggle");

const AYAH_PLAYLIST = [
  "https://everyayah.com/data/Alafasy_128kbps/030021.mp3",
  "https://everyayah.com/data/Alafasy_128kbps/002187.mp3",
  "https://everyayah.com/data/Alafasy_128kbps/016072.mp3",
  "https://everyayah.com/data/Alafasy_128kbps/025074.mp3",
  "https://everyayah.com/data/Alafasy_128kbps/007189.mp3",
];

let ayahIndex = 0;
let ayahMuted = false;

function loadAyah(index) {
  ayahIndex = index % AYAH_PLAYLIST.length;
  ayahAudio.src = AYAH_PLAYLIST[ayahIndex];
}

function startAyahAudio() {
  loadAyah(0);
  ayahAudio.volume = 0.42;
  ayahAudio.hidden = false;
  audioToggle.hidden = false;
  const playAttempt = ayahAudio.play();
  if (playAttempt && typeof playAttempt.catch === "function") {
    playAttempt.catch(() => {
      audioToggle.classList.add("is-muted");
      audioToggle.setAttribute("aria-pressed", "true");
      audioToggle.querySelector(".audio-text").textContent = "Play";
    });
  }
}

ayahAudio.addEventListener("ended", () => {
  loadAyah(ayahIndex + 1);
  ayahAudio.play().catch(() => {});
});

audioToggle.addEventListener("click", () => {
  ayahMuted = !ayahMuted;
  ayahAudio.muted = ayahMuted;
  audioToggle.classList.toggle("is-muted", ayahMuted);
  audioToggle.setAttribute("aria-pressed", String(ayahMuted));
  audioToggle.querySelector(".audio-text").textContent = ayahMuted ? "Play" : "Ayah";
  audioToggle.setAttribute("aria-label", ayahMuted ? "Play recitation" : "Mute recitation");
  if (!ayahMuted && ayahAudio.paused) {
    ayahAudio.play().catch(() => {});
  }
});

document.body.classList.add("intro-open");

function burstPetals(count) {
  for (let i = 0; i < count; i += 1) {
    petals.push({
      x: innerWidth / 2 + (Math.random() - 0.5) * 180,
      y: innerHeight * 0.48 + (Math.random() - 0.5) * 80,
      w: 5 + Math.random() * 8,
      h: 8 + Math.random() * 12,
      vy: -1.2 + Math.random() * 0.4,
      vx: -1.4 + Math.random() * 2.8,
      rot: Math.random() * Math.PI,
      vr: -0.04 + Math.random() * 0.08,
      color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
    });
  }
}

function openInvitation() {
  envelope.classList.add("open");
  startAyahAudio();
  setTimeout(() => {
    intro.classList.add("gone");
    ayahCeremony.classList.add("show");
    document.body.classList.remove("intro-open");
  }, 950);
  setTimeout(() => {
    ayahCeremony.classList.add("fade");
    document.body.classList.add("ready");
    revealHero();
    watchScrollReveals();
  }, 3100);
  setTimeout(() => {
    ayahCeremony.classList.add("gone");
    coupleStage.classList.add("settled");
    burstPetals(28);
  }, 5000);
}

openBtn.addEventListener("click", openInvitation, { once: true });

function revealHero() {
  document.querySelectorAll(".hero .reveal").forEach((el) => el.classList.add("in"));
}

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) entry.target.classList.add("in");
    });
  },
  { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
);

function watchScrollReveals() {
  document.querySelectorAll(".section .reveal").forEach((el) => io.observe(el));
}

window.addEventListener("scroll", () => {
  header.classList.toggle("scrolled", window.scrollY > 40);
});

let mouse = { x: innerWidth / 2, y: innerHeight / 2 };
let cursorPos = { x: mouse.x, y: mouse.y };
let dotPos = { x: mouse.x, y: mouse.y };

window.addEventListener("mousemove", (e) => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
});

document.querySelectorAll("a, button, .glass-card").forEach((el) => {
  el.addEventListener("mouseenter", () => cursor.classList.add("hover"));
  el.addEventListener("mouseleave", () => cursor.classList.remove("hover"));
});

function tickCursor() {
  cursorPos.x += (mouse.x - cursorPos.x) * 0.18;
  cursorPos.y += (mouse.y - cursorPos.y) * 0.18;
  dotPos.x += (mouse.x - dotPos.x) * 0.45;
  dotPos.y += (mouse.y - dotPos.y) * 0.45;
  cursor.style.left = `${cursorPos.x}px`;
  cursor.style.top = `${cursorPos.y}px`;
  cursorDot.style.left = `${dotPos.x}px`;
  cursorDot.style.top = `${dotPos.y}px`;
  requestAnimationFrame(tickCursor);
}
tickCursor();

const petals = [];
const PETAL_COUNT = 36;
const PETAL_COLORS = [
  "rgba(215, 164, 148, 0.5)",
  "rgba(143, 166, 106, 0.42)",
  "rgba(198, 165, 106, 0.4)",
];

function resizeCanvas() {
  canvas.width = innerWidth;
  canvas.height = innerHeight;
}

function spawnPetal() {
  petals.push({
    x: Math.random() * canvas.width,
    y: Math.random() * -canvas.height,
    w: 5 + Math.random() * 7,
    h: 8 + Math.random() * 10,
    vy: 0.3 + Math.random() * 0.6,
    vx: -0.3 + Math.random() * 0.6,
    rot: Math.random() * Math.PI,
    vr: -0.02 + Math.random() * 0.04,
    color: PETAL_COLORS[Math.floor(Math.random() * PETAL_COLORS.length)],
  });
}

function drawPetals() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  petals.forEach((p) => {
    p.x += p.vx + Math.sin(p.rot) * 0.25;
    p.y += p.vy;
    p.rot += p.vr;
    if (p.y > canvas.height + 20) {
      p.y = -20;
      p.x = Math.random() * canvas.width;
    }
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.rot);
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.ellipse(0, 0, p.w, p.h, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  });
  requestAnimationFrame(drawPetals);
}

resizeCanvas();
window.addEventListener("resize", resizeCanvas);
for (let i = 0; i < PETAL_COUNT; i += 1) spawnPetal();
drawPetals();

const target = new Date(EVENT.start).getTime();
const daysEl = document.getElementById("days");
const hoursEl = document.getElementById("hours");
const minutesEl = document.getElementById("minutes");
const secondsEl = document.getElementById("seconds");

function pad(n) {
  return String(n).padStart(2, "0");
}

function renderCountdown() {
  const diff = Math.max(0, target - Date.now());
  const s = Math.floor(diff / 1000);
  daysEl.textContent = pad(Math.floor(s / 86400));
  hoursEl.textContent = pad(Math.floor((s % 86400) / 3600));
  minutesEl.textContent = pad(Math.floor((s % 3600) / 60));
  secondsEl.textContent = pad(s % 60);
}

renderCountdown();
setInterval(renderCountdown, 1000);

function toICSDate(iso) {
  const d = new Date(iso);
  const p = (n) => String(n).padStart(2, "0");
  return `${d.getFullYear()}${p(d.getMonth() + 1)}${p(d.getDate())}T${p(d.getHours())}${p(d.getMinutes())}${p(d.getSeconds())}`;
}

document.getElementById("saveDate").addEventListener("click", (e) => {
  e.preventDefault();
  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Walima Invitation//EN",
    "BEGIN:VEVENT",
    `DTSTART:${toICSDate(EVENT.start)}`,
    `DTEND:${toICSDate(EVENT.end)}`,
    `SUMMARY:${EVENT.title}`,
    `LOCATION:${EVENT.venue}, ${EVENT.address}`,
    "DESCRIPTION:Join us for the Walima celebration.",
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
  const blob = new Blob([ics], { type: "text/calendar" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "walima-amina-hassan.ics";
  a.click();
  URL.revokeObjectURL(url);
});
