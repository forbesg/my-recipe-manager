import React, { Component } from 'react';
import firebase from 'firebase';
import { storage } from '../../firebase/firebase-init';

const recipeStorageRef = storage().ref('/recipes');
const recipeDatabaseRef = firebase.database().ref(`/recipes`);

class ImageUploader extends Component {
  constructor () {
    super();
    this.handleAllowDrop = this.handleAllowDrop.bind(this);
    this.handleDrop = this.handleDrop.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.state = {
      uploadProgress: null,
      imageName: null,
      imageURL: null,
      infoText: null
    }
  }
  handleAllowDrop (e) {
    e.preventDefault();
  }
  handleDrop (e) {
    e.preventDefault();
    this.refs.image.files = e.dataTransfer.files;
  }
  handleChange (e) {
    e.preventDefault();
    if (this.refs.image.files[0]) {
      this.setState({
        imageName: this.refs.image.files[0].name
      });
    } else {
      console.log('no change');
    }
  }
  handleSubmit (e) {
    e.preventDefault();
    let files = this.refs.image.files;
    console.log(files)
    if (files.length < 1) {
      this.setState({
        infoText: true
      });
      return setTimeout(() => {
        this.setState({
          infoText: null
        });
      }, 5000);
    }
    let fileExt = files[0].name.split('.').pop();
    let uploadImage = recipeStorageRef.child(`/${this.props.recipeKey}/image.${fileExt}`).put(files[0]);
    // 100x100 Thumbnail automatically produced using cloud functions

    uploadImage.on('state_changed', snap => {
      let uploadProgress = (snap.bytesTransferred / snap.totalBytes) * 100;
      this.setState({
        uploadProgress
      });
    }, err => {
      console.log(err);
    }, () => {
      console.log("Successful upload");
      let image = {
        url: uploadImage.snapshot.downloadURL,
        fileName: `image.${fileExt}`
      }
      recipeDatabaseRef.child(`/${this.props.recipeKey}/image`).set(image).then(() => {
        console.log('successfully uploaded');
        recipeDatabaseRef.child(`/${this.props.recipeKey}/thumb`).set(false).then(() => {
          console.log('added thumbnail [false]');
          recipeDatabaseRef.child(`/${this.props.recipeKey}/thumb`).on('value', snap => {
            console.log(snap.val());
            if (snap.val()) {
              recipeStorageRef.child(`/${this.props.recipeKey}/thumbnail/thumb_image.${fileExt}`).getDownloadURL().then(url => {
                let thumbnail = {
                  url,
                  fileName: `thumb_image.${fileExt}`
                }
                recipeDatabaseRef.child(`/${this.props.recipeKey}/thumbnail`).set(thumbnail).then(() => {
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
        })

      }).catch(err => {
        console.log(err);
      });
      this.setState({
        uploadProgress: null,
        imageName: null,
        image
      });
    });
  }
  render () {
    let progressBar = this.state.uploadProgress ? (
      <div className="progress-bar-container">
        <progress min="0" max="100" value={this.state.uploadProgress}></progress>
      </div>
    ) : null;
    let recipeImage = this.state.imageURL ? (
      <div className="recipe-image-thumb">
        <img src={this.state.imageURL} alt="recipe" />
      </div>
    ) : null;
    let labelText = this.state.imageName ? (
      `Upload ${this.refs.image.files[0].name}`
    ) : "Choose a file - or drag it here";
    let infoText = this.state.infoText ? "Please Select an Image" : null;

    return (
      <div className="overlay">
        {recipeImage}
        <form onSubmit={this.handleSubmit}
              onDragOver={this.handleAllowDrop}
              onDragEnter={this.handleAllowDrop}
              onDrop={this.handleDrop}>
          <div className="upload-image">
            <input type="file" name="image" id="image" ref="image" accept="image/*" onChange={this.handleChange}/>
            <label htmlFor="image">{labelText}</label>
          </div>
          <button type="submit">Upload Image</button><span className="image-upload-info">{infoText}</span>
        </form>
        {progressBar}
      </div>
    )
  }

}

export default ImageUploader;
