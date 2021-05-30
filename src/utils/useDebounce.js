import { useCallback, useEffect, useRef } from 'react';
import _ from 'lodash';

function useDebounce(callback, delay) {
  const memoizedCallback = useCallback(callback, []);
  const debouncedFn = useRef(_.debounce(memoizedCallback, delay));

  useEffect(() => {
    debouncedFn.current = _.debounce(memoizedCallback, delay);
  }, [memoizedCallback, debouncedFn, delay]);
  return debouncedFn.current;
}

export default useDebounce;
