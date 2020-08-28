# TodoList app

> this repository is a enjoy app test with [Nodejs](https://nodejs.org/en/) [Express](http://npmjs.com/package/express) and [Reactjs](https://reactjs.org/)

## Tree

- /todolist

  - webpack.config.js
  - .babelrc
  - package.json

  - server.js

  - /public
    - /src
      - index.js
      - index.css
      - api.js
      - /components
        - *this folder contains the reactjs components write with functional syntax*

  - /views
    - index.html

## Routes

- all routes define from file: **./server.js**

- **GET** *"/"* **text/html** ( entry point frontal app )

> all next routes response **application/json** content

> all request to **POST** routes should have content-type with **application/json**

> if routes contains */api/todo* in path client should be logged

- **GET** */api/is-register* ( check if client have create account during session )

- **GET** */api/logout?token={string}* ( destroy client session while token is valid )

- **POST** */api/login* ( log in route )
  - post params:
    - login: string
    - password: string

- **POST** */api/register* ( create new user )
    - post params:
      - email: string
      - password: string
      - pseudo: string

- **GET** */api/todos* ( get all todos )

- **POST** */api/todo?token={string}* ( create new todo )
  - post params:
    - contentText: string
    - userId: string | int

- **GET** */api/todo/:id* ( get single todo by id )

- **PUT** */api/todo/:id?token={string}* ( upgrade a todo by id )
  - put params:
    - contentText: string

- **DELETE** */api/todo/:id?token={string}* ( delete a todo by id )


## next

```bash
> git clone https://github.com/orivoir/todolist.git

> cd todolist

> npm run build-prod

> npm run start
```

open at: [http://localhost:3001/](http://localhost:3001/)
