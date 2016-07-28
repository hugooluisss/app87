TMomento = function(){
	var self = this;
	
	this.add = function(cliente, altura, peso, actividad, objetivo, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"cliente": cliente,
				"altura": altura,
				"peso": peso,
				"actividad": actividad,
				"objetivo": objetivo,
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