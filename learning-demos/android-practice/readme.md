<h2>Android Studio</h2>

- On set up New Project:
  - Minimum SDK: `API 21 ("Lolipop"; Android 5.0)`
- At design layout page, you can click the `Pixel` on the menu bar to choose which device frame to display.

  - You can also open `Layout Validation` view which is presented at the column menu on the right edge.

- Switch to another activity:

```java
Intent intent = new Intent(this, TargetActivity.class);
intent.putExtra("key", "value");
startActivity(intent);
```

<h2>Notes</h2>

- From directory `app/manifests/AndroidManifest.xml`, you can decide which activity to be a MAIN.

```xml
<activity
    ...
    android:exported="true">
    <intent-filter>
        <action android:name="android.intent.action.MAIN" />

        <category android:name="android.intent.category.LAUNCHER" />
    </intent-filter>
</activity>
```

- File `build.gradle.kts`: add dependencies.
- Config data binding feature.

```kts
android {
    ...
    buildFeatures {
        dataBinding = true
    }
}
```

- Don't use `switch/case`, use `if/else` instead.

<h2>Resetting Vector Assets</h2>

- cd to `C:\Users\<user-name>\AppData\Local\Android\Sdk\icons\material`.

- Delete file `icons_metadata.txt`.

<h2>Apply Permissions</h2>

`AndroidManifest.xml`

```xml
<!--Network Permissions-->
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
<uses-permission android:name="android.permission.INTERNET" />

<!--Storage Permissions-->
<uses-permission android:name="android.permission.READ_MEDIA_IMAGES" />
<uses-permission android:name="android.permission.READ_MEDIA_AUDIO" />
<uses-permission android:name="android.permission.READ_MEDIA_VIDEO" />
<uses-permission android:name="android.permission.READ_EXTERNAL_STORAGE" />
<uses-permission
    android:name="android.permission.WRITE_EXTERNAL_STORAGE"
    tools:ignore="ScopedStorage" />

<!--Bluetooth Permissions-->
<uses-permission android:name="android.permission.BLUETOOTH" />
<uses-permission android:name="android.permission.BLUETOOTH_ADMIN" />
<uses-permission android:name="android.permission.BLUETOOTH_CONNECT" />
<uses-permission android:name="android.permission.BLUETOOTH_SCAN" />
```

<h2>All techniques learned</h2>

- Databinding/Mapping
- RecyclerView
- Call API Volley/Retrofit2
- Hide Android title Bar
- Toast, Popup Menu, Alert Dialog
- Intent, putExtra()
- AutoCompleteTextView, ProgressBar, SeekBar
- Layout: Relative, Grid, Table, Contraint, Frame, Linear
- Shared Preferences, Internal/External Storage
- Thread, Handler, AsyncTask
- Fragment, Tablayout, ViewPager2
- Upload File/Image
- Indicator and Search in RecyclerView, Slide Images
- Webview Client
- Firebase realtime database
