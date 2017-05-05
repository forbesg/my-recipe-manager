import './firebase/firebase-init';
import React from 'react';
import Router from './components/Router/Router';
import './App.css';

let App = () => {
  return (
    <div className="App">
        <Router />
    </div>
  );
}

export default App;
