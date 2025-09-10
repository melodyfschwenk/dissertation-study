# Dissertation Study

This project collects video upload data for a dissertation study.

## Installation

Install dependencies:

```bash
npm install
```

## Build

Compile source files in `src/` to `main.js`:

```bash
npm run build
```

Run this after any changes to files in `src/`.

## Start

Start the Node server:

```bash
npm start
```

Check the console for warnings or errors during startup.

The server applies simple rate limiting and blocks requests from private or malformed IP addresses.

## Environment variables

Create a `.env` file or export these variables before running the server:

```
SHEETS_URL=<Google Sheets endpoint>
CLOUDINARY_CLOUD_NAME=<Cloudinary cloud name>
CLOUDINARY_UPLOAD_PRESET=<Cloudinary upload preset>
PORT=<optional port, defaults to 3000>
```

Do not commit the `.env` file to version control.

The Uploadcare widget uses the public key `5bbde6a6390e682bbbe7`, which is already configured in the client.
