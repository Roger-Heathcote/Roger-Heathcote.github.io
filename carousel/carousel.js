const LIVE_IMAGES = [];
let CAROUSEL_ACTIVE = false;
const TRANSITION_LENGTH = 3    // 3 Seconds
const TRANSITION_STEPS_PER_SECOND = 10 
const CAROUSEL_PAUSE = 3
let IDX_A = 0
let IDX_B = 1


function next(a,b){
    console.log("In next function, choosing new images")
    IDX_A++; if (IDX_A >= LIVE_IMAGES.length) IDX_A = 0;
    IDX_B++; if (IDX_B >= LIVE_IMAGES.length) IDX_B = 0;
    transition = transition_dissolve // This is where we will randomly pick the next transition
    console.log("Calling carousel in", CAROUSEL_PAUSE * 1000,"ms")
    setTimeout(carousel, CAROUSEL_PAUSE * 1000, transition)
}

function transition_dissolve(step, callback){
    console.log("transition_dissolve. Step", step,"Index A:",IDX_A,"Index B:",IDX_B)

    if(step===0){
        // Set up the CSS properties for and b
    }
    
    // Change the state oftherelevant properties in proportion to where we are

    if (step <= TRANSITION_LENGTH * TRANSITION_STEPS_PER_SECOND){
        setTimeout(transition_dissolve, 1000 / TRANSITION_STEPS_PER_SECOND, step+1, callback)
    } else {
        // Reset the CSS properties for a and b
        callback()
    }
}

function carousel(transition){
    console.log( "carousel function running" )
    // Check checkbox here, only progress if checked
    transition(0, next)
}


function imageLoadHandler( event ){
    console.log("Image load handler triggerd", event);
    this.classList.add("carousel_image");
    this.classList.add("hidden");
    LIVE_IMAGES.push( this ); // not sure we even really need this array, TODO

    let parent = document.getElementById("carousel");
    parent.appendChild( this );

    if(LIVE_IMAGES.length === 1){
         console.log("Only one image, display it.");
         this.classList.toggle("hidden");
    }
    if(LIVE_IMAGES.length > 1){
        console.log("More than one image, start the carousel if not started already")
        if (!CAROUSEL_ACTIVE){
            CAROUSEL_ACTIVE = true;
            carousel(transition_dissolve)
        }
    }
    // console.log(LIVE_IMAGES);
}

function handleImageList( requestResult ) {
    console.log( "handleImageList got:", requestResult.target.response);
    const fileNames = requestResult.target.response.split("\n");
    fileNames.forEach( (value)=>{
        if( /(?=^(\S|\ )+$)[^?\=\b]+\.(jpg|jpeg|png|gif)$/i.test(value) ){
              console.log("value:", value);
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
//       start the carousel bconst y calling the transition function with indexes 0 and 1 and the continue funconst const cti = TRANSITION_LENGTH * TRANSITION_STEPS_PER_SECONDon_LENGTH




// Carousel
//   At any given time there is a current and a next image index
//   So... upon loading OR upon the automatic box becoming ticked...
//     a transition function that takes the image indexes and a continue callback is called
// done

//       Firstly the function checks the state of the automate button and if it is unticked it returns
// Not yet, but placeholder put in place

//       Assuming that doesn't happen...          
//       That function animates between the two images and
//       when it is done itcalls the callback which
//         resets any css properties it had changed on the "current" image and hides it
//           e.g. opacity, z-buffer depth etc
//         resets any css properties it had changed on the "next" image and hides it
//         sets "current" to "next"
//         chooses a new "next", wrapping round as neccesary
//         sets a setTimout to call itself again
      
// Add auto checkbox
// Add manual controls