## Flutter - Zalo UTE

This project serves as the admin and manager portal for the Zalo UTE application, built using **Flutter**. The portal provides various management features and functionalities for administrators and managers. For the backend API repository that supports the portal, refer to the link below:

**API Repository**: [Zalo UTE API](https://github.com/The-Cookies-Team/Realtime-Chat-App-API)

---

## Installation

To install the dependencies for the project, run the following command:

```sh
flutter pub get
```

## Usage

### Setting constant variables

1. Open the file located at `lib/core/constants.dart`
2. Update the **remoteUrl** variable to point to your API's URL.

Example:

```dart
static const String remoteUrl = 'http://localhost:7979';
```

### Starting the server

Run the folowing command

```sh
flutter run
```

Then, select the connected device on which you want to run the app.
