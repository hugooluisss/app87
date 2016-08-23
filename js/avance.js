function getPanelAvance(){
	$.get("vistas/avance.html", function(resp){
		$(".navbar-title").html("Avances");
		
		$("#modulo").html(resp);
		
		var objCliente = new TCliente;
		objCliente.getHistorialPeso({
			before: function(){
				alertify.log("Estamos obteniendo tus registros desde el servidor... espera");
			},
			after: function(data){
				if (data.length > 0 ){
					google.charts.load("current", {packages:["corechart"]});
					google.charts.setOnLoadCallback(function(){
						var datos = [];
						datos.push(["fecha", "peso"]);
						anterior = -1;
						actual = -1;
						$.each(data, function(i, el){
							datos.push([el.fecha, parseFloat(el.peso)]);
							anterior = actual;
							actual = el.peso;
						});
						
						if (anterior > actual)
							$("#mensaje").html("¡¡¡ Muchas felicidades !!! lograste bajar " + (anterior - actual) + " kilos");
						else if(anterior == actual)
							$("#mensaje").html("¡¡¡ Vas por muy buen camino !!! estás conservando tu peso");
						else
							$("#mensaje").html("¡¡¡ Aumentaste tu peso, actualmente pesas " + actual + " kilos");
						
						var puntos = google.visualization.arrayToDataTable(datos);
						
						var options = {
							title: '',
							legend: { position: 'none' },
							vAxis: {minValue: 40},
							hAxis:{
								slantedText: true,
								slantedTextAngle: 90,
							},
							areaOpacity: 0.2,
							colors: ['green'],
							is3D: true
						};
						var chart = new google.visualization.SteppedAreaChart($('#chart_div')[0]);
						
						chart.draw(puntos, options);
					});
				}
			}
		});
	});
};