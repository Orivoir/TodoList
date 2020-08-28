import React, {useEffect, useRef, useState} from 'react';

import './FormEdit.css';

const FormEdit = ({
  onClose,
  onSubmit,
  contentText
}) => {

  const formRef = useRef( null );

  useEffect( () => {

    const onImplicitClose = e => {

      if( e.target.parentNode === formRef.current ) {

        return;
      }

      onClose();

    };

    document.addEventListener('click', onImplicitClose );

    return () => (
      document.removeEventListener( 'click', onImplicitClose  )
    );

  } );

  const [newTodo, setNewTodo] = useState( contentText );

  return (
    <div>
      <form
        className="formedit"
        ref={formRef}
        onSubmit={e => {
          e.preventDefault();

          onSubmit( {contentText: newTodo} );
        }}
      >

        <button
          type="button"
          className="error"
          onClick={ () => (
            onClose()
          ) }
        >
          <i className="fas fa-times"></i>
        </button>

        <input
          type="text"
          defaultValue={contentText}
          autoFocus={true}
          onChange={ ({target}) => setNewTodo( target.value ) }
        />

        <button
          type="submit"
          className="primary"
        >
          update
        </button>
      </form>
    </div>
  );
}

export default FormEdit;