const api = {

  register( { email, password, pseudo } ) {

    return new Promise( (resolve) => {

      fetch(`/api/register`, {
        method: "POST",
        body: JSON.stringify( {
          email,
          password,
          pseudo
        } ),
        headers: {
          "Content-Type": "application/json"
        }
      } )
      .then( response => response.json() )
      .then( data => resolve( data ) )
      .catch( error => reject( error ) );

    } );

  },

  login( { login, password } ) {

    return new Promise( (resolve,reject) => {

      fetch(`/api/login`, {
        method: "POST",
        body: JSON.stringify( {
          login,
          password
        } ),
        headers: {
          "Content-Type": "application/json"
        }
      } )
      .then( response => response.json() )
      .then( data => resolve( data ) )
      .catch( error => reject( error ) );

    } );
  },

  logout( { token } ) {

    return new Promise( (resolve,reject) => {

      fetch(`/api/logout?token=${token}`, {
        method: "GET"
      } )
      .then( response => response.json() )
      .then( data => resolve( data ) )
      .catch( error => reject( error ) );

    } );

  },

  isLogged() {

    return new Promise( (resolve,reject) => {

      fetch(`/api/is-loged`, {
        method: "GET"
      } )
      .then( response => response.json() )
      .then( data => resolve( data ) )
      .catch( error => reject( error ) );

    } );

  },

  isRegister() {

    return new Promise( (resolve,reject) => {

      fetch(`/api/is-register`, {
        method: "GET"
      } )
      .then( response => response.json() )
      .then( data => resolve( data ) )
      .catch( error => reject( error ) );

    } );

  },

  todo: {

    post( { contentText, userId } ) {

      return new Promise( (resolve,reject) => {

        fetch(`/api/todo`, {
          method: "POST",
          body: JSON.stringify( {
            contentText,
            userId
          } ),
          headers: {
            "Content-Type": "application/json"
          }
        } )
        .then( response => response.json() )
        .then( data => resolve( data ) )
        .catch( error => reject( error ) );

      } );

    },

    getAll() {

      return new Promise( (resolve,reject) => {

        fetch(`/api/todos`, {
          method: "GET"
        } )
        .then( response => response.json() )
        .then( data => resolve( data ) )
        .catch( error => reject( error ) );

      } );
    },

    get( { id } ) {

      return new Promise( (resolve,reject) => {

        fetch(`/api/todo/${id}`, {
          method: "GET"
        } )
        .then( response => response.json() )
        .then( data => resolve( data ) )
        .catch( error => reject( error ) );


      } );

    },

    put( {id, token, contentText} ) {

      return new Promise( (resolve,reject) => {

        fetch(`/api/todo/${id}?token=${token}`, {
          method: "PUT",
          body: JSON.stringify( { contentText } ),
          headers: {
            "Content-Type": "application/json"
          }
        } )
        .then( response => response.json() )
        .then( data => resolve( data ) )
        .catch( error => reject( error ) );

      } );

    },

    delete( { id, token } ) {

      return new Promise( (resolve,reject) => {

        fetch(`/api/todo/${id}?token=${token}`, {
          method: "DELETE"
        } )
        .then( response => response.json() )
        .then( data => resolve( data ) )
        .catch( error => reject( error ) );

      } );
    }

  }

};

export default api;