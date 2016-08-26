TUsuario = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.add = function(id, nombre, sexo, email, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cclientes', {
				"action": "save",
				"id": id,
				"nombre": nombre,
				"sexo": sexo,
				"email": email,
				"movil": '1'
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	};
	
	this.setPass = function(usuario, pass, fn){
		if (fn.before !== undefined)
			fn.before();
			
		$.post(server + 'cclientes', {
			"action": "setPass",
			"usuario": usuario,
			"movil": '1',
			"pass": pass
		}, function(data){
			if (fn.after !== undefined)
				fn.after(data);
				
			if (data.band == 'false')
				console.log("Ocurrió un error al actualizar la contraseña del usuario");
			
		}, "json");
	};
	
	this.del = function(usuario, fn){
		$.post(server + 'cusuarios', {
			"action": "del",
			"usuario": usuario,
		}, function(data){
			if (fn.after != undefined)
				fn.after(data);
			if (data.band == 'false'){
				alert("Ocurrió un error al eliminar al usuario");
			}
		}, "json");
	};
	
	this.login = function(usuario, pass, fn){
		if (fn.before != undefined)
			fn.before();
				
		$.post(server + 'clogin', {
			"action": "login",
			"usuario": usuario,
			"pass": pass,
			"movil": 1
		}, function(data){
			if (data.band == false){
				console.log("Los datos del usuario no son válidos");
			}else{
				var datos = data.datos;
				var obj = new Object;
				obj.identificador = datos.identificador;
				obj.usuario = usuario;
				obj.nombre = datos.nombre;
				obj.sexo = datos.sexo;
				
				window.localStorage.setItem("sesion", JSON.stringify(obj));
			}
			
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.logout = function(fn){
		if (fn.before != undefined) fn.before();
		
		window.localStorage.clear();
		console.log("Sesión borrada");
		
		if (fn.after != undefined) fn.after();
	}
	
	this.isSesionIniciada = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return false;
		else{
			var data = JSON.parse(this.sesion);
			return data.identificador;
		}
	}
	
	this.getNombre = function(){
		var data = JSON.parse(this.sesion);
			
		return data.nombre;
	}
	
	this.getSexo = function(){
		var data = JSON.parse(this.sesion);
			
		return data.sexo;
	}
	
	this.getId = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return '';
		var data = JSON.parse(this.sesion);
			
		return data.identificador;
	}
};