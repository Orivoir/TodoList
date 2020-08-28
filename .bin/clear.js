#! /usr/bin/env node

const
  path = require('path'),
  args = process.argv.slice( 2, ),
  isExistsArg = argname => (
    args.find( a => a === argname )
  ),
  isExistsArgByPattern = patternArg => (
    args.find( a => patternArg.test( a ) )
  ),
  PATH_STORAGE = path.resolve( __dirname, "./../storage" ),

  fs = require('fs'),
  readdir = storeName => (
    fs.readdirSync(
      path.join( PATH_STORAGE, storeName ),
      { encoding: "utf-8", withFileTypes: true }
    )
    .map( dirent => (
      typeof dirent === "object" ? dirent.name: dirent
    ) )
  )
;

if( isExistsArgByPattern( /^\-(\-)?user(s)?$/ ) ) {

  const filesname = readdir( "users" );

  filesname.forEach( filename => (

    filename.split( '.' )[1] === "json" ? fs.unlinkSync( path.join( PATH_STORAGE, "users", filename ) ): null

  ) );

  console.log(`\n${filesname.length} file.s have been removed`);

  process.exit( null );

} else if( isExistsArgByPattern( /^\-(\-)?todo(s)?$/ ) ) {

  const filesname = readdir( "todo" );

  filesname.forEach( filename => (

    filename.split( '.' )[1] === "json" ? fs.unlinkSync( path.join( PATH_STORAGE, "todo", filename ) ): null

  ) );

  console.log(`\n${filesname.length} file.s have been removed`);

  process.exit( null );

} else {

  console.log( "\nyou should give storage type in arg1" );

  process.exit( null );

}
