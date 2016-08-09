TMenu = function(){
	var self = this;
	
	this.getComidas = function(fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'listaComidas', {
				"movil": '1',
				"json": true
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	}
};