function miEmpresaPanel(){
	var objEmpresa = new TEmpresa;
	var objUsuario = new TUsuario;
	objEmpresa.getData(objUsuario.getEmpresa(), {
		after: function(empresa){
			$.get("vistas/configuracion/miEmpresa.html", function(resp){
				$("#modulo").html(resp);
				
				$("#txtNombre").val(empresa.razonsocial);
				$("#txtDireccion").val(empresa.direccion);
				$("#txtPagina").val(empresa.url);
				
				
				$("#frmAdd").validate({
					debug: true,
					rules: {
						txtNombre: "required"
					},
					errorElement : 'span',
					errorLabelContainer: '.errorTxt',
					debug: true,
					messages: {
						txtNombre: "Este campo es necesario"
					},
					submitHandler: function(form){
						var obj = new TEmpresa;
						
						obj.guardar(objUsuario.getEmpresa(), $("#txtNombre").val(), $("#txtDireccion").val(), $("#txtPagina").val(), {
							before: function(){
								$(form).find("[type=submit]").prop("disabled", true);
							}, after: function(resp){
								$(form).find("[type=submit]").prop("disabled", false);
								
								if (resp.band == false)
									alert("No se pudo actualizar la información");
								else
									alert("Los datos fueron guardados");
							}
						});
					}
				});
			});
		}
	});
}