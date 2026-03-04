
  maplibregl.accessToken = mapToken;

    const map = new maplibregl.Map({
        container: 'map', // container id
        style: 'https://maps.geoapify.com/v1/styles/osm-bright/style.json?apiKey=68a2d6f2e4504af3b43001bf0e98d9bd', // style URL
        center: listing.geometry.coordinates, // starting position [lng, lat]
        zoom: 10, // starting zoom
        maplibreLogo: true
    });
   
  const marker = new maplibregl.Marker({color: "red" })
  .setLngLat(listing.geometry.coordinates)
  .setPopup(new maplibregl.Popup ({offset: 25})
    .setHTML(`<h4>${listing.title}</h4><p>Exact Location will be provided after booking</p>`))
  .addTo(map);
