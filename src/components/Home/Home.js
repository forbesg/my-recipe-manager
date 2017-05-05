import React from 'react';
import logo from '../../images/recipes.jpg';

let Home = () => {
  return (
    <div className="home">
      <h1>
        My Recipe Manager
      </h1>
      <h2>Store all your recipes in one place</h2>
      <div className="logo-image-container">
        <img src={logo} alt="My Recipe Manager" />
      </div>
    </div>
  )
}

export default Home;
