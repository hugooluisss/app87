TCategoria = function(){
	var self = this;
	
	this.add = function(id, nombre, descripcion, fn){
		if (fn.before !== undefined) fn.before();
		var objUsuario = new TUsuario;
		
		$.post(server + 'ccategorias', {
				"action": "guardar",
				"id": id,
				"nombre": nombre,
				"descripcion": descripcion,
				"empresa": objUsuario.getEmpresa()
			}, function(data) {
				if (data.band == 'false')
					console.log(data.mensaje == ''?"Upps. Ocurrió un error al agregar la categoria":data.mensaje);
				
				if (fn.after !== undefined) fn.after(data);
			}, "json"
		);
	};
	
	this.del = function(categoria, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'ccategorias', {
			"action": "del",
			"id": categoria,
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar la categoria");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
};