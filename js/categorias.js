function categorias(){
	$.get("vistas/categorias/panel.html", function(resp){
		$("#modulo").html(resp);
		
		$('.nav a[href="#add"]').click(function(){
			$("#frmAdd")[0].reset();
			$("#frmAdd #id").val("");
		});
		
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
				var obj = new TCategoria;
				obj.add(
					$("#id").val(), 
					$("#txtNombre").val(), 
					$("#txtDescripcion").val(),
					{
						after: function(datos){
							if (datos.band){
								getLista();
								
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
		
		getLista();
	});
	
	function getLista(){
		var objUsuario = new TUsuario;
		
		$.get("vistas/categorias/lista.html", function(resp){
			$("#dvLista").html(resp);
			var plantilla = $("#dvLista").find("table tbody tr");
			$("#dvLista").find("table tbody").html("");
			
			$.post(server + 'ccategorias', {
					"empresa": objUsuario.getEmpresa(),
					"action": "lista"
				}, function(categorias){
					$.each(categorias, function(){
						var categoria = this;
						var plCategoria = plantilla.clone();
						
						
						plCategoria.find("[campo=identificador]").html(categoria.idCategoria);
						plCategoria.find("[campo=nombre]").html(categoria.nombre);
						plCategoria.find("button[action=modificar]").attr("datos", JSON.stringify(categoria)).click(function(){
							var el = jQuery.parseJSON($(this).attr("datos"));
				
							$("#id").val(el.idCategoria);
							$("#txtNombre").val(el.nombre);
							$("#txtDescripcion").val(el.descripcion);
							
							$('.nav a[href="#add"]').tab('show');
						});
						
						plCategoria.find("button[action=eliminar]").attr("categoria", categoria.idCategoria).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TCategoria;
								obj.del($(this).attr("categoria"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar la categoria");
											
										getLista();
									}
								});
							}
						});
						
						$("#dvLista table tbody").append(plCategoria);
					});
					
					$("#tblCategorias").DataTable({
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