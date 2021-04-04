import path from 'path';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

const mode = process.env.NODE_ENV || 'development';

const { pathname } = new URL(import.meta.url);

export default {
  mode,
  devtool: 'source-map',
  output: {
    path: path.resolve(pathname, '..', 'dist', 'public'),
  },
  devServer: {
    host: 'localhost',
    port: 4000,
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
