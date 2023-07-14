Also, change the geometry object from

geometry: {
                type: "Point",
                coordinates: [
                    cities[random1000].longitude,
                    cities[random1000].latitude,
                ]
            }
to

geometry: {
                type: "Point",
                coordinates: [
                    cities[randomInt].longitude,
                    cities[randomInt].latitude,
                ]
            }
After that open the clusterMap.js file, and replace

center: [-103.59179687498357, 40.66995747013945],
to

center: [80.0982, 23.0707],


<html>
<head>
<meta name="viewport" content="width=device-width, initial-scale=1">
<style>
#myDIV {
  width: 100%;
  padding: 50px 0;
  text-align: center;
  background-color: lightblue;
  margin-top: 20px;
}
#myDIV1 {
  width: 100%;
  padding: 50px 0;
  text-align: center;
  background-color: red;
  margin-top: 20px;
}
#myDIV2 {
  width: 100%;
  padding: 50px 0;
  text-align: center;
  background-color: blue;
  margin-top: 20px;
}
</style>
</head>
<body>

<p>Click the "Try it" button to toggle between hiding and showing the DIV element:</p>


 <div>
  <span id="car-icon">🚗</span>
  <span id="plane-icon">✈️</span>
  <span id="train-icon">🚆</span>
  <span id="distance">300KM</span>
</div> 
<script>
const carIcon = document.getElementById("car-icon");
const planeIcon = document.getElementById("plane-icon");
const trainIcon = document.getElementById("train-icon");
const distanceDisplay = document.getElementById("distance");

let currentMode = "car"; // Keep track of the current transportation mode

// Event listener for car icon
carIcon.addEventListener("click", () => {
  if (currentMode !== "car") {
    currentMode = "car";
    // Generate and set car distance (example: randomly generated distance)
    const carDistance = generateRandomDistance();
    distanceDisplay.textContent = `${carDistance}KM`;
  }
});

// Event listener for plane icon
planeIcon.addEventListener("click", () => {
  if (currentMode !== "plane") {
    currentMode = "plane";
    // Generate and set air distance (example: randomly generated distance)
    const airDistance = generateRandomDistance();
    distanceDisplay.textContent = `${airDistance}KM`;
  }
});

// Event listener for train icon
trainIcon.addEventListener("click", () => {
  if (currentMode !== "train") {
    currentMode = "train";
    // Generate and set train distance (example: randomly generated distance)
    const trainDistance = generateRandomDistance();
    distanceDisplay.textContent = `${trainDistance}KM`;
  }
});

// Function to generate random distance
function generateRandomDistance() {
  // Replace this with your own logic to generate the distance from the backend
  return Math.floor(Math.random() * 500) + 100; // Example: generates a random distance between 100 and 600 kilometers
}
</script>

</body>
</html>



        <% campground.images.forEach((img,i)=>{ %>
        <div  class="carousel-item <%= i==0?"active":"" %>">
          <img src="<%=img.url%>" class="d-block w-100 showpageImg" alt="" crossorigin="anonymous"data-bs-toggle="modal" data-bs-target="#exampleModal"data-bs-slide-to="1">


          <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog">
              <div class="modal-content">
                <div class="modal-header">
                  <h1 class="modal-title fs-5" id="exampleModalLabel">Modal title</h1>
                  <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                </div>
                <div class="modal-body">
                  <img src="<%=img.url%>" alt="" crossorigin="anonymous">
                </div>
                <div class="modal-footer">
                  <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                  <button type="button" class="btn btn-primary">Save changes</button>
                </div>
              </div>
            </div>
          </div>