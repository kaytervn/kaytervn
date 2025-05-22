import {
  defaultBasicAuth,
  defaultDouble,
  defaultInteger,
  defaultLong,
  defaultNoAuth,
  defaultPageSize,
} from "./constant";
import { Header, Request } from "./interfaces";
import { getRandomQuote } from "./quotes";
import { getCurrentDate, getCurrentDate_2 } from "./utils";

const transformJson = (json: any, swaggerCollection: any) => {
  const output = createBaseStructure(swaggerCollection);
  const { local, remote, requests } = swaggerCollection;
  if (local)
    addControllerItems(
      json,
      output.item[0],
      "localUrl",
      requests,
      local.headers || []
    );
  if (remote)
    addControllerItems(
      json,
      output.item[1],
      "remoteUrl",
      requests,
      remote.headers || []
    );
  output.item = output.item.filter((item) => item.item.length > 0);
  return output;
};

const createBaseStructure = ({ collectionName, local, remote }: any) => ({
  info: {
    name: `${collectionName} ${getCurrentDate_2()}`,
    description: getRandomQuote(),
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
          "const formatDate = date => {",
          "  const pad = num => String(num).padStart(2, '0');",
          "  const d = pad(date.getDate());",
          "  const m = pad(date.getMonth() + 1);",
          "  const y = date.getFullYear();",
          "  const h = pad(date.getHours());",
          "  const min = pad(date.getMinutes());",
          "  const s = pad(date.getSeconds());",
          "  return `${d}/${m}/${y} ${h}:${min}:${s}`;",
          "};",
          "pm.collectionVariables.set('currentDate', formatDate(new Date()));",
        ],
      },
    },
    { listen: "test", script: { type: "text/javascript", exec: [""] } },
  ],
  variable: [
    { key: "localUrl", value: local?.url || "", type: "string" },
    { key: "remoteUrl", value: remote?.url || "", type: "string" },
    { key: "clientId", value: "abc_client", type: "string" },
    { key: "clientSecret", value: "abc123", type: "string" },
    { key: "accessToken", value: "", type: "string" },
    { key: "localTenantId", value: "cnttdev", type: "string" },
    { key: "remoteTenantId", value: "cntt", type: "string" },
    { key: "currentDate", value: getCurrentDate(), type: "string" },
  ],
  item: [
    { name: "local", item: [] },
    { name: "remote", item: [] },
  ],
});

const addControllerItems = (
  json: any,
  baseItem: any,
  urlKey: string,
  requests: Request[],
  headers: Header[]
) => {
  const controllerItems: Record<string, any> = {};
  Object.entries(json.paths).forEach(([path, methods]: [string, any]) => {
    Object.entries(methods).forEach(([method, operation]: [string, any]) => {
      const controllerName = operation.tags[0].replace("-controller", "");
      if (!controllerItems[controllerName]) {
        controllerItems[controllerName] = { name: controllerName, item: [] };
        baseItem.item.push(controllerItems[controllerName]);
      }
      const request = createRequest(
        json,
        method,
        path.replace("{id}", `${defaultLong}`),
        operation,
        urlKey,
        headers
      );
      const item = { name: operation.summary, request };
      addEventScripts(item, controllerName, operation, method);
      controllerItems[controllerName].item.push(item);
    });
  });
  addAdditionalRequestItem(baseItem, urlKey, headers);
  if (requests?.length > 0) {
    addCustomRequestItem(baseItem, urlKey, requests, headers);
  }
};

const addCustomRequestItem = (
  baseItem: any,
  urlKey: string,
  requests: Request[],
  headers: Header[]
) => {
  const folders = <any>[];
  requests.forEach((item: any) => {
    folders.push({ name: item.folder || "custom-requests", item: <any>[] });
  });
  requests.forEach(
    ({
      name,
      path,
      preScript,
      postScript,
      method,
      authKind,
      body,
      folder,
      host,
    }) => {
      const header = [
        { key: "Accept", value: "application/json" },
        { key: "Content-Type", value: "application/json" },
        ...headers,
      ];
      const [pathPart, queryString] = path.split("?");
      const event: any = [];
      if (preScript) {
        event.push({
          listen: "prerequest",
          script: { type: "text/javascript", exec: [preScript] },
        });
      }
      if (postScript) {
        event.push({
          listen: "test",
          script: { type: "text/javascript", exec: [postScript] },
        });
      }
      const domain = host.trim() ? host : `{{${urlKey}}}`;
      const request: any = {
        method: method.toUpperCase(),
        url: {
          raw: `${domain}${pathPart}`,
          host: [`${domain}`],
          path: pathPart.split("/").filter(Boolean),
        },
      };
      if (authKind == "1") {
        request.auth = defaultNoAuth;
      } else if (authKind == "2") {
        request.auth = defaultBasicAuth;
      }
      if (["post", "put"].includes(method.toLowerCase())) {
        request.body = {
          mode: "raw",
          raw: body,
          options: { raw: { language: "json" } },
        };
      }
      const newItem: any = {
        name,
        event,
        request,
      };
      if (method.toLowerCase() === "get" && queryString) {
        request.body = {
          mode: "formdata",
          formdata: queryString.split("&").map((param) => {
            const [key, value] = param.split("=");
            return { key, value, type: "text" };
          }),
        };
        newItem.protocolProfileBehavior = {
          disableBodyPruning: true,
        };
      }
      request.header = header;
      for (const f of folders) {
        if (folder === f.name) {
          f.item.push(newItem);
          break;
        }
      }
    }
  );
  folders.forEach((f: any) => {
    if (f.item.length > 0) {
      baseItem.item.push(f);
    }
  });
};

const addAdditionalRequestItem = (
  baseItem: any,
  urlKey: string,
  headers: Header[]
) => {
  baseItem.item.push({
    name: "requestToken",
    event: [
      {
        listen: "test",
        script: {
          exec: [
            "const { access_token, tenant_name } = pm.response.json();",
            "if (access_token) pm.collectionVariables.set('accessToken', access_token);",
            "if (tenant_name) pm.collectionVariables.set('remoteTenantId', tenant_name);",
          ],
          type: "text/javascript",
        },
      },
    ],
    request: {
      auth: defaultBasicAuth,
      method: "POST",
      header: headers,
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
    name: "default-permission",
    item: [
      {
        name: "create",
        request: {
          method: "POST",
          header: [
            { key: "Accept", value: "application/json" },
            { key: "Content-Type", value: "application/json" },
            ...headers,
          ],
          body: {
            mode: "raw",
            raw: JSON.stringify(
              {
                action: "{{action}}",
                description: "{{name}}",
                isSystem: 0,
                name: "{{name}}",
                nameGroup: "{{group}}",
                permissionCode: "{{permissionCode}}",
                showMenu: 0,
              },
              null,
              2
            ),
            options: { raw: { language: "json" } },
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
                "const { data } = pm.response.json();",
                "if (data) pm.collectionVariables.set('permissions', JSON.stringify(data.map(item => item.id)));",
              ],
              type: "text/javascript",
            },
          },
        ],
        request: {
          method: "GET",
          header: [{ key: "Accept", value: "application/json" }, ...headers],
          url: {
            raw: `{{${urlKey}}}/v1/permission/list`,
            host: [`{{${urlKey}}}`],
            path: ["v1", "permission", "list"],
          },
        },
      },
    ],
  });
};

const createRequest = (
  json: any,
  method: string,
  path: string,
  operation: any,
  urlKey: string,
  headers: Header[]
) => {
  const request: any = {
    method: method.toUpperCase(),
    header: [{ key: "Accept", value: "application/json" }, ...headers],
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
};

const addQueryParams = (request: any, parameters: any[]) => {
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
      value: getQueryParamValue(p),
      disabled: true,
    }));
  }
};

const getQueryParamValue = (param: any) => {
  if (param.name === "sort.sorted") return "createdDate,desc";
  if (param.name === "pageSize") return `${defaultPageSize}`;
  if (param.format === "int64") return `${defaultLong}`;
  if (param.format === "int32") return `${defaultInteger}`;
  if (param.format === "double" || param.format === "float")
    return `${defaultDouble}`;
  if (param.type === "boolean") return true;
  if (param.format === "date-time") return getCurrentDate();
  return `${param.type}`;
};

const addBodyParams = (json: any, request: any, parameters: any[]) => {
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
};

const generateRequestBody = (properties: any) =>
  Object.entries(properties).reduce((acc: any, [key, value]: [string, any]) => {
    acc[key] = getPropertyValue(value);
    return acc;
  }, {});

const getPropertyValue = (value: any) => {
  if (value.format === "date-time") return getCurrentDate();
  if (value.type === "boolean") return true;
  if (value.format === "int64") return defaultLong;
  if (value.format === "int32") return defaultInteger;
  if (value.format === "double" || value.format === "float")
    return defaultDouble;
  if (value.type === "array") return [];
  return `${value.type}`;
};

const addEventScripts = (
  item: any,
  controllerName: string,
  operation: any,
  method: string
) => {
  if (operation.summary.toLowerCase().includes("list")) {
    item.event = [
      {
        listen: "test",
        script: {
          exec: [
            "const { data } = pm.response.json();",
            "const ids = data?.content ? data.content.map(item => item.id) : [];",
            "console.log(JSON.stringify(ids));",
            "pm.variables.set('ids', ids);",
            "pm.collectionVariables.set('temp_ids', ids);",
          ],
          type: "text/javascript",
        },
      },
    ];
  }
  if (controllerName === "group" && operation.summary === "update") {
    item.request.body.raw = JSON.stringify(
      {
        description: "Role for super admin",
        id: 15,
        name: "ROLE SUPPER ADMIN",
        permissions: "{{permissions}}",
      },
      null,
      2
    );
  } else if (method.toUpperCase() !== "GET") {
    item.event = [
      {
        listen: "prerequest",
        script: {
          exec: [
            "const ids = pm.variables.get('ids');",
            "if (ids && Array.isArray(ids) && ids.length > 0) {",
            "  pm.variables.set('id', ids.shift());",
            `  pm.execution.setNextRequest('${operation.summary}');`,
            "} else {",
            "  pm.execution.setNextRequest(null);",
            "}",
          ],
          type: "text/javascript",
        },
      },
    ];
  }
  if (
    operation.consumes &&
    operation.consumes.includes("multipart/form-data")
  ) {
    item.event.push({
      listen: "test",
      script: {
        exec: [
          "const { data } = pm.response.json();",
          "if (data?.filePath) pm.collectionVariables.set('filePath', data.filePath);",
        ],
        type: "text/javascript",
      },
    });
  }
};

export { transformJson };
