# Odia Smart Lab for Android

Android Studio project wrapping the existing offline classroom web app in a WebView. Includes whiteboard, letter tracing, lesson cards, quiz and Android file-picker export of board images. The Odia smartboard concept shown in earlier mockups and interactive audio activities are not yet implemented.

## Open and build

1. Open this `android` directory in Android Studio.
2. Use JDK 17 or 21 and install Android SDK Platform 35 when prompted.
3. Sync the project using its included Gradle 8.9 wrapper. The first sync needs internet access to download Gradle and the Android Gradle plugin.
4. Connect an Android device with USB debugging, or start an emulator, and select Run. To build an APK, choose Build > Build APK(s).

No Android SDK or Gradle was available in the development workspace, so this project has not been built or tested on an Android device. Board state is local to the device and may be removed if app data is cleared. Internet is not required by the bundled lessons. PNG export uses the system file picker.
