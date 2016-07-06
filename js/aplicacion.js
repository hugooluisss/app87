//var server = 'http://192.168.0.109/nutricion75/';
//var server = 'http://192.168.2.4/nutricion75/';
//var server = 'http://192.168.2.1/nutricion75/';
var server = 'http://localhost/nutricion75/';


function calcularEdad(fecha){
	// Si la fecha es correcta, calculamos la edad
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

	console.log(edad);
	return edad;
}