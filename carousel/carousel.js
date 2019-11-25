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
    // transition_wipeDown,
    transition_wipeLeft,
    // transition_wipeRight,
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
    //console.log( "carousel function running" )
    // Check checkbox here, only progress if checked
    setTimeout(transition, CAROUSEL_PAUSE * 1000, 0, next)
    // transition(0, next)?
}


function imageLoadHandler( event ){
    //console.log("Image load handler triggerd", event);
    this.classList.add("carousel_image");
    this.classList.add("hidden");
    LIVE_IMAGES.push( this ); // not sure we even really need this array, TODO

    let parent = document.getElementById("carousel");
    parent.appendChild( this );

    if(LIVE_IMAGES.length === 1){
         //console.log("Only one image, display it.");
         this.classList.toggle("hidden");
    }
    if(LIVE_IMAGES.length > 1){
        //console.log("More than one image, start the carousel if not started already")
        if (!CAROUSEL_ACTIVE){
            CAROUSEL_ACTIVE = true;
            carousel( randomTransition() )
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


// Initial Strategy

// Startup
//   On page load we show a placeholder and call the loader
// So we hardcode that into index.html and set it to invisible when the carousel starts
// done

//   The loader uses XHRequest to grabs the text file from our site that lists all the images /carousel/images.txt
// done

//   The callback from that function goes through the list and downloads the images
// done 

//   The callback from those image downloads
//     inserts the image in the DOM with the class "carousel_image"
//   and the class hidden
// done

//       carousel_image is invisible and cropped square
//     adds references to that image node to the end of the "images" array
//     the images array needs to be in our global scope
// done


//     checks for global var const  - if that is false AND the length of the "images" array > 1 = 3    // 3 Seconds
//       start the carousel bconst y calling the transition function with indexes 0 and 1 and the continue fS_PER_SECOND = 10  const ction_LENGTH
//       start the carousel bconst y calling the transition function with indexes 0 and 1 and the continue funconst const cti = TRANSITION_TOTAL_STEPSon_LENGTH




// Carousel
//   At any given time there is a current and a next image index
//   So... upon loading OR upon the automatic box becoming ticked...
//     a transition function that takes the image indexes and a continue callback is called
// done

//       Firstly the function checks the state of the automate button and if it is unticked it returns
// Not yet, but placeholder put in place

//       Assuming that doesn't happen...          
//       That function animates between the two images and
// done

//       when it is done itcalls the callback which
//         resets any css properties it had changed on the "previous" image and hides it
//           e.g. opacity, z-buffer depth etc

//         resets any css properties it had changed on the "next" image and hides it
// not a good idea

//         sets "current" to "next"
//         chooses a new "next", wrapping round as neccesary
//         sets a setTimout to call itself again
// done

// Add auto checkbox
// Add manual controls