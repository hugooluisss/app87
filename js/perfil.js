function getPanelPerfil(){
	$.get("vistas/perfil.html", function(resp){
		$(".navbar-title").html("Perfil de usuario");
		
		$("#modulo").html(resp);
		$("#fotoPerfilUsuario").attr("src", server + "repositorio/imagenesUsuarios/img_" + usuario.getId() + ".jpg?" + Math.random());
		
		var objCliente = new TCliente;
		
		$("#txtNombre").val(objCliente.nombre);
		$("#txtUsuario").val(objCliente.email);
		
		$("#btnCamaraUsuario").click(function(){
			if (navigator.camera != undefined){
				navigator.camera.getPicture(function(imageData) {
						$("#fotoPerfil").attr("src", imageData);
						$("#fotoPerfilUsuario").attr("src", imageData);
						subirFotoPerfil(imageData);
					}, function(message){
						alertify.error("Ocurrio un error al subir la imagen");
				        setTimeout(function() {
				        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
				        }, 5000);
					}, { 
						quality: 80,
						destinationType: Camera.DestinationType.FILE_URI,
						targetWidth: 250,
						targetHeight: 250,
						correctOrientation: true,
						allowEdit: true
					});
			}else{
				alertify.error("No se pudo iniciar la cámara");
				console.log("No se pudo inicializar la cámara");
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
							id: usuario.getId()
						}
					}
				}
			},
			wrapper: 'span', 
			messages: {
				txtUsuario: {
					remote: "Este correo ya se encuentra registrado"
				},
				chkTerminos: "Es necesario aceptar los términos y condiciones",
				txtNacimiento: "Indica tu fecha de nacimiento"
			},
			submitHandler: function(form){
				var obj = new TCliente;
				form = $(form);
				
				usuario.add(usuario.getId(), form.find("#txtNombre").val(), form.find("#selSexo").val(), form.find("#txtUsuario").val(), {
					before: function(){
						form.find("[type=submit]").prop("disabled", true);
					},
					after: function(resp){
						form.find("[type=submit]").prop("disabled", false);
						
						if (resp.band){
							alertify.success("<b>Sus datos se actualizaron con éxito</b>, es necesario realizar un nuevo inicio de sesión...");
							
							usuario.logout({
								after: function(){
									setTimeout(function(){
										location.reload(true);
									}, 3000);
								}
							});
						}else
							alertify.error("<b>Sus datos no pudieron ser actualizados</b>, inténtelo más tarde");
					}
				});
			}
		});
		
		
		$("#btnChangePass").click(function(){
			alertify.password("Dame tu nueva <b>contraseña</b>:", function (e, str) { 
				if (e){
					if (str){
						alertify.password("<b>Confirmala</b>:", function (e, str2) { 
							if (e){
								if (str == str2){
									usuario.setPass(usuario.getId(), str, {
										before: function(){
											alertify.log("Estamos actualizando tu contraseña...");
										},
										after: function(resp){
											if (resp.band){
												alertify.success("<b>Tu contraseña se actualizó con éxito</b>, es necesario realizar un nuevo inicio de sesión...");
							
												usuario.logout({
													after: function(){
														setTimeout(function(){
															location.reload(true);
														}, 3000);
													}
												});

											}else
												alertify.error("No se pudo actualizar tu contraseña");
										}
									});
								}else
									alertify.error("Las contraseñas no coinciden");
							}else
								alertify.error("Acción cancelada");
						});
					}
				}else{
					alertify.error("Acción cancelada");
				}
			});
		});
	});
}