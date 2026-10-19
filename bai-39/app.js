const stage = document.querySelector("#lantern-stage");
const pauseButton = document.querySelector("#pause-button");
const pauseLabel = document.querySelector("#pause-label");
const pauseSymbol = document.querySelector(".pause-symbol");
const stateLabel = document.querySelector("#spin-state");
const memoryTitle = document.querySelector("#memory-title");
const memoryCaption = document.querySelector("#memory-caption");
const faces = document.querySelectorAll(".lantern-face");
let manualPaused = false;
let hoveringFace = false;
let focusedFace = false;

function setPaused(paused, updateButton = true) {
  stage.classList.toggle("is-paused", paused);
  if (updateButton) {
    pauseButton.setAttribute("aria-pressed", String(manualPaused));
    pauseLabel.textContent = manualPaused ? "Tiếp tục quay" : "Tạm dừng";
    pauseSymbol.textContent = manualPaused ? "▶" : "Ⅱ";
  }
  stateLabel.innerHTML = `<i></i> ĐÈN ${paused ? "ĐÃ DỪNG" : "ĐANG QUAY"}`;
}

function syncMotion() {
  setPaused(manualPaused || hoveringFace || focusedFace);
}

pauseButton.addEventListener("click", () => {
  manualPaused = !manualPaused;
  syncMotion();
});

faces.forEach((face) => {
  face.addEventListener("mouseenter", () => {
    hoveringFace = true;
    syncMotion();
  });
  face.addEventListener("mouseleave", () => {
    hoveringFace = false;
    syncMotion();
  });
  face.addEventListener("focus", () => {
    focusedFace = true;
    syncMotion();
  });
  face.addEventListener("blur", () => {
    focusedFace = false;
    syncMotion();
  });
  face.addEventListener("click", () => {
    memoryTitle.textContent = face.dataset.title;
    memoryCaption.textContent = face.dataset.caption;
    manualPaused = true;
    syncMotion();
  });
});

// Keep the local Bài 38 result card readable when its screenshot is not added yet.
const resultImage = document.querySelector(".previous-card img");
resultImage.addEventListener("error", () => {
  resultImage.alt = "Chưa thêm ảnh kết quả Bài 38. Xem hướng dẫn trong README.md.";
});
