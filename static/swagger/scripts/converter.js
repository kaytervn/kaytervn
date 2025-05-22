function transformJson(json) {
  const output = createBaseStructure();
  const localItem = output.item[0];
  const remoteItem = output.item[1];
  addControllerItems(json, localItem, "localUrl");
  addControllerItems(json, remoteItem, "remoteUrl");
  if (!checkLocalUrlElement.checked) {
    output.item.splice(0, 1);
  }
  if (!checkRemoteUrlElement.checked) {
    output.item.splice(1, 1);
  }
  return output;
}

function createBaseStructure() {
  const collectionName = inputNameElement.value;
  const localUrl = inputLocalUrlElement.value;
  const remoteUrl = inputRemoteUrlElement.value;
  return {
    info: {
      name: `${collectionName} [${getCurrentDate()}]`,
      description: `API Documentation For ${collectionName}`,
      schema:
        "https://schema.getpostman.com/json/collection/v2.1.0/collection.json",
    },
    auth: {
      type: "bearer",
      bearer: [{ key: "token", value: "{{accessToken}}", type: "string" }],
    },
    event: [
      {
        listen: "prerequest",
        script: {
          type: "text/javascript",
          exec: [
            "function formatDate(date) {",
            "    const day = String(date.getDate()).padStart(2, '0');",
            "    const month = String(date.getMonth() + 1).padStart(2, '0');",
            "    const year = date.getFullYear();",
            "    const hours = String(date.getHours()).padStart(2, '0');",
            "    const minutes = String(date.getMinutes()).padStart(2, '0');",
            "    const seconds = String(date.getSeconds()).padStart(2, '0');",
            "    return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;",
            "}",
            "const currentDate = new Date();",
            "const formattedDate = formatDate(currentDate);",
            "pm.collectionVariables.set('currentDate', formattedDate);",
          ],
        },
      },
      { listen: "test", script: { type: "text/javascript", exec: [""] } },
    ],
    variable: [
      { key: "localUrl", value: `localhost:${localUrl}`, type: "string" },
      { key: "remoteUrl", value: `https://${remoteUrl}`, type: "string" },
      { key: "clientId", value: "abc_client", type: "string" },
      { key: "clientSecret", value: "abc123", type: "string" },
      { key: "accessToken", value: "", type: "string" },
      { key: "currentDate", value: `${getCurrentDate}`, type: "string" },
    ],
    item: [
      { name: "local", item: [] },
      { name: "remote", item: [] },
    ],
  };
}

function addControllerItems(json, baseItem, urlKey) {
  addAdditionalRequestItem(baseItem, urlKey);
  const controllerItems = {};
  for (const [path, methods] of Object.entries(json.paths)) {
    for (const [method, operation] of Object.entries(methods)) {
      const controllerName = operation.tags[0].replace("-controller", "");
      if (!controllerItems[controllerName]) {
        controllerItems[controllerName] = { name: controllerName, item: [] };
        baseItem.item.push(controllerItems[controllerName]);
      }
      const request = createRequest(
        json,
        method,
        path.replace("{id}", "6969696969696969"),
        operation,
        urlKey
      );
      const item = {
        name: operation.summary,
        request,
      };
      addEventScripts(item, controllerName, operation, method);
      controllerItems[controllerName].item.push(item);
    }
  }
}

function addAdditionalRequestItem(baseItem, urlKey) {
  baseItem.item.push({
    name: "requestToken",
    event: [
      {
        listen: "test",
        script: {
          exec: [
            `
            if (pm.response.json()?.access_token) { 
              pm.collectionVariables.set("accessToken", pm.response.json().access_token); 
            }
            `,
          ],
          type: "text/javascript",
        },
      },
    ],
    request: {
      auth: {
        type: "basic",
        basic: [
          { key: "username", value: "{{clientId}}", type: "string" },
          { key: "password", value: "{{clientSecret}}", type: "string" },
        ],
      },
      method: "POST",
      header: [],
      body: {
        mode: "raw",
        raw: JSON.stringify(
          {
            username: "admin",
            password: "admin123654",
            grant_type: "password",
          },
          null,
          2
        ),
        options: { raw: { language: "json" } },
      },
      url: {
        raw: `{{${urlKey}}}/api/token`,
        host: [`{{${urlKey}}}`],
        path: ["api", "token"],
      },
    },
  });
  baseItem.item.push({
    name: "permission",
    item: [
      {
        name: "create",
        request: {
          method: "POST",
          header: [
            {
              key: "Accept",
              value: "application/json",
            },
            {
              key: "Content-Type",
              value: "application/json",
            },
          ],
          body: {
            mode: "raw",
            raw: '{\n  "action": "{{action}}",\n  "description": "{{name}}",\n  "isSystem": 0,\n  "name": "{{name}}",\n  "nameGroup": "{{group}}",\n  "permissionCode": "{{permissionCode}}",\n  "showMenu": 0\n}',
            options: {
              raw: {
                language: "json",
              },
            },
          },
          url: {
            raw: `{{${urlKey}}}/v1/permission/create`,
            host: [`{{${urlKey}}}`],
            path: ["v1", "permission", "create"],
          },
        },
      },
      {
        name: "list",
        event: [
          {
            listen: "test",
            script: {
              exec: [
                "const response = pm.response.json();",
                "if (response.data) {",
                "  const ids = response.data.map(item => item.id);",
                "  pm.collectionVariables.set('permissions', JSON.stringify(ids));",
                "}",
              ],
              type: "text/javascript",
            },
          },
        ],
        request: {
          method: "GET",
          header: [
            {
              key: "Accept",
              value: "application/json",
            },
          ],
          url: {
            raw: `{{${urlKey}}}/v1/permission/list`,
            host: [`{{${urlKey}}}`],
            path: ["v1", "permission", "list"],
          },
        },
      },
    ],
  });
}

function createRequest(json, method, path, operation, urlKey) {
  const request = {
    method: method.toUpperCase(),
    header: [{ key: "Accept", value: "application/json" }],
    url: {
      raw: `{{${urlKey}}}${path}`,
      host: [`{{${urlKey}}}`],
      path: path.split("/").filter(Boolean),
    },
  };
  if (operation.parameters) {
    addQueryParams(request, operation.parameters);
    addBodyParams(json, request, operation.parameters);
  }
  return request;
}

function addQueryParams(request, parameters) {
  const excludedNames = ["offset", "paged", "sort.unsorted", "unpaged"];
  const queryParams = parameters.filter(
    (p) => p.in === "query" && !excludedNames.includes(p.name)
  );
  if (queryParams.length > 0) {
    request.url.query = queryParams.map((p) => ({
      key:
        p.name === "pageNumber"
          ? "page"
          : p.name === "pageSize"
          ? "size"
          : p.name === "sort.sorted"
          ? "sort"
          : p.name,
      value:
        p.name === "sort.sorted"
          ? "createdDate,desc"
          : p.name === "pageSize"
          ? "20"
          : p.format === "int64"
          ? "6969696969696969"
          : p.format === "int32"
          ? "0"
          : p.format === "date-time"
          ? getCurrentDate()
          : `${p.type}`,
      disabled: true,
    }));
  }
}

function addBodyParams(json, request, parameters) {
  const bodyParam = parameters.find((p) => p.in === "body");
  if (bodyParam) {
    request.header.push({ key: "Content-Type", value: "application/json" });
    const schemaType =
      bodyParam.schema.type === "array"
        ? bodyParam.schema.items.$ref
        : bodyParam.schema.$ref;
    const schemaName = schemaType.split("/").pop();
    const generatedBody = generateRequestBody(
      json.definitions[schemaName].properties
    );
    const requestBody =
      bodyParam.schema.type === "array"
        ? [generatedBody, generatedBody]
        : generatedBody;
    request.body = {
      mode: "raw",
      raw: JSON.stringify(requestBody, null, 2),
      options: { raw: { language: "json" } },
    };
  }
  const formDataParams = parameters.filter((p) => p.in === "formData");
  if (formDataParams.length > 0) {
    request.header.push({ key: "Content-Type", value: "multipart/form-data" });
    request.body = {
      mode: "formdata",
      formdata: formDataParams.map((param) => ({
        key: param.name,
        type: (param.schema?.type ?? param.type) === "file" ? "file" : "text",
      })),
      options: { raw: { language: "json" } },
    };
  }
}

function generateRequestBody(properties) {
  return Object.entries(properties).reduce((acc, [key, value]) => {
    acc[key] =
      value.format === "date-time"
        ? getCurrentDate()
        : value.type === "boolean"
        ? true
        : value.format === "int64"
        ? 6969696969696969
        : value.format === "int32"
        ? 0
        : value.type === "array"
        ? []
        : `${value.type}`;
    return acc;
  }, {});
}

function addEventScripts(item, controllerName, operation, method) {
  if (operation.summary === "list") {
    item.event = [
      {
        listen: "test",
        script: {
          exec: [
            "const response = pm.response.json();",
            "if (response.data?.content) {",
            "  const ids = response.data.content.map(item => item.id);",
            "  pm.variables.set('ids', ids);",
            "} else {",
            "  pm.variables.set('ids', []);",
            "}",
          ],
          type: "text/javascript",
        },
      },
    ];
  }
  if (controllerName === "group" && operation.summary === "update") {
    item.request.body.raw =
      '{\n  "description": "Role for super admin",\n  "id": 15,\n  "name": "ROLE SUPPER ADMIN",\n  "permissions": {{permissions}}\n}';
  } else if (method.toUpperCase() !== "GET") {
    item.event = [
      {
        listen: "prerequest",
        script: {
          exec: [
            "const ids = pm.variables.get('ids');",
            "if (ids !== null && Array.isArray(ids) && ids.length > 0) {",
            "    pm.variables.set('id', ids.shift());",
            `    pm.execution.setNextRequest('${operation.summary}');`,
            "} else {",
            "    pm.execution.setNextRequest(null);",
            "}",
          ],
          type: "text/javascript",
        },
      },
    ];
  }
}
