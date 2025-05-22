function showFloatingAlert(message) {
  alertMessageElement.textContent = message;
  floatingAlertElement.style.display = "block";
  setTimeout(() => {
    floatingAlertElement.style.display = "none";
  }, 5000);
}

function updateCopyButton(button, copied) {
  const copyIcon = button.querySelector(".copy-icon");
  const copyText = button.querySelector(".copy-text");
  button.classList.toggle("btn-secondary", !copied);
  button.classList.toggle("btn-success", copied);
  copyIcon.classList.toggle("fa-copy", !copied);
  copyIcon.classList.toggle("fa-check", copied);
  copyText.textContent = copied ? "Copied" : "Copy";
}

function populateGroupNames(json, permissions) {
  const groupNames = [...new Set(permissions.map((p) => p.nameGroup))];
  groupNameSelectElement.innerHTML = groupNames
    .map((name) => `<option value="${name}">${name}</option>`)
    .join("");
  updatePermissionOutput(json);
}

function displayConvertedJson(convertedJson) {
  outputJsonElement.textContent = JSON.stringify(convertedJson, null, 2);
  hljs.highlightElement(outputJsonElement);
  outputBlockElement.style.display = "block";
}

async function fetchJsonInput(url) {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      showFloatingAlert("Network response was not ok!");
      return;
    }
    const text = await response.text();
    if (text.startsWith("<?xml") || text.startsWith("<")) {
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(text, "text/xml");
      const jsonText = xmlDoc.getElementsByTagName("Json")[0].textContent;
      return jsonText;
    } else {
      return text;
    }
  } catch (error) {
    showFloatingAlert(
      "There has been a problem with your fetch operation: " + error
    );
  }
}

function validateInputs() {
  let isValid = true;
  if (!inputJsonElement.value.trim()) {
    inputJsonElement.classList.add("is-invalid");
    document.getElementById("inputJsonError").style.display = "block";
    isValid = false;
  } else {
    inputJsonElement.classList.remove("is-invalid");
    document.getElementById("inputJsonError").style.display = "none";
  }
  if (!inputNameElement.value.trim()) {
    inputNameElement.classList.add("is-invalid");
    document.getElementById("inputNameError").style.display = "block";
    isValid = false;
  } else {
    inputNameElement.classList.remove("is-invalid");
    document.getElementById("inputNameError").style.display = "none";
  }

  return isValid;
}

function clearValidation() {
  inputJsonElement.classList.remove("is-invalid");
  inputNameElement.classList.remove("is-invalid");
  document.getElementById("inputJsonError").style.display = "none";
  document.getElementById("inputNameError").style.display = "none";
}
