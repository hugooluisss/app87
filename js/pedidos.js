function pedidos(){
	$.get("vistas/pedidos/panel.html", function(html){
		$("#modulo").html(html);
		var plantilla = $("#modulo").find("table tbody tr");
		$("#modulo").find("table tbody").html("");
		
		$.post(server + 'pedidos_json', {
				"empresa": usuario.getEmpresa(),
				"action": "lista"
			}, function(productos){
				$.each(productos, function(){
					var producto = this;
					var pl = plantilla.clone();
					
					pl.find("[campo=clave]").html(producto.clave);
					pl.find("[campo=descripcion]").html(producto.descripcion);
					pl.find("[campo=cantidad]").html(producto.cantidad);
					
					$("#modulo table tbody").append(pl);
				});
				
				$("#tblPedidos").DataTable({
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