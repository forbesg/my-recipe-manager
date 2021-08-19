import React, { Component } from "react";
import { NavLink } from "react-router-dom";
import "./FixedMobileNav.css";
import HomeIcon from "../../images/icons/home.svg";
import DashboardIcon from "../../images/icons/dashboard.svg";
import RecipesIcon from "../../images/icons/recipes.svg";
import AddIcon from "../../images/icons/add.svg";
import ChefIcon from "../../images/icons/chef.svg";
// const Home = require("../../images/icons/home.svg");

class FixedMobileNav extends Component {
  constructor() {
    super();
  }
  render() {
    return (
      <div class="fixed-mobile-nav">
        {this.props.user ? (
          <ul>
            <li onClick={this.props.closeNav}>
              <NavLink exact to="/" activeClassName="is-active">
                <img src={HomeIcon} />
                Home
              </NavLink>
            </li>
            <li onClick={this.props.closeNav}>
              <NavLink
                to={`/user/${this.props.user.uid}/dashboard`}
                activeClassName="is-active"
              >
                <img src={DashboardIcon} />
                Dashboard
              </NavLink>
            </li>
            <li onClick={this.props.closeNav}>
              <NavLink exact to="/recipes" activeClassName="is-active">
                <img src={RecipesIcon} />
                Recipes
              </NavLink>
            </li>
            <li onClick={this.props.closeNav}>
              <NavLink to="/recipes/add" activeClassName="is-active">
                <img src={AddIcon} />
                Add Recipe
              </NavLink>
            </li>
            <li onClick={this.props.closeNav}>
              <NavLink
                to={`/user/${this.props.user.uid}/recipes`}
                activeClassName="is-active"
              >
                <img src={ChefIcon} />
                My Recipes
              </NavLink>
            </li>
            {/* <li onClick={this.props.closeNav}><a href="#">~To Do | Share - Fork~</a></li> */}
          </ul>
        ) : (
          <ul>
            <li onClick={this.props.closeNav}>
              <NavLink exact to="/" activeClassName="is-active">
                <img src={HomeIcon} />
                Home
              </NavLink>
            </li>
            <li onClick={this.props.closeNav}>
              <NavLink to="/recipes" activeClassName="is-active">
                <img src={RecipesIcon} />
                Recipes
              </NavLink>
            </li>
          </ul>
        )}
      </div>
    );
  }
}

export default FixedMobileNav;
