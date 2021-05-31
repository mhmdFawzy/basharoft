import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

function RelatedLinks({ relatedLinks, type, path }) {
  return (
    <ul>
      {relatedLinks.length >= 1 ? (
        relatedLinks.map((related, i) => (
          <li key={i}>
            <Link
              to={{
                pathname: `/${path}/${related.uuid}`,
              }}>
              {related.title || related.skill_name}
            </Link>
          </li>
        ))
      ) : (
        <li>Can not find related {type}</li>
      )}
    </ul>
  );
}

RelatedLinks.propTypes = {
  relatedLinks: PropTypes.array,
  type: PropTypes.string.isRequired,
  path: PropTypes.string.isRequired,
};

export default RelatedLinks;
