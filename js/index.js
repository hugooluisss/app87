var usuario = new TUsuario;
var bandNuevo = false;
var cliente = new TCliente;

$(document).ready(function(){
	if (usuario.isSesionIniciada()){
		
		getPanel();
		getMenu();
		
		checkSuscripcion();
	}else{
		loadLogin();
		$("#modulo").css("min-height", ($(document).height() - $(document).height() * 0.07) + "px");
		//alert(screen.height + ' ' + screen.availHeight + ' ' + screen.pixelDepth + ' ' + $(document).height());
	}
	
	function getMenu(){
		$.get("vistas/menu.html", function(resp){
			$("#menu").html(resp);
			$("body").addClass("conmenu");
			
			$("#fotoPerfil").attr("src", server + "repositorio/imagenesUsuarios/img_" + usuario.getId() + ".jpg?" + Math.random());
			
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
			
			$("#menuPrincipal [liga=perfil]").click(function(){
				getPanelPerfil();
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
			
			
			$("#btnCamara").click(function(){
				if (navigator.camera != undefined){
					navigator.camera.getPicture(function(imageData) {
							$("#fotoPerfil").attr("src", imageData);
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
		});
	}
	
	function getPanel(){
		$.get("vistas/panel.html", function(resp){
			$("#modulo").html(resp);
			$("[campo=bienvenido]").html("Hola " + cliente.nombre);
			$("[campo=peso]").html(cliente.peso);
			$("[campo=altura]").html(cliente.estatura);
			$("[campo=edad]").html(cliente.calcularEdad(false));
			$("[campo=ultimaActualizacion]").html(cliente.fecha);
			
			if (cliente.idActividad == '' || cliente.idActividad == undefined || cliente.idActividad == null){
				bandNuevo = true;
				getPanelMisDatos();
			}
			
			$("#btnMisDatos").click(function(){
				getPanelMisDatos();
			});
			
			$("#btnMiAvance").click(function(){
				getPanelAvance();
			});
		});
	}
	
	function checkSuscripcion(){
		$.post(server + "csuscripcion", {
			"action": "getSuscripcion",
			"id": usuario.getId()
		}, function(resp){
			switch(resp.band){
				case 1:
					console.log("Suscripcion OK");
					//setTimeout(checkSuscripcion, 360000);
				break;
				case 0:
					alertify.error("<b>Suscripción caducada</b> <br />Hemos detectado que tu suscripción venció, te invitamos a renovarla");
					getPanelPago();
				break;
				case -1:
					usuario.logout({
						after: function(){
							alert("El usuario no existe");
							//location.reload(true);
						}
					});
				break;
			}
			
		}, "json");
	}
});

function subirFotoPerfil(imageURI){
	var usuario = new TUsuario;
	var options = new FileUploadOptions();
	
	options.fileKey = "file";
	options.fileName = imageURI.substr(imageURI.lastIndexOf('/')+1);
	options.mimeType = "image/jpeg";
	
	var params = new Object();
	params.identificador = usuario.getId();
	console.log(usuario.getId());
	options.params = params;
	
	var ft = new FileTransfer();
	ft.upload(imageURI, encodeURI(server + "?mod=cusuarios2&action=uploadImagenPerfil"), function(r){
			console.log("Code = " + r.responseCode);
	        console.log("Response = " + r.response);
	        console.log("Sent = " + r.bytesSent);
	        
	        alertify.success("La fotografía se cargó con éxito");
		}, function(error){
			alertify.error("No se pudo subir la imagen al servidor" + error.target);
		    console.log("upload error source " + error.source);
		    console.log("upload error target " + error.target);
		}, options);
}