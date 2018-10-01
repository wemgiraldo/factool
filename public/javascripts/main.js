
'use strict';

/*----------------------------------------
	Document Ready 
----------------------------------------*/
$(document).ready(function () {

	initComponents();
	setNavbarActiveItem();
	initDatatables(function (settings, json) {

	});

	loadPartials();
});

function initDatatables(callback) {
	$('table.dt').DataTable({
		"columnDefs": [
			{ "targets": "data-tables-no-sort", "orderable": false },
			{ "targets": "data-tables-sort-dom-text", "orderDataType": "dom-text", "type": "string" },
			{ "targets": "data-tables-sort-dom-num", "orderDataType": "dom-text", "type": "numeric" },
			{ "targets": "data-tables-sort-dom-date", "orderDataType": "dom-text", "type": "date" },
			{ "targets": "data-tables-sort-dom-select", "orderDataType": "dom-select" },
		],
		buttons: [{ extend: 'excelHtml5', text: '<i class="fa fa-file-excel"></i> Export' }],
		"destroy": true,
		"dom": "<'row table-toolbar'<'col-sm mr-auto content-title'><'col-sm ml-auto justify-content-end'fB>><'row'<'col-sm't>><'row'<'col-sm mr-auto'i><'col-sm ml-auto'p>>",
		"iDisplayLength": 10,
		"ordering": true,
		"order": [],
		"orderCellsTop": false,
		"fixedHeader": {
			header: true,
			footer: true
		},
		"paging": true,
		"select": {
			style: 'os'
		},
		"retrieve": true,
		"language": {
			"search": "",
			"emptyTable": "Nothing worth to be shown"
		},
		"initComplete": function (settings, json) {

			var api = this.api();
			var title = $(api.table().node()).data("title");
			$("div.content-title").text(title);
			$(".dataTables_filter input[type='search']").attr("placeholder", "Search");

			return callback && callback(settings, json);
		},
		"footerCallback": function (row, data, start, end, display) {

		}
	});
}

function initComponents(options) {
	$('[data-toggle="tooltip"]').tooltip();
}

function setNavbarActiveItem() {

	$('header li.nav-item.active').removeClass('active');
	$('.subheader li.nav-item.active').removeClass('active');

	var mainMenuItem = location.pathname.split("/")[1];
	var subMenuItem = location.pathname.split("/")[2];

	$('header a[href="/' + mainMenuItem + '"]').closest('li.nav-item').addClass('active');
	$('.subheader a[href^="/' + mainMenuItem + '/' + subMenuItem + '"]').closest('li.nav-item').addClass('active');
}

var map;

function initMap() {


	var mapContainer = $("#map");

	if (!mapContainer) {
		return false;
	}

	var data = mapContainer.data("config");

	if (data && !("center" in data) && (data.markers && data.markers.length > 0)) {
		data.center = { lat: data.markers[0].lat, lng: data.markers[0].lng };
	}

	var config = Object.assign({ center: { lat: 45.4462107, lng: 9.1632852 }, zoom: 9 }, data);

	map = new google.maps.Map(document.getElementById('map'), config);

	if (data.markers && data.markers.length > 0) {
		for (var i = 0; i < data.markers.length; i++) {
			var latLng = new google.maps.LatLng(data.markers[i].lat, data.markers[i].lng);
			var marker = new google.maps.Marker({
				position: latLng,
				label: data.markers[i].lbl,
				map: map
			});
		}
	}

	var input = document.getElementById('pac-input');
	var autocomplete = new google.maps.places.Autocomplete(input);

	// Bind the map's bounds (viewport) property to the autocomplete object,
	// so that the autocomplete requests use the current map bounds for the
	// bounds option in the request.
	autocomplete.bindTo('bounds', map);

	// Set the data fields to return when the user selects a place.
	autocomplete.setFields(
		['address_components', 'geometry', 'icon', 'name']);

	var marker = new google.maps.Marker({
		map: map,
		anchorPoint: new google.maps.Point(0, -29)
	});

	autocomplete.addListener('place_changed', function () {
		marker.setVisible(false);

		var place = autocomplete.getPlace();
		if (!place.geometry) {
			// User entered the name of a Place that was not suggested and
			// pressed the Enter key, or the Place Details request failed.
			window.alert("No details available for input: '" + place.name + "'");
			return;
		}

		// check if the street number is set
		if (place.address_components[0].types[0] !== "street_number") {
			window.alert("No street number indicated");
			return;
		}

		// If the place has a geometry, then present it on a map.
		if (place.geometry.viewport) {
			map.fitBounds(place.geometry.viewport);
		} else {
			map.setCenter(place.geometry.location);
			map.setZoom(17);  // Why 17? Because it looks good.
		}
		marker.setPosition(place.geometry.location);
		marker.setVisible(true);

		document.getElementById('lat').value = place.geometry.location.lat().toFixed(8);
		document.getElementById('lng').value = place.geometry.location.lng().toFixed(8);

		var numCivico;
		for (var address in place.address_components) {
			switch (place.address_components[address].types[0]) {
				case "street_number":
					numCivico = place.address_components[address].long_name;
					break;
				case "route":
					document.getElementById('address').value = place.address_components[address].long_name + ", " + numCivico;
					break;
				case "administrative_area_level_3":
					document.getElementById('city').value = place.address_components[address].long_name;
					break;
				case "administrative_area_level_2":
					document.getElementById('province').value = place.address_components[address].short_name;
					break;
				case "administrative_area_level_1":
					document.getElementById('region').value = place.address_components[address].long_name;
					break;
			}
		}

	});
}

function loadPartials() {

	var partials = $(".load-partial");

	partials.each(function () {

		loadPartial($(this));

	});

}

function loadPartial(container) {

	if (container.data("url")) {

		var data = container.data("data");


		if (container.html().length === 0) {
			container.html("<div class='text-center mt-5 content-title'>Loading..</div>");
		}

		container.load(container.data("url"), data, function (response, status, xhr) {
			if (status == "error") {

				var errorMsg = $("body>main>div.alert");

				if (errorMsg.length === 0) {
					errorMsg = $("<div class='alert alert-danger text-center'></div>").prependTo($("body>main"));
				}

				errorMsg.text("Error loading data: ");

				return;
			}
		});

		var reload = container.data("reload");

		if (typeof reload !== "undefined") {
			setTimeout(function () {
				loadPartial(container)
			}, reload);
		}
	}
}


