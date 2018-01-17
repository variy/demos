/*// 函数参数的默认值
let x =99;
let foo = function(p=x+1){
    return p;
}

document.write(foo() + '<br />')
document.write(foo())

let foo2 = function({x, y =5}){
    return x + y;
}

document.write(foo2({}) + '<br />')*/

// alert((function(a=2, b, c){}).length);
/*let z =1;
let f = function(z, y=z){
    alert(y)
}
f(2)*/

let x = 1;
let f = function( y = x){
    let x = 2;
    alert(y)
}

f();
