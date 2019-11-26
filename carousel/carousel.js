const LIVE_IMAGES = [];
let CAROUSEL_ACTIVE = false;
const TRANSITION_LENGTH = 1    // Seconds
const TRANSITION_STEPS_PER_SECOND = 10 
const TRANSITION_TOTAL_STEPS = TRANSITION_STEPS_PER_SECOND * TRANSITION_LENGTH
const CAROUSEL_PAUSE = 1
let IDX_A = 0
let IDX_B = 1
const TRANSITIONS = [
    transition_dissolve,
    transition_wipeDown,
    transition_wipeLeft,
    transition_wipeRight,
    transition_spinOut
];
// const TRANSITIONS = [ transition_spinOut ];

function randomTransition(){
    let index = Math.floor( Math.random() * TRANSITIONS.length )
    console.log( "TRANSITION:", index, TRANSITIONS[index] )
    return TRANSITIONS[ index ];
}

function next(a,b){
    //console.log("In next function, choosing new images")
    IDX_A++; if (IDX_A >= LIVE_IMAGES.length) IDX_A = 0;
    IDX_B++; if (IDX_B >= LIVE_IMAGES.length) IDX_B = 0;
    carousel( randomTransition() );
    //console.log("Calling carousel in", CAROUSEL_PAUSE * 1000,"ms")
}

function transition_dissolve(step, callback){
    //console.log("transition_dissolve. Step", step,"Index A:",IDX_A,"Index B:",IDX_B)
    let imgA = LIVE_IMAGES[IDX_A], imgB = LIVE_IMAGES[IDX_B]

    if(step===0){
        // Set up initial CSS properties for and b
        //console.log("A:", LIVE_IMAGES[IDX_A])
        imgA.style.zIndex = "0";
        imgA.style.opacity = "1";
        imgA.classList.remove("hidden");
        imgB.style.zIndex = "1";
        imgB.style.opacity = "0";
        imgB.classList.remove("hidden");
    }
    
    if (step <= TRANSITION_TOTAL_STEPS){
        imgB.style.opacity = step * ( 1.0 / TRANSITION_TOTAL_STEPS )
        setTimeout(transition_dissolve, 1000 / TRANSITION_STEPS_PER_SECOND, step+1, callback)
    } else {
        imgA.classList.add("hidden");
        imgA.style.opacity = "1";
        callback()
    }
}

function transition_wipeDown(step, callback, savedOffset=0){
    //console.log("transition_wipeDown. Step", step,"Index A:",IDX_A,"Index B:",IDX_B)
    let imgA = LIVE_IMAGES[IDX_A], imgB = LIVE_IMAGES[IDX_B]
    if(step===0){
        // Set up initial CSS properties for and b
        savedOffset = imgB.offsetTop;
        imgA.style.zIndex = "0";
        imgA.classList.remove("hidden");
        imgB.style.zIndex = "1";
        imgB.style.opacity = "1";
        imgB.style.top =  (-imgB.height).toString() + "px";
        imgB.classList.remove("hidden");
    }
    if (step <= TRANSITION_TOTAL_STEPS){
        let offset = -imgB.height + (step * (imgB.height / TRANSITION_TOTAL_STEPS))
        imgB.style.top = offset.toString() + "px"
        setTimeout(transition_wipeDown, 1000 / TRANSITION_STEPS_PER_SECOND, step+1, callback, savedOffset)
    } else {
        imgA.classList.add("hidden");
        imgB.style.top = "45px";
        callback()
    }
}

function transition_wipeLeft(step, callback, savedOffset=0){
    //console.log("transition_wipeLeft. Step", step,"Index A:",IDX_A,"Index B:",IDX_B)
    let imgA = LIVE_IMAGES[IDX_A], imgB = LIVE_IMAGES[IDX_B]
    if(step===0){
        // Set up initial CSS properties for and b
        savedOffset = imgB.offsetLeft;
        imgA.style.zIndex = "0";
        imgA.classList.remove("hidden");
        imgB.style.zIndex = "1";
        imgB.style.opacity = "1";
        imgB.style.left =  (-imgB.width).toString() + "px";
        imgB.classList.remove("hidden");
    }
    if (step <= TRANSITION_TOTAL_STEPS){
        let offset = -imgB.width + (step * (imgB.width / TRANSITION_TOTAL_STEPS))
        imgB.style.left = offset.toString() + "px"
        setTimeout(transition_wipeLeft, 1000 / TRANSITION_STEPS_PER_SECOND, step+1, callback, savedOffset)
    } else {
        imgA.classList.add("hidden");
        imgB.style.left = savedOffset;
        callback()
    }
}

function transition_wipeRight(step, callback, savedOffset=0){
    //console.log("transition_wipeRight. Step", step,"Index A:",IDX_A,"Index B:",IDX_B)
    let imgA = LIVE_IMAGES[IDX_A], imgB = LIVE_IMAGES[IDX_B]
    if(step===0){
        // Set up initial CSS properties for and b
        savedOffset = imgB.offsetLeft;
        imgA.style.zIndex = "0";
        imgA.classList.remove("hidden");
        imgB.style.zIndex = "1";
        imgB.style.opacity = "1";
        imgB.style.right =  (imgB.width*2).toString() + "px";
        imgB.classList.remove("hidden");
    }
    if (step <= TRANSITION_TOTAL_STEPS){
        let offset = imgB.width - (step * (imgB.width / TRANSITION_TOTAL_STEPS))
        imgB.style.left = offset.toString() + "px"
        setTimeout(transition_wipeRight, 1000 / TRANSITION_STEPS_PER_SECOND, step+1, callback, savedOffset)
    } else {
        imgA.classList.add("hidden");
        imgB.style.left = savedOffset;
        callback()
    }
}

function transition_spinOut(step, callback){
    //console.log("transition_spinOut. Step", step,"Index A:",IDX_A,"Index B:",IDX_B)
    let imgA = LIVE_IMAGES[IDX_A], imgB = LIVE_IMAGES[IDX_B]
    if(step===0){
        // Set up initial CSS properties for and b
        imgA.style.zIndex = "0";
        imgA.classList.remove("hidden");
        imgB.style.zIndex = "1";
        imgB.style.opacity = "1";
        // imgB.style.transform = "rotate(360deg)";
        imgB.style.scale = "scale(0.0)";
        imgB.classList.remove("hidden");
    }
    if (step <= TRANSITION_TOTAL_STEPS){
        let rotation = 360 - (step * (360 / TRANSITION_TOTAL_STEPS))
        let scale = (step * (1.0 / TRANSITION_TOTAL_STEPS))
        //console.log("Rotation:", rotation);
        //console.log( "rotate(" + rotation.toString() + "deg)" );
        // imgB.style.transform = "rotate(" + rotation.toString() + "deg)";
        // imgB.style.transform = "scale(" + scale.toString() + ")";
        imgB.style.transform = "scale(" + scale.toString() + ") " + "rotate(" + rotation.toString() + "deg)";
        setTimeout(transition_spinOut, 1000 / TRANSITION_STEPS_PER_SECOND, step+1, callback)
    } else {
        imgA.classList.add("hidden");
        imgB.style.transform = "rotate(0deg)";
        imgB.style.transform = "scale(1)";
        callback()
    }
}


function carousel(transition){
    setTimeout(transition, CAROUSEL_PAUSE * 1000, 0, next)
}


function imageLoadHandler( event ){
    //console.log("Image load handler triggerd", event);
    this.classList.add("carousel_image");
    this.classList.add("hidden");
    LIVE_IMAGES.push( this ); // not sure we even really need this array, TODO

    let parent = document.getElementById("carousel");
    //parent.appendChild( this );

    if(LIVE_IMAGES.length === 1){
         //console.log("Only one image, display it.");
         this.classList.toggle("hidden");
    }
    if(LIVE_IMAGES.length > 1){
        //console.log("More than one image, start the carousel if not started already")
        if (!CAROUSEL_ACTIVE){
            CAROUSEL_ACTIVE = true;
            // carousel( randomTransition() )
        }
    }
    // //console.log(LIVE_IMAGES);
}

function handleImageList( requestResult ) {
    //console.log( "handleImageList got:", requestResult.target.response);
    const fileNames = requestResult.target.response.split("\n");
    fileNames.forEach( (value)=>{
        if( /(?=^(\S|\ )+$)[^?\=\b]+\.(jpg|jpeg|png|gif)$/i.test(value) ){
              //console.log("value:", value);
              let image = new Image();
              image.addEventListener("load", imageLoadHandler)
              image.addEventListener("error", e=>console.log("ERROR LOADING IMAGE:", e) )
              image.src = "/carousel/images/" + value;
          }
    });
}

function main(){
    console.log("Hi, carousel checking in.");
    
    const getImageList = (triesRemaining=3) => {
        const oReq = new XMLHttpRequest();
        oReq.addEventListener("load", handleImageList);
        oReq.addEventListener("error", ()=>{
            if (triesRemaining > 0) handleImageList(tries-1);
        });
        oReq.open("GET", "/carousel/images.txt");
        oReq.send();
    }
    getImageList();

    console.log("Okay main is done now.")
}

main();

// TODO
// Next steps - correct two main problems
// Refactor to uses divs & background-image instead of image tags
//   Still want to be ableto smoothly animate between two images so
//   Use two divs on top of each other, one with a higher z buffer
// Refactor to use CSS animations
// Add auto checkbox
// Add manual controls