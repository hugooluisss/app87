function productos(){
	$.get("vistas/productos/panel.html", function(resp){
		$("#modulo").html(resp);
		getLista();
		//Se obtienen las categorias y los tipos desde el panel
		$.post(server + "cproductos", {
			"empresa": usuario.getEmpresa(),
			"action": "getPanel"
		}, function(data){
			$.each(data.categorias, function(){
				var el = this;
				
				$("#selCategoria").append($("<option />", {
					value: el.idCategoria,
					html: el.nombre
				}));
			});
			
			$.each(data.tipos, function(){
				var el = this;
				
				$("#selTipo").append($("<option />", {
					value: el.idTipo,
					html: el.nombre
				}));
			});
		}, "json");
		
		
		
		$('.nav a[href="#add"]').click(function(){
			$("#frmAdd")[0].reset();
			$("#frmAdd #id").val("");
			$("#frmAdd #txtClave").focus();
		});
		
		$("#frmAdd").validate({
			debug: true,
			rules: {
				selCategoria: "required",
				txtNombre: "required",
				txtClave: {
					required: true,
					remote: {
						url: server + "cproductos",
						type: "post",
						data: {
							action: "validaCodigo",
							id: function(){
								return $("#id").val();
							},
							empresa: usuario.getEmpresa()
						}
					}
				},
				txtNombre: "required",
				txtPrecio: {
					required: true,
					number: true
				},
				txtCosto: {
					required: true,
					number: true
				}
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			debug: true,
			messages: {
				selCategoria: "Este campo es necesario",
				txtNombre: "Este campo es necesario",
				txtClave: {
					required: "Este campo es necesario",
					remote: "La clave no puede ser usada por que está asignada a otro producto"
				},
				txtNombre: "Este campo es necesario",
				txtPrecio: {
					required: "Este campo es necesario",
					number: "Solo se aceptan números"
				},
				txtCosto: {
					required: "Este campo es necesario",
					number: "Solo se aceptan números"
				}
			},
			submitHandler: function(form){
				var obj = new TProducto;
				obj.add(
					$("#id").val(), 
					$("#selTipo").val(), 
					$("#selCategoria").val(),
					$("#txtClave").val(),
					$("#txtNombre").val(),
					$("#txtDescripcion").val(),
					$("#txtPrecio").val(),
					$("#txtCosto").val(),
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
	});
	
	function getLista(){
		$.get("vistas/productos/lista.html", function(html){
			$("#dvLista").html(html);
			var plantilla = $("#dvLista").find("table tbody tr");
			$("#dvLista").find("table tbody").html("");
			
			$.post(server + 'cproductos', {
					"empresa": usuario.getEmpresa(),
					"action": "lista"
				}, function(productos){
					$.each(productos, function(){
						var producto = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=clave]").html(producto.clave);
						pl.find("[campo=nombre]").html(producto.nombre);
						pl.find("[campo=categoria]").html(producto.categoria);
						pl.find("button[action=modificar]").attr("datos", JSON.stringify(producto)).click(function(){
							var el = jQuery.parseJSON($(this).attr("datos"));
					
							$("#id").val(el.idProducto);
							$("#selTipo").val(el.idTipo);
							$("#selCategoria").val(el.idCategoria);
							$("#txtNombre").val(el.nombre);
							$("#txtDescripcion").val(el.descripcion);
							$("#txtClave").val(el.clave);
							$("#txtPrecio").val(el.precio);
							$("#txtCosto").val(el.costo);
							
							
							$('.nav a[href="#add"]').tab('show');
						});
						
						pl.find("button[action=eliminar]").attr("producto", producto.idProducto).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TProducto;
								obj.del($(this).attr("producto"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar la producto");
										getLista();
									}
								});
							}
						});
						
						$("#dvLista table tbody").append(pl);
					});
					
					$("#tblProductos").DataTable({
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