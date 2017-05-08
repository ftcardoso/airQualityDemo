var map;

var markers_measures = {};

if (document.body.clientWidth <= 767) {
  var isCollapsed = false;
} else {
  var isCollapsed = false;
}

var measurand_parameters = ['Carbon Monoxide', 'Nitrogen Monoxide', 'Nitrogen Dioxide', 'Sulfur Dioxide', 'Particle Pollution', 'Relative Humidity', 'Temperature'];
var measurand_parameters_aux = ['CO', 'O3', 'NO2', 'SO2', 'PM10',  'RH', 'T'];
var measurand_parameters_unit = ['PPM', 'PPB', 'PPB', 'PPB', 'µ', '%', 'ºC'];

var grayIcon = L.icon({
    iconUrl: 'assets/img/gray.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var greenIcon = L.icon({
    iconUrl: 'assets/img/green.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var yellowIcon = L.icon({
    iconUrl: 'assets/img/yellow.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var orangeIcon = L.icon({
    iconUrl: 'assets/img/orange.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var redIcon = L.icon({
    iconUrl: 'assets/img/red.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var purpleIcon = L.icon({
    iconUrl: 'assets/img/purple.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

var brownIcon = L.icon({
    iconUrl: 'assets/img/brown.png',

    iconSize:     [25, 40], // size of the icon
    iconAnchor:   [15, 82], // point of the icon which will correspond to marker's location
    popupAnchor:  [-3, -76] // point from which the popup should open relative to the iconAnchor
});

CO_RANGE = [0, 4.5, 9.5, 12.5, 15.5, 30.5, 40.5, 50.5]
CO_AQI = [0, 50, 100, 150, 200, 300, 400, 500]
CO_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']
CO_MARKERS_COLORS = [greenIcon, yellowIcon, orangeIcon, redIcon, purpleIcon, brownIcon, brownIcon]
CO_AIR_LEVEL = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous', 'Hazardous']

NO2_RANGE = [0, 0.054, 0.101, 0.361, 0.65, 1.25, 1.65, 2.049]
NO2_AQI = [0, 50, 100, 150, 200, 300, 400, 500]
NO2_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']
NO2_MARKERS_COLORS = [greenIcon, yellowIcon, orangeIcon, redIcon, purpleIcon, brownIcon, brownIcon]
NO2_AIR_LEVEL = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous', 'Hazardous']

SO2_RANGE = [0, 36, 76, 186, 304]
SO2_AQI = [0, 50, 100, 150, 200]
SO2_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033']
SO2_MARKERS_COLORS = [greenIcon, yellowIcon, orangeIcon, redIcon]
SO2_AIR_LEVEL = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy']

O3_RANGE = [0, 0.125, 0.165, 0.205, 0.405, 0.505, 0.605]
O3_AQI = [0, 100, 150, 200, 300, 400, 500]
O3_COLORS = ['#aaaaaa', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']
O3_MARKERS_COLORS = [grayIcon, orangeIcon, redIcon, purpleIcon, brownIcon, brownIcon]
O3_AIR_LEVEL = ['Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous', 'Hazardous']

PM10_RANGE = [0, 55, 155, 255, 355, 425, 505, 605]
PM10_AQI = [0, 50, 100, 150, 200, 300, 400, 500]
PM10_COLORS = ['#009966', '#ffde33', '#ff9933', '#cc0033', '#660099', '#7e0023', '#7e0023']
PM10_MARKERS_COLORS = [greenIcon, yellowIcon, orangeIcon, redIcon, purpleIcon, brownIcon, brownIcon]
PM10_AIR_LEVEL = ['Good', 'Moderate', 'Unhealthy for Sensitive Groups', 'Unhealthy', 'Very Unhealthy', 'Hazardous', 'Hazardous']

MEANING = ['Air quality is considered satisfactory, and air pollution poses little or no risk.', 'Air quality is acceptable; however, for some pollutants there may be a moderate health concern for a very small number of people who are unusually sensitive to air pollution.',
'Members of sensitive groups may experience health effects. The general public is not likely to be affected.', 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious health effects.',
'Health alert: everyone may experience more serious health effects.', 'Health warnings of emergency conditions. The entire population is more likely to be affected.', 'Health warnings of emergency conditions. The entire population is more likely to be affected.']


POLLUTANTS = {	'CO': [CO_RANGE, CO_AQI, CO_COLORS, CO_MARKERS_COLORS, CO_AIR_LEVEL, MEANING],
				'O3': [O3_RANGE, O3_AQI, O3_COLORS, O3_MARKERS_COLORS, O3_AIR_LEVEL, MEANING], 
				'NO2': [NO2_RANGE, NO2_AQI, NO2_COLORS, NO2_MARKERS_COLORS, NO2_AIR_LEVEL, MEANING], 
				'SO2':[SO2_RANGE, SO2_AQI, SO2_COLORS, SO2_MARKERS_COLORS, SO2_AIR_LEVEL, MEANING],
				'PM10':[PM10_RANGE, PM10_AQI, PM10_COLORS, PM10_MARKERS_COLORS, PM10_AIR_LEVEL, MEANING]
}


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

var darkMatter = L.tileLayer('http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://ubiwhere.com">Ubiwhere</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});

var osmLayer = L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
	maxZoom: 19,
	attribution: '&copy; <a href="http://ubiwhere.com">Ubiwhere</a> &copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
});


var baseLayers = {
	'Day Mode': osmLayer,
	'Night Mode': darkMatter
}

/* Single marker cluster layer to hold all clusters */
var markerClusters = new L.MarkerClusterGroup({
	spiderfyOnMaxZoom: true,
	showCoverageOnHover: true,
	zoomToBoundsOnClick: true,
	disableClusteringAtZoom: 16,
	animateAddingMarkers: true,
	polygonOptions: {
		weight: 3,
		color: '#48B9C9',
	}
});

map = L.map("map", {
	zoom: 7,
	center: [19.429861, -99.134698],
	layers: [osmLayer, markerClusters],
	zoomControl: false,
	attributionControl: false
});

var layerControl = L.control.groupedLayers(baseLayers, {
  collapsed: isCollapsed
}).addTo(map);

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

// /* Larger screens get expanded layer control and visible sidebar */
// if (document.body.clientWidth <= 767) {
// 	var isCollapsed = true;
// } else {
// 	var isCollapsed = false;
// }

$(document).on("ready", function () {
	getInitialData();
	map.addLayer(markerClusters);
});

map.on('click', function (e) {
	var measures_div = document.getElementById('over_map');
	var air_concerns = document.getElementById('health');
	measures_div.style.display = 'none';
	air_concerns.style.display = 'none';

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
	var client = mqtt.connect("http://163.172.148.102:8000/resources/airquality");
	client.subscribe('airquality');
	client.on('message', function (topic, message) {

	var content = JSON.parse(message).data;

	parseData(content);

	});
};

function parseData(content) {
	for (var i = 0; i < content.length; ++i) {
		var marker_id = content[i].id;
			var high_AQI_value = 0;
			var high_AQI_name = '';
			var marker_color = '';

		var popup = '<b>' + marker_id + '</b></br>' +
			'<br/><b>Last Update:</b> ' + content[i].dateObserved +
			'<br/><b>Address:</b> ' + content[i].address.streetAddress + ', ' + content[i].address.addressLocality + ', ' + content[i].address.addressCountry +
			'<br/>'

		measures = content[i].measurand;
		var measures_values = []

		for (var measure = 0; measure < measures.length; measure++) {

			var measure_data = measures[measure].split(', ')
			measures_values.push(measure_data[1]);

			var get_AQI = getAQI(measure_data[1], POLLUTANTS[measure_data[0]][0], POLLUTANTS[measure_data[0]][1]);

			if (get_AQI >= high_AQI_value){
				high_AQI_value = get_AQI;
				high_AQI_name = measure_data[0];
			}

		}

		for (var j = 1; j < POLLUTANTS[high_AQI_name][0].length; j++){
			if (high_AQI_value >= POLLUTANTS[high_AQI_name][1][j-1] && high_AQI_value < POLLUTANTS[high_AQI_name][1][j]){
				marker_color = POLLUTANTS[high_AQI_name][3][j-1];
				air_quality = POLLUTANTS[high_AQI_name][4][j-1]
			}
		}


		popup += '<b>Air Quality Index: </b>' + air_quality;

		measures_values.push(content[i].relativeHumidity);
		measures_values.push(content[i].temperature);
		markers_measures[marker_id] = measures_values;

		var m = L.marker([content[i].location.coordinates[0], content[i].location.coordinates[1]], {icon: marker_color}).bindPopup(popup).on('click', onClickMarker);
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
	var measures_table = document.getElementById('measures-table');
	var air_level = document.getElementById('air_concerns');
	var air_health = document.getElementById('health');
	measures_div.style.display = 'block';

	// Delete previous parameter table
	while(measures_table.rows[0]) measures_table.deleteRow(0);

	// Delete parameter AQI table
	var aqi_tables = document.getElementsByClassName('aqi_table');	

	for (var j = 0; j < aqi_tables.length; j++) { 
		aqi_tables[j].style.display = 'none';
	}

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

		var pollutant = measurand_parameters_aux[i];
		
		// RH and T are not pollutants - don't have AQI index table (colors)
		if (pollutant != 'RH' && pollutant != 'T'){
			var pollutant_range = POLLUTANTS[pollutant][0];
			var pollutant_colors = POLLUTANTS[pollutant][2];
			var pollutant_air_level = POLLUTANTS[pollutant][5];

			for (var j = 1; j < pollutant_range.length; j++){
				if (markers_measures[this.id][i] >= pollutant_range[j-1] && markers_measures[this.id][i] < pollutant_range[j]){
					var pollutant_table = document.getElementById(pollutant + '_TD');
					pollutant_table.style.backgroundColor = pollutant_colors[j-1];
					air_health.style.backgroundColor = pollutant_colors[j-1];
					air_level.innerHTML = pollutant_air_level[j-1];
					air_health.style.display = 'block';
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

	// Append table first row 
	var row = measures_table.insertRow(0);
	row.className = "table_row_aqi"

	inner_cell_col1 = "Parameter";
	inner_cell_col2 = "Value";
	inner_cell_col3 = "AQI";

	var cell_col1 = row.insertCell(0);
	var cell_col2 = row.insertCell(1);
	var cell_col3 = row.insertCell(2);

	cell_col1.innerHTML = inner_cell_col1;
	cell_col2.innerHTML = inner_cell_col2;
	cell_col3.innerHTML = inner_cell_col3;

	cell_col1.className = "table_cell_name1";
	cell_col2.className = "table_cell_name2";
	cell_col3.className = "table_cell_name2";


	// Add event listenner to table to show AQI info
	var measures_table = document.getElementById('measures-table');
	var measures_table_row = measures_table.getElementsByTagName("tr");

	for (var i = 0; i < measures_table_row.length; i++) { 
		row = measures_table_row[i];
		row.addEventListener('click', function(ev){

			var aqi_tables = document.getElementsByClassName('aqi_table');	

			for (var j = 0; j < aqi_tables.length; j++) { 
				aqi_tables[j].style.display = 'none';
			}
			// RH and T are not pollutants, so they don't have AQI table colors
			if (ev.toElement.parentElement.id != 'RH_TD' && ev.toElement.parentElement.id != 'T_TD'){ 
				document.getElementById(ev.toElement.parentElement.id + '_AQI').style.display = 'block';
			}

		})
	}
	
}

function getAQI(value, pollutant_range, aqi_range){
	if (value == 0){
		console.log(0)
		return 0;
	}
    var bp_index

        for (var i = 1; i < pollutant_range.length; i ++){
                if (pollutant_range[i - 1] < value && value <= pollutant_range[i]){
                        bp_index = i;
                        break;
                }
        }

        if (value > pollutant_range[pollutant_range.length-1]){
                bp_index = pollutant_range.length
        }

    var i_hi = aqi_range[bp_index]
    var i_low = aqi_range[bp_index-1]

    var bp_hi = pollutant_range[bp_index]
    var bp_low = pollutant_range[bp_index-1]

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