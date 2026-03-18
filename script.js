const mainView = document.getElementById("mainView");
const progressValue = document.getElementById("progressValue");
const backBtn = document.getElementById("backBtn");

let currentTrack = null;
let currentTech = null;

const data = {
  frontend: {
    HTML: ["Tags", "Forms", "Semantic", "Accessibility"],
    CSS: ["Selectors", "Flexbox", "Grid", "Responsive"],
    JS: ["Variables", "Functions", "DOM", "Async"]
  },
  backend: {
    Node: ["Modules", "FS", "Streams"],
    Express: ["Routing", "Middleware", "API"],
    DB: ["SQL", "MongoDB", "Indexing"]
  },
  devops: {
    Linux: ["CLI", "Permissions", "Networking"],
    Docker: ["Images", "Containers"],
    CI: ["Pipelines", "GitHub Actions"]
  }
};

function getAllTopics() {
  let all = [];
  Object.values(data).forEach(track =>
    Object.values(track).forEach(tech =>
      all.push(...tech)
    )
  );
  return all;
}

function updateProgress() {
  const all = getAllTopics();
  const completed = JSON.parse(localStorage.getItem("allProgress")) || [];
  const percent = Math.round((completed.length / all.length) * 100);
  progressValue.innerText = percent + "%";
}

function saveGlobal(topic) {
  let completed = JSON.parse(localStorage.getItem("allProgress")) || [];
  if (!completed.includes(topic)) {
    completed.push(topic);
    localStorage.setItem("allProgress", JSON.stringify(completed));
  }
}

function renderCategories() {
  backBtn.classList.add("hidden");
  mainView.innerHTML = `
    <div class="grid">
      <div class="card" onclick="openTrack('frontend')">Frontend</div>
      <div class="card" onclick="openTrack('backend')">Backend</div>
      <div class="card" onclick="openTrack('devops')">DevOps</div>
    </div>`;
}

function openTrack(track) {
  currentTrack = track;
  backBtn.classList.remove("hidden");

  const techs = Object.keys(data[track]);

  mainView.innerHTML = `
    <div class="grid">
      ${techs.map(t => `<div class="card" onclick="openTech('${t}')">${t}</div>`).join("")}
    </div>`;
}

function openTech(tech) {
  currentTech = tech;

  const topics = data[currentTrack][tech];
  let completed = JSON.parse(localStorage.getItem("allProgress")) || [];

  mainView.innerHTML = `
    <div class="roadmap">
      ${topics.map((t, i) => {
        let locked = i > 0 && !completed.includes(topics[i - 1]);
        let done = completed.includes(t);

        return `
          <div class="node ${locked ? "locked" : ""} ${done ? "completed" : ""}"
            onclick="completeNode('${t}', ${locked})">
            ${t}
          </div>
        `;
      }).join("")}
    </div>`;
}

function completeNode(topic, locked) {
  if (locked) return;
  saveGlobal(topic);
  openTech(currentTech);
  updateProgress();
}

function goBack() {
  renderCategories();
}

function resetProgress() {
  localStorage.clear();
  location.reload();
}

document.getElementById("themeToggle").onclick = () => {
  document.body.classList.toggle("light");
};

const canvas = document.getElementById("stars");
const ctx = canvas.getContext("2d");

let stars = [];

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.onresize = resize;
resize();

for (let i = 0; i < 120; i++) {
  stars.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 2,
    speed: Math.random() * 0.5
  });
}

function animateStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";

  stars.forEach(s => {
    s.y += s.speed;
    if (s.y > canvas.height) s.y = 0;

    ctx.beginPath();
    ctx.arc(s.x, s.y, s.size, 0, Math.PI * 2);
    ctx.fill();
  });

  requestAnimationFrame(animateStars);
}

animateStars();

renderCategories();
updateProgress();