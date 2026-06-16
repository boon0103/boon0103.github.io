const PASSWORD = "0424";

const memories = [
  {
    date: "CHAPTER 01",
    title: "为你拍的第一张照片",
    text: "那时的我还不敢把喜欢说得太明显，只好悄悄把镜头对准你。后来才发现，我想记录的从来不只是这一刻，而是有你在的每一刻。",
    type: "image",
    file: "01.jpeg",
    alt: "为你拍的第一张照片",
  },
  {
    date: "CHAPTER 02",
    title: "我们的第一张合照",
    text: "从镜头里的你，变成镜头里的我们。看起来只是一张普通的合照，对我来说，却是我们的故事真正有了名字。",
    type: "image",
    file: "02.jpeg",
    alt: "我们的第一张合照",
  },
  {
    date: "CHAPTER 03",
    title: "一起做 Gym",
    text: "喜欢不只是精心准备的约会，也是在流汗和疲惫的时候依然靠近。和你一起做普通的事，普通也会变得特别。",
    type: "image",
    file: "03.jpeg",
    alt: "我们一起健身",
  },
  {
    date: "CHAPTER 04",
    title: "一起唱 K",
    text: "也许我们唱得不一定完美，但那天的每一首歌，因为身边是你，都成了我最想循环播放的旋律。",
    type: "image",
    file: "04.jpeg",
    alt: "我们一起唱歌",
  },
  {
    date: "CHAPTER 05",
    title: "第一次送你花",
    text: "第一次送你花时，我想说的话其实比花瓣还多。花会慢慢褪色，但那天看见你笑起来的心情，我一直记得。",
    type: "image",
    file: "05.jpeg",
    alt: "第一次送你花",
  },
  {
    date: "CHAPTER 06",
    title: "你给我的回信",
    text: "我把心意交给你，又收到了你的回应。原来被喜欢的人认真放在心上，是一件这么温柔、这么幸运的事。",
    type: "image",
    file: "06.jpeg",
    alt: "你给我的回信",
  },
  {
    date: "CHAPTER 07 · 520",
    title: "一起庆祝 520",
    text: "520 只是日历上的一天，可因为和你一起度过，它便有了只属于我们的意义。喜欢你，不只在这一天，而是在每一天。",
    type: "image",
    file: "07.jpeg",
    alt: "我们一起庆祝520",
  },
  {
    date: "CHAPTER 08",
    title: "第一次带你回家",
    text: "带你回家，是想让你走进我的生活，也走近我的未来。那一刻我想，我们的故事已经不只是心动，而是越来越像一个温暖的以后。",
    type: "image",
    file: "08.jpeg",
    alt: "第一次带你回家",
  },
];

const screens = {
  countdown: document.querySelector("#countdown-screen"),
  password: document.querySelector("#password-screen"),
  heart: document.querySelector("#heart-screen"),
  memoir: document.querySelector("#memoir-screen"),
};

const countdownElement = document.querySelector("#countdown");
const passwordForm = document.querySelector("#password-form");
const passwordInput = document.querySelector("#password");
const passwordMessage = document.querySelector("#password-message");
const heartButton = document.querySelector("#heart-button");
const memoryList = document.querySelector("#memory-list");
const musicToggle = document.querySelector("#music-toggle");
const musicLabel = musicToggle.querySelector(".music-label");
const countdownWrap = document.querySelector(".countdown-wrap");
const startExperienceButton = document.querySelector("#start-experience");
const backgroundMusic = document.querySelector("#background-music");
let countdownStarted = false;
let musicFallbackReady = false;

function updateMusicButton() {
  const isPlaying = !backgroundMusic.paused;
  musicToggle.classList.toggle("playing", isPlaying);
  musicLabel.textContent = isPlaying ? "暂停" : "音乐";
  musicToggle.setAttribute("aria-label", isPlaying ? "暂停音乐" : "播放音乐");
  musicToggle.title = isPlaying ? "暂停音乐" : "播放音乐";
}

async function playMusic() {
  try {
    backgroundMusic.volume = 0.55;
    await backgroundMusic.play();
  } catch {
    const loadedFallback = await loadMusicFallback();
    if (!loadedFallback) return false;

    try {
      backgroundMusic.volume = 0.55;
      await backgroundMusic.play();
    } catch {
      return false;
    }
  }

  updateMusicButton();
  return true;
}

async function loadBase64Asset(file) {
  const response = await fetch(`data/${file}.b64.txt`);
  if (!response.ok) throw new Error(`Missing fallback asset: ${file}`);
  return response.text();
}

async function loadMusicFallback() {
  if (musicFallbackReady) return true;

  try {
    const base64 = await loadBase64Asset("marry.mp3");
    const binary = atob(base64);
    const bytes = new Uint8Array(binary.length);

    for (let index = 0; index < binary.length; index += 1) {
      bytes[index] = binary.charCodeAt(index);
    }

    const blob = new Blob([bytes], { type: "audio/mpeg" });
    backgroundMusic.src = URL.createObjectURL(blob);
    musicFallbackReady = true;
    return true;
  } catch {
    return false;
  }
}

function beginCountdownOnce() {
  if (countdownStarted) return;
  countdownStarted = true;
  startCountdown();
}

function switchScreen(from, to) {
  from.classList.add("leaving");
  window.setTimeout(() => {
    from.classList.remove("active", "leaving");
    to.classList.add("active");
  }, 850);
}

function startCountdown() {
  countdownWrap.classList.remove("needs-touch");
  countdownWrap.classList.add("running");
  const numbers = [5, 4, 3, 2, 1];
  let index = 0;

  function showNextNumber() {
    countdownElement.textContent = numbers[index];
    countdownElement.classList.remove("pop");
    void countdownElement.offsetWidth;
    countdownElement.classList.add("pop");

    if (index < numbers.length - 1) {
      index += 1;
      window.setTimeout(showNextNumber, 1000);
      return;
    }

    // 让数字 1 完整显示一秒，再进入密码页。
    window.setTimeout(() => {
      switchScreen(screens.countdown, screens.password);
      window.setTimeout(() => passwordInput.focus(), 1000);
    }, 1000);
  }

  showNextNumber();
}

function initializeExperience() {
  musicToggle.classList.add("visible");
  countdownWrap.classList.add("needs-touch");
  startExperienceButton.textContent = "轻触开启惊喜";
  startExperienceButton.disabled = false;
}

function createMemoryMedia(memory, index) {
  if (!memory.file) {
    const placeholder = document.createElement("div");
    placeholder.className = "media-placeholder";
    placeholder.innerHTML = `这里放第 ${index + 1} 张<br />${memory.type === "video" ? "视频" : "照片"}`;
    return placeholder;
  }

  if (memory.type === "video") {
    const video = document.createElement("video");
    video.src = `media/${memory.file}`;
    video.controls = true;
    video.playsInline = true;
    video.preload = "metadata";
    video.setAttribute("aria-label", memory.alt);
    return video;
  }

  const image = document.createElement("img");
  image.src = `media/${memory.file}`;
  image.alt = memory.alt;
  image.loading = "lazy";
  image.onerror = async () => {
    image.onerror = null;
    try {
      const base64 = await loadBase64Asset(memory.file);
      image.src = `data:image/jpeg;base64,${base64}`;
    } catch {
      image.alt = `${memory.alt}（照片暂时无法加载）`;
    }
  };
  return image;
}

function renderMemories() {
  memories.forEach((memory, index) => {
    const article = document.createElement("article");
    article.className = "memory";

    const media = document.createElement("div");
    media.className = "memory-media";
    media.appendChild(createMemoryMedia(memory, index));

    const copy = document.createElement("div");
    copy.className = "memory-copy";
    copy.innerHTML = `
      <span class="memory-date">${memory.date}</span>
      <h3>${memory.title}</h3>
      <p>${memory.text}</p>
    `;

    article.append(media, copy);
    memoryList.appendChild(article);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.14 }
  );

  document.querySelectorAll(".memory").forEach((memory) => observer.observe(memory));
}

passwordInput.addEventListener("input", () => {
  passwordInput.value = passwordInput.value.replace(/\D/g, "");
  passwordMessage.textContent = "";
});

passwordForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (passwordInput.value === PASSWORD) {
    passwordMessage.textContent = "";
    switchScreen(screens.password, screens.heart);
    return;
  }

  passwordMessage.textContent = "再想想，那一天对我们很重要。";
  passwordForm.classList.remove("shake");
  void passwordForm.offsetWidth;
  passwordForm.classList.add("shake");
  passwordInput.select();
});

heartButton.addEventListener("click", () => {
  screens.heart.classList.add("leaving");
  window.setTimeout(() => {
    screens.heart.classList.remove("active", "leaving");
    screens.memoir.classList.add("active");
    document.body.style.overflow = "auto";
    window.scrollTo(0, 0);
  }, 700);
});

musicToggle.addEventListener("click", async () => {
  if (backgroundMusic.paused) {
    await playMusic();
  } else {
    backgroundMusic.pause();
    updateMusicButton();
  }
});

startExperienceButton.addEventListener("click", async () => {
  await playMusic();
  beginCountdownOnce();
});

backgroundMusic.addEventListener("play", updateMusicButton);
backgroundMusic.addEventListener("pause", updateMusicButton);
backgroundMusic.addEventListener("error", () => {
  musicLabel.textContent = "无法播放";
  musicToggle.setAttribute("aria-label", "音乐文件无法播放");
});

document.querySelector("#start-story").addEventListener("click", () => {
  document.querySelector(".story-intro").scrollIntoView({ behavior: "smooth" });
});

document.querySelector("#back-to-heart").addEventListener("click", () => {
  screens.memoir.classList.remove("active");
  screens.heart.classList.add("active");
  document.body.style.overflow = "hidden";
  window.scrollTo(0, 0);
});

document.body.style.overflow = "hidden";
renderMemories();
initializeExperience();
