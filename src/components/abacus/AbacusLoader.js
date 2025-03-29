import React, { useState, useEffect, lazy, Suspense } from 'react';
import SimpleAbacus from './SimpleAbacus';

// Only import Three.js components if not using simple abacus
const useSimpleAbacus = process.env.REACT_APP_USE_SIMPLE_ABACUS === 'true';

// Dynamically import the 3D abacus
const Abacus3D = !useSimpleAbacus ? lazy(() => import('./Abacus3D')) : null;

/**
 * AbacusLoader - Conditionally loads either the 3D or 2D abacus based on environment
 * 
 * This implementation ensures that when using the simple version (REACT_APP_USE_SIMPLE_ABACUS=true),
 * the Three.js code is never loaded at all, which prevents bundling issues.
 */
const AbacusLoader = (props) => {
  const [isLoading, setIsLoading] = useState(!useSimpleAbacus);
  
  useEffect(() => {
    // If we're using SimpleAbacus, we're never loading
    if (useSimpleAbacus) {
      setIsLoading(false);
    }
  }, []);
  
  // For simplicity in production, always use the SimpleAbacus
  if (useSimpleAbacus) {
    return <SimpleAbacus {...props} />;
  }
  
  // In development, try to load the 3D version with fallback to 2D
  return (
    <Suspense fallback={<SimpleAbacus {...props} />}>
      <Abacus3D {...props} />
    </Suspense>
  );
};

export default AbacusLoader;