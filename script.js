const actions = document.getElementById("actions");
const noBtn = document.getElementById("noBtn");
const yesBtn = document.getElementById("yesBtn");
const scene = document.querySelector(".scene");
const timeline = document.getElementById("timeline");
const yearButtons = document.querySelectorAll(".year-btn");
const yearDetail = document.getElementById("yearDetail");
const finishBtn = document.getElementById("finishBtn");
const finalSection = document.getElementById("final");
const finalMessage = document.getElementById("finalMessage");
const errorModal = document.getElementById("errorModal");
const modalClose = document.getElementById("modalClose");
const modalText = document.getElementById("modalText");
const musicOverlay = document.getElementById("musicOverlay");
const musicIframe = document.getElementById("musicIframe");
const errorMessage =
  "LA la j'ai rien a dire hein cette affaire de bestooo tchrrr l'homme était fan de toi co besto tchai tchai tchai tchai";

const getContainerBounds = () => {
  const containerRect = actions.getBoundingClientRect();
  const buttonRect = noBtn.getBoundingClientRect();

  return {
    containerRect,
    maxX: Math.max(0, containerRect.width - buttonRect.width),
    maxY: Math.max(0, containerRect.height - buttonRect.height),
    buttonRect,
  };
};

const moveNoButton = () => {
  const { maxX, maxY } = getContainerBounds();
  const nextX = Math.random() * maxX;
  const nextY = Math.random() * maxY;

  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;
};

const moveAwayFromCursor = (event) => {
  const { containerRect, buttonRect, maxX, maxY } = getContainerBounds();
  const cursorX = event.clientX - containerRect.left;
  const cursorY = event.clientY - containerRect.top;

  const centerX = buttonRect.left - containerRect.left + buttonRect.width / 2;
  const centerY = buttonRect.top - containerRect.top + buttonRect.height / 2;

  const dx = centerX - cursorX;
  const dy = centerY - cursorY;
  const distance = Math.hypot(dx, dy);

  if (distance > 90) return;

  const angle = Math.atan2(dy, dx);
  const escapeDistance = 140;
  const targetX = centerX + Math.cos(angle) * escapeDistance - buttonRect.width / 2;
  const targetY = centerY + Math.sin(angle) * escapeDistance - buttonRect.height / 2;

  const nextX = Math.min(Math.max(0, targetX), maxX);
  const nextY = Math.min(Math.max(0, targetY), maxY);

  noBtn.style.left = `${nextX}px`;
  noBtn.style.top = `${nextY}px`;
  noBtn.style.transform = "scale(0.98)";
  window.setTimeout(() => {
    noBtn.style.transform = "scale(1)";
  }, 120);
};

actions.addEventListener("mousemove", moveAwayFromCursor);
noBtn.addEventListener("mouseenter", moveNoButton);
noBtn.addEventListener("click", (event) => {
  event.preventDefault();
  moveNoButton();
});

window.addEventListener("load", () => {
  moveNoButton();
});

yesBtn.addEventListener("click", () => {
  document.body.classList.add("light");
  scene.classList.add("transitioned");
  timeline.setAttribute("aria-hidden", "false");
  const timelineTop = timeline.getBoundingClientRect().top + window.pageYOffset;
  const offset = 120; // marge en px pour ne pas coller en haut
  window.scrollTo({
    top: timelineTop - offset,
    behavior: "smooth",
  });
  window.setTimeout(() => {
    scene.classList.add("hidden");
  }, 600);
});

yearButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const year = button.getAttribute("data-year");

    if (year === "2023" || year === "2024") {
      modalText.textContent = errorMessage;
      errorModal.classList.add("show");
      errorModal.setAttribute("aria-hidden", "false");
      return;
    }

    yearButtons.forEach((btn) => btn.classList.remove("active"));
    button.classList.add("active");
    const detail = button.getAttribute("data-detail");
    yearDetail.innerHTML = `
      <p class="year-label">${year}</p>
      <p class="year-text">${detail}</p>
    `;

    if (year === "2026") {
      finishBtn.classList.add("show");
    } else {
      finishBtn.classList.remove("show");
    }
  });
});

const loveMessages = [
  "Eu te amo",
  "Je t'aime",
  "N b'i ka fo",
  "I love you",
  "Ti amo",
  "Te amo",
  "Ich liebe dich",
  "Te iubesc",
  "Aishiteru",
];

let messageIndex = 0;
let messageInterval = null;

const startLoveLoop = () => {
  if (messageInterval) return;
  messageInterval = window.setInterval(() => {
    finalMessage.classList.add("fade");
    window.setTimeout(() => {
      // On fait défiler tous les "je t'aime" une seule fois,
      // puis on affiche un dernier bouton musique.
      if (messageIndex < loveMessages.length - 1) {
        messageIndex += 1;
        finalMessage.textContent = loveMessages[messageIndex];
        finalMessage.classList.remove("fade");
      } else {
        window.clearInterval(messageInterval);
        messageInterval = null;
        finalMessage.classList.remove("fade");
        finalMessage.innerHTML = `
          <div class="final-music">
            <p>Pour finir, écoute notre musique ❤️</p>
            <button class="music-btn" id="musicBtn">
              Découvre la surprise
            </button>
          </div>
        `;

        const musicBtn = document.getElementById("musicBtn");
        if (musicBtn) {
          musicBtn.addEventListener("click", () => {
            // Certains contenus YouTube ne peuvent pas être lus en iframe
            // on ouvre donc la vidéo directement dans un nouvel onglet,
            // à partir de 0:06.
            window.open(
              "https://www.youtube.com/watch?v=8emFHDYsWcs&list=RD8emFHDYsWcs&start_radio=1&t=6s",
              "_blank",
            );
          });
        }
      }
    }, 300);
  }, 2500);
};

finishBtn.addEventListener("click", () => {
  document.body.classList.add("final");
  finalSection.setAttribute("aria-hidden", "false");
  finalSection.scrollIntoView({ behavior: "smooth" });
  startLoveLoop();
});

const closeModal = () => {
  errorModal.classList.remove("show");
  errorModal.setAttribute("aria-hidden", "true");
};

modalClose.addEventListener("click", closeModal);
errorModal.addEventListener("click", (event) => {
  if (event.target === errorModal) closeModal();
});
