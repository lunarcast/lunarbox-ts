const HtmlWebpackPlugin = require("html-webpack-plugin");
const { resolve } = require("path");

const mode = process.env.NODE_ENV || "development";
const dev = mode === "development";

const sourceDir = resolve(__dirname, "src");
const outputDir = resolve(__dirname, "dist");

const entry = resolve(sourceDir, "index.ts");
const htmlTemplate = resolve(sourceDir, "index.html");

module.exports = {
  mode,
  entry,
  output: {
    path: outputDir,
    filename: "bundle.js"
  },
  devtool: dev ? "inline-source-map" : "source-map",

  resolve: {
    extensions: [".ts", ".js"]
  },

  module: {
    rules: [
      {
        test: /\.ts$/,
        use: [
          {
            loader: "ts-loader"
          }
        ]
      },
      {
        enforce: "pre",
        test: /\.js$/,
        loader: "source-map-loader"
      }
    ]
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: htmlTemplate
    })
  ]
};
