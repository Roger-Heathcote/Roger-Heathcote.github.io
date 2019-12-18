let CAROUSEL_ACTIVE = false;
const TRANSITION_LENGTH_MANUAL = "0.25s"
const TRANSITION_LENGTH_AUTOMATIC = "2s"
const CAROUSEL_PAUSE_LENGTH = 5;
const OVERLAY_TIMEOUT = 4;
let FIRST_ELEMENT = null;
let PAUSE_TIMER = null;
let OVERLAY_TIMER = null;
let transition_next = transitioner.bind(null, "next");
let transition_last = transitioner.bind(null, "last");

// STATIC ELEMENTS
// STATIC ELEMENTS
// STATIC ELEMENTS
document.querySelector("#top_menu ul:first-child a").focus();
const CAROUSEL = document.getElementById("carousel");
const CAROUSEL_OVERLAY = document.getElementById("carousel_overlay");
const CAROUSEL_IMAGES = document.getElementById("carousel_images");
const AUTO_CHECKBOX = document.getElementById("OL_auto_checkbox")

// EVENT LISTENERS
// EVENT LISTENERS
// EVENT LISTENERS
AUTO_CHECKBOX.addEventListener("click", autoCheckboxHandler, false);
document.getElementById("OL_left_button").addEventListener("click", goLeft, false);
document.getElementById("OL_right_button").addEventListener("click", goRight, false);
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("focusin", focusHandler, true);

// EVENT HANDLERS
// EVENT HANDLERS
// EVENT HANDLERS
function focusHandler(e){
    // Show/hide control overlay if focus events happen within #carousel

    // Original idea here was to modify the overlay's
    // opacity directly. That worked for making the overlay
    // visible but setting it back to zero really messed
    // things up, breaking the hover that normally makes
    // it visible. Still not 100% sure what's going on with
    // that but I suspect it involves a new stacking context
    // being created when the opacity is reduced.
    // Code below...
    //
    // CAROUSEL_OVERLAY.style.opacity = ancestorHasID(e.srcElement, 'carousel') ? "1" : "0";
    
    // This is the second attempt. The opacity is set by
    // a css rule and that seems to work nicely BUT, because
    // the carousel elements use ids I had to use !important
    // to force the rule to apply. I don't feel good about
    // that but it will do as a band aid until the carousel
    // can be refactored to use classes instead. Also a timer
    // fades the overlay away after 5 seconds.

    if(ancestorHasID(e.srcElement, 'carousel')){
        CAROUSEL_OVERLAY.classList.add("force_overlay_visible");
        console.log("ADDING force_overlay_visible class to #carousel_overlay");
        if(OVERLAY_TIMER) clearTimeout(OVERLAY_TIMER);
        OVERLAY_TIMER = setTimeout(()=>{
            CAROUSEL_OVERLAY.classList.remove("force_overlay_visible");
        }, OVERLAY_TIMEOUT  * 1000 );
    } else {
        CAROUSEL_OVERLAY.classList.remove("force_overlay_visible"); 
    };
}       
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
    AUTO_CHECKBOX.checked = false;
    carouselOff();
    transition_next();
}
function goLeft(){
    AUTO_CHECKBOX.checked = false;
    carouselOff();
    transition_last();
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
    transition_dissolve();
}
function toggleAutomaticCheckbox(){ AUTO_CHECKBOX.checked = !AUTO_CHECKBOX.checked; };
function transitioner(direction){
    // This function moves the "active" id forwards or backwards
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
function transition_dissolve(){
    PAUSE_TIMER = setTimeout(transition_next, CAROUSEL_PAUSE_LENGTH * 1000);
}

// STARTUP
// STARTUP
// STARTUP
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
function imageLoadHandler( value ){
    // Called with the name of an imagefile once it has been downloaded and is
    // present in the cache. For each image a div is created and the image set
    // as it's background. That div is then inserted into another the main
    // carousel_images div.
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

// MISC
// MISC
// MISC
function ancestorHasID(elem, id){
    // recursively check up the family tree for specific id
    if(elem.id === id) return true;
    if(elem.parentElement) return ancestorHasID(elem.parentElement, id);
    return false;
}
function main(){
    // The images to use in the carousel are specified in the file images.txt
    // rather than hard coded so non-coders can customise it.
    // This function makes those requests and specifies the function to
    // call once the txt file arrives, or fail to arrive
    const getImageList = (triesRemaining=3) => {
        const requestObject = new XMLHttpRequest();
        requestObject.addEventListener("load", handleImageList);
        requestObject.addEventListener("error", ()=>{
            console.log("Problem downloading image.txt, retrying...")
            if (triesRemaining > 0) getImageList(triesRemaining-1);
            console.log("Failed to download images.txt")
        });
        requestObject.open("GET", "/carousel/images.txt");
        requestObject.send();
    }
    getImageList();
}

main();