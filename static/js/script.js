var confirm = $('#confirm')
var active = $('#active')
var recov = $('#recov')
var deaths = $('#deaths')

var todays_cases = $('#todays_cases')
var todays_deaths = $('#todays_deaths')
var testsM = $('#testsM')
var tests = $('#tests')

$.get("http://localhost/stats", function(data, status){}).done(function(data, status){
	confirm.text(data.total.confirmed);
	active.text(data.total.active);
	recov.text(data.total.recovered);
	deaths.text(data.total.deaths);
});

$.get("http://localhost/todays", function(data, status){}).done(function(data, status){
	todays_cases.text(data.today_cases);
	todays_deaths.text(data.today_deaths);
	testsM.text(data.testsPerOneMillion);
	tests.text(data.tests);
});