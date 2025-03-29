import React from 'react';
import SimpleAbacus from './SimpleAbacus';

// Only import Three.js components if not using simple abacus
const useSimpleAbacus = process.env.REACT_APP_USE_SIMPLE_ABACUS === 'true';

// Create a component that conditionally loads the appropriate abacus
const AbacusLoader = (props) => {
  // For simplicity in production, always use the SimpleAbacus
  if (useSimpleAbacus) {
    return <SimpleAbacus {...props} />;
  }
  
  // Dynamically import the 3D abacus only if needed
  // This helps webpack to not include the 3D abacus code in the production build
  // when REACT_APP_USE_SIMPLE_ABACUS is set to true
  const Abacus = React.lazy(() => import('./Abacus3D'));
  
  return (
    <React.Suspense fallback={<SimpleAbacus {...props} />}>
      <Abacus {...props} />
    </React.Suspense>
  );
};

export default AbacusLoader;
