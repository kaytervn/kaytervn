async function fetchJsonInput(url) {
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
  } catch (error) {
    throw new Error(error.message);
  }
}

const convertJson = async (url) => {
  let inputJson;
  try {
    inputJson = await fetchJsonInput(url);
    const parsedJson = JSON.parse(inputJson);
    const convertedJson = addControllerItems(parsedJson);
    return convertedJson;
  } catch (error) {
    throw new Error(error.message);
  }
};

const removeCircularReferences = (obj) => {
  const seen = new WeakSet();
  const clean = (value) => {
    if (typeof value === "object" && value !== null) {
      if (seen.has(value)) {
        return undefined;
      }
      seen.add(value);
      if (Array.isArray(value)) {
        return value.map(clean);
      } else {
        const cleanedObj = {};
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

const addControllerItems = (json) => {
  const controllerItems = {};
  Object.entries(json.paths).forEach(([path, methods]) => {
    Object.entries(methods).forEach(([method, operation]) => {
      const controllerName = operation.tags[0].replace("-controller", "");
      if (!controllerItems[controllerName]) {
        controllerItems[controllerName] = { name: controllerName, item: [] };
      }
      const request = createRequest(json, method, path, operation);
      request.response = createResponse(json, operation.responses);
      controllerItems[controllerName].item.push(request);
    });
  });
  return Object.values(controllerItems);
};

const resolveProperties = (json, property) => {
  if (property?.$ref) {
    const refName = property.$ref.split("/").pop();
    property = json.definitions[refName]?.properties || property;
  }
  return property;
};

const resolveArrayProperties = (json, property) => {
  if (property?.items?.$ref) {
    const refName = property.items.$ref.split("/").pop();
    property = json.definitions[refName]?.properties || property;
  }
  property = getDataTypeByFormat(property);
  for (const h in property) {
    property[h] = resolveProperties(json, property[h]);
    property[h] = getDataTypeByFormat(property[h]);
  }
  return property;
};

const limitDepthAndAvoidLoop = (obj, depth = 2, seen = new WeakSet()) => {
  if (depth === 0 || obj === null || typeof obj !== "object") {
    return obj;
  }
  if (seen.has(obj)) {
    return undefined;
  }
  seen.add(obj);
  const result = Array.isArray(obj) ? [] : {};
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      result[key] = limitDepthAndAvoidLoop(obj[key], depth - 1, seen);
    }
  }
  seen.delete(obj);
  return result;
};

const getDataTypeByFormat = (value) => {
  if (value.format === "int64") {
    return `Long`;
  } else if (value.format === "int32") {
    return `Integer`;
  } else if (value.format === "double") {
    return `Double`;
  } else if (value.format === "float") {
    return `Float`;
  } else if (value.format === "date-time") {
    return `Date (Format: 'DD/MM/YYYY HH:mm:ss')`;
  } else if (value.type === "string") {
    return `String`;
  } else if (value.type === "boolean") {
    return `Boolean`;
  } else if (value.type === "array") {
    return [];
  } else {
    return value;
  }
};

const getDataTypeByType = (type) => {
  if (type === "int64") {
    return `Long`;
  } else if (type === "int32") {
    return `Integer`;
  } else if (type === "double") {
    return `Double`;
  } else if (type === "float") {
    return `Float`;
  } else if (type === "date-time") {
    return `Date (Format: 'DD/MM/YYYY HH:mm:ss')`;
  } else if (type === "string") {
    return `String`;
  } else if (type === "boolean") {
    return `Boolean`;
  } else if (type === "integer") {
    return `Integer`;
  } else if (type === "array") {
    return [];
  } else {
    return null;
  }
};

const createResponse = (json, responses) => {
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
              } else if (properties[key][k].type === "array") {
                properties[key][k] = [
                  resolveArrayProperties(json, properties[key][k]),
                ];
              }
              properties[key][k] = getDataTypeByFormat(properties[key][k]);
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
    return removeCircularReferences(properties);
  }
  return {};
};

const createRequest = (json, method, path, operation) => {
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

const addQueryParams = (request, parameters) => {
  const excludedNames = [
    "offset",
    "paged",
    "sort.unsorted",
    "unpaged",
    "sort.sorted",
  ];
  const queryParams = parameters.filter(
    (p) => p.in === "query" && !excludedNames.includes(p.name)
  );
  if (queryParams.length > 0) {
    request.query = queryParams.map((p) => ({
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

const getQueryParamValue = (param) => {
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
    result = `Date (Format: 'DD/MM/YYYY HH:mm:ss')`;
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

const addBodyParams = (json, request, parameters) => {
  const bodyParam = parameters.find((p) => p.in === "body");
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

const generateRequestBody = (properties, required) =>
  Object.entries(properties).reduce((acc, [key, value]) => {
    acc[key] = getPropertyValue(key, value, required);
    return acc;
  }, {});

const getPropertyValue = (key, value, required) => {
  const isRequired = required && required.includes(key);

  if (value.format === "date-time")
    return `Date (Format: 'DD/MM/YYYY HH:mm:ss')${
      isRequired ? ", required: true" : ""
    }`;
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

  return `<${value.type}>${isRequired ? ", required: true" : ""}`;
};
