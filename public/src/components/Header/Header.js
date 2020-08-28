import React from 'react';

import Helper from './Helper.js';
import Nav from './Nav.js';

import './Header.css';

const Header = ({
  user,
  isRegister,
  onShowLogin,
  onShowRegister,
  onLogout
}) => {

  const isLogged = user !== null;

  return (
    <header className="header">
     {/* <Title /> */}
     <Nav
        isLogged={isLogged}
        onShowLogin={onShowLogin}
        onShowRegister={onShowRegister}
        onLogout={onLogout}
        isRegister={isRegister}
      />

      <Helper />
    </header>
  );

};

export default Header;