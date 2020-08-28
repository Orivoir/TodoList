import React, {useState, useEffect, useRef } from 'react';

import './Todo.css'

import FormEdit from './../FormEdit/FormEdit.js';
import api from '../../api';

const Todo = ({
  item,
  isEven,
  onRemove
}) => {

  useEffect( () => {

    if( itemRef.current?.scrollIntoView instanceof Function ) {

      itemRef.current.scrollIntoView();

    }


  }, [ item ] );

  const itemRef = useRef( null );
  const [ isShowEditTodo, setIsShowEditTodo ] = useState( false );
  const [ contentText, setContentText ] = useState( item.contentText );

  return (
    <li className={`todo ${isEven ? "even": ""}`} ref={itemRef} >
      <section>

        <div>

          { isShowEditTodo ? (
            <FormEdit
              onClose={() => (
                setIsShowEditTodo( false )
              )}
              contentText={item.contentText}
              onSubmit={({contentText}) => {

                if( contentText !== item.contentText ) {

                  api.todo.put({
                    id: item.id,
                    contentText,
                    token: sessionStorage.getItem('token-session')
                  })
                  .then( data => {

                    if( data.success ) {

                      setContentText( data.todo.contentText )
                      setIsShowEditTodo( false );

                    } else {

                      console.warn( data );
                    }
                  } )
                  .catch( error => {
                    console.error( error );
                  } )
                }
              }}
            />
          ): (
            <a
              href="#"
              className="content-text"
              onClick={e => {
                e.preventDefault();

                setIsShowEditTodo( true );

              }}
            >
              {contentText}
            </a>
          ) }
        </div>

        <aside>

          <button
            type="button"
            className="error"
            onClick={() => onRemove( item.id )}
          >
            <i className="fas fa-trash-alt"></i>
          </button>

        </aside>

      </section>
    </li>
  );
}

export default Todo;