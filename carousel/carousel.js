let CAROUSEL_ACTIVE = false;
const TRANSITION_LENGTH_MANUAL = "0.25s"
const TRANSITION_LENGTH_AUTOMATIC = "2s"
const CAROUSEL_PAUSE_LENGTH = 5;

let FIRST_ELEMENT = null;
const TRANSITIONS = [
    transition_dissolve,
    // transition_wipeDown,
    // transition_wipeLeft,
    // transition_wipeRight,
    // transition_spinOut
];
let PAUSE_TIMER = null;
let transition_next = transition_end.bind(null, "next");
let transition_last = transition_end.bind(null, "last");

// STATIC ELEMENTS
// STATIC ELEMENTS
// STATIC ELEMENTS
// const CAROUSEL_OVERLAY = document.getElementById("carousel_overlay");
const CAROUSEL = document.getElementById("carousel");
const CAROUSEL_IMAGES = document.getElementById("carousel_images");
const AUTO_CHECKBOX = document.getElementById("OL_auto_checkbox")

// EVENT LISTENERS
// EVENT LISTENERS
// EVENT LISTENERS
AUTO_CHECKBOX.addEventListener("click", autoCheckboxHandler, false);
document.getElementById("OL_left_button").addEventListener("click", goLeft, false);
document.getElementById("OL_right_button").addEventListener("click", goRight, false);
document.addEventListener("keydown", keyDownHandler, false);

// EVENT HANDLERS
// EVENT HANDLERS
// EVENT HANDLERS
function keyDownHandler(e){
    console.log("IN KEYDOWN HANDLER");
    if(!e.isComposing){
        console.log("e.key:", e.key);
        if(e.key === "ArrowLeft"){ e.preventDefault(); goLeft(); }
        if(e.key === "ArrowRight"){ e.preventDefault(); goRight(); }
        if(e.key === "a" || e.key === "A"){
             toggleAutomaticCheckbox();
             AUTO_CHECKBOX.checked ? carouselOn() : carouselOff();
        }
    }
}
function autoCheckboxHandler(e){
    console.log("Automatic checkbox is:", e.target.checked);
    e.target.checked ? carouselOn() : carouselOff();
}

// ACTIONS
// ACTIONS
// ACTIONS
function goRight(){
    console.log("GO RIGHT.");
    untickAutomaticCheckbox();
    carouselOff();
    transition_cut_forwards();
}
function goLeft(){
    console.log("GO LEFT.");
    untickAutomaticCheckbox();
    carouselOff();
    transition_cut_backwards();
}
function carouselOff(){
    console.log("CAROUSEL OFF");
    if(PAUSE_TIMER) clearTimeout(PAUSE_TIMER);
    PAUSE_TIMER = null;
    document.body.style.setProperty('--TRANSITION_LENGTH', TRANSITION_LENGTH_MANUAL);
}
function carouselOn(){
    console.log("CAROUSEL ON");
    document.body.style.setProperty('--TRANSITION_LENGTH', TRANSITION_LENGTH_AUTOMATIC);
    let index = Math.floor( Math.random() * TRANSITIONS.length )
    TRANSITIONS[ index ]();
}
function untickAutomaticCheckbox(){ AUTO_CHECKBOX.checked = false; };
function toggleAutomaticCheckbox(){ AUTO_CHECKBOX.checked = !AUTO_CHECKBOX.checked; };


// Called with the name of the imagefile once it has been downloaded and is
// present in the cache. For each image a div is created and the image set
// as it's background. The div is then inserted into another div within the
// carousel.
// Question: This list of images isn't presented to the end user as a list
// but might it be worth representing it as a list internally for the sake
// implementers / maintainers?
// Also this function checks if more than 
function imageLoadHandler( value ){
    // console.log( "Image load handler received:", value );
    let newDiv = document.createElement("div");
    newDiv.classList.add("carousel_image");
    newDiv.classList.add("transition_returns");
    newDiv.style.backgroundImage = "url(\"carousel/images/"+ value +"\")";
    CAROUSEL_IMAGES.appendChild( newDiv );
    let images = document.getElementsByClassName("carousel_image");
    if(images.length > 1){
        // console.log("More than one image, start the carousel if not started already");
        if (!CAROUSEL_ACTIVE){
            CAROUSEL_ACTIVE = true;
            FIRST_ELEMENT = images[0];
            FIRST_ELEMENT.setAttribute("id", "active");
            CAROUSEL.style.background = "initial";
            carouselOn();
        }
    }
}

function handleImageList( requestResult ) {
    // This function reads images.txt and tests each line against a regex
    // to ensure that it looks like an image file name and, if it does, it
    // trys to download it into an image object. If it succeeds the function
    // imageLoadHandler is called with that object. If not an error message
    // is logged to the console.
    const fileNames = requestResult.target.response.split("\n");
    fileNames.forEach( (value)=>{
        if( /(?=^(\S|\ )+$)[^?\=\b]+\.(jpg|jpeg|png|gif)$/i.test(value) ){
            //console.log("value:", value);
            let image = new Image();
            image.addEventListener("load", (e)=>{imageLoadHandler(value)});
            image.addEventListener("error", e=>console.log("ERROR LOADING IMAGE:", e) );
            image.src = "/carousel/images/" + value;
        }
    });
}

function main(){
    // The images to use in the carousel are specified in the file images.txt
    // rather than hard coded so non-coders can customise it.
    // This function makes those requests and specifies the function to
    // call once the txt file arrives, or fail to arrive
    const getImageList = (triesRemaining=3) => {
        const oReq = new XMLHttpRequest();
        oReq.addEventListener("load", handleImageList);
        oReq.addEventListener("error", ()=>{
            console.log("Problem downloading image.txt, retrying...")
            if (triesRemaining > 0) handleImageList(tries-1);
            console.log("Failed to download images.txt")
        });
        oReq.open("GET", "/carousel/images.txt");
        oReq.send();
    }
    getImageList();
}

main();

// TODO
// Add auto checkbox
// Add manual controls


// TRANSITIONS
// TRANSITIONS
// TRANSITIONS

// This function moves the "active" id forwards or backwards
function transition_end(direction){
    console.log("TRANSITION_END");
    let current_node = document.getElementById("active");
    current_node.removeAttribute("id");
    let lastElement = CAROUSEL_IMAGES.lastElementChild;
    let next_node;
    if(direction == "next"){
        next_node = current_node.nextElementSibling == null ? FIRST_ELEMENT : current_node.nextElementSibling;
    } else {
        next_node = current_node.previousElementSibling == null ? lastElement : current_node.previousElementSibling;
    }
    next_node.setAttribute("id", "active");
    if(AUTO_CHECKBOX.checked) carouselOn();
}


// function transition_next(){
//     let lastElement = document.getElementById("carousel_images").lastElementChild;
//     let current_node = document.getElementById("active");
//     let next_node = current_node.nextElementSibling == null ? FIRST_ELEMENT : current_node.nextElementSibling;
//     // let prev_node = current_node.previousElementSibling == null ? lastElement : current_node.previousElementSibling;
//     current_node.removeAttribute("id");
//     next_node.setAttribute("id", "active");
//     if(document.getElementById("OL_auto_checkbox").checked) carouselOn();
// }

// function transition_last(){
//     let lastElement = document.getElementById("carousel_images").lastElementChild;
//     let current_node = document.getElementById("active");
//     // let prev_node = current_node.nextElementSibling == null ? FIRST_ELEMENT : current_node.nextElementSibling;
//     let next_node = current_node.previousElementSibling == null ? lastElement : current_node.previousElementSibling;
//     current_node.removeAttribute("id");
//     next_node.setAttribute("id", "active");
//     if(document.getElementById("OL_auto_checkbox").checked) carouselOn();
// }

// This function implements the delay between images.
// It is called by transition functions when they have finished
function pause_then_proceed(){
    PAUSE_TIMER = setTimeout(transition_next, CAROUSEL_PAUSE_LENGTH * 1000);
}

// Keep for transition debugging purposes...
// document.addEventListener("animationend", transition_log, false);
// document.addEventListener("transitionrun", transition_log, false);
// document.addEventListener("transitionend", transition_log, false);
// document.addEventListener("transitioncancel", transition_log, false);
// function transition_log(e){
//     console.log("TRANSLOG:", e.type, e.propertyName, e.target.style.backgroundImage);
// }



function transition_cut_forwards(){
    console.log( "Inside cut forwards.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    transition_next();
}

function transition_cut_backwards(){
    console.log( "Inside cut backwards.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    transition_last();
}


function transition_dissolve(){
    console.log( "Inside dissolve transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    pause_then_proceed();
}

function transition_wipeDown(){
    console.log( "Inside wipeDown transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    pause_then_proceed();
}

function transition_wipeLeft(){
    console.log( "Inside wipeLeft transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    pause_then_proceed();
}

function transition_wipeRight(){
    console.log( "Inside wipeRight transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    pause_then_proceed();
}

function transition_spinOut(){
    console.log( "Inside spinOut transition.");
    current_node = document.getElementById("active");
    current_node.style.transform = "rotate(360deg)";
    pause_then_proceed();
}
