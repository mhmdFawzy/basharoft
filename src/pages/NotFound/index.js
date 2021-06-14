import React from 'react';
import SearchInput from '../../components/SearchInput';

function NotFound() {
  return (
    <div>
      <SearchInput />
      <main className="container">
        <h3>Are you lost?! start searching now</h3>
      </main>
    </div>
  );
}

export default NotFound;
