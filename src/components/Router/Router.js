import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch, Redirect } from 'react-router-dom';
import SideBarNav from '../SideBarNav/SideBarNav';
import Home from '../Home/Home';
import Recipes from '../Recipes/Recipes';
import Recipe from '../Recipes/Recipe';
import AddRecipe from '../RecipeForm/AddRecipe';
import EditRecipe from '../RecipeForm/EditRecipe';
import UserRecipes from '../UserRecipes/UserRecipes';
import UserFavoriteRecipes from '../UserRecipes/UserFavoriteRecipes';
import Dashboard from '../Dashboard/Dashboard';
import Notification from './Notification';
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let NoMatch = () => {
  return (
    <div className="no-match" style={{
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      height: '100%'
    }}>
      <h1>404</h1>
      <hr />
      <h2>Page Not Found</h2>
    </div>
  );
}

class MainRouter extends Component {
  constructor () {
    super();
    this.handleNavOpen = this.handleNavOpen.bind(this);
    this.handleGoogleLogin = this.handleGoogleLogin.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleCloseNav = this.handleCloseNav.bind(this);
    this.handleNotification = this.handleNotification.bind(this);
    this.state = {
      navOpen: false,
      user: null,
      notification: null,
      globalNotification: null
    }
  }

  handleNavOpen (e) {
    e.preventDefault();
    this.setState({
      navOpen: !this.state.navOpen
    });
  }

  handleCloseNav (e) {
    e.preventDefault();
    this.setState({
      navOpen: false
    });
  }

  handleNotification (notification) {
    this.setState({
      notification
    });
    setTimeout(() => {
      this.setState({
        notification: null
      });
    }, 3000)
  }

  handleGoogleLogin (e) {
    e.preventDefault();
    console.log('Logging in with Google');
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider).then(result => {
      console.log('Success, Signed in with Google');
      let user = result.user.providerData[0];
      let usersRef = firebase.database().ref('/users');
      usersRef.child(`${user.uid}`).once('value', snap => {
        if (snap.exists()) {
          return console.log('User already exists - Not adding to DB')
        }
        usersRef.child(`${user.uid}`).set(user).then((result) => {
          console.log('New User Added');
        }).catch(err => {
          console.log(err.message);
        });
      });
    }).catch(err => {
      console.log('Error with Google Sign In', err.message);
    })
  }

  handleLogout (e) {
    e.preventDefault();
    firebase.auth().signOut().then(() => {
      console.log('Successfully Logged Out');
    }).catch(err => {
      console.log(err.message);
    })
  }

  componentWillMount () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        // Listen for global notifications
        firebase.database().ref('/notification').on('value', snap => {
          if (snap.val()) {
            this.setState({
              globalNotification: snap.val()
            });
            setTimeout(() => {
              this.setState({
                globalNotification: null
              })
            }, 3000);
          }
        }, err => {
          console.error(err.message);
        });

        return this.setState({
          user: user.providerData[0]
        });
      }
      this.setState({
        user: null
      });
    });
  }

  componentWillUnmount () {
    firebase.database().ref('/notification').off();
  }

  render () {
    let navOpenClass = this.state.navOpen ? " nav-open" : "";
    let notification = this.state.notification ? (
      <Notification notification={this.state.notification}/>
    ) : null;
    let globalNotification = this.state.globalNotification && this.state.globalNotification.user !== this.state.user.uid ? (
      <Notification notification={this.state.globalNotification.message}/>
    ) : null;

    return (
      <Router>
        <div className="router">
          <SideBarNav user={this.state.user} loginWithGoogle={this.handleGoogleLogin} logout={this.handleLogout} closeNav={this.handleCloseNav} />
          <div className={`main-body${navOpenClass}`} >
            {notification}
            {globalNotification}
            <div className="menu-toggle" onClick={this.handleNavOpen}>
              <span className="bar"></span>
              <span className="bar"></span>
              <span className="bar"></span>
            </div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/recipes' component={Recipes}/>
              <Route exact path='/recipes/add' render={({...rest}) => {
                return this.state.user ? (
                  <AddRecipe user={this.state.user} {...rest} />
                ) : (
                  <Redirect to='/' />
                )
              }} />
              <Route path='/recipes/:id/edit' render={({...rest}) => {
                return this.state.user ? (
                  <EditRecipe user={this.state.user} {...rest} />
                ) : (
                  <Redirect to='/' />
                )
              }} />
              <Route path='/recipes/:id' render={({...rest}) => {
                let user = this.state.user || null;
                return <Recipe user={user} handleNotification={this.handleNotification} {...rest} />;
              }} />
              <Route path='/user/:id/dashboard' render={({...rest}) => {
                return this.state.user ? this.state.user.uid === rest.match.params.id ? (
                  <Dashboard user={this.state.user} />
                ) : (
                  <Redirect to='/' />
                ) : (
                  <Redirect to='/' />
                )
              }} />
              <Route path="/user/:id/recipes" render={({...rest}) => {
                return this.state.user ? (
                  <UserRecipes currentUserUID={this.state.user.uid} {...rest} />
                ): (
                  <Redirect to="/" />
                )
              }} />
              <Route path="/user/:id/favorites" render={({...rest}) => {
                return this.state.user ? (
                  <UserFavoriteRecipes currentUserUID={this.state.user.uid} {...rest} />
                ): (
                  <Redirect to="/" />
                )
              }} />
              <Route path="*" component={NoMatch} />
            </Switch>
          </div>
        </div>
      </Router>

    );
  }
}

export default MainRouter;
