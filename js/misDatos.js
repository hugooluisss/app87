function getPanelMisDatos(){
	$.get("vistas/misDatos.html", function(resp){
		$("#modulo").html(resp);
	});
};