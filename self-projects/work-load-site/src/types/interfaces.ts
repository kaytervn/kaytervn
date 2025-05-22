interface Request {
  name: string;
  path: string;
  method: string;
  body: string;
  preScript: string;
  postScript: string;
  authKind: string;
  folder: string;
  host: string;
}

interface Header {
  key: string;
  value: string;
}

interface SwaggerCollection {
  id: string;
  collectionName: string;
  local: {
    url: string;
    isInit: boolean;
    headers: Header[];
  };
  remote: {
    url: string;
    isInit: boolean;
    headers: Header[];
  };
  requests: Request[];
  color: string;
  createdAt: Date;
}

export type { SwaggerCollection, Request, Header };
