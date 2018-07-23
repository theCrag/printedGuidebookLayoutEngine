<p align="center">
  <img src="./logo.svg" alt="theCrag" width="400" />
</p>

<h1 align="center">Print Guidebook Layout Engine</h1>

<p align="center">
  <b>A layout engine for printed climbing guidebooks.</b></br>
  </br>
  <sub>Made with ❤️ by <a href="https://www.fhnw.ch/de/startseite">FHNW students</a>, <a href="https://github.com/hirsch88">Gery Hirschfeld</a> and <a href="https://github.com/Brunn3r">Gabriel Brunner</a></sub>
</p>

<br />

<hr>

## Why

TODO: Add vision of the "Bericht"

<hr>

## Table of Contents

- [Getting Started](#getting-started)
- [Deploying](#deploying)
- [Further Documentations](#further-documentations)

<hr>

## Getting Started

### Step 1: Set up the Development Environment

You need to set up your development environment before you can do anything.

Install [Node.js and NPM](https://nodejs.org/en/download/)

- on OSX use [homebrew](http://brew.sh) `brew install node`
- on Windows use [chocolatey](https://chocolatey.org/) `choco install nodejs`

Install yarn globally

```bash
npm install yarn -g
```

### Step 2: Clone the Project

Clone or download this project.

Then copy the `.env.example` file and rename it to `.env`. In this file all the project configurations are stored.

Then install all your dependencies.

```bash
yarn install
```

### Step 3: Serve your App

Go to the project dir and start your app with this npm script.

```bash
npm start
```

> This starts a local server on `http://localhost:1234`.

<hr>

## Deploying

First build the app with the terminal command `npm run build`. This will bundle the app and
saves the bundle in the `./dist` folder.

Next steps could be to `copy&paste` the content of the `./dist` folder to a your production environment.

<hr>

## Further Documentations

| Name & Link                        | Description                       |
| ---------------------------------- | --------------------------------- |
| [Parcel JS](https://parceljs.org/) | Web application bundler. |
| [jQuery](https://jquery.com/)      | Library for DOM selecting and manipulations. |
| [Lodash](https://lodash.com/)      | Utility library for common array & object operations. |
| [logdown](https://caiogondim.github.io/logdown.js/)      | Logger library. |
| [paper-css](https://github.com/cognitom/paper-css)      | CSS library for html printing. |
