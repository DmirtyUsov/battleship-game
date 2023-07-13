const path = require("path");

module.exports = {
  entry: "./index.js",
  target: "node",
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  resolve: {
    extensions: ['.tsx', '.ts', '.js'],
  },
  output: {
    filename: "game.cjs",
    path: path.resolve(__dirname, "dist"),
  },
};
