
'use strict';

/*----------------------------------------
	Document Ready 
----------------------------------------*/
$(document).ready(function () {

	initComponents();
	setNavbarActiveItem();

	loadPartials();

});

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


