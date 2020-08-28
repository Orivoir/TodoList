const path = require('path');

module.exports = {

  entry: {
    index: "./public/src/index.js"
  },

  output: {
    filename: "index.js",
    path: path.resolve( __dirname, "./public/dist" )
  },

  module: {

    rules: [
      {
        test: /\.js(x)?$/i,
        use: "babel-loader"
      },
      {
        test: /\.css?$/i,
        use: ["style-loader", "css-loader" ]
      },
      {
        test: /\.(png|jpe?g|gif)?$/i,
        use: "url-loader"
      }
    ]
  }

};
