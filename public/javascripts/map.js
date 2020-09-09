var map = L.map('main_map', {
    center: [-34.59365, -58.450012],
    zoom: 13
});

L.tileLayer('http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
	attribution: '&copy; <a href="http://openstreetmap.org">OpenStreetMap</a> contributors',
}).addTo(map)

$.ajax({
    dataType: "json",
    url: "api/bicicletas",
    success: function(result){
        console.log(result);
        result.bicicletas.forEach((bici) => {
            L.marker(bici.ubicacion, {title: bici.id}).addTo(map);
            
        });
    }
});

