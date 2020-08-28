import React from 'react';

import TodoListImage from './../../images/todolist.png';

import './HeroeBanner.css';

const HeroeBanner = () => {

  return (
    <section className="heroe-banner">

      <figure>

        <img
          src={TodoListImage}
          width="342"
          height="342"
          alt="todolist"
        />

        <figcaption>
          Labore adipisicing et consectetur in occaecat laborum esse.
        </figcaption>

      </figure>

    </section>
  );

};

export default HeroeBanner;