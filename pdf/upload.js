// 브라우저가 파일을 페이지로 열어버리는 기본 동작 방지
document.addEventListener("dragover", (e) => e.preventDefault());
document.addEventListener("drop", (e) => e.preventDefault());

const dropzone = document.getElementById("dropzone");
const fileInput = document.getElementById("fileInput");
const fileInfo = document.getElementById("fileInfo");
const uploadBtn = document.getElementById("uploadBtn");
const resetBtn = document.getElementById("resetBtn");

let selectedFiles = [];

function showMessage(msg, ok = true) {
  const prev = document.getElementById("msgLine");
  if (prev) prev.remove();

  if (!msg) return;

  const div = document.createElement("div");
  div.id = "msgLine";
  div.style.marginTop = "12px";
  div.style.fontWeight = "700";
  div.style.color = ok ? "#741E37" : "#c33"; 
  div.textContent = msg;

  fileInfo.parentNode.insertBefore(div, fileInfo);
}

function isPdf(file) {
  const nameOk = file.name.toLowerCase().endsWith(".pdf");
  const typeOk = (file.type === "application/pdf" || file.type === "");
  return nameOk && typeOk;
}

function setButtons() {
  const hasFiles = selectedFiles.length > 0;
  uploadBtn.disabled = !hasFiles;
  resetBtn.disabled = !hasFiles;
}

function renderFileList(files) {
  fileInfo.innerHTML = "";

  files.forEach((file, idx) => {
    const item = document.createElement("div");
    item.className = "file-item";

    const left = document.createElement("div");
    left.className = "file-left";

    const name = document.createElement("div");
    name.className = "file-name";
    name.textContent = file.name;

    const meta = document.createElement("div");
    meta.className = "file-meta";
    meta.textContent = `${Math.round(file.size / 1024)} KB`;

    left.appendChild(name);
    left.appendChild(meta);

    const delBtn = document.createElement("button");
    delBtn.type = "button";
    delBtn.className = "delete-btn";
    delBtn.setAttribute("aria-label", `${file.name} 삭제`);
    delBtn.textContent = "✕";  

    delBtn.addEventListener("click", () => {
      selectedFiles.splice(idx, 1);
      renderFileList(selectedFiles);
      setButtons();
      if (selectedFiles.length === 0) showMessage("");
    });

    item.appendChild(left);
    item.appendChild(delBtn);

    fileInfo.appendChild(item);
  });
}

function addFiles(fileList) {
  const files = Array.from(fileList || []);
  if (files.length === 0) return;

  for (const file of files) {
    if (!isPdf(file)) {
      showMessage("PDF 파일만 가능합니다.", false);
      return;
    }

    const exists = selectedFiles.some(
      (f) => f.name === file.name && f.size === file.size
    );
    if (!exists) selectedFiles.push(file);
  }

  showMessage("");
  renderFileList(selectedFiles);
  setButtons();
}

function resetAll() {
  selectedFiles = [];
  fileInput.value = "";
  renderFileList(selectedFiles);
  setButtons();
  showMessage("");
}

dropzone.addEventListener("click", () => fileInput.click());

fileInput.addEventListener("change", (e) => {
  addFiles(e.target.files);
  fileInput.value = "";
});

["dragenter", "dragover"].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.add("dragover");
  });
});

["dragleave", "drop"].forEach((evt) => {
  dropzone.addEventListener(evt, (e) => {
    e.preventDefault();
    dropzone.classList.remove("dragover");
  });
});

dropzone.addEventListener("drop", (e) => {
  addFiles(e.dataTransfer?.files);
});

resetBtn.addEventListener("click", resetAll);

uploadBtn.addEventListener("click", () => {
  if (selectedFiles.length === 0) return;
  alert(`${selectedFiles.length}개 파일 업로드 (다음 단계: presigned URL 연동)`);
});

setButtons();
