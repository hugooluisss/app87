function getPanelMisDatos(){
	$.get("vistas/misDatos.html", function(resp){
		var actividades = undefined;
		$(".navbar-title").html("Mis datos");
		$("#winActividad .modal-body").css("max-height", (screen.height - 200) + "px");
		
		$("#modulo").html(resp);
		var usuario = new TUsuario;
		
		if (bandNuevo){
			if (cliente.sexo == 'M')
				msg = "<b>¿Eres nuevo en el sistema?</b> Inicia con el registro de tus datos principales y posteriormente presiona <b>Calcular y enviar</b>";
			else
				msg = "<b>¿Eres nueva en el sistema?</b> Inicia con el registro de tus datos principales y posteriormente presiona <b>Calcular y enviar</b>";
				
			$(".alert").html(msg).removeClass("hide");
			
			$("#winResultados .alert").html("</b>Muchas gracias por la información... </b> ahora te presentamos los resultados que obtuvimos a partir de tus datos. <b> Proporionanos la actividad que vas a realizar para alcanzar tu objetivo</b>").removeClass("hide");
			
			$("#btnConsumo").hide();
		}
		
		$("[campo=sexo]").html(cliente.sexo == 'M'?'<i class="fa fa-male" aria-hidden="true"></i> Masculino':'<i class="fa fa-female" aria-hidden="true"></i> Femenino');
		
		//$("#txtNacimiento").datepicker({});
		$("#txtNacimiento").val(cliente.nacimiento);
		
		$("#txtEdad").val(cliente.calcularEdad(false));
		$("#txtPeso").val(cliente.peso);
		$("#txtAltura").val(cliente.estatura);
		$("#txtActividad").val(cliente.nombreActividad);
		$("#txtActividad").attr("actividad", cliente.idActividad);
		
		
		$("#txtIMC").val(cliente.calcularIMC());
		$("#txtPGCE").val(cliente.calcularPGCE());
		
		$("#txtBMR").val(cliente.calcularBMR());
							
		$("#txtNacimiento").change(function(){
			if ($("#txtNacimiento") != ''){
				cliente.nacimiento = $("#txtNacimiento").val();
				$("#txtEdad").val(cliente.calcularEdad(true));
			}else
				$("#txtEdad").val("");
		});
		
		$("#frmDatos").find("input").change(function(){
			$("#frmDatos").find("#txtIMC").val("");
			$("#frmDatos").find("#txtPGCE").val("");
		});
		
		$.post(server + 'listaObjetivos', {
			"json": true,
			"movil": '1'
		}, function(datos){
			$.each(datos, function (index, row){
				$("#frmDatos").find("#selObjetivo").append('<option value="' + row.idObjetivo + '">' + row.nombre + '</option>');
			});
			
			$("#frmDatos").find("#selObjetivo").val(cliente.objetivo);
		}, "json");
		
		$.post(server + 'listaFrecuencias', {
			"json": true,
			"movil": '1'
		}, function(datos){
			$.each(datos, function (index, row){
				$("#winFrecuencias").find(".modal-body").find(".list-group").append('<a href="#" identificador="' + row.idFrecuencia + '" class="list-group-item"><h5 class="list-group-item-heading">' + row.nombre + '</h5><p class="list-group-item-text">' + row.descripcion + '</p></a>');
				
				if (cliente.idFrecuencia == row.idFrecuencia){
					$("#txtFrecuencia").val(row.nombre);
					$("#txtFrecuencia").attr("identificador", row.idFrecuencia);
				}
				
			});
			
			$("#winFrecuencias").find(".modal-body").find(".list-group").find("a").click(function(){
				$("#winFrecuencias .modal-body").css("height", ($(document).height() - $(document).height() * 0.3) + "px");
				var el = $(this).find(".list-group-item-heading").html();
				
				$("#txtFrecuencia").val(el);
				$("#txtFrecuencia").attr("identificador", $(this).attr("identificador"));
				
				$("#winFrecuencias").modal("hide");
			});
			
			$("#frmDatos").find("#selFrecuencia").val(cliente.idFrecuencia);
		}, "json");
		
		$("#txtFrecuencia").click(function(){
			$("#winFrecuencias").modal();
		});
		
		$("#txtActividad").click(function(){
			clickActividad();
		});
		
		function clickActividad(){
			$("#winResultados").modal("hide");
			$("#winActividad").modal("show");
			
			$("#winActividad .modal-body").css("max-height", ($(document).height() - $(document).height() * 0.5) + "px");
			
			if (actividades == undefined){
				$.get("vistas/listaActividades.html", function(resp){
					$("#winActividad").find(".modal-body").find(".list-group").html("");
					var el = resp;
					
					$.post(server + 'listaActividades', {
						"json": true,
						"movil": '1'
					}, function(datos){
						actividades = datos;
						
						$.each(datos, function (index, row){
							var el2 = $(el);
							$.each(row, function(campo, valor){
								el2.find("[campo=" + campo + "]").html(valor);
							});
							
							el2.attr("json", row.json);
							el2.click(function(){
								data = jQuery.parseJSON(el2.attr("json"));
								var momento = new TMomento();
								momento.setActividad(usuario.getId(), data.idActividad, {
									before: function(){
										if (!bandNuevo)
											alertify.log("Estamos actualizando la actividad que realizarás... espera un momento"); 
									}, after: function(result){
										if (result.band){
											alertify.success("Datos actualizados");
											
											$("#txtActividad").val(data.nombre);
											$("#txtActividad").attr("actividad", data.idActividad);
											
											cliente.idActividad = data.idActividad;
											cliente.nombreActividad = data.nombre;
											cliente.calorias = result.calorias;
											
											cliente.save();
											
											$("#winActividad").modal("hide");
											$("#winResultados").modal("show");
											$("#txtIMC").focus();
											$("#txtActividad").removeClass("alerta");
											$("#btnConsumo").show();
											
											$(".alert").addClass("hide");
											
											if (bandNuevo){
												bandNuevo = false;
												objMenu = new TMenu;
												objMenu.setAlimentosPlantilla(null, {
													before: function(){
														alertify.log("Estamos construyendo su menú, por favor espere...");
													}, after: function(resp){
														if (resp.band){
															$("#winResultados").modal("hide");
															setTimeout(function(){getPanelConsumo()}, 900);
												
															alertify.success("La plantilla fue cargada con éxito");
														}else
															alertify.error("No pudo ser cargada la plantilla");
													}
												});
												
												alertify.error("<b>Haz completado la información básica</b>... a continuación te invitaremos a que indiques el menú diario que deseas tener, espera un momento");
											}
										}else
											alertify.error("Ocurrió un error y no se realizó la actualización");
									}
								});
							});
							
							$("#winActividad").find(".modal-body").find(".list-group").append(el2);
						});
					}, "json");
				});
			}
		}
		
		$("#btnConsumo").click(function(){
			$("#winResultados").modal("hide");
			setTimeout(function(){getPanelConsumo()}, 900);
		});
								
		$("#frmDatos").validate({
			debug: false,
			errorClass: "validateError",
			rules: {
				txtNacimiento: "required",
				txtAltura: "required",
				txtPeso: "required",
				txtEdad: {
					required: true,
					min: 5
				},
				txtFrecuencia: "required"
			},
			wrapper: 'span',
			messages: {
				txtEdad: {
					min: "Tu edad debe de ser mayor o igual a 5 años... actualiza tu fecha de nacimiento"
				}
			},
			submitHandler: function(form){
				var momento = new TMomento;
				
				momento.add(cliente.idCliente, $("#txtAltura").val(), $("#txtPeso").val(), $("#txtFrecuencia").attr("identificador"), $("#selObjetivo").val(), {
					before: function(){
						$("#frmDatos").find("[type=submit]").prop("disabled", true);
						alertify.log("Espera un momento, estamos actualizando tus datos..."); 
					},
					after: function(resp){
						$("#frmDatos").find("[type=submit]").prop("disabled", false);
						
						if (resp.band){
							//var cliente = new TCliente;
							cliente.estatura = $("#txtAltura").val();
							cliente.peso = $("#txtPeso").val();
							
							$("#txtIMC").val(cliente.calcularIMC());
							$("#txtPGCE").val(cliente.calcularPGCE());
							$("#txtBMR").val(cliente.calcularBMR());
							cliente.idFrecuencia = $("#txtFrecuencia").attr("identificador");
							cliente.nombreFrecuencia = $("#txtFrecuencia").val();
							cliente.objetivo = $("#selObjetivo").val();
							cliente.save();
							$("#imgEstado").prop("src", "img/obeso_" + cliente.sexo + "_" + resp.magro.idObesidad + ".png");
							$("[campo=obesidad]").html(resp.magro.nombre);
							
							$("#winResultados .modal-body").css("max-height", ($(document).height() - $(document).height() * 0.4) + "px");
							
							if (cliente.idActividad == ''){
								$("#winResultados").modal("show");
								$("#txtActividad").addClass("alerta");
								alertify.error("Es necesario que nos indiques la actividad que deseas realizar...");
								
								$("#btnConsumo").hide();
								clickActividad();
							}else{
								$("#winResultados").modal();
								
								$("#btnConsumo").show();
							}
						}else{
							alertify.error("No se pudo actualizar la información, inténtalo mas tarde"); 
						}
					}
				});
			}
		});
	});
};