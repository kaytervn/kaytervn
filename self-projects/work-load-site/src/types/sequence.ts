const processPUML = (value: string) => {
  const inputPUML = value;
  const lines = inputPUML.split("\n").filter((line) => line.trim() !== "");
  const processedLines = processActivation(
    lines.filter(
      (line) => !line.startsWith("activate ") && !line.startsWith("deactivate ")
    )
  );
  return processedLines.join("\n");
};

const processActivation = (lines: any) => {
  const processedLines = [];
  const activeObjects = new Set();
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const arrowMatch = line.match(/(\w+)\s*(?:->|-->)\s*(\w+)\s*:/);
    if (arrowMatch) {
      const sourceObject = arrowMatch[1];
      const selfArrowMatch = line.match(/(\w+)\s*(?:->|-->)\s*\1\s*:/);
      const returnArrowMatch = line.match(/(\w+)\s*(-->)\s*(\w+)\s*:/);
      const nextLine = lines[i + 1];
      const next2Line = lines[i + 2];
      const isNextArrow = (line: any) =>
        line && line.match(/(\w+)\s*(?:->|-->)\s*(\w+)\s*:/);
      const isOptLine = (line: any) => line && line.startsWith("opt ");
      if (!activeObjects.has(sourceObject)) {
        if (selfArrowMatch) {
          const selfObject = selfArrowMatch[1];
          processedLines.push(`activate ${selfObject}`, line);
          if (
            !isOptLine(nextLine) &&
            (isNextArrow(nextLine) || isNextArrow(next2Line))
          ) {
            activeObjects.add(sourceObject);
            continue;
          }
          processedLines.push(
            `activate ${selfObject}`,
            `deactivate ${selfObject}`,
            `deactivate ${selfObject}`
          );
          continue;
        }
        if (returnArrowMatch) {
          const targetObject = returnArrowMatch[1];
          processedLines.push(
            `activate ${targetObject}`,
            line,
            `deactivate ${targetObject}`
          );
          continue;
        }
        processedLines.push(`activate ${sourceObject}`);
        activeObjects.add(sourceObject);
      } else {
        if (selfArrowMatch) {
          const selfObject = selfArrowMatch[1];
          processedLines.push(line);
          if (
            !isOptLine(nextLine) &&
            (isNextArrow(nextLine) || isNextArrow(next2Line))
          )
            continue;
          processedLines.push(
            `activate ${selfObject}`,
            `deactivate ${selfObject}`,
            `deactivate ${selfObject}`
          );
          activeObjects.delete(selfObject);
          continue;
        }
        if (returnArrowMatch) {
          const targetObject = returnArrowMatch[1];
          processedLines.push(line, `deactivate ${targetObject}`);
          activeObjects.delete(targetObject);
          continue;
        }
      }
    }
    processedLines.push(line);
  }
  return processedLines;
};

export { processPUML };
