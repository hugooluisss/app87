TUsuario = function(){
	var self = this;
	this.sesion = window.localStorage.getItem("sesion");
	
	this.add = function(id,	empresa, nombre, apellidos, email, perfil, fn){
		if (fn.before !== undefined) fn.before();
		
		$.post(server + 'cusuarios', {
				"action": "add",
				"id": id,
				"nombre": nombre,
				"apellidos": apellidos, 
				"email": email, 
				"perfil": perfil, 
				"empresa": empresa
			}, function(data){
				if (data.band == 'false')
					console.log(data.mensaje);
					
				if (fn.after !== undefined)
					fn.after(data);
			}, "json");
	};
	
	this.setPass = function(usuario, pass, fn){
		if (fn.before !== undefined)
			fn.before(data);
			
		$.post(server + 'cusuarios', {
			"action": "setPass",
			"usuario": usuario,
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
				
		$.post(server + 'index.php?mod=clogin&action=login', {
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
				obj.tipo = datos.tipo;
				obj.nombre = datos.nombre;
				obj.empresa = datos.empresa;
				
				window.localStorage.setItem("sesion", JSON.stringify(obj));
			}
			
			if (fn.after != undefined)
				fn.after(data);
		}, "json");
	}
	
	this.logout = function(fn){
		if (fn.before != undefined) fn.before();
		
		window.localStorage.clear();
		
		if (fn.after != undefined) fn.after();
	}
	
	this.isSesionIniciada = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return false;
		else{
			var data = JSON.parse(this.sesion);
			console.log(this.sesion);
			return data.tipo;
		}
	}
	
	this.getNombre = function(){
		var data = JSON.parse(this.sesion);
			
		return data.nombre;
	}
	
	this.getEmpresa = function(){
		var data = JSON.parse(this.sesion);
			
		return data.empresa;
	}
	
	this.getId = function(){
		if (this.sesion == '' || this.sesion == undefined)
			return '';
		var data = JSON.parse(this.sesion);
			
		return data.identificador;
	}
};