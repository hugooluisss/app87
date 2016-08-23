function loadLogin(){
	$.get("vistas/login.html", function(resp){
		$("body").addClass("login");
		$("#modulo").html(resp);
		
		$(".nav-tabs a").click(function(){
			$(this).tab('show');
		});
		
		$('.selectpicker').selectpicker({});
		$("#txtNacimiento").datepicker({});
		
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
					},
					after: function(data){
						if (data.band == false){
							alertify.alert("Tus datos no son válidos");
							$("#frmLogin [type=submit]").prop("disabled", false);
						}else{
						
							var cliente = new TCliente({
								after: function(){
									location.reload(true);
								}
							});
						}
					}
				});
			}
		});
		
		$("#frmRegistro").validate({
			errorClass: "validateError",
			debug: true,
			rules: {
				txtNombre: {
					required : true,
					email: false
				},
				txtUsuario: {
					required : true,
					email: true,
					remote: {
						url: server + "cclientes",
						type: "post",
						data: {
							action: "validaEmail",
							"movil": 1,
							id: ""
						}
					}
				},
				txtPass: {
					required : true,
					minlength: 5
				},
				txtPass2: {
					required : true,
					minlength: 5,
					equalTo: "#frmRegistro #txtPass"
				},
				txtNacimiento: {
					required : true
				},
				chkTerminos: {
					required: true
				}
			},
			wrapper: 'span', 
			messages: {
				txtUsuario: {
					remote: "Este correo ya se encuentra registrado"
				},
				chkTerminos: "Es necesario aceptar los términos y condiciones"
			},
			submitHandler: function(form){
				var obj = new TCliente;
				form = $(form);
				
				obj.registrar("", form.find("#txtNombre").val(), form.find("#selSexo").val(), form.find("#txtUsuario").val(), form.find("#txtPass").val(), form.find("#txtNacimiento").val(), true, 1, {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					},
					after: function(data){
						form.find("[type=submit]").prop("disabled", false);
						
						if (data.band == false){
							alertify.error("Ocurrió un error al registrar la cuenta, inténtelo más tarde");
						}else{
							if (form.find("#selSexo").val() == 'H')
								alertify.success("<b>Bienvenido " + form.find("#txtNombre").val() + "</b>, haz quedado registrado");
							else
								alertify.success("<b>Bienvenida " + form.find("#txtNombre").val() + "</b>, haz quedado registrado");
							setTimeout(function(){location.reload(true)}, 3000);
						}
					}
				});
			}
		});
		
		$("#lnkLostPass").click(function(){
			alertify.prompt("<b>¿Olvidaste tu contraseña?</b>, introduce tu correo electrónico:", function (e, str) { 
				if (e){
					if (str == '')
						alertify.error("No se indicó un correo electrónico");
					else{
						var cliente = new TCliente;
						
						cliente.recuperarPass(str, {
							before: function(){
								$("#lnkLostPass").prop("disabled", true);
								alertify.success("Gracias, enviaremos un correo a <b>" + str + "</b> para la recuperación de tu contraseña");
							},
							afert: function(resp){
								$("#lnkLostPass").prop("disabled", false);
							}
						});
					}
						
				}
			}, $("#frmLogin").find("#txtUsuario").val());
		});
		
		$("#lnkTerminos").click(function(){
			$("#winTerminos").modal();
		});
		
		$.post(server + 'cconfiguracion', {
			"action": "get",
			"campo": "terminos"
		}, function(resp){
			$("#winTerminos").find(".modal-body").html(resp.valor);
		}, "json");
	});
};