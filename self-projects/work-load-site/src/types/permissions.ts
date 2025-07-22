/* eslint-disable @typescript-eslint/no-unused-vars */
import { fetchJsonInput } from "./apidocs";

const convertJsonPermissions = async (url: any) => {
  let inputJson: any;
  try {
    inputJson = await fetchJsonInput(url);
    const parsedJson = JSON.parse(inputJson);
    const { groupNames, permissions } = generatePermissions(parsedJson);
    return { groupNames, permissions };
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const generatePermissions = (json: any) => {
  const permissions = [];
  for (const [path, methods] of Object.entries(json.paths)) {
    for (const [method, operation] of Object.entries(methods as any)) {
      const controllerName = (operation as any).tags[0].replace(
        "-controller",
        ""
      );
      const permission = generatePermissionsBodyJson(controllerName, path, 2);
      if (!path.includes("auto-complete")) {
        permissions.push(permission);
      }
    }
  }
  const groupNames = [...new Set(permissions.map((p: any) => p.group))];
  return { groupNames, permissions };
};

const formatPath = (path: any) => {
  return path.replace(/\/{[^}]+}/g, "");
};

const generatePermissionsBodyJson = (
  controllerItemName: any,
  path: any,
  prefix: any
) => {
  const groupName = controllerItemName
    .replace(/-/g, " ")
    .replace(/\b\w/g, (char: any) => char.toUpperCase());
  const permissionCode = generatePermissionCode(
    controllerItemName,
    path,
    prefix
  );
  return {
    action: formatPath(path),
    name: generatePermissionName(controllerItemName, path),
    group: groupName,
    permissionCode: permissionCode,
  };
};

const generatePermissionCode = (
  controllerItemName: any,
  path: any,
  prefix: any
) => {
  const str =
    controllerItemName +
    "-" +
    formatPath(path).split("/").at(-1).replace("get", "view");
  const words = str.split("-");
  const formatted = words.map((word, index) => {
    if (index === 0) {
      return word.substring(0, prefix).toUpperCase();
    } else {
      return word.charAt(0).toUpperCase();
    }
  });
  return formatted.join("_");
};

const generatePermissionName = (controllerItemName: any, path: any) => {
  const str =
    formatPath(path).split("/").at(-1).replace("list", "get-list") +
    "-" +
    controllerItemName;
  let name = str.replace(/-/g, " ");
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
};

export { convertJsonPermissions };
