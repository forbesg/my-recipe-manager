import React from 'react';
import { removeFromFavorites } from '../../helpers/firebase-helpers';

function RemoveFavorite (props) {
  let handleClick = () => {
    removeFromFavorites(props.userID, props.recipeKey, (err) => {
      if (!err) {
        props.handleRemove();
      }
    });
  }
  return (
    <div className="favorite-container" onClick={handleClick} data-tooltip="Remove from Favorites">
      <i className="fa fa-minus"></i>
    </div>
  );
}

export default RemoveFavorite;
