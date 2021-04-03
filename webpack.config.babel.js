import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const mode = process.env.NODE_ENV || 'development';

export default {
  mode,
  devtool: 'source-map',
  output: {
    path: path.resolve(import.meta.url, 'dist', 'public'),
  },
  devServer: {
    host: 'localhost',
    // contentBase: path.join(__dirname, 'dist', 'public'),
    publicPath: '/assets/',
    port: 8080,
    compress: true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: 'babel-loader',
      },
      {
        test: /\.css$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader'],
      },
    ],
  },
  plugins: [new MiniCssExtractPlugin()],
};
