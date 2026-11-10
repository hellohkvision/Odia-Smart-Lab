# Stable Android APK signing

The normal Android build still creates a debug APK. The manually run **Signed Android APK** workflow creates a release APK with the same keystore each time, and verifies its signature.

## One-time setup (repository owner)

1. In Android Studio, choose **Build > Generate Signed Bundle / APK** and create a keystore, or use the original keystore if one was already used for the installed application. Keep a secure offline backup of the keystore and both passwords. Never commit it to this repository or share passwords in chat.
2. Add the following repository secrets in **Settings > Secrets and variables > Actions**:
   - `ANDROID_KEYSTORE_BASE64`: the full base64 contents of the keystore file.
   - `ANDROID_KEYSTORE_PASSWORD`: the keystore password.
   - `ANDROID_KEY_ALIAS`: the key alias.
   - `ANDROID_KEY_PASSWORD`: the key password.
3. To copy a keystore's base64 on Windows, open PowerShell and run the following, substituting your own path:
   `[Convert]::ToBase64String([IO.File]::ReadAllBytes('C:\path\to\your-keystore.jks')) | Set-Clipboard`
   Paste the copied value directly into the GitHub secret. Do not put the keystore or its encoded value in Git.
4. Open **Actions > Signed Android APK > Run workflow**. Download **odia-smart-lab-signed-apk** from the completed run.

Each workflow run uses its GitHub run number as the Android version code; keep it greater than the installed version code. Future APKs can update an installed app only when the application ID and signing certificate match and the version code is not lower. A newly created keystore cannot update an existing app signed with a different key. Export important locally saved boards before uninstalling any incompatible existing app.

Losing the keystore or passwords can prevent future updates from being signed with the same key. Keep a secure backup. This APK is signed for direct installation; Google Play has additional app-signing and release requirements.
