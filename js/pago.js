var prueba = true;
function getPanelPago(){
	$.get("vistas/pago.html", function(resp){
		$(".navbar-title").html("Renovación de membresia");
		$(".navbar-toggle").hide();
		$("#modulo").html(resp);
		
		if (prueba){
			$(".name").val("hugo Santiago");
			$(".number").val("4242424242424242");
			$(".cvc").val("121");
			$(".exp_month").val("11");
			$(".exp_year").val("2018");
		}
		
		//$("#frmPago").attr("action", server + "?mod=cpagos&action=cobroTarjeta");
		
		$("#frmPago").submit(function(){
			Conekta.setPublicKey('key_HiPFRmvixqQqGgbT513nGtQ');
			var $form = $(this);

			// Previene hacer submit más de una vez
			$form.find("button").prop("disabled", true);
			Conekta.Token.create($form, function(token) {
				var $form = $("#frmPago");
				
				/* Inserta el token_id en la forma para que se envíe al servidor */
				$("#conektaTokenId").val(token.id);
				
				/* and submit */
				//$form.get(0).submit();
				$.post(server + '?mod=cpagos&action=cobroTarjeta', {
					"token": token.id,
					"cliente": usuario.getId(),
					"calle": $(".calle").val(),
					"colonia": $(".colonia").val(),
					"ciudad": $(".ciudad").val(),
					"estado": $(".estado").val(),
					"codigoPostal": $(".codigoPostal").val()
				}, function(resp) {
					console.log(resp);
					$form.find("button").prop("disabled", false);
					if (resp.band == true){
						alertify.success("<b>Muchas gracias por su pago</b> <br />Es necesario iniciar sesión");
						var objUsuario = new TUsuario;
						
						setTimeout(function(){
							objUsuario.logout({
								after: function(){
									location.reload(true);
								}
							});
						}, 3000);
					}else
						alertify.error(resp.mensaje);
				}, "json");
			
			
			}, function(response) {
				var $form = $("#frmPago");
				
				/* Muestra los errores en la forma */
				alertify.error(response.message_to_purchaser);
				$form.find("button").prop("disabled", false);
			});
			return false;
		});
		
		$("#btnSPEI").click(function(){
			alertify.confirm("<b>Se creará un número de referencia para el pago</b> ¿Seguro?", function (e) {
					if (e) {
						alertify.log("Espere mientras generamos la clabe");
						
						$.post(server + '?mod=cpagos&action=cobroSPEI', {
							"cliente": usuario.getId()
						}, function(resp) {
							console.log(resp);
							
							if (resp.band == true){
								alertify.success("Se ha generado la clabe de pago SPEI " + resp.clabe + " y ha sido enviada a su correo electrónico");
								
								//alert("CLABE: " + resp.clabe);
							}else
								alertify.log("No se pudo generar la clabe en este momento, inténtelo más tarde");
								
						}, "json");
					}
				});
		});
		
		$("#btnOXXO").click(function(){
			alertify.confirm("<b>Se creará un código de barras para el pago</b> ¿Seguro?", function (e) {
					if (e) {
						alertify.log("Espere mientras generamos el código");
						
						$.post(server + '?mod=cpagos&action=cobroOXXO', {
							"cliente": usuario.getId()
						}, function(resp) {
							console.log(resp);
							
							if (resp.band == true){
								alertify.success("Se ha enviado un email a su cuenta con el código de barras a presentar en las tiendas OXXO");
								
							}else
								alertify.log("No se pudo generar código en este momento, inténtelo más tarde");
								
						}, "json");
					}
				});
		});
	});
}