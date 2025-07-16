const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

module.exports = {
  entry: {
    "form-modules": "./src/index.js",
  },
  output: {
    path: path.resolve(__dirname, "build"),
    filename: "[name]-script.js",
    clean: true,
    library: {
      name: "FormModules",
      type: "umd",
      export: "default",
      umdNamedDefine: true,
    },
    globalObject: "typeof self !== 'undefined' ? self : this",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader"],
      },
      {
        test: /\.s[ac]ss$/i,
        use: [MiniCssExtractPlugin.loader, "css-loader", "postcss-loader", "sass-loader"],
      },
    ],
  },
  plugins: [
    require('@tailwindcss/forms'),
    new MiniCssExtractPlugin({
      filename: "[name]-style.css",
    }),
  ],
  resolve: {
    extensions: [".js", ".css", ".scss", ".sass"],
  },
  externals: {},
};
