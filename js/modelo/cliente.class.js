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
					self.idCliente = data.idCliente;
					self.nombre = data.nombre;
					self.sexo = data.sexo;
					self.email = data.email;
					self.nacimiento = data.nacimiento;
					self.peso = data.peso;
					self.estatura = data.estatura;
					self.idActividad = data.idActividad;
					self.nombreActividad = data.nombreActividad;
					
					window.localStorage.removeItem("cliente");
					window.localStorage.setItem("cliente", JSON.stringify(data));
					console.log("SERVER ", data);
			}, "json");
		}else{
			var data = JSON.parse(cliente);
			console.log("SISTEMA ", data);
			
			self.idCliente = data.idCliente;
			self.nombre = data.nombre;
			self.sexo = data.sexo;
			self.email = data.email;
			self.nacimiento = data.nacimiento;
			self.peso = data.peso;
			self.estatura = data.estatura;
			self.idActividad = data.idActividad;
			self.nombreActividad = data.nombreActividad;
			
			//window.localStorage.removeItem("cliente");
		}
	}
	
	this.getDatos();
	
	this.save = function(){
		var obj = new Object;
		
		obj.idCliente = self.idCliente;
		obj.nombre = self.nombre;
		obj.sexo = self.sexo;
		obj.email = self.email;
		obj.nacimiento = self.nacimiento;
		obj.peso = self.peso;
		obj.estatura = self.estatura;
		obj.idActividad = self.idActividad;
		obj.nombreActividad = self.nombreActividad;
		
		window.localStorage.removeItem("cliente");
		window.localStorage.setItem("cliente", JSON.stringify(obj));
	}
	
	this.calcularEdad = function(server){
		if (self.nacimiento == '' || self.nacimiento == undefined) return 0;
		else{
			var fecha = self.nacimiento;
			var values = fecha.split("-");
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
			
			if (server === true){
				$.post(server + 'cclientes', {
					"nacimiento": self.nacimiento,
					"cliente": self.idCliente,
					"action": 'actualizarNacimiento',
					"movil": '1'
				}, function(data){
					if (data.band == 'false')
						console.log(data.mensaje);
					else
						self.save();
				}, "json");
			}
				
			return edad;
		}
	}
	
	this.calcularIMC = function(){
		var peso = this.peso;
		var altura = this.estatura / 100;
		console.log(peso + " " + altura + " " + this.estatura);
		if (peso == '' || altura == '')
			return 0;
		else{
			var imc = peso / (altura * altura);
			return imc.toFixed(1); //D11
		}
	}
	
	this.calcularPGCE = function(){
		var imc = this.calcularIMC();
		var edad = this.calcularEdad(self.nacimiento); //D7
		var iSexo = self.sexo == 'M'?0:1; //D8
		console.log(iSexo + ' ' + edad);
		var PGCE = -44.988 + 0.503 * edad + 10.689 * iSexo + 3.172 * imc - 0.026 * imc * imc + 0.181 * imc * iSexo - 0.02 * imc * edad - 0.005 * imc * imc * iSexo + 0.00021 * imc * imc * edad;
		
		return Number(Math.round(PGCE + 'e1') + 'e-1');
	}
	
	this.calcularBMR = function(){ //metabolismo basal
		if (self.sexo == 'H')
			return 1 * self.peso * 24;
		else
			return 0.9 * self.peso * 24;
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
	
	this.registrar = function(id, nombre, sexo, email, pass, nacimiento, suscripcion, idActividad, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"id": id,
				"nombre": nombre,
				"sexo": sexo,
				"email": email,
				"pass": pass,
				"suscripcion": suscripcion,
				"nacimiento": nacimiento,
				"actividad": idActividad,
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