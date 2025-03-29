import React from 'react';
import AbacusLoader from './AbacusLoader';

// This is just a simple wrapper around AbacusLoader for backward compatibility
const Abacus = (props) => {
  return <AbacusLoader {...props} />;
};

export default Abacus;