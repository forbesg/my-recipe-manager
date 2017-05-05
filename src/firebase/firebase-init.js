import firebase from 'firebase';
import config from './config';

firebase.initializeApp(config);

export function storage () {
  return firebase.storage();
}
