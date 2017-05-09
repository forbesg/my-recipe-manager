import React, { Component } from 'react';
import firebase from 'firebase';
// import ImageUpload from './ImageUpload'; // Need to prevent uploading if recipe doesn't already exist.
import './RecipeForm.css';

class AddRecipe extends Component {
  constructor () {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePrepTime = this.handlePrepTime.bind(this);
    this.handleCookTime = this.handleCookTime.bind(this);
    this.handleAddIngredient = this.handleAddIngredient.bind(this);
    this.handleAddMethodSteps = this.handleAddMethodSteps.bind(this);
    this.handleInfoMessage = this.handleInfoMessage.bind(this);

    this.state = {
      prepTime: 0,
      cookTime: 0,
      ingredients: [],
      methodSteps: [],
      infoMessage: null
    }
  }

  handleSubmit (e) {
    e.preventDefault();
    let recipe = {
      name: this.refs.name.value,
      serves: this.refs.serves.value,
      cuisine: this.refs.cuisine.value,
      owner: {
        uid: this.props.user.uid,
        name: this.props.user.displayName
      },
      prepTime: this.refs.prepTime.value,
      cookTime: this.refs.cookTime.value,
      ingredients: this.state.ingredients,
      methodSteps: this.state.methodSteps
    }
    for (let key in recipe) {
      if (recipe.hasOwnProperty(key)) {
        if (!recipe[key] || recipe[key] === "") {
          return this.handleInfoMessage("Please complete all required fields");
        }
      }
    }
    if (this.state.ingredients.length < 1 || this.state.methodSteps.length < 1) {
      return this.handleInfoMessage("Recipe requires ingredients and method before submitting");
    }
    firebase.database().ref('/recipes').push(recipe).then(snap => {
      console.log(snap.key);
      firebase.database().ref(`/users/${this.props.user.uid}`).child('/recipes').push(snap.key);
      this.props.history.push('/recipes');
    }).catch(err => {
      console.log(err.message);
    });
  }

  handleInfoMessage (string) {
    this.setState({
      infoMessage: string
    });
    setTimeout(() => {
      this.setState({
        infoMessage: null
      });
    }, 5000)
  }

  handlePrepTime () {
    this.setState({
      prepTime: this.refs.prepTime.value
    });
  }

  handleCookTime () {
    this.setState({
      cookTime: this.refs.cookTime.value
    });
  }

  handleAddIngredient (e) {
    e.preventDefault();
    let ingredientsArray = this.state.ingredients;
    if (ingredientsArray.indexOf(this.refs.ingredient.value) > -1) {
      return console.log('Ingredient is already on the list')
    }
    if (this.refs.ingredient.value.length < 1) {
      return console.log('Please enter an ingredient')
    }
    ingredientsArray.push(this.refs.ingredient.value);
    this.setState({
      ingredients: ingredientsArray
    })
    this.refs.ingredient.value = "";
  }

  handleAddMethodSteps (e) {
    e.preventDefault();
    let methodArray = this.state.methodSteps;
    if (methodArray.indexOf(this.refs.method.value) > -1) {
      return console.log('Method is already on the list');
    }
    if (this.refs.method.value.length < 1) {
      return console.log('Please enter an method, it cannot be blank');
    }
    methodArray.push(this.refs.method.value);
    this.setState({
      methodSteps: methodArray
    })
    this.refs.method.value = "";
  }

  render () {
    let ingredients = this.state.ingredients.length > 0 ? this.state.ingredients.map((ingredient, index) => {
      return (
        <div className="list-item" key={index}>
          <p>{ingredient}</p>
        </div>
      );
    }) : null;

    let methodSteps = this.state.methodSteps.length > 0 ? this.state.methodSteps.map((method, index) => {
      return (
        <div className="list-item" key={index}>
          <p>{method}</p>
        </div>
      );
    }) : null;

    let infoMessage = this.state.infoMessage ? (
      <div className="validation-warning">{this.state.infoMessage}</div>
    ) : null;

    return (
      <div className="recipe-add">
        <header>
          <h1>Add Recipe</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" ref="name" placeholder="Recipe Name" />
          </div>
          <div>
            <label htmlFor="serves">Serves:</label>
            <input type="number" min="1" max="16" ref="serves" defaultValue="1" placeholder="Number of Servings" />
          </div>
          <div>
            <label htmlFor="cuisine">Cuisine:</label>
            <select ref="cuisine">
              <option value="British">British</option>
              <option value="Indian">Indian</option>1
              <option value="Thai">Thai</option>
              <option value="Chinese">Chinese</option>
              <option value="Greek">Greek</option>
              <option value="Italian">Italian</option>
              <option value="Mexican">Mexican</option>
              <option value="Moroccan">Moroccan</option>
              <option value="Spanish">Spanish</option>
            </select>
          </div>
          <div>
            <label htmlFor="prepTime">Preparation Time (minutes)</label>
            <input type="range" min="0" max="360" step="5" defaultValue="0" ref="prepTime" onChange={this.handlePrepTime} />
          </div>
          <p className="minutes">{this.state.prepTime} minutes</p>
          <div>
            <label htmlFor="cookTime">Cooking Time (minutes)</label>
            <input type="range" min="0" max="360" step="5" defaultValue="0" ref="cookTime" onChange={this.handleCookTime} />
          </div>
          <p className="minutes">{this.state.cookTime} minutes</p>
          <h4>Ingredients</h4>
          {ingredients}
          <div className="add-ingredients">
            <label htmlFor="ingredient">Add Ingredient: </label>
            <input type="text" ref="ingredient" placeholder="ingredient and quantity" />
            <button onClick={this.handleAddIngredient}><i className="fa fa-plus"></i></button>
          </div>
          <h4>Method</h4>
          {methodSteps}
          <div className="add-method">
            <label htmlFor="method">Add Method Steps: </label>
            <input type="text" ref="method" placeholder="Method" />
            <button onClick={this.handleAddMethodSteps}><i className="fa fa-plus"></i></button>
          </div>
          <div>
            <input type="submit" value="Add Recipe" />
          </div>
        </form>
        {infoMessage}
      </div>

    );
  }
}

export default AddRecipe;
