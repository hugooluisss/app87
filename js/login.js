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
							alertify.alert("Tus datos no son válidos");
						}else{
							location.reload(true);
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
			},
			wrapper: 'span', 
			messages: {
				txtUsuario: {
					remote: "Este correo ya se encuentra registrado"
				}
			},
			submitHandler: function(form){
				var obj = new TCliente;
				form = $(form);
				
				obj.registrar("", form.find("#txtNombre").val(), form.find("#selSexo").val(), form.find("#txtUsuario").val(), form.find("#txtPass").val(), true, {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					},
					after: function(data){
						form.find("[type=submit]").prop("disabled", false);
						
						if (data.band == false){
							alertify.alert("Ocurrió un error al registrar la cuenta, inténtelo más tarde");
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
	});
};