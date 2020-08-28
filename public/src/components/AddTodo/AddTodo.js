import React, {useState} from 'react';

import './AddTodo.css';

const AddTodo = ({onSubmit}) => {

  const [todo, setTodo] = useState( "" );

  return (
    <section className="addtodo">
      <form
        onSubmit={e => {
          e.preventDefault();
          onSubmit( todo );
          setTodo("");
        }}
      >
        <div>
          <label htmlFor="todo">
            <i className="fas fa-calendar-check"></i> to made
          </label>

          <textarea
            id="todo"
            onChange={({target}) => setTodo( target.value )}
            value={todo}
            spellCheck="false"
            autoComplete="off"
          />
        </div>

        <div>
          <button
            type="submit"
            className="primary"
          >
            save
          </button>
        </div>
      </form>
    </section>
  );
}

export default AddTodo;