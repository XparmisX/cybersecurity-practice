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



//run this function when the document is loaded
window.onload = () => {
    //create a couple of elements in an otherwise empty HTML page
    const heading = document.createElement("h1");
    const headingText = document.createTextNode("Big Head!");
    heading.appendChild(headingText);
    document.body.appendChild(heading);
};

const paragraphs = document.querySelectorAll("p")
//paragraph[0] is the first <p> element
//paragraph[1] is the second <p> element, etc
alert(paragraphs[0].nodeName);

//in DOM, each element or node has 2 parameters: Property and Method
//Properties: informations of an element, like "id", "className", or ...
//Methods: operations of an element, like appendChild(), remove(), or ...
//Also, we can use some attributes and related functions to interact or change the HTML elements

//Property Part
//<h1 id="blog-head">It's a blog about DOM</h1>
//we want to change the header without changing the HTML codes in server, directly
//so, we use DOM 
//firstly, with using a selector named as "getElementByID" we receive the HTML element in JS
var heading = document.getElementById('blog-head');
//now, we use "innerText" to change the inner text!
heading.innerText = 'Hello!';

//"textContent" is also a property which can receive or determine an inside text (without HTML) safer than "innerHTML" because it shows HTML as a pure text, not a code
heading.textContent = 'New stuff here';

//"style" property  helps us to change the CSS style of an element, directly
heading.style.fontSize = '24px';

//we did all these changes without changing the HTML code directly

//Method Part
//<button id="my-button">Click me to read the blog about DOM</button>
//adding an event listener :
var button = document.getElementById('my-button');
button.addEventListener('click', function() {
    alert('You clicked the button for reading the blog about DOM');
});
//"addEventListener" is considered as Method

//other examples of methods
//"document.write" helps us to write into HTML directly,  mostly uses when the page is being loaded. if it uses into scripts after complete loading pages, the page content will be eliminated

//"document.createElement" method can be used to make a new HTML element. later, we can use methods like "appendChild" to add the element to the DOM
var newDiv = document.createElement('div');
newDiv.textContent = 'This is a new div';
document.body.appendChild(newDiv);
//"element.appendChild" add a new element to the current element as the child
var newParagraph = document.createElement('p');
newParagraph.textContent = 'Here is a new paragraph';
document.body.appendChild(newParagraph);
//"element.removeChild" delete a specific child element from its parent element
var parent = document.getElementById('parent');
var child = document.getElementById('child');
parent.removeChild(child);
//methods are like functions!

//Selector Part
//there are different ways for choosing the elements in DOM
//"getElementByTagName": receive the element by the tag name
document.getElementsByTagName("li");
//"getElementsByClassName": receive the element by the class name
document.getElementsByClassName("btn");
//"getElementByID": receive the element by the id 
document.getElementById("title");
