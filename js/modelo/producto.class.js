TProducto = function(){
	var self = this;
	
	this.add = function(id, tipo, categoria, clave, nombre, descripcion, precio, costo, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cproductos', {
				"action": "guardar",
				"id": id,
				"tipo": tipo,
				"categoria": categoria,
				"clave": clave,
				"nombre": nombre,
				"descripcion": descripcion,
				"precio": precio,
				"costo": costo,
				"empresa": usuario.getEmpresa()
			}, function(data) {
				if (data.band == 'false')
					console.log(data.mensaje == ''?"Upps. Ocurrió un error al agregar el producto ":data.mensaje);
				
				if (fn.after !== undefined) fn.after(data);
			}, "json"
		);
	};
	
	this.del = function(producto, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cproductos', {
			"action": "del",
			"id": producto
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar el producto");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
};