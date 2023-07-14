

mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map', // container ID
    projection: 'globe',
    style: 'mapbox://styles/mapbox/navigation-night-v1', // style URL
    center: houseLocation.geometry.coordinates, // starting position [lng, lat]
    zoom: 9, // starting zoom
});
const marker = new mapboxgl.Marker({ color: 'black', rotation: 45 })
    .setLngLat(houseLocation.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, closeOnClick: true })
        .setHTML(
          `<h6>${houseLocation.title}</h6><span><p style=margin:0 0.2 0rem>${(Math.random()*9).toFixed(1)} &#9733 <span style=color:grey;font-weight:700>${reviewLength} Reviews</span></p>`
        )
      )
    .addTo(map);
map.addControl(new mapboxgl.NavigationControl());


