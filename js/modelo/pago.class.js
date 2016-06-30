TPago = function(){
	var self = this;
	
	this.add = function(id, venta, fecha, monto, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cpagos', {
				"action": "guardar",
				"id": id,
				"venta": venta,
				"fecha": fecha,
				"monto": monto
			}, function(data) {
				if (data.band == 'false')
					console.log(data.mensaje == ''?"Upps. Ocurrió un error al agregar el pago":data.mensaje);
				
				if (fn.after !== undefined) fn.after(data);
			}, "json"
		);
	};
	
	this.del = function(pago, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cpagos', {
			"action": "del",
			"id": pago,
		}, function(data){
			if (data.band == 'false')
				console.log("Ocurrió un error al eliminar el pago");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	};
	
	this.sendComprobante = function(id, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cpagos', {
			"action": "sendComprobante",
			"id": id,
			"usuario": usuario.getId()
		}, function(data){
			if (data.band == false)
				console.log("Ocurrió un error al enviar el comprobante de pago");
			
			if (fn.after !== undefined) fn.after(data);
		}, "json");
	}
};