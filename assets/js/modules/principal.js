$(function() {
    fTiempos = {
        init: function() {
            fTiempos.events();
            fTiempos.listOutTime();
            fTiempos.individualColumnSearching();

        },

        //Eventos de la ventana.
        events: function() {
            $('#tablaFueraTiempos').on('click', 'a.ver-det', fTiempos.onClickShowModalDet);
            $('#tablaDetalleResOutTimes').on('click', 'a.ver-det', fTiempos.onClickShowModalDet);

            // EVENTO DEL MENU STICKY
            $('#btn_fixed').on('click', function() {
                $(this).hide();
                $('#content_fixed').removeClass('closed');
                $('#content_fixed #menu_fixed').removeClass('hidden').hide().fadeIn(500);
            });
            $('#btn_close_fixed').on('click', function() {
                $('#content_fixed').addClass('closed');
                $('#content_fixed #menu_fixed').hide();
                $('#btn_fixed').fadeIn(500);
            });
        },
        listOutTime: function() {
            $.post(baseurl + '/OtHija/c_getOtsOutTime',
                    {
                        idTipo: null // parametros que se envian
                    },
                    function(data) {
                        fTiempos.printTableOutTime(data);
                    });

        },
        printTableOutTime: function(data) {
            ///lleno la tabla con los valores enviados
            fTiempos.tablaFueraTiempos = $('#tablaFueraTiempos').DataTable(fTiempos.configTable(data, [
                {title: "OT Padre", data: "nro_ot_onyx"},
                {title: "Id Orden Trabajo Hija", data: "id_orden_trabajo_hija"},
                {title: "Nombre Cliente", data: "nombre_cliente"},
                {title: "Ot Hija", data: "n_name_tipo"},
                {title: "Estado Orden Trabajo Hija", data: "estado_orden_trabajo_hija"},
                {title: "Ingeniero Responsable", data: "ingeniero"},
                {title: "Fecha Creación", data: "fecha_creacion"},
                {title: "Recurrente", data: "MRC"},
                {title: "Días vencida", data: "tiempo_vencidas"},
                {title: "opc", data: fTiempos.getButtons},
            ]));
        },
        // Datos de configuracion del datatable
        configTable: function(data, columns, onDraw) {
            return {
                initComplete: function() {
                    var r = $('#tablaFueraTiempos tfoot tr');
                    r.find('th').each(function() {
                        $(this).css('padding', 8);
                    });
                    $('#tablaFueraTiempos thead').append(r);
                    $('#search_0').css('text-align', 'center');

                    // DataTable
                    var table = $('#tablaFueraTiempos').DataTable();

                    // Apply the search
                    table.columns().every(function() {
                        var that = this;

                        $('input', this.footer()).on('keyup change', function() {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                    });
                },
                data: data,
                columns: columns,
                "language": {
                    "url": baseurl + "/assets/plugins/datatables/lang/es.json"
                },
                dom: 'Blfrtip',
                buttons: [
                    {
                        text: 'Excel <span class="fa fa-file-excel-o"></span>',
                        className: 'btn-cami_cool',
                        extend: 'excel',
                        title: 'ZOLID EXCEL',
                        filename: 'zolid ' + fecha_actual,

                        /*exportOptions: {
                         columns: ':visible',
                         //columns: [ 0, 1, 2, 5 ], // selecciona las columnas que desea exportar
                         // modifier: { // cUANDO NO SE DESEA registros SELECTIVO
                         //     selected: null
                         // }
                         }*/

                    },
                    {
                        text: 'Imprimir <span class="fa fa-print"></span>',
                        className: 'btn-cami_cool',
                        extend: 'print',
                        title: 'Reporte Zolid',
                    },
                            /*AÑADE BOTON PARA MOSTRAR U OCULTAR COLUMNAS*/
                            // {
                            //     extend: 'collection',
                            //     text: 'Table control',
                            //     buttons: [
                            //         {
                            //             text: 'Toggle start date',
                            //             action: function ( e, dt, node, config ) {
                            //                 dt.column( -2 ).visible( ! dt.column( -2 ).visible() );
                            //             }
                            //         },
                            //         {
                            //             text: 'Toggle salary',
                            //             action: function ( e, dt, node, config ) {
                            //                 dt.column( -1 ).visible( ! dt.column( -1 ).visible() );
                            //             }
                            //         },
                            //         'colvis'
                            //     ]
                            // }
                            // 'colvis' // ocultar y mostrar columnas
                ],
                select: true,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ordering: true,
                columnDefs: [{
                        // targets: -1,
                        // visible: false,
                        defaultContent: "",
                        // targets: -1,
                        orderable: false,
                    }],
                order: [[7, 'desc']],
                drawCallback: onDraw
            }
        },
        getButtons: function(obj) {
            boton = '<div class="btn-group">'
                    + '<a class="btn btn-default btn-xs ver-det btn_datatable_cami" title="Editar Ots"><span class="fa fa-fw fa-eye"></span></a>'
                    + '</div>';
            return boton;
        },
        onClickShowModalDet: function() {
            document.getElementById("formModal_detalle").reset();
            $('#title_modal').html('');
            var aLinkLog = $(this);
            var trParent = aLinkLog.parents('tr');
            var record = fTiempos.tablaFueraTiempos.row(trParent).data();
            fTiempos.fillFormModal(record);
        },
        fillFormModal: function(registros) {
            $.post(baseurl + '/OtHija/c_fillmodals',
                    {
                        idOth: registros.id_orden_trabajo_hija // parametros que se envian
                    },
                    function(data) {
                        $.each(data, function(i, item) {
                            $('#mdl_' + i).val(item);
                        });
                    });
            $('#title_modal').html('<b>Detalle de la orden  ' + registros.id_orden_trabajo_hija + '</b>');
            $('#Modal_detalle').modal('show');
        },
        individualColumnSearching: function() {
            $('#tablaFueraTiempos tfoot th').each(function() {
                $(this).html('<input type="text" placeholder="Buscar" />');
            });
        }
    };
    fTiempos.init();

    /************************************************FIN HOY************************************************/
    /**********************************************INICIO NUEVAS*********************************************/
    eTiempos = {
        init: function() {
            eTiempos.events();
            eTiempos.listInTimes();
            eTiempos.individualColumnSearching();
        },

        //Eventos de la ventana.
        events: function() {
            $('#tablaEnTiempos').on('click', 'a.ver-det', eTiempos.onClickShowModalDet);
            $('#tablaDetalleResInTimes').on('click', 'a.ver-det', eTiempos.onClickShowModalDet);
        },
        listInTimes: function() {
            $.post(baseurl + '/OtHija/c_getOtsInTimes',
                    {
                        // clave: 'valor' // parametros que se envian
                    },
                    function(data) {
                        eTiempos.printTableInTimes(data);
                    });
        },
        printTableInTimes: function(data) {
            ///lleno la tabla con los valores enviados
            eTiempos.tablaEnTiempos = $('#tablaEnTiempos').DataTable(eTiempos.configTable(data, [
                {title: "OT Padre", data: "nro_ot_onyx"},
                {title: "Id Orden Trabajo Hija", data: "id_orden_trabajo_hija"},
                {title: "Nombre Cliente", data: "nombre_cliente"},
                {title: "Ot Hija", data: "n_name_tipo"},
                {title: "Estado Orden Trabajo Hija", data: "estado_orden_trabajo_hija"},
                {title: "Ingeniero Responsable", data: "ingeniero"},
                {title: "Fecha Creación", data: "fecha_creacion"},
                {title: "Recurrente", data: "MRC"},
                {title: "Días max Entrega", data: eTiempos.getAlertIcon},
                {title: "opc", data: eTiempos.getButtons},
            ]));
        },
        // Datos de configuracion del datatable
        configTable: function(data, columns, onDraw) {
            return {
                initComplete: function() {
                    var r = $('#tablaEnTiempos tfoot tr');
                    r.find('th').each(function() {
                        $(this).css('padding', 8);
                    });
                    $('#tablaEnTiempos thead').append(r);
                    $('#search_0').css('text-align', 'center');

                    // DataTable
                    var table = $('#tablaEnTiempos').DataTable();

                    // Apply the search
                    table.columns().every(function() {
                        var that = this;

                        $('input', this.footer()).on('keyup change', function() {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                    });
                },
                data: data,
                columns: columns,
                "language": {
                    "url": baseurl + "/assets/plugins/datatables/lang/es.json"
                },
                dom: 'Blfrtip',
                buttons: [
                    {
                        text: 'Excel <span class="fa fa-file-excel-o"></span>',
                        className: 'btn-cami_cool',
                        extend: 'excel',
                        title: 'ZOLID EXCEL',
                        filename: 'zolid ' + fecha_actual
                    },
                    {
                        text: 'Imprimir <span class="fa fa-print"></span>',
                        className: 'btn-cami_cool',
                        extend: 'print',
                        title: 'Reporte Zolid',
                    }
                ],
                select: true,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ordering: true,
                columnDefs: [{
                        // targets: -1,
                        // visible: false,
                        defaultContent: "",
                        // targets: -1,
                        orderable: false,
                    }],
                order: [[7, 'desc']],
                drawCallback: onDraw
            }
        },
//                 "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
//                 ordering:false,
//                 columnDefs: [{
        getButtons: function(obj) {
            boton = '<div class="btn-group">'
                    + '<a class="btn btn-default btn-xs ver-det btn_datatable_cami" title="Editar Ots"><span class="fa fa-fw fa-eye"></span></a>'
                    + '</div>';
            return boton;
        },
        getAlertIcon: function(obj) {
            color = 'FFFFFF';
            if (obj.tiempo_vencer == -1 || obj.tiempo_vencer == 0) {
                color = 'FFA500';
                obj.tiempo_vencer = (obj.tiempo_vencer == 0) ? 'Hoy' : 'Mañana ';
            } else if (obj.tiempo_vencer == -2) {
                color = 'FFFF00';
            } else if (obj.tiempo_vencer < -2) {
                color = '7CFC00';
            } else if (obj.tiempo_vencer == 'en tiempos') {
                color = '7CFC00';
            }
            boton = '<form class="form-inline">'
                    + '<div class="btn-group col col-md-6">'
                    + obj.tiempo_vencer
                    + '</div>'
                    + '<div class="btn-group col col-md-6">'
                    + '<div class="circulo-p" style="background: #' + color + ';"></div>'
                    + '</div>'
                    + '</form>';
            return boton;
        },
        onClickShowModalDet: function() {
            document.getElementById("formModal_detalle").reset();
            // imprimir el titulo
            $('#title_modal').html('');
            var aLinkLog = $(this);
            var trParent = aLinkLog.parents('tr');
            var record = eTiempos.tablaEnTiempos.row(trParent).data();
            fTiempos.fillFormModal(record);
        },

        fillFormModal: function(registros) {
            $.each(registros, function(i, item) {
                $('#mdl_' + i).val(item);
            });
            $('#title_modal').html('<b>Detalle de la orden  ' + registros.id_orden_trabajo_hija + '</b>');
            $('#Modal_detalle').modal('show');
        },
        individualColumnSearching: function() {
            $('#tablaEnTiempos tfoot th').each(function() {
                $(this).html('<input type="text" placeholder="Buscar" />');
            });
        }
    };
    eTiempos.init();

    /************************************************FIN NUEVAS************************************************/
    /**********************************************INICIO TODO*********************************************/

    todo = {
        init: function() {
            todo.events();
            todo.getListTotal();
            todo.individualColumnSearching();
        },

        //Eventos de la ventana.
        events: function() {
            $('#tablaTodo').on('click', 'a.ver-det', todo.onClickShowModalDet);
        },
        getListTotal: function() {
            $.post(baseurl + '/OtHija/c_getAllOtsInExecution',
                    {
                        // clave: 'valor' // parametros que se envian
                    },
                    function(data) {
                        todo.printTableTotal(data);
                    });
        },
        printTableTotal: function(data) {
            ///lleno la tabla con los valores enviados
            todo.tableTotal = $('#tablaTodo').DataTable(todo.configTable(data, [
                {title: "OT Padre", data: "nro_ot_onyx"},
                {title: "Id Orden Trabajo Hija", data: "id_orden_trabajo_hija"},
                {title: "Nombre Cliente", data: "nombre_cliente"},
                {title: "Fecha Compromiso", data: "fecha_compromiso"},
                {title: "Fecha Programación", data: "fecha_programacion"},
                {title: "Ot Hija", data: "ot_hija"},
                {title: "Estado Orden Trabajo Hija", data: "estado_orden_trabajo_hija"},
                {title: "Ingeniero Responsable", data: "ingeniero"},
                {title: "Recurrente", data: "MRC"},
                {title: "opc", data: todo.getButtons},
            ]));
        },
        configTable: function(data, columns, onDraw) {
            return {
                initComplete: function() {
                    var r = $('#tablaTodo tfoot tr');
                    r.find('th').each(function() {
                        $(this).css('padding', 8);
                    });
                    $('#tablaTodo thead').append(r);
                    $('#search_0').css('text-align', 'center');

                    // DataTable
                    var table = $('#tablaTodo').DataTable();

                    // Apply the search
                    table.columns().every(function() {
                        var that = this;

                        $('input', this.footer()).on('keyup change', function() {
                            if (that.search() !== this.value) {
                                that.search(this.value).draw();
                            }
                        });
                    });
                },
                data: data,
                columns: columns,
                "language": {
                    "url": baseurl + "/assets/plugins/datatables/lang/es.json"
                },
                dom: 'Blfrtip',
                buttons: [
                    {
                        text: 'Excel <span class="fa fa-file-excel-o"></span>',
                        className: 'btn-cami_cool',
                        extend: 'excel',
                        title: 'ZOLID EXCEL',
                        filename: 'zolid ' + fecha_actual
                    },
                    {
                        text: 'Imprimir <span class="fa fa-print"></span>',
                        className: 'btn-cami_cool',
                        extend: 'print',
                        title: 'Reporte Zolid',
                    }
                ],
                select: true,
                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
                ordering: false,
                columnDefs: [{
                        // targets: -1,
                        // visible: false,
                        defaultContent: "",
                        // targets: -1,
                        orderable: false,
                    }],
                order: [[7, 'desc']],
                drawCallback: onDraw
            }
        },
//        getListTotal: function () {
//            todo.tableTotal = $('#tablaTodo').DataTable(todo.genericCogDataTable("/OtHija/getListTotalOts", "tablaTodo"));
//        },
//        genericCogDataTable: function (url, table) {
//            return {
//                columns: [
//                    {title: "OT Padre", data: "nro_ot_onyx"},
//                    {title: "Id Orden Trabajo Hija", data: "id_orden_trabajo_hija"},
//                    {title: "Nombre Cliente", data: "nombre_cliente"},
//                    {title: "Fecha Compromiso", data: "fecha_compromiso"},
//                    {title: "Fecha Programación", data: "fecha_programacion"},
//                    {title: "Ot Hija", data: "ot_hija"},
//                    {title: "Estado Orden Trabajo Hija", data: "estado_orden_trabajo_hija"},
//                    {title: "Ingeniero Responsable", data: "ingeniero"},
//                    {title: "Recurrente", data: "MRC"},
//                    {title: "opc", data: todo.getButtons},
//                ],
//                initComplete: function () {
//                    var r = $('#tablaTodo tfoot tr');
//                    r.find('th').each(function () {
//                        $(this).css('padding', 8);
//                    });
//                    $('#tablaTodo thead').append(r);
//                    $('#search_0').css('text-align', 'center');
//
//                    // DataTable
//                    var table = $('#tablaTodo').DataTable();
//
//                    // Apply the search
//                    table.columns().every(function () {
//                        var that = this;
//
//                        $('input', this.footer()).on('keyup change', function () {
//                            if (that.search() !== this.value) {
//                                that.search(this.value).draw();
//                            }
//                        });
//                    });
//                },
//                "language": {
//                    "url": baseurl + "/assets/plugins/datatables/lang/es.json"
//                },
//                dom: 'Blfrtip',
//                buttons: [
//                    {
//                        text: 'Excel <span class="fa fa-file-excel-o"></span>',
//                        className: 'btn-cami_cool',
//                        extend: 'excel',
//                        title: 'ZOLID EXCEL',
//                        filename: 'zolid ' + fecha_actual
//                    },
//                    {
//                        text: 'Imprimir <span class="fa fa-print"></span>',
//                        className: 'btn-cami_cool',
//                        extend: 'print',
//                        title: 'Reporte Zolid',
//                    }
//                ],
//                select: true,
//                "lengthMenu": [[10, 25, 50, -1], [10, 25, 50, "All"]],
//
//                columnDefs: [{
//                        // targets: -1,
//                        // visible: false,
//                        defaultContent: "",
//                        //targets: 1, / pARA EL ORDENAMIENTO POR COLUMNAS SI SE DEJA EN 0 NO SE PODRIA ORDENAR POR LA PRIMERA COLUMNA /
//                        orderable: false,
//                    }],
//                // order: [[8, 'desc']], //ardenaniento
//                ordering: false,
//                "bProcessing": true, /*IMPORTANTES PARA TRABAJAR SERVER SIDE PROSSESING*/
//                "serverSide": true, /*IMPORTANTES PARA TRABAJAR SERVER SIDE PROSSESING*/
//
//
//                drawCallback: function (data) {
//                    if ($('#bdg_total').html() == "...") {
//                        $('#bdg_total').html(data.json.recordsFiltered);
//                    }
//
//                },
//                "ajax": {
//                    url: baseurl + '/' + url, // json datasource
//                    type: "POST", // type of method  , by default would be get
//                    error: function () {  // error handling code
//                        $("#employee_grid_processing").css("display", "none");
//                    }
//                }
//            };
//        },
        // Datos de configuracion del datatable
        onClickShowModalDet: function() {
            document.getElementById("formModal_detalle").reset();
            $('#title_modal').html('');
            var aLinkLog = $(this);
            var trParent = aLinkLog.parents('tr');
            var record = todo.tableTotal.row(trParent).data();
            $('#Modal_detalle').modal('show');
            fTiempos.fillFormModal(record);
        },
        fillFormModal: function(registros) {
            $.each(registros, function(i, item) {
                $('#mdl_' + i).val(item);
            });
            $('#title_modal').html('<b>Detalle de la orden  ' + registros.id_orden_trabajo_hija + '</b>');
            $('#Modal_detalle').modal('show');
        },

        getButtons: function(obj) {
            boton = '<div class="btn-group">'
                    + '<a class="btn btn-default btn-xs ver-det btn_datatable_cami" title="Editar Ots"><span class="fa fa-fw fa-eye"></span></a>'
                    + '</div>';
            return boton;
        },
        individualColumnSearching: function() {
            $('#tablaTodo tfoot th').each(function() {
                $(this).html('<input type="text" placeholder="Buscar" />');
            });
        }
    };
    todo.init();
    /************************************************FIN TODO************************************************/

    //==================================================================================================================
    /************************************************INICIO GRAFICAS OTH************************************************/
    //==================================================================================================================
    graficas = {
        init: function() {
            graficas.events();
            graficas.printGrafics(ladoA, 'grafica_a');
            graficas.printGrafics(ladoB, 'grafica_b');

        },

        //Eventos de la ventana.
        events: function() {

        },

        //funcion para pintar las graficas
        printGrafics: function(params, div) {

            var g_tipos = $(`#${div}`);
            // definicion de algunos atributos de css
            // Chart.defaults.global.defaultFontFamily = "Lato";
            Chart.defaults.global.defaultFontSize = 11;
            Chart.defaults.global.defaultFontColor = '#000';

            var myChart = new Chart(g_tipos, {
                type: 'horizontalBar',
                data: {
                    labels: params.tipo, //horizontal
                    datasets: [
                        // {
                        //     //Total
                        //     label: 'Total',
                        //     fill: true,
                        //     lineTension: 0.4,
                        //     backgroundColor: "rgba(125, 125, 125, 0.1)",
                        //     borderColor: "rgba(125, 125, 125, 1)",
                        //     borderCapStyle: 'butt',
                        //     borderDash: [],
                        //     borderDashOffset: 0.0,
                        //     borderJoinStyle: 'miter',
                        //     pointBorderColor: "rgba(125, 125, 125, 1)",
                        //     pointBackgroundColor: "#fff",
                        //     pointBorderWidth: 8,
                        //     pointHoverRadius: 5,
                        //     pointHoverBackgroundColor: "rgba(125, 125, 125, 1)",
                        //     pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                        //     pointHoverBorderWidth: 5,
                        //     pointRadius: 1,
                        //     pointHitRadius: 10,
                        //     data: params.total, //vertical
                        //     // type: 'line',
                        //     spanGaps: false,
                        //     borderWidth: 2,
                        // },
                        {
                            //Fuera de Tiempos
                            label: 'Fuera de Tiempos',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: "rgba(255, 0, 0, 0.2)",
                            borderColor: "rgba(255, 0, 0, 1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(255, 0, 0, 1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 8,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(255, 0, 0, 1)",
                            pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                            pointHoverBorderWidth: 5,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: params.out, //vertical
                            spanGaps: false,
                            borderWidth: 2,
                        },
                        {
                            //en tiempos
                            label: 'en tiempos',
                            fill: true,
                            lineTension: 0.1,
                            backgroundColor: "rgba(0, 255, 0, 0.8)",
                            borderColor: "rgba(0, 255, 0, 1)",
                            borderCapStyle: 'butt',
                            borderDash: [],
                            borderDashOffset: 0.0,
                            borderJoinStyle: 'miter',
                            pointBorderColor: "rgba(0, 255, 0, 1)",
                            pointBackgroundColor: "#fff",
                            pointBorderWidth: 8,
                            pointHoverRadius: 5,
                            pointHoverBackgroundColor: "rgba(0, 255, 0, 1)",
                            pointHoverBorderColor: "rgba(220, 220, 220, 1)",
                            pointHoverBorderWidth: 5,
                            pointRadius: 1,
                            pointHitRadius: 10,
                            data: params.in, //vertical
                            spanGaps: false,
                            borderWidth: 2,
                        }
                    ]
                },
                options: {
                    // onClick: vista.clickEventGrafics,
                    title: {
                        display: true,
                        text: 'Cantidad OTH por Tipos'
                    },

                    scales: {
                        xAxes: [{
                                gridLines: {
                                    display: false,
                                    color: '#ccc'
                                },
                                display: true,
                                // stacked: true,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'CANTIDAD DE ORDENES'
                                },

                                ticks: {
                                    min: 0.5 // Edit the value according to what you need
                                }
                            }],
                        yAxes: [{
                                gridLines: {
                                    // display: false,
                                    color: '#ccc'
                                },
                                display: true,
                                stacked: false,
                                scaleLabel: {
                                    display: true,
                                    labelString: 'NOMBRE TIPO'
                                },
                                ticks: {
                                    // beginAtZero: true,
                                }
                            }]
                    }
                }
            });
        },
    };
    graficas.init();







});

//**********************************************JHON*********************
var tabla_cont_out;
function showModalDetResOutTime(idTipo) {
    $.post(baseurl + '/OtHija/c_getOtsOutTime',
            {
                idTipo: idTipo // parametros que se envian
            },
            function(data) {
                // limpiar y reiniciar la tabla si ya estaba inicializada
                if (tabla_cont_out) {
                    tabla_cont_out.clear().draw();
                    tabla_cont_out.rows.add(data);
                    tabla_cont_out.columns.adjust().draw();
                    return;
                }

                tabla_cont_out = $('#tablaDetalleResOutTimes').DataTable(fTiempos.configTable(data, [
                    {title: "OT Padre", data: "nro_ot_onyx"},
                    {title: "Id Orden Trabajo Hija", data: "id_orden_trabajo_hija"},
                    {title: "Nombre Cliente", data: "nombre_cliente"},
                    {title: "Ot Hija", data: "n_name_tipo"},
                    {title: "Estado Orden Trabajo Hija", data: "estado_orden_trabajo_hija"},
                    {title: "Ingeniero Responsable", data: "ingeniero"},
                    {title: "Fecha Creación", data: "fecha_creacion"},
                    {title: "Recurrente", data: "MRC"},
                    {title: "Días vencida", data: "tiempo_vencidas"},
                    {title: "opc", data: fTiempos.getButtons},
                ]));
            });
    $('#Modal_detalle_res_out').modal('show');
}

var tabla_cont_in;
function showModalDetResInTimes(idTipo) {
    $.post(baseurl + '/OtHija/c_getOtsInTimes',
            {
                idTipo: idTipo // parametros que se envian
            },
            function(data) {
                // limpiar y reiniciar la tabla si ya estaba inicializada
                if (tabla_cont_in) {
                    tabla_cont_in.clear().draw();
                    tabla_cont_in.rows.add(data);
                    tabla_cont_in.columns.adjust().draw();
                    return;
                }

                tabla_cont_in = $('#tablaDetalleResInTimes').DataTable(eTiempos.configTable(data, [
                    {title: "OT Padre", data: "nro_ot_onyx"},
                    {title: "Id Orden Trabajo Hija", data: "id_orden_trabajo_hija"},
                    {title: "Nombre Cliente", data: "nombre_cliente"},
                    {title: "Ot Hija", data: "n_name_tipo"},
                    {title: "Estado Orden Trabajo Hija", data: "estado_orden_trabajo_hija"},
                    {title: "Ingeniero Responsable", data: "ingeniero"},
                    {title: "Fecha Creación", data: "fecha_creacion"},
                    {title: "Recurrente", data: "MRC"},
                    {title: "Días max Entrega", data: eTiempos.getAlertIcon},
                    {title: "opc", data: eTiempos.getButtons},
                ]));
            });
    $('#Modal_detalle_res_in').modal('show');
}

//Funcionamiento del Scroll para el segundo modal

$('#Modal_detalle').on("hidden.bs.modal", function(e) {
    if ($('.modal:visible').length) {
        $('body').addClass('modal-open');
    }
});
