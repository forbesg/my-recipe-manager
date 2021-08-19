import React, { Component } from "react";
import { Link } from "react-router-dom";
import AddFavorite from "./AddFavorite";
import RecipeBanner from "./RecipeBanner";
import { db, storage } from "../../firebase/firebase-init";
import RemoveFavorite from "./RemoveFavorite";
import { Helmet } from "react-helmet";

class Recipe extends Component {
  constructor() {
    super();
    this.handleToggleEditMenu = this.handleToggleEditMenu.bind(this);
    this.handleConfirmDeleteOverlay = this.handleConfirmDeleteOverlay.bind(
      this
    );
    this.handleConfirmDelete = this.handleConfirmDelete.bind(this);
    this.handleConfirmDeleteOverlay = this.handleConfirmDeleteOverlay.bind(
      this
    );
    this.handleAdd = this.handleAdd.bind(this);
    this.handleRemove = this.handleRemove.bind(this);
    this.state = {
      recipe: null,
      editMenuOpen: false,
      confirmOverlay: false,
      fav: false,
      notification: "remove from favs",
    };
  }

  handleToggleEditMenu(e) {
    this.setState({
      editMenuOpen: !this.state.editMenuOpen,
    });
  }

  handleConfirmDeleteOverlay(e) {
    e.preventDefault();
    this.setState({
      editMenuOpen: false,
      confirmOverlay: true,
    });
  }

  handleConfirmDelete(e) {
    e.preventDefault();
    if (this.props.user.uid !== this.state.recipe.owner.uid) {
      return console.log(
        "Unable to delete as you are not the owner of the recipe."
      );
    }
    let imageName = this.state.recipe.image
      ? this.state.recipe.image.fileName
      : null;
    let thumbnailName = this.state.recipe.thumbnail
      ? this.state.recipe.thumbnail.fileName
      : null;
    let recipeKey = this.props.match.params.id;
    let usersRecipesRef = db().ref(`/users/${this.props.user.uid}/recipes`);
    let recipeRef = db().ref(`/recipes/${recipeKey}`);
    console.log(this.state.recipe, imageName, thumbnailName);
    recipeRef
      .set(null)
      .then(() => {
        usersRecipesRef.once(
          "value",
          (snap) => {
            snap.forEach((recipe) => {
              if (recipe.val() === recipeKey) {
                usersRecipesRef.child(recipe.key).remove();
                // If recipe has image and thumbnail remove these from cloud storage
                if (imageName) {
                  let recipeStorageRef = storage().ref(`recipes/${recipeKey}`);
                  recipeStorageRef
                    .child(imageName)
                    .delete()
                    .then(() => {
                      console.log("Recipe Image Deleted");
                      if (thumbnailName) {
                        recipeStorageRef
                          .child(`thumbnail/${thumbnailName}`)
                          .delete()
                          .then(() => {
                            console.log("Recipe Thumbnail Deleted");
                          })
                          .catch((err) => {
                            console.log(err);
                          });
                      }
                    })
                    .catch((err) => {
                      console.log(err);
                    });
                }
              }
            });
          },
          (err) => {
            console.log("Error deleting from user object", err.message);
          }
        );
      })
      .catch((err) => {
        console.log(err.message);
      });

    this.setState({
      confirmOverlay: false,
    });
    this.props.history.push(`/user/${this.props.user.uid}/dashboard`);
  }

  handleAdd() {
    let uid = this.props.user.uid;
    let favorite = {
      name: this.state.recipe.name,
      key: this.props.match.params.id,
    };
    db()
      .ref(`/users/${uid}/favorites/${favorite.key}`)
      .set(favorite.name)
      .then((snap) => {
        db()
          .ref(`/recipes/${this.props.match.params.id}/favoritedBy`)
          .push(uid);
        this.props.handleNotification("Added to favorites");
        this.setState({
          fav: true,
        });
      })
      .catch((err) => {
        console.error(err.message);
      });
  }

  handleRemove() {
    this.props.handleNotification("Removed from favorites");
    this.setState({
      fav: false,
    });
  }

  componentDidMount() {
    let recipeKey = this.props.match.params.id;
    db()
      .ref(`/recipes/${recipeKey}`)
      .once(
        "value",
        (snap) => {
          let recipe = snap.val();
          // If recipe is already users favorite, do not display the add to fav button
          if (recipe.favoritedBy) {
            for (let key in recipe.favoritedBy) {
              if (
                this.props.user &&
                recipe.favoritedBy[key] === this.props.user.uid
              ) {
                this.setState({
                  fav: true,
                });
              }
            }
          }
          this.setState({
            recipe: snap.val(),
          });
        },
        (err) => {
          console.log(err.message);
        }
      );
  }

  componentWillUnmount() {
    this.setState({
      editMenuOpen: false,
    });
  }

  render() {
    let ingredients = this.state.recipe ? (
      this.state.recipe.ingredients.map((ingredient, index) => {
        return <li key={index}>{ingredient}</li>;
      })
    ) : (
      <li>No ingredients have been added</li>
    );

    let methodSteps = this.state.recipe ? (
      this.state.recipe.methodSteps.map((method, index) => {
        return <li key={index}>{method}</li>;
      })
    ) : (
      <li>No method steps have been added</li>
    );

    let editMenuClass = !this.state.editMenuOpen
      ? "edit-menu"
      : "edit-menu open";

    let editMenu =
      this.state.recipe &&
      this.props.user &&
      this.state.recipe.owner.uid === this.props.user.uid ? (
        <div className={editMenuClass}>
          <button title="Edit Recipe" onClick={this.handleToggleEditMenu}>
            <i
              className="fa fa-cogs"
              style={{ fontSize: "1.2em", padding: "5px 0" }}
            ></i>
          </button>
          <div className="dropdown-menu">
            <nav>
              <Link to={`/recipes/${this.props.match.params.id}/edit`}>
                <i className="fa fa-edit"></i> <span>Edit Recipe</span>
              </Link>
              <a
                href={`/recipes/${this.props.match.params.id}/delete`}
                onClick={this.handleConfirmDeleteOverlay}
              >
                <i className="fa fa-trash"></i> <span>Delete Recipe</span>
              </a>
            </nav>
          </div>
        </div>
      ) : null;

    let addFavorite =
      this.state.recipe &&
      this.props.user &&
      this.state.recipe.owner.uid !== this.props.user.uid &&
      !this.state.fav ? (
        <AddFavorite props={this.props} handleClick={this.handleAdd} />
      ) : null;

    let removeFavorite =
      this.state.recipe &&
      this.props.user &&
      this.state.recipe.owner.uid !== this.props.user.uid &&
      this.state.fav ? (
        <RemoveFavorite
          recipeKey={this.props.match.params.id}
          userID={this.props.user.uid}
          handleRemove={this.handleRemove}
        />
      ) : null;

    let confirmOverlay = this.state.confirmOverlay ? (
      <div className="overlay">
        <div className="box">
          <header>
            <p>Delete this recipe?</p>
          </header>
          <div className="box-buttons">
            <button onClick={() => this.setState({ confirmOverlay: false })}>
              Cancel
            </button>
            <button onClick={this.handleConfirmDelete}>Delete</button>
          </div>
        </div>
      </div>
    ) : null;

    let recipe = this.state.recipe ? (
      <div className="recipe">
        <Helmet>
          <title>{`My Recipe Manager | ${this.state.recipe.name}`}</title>
          <meta
            property="og:title"
            content={`My Recipe Manager | ${this.state.recipe.name}`}
          />
          <meta property="og:type" content="website" />
          <meta
            property="og:description"
            content={`${this.state.recipe.name} - A ${this.state.recipe.cuisine} recipe added by ${this.state.recipe.owner.name}`}
          />
          <meta
            property="og:url"
            content={`https://my-recipe-manager.firebaseapp.com/recipes/${this.props.match.params.id}`}
          />
          {this.state.recipe.image ? (
            <meta property="og:image" content={this.state.recipe.image.url} />
          ) : null}
        </Helmet>
        {confirmOverlay}
        <header>
          <h2>
            <i className="fa fa-cutlery"></i> - {this.state.recipe.name} -{" "}
            <i className="fa fa-cutlery"></i>
          </h2>
        </header>
        {editMenu}
        {addFavorite}
        {removeFavorite}
        <RecipeBanner recipe={this.state.recipe} />
        <div className="outline-box">
          <h4>Ingredients:</h4>
          <ul>{ingredients}</ul>
        </div>
        <div className="outline-box">
          <h4>Method</h4>
          <ul>{methodSteps}</ul>
        </div>
      </div>
    ) : null;

    return <div>{recipe}</div>;
  }
}

export default Recipe;
