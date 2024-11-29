

////
if (Html5Qrcode.isSupported()) {
    initializeQrScanner();
} else {
    alert("Your browser does not support QR scanning.");
}
initializeQrScanner();
function initializeQrScanner() {
    const html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader",  // Element ID where the QR scanner will render
        { 
            fps: 10,  // Frames per second of the video stream
            qrbox: 250,  // Size of the scanning box
            facingMode: "environment"  // Use the rear camera for scanning
        }
    );

    html5QrcodeScanner.render(onScanSuccess, onScanFailure);
}

///
let map;
let marker;
let routePolyline;
let routePath = [
    { lat: -26.2041, lng: 28.0473 }, // Start point (Johannesburg, for example)
    { lat: -25.7479, lng: 28.2293 }  // End point (Pretoria, for example)
];
let currentRouteIndex = 0;

// Initialize Google Map
function initMap() {
    map = new google.maps.Map(document.getElementById('map'), {
        center: routePath[0], // Center at starting point
        zoom: 10,
        disableDefaultUI: true,
        styles: [{ featureType: "poi", stylers: [{ visibility: "off" }] }]
    });

    // Add a moving car marker
    marker = new google.maps.Marker({
        position: routePath[0],
        map: map,
        icon: {
            url: 'car.png', // Your custom car icon
            scaledSize: new google.maps.Size(40, 40)
        }
    });

    // Draw route on the map
    routePolyline = new google.maps.Polyline({
        path: routePath,
        geodesic: true,
        strokeColor: "#FF5733",
        strokeOpacity: 0.8,
        strokeWeight: 5,
        map: map
    });

    // Start moving the car
    moveCar();
}

// Function to move the car along the route
function moveCar() {
    if (currentRouteIndex >= routePath.length) {
        currentRouteIndex = 0; // Reset to start
    }
    
    marker.setPosition(routePath[currentRouteIndex]);
    currentRouteIndex++;
    
    // Move the car every 500ms (adjust for speed)
    setTimeout(moveCar, 500);
}

window.onload = initMap;

/////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", () => {
    console.log("Flower Store website loaded successfully!");
});


// Function to start the scanner
function startScanner() {
    Quagga.init({
        inputStream: {
            name: "Live",
            type: "LiveStream",
            target: document.querySelector('#scanner')
        },
        decoder: {
            readers: ["ean_reader", "code_128_reader"]
        }
    }, function(err) {
        if (err) {
            console.error(err);
            return;
        }
        Quagga.start();
        console.log("Scanner started");
    });

    // Listen for detected barcodes
    Quagga.onDetected(result => {
        const code = result.codeResult.code;
        console.log("Barcode detected:", code);
        playVideoForBarcode(code);
        Quagga.stop(); // Stop scanning after successful detection
    });
}

// Function to play the video associated with the scanned barcode
function playVideoForBarcode(barcode) {
    const videoContainer = document.getElementById('video-container');
    const videoElement = document.getElementById('promoVideo');

    if (videoMap[barcode]) {
        videoElement.src = videoMap[barcode];
        videoElement.play();
        videoContainer.style.display = 'block';
    } else {
        alert("No video found for this barcode.");
    }
}
///////
function onScanSuccess(decodedText, decodedResult) {
    console.log(`Code scanned: ${decodedText}`);
    
    if (decodedText === "https://qrco.de/bfYNKb") {
        const imageElement = document.getElementById('scanned-image');
        imageElement.style.display = 'block';
    } else {
        alert("This QR code is not recognized.");
    }
}

function onScanFailure(error) {
    console.warn(`Code scan error: ${error}`);
}

// Initialize the QR code scanner
const html5QrcodeScanner = new Html5QrcodeScanner(
    "reader", 
    { fps: 10, qrbox: 250 },
    false
);

html5QrcodeScanner.render(onScanSuccess, onScanFailure);

////
// Personalize greeting based on time of day
window.addEventListener('DOMContentLoaded', () => {
    const personalizedNote = document.getElementById('personalized-note');

    if (!personalizedNote) {
        console.error("Element with id 'personalized-note' not found.");
        return;
    }

    const hour = new Date().getHours();
    console.log("Current hour:", hour); // Debugging log

    let greetingMessage;
    if (hour < 12) {
        greetingMessage = "Good morning! Start your day with the perfect bouquet.";
    } else if (hour < 18) {
        greetingMessage = "Good afternoon! Let us brighten up your day.";
    } else {
        greetingMessage = "Good evening! End your day with a touch of floral beauty.";
    }

    console.log("Greeting Message:", greetingMessage); // Debugging log
    personalizedNote.textContent = greetingMessage;
});
