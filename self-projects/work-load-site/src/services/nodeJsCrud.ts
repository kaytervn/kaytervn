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

  const stringFields = fields
    .filter((field: any) => field.type === "String")
    .map((field: any) => field.name);

  const output = `const ${name}_ENCRYPT_FIELDS = {
    ${name}: [${stringFields.map((name: any) => `"${name}"`).join(", ")}],
    CREATE_${name}: [${stringFields
    .map((name: any) => `"${name}"`)
    .join(", ")}],
    UPDATE_${name}: [${stringFields
    .map((name: any) => `"${name}"`)
    .join(", ")}],
  };`;

  return output;
};

// ========================================= CONSTANTS

const generateConstants = (modelName: any) => {
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();
  const output = `const ENCRYPT_FIELDS = {
  ...${upperSnakeCaseModel}_ENCRYPT_FIELDS,
};`;

  return output;
};

// ========================================= CONTROLLERS

const generateController = (modelName: any, fields: any) => {
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
  const refFieldMap = new Map(
    fields
      .filter((field: any) => field.ref)
      .map((field: any) => [field.name, field.ref])
  );

  const fieldChecks = requiredFields.map((name: any) => {
    const isRef = refFieldMap.has(name);
    const checks = [`!${name}`];
    if (isRef) {
      checks.push(`!mongoose.isValidObjectId(${name})`);
    }
    return checks.join(" || ");
  });

  const validationCheck =
    fieldChecks.length > 0
      ? `if (${fieldChecks.join(" || ")}) {
        return makeErrorResponse({
          res,
          message: "Invalid form",
        });
      }`
      : "";

  const refChecks = refFields
    .map((field: any) => {
      const fieldName = field.name;
      const refName = field.name.replace(/Id$/, "");
      const splitRef = splitModelName(field.ref, " ").toLowerCase();

      return `    if (${fieldName}) {
          const ${refName}Exists = await ${field.ref}.exists({ _id: ${fieldName} });
          if (!${refName}Exists) {
            return makeErrorResponse({
              res,
              message: "Not found ref ${splitRef}",
            });
          }
        }`;
    })
    .join("\n");

  const fieldDestructuring =
    allFieldNames.length > 0 ? `{ ${allFieldNames.join(", ")} }` : "{}";
  const updateDestructuring =
    allFieldNames.length > 0 ? `{ id, ${allFieldNames.join(", ")} }` : "{ id }";

  const encryptedFields = fields
    .map((field: any) => {
      const fieldName = field.name;
      if (field.type == "String") {
        return `    ${fieldName}: encryptCommonField(${fieldName})`;
      } else {
        if (field.ref) {
          const refName = field.name.replace(/Id$/, "");
          return `    ${refName}: ${fieldName}`;
        } else return `    ${fieldName}`;
      }
    })
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
      if (refName !== lowerModel) {
        return `import ${field.ref} from "../models/${refName}Model.js";`;
      }
      return null;
    })
    .filter(Boolean)
    .join("\n");

  return `import mongoose from "mongoose";
  import { encryptCommonField } from "../encryption/commonEncryption.js";
  import {
    decryptAndEncryptDataByUserKey,
    decryptAndEncryptListByUserKey,
    decryptDataByUserKey,
  } from "../encryption/userKeyEncryption.js";
  import ${upperModel} from "../models/${lowerModel}Model.js";
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
      await ${upperModel}.create(${createEncryptedObject});
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
      if (!id || !mongoose.isValidObjectId(id)) {
        return makeErrorResponse({
          res,
          message: "id is required",
        });
      }
  ${validationCheck}
  ${refChecks}
      const ${lowerModel}Obj = await ${upperModel}.findById(id);
      if (!${lowerModel}Obj) {
        return makeErrorResponse({ res, message: "Not found ${splitModelSpace}" });
      }
      await ${lowerModel}Obj.updateOne(${updateEncryptedObject});
      return makeSuccessResponse({ res, message: "Update ${splitModelSpace} success" });
    } catch (error) {
      return makeErrorResponse({ res, message: error.message });
    }
  };
  
  const delete${upperModel} = async (req, res) => {
    try {
      const id = req.params.id;
      const ${lowerModel} = await ${upperModel}.findById(id);
      if (!${lowerModel}) {
        return makeErrorResponse({ res, message: "Not found ${splitModelSpace}" });
      }
      await ${lowerModel}.deleteOne();
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
      const ${lowerModel} = await ${upperModel}.findById(id)${populateFields};
      if (!${lowerModel}) {
        return makeErrorResponse({ res, message: "Not found ${splitModelSpace}" });
      }
      return makeSuccessResponse({
        res,
        data: decryptAndEncryptDataByUserKey(
          req.token,
          ${lowerModel},
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
        await ${upperModel}.find()${populateFields},
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
};

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

// ================================================== PAGE CONFIG DETAILS

const generatePageConfigDetails = (modelName: any) => {
  const upperModel = upperModelName(modelName);
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();
  const lowerSnakeCaseModel = upperSnakeCaseModel.toLowerCase();
  const lowerPathCaseModel = splitModelName(modelName, "-").toLowerCase();
  const lowerspaceCaseModel = splitModelName(modelName, " ").toLowerCase();
  return `const ${upperSnakeCaseModel}_CONFIG = {
  ACCOUNT: {
    name: "${lowerSnakeCaseModel}",
    label: "${upperModel}",
    path: "/${lowerPathCaseModel}",
    element: <${upperModel} />,
  },
  CREATE_${upperSnakeCaseModel}: {
    label: "Create ${lowerspaceCaseModel}",
    path: "/${lowerPathCaseModel}/create",
    element: <Create${upperModel} />,
  },
  UPDATE_${upperSnakeCaseModel}: {
    label: "Update ${lowerspaceCaseModel}",
    path: "/${lowerPathCaseModel}/update/:id",
    element: <Update${upperModel} />,
  },
  DELETE_${upperSnakeCaseModel}: {
    label: "Delete ${lowerspaceCaseModel}",
  },
};
  `;
};

// ================================================== PAGE CONFIG

const generatePageConfig = (modelName: any) => {
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();
  return `const PAGE_CONFIG = {
  ...${upperSnakeCaseModel}_CONFIG,
};`;
};

// ================================================== DECRYPT FIELDS

const generateDecryptFields = (modelName: any, fields: any) => {
  const name = splitModelName(modelName, "_").toUpperCase();

  const stringFields = fields
    .filter((field: any) => field.type === "String")
    .map((field: any) => field.name);

  const output = `const DECRYPT_FIELDS = {
    ${name}: [${stringFields.map((name: any) => `"${name}"`).join(", ")}],
  };`;

  return output;
};

// ================================================== CLIENT CONTROLLERS

const generateClientControllers = (modelName: any) => {
  const lowerModel = lowerModelName(modelName);
  const lowerPathCaseModel = splitModelName(modelName, "-").toLowerCase();

  const output = `export const ${lowerModel}Controller = (fetchApi: any) => {
  const list = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/${lowerPathCaseModel}/list",
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
      payload,
    });

  const get = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: \`/v1/${lowerPathCaseModel}/get/\${id}\`,
      method: METHOD.GET,
      authType: AUTH_TYPE.BEARER,
    });

  const create = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/${lowerPathCaseModel}/create",
      method: METHOD.POST,
      authType: AUTH_TYPE.BEARER,
      payload,
    });

  const update = (payload: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: "/v1/${lowerPathCaseModel}/update",
      method: METHOD.PUT,
      payload,
      authType: AUTH_TYPE.BEARER,
    });

  const del = (id: any) =>
    fetchApi({
      apiUrl: ENV.MSA_API_URL,
      endpoint: \`/v1/${lowerPathCaseModel}/delete/\${id}\`,
      method: METHOD.DELETE,
      authType: AUTH_TYPE.BEARER,
    });

  return {
    list,
    get,
    create,
    update,
    del,
  };
};`;

  return output;
};

// ================================================== USE API HOOK

const generateUseApiHook = (modelName: any) => {
  const lowerModel = lowerModelName(modelName);
  return `const ${lowerModel} = ${lowerModel}Controller(fetchApi);`;
};

// ================================================== LIST LAYOUT

const getQueryFieldName = (modelName: any, fieldName: any) => {
  const lowerModel = lowerModelName(modelName);
  const upperField = upperModelName(fieldName);
  return lowerModel + upperField;
};

const generateListLayout = (modelName: any, fields: any) => {
  const upperModel = upperModelName(modelName);
  const lowerModel = lowerModelName(modelName);
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();

  const filterableFields = fields.filter((f: any) => f.type === "String");

  const columns = filterableFields.map((field: any) => {
    return `{
      label: "${splitModelName(field.name, " ")}",
      accessor: "${field.name}",
      align: ALIGNMENT.LEFT,
    }`;
  });

  const filters = filterableFields.map((field: any) => {
    const fieldName = getQueryFieldName(modelName, field.name);
    return `<InputBox2
        value={query.${fieldName}}
        onChangeText={(value: any) =>
          handleSubmitQuery({ ...query, ${fieldName}: value })
        }
        placeholder="${splitModelName(upperModelName(field.name), " ")}..."
      />`;
  });

  const output = `const initQuery = { ${filterableFields
    .map((f: any) => `${getQueryFieldName(modelName, f.name)}: ""`)
    .join(", ")} };

const ${upperModel} = () => {
  const { state } = useLocation();
  const navigate = useNavigate();
  const { setToast } = useGlobalContext();
  const {
    isModalVisible: deleteDialogVisible,
    showModal: showDeleteDialog,
    hideModal: hideDeleteDialog,
    formConfig: deleteDialogConfig,
  } = useModal();
  const { ${lowerModel}: apiList, loading: loadingList } = useApi();
  const { ${lowerModel}, loading } = useApi();

  const customFilterData = useCallback((allData: any[], query: any) => {
    return allData.filter((item) => {
      ${filterableFields
        .map((field: any) => {
          return `const ${field.name}Filter = !query.${getQueryFieldName(
            modelName,
            field.name
          )} || normalizeVietnamese(item.${
            field.name
          }).includes(normalizeVietnamese(query.${getQueryFieldName(
            modelName,
            field.name
          )}));`;
        })
        .join("\n      ")}
      return ${filterableFields
        .map((f: any) => `${f.name}Filter`)
        .join(" && ")};
    });
  }, []);

  const {
    data,
    query,
    totalPages,
    handlePageChange,
    handleSubmitQuery,
    handleDeleteItem,
    handleRefreshData,
  } = useGridViewLocal({
    initQuery: state?.query || initQuery,
    filterData: customFilterData,
    fetchListApi: apiList.list,
    decryptFields: DECRYPT_FIELDS.${upperSnakeCaseModel},
  });

  const columns = [
    ${columns.join(",\n    ")},
    renderActionButton({
      renderChildren: (item: any) => (
        <>
          <ActionEditButton onClick={() => onUpdateButtonClick(item._id)} />
          <ActionDeleteButton onClick={() => onDeleteButtonClick(item._id)} />
        </>
      ),
    }),
  ];

  const onDeleteButtonClick = (id: any) => {
    showDeleteDialog(
      configDeleteDialog({
        label: PAGE_CONFIG.DELETE_${upperSnakeCaseModel}.label,
        deleteApi: () => ${lowerModel}.del(id),
        refreshData: () => handleDeleteItem(id),
        hideModal: hideDeleteDialog,
        setToast,
      })
    );
  };

  const onCreateButtonClick = () => {
    navigate(PAGE_CONFIG.CREATE_${upperSnakeCaseModel}.path, { state: { query } });
  };

  const onUpdateButtonClick = (id: any) => {
    navigate(PAGE_CONFIG.UPDATE_${upperSnakeCaseModel}.path.replace(":id", id), { state: { query } });
  };

  return (
    <Sidebar2
      breadcrumbs={[{ label: PAGE_CONFIG.${upperSnakeCaseModel}.label }]}
      activeItem={PAGE_CONFIG.${upperSnakeCaseModel}.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <ConfirmationDialog
            isVisible={deleteDialogVisible}
            formConfig={deleteDialogConfig}
          />
          <ToolBar
            searchBoxes={
              <>
                ${filters.join("\n                ")}
              </>
            }
            onClear={() => handleSubmitQuery(initQuery)}
            onRefresh={handleRefreshData}
            actionButtons={<CreateButton onClick={onCreateButtonClick} />}
          />
          <GridView
            isLoading={loadingList}
            data={data}
            columns={columns}
            currentPage={query.page}
            itemsPerPage={ITEMS_PER_PAGE}
            onPageChange={handlePageChange}
            totalPages={totalPages}
          />
        </>
      }
    />
  );
};

export default ${upperModel};`;

  return output;
};

// ================================================== CREATE LAYOUT

const generateCreateLayout = (modelName: string, fields: any[]) => {
  const upperModel = upperModelName(modelName);
  const lowerModel = lowerModelName(modelName);
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();
  const filterableFields = fields.filter((f: any) => f.type === "String");
  const formInit = filterableFields
    .map((f) => `${f.name}: ""`)
    .join(",\n      ");

  const validateFields = filterableFields
    .filter((f) => f.required)
    .map((f) => {
      return `if (!form.${f.name}.trim()) {
        newErrors.${f.name} = "Invalid ${f.name}";
      }`;
    })
    .join("\n    ");

  const formFields = filterableFields
    .map((f) => {
      const title = splitModelName(f.name, " ");
      return `<InputField2
              title="${title}"
              isRequired={${f.required ? "true" : "false"}}
              placeholder="Enter ${title.toLowerCase()}"
              value={form.${f.name}}
              onChangeText={(value: any) => handleChange("${f.name}", value)}
              error={errors.${f.name}}
            />`;
    })
    .join("\n\n                ");

  return `const Create${upperModel} = () => {
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.${upperSnakeCaseModel}.path,
    requireSessionKey: true,
  });
  const { ${lowerModel}, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    ${validateFields}
    return newErrors;
  };

  const { form, errors, handleChange, isValidForm } = useForm(
    {
      ${formInit}
    },
    validate
  );

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await ${lowerModel}.create(
        encryptDataByUserKey(sessionKey, form, DECRYPT_FIELDS.${upperSnakeCaseModel})
      );
      if (res.result) {
        setToast(BASIC_MESSAGES.CREATED, TOAST.SUCCESS);
        handleNavigateBack();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.${upperSnakeCaseModel}.label,
          onClick: handleNavigateBack,
        },
        { label: PAGE_CONFIG.CREATE_${upperSnakeCaseModel}.label },
      ]}
      activeItem={PAGE_CONFIG.${upperSnakeCaseModel}.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.CREATE_${upperSnakeCaseModel}.label}
            children={
              <div className="flex flex-col space-y-4">
                ${formFields}
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.CREATE}
                        color="royalblue"
                        onClick={handleSubmit}
                      />
                    </>
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default Create${upperModel};`;
};

// ================================================== UPDATE LAYOUT

const generateUpdateLayout = (modelName: string, fields: any[]) => {
  const upperModel = upperModelName(modelName);
  const lowerModel = lowerModelName(modelName);
  const upperSnakeCaseModel = splitModelName(modelName, "_").toUpperCase();
  const filterableFields = fields.filter((f: any) => f.type === "String");
  const formInit = filterableFields
    .map((f) => `${f.name}: ""`)
    .join(",\n      ");

  const validateFields = filterableFields
    .filter((f) => f.required)
    .map((f) => {
      return `if (!form.${f.name}.trim()) {
        newErrors.${f.name} = "Invalid ${f.name}";
      }`;
    })
    .join("\n    ");

  const formFields = filterableFields
    .map((f) => {
      const title = splitModelName(f.name, " ");

      return `<InputField2
                title="${title}"
                isRequired={${f.required ? "true" : "false"}}
                placeholder="Enter ${title.toLowerCase()}"
                value={form.${f.name}}
                onChangeText={(value: any) => handleChange("${f.name}", value)}
                error={errors.${f.name}}
              />`;
    })
    .join("\n\n                ");

  return `const Update${upperModel} = () => {
  const { id } = useParams();
  const [fetchData, setFetchData] = useState<any>(null);
  const { setToast, sessionKey } = useGlobalContext();
  const { handleNavigateBack } = useQueryState({
    path: PAGE_CONFIG.${upperSnakeCaseModel}.path,
    requireSessionKey: true,
  });
  const { ${lowerModel}, loading } = useApi();

  const validate = (form: any) => {
    const newErrors: any = {};
    ${validateFields}
    return newErrors;
  };

  const { form, setForm, errors, handleChange, isValidForm } = useForm(
    {
      ${formInit}
    },
    validate
  );

  useEffect(() => {
    if (!id || !sessionKey) {
      handleNavigateBack();
      return;
    }

    const fetchData = async () => {
      const res = await ${lowerModel}.get(id);
      if (res.result) {
        const data = decryptDataByUserKey(sessionKey, res.data, DECRYPT_FIELDS.${upperSnakeCaseModel});
        setFetchData(data);
        setForm({
          ${filterableFields
            .map((f) => `${f.name}: data.${`${f.name} || ""`}`)
            .join(",\n          ")}
        });
      } else {
        handleNavigateBack();
      }
    };

    fetchData();
  }, [id]);

  const handleSubmit = async () => {
    if (isValidForm()) {
      const res = await ${lowerModel}.update(
        encryptDataByUserKey(sessionKey, { id, ...form }, DECRYPT_FIELDS.${upperSnakeCaseModel})
      );
      if (res.result) {
        setToast(BASIC_MESSAGES.UPDATED, TOAST.SUCCESS);
        handleNavigateBack();
      } else {
        setToast(res.message || BASIC_MESSAGES.FAILED, TOAST.ERROR);
      }
    } else {
      setToast(BASIC_MESSAGES.INVALID_FORM, TOAST.ERROR);
    }
  };

  return (
    <Sidebar2
      breadcrumbs={[
        {
          label: PAGE_CONFIG.${upperSnakeCaseModel}.label,
          onClick: handleNavigateBack,
        },
        { label: PAGE_CONFIG.UPDATE_${upperSnakeCaseModel}.label },
      ]}
      activeItem={PAGE_CONFIG.${upperSnakeCaseModel}.name}
      renderContent={
        <>
          <LoadingDialog isVisible={loading} />
          <FormCard
            title={PAGE_CONFIG.UPDATE_${upperSnakeCaseModel}.label}
            children={
              <div className="flex flex-col space-y-4">
                ${formFields}
                <ActionSection
                  children={
                    <>
                      <CancelButton onClick={handleNavigateBack} />
                      <SubmitButton
                        text={BUTTON_TEXT.UPDATE}
                        color="royalblue"
                        onClick={handleSubmit}
                      />
                    </>
                  }
                />
              </div>
            }
          />
        </>
      }
    />
  );
};

export default Update${upperModel};`;
};

// ================================================== MAIN FUNC

const generateNodeJsCrudOutput = (input: any) => {
  const result = processFields(input);
  if (result.fields.length === 0 || !result.model.trim()) {
    return null;
  }
  const lowerModel = lowerModelName(result.model);
  const upperModel = upperModelName(result.model);
  const encryptFields = generateEncryptFields(result.model, result.fields);
  const constants = generateConstants(result.model);
  const controller = generateController(result.model, result.fields);
  const routers = generateRouter(result.model);
  const index = generateAppUse(result.model);
  const decryptFields = generateDecryptFields(result.model, result.fields);
  const clientControllers = generateClientControllers(result.model);
  const useApi = generateUseApiHook(result.model);
  const createLayout = generateCreateLayout(result.model, result.fields);
  const updateLayout = generateUpdateLayout(result.model, result.fields);
  const listLayout = generateListLayout(result.model, result.fields);
  const pageConfigDetails = generatePageConfigDetails(result.model);
  const pageConfig = generatePageConfig(result.model);

  return [
    {
      name: "encryptFieldConfig.js",
      value: encryptFields,
    },
    {
      name: "constants.js",
      value: constants,
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
    {
      name: "PageConfig.tsx",
      value: decryptFields,
    },
    {
      name: lowerModel + "Controller.ts",
      value: clientControllers,
    },
    {
      name: "useApi.ts",
      value: useApi,
    },
    {
      name: `Create${upperModel}.tsx`,
      value: createLayout,
    },
    {
      name: `Update${upperModel}.tsx`,
      value: updateLayout,
    },
    {
      name: upperModel + ".tsx",
      value: listLayout,
    },
    {
      name: "PageConfigDetails.tsx",
      value: pageConfigDetails,
    },
    {
      name: "PageConfig.tsx",
      value: pageConfig,
    },
  ].filter((item) => item.value !== undefined && item.value !== null);
};

export { generateNodeJsCrudOutput };
