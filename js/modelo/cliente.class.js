TCliente = function(){
	var self = this;
	//Lo primero que debo de hacer es ver si hay datos, si no los tengo que traer del server
	this.getDatos = function(){
		var cliente = window.localStorage.getItem("cliente");
		if (cliente == '' || cliente == undefined){
			usuario = new TUsuario;
			$.post(server + 'cclientes', {
				"id": usuario.getId(),
				"action": 'getData',
				"movil": '1'
			}, function(data){
					self.id = data.idCliente;
					self.nombre = data.nombre;
					self.sexo = data.sexo;
					self.email = data.email;
					self.nacimiento = data.nacimiento;
					self.peso = data.peso;
					self.altura = data.altura
					
					window.localStorage.setItem("cliente", JSON.stringify(data));
			}, "json");
		}else{
			var data = JSON.parse(cliente);
			
			self.id = data.id;
			self.nombre = data.nombre;
			self.sexo = data.sexo;
			self.email = data.email;
			self.nacimiento = data.nacimiento;
			self.peso = data.peso;
			self.altura = data.altura
		}
	}
	
	this.getDatos();
	
	this.calcularEdad = function(){
		if (self.nacimiento == '') return false;
		else{
			var fecha = self.nacimiento;
			var values=fecha.split("-");
			var dia = values[2];
			var mes = values[1];
			var ano = values[0];
			
			fecha_hoy = new Date();
			ahora_ano = fecha_hoy.getYear();
			ahora_mes = fecha_hoy.getMonth();
			ahora_dia = fecha_hoy.getDate();
			edad = (ahora_ano + 1900) - ano;
			if ( ahora_mes < (mes - 1))
				edad--;
		      
			if (((mes - 1) == ahora_mes) && (ahora_dia < dia))
				edad--;
				
			if (edad > 1900)
				edad -= 1900;
				
			return edad;
		}
	}
	
	this.calcularIMC = function(){
		var peso = this.peso;
		var altura = this.altura / 100;
		
		if (peso == '' || altura == '') return 0;
		else{
			var imc = peso / (altura * altura);
			return imc.toFixed(1); //D11
		}
	}
	
	this.calcularPGCE = function(){
		var imc = this.calcularIMC();
		var edad = this.calcularEdad(self.getFechaNacimiento()); //D7
		var iSexo = usuario.sexo == 'M'?0:1; //D8
		
		var PGCE = -44.988 + 0.503 * edad + 10.689 * iSexo + 3.172 * imc - 0.026 * imc * imc + 0.181 * imc * iSexo - 0.02 * imc * edad - 0.005 * imc * imc * iSexo + 0.00021 * imc * imc * edad;
		
		return Number(Math.round(PGCE + 'e1') + 'e-1');
	}
	
	this.recuperarPass = function(correo, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"correo": correo,
				"action": 'recuperarPass',
				"movil": '1'
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	}
	
	this.registrar = function(id, nombre, sexo, email, pass, suscripcion, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"id": id,
				"nombre": nombre,
				"sexo": sexo,
				"email": email,
				"pass": pass,
				"suscripcion": suscripcion,
				"action": 'add',
				"movil": '1'
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	};
};