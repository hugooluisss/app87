TVenta = function(){
	var self = this;
	
	this.guardar = function(id, cliente, pagos, fecha, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cventas', {
				"action": "guardar",
				"id": id,
				"cliente": cliente,
				"pagos": pagos,
				"fecha": fecha,
				"usuario": usuario.getId()
			}, function(data) {
				if (data.band == 'false')
					console.log(data.mensaje == ''?"Upps. Ocurrió un error al agregar la venta":data.mensaje);
				
				if (fn.after !== undefined) fn.after(data);
			}, "json"
		);
	};
	
	this.addMovimiento = function(id, venta, clave, descripcion, cantidad, precio, descuento, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cventas', {
				"action": "addMovimiento",
				"id": id,
				"venta": venta,
				"clave": clave,
				"descripcion": descripcion,
				"cantidad": cantidad,
				"precio": precio,
				"descuento": descuento
			}, function(data) {
				if (data.band == 'false')
					console.log(data.mensaje == ''?"Upps. Ocurrió un error al agregar el movimiento a la venta":data.mensaje);
				
				if (fn.after !== undefined) fn.after(data);
			}, "json"
		);
	};
	
	this.changeEntregado = function(id, valor, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cventas', {
			"action": "setEntregado",
			"id": id,
			"estado": valor
		}, function(data){
			if (data.band == false)
				console.log("Ocurrió un error al actualizar el estado de la venta");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
	
	this.del = function(venta, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cventas', {
			"action": "del",
			"id": venta,
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar la venta");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
	
	this.delMovimiento = function(movimiento, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cventas', {
			"action": "delMovimiento",
			"id": movimiento,
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar el artículo");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
	
	this.getHistorial = function(inicio, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cventas', {
			"action": "historial",
			"inicio": inicio,
			"empresa": usuario.getEmpresa()
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrio un error al obtener el historial de ventas");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	}
};