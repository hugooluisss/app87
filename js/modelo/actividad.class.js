TActividad = function(id){
	var self = this;
	
	this.getData = function(fn){
		if (fn.before !== undefined) fn.before();
		
		self.grasas = 0;
		self.carbohidratos = 0;
		self.proteinas = 0;
		
		if (!(id === undefined || id == '')){
			$.post(server + "cactividades", {
				"id": id,
				"action": "getData",
				"movil": '1'
			}, function(resp){
				self.grasas = resp.grasas;
				self.carbohidratos = resp.carbohidratos;
				self.proteinas = resp.proteinas;
				
				if (fn.after !== undefined)
					fn.after(resp);
			}, "json");
		}
	}
	
	this.getProteinas = function(){
		return this.proteinas;
	}
	
	this.getCarbohidratos = function(){
		return this.carbohidratos;
	}
	
	this.getGrasas = function(){
		return this.grasas;
	}
}