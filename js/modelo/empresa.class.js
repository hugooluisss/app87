TEmpresa = function(){
	var self = this;
	
	this.guardar = function(id,	razonSocial, direccion, url, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cempresa', {
				"action": "guardar",
				"id": id,
				"razonsocial": razonSocial,
				"direccion": direccion, 
				"url": url
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	};
	
	this.del = function(empresa, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cempresa', {
			"action": "del",
			"id": empresa,
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar la empresa");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
	
	this.getData = function(empresa, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cempresa', {
			"id": empresa,
			"action": "getDatos"
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al obtener los datos de la empresa");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};

};