function ventas(){
	$.get("vistas/ventas/panel.html", function(resp){
		$("#modulo").html(resp);
		
		getLista();
		
		$("#frmAdd #txtFecha").datepicker( "option", "dateFormat", "yyyy-mm-dd" );
		$("#frmAddPago #txtFecha").datepicker( "option", "dateFormat", "yyyy-mm-dd" );
		
		$('.nav a[href="#add"]').click(function(){
			$("#frmAdd")[0].reset();
			$("#frmAddProductos")[0].reset();
			$("#frmAdd #id").val("");
			var fecha = new Date;
			
			$("#frmAdd #txtFecha").val(fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDay());
			showDetalle();
		});
		
		$("#btnBuscarClientes").click(function(){
			$.get("vistas/ventas/listaClientes.html", function(plt){
				$("#winClientes .modal-body").html(plt);
				var plantilla = $("#winClientes .modal-body").find("table tbody tr");
				$("#winClientes .modal-body").find("table tbody").html("");
				
				$.post(server + 'cclientes', {
					"empresa": usuario.getEmpresa(),
					"action": "lista"
				}, function(clientes){
					$.each(clientes, function(){
						var cliente = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=nombre]").html(cliente.nombre);
						
						pl.find("button[action=seleccionar]").attr("datos", JSON.stringify(cliente)).click(function(){
							var el =  jQuery.parseJSON($(this).attr("datos"));
					
							$("#txtCliente").val(el.nombre);
							$("#txtCliente").attr("idCliente", el.idCliente);
							$("#winClientes").modal("hide");
						});
						
						$("#winClientes .modal-body table tbody").append(pl);
					});
					
					$("#tblClientes").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": true,
						"lengthChange": false,
						"ordering": true,
						"info": true,
						"autoWidth": true
					});
				}, "json");
			});
			
			$("#winClientes").modal();
		});
		
		
		$("#frmAdd").validate({
			debug: false,
			rules: {
				txtFecha: "required",
				txtCliente: "required"
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			submitHandler: function(form){
				var obj = new TVenta;
				obj.guardar(
					$("#id").val(), 
					$("#txtCliente").attr("idCliente"), 
					$("#selPagos").val(),
					$("#txtFecha").val(),
					{
						before: function(){
							$("#frmAdd").prop("disabled", true);
						},
						after: function(datos){
							$("#frmAdd").prop("disabled", false);
							
							if (datos.band){
								alert("Listo... puedes ingresar los artículos vendidos");
								$("#frmAdd #id").val(datos.id);
								showDetalle();
								getLista();
							}else{
								alert("Upps... " + datos.mensaje);
							}
						}
					}
				);
	        }
	
	    });
	    
	    function showDetalle(){
			if($("#frmAdd #id").val() == ''){
				$("#frmAddProductos").hide();
				$("#frmAddProductos").hide();
				$("#lstMovimiento").hide();
			}else{
				$("#frmAddProductos").show();
				$("#lstMovimiento").show();
				getListaMovimientos();
			}
		}
		
		function getListaMovimientos(){
			$.get("vistas/ventas/listaMovimientos.html", function(html){
				$("#lstMovimiento").html("");
				$("#lstMovimiento").html(html);
				var plantilla = $("#lstMovimiento").find("table tbody tr");
				$("#lstMovimiento").find("table tbody").html("");
				
				$.post(server + 'cventas', {
					"venta": $("#frmAdd #id").val(),
					"action": "movimientos"
				}, function(datos){
					$.each(datos.movimientos, function(){
						var movimiento = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=clave]").html(movimiento.clave);
						pl.find("[campo=descripcion]").html(movimiento.descripcion);
						pl.find("[campo=cantidad]").html(movimiento.cantidad);
						pl.find("[campo=precio]").html(movimiento.precio);
						
						pl.find("button[action=eliminar]").attr("movimiento", movimiento.idMovimiento).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TVenta;
								obj.delMovimiento($(this).attr("movimiento"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar el artículo");
										getListaMovimientos();
										getLista();
									}
								});
							}
						});
						
						$("#lstMovimiento table tbody").append(pl);
					});
					
					$("#lstMovimiento").find("[campo=total]").html(datos.total);
					
					$("#tblMovimientos").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": true,
						"lengthChange": false,
						"ordering": true,
						"info": true,
						"autoWidth": true
					});
					
					$(".alert [campo=saldoCliente]").html(datos.saldoCliente);
					
					if (datos.limiteCliente > 0){
						$(".alert:first").append(" y tiene un límite de crédito de $ " + datos.limiteCliente + ". ");
						
						if (datos.sobrepaso > 0)
							$(".alert:first").append($("<span />",{
								"class": "error",
								"html": "El cliente sobrepasó su límite por $ " + datos.sobrepaso
							}));
					}
				}, "json");
			});
		}
		
		function getLista(){
			$.get("vistas/ventas/lista.html", function(html){
				$("#dvLista").html("");
				$("#dvLista").html(html);
				var plantilla = $("#dvLista").find("table tbody tr");
				$("#dvLista").find("table tbody").html("");
				
				$.post(server + 'cventas', {
					"empresa": usuario.getEmpresa(),
					"action": "ventas"
				}, function(ventas){
					$.each(ventas, function(){
						var venta = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=nombre]").html(venta.nombre);
						pl.find("[campo=fecha]").html(venta.fecha);
						pl.find("[campo=monto]").html(venta.monto);
						pl.find("[campo=saldo]").html(venta.saldo);
						
						pl.find("button[action=modificar]").attr("datos", JSON.stringify(venta)).click(function(){
							var el = jQuery.parseJSON($(this).attr("datos"));
					
							$("#frmAdd #id").val(el.idVenta);
							$("#frmAdd #txtCliente").val(el.nombre);
							$("#frmAdd #txtCliente").attr("idCliente", el.idCliente);
							$("#frmAdd #selPagos").val(el.pagos);
							$("#frmAdd #txtFecha").val(el.fecha);
							
							showDetalle();
							
							$('.nav a[href="#add"]').tab('show');
						});
						
						
						pl.find("button[action=eliminar]").attr("venta", venta.idVenta).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TVenta ;
								obj.del($(this).attr("venta"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar la venta");
										getLista();
									}
								});
							}
						});
						
						pl.find("button[action=pagos]").attr("venta", venta.idVenta).click(function(){
							$("#winPagos").modal();
							$("#winPagos #venta").val($(this).attr("venta"));
							var fecha = new Date;
			
							$("#winPagos #txtFecha").val(fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDay());
							
							listaPagos($(this).attr("venta"));
						});
						
						pl.find(".entregados").val(venta.entregados).attr("venta", venta.idVenta);
						pl.find(".entregados").change(function(){
							var el = $(this);
							var venta = new TVenta;
							
							venta.changeEntregado(el.attr("venta"), el.val(), {
								before: function(){
									el.prop("disabled", true);
								},
								after: function(resp){
									el.prop("disabled", false);
									
									if (resp.band == "false")
										alert("No se pudo actualizar el estado del pedido");
								}
							});
						});
						
						$("#dvLista table tbody").append(pl);
					});

					$("#tblVentas").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": true,
						"lengthChange": false,
						"ordering": true,
						"info": true,
						"autoWidth": true,
						"order": [[ 0, "desc" ]]
					});
				}, "json");
			});
		}
		
		$("#frmAddProductos").validate({
			debug: false,
			rules: {
				txtDescripcion: "required",
				txtCantidad: {
					required: true,
					digits: true,
					min: 1
				},
				txtPrecio: {
					required: true,
					number: true,
					min: 1
				}
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			submitHandler: function(form){
				var obj = new TVenta;
				obj.addMovimiento(
					"",
					$("#id").val(), 
					$("#txtClave").val(), 
					$("#txtDescripcion").val(),
					$("#txtCantidad").val(),
					$("#txtPrecio").val(),
					$("#txtDescuento").val(),
					{
						before: function(){
							$("#frmAddProductos").prop("disabled", true);
						},
						after: function(datos){
							$("#frmAddProductos").prop("disabled", false);
							
							if (datos.band){
								getListaMovimientos();
								getLista();
								$("#frmAddProductos")[0].reset();
							}else{
								alert("Upps... " + datos.mensaje);
							}
						}
					}
				);
	        }
	
	    });
	    
	    $("#btnBuscarProductos").click(function(){
			$("#winProductos").modal();
			
			$.get("vistas/ventas/listaProductos.html", function(html){
				$("#winProductos .modal-body").html(html);
				var plantilla = $("#winProductos .modal-body").find("table tbody tr");
				$("#winProductos .modal-body").find("table tbody").html("");
				
				$.post(server + 'cproductos', {
					"empresa": usuario.getEmpresa(),
					"action": "lista"
				}, function(productos){
					$.each(productos, function(){
						var producto = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=nombre]").html(producto.nombre);
						pl.find("[campo=precio]").html(producto.precio);
						
						pl.find("button[action=seleccionar]").attr("producto", JSON.stringify(producto)).click(function(){
							var el =  jQuery.parseJSON($(this).attr("producto"));
					
							$("#frmAddProductos #txtClave").val(el.clave);
							$("#frmAddProductos #txtDescripcion").val(el.nombre);
							$("#frmAddProductos #txtPrecio").val(el.precio);
							$("#frmAddProductos #txtCantidad").val(1);
							$("#winProductos").modal("hide");
							
							$("#frmAddProductos #txtPrecio").focus();
						});
						
						$("#winProductos .modal-body table tbody").append(pl);
					});
					
					$("#tblProductos").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": true,
						"lengthChange": false,
						"ordering": true,
						"info": true,
						"autoWidth": true
					});
				}, "json");
			});
		});
		
		function listaPagos(venta){
		    $.get("vistas/ventas/listaPagos.html", function(html){
		    	$("#winPagos .modal-body #lista").html(html);
				var plantilla = $("#winPagos .modal-body #lista").find("table tbody tr");
				$("#winPagos .modal-body #lista").find("table tbody").html("");
		    	//{"venta": venta}
		    	
		    	$.post(server + 'cpagos', {
					"venta": venta,
					"action": "pagos"
				}, function(datos){
					$.each(datos.pagos, function(){
						var pago = this;
						var pl = plantilla.clone();
						
						pl.find("[campo=fecha]").html(pago.fecha);
						pl.find("[campo=monto]").html(pago.monto);
						pl.find("[campo=saldo]").html(pago.saldo);
						
						pl.find("button[action=eliminarPago]").attr("pago", pago.idPago).click(function(){
							if(confirm("¿Seguro?")){
								var obj = new TPago;
								obj.del($(this).attr("pago"), {
									after: function(data){
										if (data.band == false)
											alert("Ocurrió un error al eliminar el pago");
										else{
											listaPagos(venta);
											getLista();
										}
									}
								});
							}
						});
						
						pl.find("button[action=enviarComprobante]").attr("pago", pago.idPago).click(function(){
							pago = new TPago;
							var el = $(this);
							
							pago.sendComprobante(el.attr("pago"), {
								before: function(){
									el.prop("disabled", true);
								}, after: function(resp){
									el.prop("disabled", false);
									
									if (resp.band == true)
										alert("El comprobante se envió con éxito");
									else
										alert("Ocurrió un error al enviar el comprobante");
								}
							});
						});
						
						$("#winPagos .modal-body #lista table tbody").append(pl);
					});
					
					$("#tblPagos").DataTable({
						"responsive": true,
						"language": espaniol,
						"paging": false,
						"lengthChange": false,
						"ordering": false,
						"info": true,
						"autoWidth": true
					});
					
					$("#saldo").val(datos.saldo);
					$("#txtMonto").val(datos.saldo);
					
				}, "json");
			});
		}
		
		$("#frmAddPago").validate({
			debug: false,
			rules: {
				txtFecha: "required",
				txtMonto: {
					required: true,
					number: true,
					min: 1,
					max: function(){
						return $("#saldo").val()
					}
				}
			},
			messages: {
				txtMonto: {
					max: "El pago no puede ser mayor que el monto del saldo"
				}
			},
			errorElement : 'span',
			errorLabelContainer: '.errorTxt',
			submitHandler: function(form){
				var obj = new TPago;
				obj.add(
					$("#frmAddPago #id").val(), 
					$("#frmAddPago #venta").val(), 
					$("#frmAddPago #txtFecha").val(),
					$("#frmAddPago #txtMonto").val(),
					{
						before: function(){
							$("#frmAddPago").prop("disabled", true);
						},
						after: function(datos){
							$("#frmAddPago").prop("disabled", false);
							
							if (datos.band){
								listaPagos($("#frmAddPago #venta").val());
								getLista();
								$("#frmAddPago")[0].reset();
								var fecha = new Date;
			
								$("#winPagos #txtFecha").val(fecha.getFullYear() + '-' + (fecha.getMonth()+1) + '-' + fecha.getDay());
							}else{
								alert("Upps... " + datos.mensaje);
							}
						}
					}
				);
	        }
	
	    });
	});
}