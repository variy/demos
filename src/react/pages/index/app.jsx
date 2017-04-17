var React = require('react');
var ReactDOM = require('react-dom');
console.log(ReactDOM.render);
let a = 1;
let b = <h1>Hello, world!</h1>;
ReactDOM.render( b,
    document.getElementById('root')
);

// var Map = React.createClass({
//     update: function(){
        
//     },
//     getInitialState: function() {
//         return {
//             col: 10,
//             row: 22
//         };
//     },
//     render: function(){
//         return (
//             <div>
                
//             </div>
//         )
//     }
// })