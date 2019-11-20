function downloadImage(img, callback){
    console.log("Downloading image file:", img);
    callback(img);
}

function main(){
    console.log("Hi, carousel checking in.");
    const live_images = [];
    images.forEach(val){
        downloadImage(val, (name)=>{ live_images.push(name) });
    }
    runCarousel();
    
}

main();


// Initial Strategy

// Startup
//   On page load we show a placeholder and call the loader
//   The loader uses XHRequest to grabs the text file from our site that lists all the images /carousel/images.txt
//   The callback from that function goes through the list and downloads the images
//   The callback from those image downloads
//     inserts the image in the DOM with the class "carousel_image"
//       carousel_image is invisible and cropped square
//     adds references to that image node to the end of the "images" array
//     the images array needs to be in our global scope
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
      
      