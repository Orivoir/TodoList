import React, {useState} from 'react';

import './Register.css';

const Register = ({onSubmit}) => {

  const [login, setLogin] = useState( "" );
  const [password, setPassword] = useState( "" );
  const [pseudo, setPseudo] = useState( "" );

  return (
    <section className="register">
      <form
        method="post"
        className="form"
        onSubmit={e => {

          e.preventDefault();

          onSubmit( {login, password, pseudo} );

        }}
      >
        <fieldset className="wrap-fields">

          <div className="field">
            <label htmlFor="pseudo">
              <i className="fas fa-user"></i>
            </label>
            <input
              type="text"
              id="pseudo"
              autoComplete="off"
              name="pseudo"
              onChange={({target}) => (
                setPseudo( target.value )
              )}
            />
          </div>

          <div className="field">
            <label htmlFor="login">
              <i className="fas fa-at"></i>
            </label>
            <input
              type="email"
              id="login"
              autoComplete="off"
              name="login"
              onChange={({target}) => (
                setLogin( target.value.toLowerCase() )
              )}
              value={login}
            />
          </div>

          <div className="field">
            <label htmlFor="password">
              <i className="fas fa-lock"></i>
            </label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={({target}) => (
                setPassword( target.value )
              )}
            />
          </div>

          <div>
            <button type="submit" className="success">next</button>
          </div>
        </fieldset>
      </form>
    </section>
  );
}

export default Register;