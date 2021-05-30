import React, { useRef, useState } from 'react';

function useComponentVisible(initialIsVisible) {
  const [isComponentVisible, setIsComponentVisible] = useState(initialIsVisible);
  const ref = useRef(null);

  // const handleHideDropdown = (event: KeyboardEvent) => {
  //   if (event.key === "Escape") {
  //     setIsComponentVisible(false);
  //   }
  // };

  const handleClickOutside = event => {
    if (ref.current && !ref.current.contains(event.target)) {
      setIsComponentVisible(false);
    }
  };

  React.useEffect(() => {
    // document.addEventListener("keydown", handleHideDropdown, true);
    document.addEventListener('click', handleClickOutside);
    return () => {
      // document.removeEventListener("keydown", handleHideDropdown, true);
      document.removeEventListener('click', handleClickOutside);
    };
  });

  return { ref, isComponentVisible, setIsComponentVisible };
}
export default useComponentVisible;
