function getPanelMisDatos(){
	$.get("vistas/misDatos.html", function(resp){
		var actividades = undefined;
		$(".navbar-title").html("Mis datos");
		
		$("#modulo").html(resp);
		var usuario = new TUsuario;
		var cliente = new TCliente;
		
		$("[campo=sexo]").html(cliente.sexo == 'M'?'<i class="fa fa-male" aria-hidden="true"></i> Masculino':'<i class="fa fa-female" aria-hidden="true"></i> Femenino');
		
		$("#txtNacimiento").datepicker({});
		$("#txtNacimiento").val(cliente.nacimiento);
		
		$("#txtEdad").val(cliente.calcularEdad(false));
		$("#txtPeso").val(cliente.peso);
		$("#txtAltura").val(cliente.estatura);
		$("#txtActividad").val(cliente.nombreActividad);
		$("#txtActividad").attr("tipoActividad", cliente.idActividad);
		
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
		
		$("#frmDatos").find("#txtActividad").click(function(){
			$("#winActividad").modal();
			
			if (actividades == undefined){
				$.get("vistas/listaActividades.html", function(resp){
					$("#winActividad").find(".modal-body").find(".list-group").html("");
					var el = resp;
					
					$.post(server + 'listaTipoActividades', {
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
									$("#txtActividad").val(data.nombre);
									$("#txtActividad").attr("tipoActividad", data.idTipo);
									$("#winActividad").modal("hide");
								});
								
								$("#winActividad").find(".modal-body").find(".list-group").append(el2);
							});
						}, "json");
				});
			}
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
				}
			},
			wrapper: 'span',
			messages: {
				txtEdad: {
					min: "Tu edad debe de ser mayor o igual a 5 años... actualiza tu fecha de nacimiento"
				}
			},
			submitHandler: function(form){
				var momento = new TMomento;
				console.log($("#txtActividad").attr("tipoActividad"));
				momento.add(cliente.idCliente, $("#txtAltura").val(), $("#txtPeso").val(), $("#txtActividad").attr("tipoActividad"), {
					before: function(){
						$("#frmDatos").find("[type=submit]").prop("disabled", true);
						alertify.log("Espera un momento, estamos actualizando tus datos..."); 
					},
					after: function(resp){
						$("#frmDatos").find("[type=submit]").prop("disabled", false);
						
						if (resp.band){
							var cliente = new TCliente;
							cliente.estatura = $("#txtAltura").val();
							cliente.peso = $("#txtPeso").val();
							
							$("#txtIMC").val(cliente.calcularIMC());
							$("#txtPGCE").val(cliente.calcularPGCE());
							$("#txtBMR").val(cliente.calcularBMR());
							
							cliente.save();
							$("#imgEstado").prop("src", "img/obeso_" + cliente.sexo + "_" + resp.magro.idObesidad + ".png");
							$("[campo=obesidad]").html(resp.magro.nombre);
							$("#winResultados").modal();
						}else{
							alertify.error("No se pudo actualizar la información, inténtalo mas tarde"); 
						}
					}
				});
			}
		});
	});
};