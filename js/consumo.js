function getPanelConsumo(){
	var objMenu = new TMenu;
	var objCliente = new TCliente;
	
	$.get("vistas/consumo.html", function(resp){
		$(".navbar-title").html("Consumo de alimentos");
		$("#modulo").html(resp);
		$.get("vistas/menu/comida.html", function(pComida){
			objMenu.getComidas({
				before: function(){
					alertify.log("Estamos obteniendo los datos del servidor..."); 
				},
				after: function(resp){
					$.each(resp, function(i, el){
						var plt = pComida;
						plt = $(plt);
						$.each(el, function(key, value){
							plt.find("[campo=" + key + "]").html(value);
						})
						
						plt.find(".panel-title").find("a").attr("href", "#comida" + el.idComida);
						plt.find(".panel-collapse").attr("id", "comida" + el.idComida);
						
						$("#accordion").append(plt);
					});
				}
			});
			
			$("#modulo").find("[campo=caloriasDiarias]").html(objCliente.calorias);
		});
	});
}