var map = L.map('main_map', {
    center: [-34.59365, -58.450012],
    zoom: 13
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map)

L.marker([-34.59865, -58.457652]).addTo(map);
L.marker([-34.59952, -58.455822]).addTo(map);
L.marker([-34.59634, -58.452192]).addTo(map);