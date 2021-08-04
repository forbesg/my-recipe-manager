import React, { Component } from "react";
import { Link } from "react-router-dom";
import firebase from "firebase/app";
import "firebase/database";
import "./Dashboard.css";
import Loader from "../Loader";

class Dashboard extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userRecipes: null,
      favRecipes: null,
      forkedRecipes: null,
    };
  }

  componentDidMount() {
    firebase
      .database()
      .ref("/recipes")
      .once(
        "value",
        (snap) => {
          let userRecipes = [];
          let favRecipes = [];
          snap.forEach((recipe) => {
            if (recipe.val().owner.uid === this.props.user.uid) {
              let key = recipe.key;
              recipe = recipe.val();
              recipe.key = key;
              userRecipes.push(recipe);
            }
          });
          firebase
            .database()
            .ref(`/users/${this.props.user.uid}/favorites`)
            .once(
              "value",
              (snap) => {
                snap.forEach((favRecipe) => {
                  favRecipes.push({
                    key: favRecipe.key,
                    name: favRecipe.val(),
                  });
                });
                this.setState({
                  userRecipes,
                  favRecipes,
                });
              },
              (err) => {
                console.error(err.message);
              }
            );
        },
        (err) => {
          console.log(err.message);
        }
      );
  }

  render() {
    let usersRecipes = this.state.userRecipes
      ? this.state.userRecipes
          .filter((recipe, index) => {
            return index < 4; // Only return the first 4 recipes and pass to .map
          })
          .map((recipe, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}. </td>
                <td>
                  <Link to={`/recipes/${recipe.key}`}>{recipe.name}</Link>
                </td>
              </tr>
            );
          })
      : null;

    let favRecipes = this.state.favRecipes
      ? this.state.favRecipes
          .filter((recipe, index) => {
            return index < 4;
          })
          .map((recipe, index) => {
            return (
              <tr key={index}>
                <td>{index + 1}. </td>
                <td>
                  <Link to={`/recipes/${recipe.key}`}>{recipe.name}</Link>
                </td>
              </tr>
            );
          })
      : null;

    let recipeCount = this.state.userRecipes
      ? this.state.userRecipes.length
      : 0;
    let favsCount = this.state.favRecipes ? this.state.favRecipes.length : 0;
    let forkedCount = this.state.forkedRecipes
      ? this.state.forkedRecipes.length
      : 0;
    let favorites =
      favsCount && favsCount > 0 ? (
        <div>
          <table>
            <tbody>{favRecipes}</tbody>
          </table>
          <br />
          <Link
            to={`/user/${this.props.user.uid}/favorites`}
            className="button"
          >
            View All Favorite Recipes
          </Link>
        </div>
      ) : (
        <div>
          <p>No Favorites</p>
          <p>View a recipe you like and click on Add Favorite</p>
        </div>
      );

    let sectionElement =
      this.state.userRecipes && this.state.favRecipes ? (
        <section>
          <div className="users-stats">
            <header>
              <h4>
                <i className="fa fa-line-chart"></i> Your Stats
              </h4>
            </header>
            <p>
              Total Number of Recipes:{" "}
              <span className="pill-number">{recipeCount}</span>
            </p>
            <p>
              Total Number of Favorites:{" "}
              <span className="pill-number">{favsCount}</span>
            </p>
            <p>
              Total Number of Forked Recipes:{" "}
              <span className="pill-number">{forkedCount}</span>
            </p>
          </div>
          <div className="users-recipes">
            <header>
              <h4>
                <i className="fa fa-book"></i> Your Recipes
              </h4>
            </header>
            <table>
              <tbody>{usersRecipes}</tbody>
            </table>
            <br />
            <Link
              to={`/user/${this.props.user.uid}/recipes`}
              className="button"
            >
              View All Your Recipes
            </Link>
          </div>
          <div className="user-favorites">
            <header>
              <h4>
                <i className="fa fa-heart"></i> Favorites - {favsCount}
              </h4>
            </header>
            {favorites}
          </div>
        </section>
      ) : (
        <Loader />
      );

    return (
      <div className="dashboard">
        <header>
          <h1>Dashboard</h1>
        </header>
        {sectionElement}
      </div>
    );
  }
}

export default Dashboard;
