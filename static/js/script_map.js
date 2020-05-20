// var map = L.map('map', {'maxBounds': [[20.5937, 78.9629], [20.5937, 78.9629]],'maxBoundsViscosity': 0}).setView([20.5937, 78.9629], 5);
var statesData;
var map;
$.get("http://localhost/geojson", function(data, status){}).done(function(data, status){
	
	// $('#loading').toggleClass('d-none');
	$('#map').empty(); //delet the html content inside div

	statesData = data

	map = L.map('map').setView([23, 78.9629], 4);



	L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=pk.eyJ1IjoibWFwYm94IiwiYSI6ImNpejY4NXVycTA2emYycXBndHRqcmZ3N3gifQ.rJcFIG214AriISLbB6B5aw', {
		maxZoom: 18,
		// attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, ' +
		// 	'<a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, ' +
		// 	'Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
		id: 'mapbox/light-v9',
		tileSize: 512,
		zoomOffset: -1
	}).addTo(map);


	// control that shows state info on hover
	var info = L.control();

	info.onAdd = function (map) {
		this._div = L.DomUtil.create('div', 'info');
		this.update();
		return this._div;
	};

	info.update = function (props) {
		this._div.innerHTML = '<h4>Covid 19 Stats</h4>' +  (props ?
			'<b>' + props.st_nm + '</b>' +  
			'<br>'+ 
			'Confirmed: '+ props.confirmed +
			'<br>'+ 
			'Active: '+props.active +
			'<br>'+
			'Recovered: '+props.recovered +
			'<br>'+
			'Deaths: '+props.deaths
			: 'Hover over a state');
	};

	info.addTo(map);


	// get color depending on population density value
	function getColor(d) {
		return d > 10000 ? '#800026' :
				d > 5000  ? '#BD0026' :
				d > 2000  ? '#E31A1C' :
				d > 1000  ? '#FC4E2A' :
				d > 500   ? '#FD8D3C' :
				d > 200   ? '#FEB24C' :
				d > 100   ? '#FED976' :
							'#FFEDA0';
	}

	function style(feature) {
		return {
			weight: 2,
			opacity: 1,
			color: 'white',
			dashArray: '3',
			fillOpacity: 0.7,
			fillColor: getColor(feature.properties.confirmed)
		};
	}

	function highlightFeature(e) {
		var layer = e.target;

		layer.setStyle({
			weight: 5,
			color: '#666',
			dashArray: '',
			fillOpacity: 0.7
		});

		if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
			layer.bringToFront();
		}

		info.update(layer.feature.properties);
	}

	var geojson;

	function resetHighlight(e) {
		geojson.resetStyle(e.target);
		info.update();
	}

	function zoomToFeature(e) {
		map.fitBounds(e.target.getBounds());
	}

	function onEachFeature(feature, layer) {
		layer.on({
			mouseover: highlightFeature,
			mouseout: resetHighlight,
			click: zoomToFeature
		});
	}

	geojson = L.geoJson(statesData, {
		style: style,
		onEachFeature: onEachFeature
	}).addTo(map);

	// map.attributionControl.addAttribution('Population data &copy; <a href="http://census.gov/">US Census Bureau</a>');


	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {

		var div = L.DomUtil.create('div', 'info legend'),
			grades = [0, 10, 20, 50, 100, 200, 500, 1000],
			labels = [],
			from, to;

		for (var i = 0; i < grades.length; i++) {
			from = grades[i];
			to = grades[i + 1];

			labels.push(
				'<i style="background:' + getColor(from + 1) + '"></i> ' +
				from + (to ? '&ndash;' + to : '+'));
		}

		div.innerHTML = labels.join('<br>');
		return div;
	};

	legend.addTo(map);
});




