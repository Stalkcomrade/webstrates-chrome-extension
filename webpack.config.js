var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    ChromeExtensionReloader = require('webpack-chrome-extension-reloader'),
    {
        VueLoaderPlugin
    } = require('vue-loader'),
    WriteFilePlugin = require("write-file-webpack-plugin"),
    MiniCssExtractPlugin = require('mini-css-extract-plugin');
// TODO: deprect
// ExtractTextPlugin = require("extract-text-webpack-plugin");

var alias = {
    // 'getOps.js': 'src/js/getOps.js'
    //     'ws.png': './assets/ws.png'
    // 'vue': 'node_modules/vue/dist/vue.runtime.min.js' // specifying minified build
};

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}



var options = {
    // mode: "development",
    watch: true,
    entry: {
        ws: path.join(__dirname, "assets/ws.png"),
        popup: path.join(__dirname, "src/js/popup.js"),
        options: path.join(__dirname, "src/js/options.js"),
        background: path.join(__dirname, "src/js/background.js"),
        getOps: path.join(__dirname, "src/js/getOps.js"),
        getStructure: path.join(__dirname, "src/js/getStructure.js")
    },
    output: {
        path: path.join(__dirname, "build"),
        filename: "[name].bundle.js"
    },
    module: {
        rules: [{
                test: /\.vue$/,
                loader: 'vue-loader',
                options: {
                    loaders: {
                        'css': 'css-loader',
                        'file-loader': 'file-loader'
                    },
                    extractCSS: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/,
                // presets: ["es2015"]
            },
            // {
            //     test: /\.(png|jpg|gif|svg)$/,
            //     loader: 'file-loader',
            //     options: {
            //         publicPath: (url, resourcePath, context) => {
            //             return "chrome-extension://cbnopjholofilabljdolcfnmpobkiagh/assets/"
            //         },
            //         name: '[name].[ext]?[hash]'
            //     }
            // },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: [{
                        loader: MiniCssExtractPlugin.loader,
                        options: {
                            // you can specify a publicPath here
                            // by default it uses publicPath in webpackOptions.output
                            publicPath: '../',
                            hmr: process.env.NODE_ENV === 'development',
                        },
                    },
                    'css-loader',
                ],
                // use: ExtractTextPlugin.extract({
                //     fallback: "style-loader",
                //     use: "css-loader"
                // })
            }
        ]
    },
    resolve: {
        alias: alias,
        extensions: ['.js', '.vue']
    },
    plugins: [
        new MiniCssExtractPlugin({
            // Options similar to the same options in webpackOptions.output
            // both options are optional
            filename: '[name].css',
            chunkFilename: '[id].css',
        }),
        // new ExtractTextPlugin("style.css"),
        // expose and write the allowed env vars on the compiled bundle
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
        }),
        new ChromeExtensionReloader({
            port: 9090, // Which port use to create the server
            reloadPage: true, // Force the reload of the page also
            entries: { // The entries used for the content/background scripts
                contentScript: path.join(__dirname, "src/js/popup.js"),
                background: path.join(__dirname, "src/js/background.js") // *REQUIRED
            }
        }),
        new VueLoaderPlugin(),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "popup.html"),
            // filename: "index.html",
            filename: "popup.html",
            chunks: ["popup", "background"],
            chunksSortMode: function(a, b) {
                return (a.names[0] < b.names[0]) ? -1 : 1;
            }
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "options.html"),
            filename: "options.html",
            chunks: ["options"]
        }),
        new HtmlWebpackPlugin({
            template: path.join(__dirname, "src", "background.html"),
            filename: "background.html",
            chunks: ["background"]
        }),

    ]
};

if (env.NODE_ENV === "development") {
    options.devtool = "cheap-module-eval-source-map";
}


module.exports = options;