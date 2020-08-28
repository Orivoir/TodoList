import React, {useState, useEffect} from 'react';

import AddTodo from './../AddTodo/AddTodo.js';
import TodoList from './../TodoList/TodoList.js';

import api from './../../api.js';

import './Dashboard.css';

const Dashboard = ({user}) => {

  const [todos, setTodo] = useState( [] );
  const [isPending, setIsPending] = useState( true );

  useEffect( () => {

    if( isPending ) {

      api.todo.getAll()
      .then( data => {

        setIsPending( false );

        if( data.success ) {

          setTodo( data.todos );

        } else {

          console.warn( data );
        }

      } )
      .catch( error => {

        console.error( error );

      } );
    }

  } );

  return (
    <section className="dashboard">
      { !isPending ? (
        <>
          <TodoList
            items={todos}
            onRemove={id => (
              setTodo( todos => todos.filter( t => (
                t.id != id
              ) ) )
            )}
          />

          <AddTodo
            onSubmit={todo => {
              api.todo.post( { contentText: todo, userId: user.id  } )
              .then( data => {
                  if( data.success ) {

                    setTodo( t => [ ...t, data.todo ] );

                  } else {

                    console.warn( data );
                  }
              } )
              .catch( error => {
                console.error( error );
            } )
            }}
          />
      </>
      ): (
        <>
        Loading ...
        </>
      ) }

    </section>
  );
}

export default Dashboard;
