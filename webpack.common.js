
module.exports = {
  module: {
    rules: [
      {
        test:/\.p?css$/,
        use: [
          {loader: 'style-loader'},
          {loader: 'css-loader'},
          {
            loader: 'postcss-loader',
            options: {
              plugins: () => [
                require('postcss-import'),
                require('postcss-define-property'),
                require('postcss-mixins'),
                require('postcss-simple-vars'),
                require('postcss-nested'),
                require('postcss-cssnext'),
                require('postcss-define-property')
              ]
            }
          },
        ]
      },
      {
        test: /.jsx?$/,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader'
        },
      },
      {
        test: /\.(png|jpg|gif|svg)$/,
        use: 'url-loader',
      },
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/,
        use: 'url-loader',
      }
    ],
  },
};
