const splitModelName = (modelName: any, delim = " ") => {
  return modelName.replace(/([a-z])([A-Z])/g, `$1${delim}$2`);
};

const upperModelName = (modelName: any) => {
  return modelName.charAt(0).toUpperCase() + modelName.slice(1);
};
const lowerModelName = (modelName: any) => {
  return modelName.charAt(0).toLowerCase() + modelName.slice(1);
};

const processFields = (schemaText: string) => {
  const result: any = { model: "", fields: [] };
  const modelMatch = schemaText.match(/mongoose\.model\("([^"]+)",/);
  if (modelMatch) result.model = modelMatch[1];
  const schemaContentMatch = schemaText.match(
    /new mongoose\.Schema\(\{([\s\S]*?)\}\)/m
  );
  if (!schemaContentMatch) return result;
  const fieldsContent = schemaContentMatch[1];
  const fieldRegex = /(\w+):\s*\{([\s\S]*?)\}/g;
  let match;
  while ((match = fieldRegex.exec(fieldsContent)) !== null) {
    const [, fieldName, fieldBody] = match;
    const field: any = { name: fieldName };
    const typeMatch = fieldBody.match(/type:\s*([A-Za-z0-9_.]+)/);
    if (typeMatch) field.type = typeMatch[1];
    const requiredMatch = fieldBody.match(/required:\s*(true|false)/);
    if (requiredMatch) field.required = requiredMatch[1] === "true";
    const refMatch = fieldBody.match(/ref:\s*"([^"]+)"/);
    if (refMatch) {
      field.ref = refMatch[1];
      field.name = fieldName + "Id";
    }
    result.fields.push(field);
  }

  return result;
};

// ========================================= ENCRYPT_FIELDS

const generateEncryptFields = (modelName: any, fields: any) => {
  const name = splitModelName(modelName, "_").toUpperCase();
  const fieldNames = fields.map((field: any) => field.name);
  const output = `const ${name.toUpperCase()}_ENCRYPT_FIELDS = {
    ${name.toUpperCase()}: [${fieldNames
    .map((name: any) => `"${name}"`)
    .join(", ")}],
    CREATE_${name}: [${fieldNames.map((name: any) => `"${name}"`).join(", ")}],
    UPDATE_${name}: ["id", ${fieldNames
    .map((name: any) => `"${name}"`)
    .join(", ")}],
  };`;

  return output;
};

// ========================================= CONTROLLERS

function generateController(modelName: any, fields: any) {
  const lowerModel = lowerModelName(modelName);
  const splitModelSpace = splitModelName(modelName, " ").toLowerCase();
  const upperModel = upperModelName(modelName);
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();

  const requiredFields = fields
    .filter((field: any) => field.required)
    .map((field: any) => field.name);
  const allFieldNames = fields.map((field: any) => field.name);
  const refFields = fields
    .filter((field: any) => field.ref)
    .map((field: any) => ({ name: field.name, ref: field.ref }));

  const validationCheck =
    requiredFields.length > 0
      ? `if (!${requiredFields.join(" || !")}) {
        return makeErrorResponse({
          res,
          message: "Invalid form",
        });
      }`
      : "";

  const refChecks = refFields
    .map((field: any) => {
      const refName = lowerModelName(field.ref);
      const splitRef = splitModelName(field.ref, " ").toLowerCase();
      return `    const ${refName}Exists = await ${field.ref}.exists({ _id: ${field.name} });
      if (!${refName}Exists) {
        return makeErrorResponse({
          res,
          message: "Not found ${splitRef}",
        });
      }`;
    })
    .join("\n");

  // Generate field destructuring for create and update
  const fieldDestructuring =
    allFieldNames.length > 0 ? `{ ${allFieldNames.join(", ")} }` : "{}";
  const updateDestructuring =
    allFieldNames.length > 0 ? `{ id, ${allFieldNames.join(", ")} }` : "{ id }";

  // Generate encrypted field assignments
  const encryptedFields = allFieldNames
    .map((name: any) => `    ${name}: encryptCommonField(${name})`)
    .join(",\n");
  const createEncryptedObject = encryptedFields
    ? `{ ${encryptedFields} }`
    : "{}";
  const updateEncryptedObject = encryptedFields
    ? `{ ${encryptedFields} }`
    : "{}";

  const populateFields =
    refFields.length > 0
      ? `.populate("${refFields
          .map((field: any) => {
            const name = field.name.replace(/Id$/, "");
            return name;
          })
          .join(" ")}")`
      : "";

  const refImports = refFields
    .map((field: any) => {
      const refName = lowerModelName(field.ref);
      return `import ${field.ref} from "../models/${refName}Model.js";`;
    })
    .join("\n");

  return `import { encryptCommonField } from "../encryption/commonEncryption.js";
  import {
    decryptAndEncryptDataByUserKey,
    decryptAndEncryptListByUserKey,
    decryptDataByUserKey,
  } from "../encryption/userKeyEncryption.js";
  import ${upperModel}Model from "../models/${lowerModel}Model.js";
  ${refImports}
  import {
    makeErrorResponse,
    makeSuccessResponse,
  } from "../services/apiService.js";
  import { ENCRYPT_FIELDS } from "../utils/constant.js";
  
  const create${upperModel} = async (req, res) => {
    try {
      const ${fieldDestructuring} = decryptDataByUserKey(
        req.token,
        req.body,
        ENCRYPT_FIELDS.CREATE_${upperSnakeCaseModel}
      );
      ${validationCheck}
  ${refChecks}
      await ${upperModel}Model.create(${createEncryptedObject});
      return makeSuccessResponse({
        res,
        message: "Create ${splitModelSpace} success",
      });
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
  
  const update${upperModel} = async (req, res) => {
    try {
      const ${updateDestructuring} = decryptDataByUserKey(
        req.token,
        req.body,
        ENCRYPT_FIELDS.UPDATE_${upperSnakeCaseModel}
      );
      ${
        requiredFields.length > 0
          ? `if (!${requiredFields.join(" || !")} || !id) {`
          : "if (!id) {"
      }
        return makeErrorResponse({
          res,
          message: "Invalid form",
        });
      }
  ${refChecks}
      const ${lowerModel} = await ${upperModel}Model.findById(id);
      if (!${lowerModel}) {
        return makeErrorResponse({ res, message: "Not found ${splitModelSpace}" });
      }
      await obj.updateOne(${updateEncryptedObject});
      return makeSuccessResponse({ res, message: "Update ${splitModelSpace} success" });
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
  
  const delete${upperModel} = async (req, res) => {
    try {
      const id = req.params.id;
      const ${lowerModel} = await ${upperModel}Model.findById(id);
      if (!${lowerModel}) {
        return makeErrorResponse({ res, message: "Not found ${splitModelSpace}" });
      }
      await obj.deleteOne();
      return makeSuccessResponse({
        res,
        message: "Delete ${splitModelSpace} success",
      });
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
  
  const get${upperModel} = async (req, res) => {
    try {
      const id = req.params.id;
      const ${lowerModel} = await ${upperModel}Model.findById(id)${populateFields};
      if (!${lowerModel}) {
        return makeErrorResponse({ res, message: "Not found ${splitModelSpace}" });
      }
      return makeSuccessResponse({
        res,
        data: decryptAndEncryptDataByUserKey(
          req.token,
          obj,
          ENCRYPT_FIELDS.${upperSnakeCaseModel}
        ),
      });
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
  
  const getList${upperModel}s = async (req, res) => {
    try {
      const objs = decryptAndEncryptListByUserKey(
        req.token,
        await ${upperModel}Model.find()${populateFields},
        ENCRYPT_FIELDS.${upperSnakeCaseModel}
      );
      return makeSuccessResponse({
        res,
        data: objs,
      });
    } catch (error) {
      return makeErrorResponse({
        res,
        message: error.message,
      });
    }
  };
  
  export {
    create${upperModel},
    update${upperModel},
    delete${upperModel},
    get${upperModel},
    getList${upperModel}s,
  };
  `;
}

// ================================================== ROUTERS

const generateRouter = (modelName: any) => {
  const upperModel = upperModelName(modelName);
  const lowerModel = lowerModelName(modelName);
  return `import express from "express";
  import { bearerAuth } from "../middlewares/auth.js";
  import {
    create${upperModel},
    update${upperModel},
    delete${upperModel},
    get${upperModel},
    getList${upperModel}s,
  } from "../controllers/${lowerModel}Controller.js";
  
  const router = express.Router();
  
  router.post("/create", bearerAuth, create${upperModel});
  router.put("/update", bearerAuth, update${upperModel});
  router.delete("/delete/:id", bearerAuth, delete${upperModel});
  router.get("/get/:id", bearerAuth, get${upperModel});
  router.get("/list", bearerAuth, getList${upperModel}s);
  
  export { router as ${lowerModel}Router };
  `;
};

const generateAppUse = (modelName: any) => {
  const lowerModel = lowerModelName(modelName);
  const kebabCaseModel = splitModelName(modelName, "-").toLowerCase();
  return `app.use("/v1/${kebabCaseModel}", ${lowerModel}Router);`;
};

// ================================================== MAIN FUNC

const generateNodeJsCrudOutput = (input: any) => {
  const result = processFields(input);
  if (result.fields.length === 0 || !result.model.trim()) {
    return null;
  }
  const lowerModel = lowerModelName(result.model);
  const encryptFields = generateEncryptFields(result.model, result.fields);
  const controller = generateController(result.model, result.fields);
  const routers = generateRouter(result.model);
  const index = generateAppUse(result.model);
  return [
    {
      name: "encryptFieldConfig.js",
      value: encryptFields,
    },
    {
      name: lowerModel + "Controller.js",
      value: controller,
    },
    {
      name: lowerModel + "Router.js",
      value: routers,
    },
    {
      name: "index.js",
      value: index,
    },
  ].filter((item) => item.value !== undefined && item.value !== null);
};

export { generateNodeJsCrudOutput };
