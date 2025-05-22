const crosshair = document.createElement("div");
crosshair.style.position = "absolute";
crosshair.style.top = "50%";
crosshair.style.left = "50%";
crosshair.style.width = "20px";
crosshair.style.height = "20px";
crosshair.style.backgroundColor = "transparent";
crosshair.style.border = "2px solid transparent";
crosshair.style.transform = "translate(-50%, -50%)";
crosshair.style.pointerEvents = "none";

const horizontalLine = document.createElement("div");
horizontalLine.style.position = "absolute";
horizontalLine.style.top = "50%";
horizontalLine.style.left = "0";
horizontalLine.style.width = "100%";
horizontalLine.style.height = "2px";
horizontalLine.style.backgroundColor = "#C40C0C";
horizontalLine.style.transform = "translateY(-50%)";

const verticalLine = document.createElement("div");
verticalLine.style.position = "absolute";
verticalLine.style.left = "50%";
verticalLine.style.top = "0";
verticalLine.style.width = "2px";
verticalLine.style.height = "100%";
verticalLine.style.backgroundColor = "#C40C0C";
verticalLine.style.transform = "translateX(-50%)";

crosshair.appendChild(horizontalLine);
crosshair.appendChild(verticalLine);

export { crosshair };
