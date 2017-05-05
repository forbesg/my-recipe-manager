import React from 'react';

function AddFavorite (props) {
  return (
    <div className="favorite-container" data-tooltip="Add to Favorites" onClick={props.handleClick}>
      <i className="fa fa-heart"></i>
    </div>
  );
}

export default AddFavorite;
