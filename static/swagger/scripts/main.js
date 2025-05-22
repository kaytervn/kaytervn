const inputJsonElement = document.getElementById("inputJson");
const outputJsonElement = document.getElementById("outputJson");
const outputBlockElement = document.getElementById("outputBlock");
const floatingAlertElement = document.getElementById("floatingAlert");
const alertMessageElement = document.getElementById("alertMessage");
const closeAlertButton = document.getElementById("closeAlert");
const inputNameElement = document.getElementById("inputName");
const inputLocalUrlElement = document.getElementById("inputLocalUrl");
const inputRemoteUrlElement = document.getElementById("inputRemoteUrl");
const checkLocalUrlElement = document.getElementById("enableLocalUrl");
const checkRemoteUrlElement = document.getElementById("enableRemoteUrl");
const prefixSelectElement = document.getElementById("prefixSelect");
const groupNameSelectElement = document.getElementById("groupNameSelect");
const permissionOutputElement = document.getElementById("permissionOutput");
document.addEventListener("DOMContentLoaded", initializeApp);
let parsedJson;

function initializeApp() {
  hljs.highlightAll();
  loadSavedSettings();
  setupEventListeners();
}

function loadSavedSettings() {
  checkLocalUrlElement.checked =
    localStorage.getItem("checkLocalUrl") === "true";
  checkRemoteUrlElement.checked =
    localStorage.getItem("checkRemoteUrl") === "true";
  inputJsonElement.value = localStorage.getItem("inputApiUrl");
  inputNameElement.value = localStorage.getItem("collectionName");
  inputLocalUrlElement.value = localStorage.getItem("localUrl");
  inputRemoteUrlElement.value = localStorage.getItem("remoteUrl");
  inputLocalUrlElement.disabled = !checkLocalUrlElement.checked;
  inputRemoteUrlElement.disabled = !checkRemoteUrlElement.checked;
}

function setupEventListeners() {
  checkRemoteUrlElement.addEventListener("change", function () {
    inputRemoteUrlElement.disabled = !this.checked;
  });
  checkLocalUrlElement.addEventListener("change", function () {
    inputLocalUrlElement.disabled = !this.checked;
  });
  prefixSelectElement.addEventListener("change", () =>
    updatePermissionOutput(parsedJson)
  );
  groupNameSelectElement.addEventListener("change", () =>
    updatePermissionOutput(parsedJson)
  );
  closeAlertButton.onclick = () => {
    floatingAlertElement.style.display = "none";
  };
  inputJsonElement.addEventListener("input", () => {
    inputJsonElement.classList.remove("is-invalid");
    document.getElementById("inputJsonError").style.display = "none";
  });

  inputNameElement.addEventListener("input", () => {
    inputNameElement.classList.remove("is-invalid");
    document.getElementById("inputNameError").style.display = "none";
  });
}

async function convertJson() {
  clearValidation();
  if (!validateInputs()) {
    return;
  }
  if (!checkLocalUrlElement.checked && !checkRemoteUrlElement.checked) {
    showFloatingAlert("Please choose at least one URL option.");
    return;
  }
  let inputJson;
  try {
    inputJson = await fetchJsonInput(inputJsonElement.value);
    parsedJson = JSON.parse(inputJson);
    const convertedJson = transformJson(parsedJson);
    displayConvertedJson(convertedJson);
    const permissions = generatePermissions(parsedJson);
    populateGroupNames(parsedJson, permissions);
    saveSettings();
  } catch (error) {
    showFloatingAlert(error.message);
    throw error;
  }
}

function saveSettings() {
  localStorage.setItem("inputApiUrl", inputJsonElement.value);
  localStorage.setItem("checkLocalUrl", checkLocalUrlElement.checked);
  localStorage.setItem("checkRemoteUrl", checkRemoteUrlElement.checked);
  localStorage.setItem("collectionName", inputNameElement.value);
  localStorage.setItem("localUrl", inputLocalUrlElement.value);
  localStorage.setItem("remoteUrl", inputRemoteUrlElement.value);
}

document.querySelectorAll(".copy-button").forEach((button) => {
  button.addEventListener("click", () => {
    const targetId = button.getAttribute("data-copy-target");
    const targetElement = document.getElementById(targetId);
    if (targetElement) {
      const textToCopy = targetElement.value || targetElement.textContent;
      navigator.clipboard
        .writeText(textToCopy)
        .then(() => {
          updateCopyButton(button, true);
          setTimeout(() => updateCopyButton(button, false), 1500);
        })
        .catch(console.error);
    }
  });
});
