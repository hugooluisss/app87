function usuarios(){
	$.get("vistas/usuarios/panel.html", function(resp){
		$("#modulo").html(resp);
		
		getLista();
		
		$.post(server + "cusuarios", {
			"usuario": usuario.getId(),
			"action": "getPanel"
		}, function(data){
			$.each(data, function(){
				var el = this;
				
				$("#selPerfil").append($("<option />", {
					value: el.idPerfil,
					html: el.nombre
				}));
			});
		}, "json");
		
		$('.nav a[href="#add"]').click(function(){
			$("#frmAdd")[0].reset();
			$("#frmAdd #id").val("");
		});
		
		$("#frmAdd").validate({
			debug: true,
			rules: {
				txtNombre: "required",
				txtApellidos: "required",
				txtEmail: {
					email: true,
					required: true,
					remote: {
						url: server + "cusuarios",
						type: "post",
						data: {
							action: "validaEmail",
							usuario: function(){
								return $("#id").val();
							}
						}
					}
				},
				txtPass1: {
		            minlength: 5
		        },
		        txtPass2: {
		            minlength: 5,
		            equalTo: "#txtPass1"
		        }
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			debug: true,
			messages: {
				txtEmail: {
					required: "Este campo es necesario",
					email: "No es un correo válido",
					remote: "El correo que estás usando ya existe en nuestro sistema"
				},
				txtPass1: {
					minlength: "Minimamente debe de tener 5 caracteres"
				},
				txtPass2: {
					minlength: "Minimamente debe de tener 5 caracteres",
					equalTo: "Las contraseñas no coinciden"
				},
				txtNombre: "Este campo es necesario",
				txtApellidos: "Este campo es necesario"
			},
			submitHandler: function(form){
				var obj = new TUsuario;
				obj.add(
					$("#id").val(), 
					usuario.getEmpresa(), 
					$("#txtNombre").val(), 
					$("#txtApellidos").val(),
					$("#txtEmail").val(),
					$("#selPerfil").val(),
					{
						after: function(datos){
							if (datos.band){
								getLista();
								
								if ($("#txtPass1").val() != '') 
									obj.setPass(datos.id, $("#txtPass1").val(), {
										after: function(resp){
											if (resp.band == false)
												alert("Ocurrió un error al actualizar la contraseña");
										}
									});
								
								$("#frmAdd").get(0).reset();
								$('.nav a[href="#lista"]').tab('show');
							}else{
								alert("Upps... " + datos.mensaje);
							}
						}
					}
				);
	        }
	
	    });
	});
	
	function getLista(){
		$.get("vistas/usuarios/lista.html", function(html){
			$("#dvLista").html(html);
			var plantilla = $("#dvLista").find("table tbody tr");
			$("#dvLista").find("table tbody").html("");
			
			$.post(server + 'cusuarios', {
					"empresa": usuario.getEmpresa(),
					"action": "lista"
				}, function(usuarios){
					$.each(usuarios, function(){
						var user = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=nombres]").html(user.nombres);
						pl.find("[campo=apellidos]").html(user.apellidos);
						pl.find("[campo=perfil]").html(user.perfil);
						pl.find("button[action=modificar]").attr("datos", JSON.stringify(user)).click(function(){
							var el = jQuery.parseJSON($(this).attr("datos"));
					
							$("#id").val(el.idUsuario);
							$("#selPerfil").val(el.idPerfil);
							$("#txtNombre").val(el.nombres);
							$("#txtApellidos").val(el.apellidos);
							$("#txtEmail").val(el.email);
							$("#selPerfil").val(el.idPerfil);
							
							
							$('.nav a[href="#add"]').tab('show');
						});
						
						pl.find("button[action=eliminar]").attr("usuario", user.idUsuario).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TUsuario;
								obj.del($(this).attr("usuario"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar el usuario");
										getLista();
									}
								});
							}
						});
						
						$("#dvLista table tbody").append(pl);
					});
					
					$("#tblUsuarios").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": true,
						"lengthChange": false,
						"ordering": true,
						"info": true,
						"autoWidth": true
					});
				},
				"json"
			);
		});
	}
}