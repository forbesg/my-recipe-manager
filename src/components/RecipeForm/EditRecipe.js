import React, { Component } from 'react';
import firebase from 'firebase';
import Loader from '../Loader';
import ReorderList from './ReorderList';
import ImageUpload from './ImageUpload';
import { deleteImageFromFirebase } from '../../helpers/firebase-helpers';
import './RecipeForm.css';

class EditRecipe extends Component {
  constructor () {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePrepTime = this.handlePrepTime.bind(this);
    this.handleCookTime = this.handleCookTime.bind(this);
    this.handleAddIngredient = this.handleAddIngredient.bind(this);
    this.handleAddMethodSteps = this.handleAddMethodSteps.bind(this);
    this.handleInfoMessage = this.handleInfoMessage.bind(this);
    this.handleEdit = this.handleEdit.bind(this);
    this.handleConfirmEdit = this.handleConfirmEdit.bind(this);
    this.handleStateUpdate = this.handleStateUpdate.bind(this);
    this.handleDeleteImage = this.handleDeleteImage.bind(this);

    this.state = {
      recipe: null,
      ingredients: [],
      methodSteps: [],
      infoMessage: null,
      edit: null
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
      image: this.state.recipe.image || null,
      prepTime: this.refs.prepTime.value,
      cookTime: this.refs.cookTime.value,
      ingredients: this.state.recipe.ingredients,
      methodSteps: this.state.recipe.methodSteps,
      favoritedBy: this.state.recipe.favoritedBy || null
    }
    for (let key in recipe) {
      if (recipe.hasOwnProperty(key)) {
        if (recipe[key] === "") {
          console.log(key)
          return this.handleInfoMessage("Please complete all required fields");
        }
      }
    }
    if (this.state.ingredients.length < 1 || this.state.methodSteps.length < 1) {
      return this.handleInfoMessage("Recipe requires ingredients and method before submitting");
    }
    firebase.database().ref(`/recipes/${this.props.match.params.id}`).set(recipe).then(() => {
      console.log('Recipe Successfully updated');
      this.props.history.push(`/recipes/${this.props.match.params.id}`);
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
    let recipe = this.state.recipe;
    recipe.prepTime = this.refs.prepTime.value;
    this.setState({
      recipe
    });
  }

  handleCookTime () {
    let recipe = this.state.recipe;
    recipe.cookTime = this.refs.cookTime.value;
    this.setState({
      recipe
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

  handleEdit (type, text, index) {
    this.setState({
      edit: {
        type: type,
        text,
        index
      }
    });
  }
  handleConfirmEdit (e) {
    let newArray = this.state[this.state.edit.type];
    newArray[this.state.edit.index] = this.refs.editValue.value;
    this.setState({
      [this.state.edit.type]: newArray,
      edit: null
    });
  }

  handleDeleteImage (e) {
    e.preventDefault();
    // Remove Image and Thumbnail details from DB
    const recipeKey = this.props.match.params.id;
    const fileName = this.state.recipe.image.fileName;
    deleteImageFromFirebase(recipeKey, fileName, (err) => {
      if (err) return console.log(err);
      console.log('Successfully deleted Everything');
    });
  }

  handleStateUpdate (recipe) {
    this.setState({
      recipe
    });
  }



  componentWillMount () {
    firebase.database().ref(`/recipes/${this.props.match.params.id}`).on('value', snap => {
      let key = snap.key;
      let recipe = snap.val();
      recipe.key = key;
      this.setState({
        recipe,
        ingredients: recipe.ingredients,
        methodSteps: recipe.methodSteps
      });
    }, (err) => {
      console.log(err.message)
    });
  }

  componentWillUnmount () {
    firebase.database().ref(`/recipes/${this.props.match.params.id}`).off();
  }

  render () {

    let ingredients = this.state.recipe && (this.state.recipe.ingredients && this.state.recipe.ingredients.length > 0 ) ? (
        <ReorderList handleEdit={this.handleEdit} recipe={this.state.recipe} array={this.state.recipe.ingredients} arrayName="ingredients" handleStateUpdate={this.handleStateUpdate} />
      ) : null;

    let methodSteps = this.state.recipe && (this.state.recipe.methodSteps && this.state.recipe.methodSteps.length > 0) ? (
        <ReorderList handleEdit={this.handleEdit} recipe={this.state.recipe} array={this.state.recipe.methodSteps} arrayName="methodSteps" handleStateUpdate={this.handleStateUpdate} />
      ) : null;

    let infoMessage = this.state.infoMessage ? (
      <div className="validation-warning">{this.state.infoMessage}</div>
    ) : null;

    let imageSection = this.state.recipe && this.state.recipe.image ? (
      <div className="outline-box">
        <h4>Recipe Image</h4>
        <div className="image-container">
          <div className="delete-icon" title="Delete Image" onClick={this.handleDeleteImage}><i className="fa fa-times"></i></div>
          <img src={this.state.recipe.image.url} alt={this.state.recipe.name}/>
        </div>
      </div>
    ) : <ImageUpload recipeKey={this.props.match.params.id} />;

    let editOverlay = this.state.edit ? (
      <div className="overlay">
        <div className="box">
          <header>
            <p>Edit</p>
          </header>
          <section>
            <div>
              <textarea type="text" ref="editValue" defaultValue={this.state.edit.text}></textarea>
            </div>
            <div className="box-buttons">
              <button onClick={() => this.setState({edit: null})}>Cancel</button>
              <button onClick={this.handleConfirmEdit}>Update</button>
            </div>
          </section>
        </div>
      </div>
    ) : null;

    return this.state.recipe ? (
      <div className="recipe-edit">
        {editOverlay}
        <header>
          <h1>Edit Recipe</h1>
        </header>
        <form onSubmit={this.handleSubmit}>
          <div>
            <label htmlFor="name">Name:</label>
            <input type="text" ref="name" defaultValue={this.state.recipe.name} placeholder="Recipe Name" />
          </div>
          <div>
            <label htmlFor="serves">Serves:</label>
            <input type="number" min="1" max="16" ref="serves" defaultValue={this.state.recipe.serves} placeholder="Number of Servings" />
          </div>
          <div>
            <label htmlFor="cuisine">Cuisine:</label>
            <select ref="cuisine" defaultValue={this.state.recipe.cuisine}>
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
            <input type="range" min="0" max="360" step="5" defaultValue={this.state.recipe.prepTime} ref="prepTime" onChange={this.handlePrepTime} />
          </div>
          <p className="minutes">{this.state.recipe.prepTime} minutes</p>
          <div>
            <label htmlFor="cookTime">Cooking Time (minutes)</label>
            <input type="range" min="0" max="360" step="5" defaultValue={this.state.recipe.cookTime} ref="cookTime" onChange={this.handleCookTime} />
          </div>
          <p className="minutes">{this.state.recipe.cookTime} minutes</p>
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
            <input type="submit" value="Update Recipe" />
          </div>
        </form>
        {imageSection}
        {infoMessage}
      </div>

    ) : <Loader />;
  }
}

export default EditRecipe;
