import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { getFlagCode } from '../../helpers/helper-functions';
// Placeholder Image for thumbnail - removed to use full image if no thumbnail present
// import placeholderFoodImage from '../../images/placeholder_plate.png';

class RecipeCard extends Component {
  constructor () {
    super();
    // this.updateState = this.updateState.bind(this);
    this.state = {
      animationClass: null,
      image: null
    };
  }

  render () {
    const cuisine = this.props.recipe.cuisine;
    let flagCode = getFlagCode(cuisine);
    let flagIcon = require(`../../images/flags/${flagCode}.svg`);
    // let animationClass = this.state.animationClass ? this.state.animationClass : "";

    /**
    * Lazy load images
    */

    // let lazyImage = new Image()
    // lazyImage.src = this.props.recipe && this.props.recipe.thumbnail ?
    //                 this.props.recipe.thumbnail.url :
    //                 this.props.recipe && this.props.recipe.image ?
    //                 this.props.recipe.image.url :
    //                 null
    //
    // console.log(lazyImage);
    // lazyImage.addEventListener('load', () => {
    //   console.log(lazyImage.loaded);
    // })

    let thumbnailImage = this.props.recipe && this.props.recipe.thumbnail ? (
      <div className="recipe-thumbnail" style={{
        backgroundImage: `url(${this.props.recipe.thumbnail.url})`,
        backgroundColor: '#fdfdfd'
      }}></div>
    ) : null;

    let fullImage = this.props.recipe && this.props.recipe.image ? (
      <div className="recipe-thumbnail" style={{backgroundImage: `url(${this.props.recipe.image.url})`}}></div>
    ) : null;
    let image = thumbnailImage ? thumbnailImage : fullImage;

    return (
      <div className="recipe-card" data-delay={this.props.delay}>
        <header>
          {image}
          <div className="recipe-card-info">
            <h4><Link to={`/recipes/${this.props.recipe.key}`} title={this.props.recipe.name}>{this.props.recipe.name}</Link></h4>
            <p>{this.props.recipe.cuisine}</p>
            <p>Added By: {this.props.recipe.owner.name}</p>
          </div>
        </header>
        <div>
          <div className="recipe-summary">
            <p>Preparation Time: {this.props.recipe.prepTime} mins</p>
            <p>Cooking Time: {this.props.recipe.cookTime} mins</p>
          </div>
        </div>
        <div>
          <Link to={`/recipes/${this.props.recipe.key}`} className="button">View</Link>
        </div>
        <div className="flag-icon-container" data-tooltip={this.props.recipe.cuisine}>
          <img src={flagIcon} className="flag-icon"  alt={`${this.props.recipe.cuisine} flag icon`}/>
        </div>
      </div>
    );
  }
}

export default RecipeCard;
