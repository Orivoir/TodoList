const
  exp = require('express'),
  app = exp(),
  server = require('http').Server( app ),
  bodyParser = require('body-parser'),
  path = require('path'),
  storage = require('./lib/storage'),
  session = require('express-session')( {
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: ( 1e3 * 60 * 60 * 12 ),
      sameSite: true
    },
    secret: "http-app-",
    resave: false,
    saveUninitialized: true
  } ),

  ERROR_CODE = {
    "ssc": "session store have fail any update action"
  },

  jsonErrorSsc = {
    "statusCode": 500,
    "statusText": "Internal server error",
    "success": false,
    "details": "error code: [ssc] please contact a admin"
  }
;

app
  .use( "/assets/", exp.static( "public" ) )
  .use( bodyParser.json() )
  .use( session )
  .use( function( request, response, next ) {

    request.isLogged = !!request.session.user;

    next();

  } )
  .use( function( request, response, next ) {

    request.isRegister = typeof request.session.isRegister === "number";

    next();
  } )
  .use( /^\/api\//, function( request, response, next ) {

    response.type( 'application/json' );

    next();

  } )
  .use( /^\/api\/todo\//, function( request, response, next ) {

    if( !request.isLogged ) {

      response.statusCode = 401;

      response.json({
        "statusCode": 401,
        "statusText": "Unauthorized",
        "success": false
      });

    } else {

      next();
    }

  } )
  .use( function( request, response, next ) {

    // remove express header sign
    response.removeHeader( 'X-Powered-By' );

    next();

  } )
;

app
  .get('/', ( request, response ) => (
    response.sendFile(
      path.join( __dirname, "./views/index.html" )
    )
  ) )

  .get('/api/is-loged', ( request, response ) => {

    if( !request.isLogged ) {

      response.json( {
        "statusCode": 200,
        "statusText": "Success",
        "success": false,
        "isLogged": false
      } );

    } else {

      const userResponse = Object.assign( request.session.user );

      delete userResponse.password;

      response.json( {
        "statusCode": 200,
        "statusText": "Success",
        "success": true,
        "isLogged": true,
        "user": userResponse,
        "token": request.session.token
      } );

    }

  } )

  .get('/api/is-register', ( request, response ) => {

    response.json({
      "statusCode": 200,
      "statusText": "Success",
      "success": true,
      "isRegister": !!request.isRegister
    });

  } )

  .get('/api/logout', ( request, response ) => {

    if( !request.isLogged ) {

      response.statusCode = 401;

      response.json({
        "statusCode": 401,
        "statusText": "Unauthorized",
        "success": false,
        "details": "you are not logged"
      });

      return;
    }

    const {token} = request.query;

    if( token === request.session.token ) {

      request.session.destroy( error => {

        if( error ) {

          response.statusCode = 500;

          response.json( jsonErrorSsc );

        } else {

          response.statusCode = 200;

          response.json( {
            "statusCode": 200,
            "statusText": "Success",
            "success": true
          } );

        }

      } );

    } else {

      response.statusCode = 200;

      response.json( {
        "statusCode": 200,
        "statusText": "Success",
        "success": false,
        "details": "invalid token"
      } );

    }

  } )

  .post('/api/login', (request, response) => {

    if( request.isLogged ) {

      response.statusCode = 403;

      response.json( {
        "success": false,
        "statusCode": 403,
        "statusText": "Forbidden",
        "details": "you'r already logged",
      } );

    } else {

      const {login,password} = request.body;

      storage.setUse( 'users' );

      const user = storage.getDocBy( {
        "email": login
      } )[0];

      if( user ) {

        if( user.password === password ) {

          const tokenSession = `token-${Date.now()}-${Math.random().toString().replace('.','-')}`;

          request.session.user = user;
          request.session.token = tokenSession;

          request.session.save( error => {

            if( error ) {

              response.statusCode = 500;

              response.json( jsonErrorSsc );

            } else {

              response.json( {
                "statusCode": 200,
                "statusText": "Success",
                "success": true,
                "user": user,
                "token": tokenSession
              } );

            }

          } );

        } else {

          response.json( {
          "statusCode": 200,
          "statusText": "Success",
          "success": false,
          "details": "credentials errors",
          "credentials": {
            login, password
          }
          } );

        }

      } else {

        response.json( {
          "statusCode": 200,
          "statusText": "Success",
          "success": false,
          "details": `login not exists for ${login}`
        } );
      }

    }

  } )

  .post('/api/register', (request, response) => {

    if( request.isRegister ) {
      // user have already create account
      // during this session

      response.statusCode = 403;

      response.json({
        "statusCode": 403,
        "statusText": "Forbidden",
        "success": false,
        "details": "you have already create account"
      });

    } else if( request.isLogged ) {

      response.statusCode = 403;

      response.json( {
        "success": false,
        "statusCode": 403,
        "statusText": "Forbidden",
        "details": "you'r already logged",
      } );

    } else {

      const {password, email, pseudo} = request.body;

      if(
        !password || !email || !pseudo ||
        !/^([a-zA-Z\.\_]){1,28}\@(a-zA-Z){2,20}\.$/.test( email ) &&
        !/^([a-zA-Z\_\-]){1,32}$/.test( pseudo )
      ) {

        response.json({
          "statusCode": 200,
          "statusText": "Success",
          "success": false,
          "details": "format invalid and/or empty field.s"
        });

      } else {

        storage.setUse('users');

        const isExistsEmail = !!storage.getDocBy( {
          "email": email
        } )[0];

        if( isExistsEmail ) {

          response.json({
            "statusCode": 200,
            "statusText": "Success",
            "success": false,
            "details": "email already exists"
          });

        } else {

          const user = storage.addDoc({
            password, email, pseudo
          }, null, "users");

          request.session.isRegister = user.id;

          request.session.save( error => {

            if( error ) {

              response.statusCode = 500;

              response.json( jsonErrorSsc );

            } else {

              response.statusCode = 201;

              response.json( {
                "statusCode": 201,
                "statusText": "Created",
                "success": true,
                user
              } );
            }

          } );

        }

      }

    }

  } )
  .get('/api/todos', ( request, response ) => {

    storage.setUse('todo');

    const todos = storage.getDocBy( {
      userId: request.session.user.id
    } );

    response.json( {
      "statusCode": 200,
      "statusText": "Success",
      "success": true,
      "todos": todos
    } );

  } )
  .post('/api/todo', (request, response) => {

    let {contentText, userId} = request.body;

    let todo = {
      createAt: Date.now(),
      contentText,
      userId
    };

    if( contentText && contentText.length > 0 && contentText.length <= 255 ) {

      contentText = contentText.trim();
      storage.setUse( "todo" );
      todo = storage.addDoc( todo, null, "todo" );

      response.statusCode = 201;

      response.json({
        "statusCode": 201,
        "statusText": "Created",
        "todo": todo,
        "success": true
      });

    } else {

      response.json({
        "statusCode": 200,
        "statusText": "Success",
        "success": false,
        "details": "field invalid",
        fields: request.body
      });
    }

  } )
  .get('/api/todo/:id', (request, response) => {

    const {id} = request.params;

    storage.setUse( "todo" );

    const todo = storage.getDoc( parseInt( id ), "todo" );

    if( todo ) {

      response.statusCode = 200;

      response.json({
        "statusCode": 200,
        "statusText": "Success",
        "success": true,
        "todo": todo
      });

    } else {

      response.statusCode = 404;

      response.json({
        "statusCode": 404,
        "statusText": "Not found",
        "success": false,
        "id": id
      });

    }

  } )
  .put('/api/todo/:id', (request, response) => {

    let {contentText} = request.body;
    const {id} = request.params;
    const {token} = request.query;

    if( token !== request.session.token ) {

      response.json({
        "statusCode": 200,
        "statusText": "Success",
        "success": false,
        "details": "token invalid"
      });

      return;
    }

    if( contentText && contentText.length > 0 && contentText.length <= 255 ) {

      contentText = contentText.trim();
      storage.setUse( "todo" );

      todo = storage.getDocBy( { id: parseInt( id ) } )[0];

      if( todo ) {

        todo.contentText = contentText;

        todo = storage.updateDoc( todo, todo.id, "todo" );

        response.statusCode = 200;

        response.json({
          "statusCode": 200,
          "statusText": "Success",
          "todo": todo,
          "success": true
        });

      } else {

        response.statusCode = 404;

        response.json({
          "statusCode": 404,
          "statusText": "Not found",
          "success": false
        });

      }

    } else {

      response.json({
        "statusCode": 200,
        "statusText": "Success",
        "success": false,
        "details": "field invalid",
        fields: request.body
      });
    }
  } )
  .delete('/api/todo/:id', (request, response) => {

    const {id} = request.params;
    const {token} = request.query;

    if( token !== request.session.token ) {

      response.json({
        "statusCode": 200,
        "statusText": "Success",
        "success": false,
        "details": "token invalid"
      });

      return;
    }

    storage.setUse( "todo" );

    todo = storage.getDocBy( { id: parseInt( id ) } )[0];

    if( todo ) {

      todo = storage.removeDoc( parseInt(id), "todo" );

      response.statusCode = 200;

      response.json({
        "statusCode": 200,
        "statusText": "Success",
        "todo": todo,
        "success": true
      });

    } else {

      response.statusCode = 404;

      response.json({
        "statusCode": 404,
        "statusText": "Not found",
        "success": false
      });

    }

  } )
;

const httpListener = server.listen( process.PORT || 3001, () => {

  const address = httpListener.address();

  console.log( "\nHttp running at: ", address );
} );
