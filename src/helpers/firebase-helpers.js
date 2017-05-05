import firebase from 'firebase';

const recipesRef = firebase.database().ref('/recipes');
const usersRef = firebase.database().ref('/users');

export function removeFromFavorites (userKey, recipeKey, cb) {
  recipesRef.child(`${recipeKey}/favoritedBy`).once('value').then((snap) => {
    snap.forEach((user, index) => {
      if (user.val() === userKey) {
        recipesRef.child(`${recipeKey}/favoritedBy/${user.key}`).set(null).then(() => {
          console.log('Successfully removed user from recipes favoritedBy list');
          usersRef.child(`${userKey}/favorites/${recipeKey}`).set(null).then(() => {
            console.log('Successfully removed recipe from favorites');
            cb(null);
          }).catch(err => {
            console.error(err.message);
            cb(err);
          });
        }).catch(err => {
          console.error(err.message);
          cb(err);
        })
      }
    });
  });
}
