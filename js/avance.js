function getPanelAvance(){
	$.get("vistas/avance.html", function(resp){
		$(".navbar-title").html("Avances");
		
		$("#modulo").html(resp);
		
		
		google.charts.load("current", {packages:["corechart"]});
		google.charts.setOnLoadCallback(drawChart);
		function drawChart() {
			var data = google.visualization.arrayToDataTable([
					["Dia", "Peso"],
					['2016-08-13', 86],
					['2016-08-14', 84],
					['2016-08-15', 80]
				]);
			
				var options = {
					title: '',
					legend: { position: 'none' },
					vAxis: {minValue: 0},
					areaOpacity: 0.2,
					colors: ['green']
				};
		
			var chart = new google.visualization.AreaChart(document.getElementById('chart_div'));
			chart.draw(data, options);
		}
	});
};