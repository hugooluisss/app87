function loadLogin(){
	$.get("vistas/login.html", function(resp){
		$("#modulo").html(resp);
		
		$(".nav-tabs a").click(function(){
			$(this).tab('show');
		});
		
		$("#txtUsuario").focus();
			
		$("div[role=alert]").hide();
		$("#frmLogin").validate({
			debug: true,
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
			messages: {
				txtUsuario:{
					required: "Ingresa un usuario",
					email: "El usuario es una cuenta de correo electrónico"
				},
				txtPass: {
					required: "Es necesaria la contraseña"
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