import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import './SideBarNav.css';

class SideBarNav extends Component {

  render () {
    let authButton = this.props.user ? (
      <div>
        <p>Signed in as {this.props.user.displayName}</p>
        <a className="logout" href="/logout" onClick={this.props.logout}>Logout</a>
      </div>
    ) : (
      <div>
        <p>Login</p>
        <a href="/login" onClick={this.props.loginWithGoogle}>Login With Google</a>
      </div>
    );
    let links = this.props.user ? (
      <ul>
        <li onClick={this.props.closeNav}><NavLink exact to='/'>Home</NavLink></li>
        <li onClick={this.props.closeNav}><NavLink to={`/user/${this.props.user.uid}/dashboard`}>Dashboard</NavLink></li>
        <li onClick={this.props.closeNav}><NavLink exact to='/recipes'>Recipes</NavLink></li>
        <li onClick={this.props.closeNav}><NavLink to='/recipes/add'>Add Recipe</NavLink></li>
        <li onClick={this.props.closeNav}><NavLink to={`/user/${this.props.user.uid}/recipes`}>My Recipes</NavLink></li>
        <li onClick={this.props.closeNav}><a>~To Do | Share - Fork~</a></li>
      </ul>
    ) : (
      <ul>
        <li onClick={this.props.closeNav}><NavLink exact to='/'>Home</NavLink></li>
        <li onClick={this.props.closeNav}><NavLink to='/recipes'>Recipes</NavLink></li>
      </ul>
    )
    return (
      <div className="sidebar-navigation">
        <header>
          <h1><NavLink to="/">My Recipe Manager</NavLink></h1>
        </header>
        <nav>
          {links}
        </nav>
        <div className="auth-button">
          {authButton}
        </div>
        <footer>
          <p>FNBG&copy; {new Date().getFullYear()}</p>
        </footer>
      </div>
    );
  }
}

export default SideBarNav;
