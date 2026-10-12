const topicInputs = [...document.querySelectorAll("[data-topic]")];
const progressPercent = document.getElementById("progressPercent");
const progressCount = document.getElementById("progressCount");
const progressFill = document.getElementById("progressFill");
const progressBar = document.getElementById("progressBar");
const progressMessage = document.getElementById("progressMessage");
const resetButton = document.getElementById("resetProgress");
const toast = document.getElementById("toast");
const STORAGE_KEY = "careerCompass.javaBackend.completedTopics";
let toastTimer;

document.getElementById("year").textContent = new Date().getFullYear();

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2600);
}

function loadProgress() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
    const completed = new Set(Array.isArray(saved) ? saved : []);
    topicInputs.forEach((input) => {
      input.checked = completed.has(input.dataset.topic);
    });
  } catch (error) {
    // If browser storage is unavailable, the checklist still works for this page session.
    console.warn("Could not load saved roadmap progress.", error);
  }
  updateProgress(false);
}

function updateProgress(save = true) {
  const completed = topicInputs.filter((input) => input.checked).length;
  const total = topicInputs.length;
  const percent = total === 0 ? 0 : Math.round((completed / total) * 100);

  progressPercent.textContent = `${percent}%`;
  progressCount.textContent = `${completed} of ${total} topics complete`;
  progressFill.style.width = `${percent}%`;
  progressBar.setAttribute("aria-valuenow", String(percent));

  if (percent === 100) {
    progressMessage.textContent = "Amazing work! Review your projects and interview skills next.";
  } else if (percent >= 60) {
    progressMessage.textContent = "Great progress. Keep practising and start building projects.";
  } else if (percent >= 25) {
    progressMessage.textContent = "You're building momentum. Keep taking one topic at a time.";
  } else if (completed > 0) {
    progressMessage.textContent = "Nice start. Consistent practice is what makes the difference.";
  } else {
    progressMessage.textContent = "Your journey starts with one small step.";
  }

  if (save) {
    try {
      const ids = topicInputs.filter((input) => input.checked).map((input) => input.dataset.topic);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
    } catch (error) {
      showToast("Progress works for this session, but browser storage is unavailable.");
    }
  }
}

topicInputs.forEach((input) => input.addEventListener("change", () => updateProgress(true)));

resetButton.addEventListener("click", () => {
  const shouldReset = window.confirm("Reset all completed topics for this roadmap?");
  if (!shouldReset) return;
  topicInputs.forEach((input) => { input.checked = false; });
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (error) {
    console.warn("Could not clear saved roadmap progress.", error);
  }
  updateProgress(false);
  showToast("Your roadmap progress has been reset.");
});

loadProgress();
