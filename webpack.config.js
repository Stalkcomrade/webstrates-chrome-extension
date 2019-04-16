var webpack = require("webpack"),
    path = require("path"),
    fileSystem = require("fs"),
    env = require("./utils/env"),
    HtmlWebpackPlugin = require("html-webpack-plugin"),
    ChromeExtensionReloader = require('webpack-chrome-extension-reloader'),
    {
        VueLoaderPlugin
    } = require('vue-loader'),
    WriteFilePlugin = require("write-file-webpack-plugin");

function resolve(dir) {
    return path.join(__dirname, '..', dir)
}

const ExtractTextPlugin = require("extract-text-webpack-plugin");

var alias = {
    // 'getOps.js': 'src/js/getOps.js'
    //     'ws.png': './assets/ws.png'
    // 'vue': 'node_modules/vue/dist/vue.runtime.min.js' // specifying minified build
};

// load the secrets
// var alias = {
//     'vue$': 'vue/dist/vue.esm.js'
// };

var secretsPath = path.join(__dirname, ("secrets." + env.NODE_ENV + ".js"));

if (fileSystem.existsSync(secretsPath)) {
    alias["secrets"] = secretsPath;
}

var options = {
    entry: {
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
                        // 'scss': 'vue-style-loader!css-loader!sass-loader',
                        // 'sass': 'vue-style-loader!css-loader!sass-loader?indentedSyntax',
                        'file-loader': 'file-loader'

                    },
                    extractCSS: true
                }
            },
            {
                test: /\.js$/,
                loader: 'babel-loader',
                exclude: /node_modules/
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
                use: ExtractTextPlugin.extract({
                    fallback: "style-loader",
                    use: "css-loader"
                })
            }
        ]
    },
    resolve: {
        alias: alias,
        extensions: ['.js', '.vue']
    },
    plugins: [
        // expose and write the allowed env vars on the compiled bundle
        new webpack.DefinePlugin({
            "process.env.NODE_ENV": JSON.stringify(env.NODE_ENV)
        }),
        // new ChromeExtensionReloader({
        //     port: 9090, // Which port use to create the server
        //     reloadPage: true, // Force the reload of the page also
        //     entries: { // The entries used for the content/background scripts
        //         contentScript: ['popup', 'options'],
        //         background: 'background' // *REQUIRED
        //     }
        // }),
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
        new ExtractTextPlugin("style.css"),
    ]
};

if (env.NODE_ENV === "development") {
    options.devtool = "cheap-module-eval-source-map";
}

module.exports = options;