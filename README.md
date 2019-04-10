# zeuswalletV1.0

![Zeus Wallet Preview](https://github.com/Jason-Soo/zeuswalletV1.0/blob/master/Media/homepage.png)

## Introduction
Ethereum wallet desktop app with ERC20 token supported with custom gas fees of your choice built using Electron framework


## Installation

```sh
npm install
```

## Start

```sh
npm start
```

## Firebase API
Get your Firebase API and paste it in renderer.js

```sh
var config = {
  apiKey: "ReplaceThis",
  authDomain: "ReplaceThis",
  databaseURL: "ReplaceThis",
  projectId: "ReplaceThis",
  storageBucket: "ReplaceThis",
  messagingSenderId: "ReplaceThis"
};
```

## Firebase Attribute Name
![Firebase Attribute Name](https://github.com/Jason-Soo/zeuswalletV1.0/blob/master/Media/dbName.png)
Follow this name or if you want to use your own custom attribute/variable name then please edit this part under dashboard.js 

```sh
function insertCharityOrg()
```

## Adding Admin features to your account
Just change the UID in dashboard.js and your firebase rules to 

```sh
{
  "rules": {
    ".read": true,
    ".write": "auth.uid === 'YourUID'"
  }
}
```
