let CAROUSEL_ACTIVE = false;

// TODO
// I don't like that TRANSITION_LENGTH is in a different place from this
// setting. Investigate if there is a nice way to define it here, next to
// pause length, orina a config file, instead of in index.css.


const CAROUSEL_PAUSE_LENGTH = 5;

const CAROUSEL_OVERLAY = document.getElementById("carousel_overlay");
const CAROUSEL_IMAGES = document.getElementById("carousel_images");
let FIRST_ELEMENT = null;
const TRANSITIONS = [
    // transition_dissolve,
    // transition_wipeDown,
    // transition_wipeLeft,
    // transition_wipeRight,
    transition_spinOut
];
let PAUSE_TIMER = null;


// Event Listners
document.getElementById("OL_left_button").addEventListener("click", goLeft, false);
document.getElementById("OL_right_button").addEventListener("click", goRight, false);
document.getElementById("OL_auto_checkbox").addEventListener("click", autoCheckbox, false);

function carouselOff(){
    if(PAUSE_TIMER) clearTimeout(PAUSE_TIMER);
    PAUSE_TIMER = null;
    document.body.style.setProperty('--TRANSITION_LENGTH', "0.25s");
}


function goRight(e){
    console.log("GO RIGHT.");
    untickCarousel();
    carouselOff();
    transition_cut_forwards();
}

function goLeft(e){
    console.log("GO LEFT.");
    untickCarousel();
    carouselOff();
    transition_cut_backwards();
}

function autoCheckbox(e){
    console.log("AUTO CHECKBOX.");
    if(e.target.checked){
        console.log("Box has been checked");
        carousel();
    } else {
        console.log("Box has been UN checked");
        carouselOff();
    }
}


function untickCarousel(){
    console.log("Stop Carousel called");
    document.getElementById("OL_auto_checkbox").checked = false;
};

// Picks a random transition
function carousel(){
    document.body.style.setProperty('--TRANSITION_LENGTH', "2s");
    let index = Math.floor( Math.random() * TRANSITIONS.length )
    TRANSITIONS[ index ]();
}


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
            FIRST_ELEMENT.setAttribute("id", "active");;
            carousel();
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

// This function is called just before the next transition
// It makes the previous background image invisible using opacity: 0
// It removes the active class from what is to become the bg image
// It adds the active class to whatis to become the next fg img
function transition_next(){
    let lastElement = document.getElementById("carousel_images").lastElementChild;
    let current_node = document.getElementById("active");
    let next_node = current_node.nextElementSibling == null ? FIRST_ELEMENT : current_node.nextElementSibling;
    let prev_node = current_node.previousElementSibling == null ? lastElement : current_node.previousElementSibling;
    current_node.removeAttribute("id");
    // prev_node.style.opacity = 0.0;
    // prev_node.style.zindex = 0.0;
    next_node.setAttribute("id", "active");
    if(document.getElementById("OL_auto_checkbox").checked) carousel();
}

function transition_last(){
    let lastElement = document.getElementById("carousel_images").lastElementChild;
    let current_node = document.getElementById("active");
    // let next_node = current_node.nextElementSibling == null ? FIRST_ELEMENT : current_node.nextElementSibling;
    // let prev_node = current_node.previousElementSibling == null ? lastElement : current_node.previousElementSibling;
    let prev_node = current_node.nextElementSibling == null ? FIRST_ELEMENT : current_node.nextElementSibling;
    let next_node = current_node.previousElementSibling == null ? lastElement : current_node.previousElementSibling;
    current_node.removeAttribute("id");
    // prev_node.style.opacity = 0.0;
    // prev_node.style.zindex = 0.0;
    next_node.setAttribute("id", "active");
    if(document.getElementById("OL_auto_checkbox").checked) carousel();
}

// This function implements the delay between images.
// It is called by transition functions when they have finished
function transition_finished(){
    // console.log("In transition_finished, cueing up next transition_next in", CAROUSEL_PAUSE_LENGTH * 1000, "seconds.")
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
    transition_finished();
}

function transition_wipeDown(){
    console.log( "Inside wipeDown transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    transition_finished();
}

function transition_wipeLeft(){
    console.log( "Inside wipeLeft transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    transition_finished();
}

function transition_wipeRight(){
    console.log( "Inside wipeRight transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    transition_finished();
}

function transition_spinOut(){
    console.log( "Inside spinOut transition.");
    current_node = document.getElementById("active");
    // current_node.style.opacity = 0;
    transition_finished();
}
