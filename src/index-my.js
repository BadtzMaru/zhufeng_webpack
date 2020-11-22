// import jquery from 'expose-loader?$!jquery';
// console.log($);
import img1 from './static/avatar1.jpeg';
let img2 = require('./static/avatar1.jpeg');
console.log($);

// => 在js中使用图片(webpack) 需要先把图片导入进来,然后再使用

let img = new Image();
img.src = img2;
document.body.appendChild(img);

// => 浏览器中不能识别ES6Model/CommonJS模块导入导出规范代码
// => es6模块规范 (引入必须在最开始)
import { bind } from './nav.js';
// => CommonJS规范 (node)
let { debounce } = require('./common');

// => CSS需要我们在入口的JS中导入后才可以使用
require('./index.less');

debounce();
bind();

@log
class A {
	constructor() {}
	sum() {
		console.log('sum');
	}
	static fun() {
		console.log('fun');
	}
	n = 10;
}

function log(target) {
	target.decorator = true;
}

A.fun();
new A().sum();
console.log(new A().n);
console.log(A.decorator);
