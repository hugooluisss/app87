function getPanelConsumo(){
	var objMenu = new TMenu;
	var objCliente = new TCliente;
	var pComida = "";
	
	$.get("vistas/menu/comida.html", function(resultado){
		pComida = resultado;
	});
	
	$.get("vistas/consumo.html", function(resp){
		$(".navbar-title").html("Consumo de alimentos");
		$("#modulo").html(resp);
		
		function getAlimentos(idComida){
			var plt =  $("[plantillaComida=" + idComida + "]");
			objMenu.getAlimentos(idComida, {
				after: function(resp){
					var totalCalorias = objCliente.calorias / 5;
					plt.find("[campo=totalCalorias]").html(totalCalorias);
					var cantidad = 0;
					var carbohidratos = 0;
					var proteinas = 0;
					var grasas = 0;
					
					plt.find("table").find("tbody").find("tr").remove();
					$.each(resp, function(key, tr){
						elemento = $('<tr><td>' + tr.nombre + '</td><td class="text-right">' + (tr.cantidad * 100) + '</td></tr>');
						plt.find("table").find("tbody").append(elemento);
						
						cantidad += parseFloat(tr.cantidad);
						carbohidratos += parseFloat(tr.carbohidratos) * tr.cantidad * 4;
						proteinas += parseFloat(tr.proteinas) * tr.cantidad * 4;
						grasas += parseFloat(tr.grasas) * tr.cantidad * 9;
						
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
					plt.find("[campo=sumaCalorias]").html(suma.toFixed(2));
					plt.find(".consumo").removeClass("alert-success");
					plt.find(".consumo").removeClass("alert-danger");
					plt.find(".consumo").removeClass("alert-warning");
					plt.find(".btnAlimentos").show();
					
					if (suma >= totalCalorias+200){
						plt.find(".consumo").addClass("alert-danger");
						plt.find(".btnAlimentos").hide();
					}else{
						if (suma < totalCalorias-200)
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