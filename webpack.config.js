const path = require("path");
// const miniCssExtrac = require("mini-css-extract-plugin");
// const cssMinimizerPuligs = require("css-minimizer-webpack-plugin")
module.exports = function(env){
    return {
        entry: "./src/ts/index.ts",
        target: 'es5',
        devtool: "source-map",
        mode: env.production? "production": "development",
        // plugins:[
        //     new miniCssExtrac({
        //     filename: 'css/main.css'
        //     })
        // ],
        module: {
            rules:[
                {
                    test:/\.ts$/,
                    use:"ts-loader",
                    exclude: /node_modules/
                },
                {
                    test:/\.s[ac]ss$/,
                    use:["style-loader", "css-loader", "sass-loader"],
                }
            ]
        },
        resolve:{
            extensions: [".tsx", ".ts", ".js"]
        },
        output:{
            filename:"js/dist.js",
            path: path.resolve(__dirname, "publics/static")
        }
    }
}