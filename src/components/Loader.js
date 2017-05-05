import React from 'react';
import ring from '../images/ring.svg';

function Loader () {
  return (
    <div className="loading-element">
      <img src={ring} alt='loading....' />
      <h1>Loading........</h1>
    </div>
  );
}

export default Loader;
