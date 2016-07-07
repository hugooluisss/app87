TMomento = function(){
	var self = this;
	
	this.add = function(id, cliente, altura, peso, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"id": id,
				"cliente": cliente,
				"altura": altura,
				"peso": peso,
				"action": 'addMomento',
				"movil": '1'
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	};
};