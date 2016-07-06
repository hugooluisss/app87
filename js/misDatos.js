function getPanelMisDatos(){
	$.get("vistas/misDatos.html", function(resp){
		$("#modulo").html(resp);
		var usuario = new TUsuario;
		
		$("[campo=sexo]").html(usuario.getSexo() == 'M'?'<i class="fa fa-male" aria-hidden="true"></i> Masculino':'<i class="fa fa-female" aria-hidden="true"></i> Femenino');
		
		$("#txtNacimiento").datepicker({});
		$("#txtNacimiento").change(function(){
			if ($("#txtNacimiento") != '')
				$("#txtEdad").val(calcularEdad($("#txtNacimiento").val()));
			else
				$("#txtEdad").val("");
		});
		
		
		$("#frmDatos").validate({
			debug: true,
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
				var altura = $("#txtAltura").val()/100;
				var imc = $("#txtPeso").val() / (altura * altura);
				imc = imc.toFixed(1); //D11
				
				$("#txtIMC").val(imc);
				
				//=-44,988+0,503*D7+10,689*D8+3,172*D11-0,026*D11*D11+0,181*D11*D8-0,02*D11*D7-0,005*D11*D11*D8+0,00021*D11*D11*D7
				var edad = calcularEdad($("#txtNacimiento").val()); //D7
				var iSexo = usuario.getSexo() == 'M'?0:1; //D8
				var PGCE = -44.988 + 0.503 * edad + 10.689 * iSexo + 3.172 * imc - 0.026 * imc * imc + 0.181 * imc * iSexo - 0.02 * imc * edad - 0.005 * imc * imc * iSexo + 0.00021 * imc * imc * edad;
				
				PGCE = Number(Math.round(PGCE + 'e1') + 'e-1');
				$("#txtPGCE").val(PGCE);
			},
			errorPlacement: function(error, element){
				alertify.alert(error.html());
			}
		});
	});
};