import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import './skilltag.scss';
import { Link } from 'react-router-dom';
import API from '../../utils/axios';

function SkillTag({ id, name }) {
  return (
    <div className="skilltagWrapper">
      <Link to={`/skill/${id}`}>{name}</Link>
    </div>
  );
}

SkillTag.propTypes = { id: PropTypes.string.isRequired, name: PropTypes.string.isRequired };

export default SkillTag;
