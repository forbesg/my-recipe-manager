import React, { Component } from 'react';
import firebase from 'firebase';
import RecipeCard from '../Recipes/RecipeCard';
import Loader from '../Loader';

class UserRecipes extends Component {
  constructor () {
    super();
    this.state = {
      recipes: null,
      user: null,
      owner: false
    };
  }

  componentWillMount () {
    firebase.database().ref(`/users/${this.props.match.params.id}`).once('value', snap => {
      if (snap) {
        let owner = this.props.currentUserUID === this.props.match.params.id ? true : false;
        this.setState({
          user: snap.val(),
          owner
        });
      }
    }, err => {
      console.log(err.message);
    });
    firebase.database().ref('/recipes').once('value', snap => {
      let recipes = [];
      snap.forEach(recipe => {
        if (recipe.val().owner.uid === this.props.match.params.id) {
          let key = recipe.key;
          recipe = recipe.val();
          recipe.key = key;
          recipes.push(recipe);
        }
      });
      this.setState({
        recipes
      })
    })
  }

  render () {
    let header = this.state.user ? this.state.owner ? (
      <header>
        <h1>My Recipes</h1>
        <div className="profile-picture-container" style={{width: '80px', height: '80px', margin: 'auto'}}>
          <img src={`${this.state.user.photoURL}?sz=80`} alt={this.state.user.displayName} />
        </div>
        <h3>{this.state.user.displayName || "Display Name"}</h3>
      </header>
    ) : (
      <header>
        <h1>Recipes</h1>
        <h3>{this.state.user.displayName || "Display Name"}</h3>
      </header>
    ) : null;
    let recipes = this.state.recipes ? this.state.recipes.map((recipe, index) => {
      let delay = 100 * index;
      return <RecipeCard recipe={recipe} key={index} delay={delay}/>
    }) : null;

    let userElement = this.state.recipes ? (
      <div>
        {header}
        <div className="cards">
          {recipes}
        </div>
      </div>
    ) : (
      <Loader />
    )

    return this.state.user ? (
      userElement
    ) : <Loader />;
  }

}

export default UserRecipes;
