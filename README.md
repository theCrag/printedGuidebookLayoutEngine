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

**Users of the Crag currently have the possibility to open an HTML guide which shows the information about the selected area. The printed version of such an area is not optimized for A4 pages, it is just a normal webpage. The HTML guide should be extended with a PDF print option, which automatically generates a PDF booklet with a nice-looking layout and some variable content.**

A micro-service should create a PDF from a given area while it observes predefined constraints. An algorithm traverses the given area and places all the elements within A4 pages. Assuming that an element does not fit in the current page, the algorithm automatically creates a new sheet and adds the content there. One ability of the algorithm is to determine if the element has enough space on a page and even guarantees that content, which belongs together, are in sight. This implies that the user needs as less scrolling as possible to read the placed content. Whenever there is a free spot in the document it should be filled up with a picture from the current area or an advertisement. Moreover, the mentioned advertisements should be evenly spread over the document. There are some topology images of the climbing routes, these images should automatically have a suitable width and height. This is necessary to show all details on a big topology but to avoid having a big image if there are only a few routes on it. At the end, the PDF also haves a table of content and a cover page to gain a nice-looking guide.

<hr>

## Table of Contents

- [Getting Started](#getting-started)
- [Deploying](#deploying)
- [Example Documents](#example-documents)
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

### Step 4: Disable CORS in your browser

Go to the [Chrome Web Store](https://chrome.google.com/webstore/search/cors) and search for `Disable CORS` and install it. As long as the app is used locally it is important that this plugin is activated.

<hr>

## Deploying

First build the app with the terminal command `npm run build`. This will bundle the app and
saves the bundle in the `./dist` folder.

Next steps could be to `copy&paste` the content of the `./dist` folder to a your production environment.

<hr>

## Example Documents

To render an area just copy the url from the theCrag website after the keyword `climbing`

> https://www.thecrag.com/climbing`/switzerland/murgtal`

Then copy this path to the apps path. In development it would be `http://localhost:1234`.

> http://localhost:1234`/switzerland/murgtal`

Here are some possible example areas to render.

| Name                               | Links                       |
| ---------------------------------- | --------------------------------- |
| Spain Central Park | [theCrag](https://www.thecrag.com/climbing/spain/alto-mijares/hoz-del-mijares/area/587217471) [App](http://localhost:1234/spain/alto-mijares/hoz-del-mijares/area/587217471) |
| Spain Alto Mijares | [theCrag](https://www.thecrag.com/climbing/spain/alto-mijares) [App](http://localhost:1234/spain/alto-mijares) |
| United-States St-George Welcome-Springs | [theCrag](https://www.thecrag.com/climbing/united-states/st-george/welcome-springs) [App](http://localhost:1234/united-states/st-george/welcome-springs) |
| Uganda | [theCrag](https://www.thecrag.com/climbing/uganda) [App](http://localhost:1234/uganda) |
| Switzerland Murgtal | [theCrag](https://www.thecrag.com/climbing/switzerland/murgtal) [App](http://localhost:1234/switzerland/murgtal) |
| Australia Gara-Gorge | [theCrag](https://www.thecrag.com/climbing/australia/gara-gorge) [App](http://localhost:1234/australia/gara-gorge) |
| Australia Frog-Buttress | [theCrag](https://www.thecrag.com/climbing/australia/frog-buttress) [App](http://localhost:1234/australia/frog-buttress) |

<hr>

## Further Documentations

| Name & Link                        | Description                       |
| ---------------------------------- | --------------------------------- |
| [Parcel JS](https://parceljs.org/) | Web application bundler. |
| [jQuery](https://jquery.com/)      | Library for DOM selecting and manipulations. |
| [Lodash](https://lodash.com/)      | Utility library for common array & object operations. |
| [logdown](https://caiogondim.github.io/logdown.js/)      | Logger library. |
| [paper-css](https://github.com/cognitom/paper-css)      | CSS library for html printing. |
