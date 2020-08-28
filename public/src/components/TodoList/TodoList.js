import React from 'react';

import Todo from './Todo';

import api from '../../api';

import beachImg from './../../images/beach.png';

import './TodoList.css';

const TodoList = ({items,onRemove}) => {
  return (
    <section className="todolist">
      {items.length > 0 ? (
        items.map( (item,key) => (
          <Todo
            isEven={(key % 2 === 0)}
            key={item.id}
            item={item}
            onRemove={id => {
              api.todo.delete( {
                id,
                token: sessionStorage.getItem('token-session')
              } )
              .then( data => {

                if( data.success ) {

                  onRemove( id );

                } else {

                  console.warn( data );
                }

              } )
              .catch( error => {

                console.error( error );
              } )
            }}
          />
        ) )
      ): (
        <div class="empty-todo">
          <img
            width="128"
            height="128"
            alt="beach"
            src={beachImg}
          />
          <p>You have not task</p>
        </div>
      )}
    </section>
  );
}

export default TodoList;