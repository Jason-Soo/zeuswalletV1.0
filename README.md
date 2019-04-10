# zeuswalletV1.0

## Installation

```sh
npm install
```

## Start

```sh
npm start
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
