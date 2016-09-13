TCliente = function(fn){
	var self = this;
	self.contFn = 0;
	//Lo primero que debo de hacer es ver si hay datos, si no los tengo hay que traer del server
	this.getDatos = function(soloServer){
		if (soloServer == undefined)
			soloServer = true;
			
		var cliente = window.localStorage.getItem("cliente");
		
		try{
			if (!soloServer)
				self.getDataServer();
			else{
				if (cliente == '' || cliente == undefined){
					var data = JSON.parse(cliente);
					
					if (data.idCliente == '' || data.idCliente == null || data.idCliente == undefined)
						self.getDataServer();
					else
						self.getDataApp();
				}else
					self.getDataApp();
			}
		}catch(err){
			self.getDataServer();
		}
	}
	
	this.getDataServer = function(){
		usuario = new TUsuario;
		if (usuario.getId() != ''){
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
				self.idFrecuencia = data.idFrecuencia;
				self.nombreFrecuencia = data.nombreFrecuencia;
				self.objetivo = data.objetivo;
				self.fecha = data.fecha;
				self.calorias = data.calorias;
				self.idActividad = data.idActividad;
				self.nombreActividad = data.nombreActividad;
				
				self.save();
				//window.localStorage.removeItem("cliente");
				//window.localStorage.setItem("cliente", JSON.stringify(data));
				console.log("SERVER ", data);
				
				if (fn !== undefined){
					if (fn.after !== undefined && self.contFn == 0){
						self.contFn++;
						fn.after();
					}
				}
			}, "json");
		}
	}
	
	this.getDataApp = function(){
		var cliente = window.localStorage.getItem("cliente");
		
		var data = JSON.parse(cliente);
		console.log("SISTEMA ", data);
		
		self.idCliente = data.idCliente;
		self.nombre = data.nombre;
		self.sexo = data.sexo;
		self.email = data.email;
		self.nacimiento = data.nacimiento;
		self.peso = data.peso;
		self.estatura = data.estatura;
		self.idFrecuencia = data.idFrecuencia;
		self.nombreFrecuencia = data.nombreFrecuencia;
		self.objetivo = data.objetivo;
		self.fecha = data.fecha;
		self.calorias = data.calorias;
		self.idActividad = data.idActividad;
		self.nombreActividad = data.nombreActividad;
		
		//window.localStorage.removeItem("cliente");
		
		if (fn !== undefined){
			if (fn.after !== undefined && self.contFn == 0){
				self.contFn++;
				fn.after();
			}
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
		obj.idFrecuencia = self.idFrecuencia;
		obj.nombreFrecuencia = self.nombreFrecuencia;
		obj.objetivo = self.objetivo;
		obj.calorias = self.calorias;
		obj.idActividad = self.idActividad;
		obj.nombreActividad = self.nombreActividad;
		
		window.localStorage.removeItem("cliente");
		window.localStorage.setItem("cliente", JSON.stringify(obj));
	}
	
	this.calcularEdad = function(server2){
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
			
			if (server2 === true){
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
	
	this.getHistorialPeso = function(fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"id": self.idCliente,
				"action": 'getPeso',
				"movil": '1'
			}, function(data){
				if (data.length > 0)
					console.log(data);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	}
};