/*
    在这个文件中设置我们自定义的打包规则
    1. 所有的规则都写在module.exports里
*/
const webpack = require('webpack'); //访问内置的插件
const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin'); // => 每一个的导入的插件都是一个类 new HtmlWebpackPlugin({})
const MiniCssExtractPlugin = require('mini-css-extract-plugin'); // 抽离css
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin'); // 优化CSS资源(压缩)
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin');

module.exports = {
	performance: {
		hints: false,
	},
	// => 配置优化规则
	optimization: {
		// => 压缩优化
		minimizer: [
			// 压缩CSS(产生问题: js压缩不执行自己默认的压缩方式了,也走的是这个插件,从而导致无法压缩)
			new OptimizeCssAssetsWebpackPlugin(),
			// => 压缩JS的
			new UglifyjsWebpackPlugin({
				cache: true, // => 是否开起缓存
				parallel: true, // => 是否是并发编译
				sourceMap: true, // => 启动源码映射(方便调试)
			}),
		],
	},
	// => 配置环境 1. production 2. development
	mode: 'production',
	// => 入口
	entry: ['@babel/polyfill', './src/index-my.js'],
	// => 出口
	output: {
		// => 输出的文件名, [hash] 让每一次生成的文件名都带hash
		filename: 'js/bundle.min.[hash].js',
		// => 输出目录必须是绝对目录
		path: path.resolve(__dirname, './build'),
		// => 给编译后引用资源地址的前面设置前缀
		publicPath: './',
	},
	// => webpack-dev-server配置 执行命令: webpack-dev-server --config xxx.js (服务启动后默认是不关闭的,当我们修改src中的文件时,它会自动进行编译,然后刷新浏览器)
	devServer: {
		port: 3000, // => 创建服务指定的端口号
		progress: true, // => 显示编译进度
		contentBase: './build', // => 指定当前服务处理资源的目录
		open: false, // => 编译完成后是否自动打开浏览器
	},
	// => 使用插件 (数组)
	plugins: [
		new HtmlWebpackPlugin({
			// 不指定模板会按照默认模板创建一个html文件
			template: './src/index.html',
			// => 输出的文件名
			filename: 'index.html',
			// hash: true, // => 引入的js后面加入hash戳(清除缓存),项目当中每次编译生成不同的js文件引入,而不是在后面加入hash戳
			// => 控制压缩
			minify: {
				collapseWhitespace: true, // 删除空格
				removeComments: true, // => 删除注释
				removeAttributeQuotes: true, // => 删除引号
				removeEmptyAttributes: true, // => 删除空的属性
			},
		}),
		new MiniCssExtractPlugin({
			filename: 'css/main.min.css', // => 指定输出的文件名
			hash: true,
		}),
		// => 在每个模块中中都注入$
		new webpack.ProvidePlugin({
			$: 'jquery',
		}),
	],
	// => 使用加载器loader处理规则
	module: {
		rules: [
			{
				test: /\.(css|less)$/i, // => 基于正则处理哪些文件
				// => 控制使用的loader(有顺序的: 从右到左执行)
				use: [
					// 'style-loader', // => 把CSS插入到HEAD中(内嵌式)
					MiniCssExtractPlugin.loader, // 通过外链的方式导入
					'css-loader', // => 编译解析@import/URL()这种语法
					'postcss-loader', // => 设置前缀
					'less-loader', // => 编译less
				],
			},
			{
				test: /\.js$/i,
				// => 编译JS的loader
				use: [
					{
						loader: 'babel-loader',
						options: {
							// => 基于babel的语法解析包(ES6->ES5)
							presets: ['@babel/preset-env'],
							// => 插件处理 >= es6中的特殊语法
							plugins: [
								[
									'@babel/plugin-proposal-decorators',
									{ legacy: true },
								],
								[
									'@babel/plugin-proposal-class-properties',
									{ loose: true },
								],
								'@babel/plugin-transform-runtime',
							],
						},
					},
					// 'eslint-loader',
				],
				// => 设置JS编译时忽略的文件和指定编译目录
				include: path.resolve(__dirname, 'src'),
				// => 编译时忽略的目录
				exclude: /node_modules/,
			},
			{
				test: /\.(png|jpe?g|gif)$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							esModule: false,
						},
					},
					// {
					// 	loader: 'url-loader',
					// 	options: {
					// 		// => 图片是小于200kb,在处理的时候转成BASE64
					// 		limit: 200 * 1024,
					// 		// => 控制打包后图片所在的目录
					// 		// outputPath: 'images',
					// 	},
					// },
				],
			},
			{
				test: /\.(html|htm)$/i,
				use: 'html-withimg-loader', // 解析 html中的图片资源
			},
		],
	},
};
