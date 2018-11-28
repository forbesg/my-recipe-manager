import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

const recipesRef = firebase.database().ref('/recipes');
const usersRef = firebase.database().ref('/users');
// const recipeStorageRef = firebase.storage().ref('/recipes');

const recipeStorageRef = firebase.storage().ref('/recipes');
const recipeDatabaseRef = firebase.database().ref(`/recipes`);

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

export function uploadImageToFirebase (recipeKey, file, cb) {
  console.log(recipeKey, file);
  let fileExt = file.name.split('.').pop();
  let uploadImage = recipeStorageRef.child(`/${recipeKey}/image.${fileExt}`).put(file);
  // 100x100 Thumbnail automatically produced using cloud functions

  uploadImage.on('state_changed', snap => {
    let uploadProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
    cb(uploadProgress);
  }, err => {
    console.log(err);
  }, () => {
    console.log("Successful upload", uploadImage);
    uploadImage.snapshot.ref.getDownloadURL().then(downloadURL => {
      let image = {
        url: downloadURL,
        fileName: `image.${fileExt}`
      }
      console.log('Image Object', image);
      recipeDatabaseRef.child(`/${recipeKey}/image`).set(image).then(() => {
        console.log('successfully uploaded');
        recipeDatabaseRef.child(`/${recipeKey}/thumb`).set(false).then(() => {
          console.log('added thumbnail [false]');
          recipeDatabaseRef.child(`/${recipeKey}/thumb`).on('value', snap => {
            console.log(snap.val());
            if (snap.val()) {
              recipeStorageRef.child(`/${recipeKey}/thumbnail/thumb_image.${fileExt}`).getDownloadURL().then(url => {
                let thumbnail = {
                  url,
                  fileName: `thumb_image.${fileExt}`
                }
                recipeDatabaseRef.child(`/${recipeKey}/thumbnail`).set(thumbnail).then(() => {
                  console.log('successfully added thumbnail url');
                }).catch(err => {
                  console.error(err.message);
                })
              }).catch(err => {
                console.error(err.message);
              });
            }
          }, err => {
            console.log(err.message);
          });
        }).catch(err => {
          console.error(err.message)
        });
        cb(null, image);
      }).catch(err => {
        console.log(err);
      });
    })
  });
}

export function deleteImageFromFirebase (recipeKey, fileName, cb) {
  console.log(recipeKey, fileName)
  recipeDatabaseRef.child(`${recipeKey}/image`).set(null)
      .then(() => {
        console.log('deleted recipe image details');
        recipeDatabaseRef.child(`${recipeKey}/thumbnail`).set(null)
        .then(() => {
          console.log('deleted recipe thumbnail details');
          recipeDatabaseRef.child(`${recipeKey}/thumb`).set(null)
          .then(() => {
            console.log('Deleting from Storage');
            recipeStorageRef.child(`${recipeKey}/${fileName}`).delete()
            .then(() => {
              recipeStorageRef.child(`${recipeKey}/thumbnail/thumb_${fileName}`).delete()
              .then(() => {
                console.log('Image Delete complete');
              }).catch(err => {
                cb(err);
              });
            }).catch(err => {
              cb(err);
            });
          }).catch(err => {
            cb(err);
          });
        }).catch(err => {
          cb(err);
        });
      }).catch(err => {
      cb(err);
  });
}
