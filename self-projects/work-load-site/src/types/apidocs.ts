const fetchJsonInput = async (url: any) => {
  try {
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
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
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const convertJson = async (url: any) => {
  let inputJson: any;
  try {
    inputJson = await fetchJsonInput(url);
    const parsedJson = JSON.parse(inputJson);
    const convertedJson = addControllerItems(parsedJson);
    return convertedJson;
  } catch (error: any) {
    throw new Error(error.message);
  }
};

const removeCircularReferences = (obj: any) => {
  const seen = new WeakSet();
  const clean: any = (value: any) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
      if (Array.isArray(value)) {
        return value.map(clean);
      } else {
        const cleanedObj: any = {};
        for (const key in value) {
          if (value.hasOwnProperty(key)) {
            const cleanedValue = clean(value[key]);
            if (cleanedValue !== undefined) {
              cleanedObj[key] = cleanedValue;
            }
          }
        }
        return cleanedObj;
      }
    }
    return value;
  };
  return clean(obj);
};

const addControllerItems = (json: any) => {
  const controllerItems: any = {};
  Object.entries(json.paths).forEach(([path, methods]: any) => {
    Object.entries(methods).forEach(([method, operation]: any) => {
      const controllerName = operation.tags[0].replace("-controller", "");
      if (!controllerItems[controllerName]) {
        controllerItems[controllerName] = { name: controllerName, item: [] };
      }
      const request: any = createRequest(json, method, path, operation);
      request.response = createResponse(json, operation.responses);
      request.description = createDescription(controllerName, path);
      controllerItems[controllerName].item.push(request);
    });
  });
  return Object.values(controllerItems);
};

const createDescription = (controllerItemName: any, path: any) => {
  const str =
    path
      .replace(/\/\{[^}]+\}/g, "")
      .split("/")
      .at(-1)
      .replace("list", "get-list") +
    "-" +
    controllerItemName;
  let name = str.replace(/-/g, " ");
  name = name.charAt(0).toUpperCase() + name.slice(1);
  return name;
};

const resolveProperties = (json: any, property: any) => {
  if (property?.$ref) {
    const refName = property.$ref.split("/").pop();
    property = json.definitions[refName]?.properties || property;
  }
  return property;
};

const resolveArrayProperties = (json: any, property: any) => {
  if (property?.items?.$ref) {
    const refName = property.items.$ref.split("/").pop();
    property = json.definitions[refName]?.properties || property;
  }
  property = getDataTypeByFormat(property);
  if (typeof property === "object") {
    for (const h in property) {
      property[h] = resolveProperties(json, property[h]);
      property[h] = getDataTypeByFormat(property[h]);
      if (typeof property[h] === "object") {
        for (const k in property[h]) {
          property[h][k] = resolveProperties(json, property[h][k]);
          property[h][k] = getDataTypeByFormat(property[h][k]);
          if (typeof property[h][k] === "object") {
            for (const q in property[h][k]) {
              property[h][k][q] = resolveProperties(json, property[h][k][q]);
              property[h][k][q] = getDataTypeByFormat(property[h][k][q]);
            }
          }
        }
      }
    }
  }
  return property;
};

const getDataTypeByFormat = (value: any) => {
  if (value.format === "int64") {
    return `Long`;
  } else if (value.format === "int32") {
    return `Integer`;
  } else if (value.format === "double") {
    return `Double`;
  } else if (value.format === "float") {
    return `Float`;
  } else if (value.format === "date-time") {
    return `Date (DD/MM/YYYY HH:mm:ss)`;
  } else if (value.type === "string") {
    return `String`;
  } else if (value.type === "boolean") {
    return `Boolean`;
  } else if (value.type === "array") {
    return [];
  } else if (value.type === "object") {
    return "Object";
  } else {
    return value;
  }
};

const getDataTypeByType = (type: any) => {
  if (type === "int64") {
    return `Long`;
  } else if (type === "int32") {
    return `Integer`;
  } else if (type === "double") {
    return `Double`;
  } else if (type === "float") {
    return `Float`;
  } else if (type === "date-time") {
    return `Date (DD/MM/YYYY HH:mm:ss)`;
  } else if (type === "string") {
    return `String`;
  } else if (type === "boolean") {
    return `Boolean`;
  } else if (type === "integer") {
    return `Integer`;
  } else if (type === "array") {
    return [];
  } else if (type === "object") {
    return "Object";
  } else {
    return null;
  }
};

const createResponse = (json: any, responses: any) => {
  const schemaType = responses["200"]?.schema?.$ref;
  if (schemaType) {
    const schemaName = schemaType.split("/").pop();
    let properties = json.definitions[schemaName]?.properties;
    if (properties) {
      for (const key in properties) {
        properties[key] = resolveProperties(json, properties[key]);
        if (properties[key].type) {
          properties[key] = getDataTypeByType(properties[key].type);
        } else {
          if (typeof properties[key] === "object") {
            for (const k in properties[key]) {
              if (properties[key][k].$ref) {
                properties[key][k] = resolveProperties(
                  json,
                  properties[key][k]
                );
                properties[key][k] = getDataTypeByFormat(properties[key][k]);
                if (typeof properties[key][k] === "object") {
                  for (const q in properties[key][k]) {
                    properties[key][k][q] = resolveProperties(
                      json,
                      properties[key][k][q]
                    );
                    properties[key][k][q] = getDataTypeByFormat(
                      properties[key][k][q]
                    );
                    if (typeof properties[key][k][q] === "object") {
                      for (const j in properties[key][k][q]) {
                        properties[key][k][q][j] = resolveProperties(
                          json,
                          properties[key][k][q][j]
                        );
                        properties[key][k][q][j] = getDataTypeByFormat(
                          properties[key][k][q][j]
                        );
                        if (typeof properties[key][k][q][j] === "object") {
                          for (const m in properties[key][k][q][j]) {
                            properties[key][k][q][j][m] = resolveProperties(
                              json,
                              properties[key][k][q][j][m]
                            );
                          }
                        }
                      }
                    }
                  }
                }
              } else if (properties[key][k].type === "array") {
                properties[key][k] = [
                  resolveArrayProperties(json, properties[key][k]),
                ];
              }
              properties[key][k] = getDataTypeByFormat(properties[key][k]);
              if (typeof properties[key][k] === "object") {
                for (const h in properties[key][k]) {
                  properties[key][k][h] = getDataTypeByFormat(
                    properties[key][k][h]
                  );
                }
              }
            }
          }
        }
      }
    }
    return removeCircularReferences(properties);
  }
  return {};
};

const createRequest = (json: any, method: any, path: any, operation: any) => {
  const request = {
    method: method.toUpperCase(),
    url: path,
  };
  if (operation.parameters) {
    addQueryParams(request, operation.parameters);
    addBodyParams(json, request, operation.parameters);
  }
  return request;
};

const addQueryParams = (request: any, parameters: any) => {
  const excludedNames = [
    "offset",
    "paged",
    "sort.unsorted",
    "unpaged",
    "sort.sorted",
  ];
  const queryParams = parameters.filter(
    (p: any) => p.in === "query" && !excludedNames.includes(p.name)
  );
  if (queryParams.length > 0) {
    request.query = queryParams.map((p: any) => ({
      key:
        p.name === "pageNumber"
          ? "page"
          : p.name === "pageSize"
          ? "size"
          : p.name,
      value: getQueryParamValue(p),
    }));
  }
};

const getQueryParamValue = (param: any) => {
  let result = "";
  if (param.name === "pageSize") {
    result = `Integer (Page size), Default value: 20`;
  } else if (param.name === "pageNumber") {
    result = `Integer (Page number), Default value: 0`;
  } else if (param.format === "int64") {
    result = `Long`;
  } else if (param.format === "int32") {
    result = `Integer`;
  } else if (param.format === "double") {
    result = `Double`;
  } else if (param.format === "float") {
    result = `Float`;
  } else if (param.format === "date-time") {
    result = `Date ('DD/MM/YYYY HH:mm:ss')`;
  } else if (param.type === "string") {
    result = `String`;
  } else {
    result = `${param.type}`;
  }
  if (param.required) {
    result += `, required: true`;
  }
  return result;
};

const addBodyParams = (json: any, request: any, parameters: any) => {
  const bodyParam = parameters.find((p: any) => p.in === "body");
  if (bodyParam) {
    const schemaType =
      bodyParam.schema.type === "array"
        ? bodyParam.schema.items.$ref
        : bodyParam.schema.$ref;
    const schemaName = schemaType.split("/").pop();
    const generatedBody = generateRequestBody(
      json.definitions[schemaName].properties,
      json.definitions[schemaName].required
    );
    const requestBody =
      bodyParam.schema.type === "array" ? [generatedBody] : generatedBody;
    request.body = requestBody;
  }
};

const generateRequestBody = (properties: any, required: any) =>
  Object.entries(properties).reduce((acc: any, [key, value]) => {
    acc[key] = getPropertyValue(key, value, required);
    return acc;
  }, {});

const getPropertyValue = (key: any, value: any, required: any) => {
  const isRequired = required && required.includes(key);

  if (value.format === "date-time")
    return `Date (DD/MM/YYYY HH:mm:ss)${isRequired ? ", required: true" : ""}`;
  if (value.type === "boolean")
    return `Boolean (true/false)${isRequired ? ", required: true" : ""}`;
  if (value.format === "int64")
    return `Long${isRequired ? ", required: true" : ""}`;
  if (value.format === "int32")
    return `Integer${isRequired ? ", required: true" : ""}`;
  if (value.format === "double")
    return `Double${isRequired ? ", required: true" : ""}`;
  if (value.format === "float")
    return `Float${isRequired ? ", required: true" : ""}`;
  if (value.type === "string")
    return `String${isRequired ? ", required: true" : ""}`;
  if (value.type === "array")
    return `[]${isRequired ? ", required: true" : ""}`;

  return `<${value.type}>${isRequired ? ", required: true" : ""}`;
};

export { convertJson, fetchJsonInput };
