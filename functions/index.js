const functions = require('firebase-functions');
const admin = require('firebase-admin');

const gcs = require('@google-cloud/storage')();
const spawn = require('child-process-promise').spawn;

admin.initializeApp(functions.config().firebase);

// [START generateThumbnail]
/**
 * When an image is uploaded in the Storage bucket We generate a thumbnail automatically using
 * ImageMagick.
 */
// [START generateThumbnailTrigger]
exports.generateThumbnail = functions.storage.object().onChange(event => {
// [END generateThumbnailTrigger]
  // [START eventAttributes]

  // Get recipe key from event data name [recipe/{key}/thumb_image]
  const recipeKey = event.data.name.split('/')[1];
  const object = event.data; // The Storage object.

  const fileBucket = object.bucket; // The Storage bucket that contains the file.
  const filePath = object.name; // File path in the bucket.
  const contentType = object.contentType; // File content type.
  const resourceState = object.resourceState; // The resourceState is 'exists' or 'not_exists' (for file/folder deletions).
  // [END eventAttributes]

  // [START stopConditions]
  // Exit if this is triggered on a file that is not an image.
  if (!contentType.startsWith('image/')) {
    console.log('This is not an image.');
    return;
  }

  // Get the file name.
  console.log(object)
  let fileName = filePath.split('/').pop();

  // Exit if the image is already a thumbnail.
  if (fileName.startsWith('thumb_')) {
    console.log('Already a Thumbnail.');
    return;
  }

  // Exit if this is a move or deletion event.
  if (resourceState === 'not_exists') {
    console.log('This is a deletion event.');
    return;
  }
  // [END stopConditions]

  // [START thumbnailGeneration]
  // Download file from bucket.
  const bucket = gcs.bucket(fileBucket);
  const tempFilePath = `/tmp/${fileName}`;
  return bucket.file(filePath).download({
    destination: tempFilePath
  }).then(() => {
    console.log('Image downloaded locally to', tempFilePath);
    // Generate a thumbnail using ImageMagick.
    return spawn('convert', [tempFilePath, '-thumbnail', '100x100>', tempFilePath]).then(() => {
      // We add a 'thumb_' prefix to thumbnails file name. That's where we'll upload the thumbnail.
      const thumbFilePath = filePath.replace(/(\/)?([^\/]*)$/, '/thumbnail$1thumb_$2');

      // Uploading the thumbnail.

      return bucket.upload(tempFilePath, {
        destination: thumbFilePath
      }).then(() => {
        console.log('thumb uploaded');
        // set recipe thumbnail value to true to trigger client to get thumbnail download URL
        admin.database().ref(`/recipes/${recipeKey}/thumbnail`).set(true).then(() => {
          console.log('Set trigger for client request thumbnail download url');
        }).catch(err => {
          console.log(err);
        });
      });
    });
  });
  // [END thumbnailGeneration]
});
// [END generateThumbnail]

exports.globalNotification = functions.database.ref('/recipes/{recipeKey}').onWrite(event => {
  if (event.data.previous.exists()) {
    return;
  }
  let owner = event.data.val().owner;
  let recipeName = event.data.val().name;
  let notification = `${owner.name} just added ${recipeName}`;
  admin.database().ref('/notification').set({
    user: owner.uid,
    message: notification
  }).then(() => {
    setTimeout(() => {
      admin.database().ref('/notification').set(null);
    }, 3000)
  }).catch(err => {
    console.log(err);
  })

})
