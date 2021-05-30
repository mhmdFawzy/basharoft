import React, { useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import './SearchInput.scss';
import useDebounce from '../../utils/useDebounce';
import API from '../../utils/axios';
import SearchIcon from '../../assets/search.png';
import useComponentVisible from '../../utils/useComponentVisible';

function SearchInput() {
  let history = useHistory();
  const [inputValue, setValue] = useState('');
  const [error, setError] = useState('');
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const inputRef = useRef(null);
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(true);
  const debouncedSave = useDebounce(search => {
    try {
      API.get(`jobs/autocomplete?contains=${search}`)
        .then(res => {
          setOptions(res.data);
          setLoading(false);
          setError('');
        })
        .catch(() => {
          setLoading(false);
          setError('No job title suggestions found');
        });
    } catch (err) {
      setError('Something went wrong');
    }
  }, 2000);

  React.useEffect(() => {
    if (inputValue.length >= 3) {
      debouncedSave(inputValue);
    } else {
      setLoading(false);
    }
  }, [debouncedSave, inputValue]);
  React.useEffect(() => {
    inputRef.current?.focus();
  }, []);
  const submitSuggest = e => {
    e.preventDefault();
    history.push({
      pathname: '/search',
      state: { searchVal: inputValue },
    });
  };
  const openSuggest = e => {
    e.stopPropagation();
    setIsComponentVisible(true);
  };
  const closeSuggest = () => {
    setIsComponentVisible(false);
  };
  const handleSearch = e => {
    setLoading(true);
    setValue(e.target.value);
  };
  const handleSubmit = e => {
    submitSuggest(e);
  };
  return (
    <div className="searchInput">
      <div className="inputConatiner">
        <form
          onSubmit={e => {
            submitSuggest(e);
          }}>
          <input
            ref={inputRef}
            value={inputValue}
            onClick={openSuggest}
            onChange={handleSearch}
            placeholder="search keyword"
          />
          <button onClick={handleSubmit}>
            <img src={SearchIcon} alt="Logo" />
          </button>
        </form>

        {inputValue.length >= 3 && isComponentVisible && (
          <div className="suggestionsContainer" ref={ref}>
            <ul className="suggestionsList">
              {loading ? (
                <li>Loading</li>
              ) : error ? (
                <li>{error}</li>
              ) : (
                options.map(option => (
                  <li key={option.uuid}>
                    <Link
                      onClick={closeSuggest}
                      to={{
                        pathname: '/search',
                        state: { searchVal: option.suggestion },
                      }}>
                      {option.suggestion}
                    </Link>
                  </li>
                ))
              )}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default SearchInput;
