// 브라우저가 파일을 페이지로 열어버리는 기본 동작 방지
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const uploadBtn = document.getElementById("uploadBtn");
const resetBtn = document.getElementById("resetBtn");

let selectedFile = null;

function setInfo(msg, ok = true) {
  fileInfo.textContent = msg;
  fileInfo.style.color = ok ? "#0a7" : "#c33";
}

function isPdf(file) {
  const nameOk = file.name.toLowerCase().endsWith(".pdf");
  const typeOk = (file.type === "application/pdf" || file.type === "");
  return nameOk && typeOk;
}

function setFile(file) {
  if (!file) return;

  if (!isPdf(file)) {
    selectedFile = null;
    uploadBtn.disabled = true;
    resetBtn.disabled = true;
    setInfo("PDF 파일만 가능합니다.", false);
    return;
  }

  selectedFile = file;
  uploadBtn.disabled = false;
  resetBtn.disabled = false;
  setInfo(`선택됨: ${file.name} (${Math.round(file.size/1024)} KB)`);
}

function resetAll() {
  selectedFile = null;
  fileInput.value = "";
  uploadBtn.disabled = true;
  resetBtn.disabled = true;
  setInfo("");
}

dropzone.addEventListener("click", () => fileInput.click());
fileInput.addEventListener("change", (e) => setFile(e.target.files?.[0]));

["dragenter", "dragover"].forEach(evt => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
});
["dragleave", "drop"].forEach(evt => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  });
});
dropzone.addEventListener("drop", (e) => {
  setFile(e.dataTransfer?.files?.[0]);
});

resetBtn.addEventListener("click", resetAll);

uploadBtn.addEventListener("click", () => {
  if (!selectedFile) return;
  alert("다음 단계: presigned URL 연동");
});
