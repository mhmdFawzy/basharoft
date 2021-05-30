import React from 'react';
import PropTypes from 'prop-types';
import './skilltag.scss';
import { Link } from 'react-router-dom';

function SkillTag({ id, name }) {
  return (
    <div className="skilltagWrapper">
      <Link to={`/skill/${id}`}>{name}</Link>
    </div>
  );
}

SkillTag.propTypes = { id: PropTypes.string.isRequired, name: PropTypes.string.isRequired };

export default SkillTag;
