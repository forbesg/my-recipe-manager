import React from "react";
import { getFlagCode } from "../../helpers/helper-functions";

function RecipeBanner(props) {
  let flagCode = getFlagCode(props.recipe.cuisine);
  let image = require(`../../images/flags/${flagCode}.svg`).default;
  console.log(image);
  let recipeImage = props.recipe.image ? (
    <div
      className="recipe-image"
      style={{
        backgroundImage: `url(${props.recipe.image.url})`,
      }}
    ></div>
  ) : null;
  return (
    <div className="recipe-banner">
      {recipeImage}
      <div className="recipe-info">
        <p>Owner: {props.recipe.owner.name}</p>
        <p>
          Prep <i className="fa fa-clock-o" aria-hidden="true"></i> :{" "}
          {props.recipe.prepTime} minutes
        </p>
        <p>
          Cook <i className="fa fa-clock-o" aria-hidden="true"></i> :{" "}
          {props.recipe.cookTime} minutes
        </p>
        <div className="cusine-container">
          <p>Cuisine: {props.recipe.cuisine}</p>
          <div className="flag-container">
            <img src={image} alt={`${props.recipe.cuisine} Flag`} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default RecipeBanner;
