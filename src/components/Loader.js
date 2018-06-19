import React from 'react';
import ring from '../images/ring.svg';

function Loader (props) {
  return (
    <div className="loading-element">
      <img src={ring} alt='loading....' />
      <h1 style={{color: props.color || null}}>{props.text || 'Loading........'}</h1>
    </div>
  );
}

export default Loader;
