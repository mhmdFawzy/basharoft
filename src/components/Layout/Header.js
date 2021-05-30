import React from 'react';
import PropTypes from 'prop-types';
import './Header.scss';
import { NavLink } from 'react-router-dom';
import navItems from '../../utils/data';
import useComponentVisible from '../../utils/useComponentVisible';
import useViewport from '../../utils/useViewport';

function Header({ children }) {
  const { ref, isComponentVisible, setIsComponentVisible } = useComponentVisible(false);
  const isMobile = useViewport();
  const closeNav = () => {
    setIsComponentVisible(false);
  };
  const openNav = e => {
    e.stopPropagation();
    setIsComponentVisible(true);
  };

  const getNavItems = () => {
    return navItems.map(item => {
      return (
        <li className="navWrapper__items__item" key={item.id}>
          <NavLink onClick={closeNav} exact to={item.linkTo} className="navLink">
            {item.title}
          </NavLink>
        </li>
      );
    });
  };

  return (
    <>
      <div className="navWrapper">
        <h1 className="navWrapper__logo">jobsNow</h1>
        <button type="button" className="navWrapper__hamburgerButton" onClick={openNav}>
          <div />
        </button>

        <div ref={ref} className={'navWrapper__items '}>
          {isMobile > 599 ? (
            <ul>{getNavItems()}</ul>
          ) : (
            isComponentVisible && <ul>{getNavItems()}</ul>
          )}
        </div>
      </div>
      {children}
    </>
  );
}

Header.propTypes = { children: PropTypes.node.isRequired };

export default Header;
