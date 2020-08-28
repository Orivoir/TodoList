import React, {useState} from 'react';

import './Helper.css';

const Helper = () => {

  const [hideInfo, setHideInfo] = useState( false );
  const [prepareHideInfo, setPrepareHideInfo] = useState( false );

  return (
    <div className={`helper`}>
    { !hideInfo ? (
      <div className={`wrap-info ${prepareHideInfo ? "close": ""}`}>
        <p>
          Consectetur labore minim enim ullamco tempor veniam et irure irure labore culpa.
          <button type="button" className="primary">
            get started
          </button>
        </p>

        <div className="wrap-icon">
          <button
            type="button"
            className="error"
            onClick={e => {
              setPrepareHideInfo( true );
              setTimeout(() => {
                setHideInfo( true );
              }, 200)
            }}
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      </div>
    ): null}
    </div>
  );

};

export default Helper;