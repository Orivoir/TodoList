import React, {useState, useEffect} from 'react';

import api from './../api.js';

import Header from './Header/Header.js';

import HeroeBanner from './HeroeBanner/HeroeBanner.js';
import Login from './Login/Login.js';
import Register from './Register/Register.js';
import Dashboard from './Dashboard/Dashboard.js';

const MAIN_CONTENT =  {
  HEROE_BANNER: "heroe-banner",
  LOGIN_FORM: "login-form",
  REGISTER_FORM: "register-form",
  DASHBOARD: "dashboard"
};

const App = () => {

  const [mainContent, setMainContent] = useState( MAIN_CONTENT.HEROE_BANNER );
  const [user, setUser] = useState( null );
  const [isPending, setIsPending] = useState( true );
  const [ error, setError ] = useState( "" );
  const [isRegister, setIsRegister] = useState( false );

  const onLoginResponse = data => {

    if( !data.success ) {

      if( data.details.indexOf('not exists') !== -1 ) {
        // email not exists erease login storage
        localStorage.removeItem('login');
      }

      setError( data.details );

    } else {

      const {user} = data;

      onLogged( {user, token: data.token} );
      setError( null );
    }

  };

  const onLogged = ({user,token}) => {

    sessionStorage.setItem('token-session', token );
    setUser( user );
    setMainContent( MAIN_CONTENT.DASHBOARD );

  };

  const onLogout = () => {

    api.logout( { token: sessionStorage.getItem('token-session') } )
    .then( data => {

      if( data.success ) {

        setUser( null );
        setMainContent( MAIN_CONTENT.HEROE_BANNER );
        sessionStorage.removeItem('token-session');
      } else {

        console.warn( data );
      }

    } )
    .catch( error => {
      console.error( error );
    } );

  };

  useEffect( () => {

    if( !user && isPending ) {

      let resolveCount = 0;

      const onFinishPreset = () => {

        if( ++resolveCount >= 2 ) {

          setIsPending( false );
        }

      };

      const onIsLoggedResponse = data => {

          if( data.isLogged ) {
            onLogged( {user: data.user, token: data.token} );
          }

          onFinishPreset();

      };

      const onIsRegisterResponse = data => {

        if( data.isRegister ) {

          setIsRegister( true );
        }

        onFinishPreset();

      };

      Promise.all( [
        api.isRegister(),
        api.isLogged()
      ] )
      .then( responses => {

        responses.forEach( response => {

          if( typeof response.isLogged  === "boolean" ) {

            onIsLoggedResponse( response );
          } else {
            onIsRegisterResponse( response );
          }

        } );


      } )
      .catch( error => {

        console.error( error );

      } );

    }

  }, [] );

  return (
    <>
    { !isPending ? (
      <section className="app">
        <Header
          isRegister={isRegister}
          user={user}
          onShowLogin={() => setMainContent( MAIN_CONTENT.LOGIN_FORM )}
          onShowRegister={() => setMainContent( MAIN_CONTENT.REGISTER_FORM )}
          onLogout={onLogout}
        />

        {error && (
          <p className="error">
            <i className="fas fa-bomb"></i>&emsp;
            {error}
          </p>
        )}

        { mainContent === MAIN_CONTENT.HEROE_BANNER ? (
          <HeroeBanner />
        ): mainContent === MAIN_CONTENT.LOGIN_FORM ? (
          <Login
            onSubmit={({login, password}) => {

              api.login( { login, password } )
              .then( onLoginResponse )
              .catch( error => {

                console.error( error );

              } );

            }}
          />
        ): MAIN_CONTENT.REGISTER_FORM === mainContent ? (
          <Register
            onSubmit={({login, password, pseudo}) => {

              api.register( { pseudo, password, email: login } )
              .then( data => {

                if( data.success ) {

                  setMainContent( MAIN_CONTENT.HEROE_BANNER );
                  setError( null );
                  setIsRegister( true );

                  localStorage.setItem('login', login );

                } else {

                  setError( data.details );
                }

              } )
              .catch( error => {

                console.error( error );
              } );

            }}
          />
        ): (
          <Dashboard
            user={user}
          />
        ) }
      </section>
    ): (
      <div className="wrap-loader">
        <div className="global-loader"></div>
      </div>
    ) }

    </>
  );

};

export default App;
