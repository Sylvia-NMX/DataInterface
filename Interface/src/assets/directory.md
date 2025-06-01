# Welcome to ClientData´s documentation file
The purpose of this file is to help you understand better how the app is configured so it will be easier for you to make changes and navigate through it. 

## Build folder
The folder of `build` contains all the coresponding files according to the last built done. 

## Node modules folder
This folder should be created after you done the `npm install` command in your terminal. 
   ```bash
   npm install
   ```
The folder should appear as `node_modules`.

## SRC
The folder `src` refers to the source part for this react app. Here you can find different resources to manage, and edit the actual app. 

### Assets

The `assets` folder, in which you are right now, contains the `images`,this markdown and the `generateHmacSignature.js`

#### images
The file named `logo.png` is the image corresponding to the NetMx logo used in the react app at the right bottom corner. 

#### generateHmacSignature.js
This file is used to generate Hmac signatures. Here you will find a main function that will be imported in the `Dashboard.js`. 

## Backend
This folder contains all the backend logic for a MySQL connection done locally. As this app is already deployed and connects itself to the deployed Flask API in the EC2, this backend is no longer necessary. Nevertheless it is left if future consultation is needed. 

## Components
This folder contains all the components corresponding to the app´s sections. You will find the files for the Header (`AppHeader.js`), body(`AppContent.js`) and Footer(`AppFooter.js`). You will also find a folder named `header` in which you will find the visual components logic used in the header of the app. 

### Header
The header folder contains the logic of the visual topdown imported from the coreiu library. 

### AppContent.js 
This file contains the logic for the routes and visualization of a page in react. In this app the main route is the dashboard one, but the code is left with the oportunity of having different routes. 

### AppHeader.js 
Here you can visualize how the header is programed and you will see two dropdowns, the one for languages and the one for the dark/light mode. 

Note: To know more about adding more languages please go to the  `languages` folder inside `src`. 

### AppFooter.js
Here you will se the logic of the footer, this app has a small footer that only includes a disclousre message and the company´s logo. 

## Languages 
In this folder you will find a markdown with instructions on how to add a new language named `Add_new_language.md`
You will also find a .json file for each current language in the app such as catalan, english, french, portuguese, and spanish. 

## Layout
This file contains a .js file named `DefaultLayout.js`. The purpose of this .js file is to give the react app a default layot in order to have a responsive design and also to import the structure of the app adding the header, body and footer respectively. 

## SCSS
Here you will find all the files corresponding to the styles of the app, including the visualization for each component such as variables, letters, contaniners, etc. 

## Views 
In this folder you will find different folders each of the including a logic of a component that can be implemented in the app. 

### Base & Buttons folders

In this folders you will see some components from the coreui library. Some of them are already used in the app like the cards, and the others are added into this repository if any other component is need in the future. To use it just import the component in the react main page named `Dashboard.js` in this same code line: 
``` bash
import { CCard, CCardBody, CCol, CRow, CFormSelect, CFormInput, CTable, CTableHead, CTableRow, CTableHeaderCell, CTableBody, CTableDataCell, CFormCheck, CButton } from '@coreui/react';
```
Just add the component you will like to import from the list. 

Each component has their own .js file in which the logic of that component is stated. Please do not modify those files unless it is strictly necessary. To use the components and change them visually do it after importing them in another different .js file such as `Dashboard.js` or whichever file you meant to import the component. 

### Charts
In this folder you will find a preliminary `Charts.js` with dummy data. This file is added just in case the future user would like to add any charts. 

### Dashboard
In this folder you will find the main page for the app named `Dasboard.js` there you will see all the code used to form the page for the client´s input data that you saw when the proyect was delivered. Here you can make all the changes you need to improve the main page. 

### Forms & icons
As well as the `base` and the `buttons` folders, these two folders contain more components that can be used the future. 

### Notifications
As one of the potential improvements was to add the visual notifications inside the app, the notifications visual components were added to this folder. 

### Pages
Here you will find some pages that can be shown to the user if some mistake happen while using the app. For example a 404 or 500 mistake, you can personalize those pages. And if needed you can add more not just for mistakes but if another view is needed you can add it inside this directory. 

### Theme
This folde contains the typography and colors used for this application.  

## App.js
This is the main app for the React proyect, here you will see that the DefalutLayout is imported and that the routes for the app are added. If you wish to add new pages, you must do it and add the corresponding routes. As the DefaultLayout is imported, the logic for the predetermined route for the Dashboard.js is added. 

## i18n.js
Here the logic for the i18n provider library is added. For more information visit the markdown inside the `languages` folder. 

## index.js
This is the main index for the app in which the whole APP is imported. 

## Routes.js
In this file all the routes for pages, components and other resources are added to make sure everything is imported properly. 

## Store.js
This file is also to modify some visual aspects of the app, for example the sidebar. 

## Other developer files
In this repository you will also find some other developer files that must not be modified unless it is striclty necessary. Some of this files are: 
* .editorconfig 
* .eslintrc.js
* .gitattributes
* .gitignore
* .prettierignore
* .prettierc.js
* index.html
* package-lock.json
* package.json

## vite.config.mjs
This file is created after building the app and will be updated each time ther is a build, please do not manually modify it. 
