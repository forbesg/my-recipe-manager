import React, { Component } from 'react'
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';
import RecipeCard from '../Recipes/RecipeCard';
import Loader from '../Loader';
import './Recipes.css';
import cuisines from '../../cuisines.json';

class Recipes extends Component {
  constructor () {
    super();
    this.handleFilter = this.handleFilter.bind(this);
    this.state = {
      recipes: null,
      filteredRecipes: null,
      cuisines,
      cuisine: null
    }
  }

  handleFilter (cuisine) {
    if (!cuisine) {
      this.setState({
        filteredRecipes: this.state.recipes,
        cuisine: null
      })
      return
    }
    this.setState({
      filteredRecipes: this.state.recipes.filter(rec => {
        return rec.cuisine === cuisine
      }),
      cuisine
    })
  }

  componentWillMount () {
    firebase.database().ref('/recipes').once('value', (snap) => {
      let recipes = [];
      snap.forEach(recipe => {
        let key = recipe.key;
        recipe = recipe.val();
        // console.log(recipe.image.remote);
        if (recipe.image && !recipe.thumbnail && !recipe.image.remote) {
          console.log(recipe);
          let thumbnailFileName = `thumb_${recipe.image.fileName}`;
          let imageRef = firebase.storage().ref('/recipes').child(`${key}/thumbnail/${thumbnailFileName}`);

          imageRef.getDownloadURL().then(url => {
            recipe.thumbnail = {
              fileName: thumbnailFileName,
              url
            };
            firebase.database().ref(`/recipes/${key}/thumbnail`).set(recipe.thumbnail).then(() => {
              console.log('Updated thumbnail url');
            }).catch(err => {
              console.log(err.message);
            });
          }).catch(err => {
            console.log('Thumbnail Image Not Found', err.code);
          });
        }
        recipe.key = key;
        recipes.push(recipe);
      });
      this.setState({
        recipes,
        filteredRecipes: recipes
      });
    }, err => {
      console.log(err.message);
    })
  }

  render () {
    let recipes = this.state.filteredRecipes ? this.state.filteredRecipes.map((recipe, index) => {
        let delay = 50 * index;
        return <RecipeCard recipe={recipe} key={index} delay={delay} />
      }) : null;
    let cuisineFilter = this.state.cuisines ? this.state.cuisines.map((cus, index) => {
      let flag = require(`../../images/flags/${cus.flag}.svg`)
      return (
        <div className="flag-icon-container"
             style={{display: 'inline-block', position: 'relative', margin: '0 10px', width: '30px'}}
             data-tooltip={cus.cuisine}
             key={index}
             onClick={() => this.handleFilter(cus.cuisine)}>
          <img className="flag-icon" src={flag} alt={cus.cuisine} style={{cursor: 'pointer', width: '100%'}} />
        </div>
      )
    }) : null;

    let recipesElement = this.state.recipes ? (
      <div className="recipes">
        <header>
          <h1>Recipes</h1>
        </header>
        <div className="filters" style={{flex: '1 1 100%',position: 'relative'}}>
          <h5>Filter by Cuisine { this.state.cuisine ? <span style={{cursor: 'pointer'}} onClick={() => this.handleFilter()}>Clear Filter</span> : null }</h5>
          {cuisineFilter}
        </div>
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
