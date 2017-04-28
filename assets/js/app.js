var map;

var markers_measures = {};

var measurand_parameters = ['Carbon Monoxide', 'Nitrogen Monoxide', 'Nitrogen Dioxide', 'Sulfur Dioxide', 'Particle Pollution', 'Relative Humidity', 'Temperature'];
var measurand_parameters_aux = ['CO', 'O3', 'NO2', 'SO2', 'PM10',  'RH', 'T'];
var measurand_parameters_unit = ['PPM', 'PPB', 'PPB', 'PPB', 'µ', '%', 'ºC'];

CO_RANGE = [0, 4.5, 9.5, 12.5, 15.5, 30.5, 40.5, 50.5]
CO_AQI = [0, 50, 100, 150, 200, 300, 400, 500]
CO_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']

NO2_RANGE = [0, 0.054, 0.101, 0.361, 0.65, 1.25, 1.65, 2.049]
NO2_AQI = [0, 50, 100, 150, 200, 300, 400, 500]
NO2_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']

SO2_RANGE = [0, 36, 76, 186, 304]
SO2_AQI = [0, 50, 100, 150, 200]
SO2_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033']

O3_RANGE = [0, 0.125, 0.165, 0.205, 0.405, 0.505, 0.605]
O3_AQI = [0, 100, 150, 200, 300, 400, 500]
O3_COLORS = ['#aaaaaa', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']

PM10_RANGE = [0, 55, 155, 255, 355, 425, 505, 605]
PM10_AQI = [0, 50, 100, 150, 200, 300, 400, 500]
PM10_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']


POLLUTANTS = {	'CO': [CO_RANGE, CO_AQI, CO_COLORS],
				'O3': [O3_RANGE, O3_AQI, O3_COLORS], 
				'NO2': [NO2_RANGE, NO2_AQI, NO2_COLORS], 
				'SO2':[SO2_RANGE, SO2_AQI, SO2_COLORS],
				'PM10':[PM10_RANGE, PM10_AQI, PM10_COLORS]
}

var greenIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/ftcardoso/leaflet-color-markers/master/img/marker-icon-2x-green.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var yellowIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/ftcardoso/leaflet-color-markers/master/img/marker-icon-2x-yellow.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var orangeIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/ftcardoso/leaflet-color-markers/master/img/marker-icon-2x-orange.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/ftcardoso/leaflet-color-markers/master/img/marker-icon-2x-red.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var violetIcon = L.icon({
    iconUrl: 'https://raw.githubusercontent.com/ftcardoso/leaflet-color-markers/master/img/marker-icon-2x-violet.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});


$(window).resize(function () {
	sizeLayerControl();
});

function sizeLayerControl() {
	$(".leaflet-control-layers").css("max-height", $("#map").height() - 50);
}
/* Basemap Layers */
var cartoLight = L.tileLayer('http://{s}.tile.openstreetmap.de/tiles/osmde/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://ubiwhere.com">Ubiwhere</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://ubiwhere.com">Ubiwhere</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});


/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true,
	disableClusteringAtZoom: 16,
	animateAddingMarkers: true,
	polygonOptions: {
		weight: 3,
		color: '#ff',
	}
});

map = L.map("map", {
	zoom: 7,
	center: [19.429861, -99.134698],
	layers: [osmLayer, markerClusters, ],
	zoomControl: false,
	attributionControl: false
});

var attributionControl = L.control({
	position: "bottomright"
});

attributionControl.onAdd = function (map) {
	var div = L.DomUtil.create("div", "leaflet-control-attribution");
	// div.innerHTML = "<span class='hidden-xs'>Developed by <a href='http://bryanmcbride.com'>bryanmcbride.com</a> | </span><a href='#' onclick='$(\"#attributionModal\").modal(\"show\"); return false;'>Attribution</a>";
	return div;
};

// map.addControl(attributionControl);
var zoomControl = L.control.zoom({
	position: "bottomright"
}).addTo(map);

/* GPS enabled geolocation control set to follow the user's location */
var locateControl = L.control.locate({
	position: "bottomright",
	drawCircle: true,
	follow: true,
	setView: true,
	keepCurrentZoomLevel: true,
	markerStyle: {
		weight: 1,
		opacity: 0.8,
		fillOpacity: 0.8
	},
	circleStyle: {
		weight: 1,
		clickable: false
	},
	icon: "fa fa-location-arrow",
	metric: false,
	strings: {
		title: "My location",
		popup: "You are within {distance} {unit} from this point",
		outsideMapBoundsMsg: "You seem located outside the boundaries of the map"
	},
	locateOptions: {
		maxZoom: 18,
		watch: true,
		enableHighAccuracy: true,
		maximumAge: 10000,
		timeout: 10000
	}
}).addTo(map);
/* Larger screens get expanded layer control and visible sidebar */
if (document.body.clientWidth <= 767) {
	var isCollapsed = true;
} else {
	var isCollapsed = false;
}
$(document).on("ready", function () {
	getInitialData();
	map.addLayer(markerClusters);
});

map.on('click', function (e) {
	var measures_div = document.getElementById('over_map');
	measures_div.style.display = 'none';

	var aqi_tables = document.getElementsByClassName('aqi_table');	

	for (var j = 0; j < aqi_tables.length; j++) { 
		aqi_tables[j].style.display = 'none';
	}
});


function getInitialData() {
	var url = "http://waste.urbiotica.citibrain.com:8002/"
	//var url = "http://fiware-porto.citibrain.com/v2/entities/?options=keyValues&entity=AirQualityObserved&limit=1000&key="
	$.ajax({
		url: url,
		type: "GET",
		dataType: "json",
		cache: false,
		success: function (data) {
			parseData(data);
		},
		error: function (error) {
			alert("Impossible to get Initial data");
		}
	})

	getSubscription();
}

function getSubscription(){
	var client = mqtt.connect("http://163.172.148.102:8000/resources/airquality")
	client.subscribe('airquality')
	client.on('message', function (topic, message) {

	var content = JSON.parse(message).data;

	parseData(content);

	});
}

function parseData(content) {
	for (var i = 0; i < content.length; ++i) {
		console.log(content[i]);
		var marker_id = content[i].id;

		var popup = marker_id + '</br>' +
			'<br/><b>Type:</b> ' + content[i].type +
			'<br/><b>Last Update:</b> ' + content[i].dateObserved +
			'<br/><b>Address:</b> ' + content[i].address.streetAddress + ', ' + content[i].address.addressLocality + ', ' + content[i].address.addressCountry +
			'<br/>'

		measures = content[i].measurand;
		var measures_values = []

		for (var measure = 0; measure < measures.length; measure++) {

			var measure_data = measures[measure].split(', ')
			measures_values.push(measure_data[1]);

		}
		measures_values.push(content[i].relativeHumidity);
		measures_values.push(content[i].temperature);
		markers_measures[marker_id] = measures_values;

		
		var m = L.marker([content[i].location.coordinates[0], content[i].location.coordinates[1]], {icon: greenIcon}).bindPopup(popup).on('click', onClickMarker);
		m.id = content[i].id;


		var layers = markerClusters.getLayers();

		for (var j = 0; j < layers.length; j++) {
			if (layers[j].id == marker_id) {
				var layer_id = layers[j]._leaflet_id
				markerClusters.removeLayer(markerClusters.getLayer(layer_id));
			}
		}
		markerClusters.addLayer(m);
	}
}

function onClickMarker(e) {
	var measures_div = document.getElementById('over_map');
	var measures_table = document.getElementById("measures-table");
	measures_div.style.display = 'block';

	while(measures_table.rows[0]) measures_table.deleteRow(0);

	for (i = 0; i < markers_measures[this.id].length; i++){
		var row = measures_table.insertRow(0);
		row.id = measurand_parameters_aux[i] + '_TD';
		row.className = "table_row_aqi"

		inner_cell0 = measurand_parameters[i] + ' (' + measurand_parameters_aux[i] + ')' + ': &nbsp;&nbsp;&nbsp;&nbsp;'
		inner_cell1 = markers_measures[this.id][i] + ' ' + measurand_parameters_unit[i];

		var cell0 = row.insertCell(0);
		var cell1 = row.insertCell(1);


		cell0.innerHTML = inner_cell0;
		cell1.innerHTML = inner_cell1;

		cell0.className = "table_cell_aqi0"
		cell1.className = "table_cell_aqi1"


		if(measurand_parameters_aux[i] == 'PM10'){
			for (var j = 1; j < PM10_RANGE.length; j++){
				if (markers_measures[this.id][i] >= PM10_RANGE[j-1] && markers_measures[this.id][i] < PM10_RANGE[j]){
					var pm10 = document.getElementById("PM10_TD");
					pm10.style.backgroundColor = PM10_COLORS[j-1];
				}
			}
		}

		if(measurand_parameters_aux[i] == 'CO'){
			for (var j = 1; j < CO_RANGE.length; j++){
				if (markers_measures[this.id][i] >= CO_RANGE[j-1] && markers_measures[this.id][i] < CO_RANGE[j]){
					var co = document.getElementById("CO_TD");
					co.style.backgroundColor = CO_COLORS[j-1];
				}
			}
		}

		if(measurand_parameters_aux[i] == 'O3'){
			for (var j = 1; j < O3_RANGE.length; j++){
				if (markers_measures[this.id][i] >= O3_RANGE[j-1] && markers_measures[this.id][i] < O3_RANGE[j]){
					var o3 = document.getElementById("O3_TD");
					o3.style.backgroundColor = O3_COLORS[j-1];
				}
			}
		}

		if(measurand_parameters_aux[i] == 'SO2'){
			for (var j = 1; j < SO2_RANGE.length; j++){
				if (markers_measures[this.id][i] >= SO2_RANGE[j-1] && markers_measures[this.id][i] < SO2_RANGE[j]){
					var so2 = document.getElementById("SO2_TD");
					so2.style.backgroundColor = SO2_COLORS[j-1];
				}
			}
		}

		if(measurand_parameters_aux[i] == 'NO2'){
			for (var j = 1; j < NO2_RANGE.length; j++){
				if (markers_measures[this.id][i] >= NO2_RANGE[j-1] && markers_measures[this.id][i] < NO2_RANGE[j]){
					var no2 = document.getElementById("NO2_TD");
					no2.style.backgroundColor = NO2_COLORS[j-1];
				}
			}
		}
		var pollutant_name = measurand_parameters_aux[i]

		if (pollutant_name != 'T' && pollutant_name != 'RH'){
			inner_cell2 = getAQI(markers_measures[this.id][i], POLLUTANTS[pollutant_name][0], POLLUTANTS[pollutant_name][1]);
		}else{
			inner_cell2 = '-'
		}

		var cell2 = row.insertCell(2);
		cell2.innerHTML = inner_cell2;
		cell2.className = "table_cell_aqi2"
	}

	var measures_table = document.getElementById('measures-table');
	var measures_table_row = measures_table.getElementsByTagName("tr");

	for (var i = 0; i < measures_table_row.length; i++) { 
		row = measures_table_row[i];
		row.addEventListener('click', function(ev){

			var aqi_tables = document.getElementsByClassName('aqi_table');	

			for (var j = 0; j < aqi_tables.length; j++) { 
				aqi_tables[j].style.display = 'none';
			}
			//document.getElementById('over_map_2').style.display = 'block';
			document.getElementById(ev.toElement.parentElement.id + '_AQI').style.display = 'block';
		})
	}
	
}

function getAQI(value, pollutant_range, aqi_range){
    var bp_index

	for (var i = 1; i < pollutant_range.length; i ++){
		if (pollutant_range[i - 1] < value <= pollutant_range[i]){
			bp_index = i;
			break;
		}
	}

	if (value > pollutant_range[pollutant_range.length-1]){
		bp_index = pollutant_range.length
	}

    i_hi = aqi_range[bp_index]
    i_low = aqi_range[bp_index-1]

    bp_hi = pollutant_range[bp_index]
    bp_low = pollutant_range[bp_index-1]


    index = ((i_hi - i_low) / (bp_hi - bp_low)) * (value - bp_low) + i_low
    return Math.round(index);
}
// Leaflet patch to make layer control scrollable on touch browsers
// var container = $(".leaflet-control-layers")[0];
// if (!L.Browser.touch) {
//   L.DomEvent
//   .disableClickPropagation(container)
//   .disableScrollPropagation(container);
// } else {
//   L.DomEvent.disableClickPropagation(container);
// }