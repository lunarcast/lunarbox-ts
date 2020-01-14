const HtmlWebpackPlugin = require('html-webpack-plugin')
const { resolve } = require('path')

const mode = process.env.NODE_ENV || 'development'
const dev = mode === 'development'

const sourceDir = resolve(__dirname, 'src')
const outputDir = resolve(__dirname, 'dist')

const entry = resolve(sourceDir, 'index.ts')
const htmlTemplate = resolve(sourceDir, 'index.html')

const babelConfig = {
    presets: ['@babel/preset-env', 'preact', '@babel/preset-typescript'],
    plugins: [
        '@babel/proposal-class-properties',
        '@babel/proposal-object-rest-spread',
        '@babel/plugin-transform-runtime'
    ]
}

module.exports = {
    mode,
    entry,
    output: {
        path: outputDir,
        filename: 'bundle.js'
    },
    devtool: dev ? 'inline-source-map' : 'source-map',
    resolve: {
        extensions: ['.ts', '.js', '.tsx']
    },
    module: {
        rules: [
            {
                test: /\.tsx?$/,
                use: [
                    {
                        loader: 'babel-loader',
                        options: babelConfig
                    }
                ]
            },
            {
                enforce: 'pre',
                test: /\.js$/,
                loader: 'source-map-loader'
            }
        ]
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: htmlTemplate
        })
    ]
}
