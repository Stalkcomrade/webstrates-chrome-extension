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


const nodeExternals = require('webpack-node-externals') // mocha-webpack

var alias = {};

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}
var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}

var options = {
    watch: true,
    entry: {
        ws: path.join(__dirname, "assets/ws.png"),
        mocha: path.join(__dirname, "assets/mocha.js"),
        popup: path.join(__dirname, "src/js/popup.js"),
        popupVue: path.join(__dirname, "src/js/popup/Popup.vue"),
        options: path.join(__dirname, "src/js/options.js"),
        background: path.join(__dirname, "src/js/background.js"),
        getOps: path.join(__dirname, "src/js/getOps.js"),
        getStructure: path.join(__dirname, "src/js/getStructure.js"),
        testFile: path.join(__dirname, "tests/componentsClient.test.js")
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
            },
            {
                test: /\.(png|jpg|gif|svg)$/,
                loader: 'file-loader',
                options: {
                    name: '[name].[ext]?[hash]'
                }
            },
            {
                test: /\.css$/,
                use: [
                    'vue-style-loader',
                    'css-loader'
                ]
            }
            // {
            //     test: /\.css$/,
            //     use: [{
            //             loader: MiniCssExtractPlugin.loader,
            //             options: {
            //                 // you can specify a publicPath here
            //                 // by default it uses publicPath in webpackOptions.output
            //                 publicPath: '../',
            //                 hmr: process.env.NODE_ENV === 'development' || process.env.NODE_ENV === 'testing',
            //             },
            //         },
            //         'css-loader',
            //     ],
            // }
        ]
    },
    resolve: {
        alias: alias,
        extensions: ['.js', '.vue']
    },
    plugins: [
        // new MiniCssExtractPlugin({
        //     // Options similar to the same options in webpackOptions.output
        //     // both options are optional
        //     filename: '[name].css',
        //     chunkFilename: '[id].css',
        // }),
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
                background: path.join(__dirname, "src/js/background.js"), // *REQUIRED
                test: path.join(__dirname, "tests/vue-tests.js"), // *REQUIRED
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
        new HtmlWebpackPlugin({
            cache: true,
            showErrors: true,
            template: path.join(__dirname, "src", "tests.html"),
            filename: "tests.html",
            chunks: ["testFile"]
        })
    ]
};

if (env.NODE_ENV === "development") {

    options.devtool = "eval"

} else if (env.NODE_ENV === "testing") {

    options.devtool = 'inline-cheap-module-source-map';
    options.module.rules[0] = {
        test: /\.vue$/,
        loader: 'vue-loader',
        options: {
            loaders: {
                'file-loader': 'file-loader'
            },
            extractCSS: true
        }
    }

    options.externals = [nodeExternals()], // mocha-webpack
        options.target = 'node', // webpack should compile node compatible code
        options.entry.mainTest = path.join(__dirname, "tests/main.test.js")

    // use absolute paths in sourcemaps (important for debugging via IDE)
    options.output.devtoolModuleFilenameTemplate = '[absolute-resource-path]',
        options.output.devtoolFallbackModuleFilenameTemplate = '[absolute-resource-path]?[hash]'
    options.node = {
        fs: "empty",
        module: "empty"
    } // use for motcha import
}


module.exports = options;