import React, { Component } from 'react';
import firebase from 'firebase/app';
import 'firebase/database';
import RecipeCard from '../Recipes/RecipeCard';
import Loader from '../Loader';
import emptyBox from '../../images/empty-box.jpg';

class UserRecipes extends Component {
  constructor () {
    super();
    this.state = {
      usersFavorites: null,
      user: null,
      owner: false
    };
  }

  componentWillMount () {
    firebase.database().ref(`/users/${this.props.match.params.id}`).once('value', snap => {
      let user = snap.val();
      if (user) {
        let owner = this.props.currentUserUID === this.props.match.params.id ? true : false;
        this.setState({
          user,
          owner
        });
      }
      if (user.favorites) {
        let usersFavorites = [];
        for (let key in user.favorites) {
          firebase.database().ref(`/recipes/${key}`).once('value', snap => {
            if (snap.val()) {
              let favoriteRecipe = snap.val();
              favoriteRecipe.key = key;
              usersFavorites.push(favoriteRecipe);
            }
          }, err => {
            console.log(err.message);
          }).then(() => {
            this.setState({
              usersFavorites
            });
          })
        }
      }
    }, err => {
      console.log(err.message);
    });
  }

  render () {
    let header = this.state.user ? this.state.owner ? (
      <header>
        <h1>My Favorites </h1>
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
    let recipes = this.state.usersFavorites ? this.state.usersFavorites.map((recipe, index) => {
      let delay = 100 * index;
      return <RecipeCard recipe={recipe} key={index} delay={delay}/>
    }) : (
      <div className="center-text">
        <div>
          <img src={emptyBox} alt="empty box" />
        </div>
        <h4>Oh no, you have yet to favorite a recipe</h4>
        <p>To add to your favorites, view a recipe you like and click "Add to Favorites"</p>
      </div>
    );

    let userElement = this.state.usersFavorites ? (
      <div>
        {header}
        <div className="cards">
          {recipes}
        </div>
      </div>
    ) : null;

    return this.state.user ? (
      userElement
    ) : <Loader />;
  }

}

export default UserRecipes;
