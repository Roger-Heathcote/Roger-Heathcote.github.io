const live_images = [];

function imageLoadHandler( event ){
    console.log("Image load handler triggerd", event);
    this.classList.add("carousel_image");
    this.classList.add("hidden");
    live_images.push( this ); // not sure we even really need this array, TODO

    let parent = document.getElementById("carousel");
    parent.appendChild( this );

    if(live_images.length === 1){
         console.log("Only one image, display it.");
         this.classList.toggle("hidden");
    }
    if(live_images.length > 1){ console.log("More than one image, start the carousel if not started already")}
    console.log(live_images);
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


//     checks for global var CAROUSEL_STARTED - if that is false AND the length of the "images" array > 1
//       start the carousel by calling the transition function with indexes 0 and 1 and the continue function
// Carousel started  
//   At any given time there is a current and a next image index
//   So... upon loading OR upon the automatic box becoming ticked...
//     a transition function that takes the image indexes and a continue callback is called
//       Firstly the function checks the state of the automate button and if it is unticked it returns
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