## React Native - Zalo UTE

This project serves as the user-facing mobile application for the Zalo UTE system, built using React Native. It provides users with access to a variety of features and functionalities. For the backend API repository that supports the application, please refer to the link below:

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

```sh
npm start
```

This will display a QR code in your terminal. Scan the QR code using the Expo Go app on your mobile device to view the app in action. Alternatively, you can run the app on an Android or iOS emulator.
