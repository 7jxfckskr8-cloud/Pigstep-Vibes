const tracks = [
  { name: "13", color: "#d0f04b", file: "13" },
  { name: "Cat", color: "#f6c857", file: "cat" },
  { name: "Blocks", color: "#ff8a4d", file: "blocks" },
  { name: "Chirp", color: "#f38ab8", file: "chirp" },
  { name: "Far", color: "#9edc8b", file: "far" },
  { name: "Mall", color: "#6cc3e8", file: "mall" },
  { name: "Mellohi", color: "#c49bf2", file: "mellohi" },
  { name: "Stal", color: "#e8e1cf", file: "stal" },
  { name: "Strad", color: "#f4a261", file: "strad" },
  { name: "Ward", color: "#bfdf69", file: "ward" },
  { name: "11", color: "#9dabb5", file: "11" },
  { name: "Wait", color: "#73d3c5", file: "wait" },
  { name: "Otherside", color: "#7c9df2", file: "otherside" },
  { name: "5", color: "#fb7e68", file: "5" },
  { name: "Pigstep", color: "#ef718f", file: "pigstep" },
  { name: "Relic", color: "#d7a45d", file: "relic" },
  { name: "Creator", color: "#e8df68", file: "creator" },
  { name: "Creator (Music Box)", color: "#a4d7da", file: "creator_music_box" },
  { name: "Precipice", color: "#ee9b5e", file: "precipice" }
];

const assetIndexUrl = "https://piston-meta.mojang.com/v1/packages/e3bf1a07f3fc063f5c08dea6c3193f365a792b5a/17.json";
const resourceBase = "https://resources.download.minecraft.net/";
const grid = document.querySelector("#discGrid");
const currentTitle = document.querySelector("#currentTitle");
const stopButton = document.querySelector("#stopButton");
const statusText = document.querySelector("#statusText");
let activeAudio = null;
let activeCard = null;
const assetHashesReady = fetch(assetIndexUrl)
  .then((response) => {
    if (!response.ok) throw new Error("Could not load Minecraft assets");
    return response.json();
  })
  .then((index) => Object.fromEntries(
    tracks.map((track) => {
      const asset = index.objects[`minecraft/sounds/records/${track.file}.ogg`];
      return [track.file, asset?.hash];
    })
  ));

assetHashesReady.catch(() => {
  statusText.textContent = "ASSET INDEX UNAVAILABLE";
});

tracks.forEach((track, index) => {
  const card = document.createElement("button");
  card.className = "disc-card";
  card.type = "button";
  card.style.setProperty("--disc-color", track.color);
  card.setAttribute("aria-label", `Play ${track.name}`);
  card.innerHTML = `<span class="disc-number">${String(index + 1).padStart(2, "0")}</span><span class="disc-name">${track.name}</span>`;
  card.addEventListener("click", () => playTrack(track, card));
  grid.append(card);
});

async function playTrack(track, card) {
  statusText.textContent = "LOADING TRACK...";

  let assetHashes;
  try {
    assetHashes = await assetHashesReady;
  } catch {
    statusText.textContent = "ASSET INDEX UNAVAILABLE";
    return;
  }

  const hash = assetHashes[track.file];
  if (!hash) {
    statusText.textContent = "TRACK UNAVAILABLE";
    return;
  }

  if (activeAudio) activeAudio.pause();
  if (activeCard) activeCard.classList.remove("is-playing");

  const audio = new Audio(`${resourceBase}${hash.slice(0, 2)}/${hash}`);
  audio.loop = true;
  activeAudio = audio;
  activeCard = card;
  activeCard.classList.add("is-playing");
  currentTitle.textContent = track.name;
  statusText.textContent = "PLAYING NOW";
  stopButton.disabled = false;
  audio.play().catch(() => {
    statusText.textContent = "CLICK TO START";
  });
}

function stopTrack() {
  if (!activeAudio) return;
  activeAudio.pause();
  activeAudio.currentTime = 0;
  activeAudio = null;
  if (activeCard) activeCard.classList.remove("is-playing");
  activeCard = null;
  currentTitle.textContent = "Choose a disc";
  statusText.textContent = "READY TO PLAY";
  stopButton.disabled = true;
}

stopButton.addEventListener("click", stopTrack);
