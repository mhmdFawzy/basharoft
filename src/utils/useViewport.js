import { useEffect, useState } from 'react';

function useViewport() {
  const [windowDimension, setWindowDimension] = useState(window.innerWidth);
  useEffect(() => {
    setWindowDimension(window.innerWidth);
  }, []);

  useEffect(() => {
    function handleResize() {
      setWindowDimension(window.innerWidth);
    }

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);
  return windowDimension;
}

export default useViewport;
