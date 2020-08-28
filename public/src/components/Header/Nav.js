import React from 'react';

import './Nav.css';

const Nav = ({
  isLogged,
  onShowLogin,
  onShowRegister,
  onLogout,
  isRegister,
}) => {

  return (
    <nav className="nav">
      <ul className={`${isLogged ? "reverse": ""}`}>

        {!isLogged ? (
          <>
          <li>
            <button
              type="button"
              className="primary-outline"
              onClick={onShowLogin}
            >
              login
            </button>
          </li>

            {!isRegister ? (
            <li>
              <button
                type="button"
                className="primary"
               onClick={onShowRegister}
              >
                register
              </button>
            </li>
            ): null}

          </>
        ): (
          <>
          <li>
            <button
              type="button"
              className="error"
              onClick={onLogout}
            >
              logout
            </button>
          </li>
          </>
        )}

      </ul>
    </nav>
  );
}

export default Nav;