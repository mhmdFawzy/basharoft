import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import './relatedcard.scss';
function RelatedCard({ skill }) {
  return (
    <div className="relatedCardWrapper">
      {skill.job_title ? (
        <Link to={`/job/${skill.job_uuid}`}>
          <h3>{skill.job_name || skill.job_title}</h3>
        </Link>
      ) : (
        <Link to={`/skill/${skill.skill_uuid}`}>
          <h3>{skill.skill_name || skill.job_title}</h3>
        </Link>
      )}

      <p>{skill.description}</p>
      <div className="relatedCard__points">
        {skill.skill_type && (
          <div>
            <strong>Type:&nbsp;</strong>
            {skill.skill_type}
          </div>
        )}
        <div>
          <strong>Importance:&nbsp;</strong>
          {skill.importance}
        </div>
        <div>
          <strong>Level:&nbsp;</strong>
          {skill.level}
        </div>
      </div>
    </div>
  );
}

RelatedCard.propTypes = {
  skill: PropTypes.shape({
    skill_uuid: PropTypes.string.isRequired,
    job_uuid: PropTypes.string.isRequired,
    job_name: PropTypes.string.isRequired,
    skill_name: PropTypes.string.isRequired,
    job_title: PropTypes.string.isRequired,
    skill_type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    normalized_skill_name: PropTypes.string.isRequired,
    importance: PropTypes.number.isRequired,
    level: PropTypes.number.isRequired,
  }).isRequired,
};

export default RelatedCard;
