进行babel转化
babel-cli  测试babel语法

## file
babel example.js --out-file compile.js

## dir
babel src --out-dir lib
babel src -d dir -s


## installation
npm install --save-dev babel-cli
----    modify npm package.json
npm run build 

babel-node  -- page 7 ES6 标准入门 阮一峰
npm install -save-dev babel-cli

babel-register
npm install --save-dev babel-register
---- need no compile the js code
require("babel-register");
require("./index.js");

babel-core
babel-polifill
babel-standalone  github.com/Daniel15/babel-standalone
babel online babeljs.io/repl/   can transfer ES6=>ES5
ESLint & Mocha
  npm install --save-dev eslint babel-eslint  # .eslintrc
Traceur 转换器 github.com/google/traceur-compiler  ES=>ES5
        npm install -g traceur





DOM 与 BOM 

script 标签中的defer属性  延迟脚本  仅支持部分浏览器
type language scr defer 等

noscript 元素

typeof undefined  =>  undefined 
typeof null  =>  object

alert(null == undefined)  => true


######################################
数据类型  转化为true的值            转化为false的值
Boolean  true                     false
String   任何非空的字符串           空字符串 ''
Number   任何非零数据（无穷大）     0 or NaN
Object   任何对象                  null
Undefined n/a                     undefined
######################################


八进制
079  => decode 79 无效的八进制
08   => decode 8  无效的八进制
070  => decode 56 有效的八进制


十六进制
0xA  => 10 有效的16进制
0x1f => 31 有效的16进制

老版本的javascript保留正零  +0  -0  

var floatNum = 3.125e7 => 31250000
浮点数精度为17位小数
0.1 + 0.2 为0.300000 00000000004

Number.MIN_VALUE 5e-324
Number.MAX_VALUE 1.7976931348623157e308
Infinity -Infinity
Number.POSITIVE_INFINITY
Number.NEGATIVE_INFINITY

alert(isFinite(result))

alert(NaN == NaN)  ==> false   ### important  NaN 与任何值都不等
NaN => not a number  缩写 short for
alert(isNaN(NaN))  => true  
alert(isNaN(10))  => false
alert(isNaN("10"))  => false
alert(isNaN("blue"))  => true
alert(isNaN(true))  => false   true可转化为1，同理 false可以转化为0

isNaN 会首先判断  valueOf()  与 toString()
Number() parseInt() parseFloat()

var num1 = Number("Hello World")  => NaN
var num2 = Number("")  => 0
var num3 = Number(true)  => 1

var num = 10
alert(num.toString())   // "10"
alert(num.toString(8))    // "12"
alert(num.toString(2))  // "1010"
alert(num.toString(16))  // "a"
alert(num.toString(10))  // "10"


var value1 = 10;
var value2 = true;
var value3 = null;
var value4 = undefined;

alert(String(value1));  => "10"
alert(String(value2));  => "true"
alert(String(value3));  => "null"
alert(String(value4));  => "undefined"

ECMA 6.0  => 53 page



“暂时性死区”也意味着typeof不再是一个百分之百安全的操作。
TDZ  temporal dead zone
