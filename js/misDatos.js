function getPanelMisDatos(){
	$.get("vistas/misDatos.html", function(resp){
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
		
		$("#txtIMC").val(cliente.calcularIMC());
		$("#txtPGCE").val(cliente.calcularPGCE());
							
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
				console.log(cliente.idCliente);
				momento.add(cliente.idCliente, $("#txtAltura").val(), $("#txtPeso").val(), {
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
							
							cliente.save();
						}else{
							alertify.error("No se pudo actualizar la información, inténtalo mas tarde"); 
						}
					}
				});
			}
		});
	});
};