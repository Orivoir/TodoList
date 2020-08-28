const pathResolver = require('path');
const fs = require('fs');

const Storage = {

  use: null,

  setUse( storeName ) {

    if( typeof storeName !== "string" ) return null;

    storeName = storeName.toLocaleLowerCase().trim();

    if( this.isExistsStore( storeName ) ) {

      this.use = storeName;

      return this.use;
    }

    return null;

  },

  get ROOT_STORAGE() {

    return pathResolver.resolve( __dirname, "./../storage" );
  },

  getPathStore( storeName ) {

    if( typeof storeName !== "string" ) return null;

    return pathResolver.join(this.ROOT_STORAGE, storeName );
  },

  isExistsStore( storeName ) {

    let pathStore = this.getPathStore( storeName );

    if( pathResolver.isAbsolute( storeName ) ) {

      pathStore = storeName;
    }

    return !!fs.existsSync( pathStore );

  },

  normalizePathStore( store ) {

    if( pathResolver.isAbsolute( store ) ) {

      return store;
    } else {

      const storeName = store;
      return this.getPathStore( storeName );
    }

  },

  getFiles( store ) {

    const pathStore = this.normalizePathStore( store );

    if( !this.isExistsStore( pathStore ) ) {

      return null;
    }

    return fs.readdirSync( pathStore, {
      encoding: "utf-8",
      withFileTypes: true
    } ).map( dirent => (
      typeof dirent === "object" ? dirent.name: dirent
    ) );

  },

  getIdByFilename( filename ) {

    return parseInt( filename.split('.')[0] );

  },

  getFile( store, id ) {

    const filesName = this.getFiles( store );

    if( filesName instanceof Array ) {

      return filesName.find( fileName => (
        this.getIdByFilename( fileName ) === id
      ) ) || null;

    } else {

      return null;
    }

  },

  generateId( store ) {

    const pathStore = this.normalizePathStore( store );

    const filesName = this.getFiles( pathStore );

    if( filesName instanceof Array ) {

      return filesName.length;
    }

    return null;

  },

  resolveIdFile( store, id ) {

    const pathStore = this.normalizePathStore( store );

    if( !pathStore ) {

      return null;
    }

    if( typeof id !== "number" ) {

      id = this.generateId( pathStore );
    } else {

      id = parseInt( id );

      if( this.getFile( pathStore, id ) !== null ) {

        id = this.generateId( pathStore );
      }
    }

    return id;
  },

  addDoc( state, id, store = null ) {

    const pathStore = this.getPathStore( ( store || this.use ) );

    if( !pathStore || !this.isExistsStore(  pathStore ) ) {

      return null;
    }

    if( typeof state !== "object" ) state = {};

    if( typeof state.id !== "number"  ) {

      id = this.resolveIdFile( store, id );
      state.id = id;
    }

    const filename = `${state.id}.json`;

    fs.writeFileSync(
      pathResolver.join(
        pathStore,
        filename
      ),
      JSON.stringify( state )
      ,{
        encoding: "utf-8"
      }
    );

    return state;

  },

  getDoc( id, store ) {

    store = store || this.use;

    const pathStore = this.normalizePathStore( store );

    if( !pathStore ) return null;

    const fileName = this.getFile( pathStore, id );

    if( !fileName ) {

      return null;
    }

    const pathFile = pathResolver.join( pathStore, fileName );

    return JSON.parse(
      fs.readFileSync(
        pathFile,
        {
          encoding: "utf-8"
        }
      )
    );

  },

  getDocBy( matcher, store ) {

    store = store || this.use;

    const filenames = this.getFiles( store );

    if( !filenames ) return null;

    return filenames.map( filename => (
      this.getDoc(
        this.getIdByFilename( filename ),
        store
      )
    ) ).filter( state => (

      Object.keys( matcher ).filter( key => (

        matcher[ key ] === state[ key ]

       ) ).length === Object.keys( matcher ).length

    ) );


  },

  updateDoc( state, id, store ) {

    store = store || this.use;

    const currentState = this.getDoc( (id || state.id ), store );

    if( !currentState ) {
      return null;
    }

    Object.keys( state ).forEach( key => {

      currentState[ key ] = state[key];
    } );

    this.removeDoc( id, store );

    state.id = id;

    this.addDoc( state, id, store );

    return currentState;
  },

  removeDoc( id, store ) {

    const state = this.getDoc( id, store );

    if( !state ) {

      return null;
    }

    const pathStore = this.normalizePathStore( store );
    const filename = this.getFile( store, id );

    fs.unlinkSync( pathResolver.join( pathStore, filename ) );

    return state;
  }

};

module.exports = Storage;
