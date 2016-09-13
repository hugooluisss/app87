function getPanelConsumo(){
	var objMenu = new TMenu;
	var objCliente = new TCliente;
	var pComida = "";
	
	var totalCarbohidratos = 0;
	var totalProteinas = 0;
	var totalGrasas = 0;
	var totalGramos = 0;
	
	$.get("vistas/menu/comida.html", function(resultado){
		pComida = resultado;
	});
	
	$.get("vistas/consumo.html", function(resp){
		$(".navbar-title").html("Consumo de alimentos");
		$("#modulo").html(resp);
		
		var objActividad = new TActividad(objCliente.idActividad);
		objActividad.getData({
			after: function(){
				var tabla = $("table#general");
				
				totalCarbohidratos = parseFloat(objCliente.calorias * objActividad.carbohidratos / 100 / 4).toFixed(2);
				totalProteinas = parseFloat(objCliente.calorias * objActividad.proteinas / 100 / 4).toFixed(2);
				totalGrasas = parseFloat(objCliente.calorias * objActividad.grasas / 100 / 9).toFixed(2);
				totalGramos = totalCarbohidratos + totalGrasas + totalProteinas;
				
				
				tabla.find("[campo=carbohidratos]").text(totalCarbohidratos);
				tabla.find("[campo=proteinas]").text(totalProteinas);
				tabla.find("[campo=grasas]").text(totalGrasas);
				
				objMenu.getComidas({
					before: function(){
						alertify.log("Estamos obteniendo los datos del servidor..."); 
					},
					after: function(resp){
						var primera = false;
						$.each(resp, function(i, el){
							var plt = pComida;
							plt = $(plt);
							if (!primera){
								plt.find(".panel-collapse").addClass("in");
								primera = true;
							}
							
							$.each(el, function(key, value){
								plt.find("[campo=" + key + "]").html(value);
							})
							
							plt.find(".panel-title").find("a").attr("href", "#comida" + el.idComida);
							plt.find(".panel-collapse").attr("id", "comida" + el.idComida);
							plt.find(".btnAlimentos").attr("comida", el.idComida);
							plt.find(".btnAlimentos").click(function(){
								$("#winAlimentos").modal();
								$("#winAlimentos").find("#comida").val(el.idComida);
							});
							
							plt.attr("plantillaComida", el.idComida);
							
							plt.find(".btnPlantilla").click(function(){
								alertify.confirm("<p>¿Está seguro?</p>", function (e) {
									if (e){
										objMenu.setAlimentosPlantilla(el.idComida, {
											before: function(){
												alertify.log("Se está cargando la lista, espere por favor...");
												plt.find(".btnPlantilla").prop("disabled", true);
											}, after: function(resp){
												plt.find(".btnPlantilla").prop("disabled", false);
												
												if (resp.band){
													getAlimentos(el.idComida);
													alertify.success("La plantilla fue cargada con éxito");
												}else
													alertify.error("No pudo ser cargada la plantilla");
											}
										});
									}
								}); 
							});
							
							$("#accordion").append(plt);
							getAlimentos(el.idComida);
						});
					}
				});
			}
		});
		
		function getAlimentos(idComida){
			var plt =  $("[plantillaComida=" + idComida + "]");
			objMenu.getAlimentos(idComida, {
				after: function(resp){
					//var totalCalorias = objCliente.calorias / 5;
					//plt.find("[campo=totalCalorias]").html(totalCalorias);
					
					var cantidad = 0;
					var carbohidratos = parseFloat(totalCarbohidratos / 5).toFixed(2);
					var proteinas = parseFloat(totalProteinas / 5).toFixed(2);
					var grasas = parseFloat(totalGrasas / 5).toFixed(2);
					var c = 0;
					var p = 0;
					var g = 0;
					
					plt.find("#consumo").find("[campo=proteinas]").text(proteinas);
					plt.find("#consumo").find("[campo=carbohidratos]").text(carbohidratos);
					plt.find("#consumo").find("[campo=grasas]").text(grasas);
					
					
					plt.find("#lstAlimentos").find("tbody").find("tr").remove();
					$.each(resp, function(key, tr){
						comidaProteinas = parseFloat(tr.proteinas * tr.cantidad).toFixed(2);
						comidaCarbohidratos = parseFloat(tr.carbohidratos * tr.cantidad).toFixed(2);
						comidaGrasas = parseFloat(tr.grasas * tr.cantidad).toFixed(2);
						
						elemento = $('<tr><td>' + tr.nombre + ' (' + tr.cantidad + 'g)</td><td class="text-right">' + (comidaProteinas) + '</td><td class="text-right">' + (comidaCarbohidratos) + '</td><td class="text-right">' + (comidaGrasas) + '</td></tr>');
						plt.find("#lstAlimentos").find("tbody").append(elemento);
						
						cantidad += parseFloat(tr.cantidad);
						carbohidratos -= parseFloat(tr.carbohidratos * tr.cantidad).toFixed(2);
						proteinas -= parseFloat(tr.proteinas * tr.cantidad).toFixed(2);
						grasas -= parseFloat(tr.grasas * tr.cantidad).toFixed(2);
						
						c += parseFloat(parseFloat(tr.carbohidratos * tr.cantidad).toFixed(2));
						p += parseFloat(parseFloat(tr.proteinas * tr.cantidad).toFixed(2));
						g += parseFloat(parseFloat(tr.grasas * tr.cantidad).toFixed(2));
						
						elemento.click(function(){
							var el = $(this);
							alertify.confirm("<p>¿Está seguro de querer eliminar el alimento de la lista?</p>", function (e) {
								if (e){
									objMenu.delAlimento(idComida, tr.idAlimento, {
										before: function(){
											alertify.log("Se está quitando el alimento de la lista");
										}, after: function(resp){
											if (resp.band){
												//el.remove();
												getAlimentos(idComida);
												alertify.success("Se quitó el alimento de la lista");
											}else
												alertify.error("No se pudo quitar el alimento de la lista");
										}
									});
								}
							});
						});
					});
					
					var suma = carbohidratos + proteinas + grasas;
					//plt.find("[campo=sumaCalorias]").html(suma.toFixed(2));
					plt.find("[campo=sumaCarbohidratos]").html(c.toFixed(2));
					plt.find("[campo=sumaProteinas]").html(p.toFixed(2));
					plt.find("[campo=sumaGrasas]").html(g.toFixed(2));
					
					plt.find(".consumo").removeClass("alert-success");
					plt.find(".consumo").removeClass("alert-danger");
					plt.find(".consumo").removeClass("alert-warning");
					plt.find(".btnAlimentos").show();
					
					if (carbohidratos+47 < 0 || proteinas+47 < 0 || grasas+106 < 0){
						plt.find(".consumo").addClass("alert-danger");
						plt.find(".btnAlimentos").hide();
					}else{
						if (carbohidratos+47 > 0 || proteinas+47 > 0 || grasas+106 > 0)
							plt.find(".consumo").addClass("alert-warning");
						else
							plt.find(".consumo").addClass("alert-success");
					}
						
					cantidad *= 100;
					plt.find("[campo=totalGramos]").html(cantidad);
					if (cantidad == 0)
						plt.find(".btnPlantilla").show();
					else
						plt.find(".btnPlantilla").hide();
				}
			});
		}
		
		$("#modulo").find("[campo=caloriasDiarias]").html(objCliente.calorias);
		
		$.post(server + 'listaAlimentos', {
			"json": true,
			"movil": '1'
		}, function(datos){
			$.get("vistas/menu/listaAlimentos.html", function(pAlimento){
				$.each(datos, function(key, el){
					var plt = pAlimento;
					plt = $(plt);
					
					$.each(el, function(key, value){
						plt.find("[campo=" + key + "]").html(value);
					});
					
					plt.find("#selCantidad").attr("alimento", el.idAlimento);
					
					plt.find("#btnAgregar").click(function(){
						valor = plt.find("#selCantidad").val();
						
						objMenu.addAlimento($("#winAlimentos").find("#comida").val(), plt.find("#selCantidad").attr("alimento"), plt.find("#selCantidad").val(), {
							before: function(){
								plt.find("#btnAgregar").prop("disabled", true);
							},
							after: function(resp){
								plt.find("#btnAgregar").prop("disabled", false);
								
								if(resp.band){
									getAlimentos($("#winAlimentos").find("#comida").val());
									alertify.success("Se agregó el alimento a la lista");
								}else{
									if (resp.mensaje == '' || resp.mensaje == undefined)
										alertify.error("Al parecer este alimento ya está en la lista");
									else
										alertify.error(resp.mensaje);
								}
							}
						});
					});
					
					$("#winAlimentos").find(".list-group").append(plt);
				});
			});
		}, "json");
	});
}