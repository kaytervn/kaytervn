## CMS - Zalo UTE

This project serves as the content management system (CMS) for the Zalo UTE application. For the backend API repository, refer to the link below:

**API Repository**: [Zalo UTE API](https://github.com/The-Cookies-Team/Realtime-Chat-App-API)

---

## Installation

To install the dependencies for the project, run the following command:

```sh
npm install
```

## Usage

### Setting constant variables

1. Open the file located at `src/types/constants.ts`
2. Update the **remoteUrl** variable to point to your API's URL.

Example:

```ts
const remoteUrl = "http://localhost:7979";
```

### Starting the application

First build the project

```sh
npm run build
```

And start it

```sh
npm start
```

Your application will be accessible from `localhost:3000`
