import firebase from 'firebase/app';
import 'firebase/storage';
import config from './config';

firebase.initializeApp(config);

export function storage () {
  return firebase.storage();
}

export function db () {
  return firebase.database();
}
