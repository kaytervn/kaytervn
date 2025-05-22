import { GORGEOUS_SWAGGER } from "../types/pageConfig";
import {
  addItemToStorage,
  decrypt,
  findStorageItemBy,
  generateUniqueId,
  getRandomColor,
} from "../types/utils";

const getNewCollectionName = (name: string): string => {
  let newName = name;
  let count = 1;
  while (findStorageItemBy(GORGEOUS_SWAGGER.name, "collectionName", newName)) {
    newName = `${name} (${count})`;
    count++;
  }
  return newName;
};

const mapCollectionRequests = (requests: any) => {
  return requests.map(
    ({
      name,
      method,
      body,
      path,
      preScriptIsChecked,
      preScript,
      postScriptIsChecked,
      postScript,
      authKind,
      folder,
      host,
    }: any) => ({
      name,
      method,
      ...(["post", "put"].includes(method) && { body }),
      path,
      ...(preScriptIsChecked && { preScript }),
      ...(postScriptIsChecked && { postScript }),
      authKind: authKind || "0",
      folder: folder || "custom-requests",
      host: host || "",
    })
  );
};

const importCollectionData = (data: string) => {
  try {
    const decryptedData = JSON.parse(decrypt(data));
    if (!Array.isArray(decryptedData)) {
      return 0;
    }
    for (const item of decryptedData) {
      addItemToStorage(GORGEOUS_SWAGGER.name, {
        ...item,
        collectionName: getNewCollectionName(item.collectionName),
        id: generateUniqueId(),
        color: getRandomColor(),
        createdAt: new Date(),
      });
    }
    return decryptedData.length;
  } catch (ignored) {
    return 0;
  }
};

const getUniqueFolders = (requests: any) => {
  const folderSet = new Set<string>();
  folderSet.add("custom-requests");
  requests.forEach((request: any) => {
    if (request.folder) {
      folderSet.add(request.folder);
    }
  });
  return Array.from(folderSet);
};

export {
  mapCollectionRequests,
  importCollectionData,
  getNewCollectionName,
  getUniqueFolders,
};
