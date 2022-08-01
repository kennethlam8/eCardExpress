# Ecardexpress

- [Init](#init)
- [Devices](#devices)
- [Physic Build](#physicBuild)

# Init
Frontend:
 - To build & start app in emulator/ remote console
```shell
yarn android / yarn ios
```
Backend:
 - To start up server in port 8080
```shell
yarn start
```

# Devices:
ios / android 11 or above

# Physic Build (Android):
- Need to remove app from the device first if any config (e.g. .env) changed
- Open the frontend android folder and build in <b>Android Studio</b>
- npx react-native run-android --reset-cache

# !!! Need to run the below script after each yarn install

Run auto script replacer
```shell
bash dependencyfix.sh
```
Known errors if not run: 
- Invariant Violation: ViewPropTypes has been removed from React Native..... 
- Execution failed for task ':react-native-mlkit-ocr:compileDebugKotlin'.

# Cache and node_modules clean up:
```shell
bash clean.sh
```