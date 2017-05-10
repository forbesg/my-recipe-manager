import React, { Component } from 'react';
import firebase from 'firebase';
import RecipeCard from '../Recipes/RecipeCard';
import Loader from '../Loader';
import './Recipes.css';

class Recipes extends Component {
  constructor () {
    super();
    this.state = {
      recipes: null,
      cuisine: null
    }
  }

  componentWillMount () {
    firebase.database().ref('/recipes').once('value', (snap) => {
      let recipes = [];
      snap.forEach(recipe => {
        let key = recipe.key;
        recipe = recipe.val();
        if (recipe.image && !recipe.thumbnail) {
          let thumbnailFileName = `thumb_${recipe.image.fileName}`;
          firebase.storage().ref('/recipes').child(`${key}/thumbnail/${thumbnailFileName}`).getDownloadURL().then(url => {
            recipe.thumbnail = {
              fileName: thumbnailFileName,
              url
            };
            firebase.database().ref(`/recipes/${key}/thumbnail`).set(recipe.thumbnail).then(() => {
              console.log('Updated thumbnail url');
            }).catch(err => {
              console.log(err.message);
            });
          });
        }
        recipe.key = key;
        recipes.push(recipe);
      });
      this.setState({
        recipes
      });
    }, err => {
      console.log(err.message);
    })
  }

  render () {
    let recipes = this.state.recipes ? this.state.recipes.map((recipe, index) => {
      let delay = 100 * index;
      return <RecipeCard recipe={recipe} key={index} delay={delay} />
    }) : null;

    let recipesElement = this.state.recipes ? (
      <div className="recipes">
        <header>
          <h1>Recipes</h1>
        </header>
        <div className="cards">
        {recipes}
        </div>
      </div>
    ) : (
      <Loader />
    );

    return (
      recipesElement
    );
  }

}

export default Recipes;
