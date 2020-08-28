import React, {useState} from 'react';

import './Login.css';

const Login = ({onSubmit}) => {

  const [login, setLogin] = useState( localStorage.getItem('login') || "" );
  const [password, setPassword] = useState( "" );

  return (
    <section className="login">
      <form
        method="post"
        className="form"
        onSubmit={e => {
          e.preventDefault();

          localStorage.setItem('login', login );

          onSubmit( {login, password} );
        }}
      >
        <fieldset className="wrap-fields">
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
              ) }
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
              value={password}
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

export default Login;
