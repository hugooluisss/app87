TMenu = function(){
	var self = this;
	this.cliente = new TCliente;
	
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
	
	this.getAlimentos = function(comida, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'listaAlimentosMenu', {
				"movil": '1',
				"comida": comida,
				"cliente": self.cliente.idCliente,
				"json": true
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	}
	
	this.setAlimentosPlantilla = function(comida, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cmenus', {
				"movil": '1',
				"comida": comida,
				"action": "setPlantilla",
				"cliente": self.cliente.idCliente
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");

	}
	
	this.addAlimento = function(comida, alimento, cantidad, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cmenus', {
				"movil": '1',
				"comida": comida,
				"alimento": alimento,
				"cantidad": cantidad,
				"action": "addAlimento",
				"cliente": self.cliente.idCliente
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	}
	
	this.delAlimento = function(comida, alimento, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cmenus', {
				"movil": '1',
				"comida": comida,
				"alimento": alimento,
				"action": "delAlimento",
				"cliente": self.cliente.idCliente
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	}
};