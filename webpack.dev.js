const webpack = require("webpack");
const path = require("path");

const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {

  // https://webpack.js.org/concepts/entry-points/#multi-page-application
  entry: {
    index: './src/js/index.js'
  },

  // https://webpack.js.org/configuration/dev-server/
  devServer: {
    port: 8080
  },
    module:{
        rules:[
            {
                test:/\.css$/,
                use:['style-loader','css-loader']
            },
            {
      test: /\.(png|jpg|jpeg|gif|svg|woff|woff2|ttf|eot)$/,
      use: ['file-loader']
    }
       ]
},

  // https://webpack.js.org/concepts/plugins/
  plugins: [
    new HtmlWebpackPlugin({
      template: './src/index.html',
      inject: true,
      chunks: ['index'],
      filename: 'index.html'
    })
  ],
    output: {
        filename: 'main.js',
        path: path.resolve(__dirname, 'dist')
  }
};


//   
//  {
//            test: /\.(png|jp(e*)g|svg)$/,  
//            use: [{
//                loader: 'url-loader',
//                options: { 
//                    limit: 8000, // Convert images < 8kb to base64 strings
//                    name: 'images/[hash]-[name].[ext]'
//                } 
//            }]
//        }



//
//resolve: {
//        extensions: ['', '.html', '.js', '.json', '.scss', '.css'],
//        alias: {
//            leaflet_css: __dirname + "/node_modules/leaflet/dist/leaflet.css",
//            leaflet_marker: __dirname + "/node_modules/leaflet/dist/images/marker-icon.png",
//            leaflet_marker_2x: __dirname + "/node_modules/leaflet/dist/images/marker-icon-2x.png",
//            leaflet_marker_shadow: __dirname + "/node_modules/leaflet/dist/images/marker-shadow.png"
//        }
//    }