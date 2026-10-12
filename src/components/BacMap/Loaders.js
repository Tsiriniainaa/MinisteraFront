// Loader.js
import React from 'react';
import loaderGif from './load.gif'; // Remplacez par le chemin vers votre GIF

const Loaders = () => {
  return (
    <div className="loader">
      <img src={loaderGif} alt="Loading..." />
    </div>
  );
};

export default Loaders;
