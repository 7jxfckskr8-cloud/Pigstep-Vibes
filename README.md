# Pigstep Vibes

A standalone Minecraft music disc jukebox.

## Run locally

```bash
npm install
npm start
```

## Build a Mac app

```bash
npm run package:mac
```

This builds the Apple Silicon version for current Macs. The finished `.dmg` and `.zip` files are created in `dist/`. For an Intel Mac, use:

```bash
npm run package:mac:x64
```

The app is not notarized because notarization requires an Apple Developer account. When opening a downloaded build for the first time, macOS may block it. Control-click the app, choose **Open**, then choose **Open** again. If macOS still reports that the app cannot be opened, run:

```bash
xattr -dr com.apple.quarantine "/Applications/Pigstep Vibes.app"
```

Then open the app normally.

## Build for Windows 10/11

```bash
npm run package:win
```

The finished Windows installer and ZIP are created in `dist/`.
