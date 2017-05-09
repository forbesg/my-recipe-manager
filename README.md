# My Recipe Manager

## Manage, Share and fork Recipes

Built using [React (create-react-app)](https://github.com/facebookincubator/create-react-app) and [Firebase](https://firebase.google.com) Realtime database, Storage, Hosting and Cloud Functions.

Create Firebase config object from /src/firebase/config.js and export (or change location and update import statement in /src/firebase/firebase-init.js).

```bash
git clone https://github.com/forbesg/my-recipe-manager.git

cd my-recipe-manager

npm install
```

Update Firebase Cloud Functions dependencies:

```bash
cd functions

npm install
```

Cloud functions requires firebase-tools to be installed and login to firebase:

```bash
npm install -g firebase-tools

firebase login
```

Deploy Cloud Functions:

```bash
firebase deploy --only functions
```

To view locally:

```bash
npm start
```

To create production build:

```bash
npm run build
```

To deploy to Firebase Hosting:

```bash
firebase deploy
```


#### TODO

- ~~Remove Images on Recipe Delete~~
- ~~Remove recipe from users Favorites on delete~~
- ~~Add ability to delete an image~~
- ~~Improve the image upload UI/UX and~~ add uploader to Add Recipe form
- Implement Share functionality
- Implement Fork functionality

View Demo @ [https://my-recipe-manager.firebaseapp.com](https://my-recipe-manager.firebaseapp.com)


Author Forbes Gray <fnbg75@gmail.com>
