const webpack = require('webpack');

var path = require('path')
var root = path.resolve(__dirname, '..');
var confPath = path.join(root + "/conf")
var distPath = path.join(root + '/dist')
var wwwPath = path.join(root + "/www")

//插件

//检测所有安装过并且保存在 package 中的第三方插件 在需要用的时候加载进来
var ComponentPlugin = require("component-webpack-plugin");
//生成一个加载了所有 webpack 打包文件的 html 文件
var HtmlWebpackPlugin = require('html-webpack-plugin');

// css ?
var ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: {
        home: path.join(wwwPath + "/src/scripts/cats.ts"),
        canvas: path.join(wwwPath + "/src/scripts/fancyCanvas.ts"),
        vendors: ['jquery']
    },
    output: {
        path: distPath,
        // publicPath: "http://localhost:8080/dev/",
        publicPath: "/dev/",
        filename: '[name]/[name].js'
    },
    resolve: {
        extensions: ['', '.js', '.ts', '.tsx', '.css', '.html'],
        fallback: [path.join(__dirname, '../node_modules')],
        alias: {
            "www": path.resolve(root, "www/"),
            "scripts": path.resolve(root, "www/src/scripts"),
            "styles": path.resolve(root, "www/src/styles")

        },
        modulesDirectories: ["web_modules", "node_modules", "bower_components"]

    },
    module: {
        loaders: [{ test: /\.tsx?$/, loader: 'ts-loader' },
            {
                test: /\.css$/,
                loader: ExtractTextPlugin.extract("style", "css")
            },
            // {
            //     test: /\.css$/,
            //     loader: "style!css"
            // },
            {
                test: /\.html$/,
                loader: 'html'
            }
            //  ,{ test: /\.(png|jpg)$/, loader: 'url-loader?limit=8192&name=./img/[hash].[ext]' }
            , { test: /\.(png|jpg)$/, loader: 'url-loader?limit=20000&name=assets/imgs/[path].[hash].[ext]' }
            // , {
            //     test: /\.png$/,
            //     loader: "url-loader",
            //     query: { mimetype: "image/png" }
            // }

            // , {
            //     test: /\.(htm|html)$/i,
            //     loader: 'html-withimg-loader'
            // }

            , {
                //文件加载器，处理文件静态资源
                test: /\.(woff|woff2|ttf|eot|svg)(\?v=[0-9]\.[0-9]\.[0-9])?$/,
                loader: 'file-loader?name=./fonts/[name].[ext]'
            }
        ]
    },
    devServer: {
        inline: true,
        progress: true
    },
    plugins: [new webpack.ProvidePlugin({
            $: "jquery",
            jQuery: "jquery",
            "window.jQuery": "jquery"
        }),
        new webpack.optimize.UglifyJsPlugin({
            compress: {
                warnings: false,
            },
            output: {
                comments: false,
            },
        }),
        new webpack.ResolverPlugin([
            new webpack.ResolverPlugin.DirectoryDescriptionFilePlugin("bower.json", ["main"])
        ], ["normal", "loader"]),
        new ComponentPlugin(),
        new HtmlWebpackPlugin({
            filename: 'home/index.html',
            template: "www/src/templates/home.html",
            chunks: ['home'],
            inject: 'body'
        }),
        new HtmlWebpackPlugin({
            filename: 'canvas/index.html',
            template: "www/src/templates/canvas.html",
            chunks: ['vendors', 'canvas'],
            inject: 'body'
        }),
        new webpack.DefinePlugin({
            'process.env.NODE.ENV': "development"
        }),
        new webpack.HotModuleReplacementPlugin(),
        //extract css 
        new ExtractTextPlugin("[name]/styles/[name].css"),

    ],
    devtool: 'eval-source-map'

}