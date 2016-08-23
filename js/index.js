var usuario = new TUsuario;

$(document).ready(function(){
	$("#modulo").css("min-height", screen.height + "px");


	if (usuario.isSesionIniciada()){
		var cliente = new TCliente;
		getPanel();
		getMenu();
		
		checkSuscripcion();
	}else{
		loadLogin();
	}
	
	function getMenu(){
		$.get("vistas/menu.html", function(resp){
			$("#menu").html(resp);
			$("body").addClass("conmenu");
			
			//$("#fotoPerfil").attr("src", server + "repositorio/imagenesUsuarios/img_" + usuario.getId() + ".jpg?" + Math.random());
			
			$("#menuPrincipal a").click(function(){
				$('#menuPrincipal').parent().removeClass("in");
				$('#menuPrincipal').parent().attr("aria-expanded", false);
			});
			
			var objUsuario = new TUsuario;
			
			$("[vista=nombreUsuario]").html(objUsuario.getNombre());
			
			//Opciones del menú
			$("#menuPrincipal [liga=datosPersonales]").click(function(){
				getPanelMisDatos();
			});
			
			$("#menuPrincipal [liga=consumoDiario]").click(function(){
				getPanelConsumo();
			});
			
			$("#menuPrincipal [liga=avance]").click(function(){
				getPanelAvance();
			});
			
			//Opciones del menú
			$("#menuPrincipal [liga=salir]").click(function(){
				alertify.confirm("¿Seguro?", function(e){
					if (e)
						objUsuario.logout({
							after: function(){
								location.reload(true);
							}
						});
				});
			});
			
			
			$("#fotoPerfil").click(function(){
				if (navigator.camera != undefined){
					navigator.camera.getPicture(function(imageData) {
							$("#fotoPerfil").attr("src", imageData);
							subirFotoPerfil(imageData);
						}, function(message){
							alert("Ocurrió un error al subir la imagen");
					        setTimeout(function() {
					        	$("#mensajes").fadeOut(1500).removeClass("alert-danger");
					        }, 5000);
						}, { 
							quality: 50,
							destinationType: Camera.DestinationType.FILE_URI,
							targetWidth: 250,
							targetHeight: 250
						});
				}else{
					console.log("No se pudo inicializar la cámara");
				}
			});
		});
	}
	
	function getPanel(){
		$.get("vistas/panel.html", function(resp){
			$("#modulo").html(resp);
			
			var cliente = new TCliente;
			$("[campo=bienvenido]").html("Hola " + cliente.nombre);
			$("[campo=peso]").html(cliente.peso);
			$("[campo=altura]").html(cliente.estatura);
			$("[campo=edad]").html(cliente.calcularEdad(false));
			$("[campo=ultimaActualizacion]").html(cliente.fecha);
		});
	}
	
	function subirFotoPerfil(imageURI){
		var usuario = new TUsuario;
		var options = new FileUploadOptions();
		
		options.fileKey = "file";
		options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
		options.mimeType = "image/jpeg";
		
		var params = new Object();
		params.identificador = usuario.getId();
		
		options.params = params;
		
		var ft = new FileTransfer();
		ft.upload(imageURI, encodeURI(server + "?mod=cusuarios&action=uploadImagenPerfil"), function(r){
				console.log("Code = " + r.responseCode);
		        console.log("Response = " + r.response);
		        console.log("Sent = " + r.bytesSent);
		        
		        alert("La fotografía se cargó con éxito");
			}, function(error){
		        alert("No se pudo subir la imagen al servidor " + error.target);
			    console.log("upload error source " + error.source);
			    console.log("upload error target " + error.target);
			}, options);
	}
	
	function checkSuscripcion(){
		$.post(server + "csuscripcion", {
			"action": "getSuscripcion",
			"id": usuario.getId()
		}, function(resp){
			if (resp.band == "true"){
				console.log("Suscripcion OK");
				setTimeout(checkSuscripcion, 360000);
			}else{
				navigator.app.loadUrl(server + 'planes', { openExternal:true });
				usuario.logout();
			}
		}, "json");
	}
});