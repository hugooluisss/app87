function loadLogin(){
	$.get("vistas/login.html", function(resp){
		$("#modulo").html(resp);
		
		$(".nav-tabs a").click(function(){
			$(this).tab('show');
		});
		
		$('.selectpicker').selectpicker({});
		
		$("#frmLogin").find("#txtUsuario").focus();
		$("#frmLogin").validate({
			debug: true,
			errorClass: "validateError",
			rules: {
				txtUsuario: {
					required : true,
					email: true
				},
				txtPass: {
					required : true
				}
			},
			wrapper: 'span',
			submitHandler: function(form){
				var obj = new TUsuario;
				
				obj.login($("#txtUsuario").val(), $("#txtPass").val(), {
					before: function(){
						$("#frmLogin [type=submit]").prop("disabled", true);
						console.log("iniciando");
						
					},
					after: function(data){
						$("#frmLogin [type=submit]").prop("disabled", false);
						console.log(data);
						if (data.band == false){
							alert("Tus datos no son válidos");
						}else{
							location.reload(true);
						}
					}
				});
			}
		});
		
		
		$("#frmRegistro").validate({
			debug: true,
			errorClass: "validateError",
			rules: {
				txtUsuario: {
					required : true,
					email: true
				},
				txtPass: {
					required : true,
					minlength: 5
				},
				txtPass2: {
					required : true,
					minlength: 5,
					equalTo: "#frmRegistro #txtPass"
				}
			},
			wrapper: 'span', 
			messages: {
				txtPass2: {
					equalTo: "Las contraseñas no coinciden"
				}
			},
			submitHandler: function(form){
				var obj = new TUsuario;
				
				obj.login($("#txtUsuario").val(), $("#txtPass").val(), {
					before: function(){
						$("#frmLogin [type=submit]").prop("disabled", true);
						console.log("iniciando");
						
					},
					after: function(data){
						$("#frmLogin [type=submit]").prop("disabled", false);
						console.log(data);
						if (data.band == false){
							alert("Tus datos no son válidos");
						}else{
							location.reload(true);
						}
					}
				});
			}
		});
	});
};