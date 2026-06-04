var oldVariable = "...";
let currentVariable = "...";
const constantVariable = "...";

let stringType = "Hello";
let numberType = 42;
let booleanType = true;
let nullType = null;
let undefinedType;
let objectType = {
    key : "value",
    anotherkey : 123
};
let symbolType = Symbol("unique");

let greeting = "Hello, " + "World!";

let name = "John";
let personalizedGreeting = `Hello, ${name}!`;

if(numberType > 10) {
    console.log("Number g than 10");
}
else if (numberType == 10) {
    console.log("number is exactly 10");
}
else {
    console.log("number is less than 10");
}

let fruit = "apple";
switch (fruit) {
    case "banana":
        console.log("Banana is yellow.");
        break;
    case "apple":
        console.log("Apple is red or green.");
        break;
    default:
        console.log("Unkown fruit.");
}

for (let i = 0; i < 5; i++) {
    console.log(`For loop iteration: ${i}`);
}

let counter = 0;
while (counter < 5) {
    console.log(`While loop iteration: ${counter}`);
    counter++;
}

counter = 0;
do {
    console.log(`Do-While loop iteration: ${counter}`);
    counter++;
} while (counter < 5);

function add(a, b) {
    return a + b;
}
console.log(`Sum of 5 and 3 is : ${add(5, 3)}`);

//Arrow Function
const multiply = (a, b) => a * b;
console.log(`Product of 5 and 3 is: ${multiply(5, 3)}`);

let fruits = ["apple", "banana", "cherry"];
fruits.push("date");
let firstFruit = fruits[0];
console.log(`Fist fruite: ${firstFruit}`);

let person = {
    name:  "John",
    age: 30,
    greet: function() {
        console.log(`Hello, my name is ${this.name}`);
    }
};
person.greet();

try {
    let result = riskyOperation();
} catch (error) {
    console.log(`An error ocurred: ${error.message}`);
}

//Useful Functions in JS

//btoa:  convert (encode) a string to Base64
//atob: decode a Base64 string to a string
let encoded = btoa('Hello, World!');
console.log(encoded);
let decoded = atob('SGVsbG8sIFdvcmxkIQ==');
console.log(decoded);

let code = "console.log('Executed!')";
eval(code); //run the code in the string!

//constructors :
//func
let func  = new Function('a', 'b', 'return a + b');
console.log(func(2, 3)); //dynamic function
//setTimeout, setInterval
setTimeout("console.log('Executed after delay)", 1000);
//escape: encode a string to URL
//unescape: decode a URL string to string
let escaped = escape('hello world');
console.log(escaped);
let unescaped = unescape('hello%20world');
console.log(unescaped);
//fetch or XMLHttpRequest: sending HTTP Requests
fetch('https://example.com/api', {
    method: 'POST',
    body: JSON.stringify({data: 'data'})
});
