import React from "react";
import bbcGoodFoodLogo from '../../images/bbc-good-food.jpg';

function ImportOverlay (props) {
  return (
    <div className="import-overlay overlay">
      <h4>Import Recipe</h4>
      <p>Place the url of a recipe from one of the supported sites below.</p>
      <span className="close" onClick={props.close}><i className="fa fa-times"></i></span>
      <div className="logo-container">
        <div className="bbc">
          <img src={bbcGoodFoodLogo} alt="BBC Good Food"/>
          <input type="url" placeholder="BBC Good Food Recipe URL" />
          <button onClick={(e) => {props.handleClick(e, 'BBC')}}>Import Recipe</button>
        </div>
      </div>
    </div>
  );

}

export default ImportOverlay;
