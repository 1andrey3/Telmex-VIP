/************************* MOSTRAR MODAL FORMULARIO*************************/
//LISTAR SELECTS
$.each(responsable_list, function(i, item) {
    $('.id_responsable').append(`
            <option value="${item.id_responsable}">${item.nombre_responsable}</option>
        `);
});

$.each(causa_list, function(i, item) {
    $('.id_causa').append(`
            <option value="${item.id_causa}">${item.nombre_causa}</option>
        `);
});
// MOSTRAR MODAL
function showFormControl(otp, cliente, id_sede, nombre_sede) {
    table_historial(otp);
    $('#myModalLabel').html(`Orden de trabajo ${otp}`);
    document.getElementById("formModal").reset();
    $('#id_ot_padre').val(otp);
    $('#id_sede').val(id_sede);
    $('#n_nombre_cliente').val(cliente);
    $('#nombre_sede').val(nombre_sede);
    $('#mdl-control_cambios').modal('show');
}

function table_historial(otp) {
    $.post(baseurl + '/Sede/getCCByOtp', {
            otp: otp
        },
        function(obj) {
            var data = JSON.parse(obj);
            print_table_historial(data);
        });
}

function print_table_historial(data) {
    if (typeof tabla_Historiales == 'object') {
        console.log(typeof tabla_Historiales);
        var tabla = tabla_Historiales;
        tabla.clear().draw();
        tabla.rows.add(data);
        tabla.columns.adjust().draw();
        return;
    }

    tabla_Historiales = $('#tabla_Historial').DataTable(configTableHistorial(data, [{
            title: "responsable",
            data: "nombre_responsable"
        }, //1
        {
            title: "causa",
            data: "nombre_causa"
        }, //2
        {
            title: "numero control",
            data: "numero_control"
        }, //3
        {
            title: "compromiso",
            data: "fecha_compromiso",
            visible: false
        }, //4
        {
            title: "fecha programacion inicial",
            data: "fecha_programacion_inicial",
            visible: false
        }, //5
        {
            title: "nueva fecha programacion",
            data: "nueva_fecha_programacion",
            visible: false
        }, //6
        {
            title: "narrativa escalamiento",
            data: getNarrativaTotalLog2
        }, //7
        {
            title: "estado",
            data: "estado_cc"
        }, //8
        {
            title: "observaciones",
            data: "observaciones_cc"
        }, //9
        {
            title: "faltantes",
            data: "faltantes"
        }, //10
        {
            title: "en tiempo",
            data: "en_tiempos",
            visible: false
        }, //11
        {
            title: "creado",
            data: "fecha_creacion_cc"
        } //12

    ]));
}

function getNarrativaTotalLog2(obj) {

    // console.log(obj);
    if (typeof obj.narrativa_escalamiento == 'string') {
        var array_cadena = obj.narrativa_escalamiento.split(" ");
        var cadena = "";
        if (array_cadena.length > 10) {

            for (var i = 0; i < 10; i++) {
                cadena += array_cadena[i] + " ";
            }

            // console.log("cadena", cadena);

            return `<div class="tooltipo">${cadena} <img class="rigth" style="width:15px; margin-left:96%;" src="${baseurl}/assets/images/plus.png">
                              <span class="tooltiptext">${obj.narrativa_escalamiento}</span>
                            </div>
                            `;

        }
    }
    return obj.narrativa_escalamiento;
}

function configTableHistorial(data, columns, onDraw) {
    return {
        initComplete: function() {
            $('#tabla_Historial  tfoot th').each(function() {
                $(this).html('<input type="text" placeholder="Buscar" />');
            });

            var r = $('#tabla_Historial tfoot tr');
            r.find('th').each(function() {
                $(this).css('padding', 8);
            });
            $('#tabla_Historial thead').append(r);
            $('#search_0').css('text-align', 'center');

            // DataTable
            var table = $('#tabla_Historial').DataTable();

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
            "url": baseurl + "/assets/plugins/datatables/lang/es.json",
        },
        dom: 'Blfrtip',
        buttons: [{
                extend: 'colvisGroup',
                text: 'Items 1',
                className: 'buttonModal',
                show: [0, 1, 2, 3, 4, 5],
                hide: [6, 7, 8, 9, 10, 11]
            }, {
                extend: 'colvisGroup',
                text: 'Items 2',
                className: 'buttonModal',
                show: [6, 7, 8, 9, 10, 11],
                hide: [0, 1, 2, 3, 4, 5]
            },

            {
                text: 'Excel <span class="fa fa-file-excel-o"></span>',
                className: 'btn-cami_cool',
                extend: 'excel',
                title: 'ZOLID EXCEL',
                filename: 'zolid ' + fecha_actual
            }, {
                text: 'Imprimir <span class="fa fa-print"></span>',
                className: 'btn-cami_cool',
                extend: 'print',
                title: 'Reporte Zolid',
            }
        ],
        select: true,
        searching: false,

        "lengthMenu": [
            [10, 25, 50, -1],
            [10, 25, 50, "All"]
        ],

        columnDefs: [{
            // targets: -1,
            // visible: false,
            defaultContent: "",
            // targets: -1,
            orderable: false,
        }],
        order: [
            [0, 'desc']
        ],
        drawCallback: onDraw
    }
}

// ****************************SECCION PARA AGREGAR LAS SEDES EN EL MODULO DE CONTROL DE CAMBIO****************************
$(function() {
    trackChangesHeadquarters = {
        init: function() {
            trackChangesHeadquarters.events();
            trackChangesHeadquarters.getListHeadquarters_table();
        },
        //Eventos de la ventana.
        events: function() {

        },
        getListHeadquarters_table: function() {
            //metodo ajax (post)
            $.post(baseurl + '/Sede/c_getListofficesTable', {
                    //parametros

                },
                // función que recibe los datos
                function(data) {
                    // convertir el json a objeto de javascript
                    var obj = JSON.parse(data);
                    trackChangesHeadquarters.printTable(obj);
                }
            );
        },
        printTable: function(data) {
            // nombramos la variable para la tabla y llamamos la configuiracion que se encuentra en /assets/js/modules/helper.js
            trackChangesHeadquarters.trackChanges_Office = $('#trackChanges_Office').DataTable(trackChangesHeadquarters.configTableHeadquarters(data, [

                {
                    title: "ID sede",
                    data: "id_sede"
                }, {
                    title: "Nombre de la sede",
                    data: "nombre_sede"
                }, {
                    title: "Ciudad",
                    data: "ciudad"
                }, {
                    title: "Departamento",
                    data: "departamento"
                }, {
                    title: "Dierección",
                    data: "direccion"
                }, {
                    title: "Clasificación",
                    data: "clasificacion"
                }, {
                    title: "Tipo de Oficina",
                    data: "tipo_oficina"
                }, {
                    title: "Cant OTP",
                    data: "cant_otp"
                }, {
                    title: "Cant ctrls",
                    data: "num_ctrl_camb"
                }, {
                    title: "Opc.",
                    data: trackChangesHeadquarters.getButonsPrintOffice
                },
            ]));
        },
        // Datos de configuracion del datatable
        configTableHeadquarters: function(data, columns, onDraw) {
            return {
                initComplete: function() {
                    $('#trackChanges_Office  tfoot th').each(function() {
                        $(this).html('<input type="text" placeholder="Buscar" />');
                    });

                    var r = $('#trackChanges_Office tfoot tr');
                    r.find('th').each(function() {
                        $(this).css('padding', 8);
                    });
                    $('#trackChanges_Office thead').append(r);
                    $('#search_0').css('text-align', 'center');

                    // DataTable
                    var table = $('#trackChanges_Office').DataTable();

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
                    "url": baseurl + "/assets/plugins/datatables/lang/es.json",
                },
                dom: 'Blfrtip',
                buttons: [{
                    text: 'Excel <span class="fa fa-file-excel-o"></span>',
                    className: 'btn-cami_cool',
                    extend: 'excel',
                    title: 'ZOLID EXCEL',
                    filename: 'zolid ' + fecha_actual
                }, {
                    text: 'Imprimir <span class="fa fa-print"></span>',
                    className: 'btn-cami_cool',
                    extend: 'print',
                    title: 'Reporte Zolid',
                }],
                select: true,

                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],

                columnDefs: [{
                    // targets: -1,
                    // visible: false,
                    defaultContent: "",
                    // targets: -1,
                    orderable: false,
                }],
                order: [
                    [0, 'desc']
                ],
                drawCallback: onDraw
            }
        },

        getButonsPrintOffice: function(obj) {
            // return "<a class='ver-mail btn_datatable_cami'><span class='glyphicon glyphicon-print'></span></a>";
            var button = '<div class="btn-group" style="display: inline-flex;">';

            button += '<a href="' + baseurl + '/Sede/otps_sede/' + obj.id_sede + '" target="_blank" class="btn btn-default btn-xs btn_datatable_cami" title="ver OTP"><span class="glyphicon glyphicon-eye-open"></span></a>';
            button += '<a class="btn btn-default btn-xs btn_datatable_cami btn_file" title="Evidencias"><span class="glyphicon glyphicon-file"></span></a>';
            button += '</div>';

            return button;

        },
    };
    trackChangesHeadquarters.init();

    // ****************************SECCION PARAAGREGAR LAS SEDES EN EL MODULO DE CONTROL DE CAMBIO****************************

    controlCOTP = {
        init: function() {
            controlCOTP.events();
            controlCOTP.getListHeadquarters_table();

        },
        //Eventos de la ventana.
        events: function() {

        },

        getListHeadquarters_table: function() {
            //metodo ajax (post)
            $.post(baseurl + '/Sede/c_getListOTPTable', {
                    //parametros

                },
                // función que recibe los datos
                function(data) {
                    // convertir el json a objeto de javascript
                    var obj = JSON.parse(data);
                    controlCOTP.printTable(obj);
                }
            );
        },
        printTable: function(data) {
            // nombramos la variable para la tabla y llamamos la configuiracion que se encuentra en /assets/js/modules/helper.js
            controlCOTP.trackChanges_Office = $('#trackChanges_OTP').DataTable(controlCOTP.configTableHeadquarters(data, [

                {
                    title: "Nombre de la Sede",
                    data: "nombre_sede"
                }, {
                    title: "ID OTP",
                    data: "k_id_ot_padre"
                }, {
                    title: "Nombre Cliente",
                    data: "n_nombre_cliente"
                }, {
                    title: "Tipo",
                    data: "orden_trabajo"
                }, {
                    title: "Servicio",
                    data: "servicio"
                }, {
                    title: "Estado OTP",
                    data: "estado_orden_trabajo"
                }, {
                    title: "Opc.",
                    data: controlCOTP.getButonsPrintOTP
                },
            ]));
        },
        // Datos de configuracion del datatable
        configTableHeadquarters: function(data, columns, onDraw) {
            return {
                initComplete: function() {
                    $('#trackChanges_OTP  tfoot th').each(function() {
                        $(this).html('<input type="text" placeholder="Buscar" />');
                    });

                    var r = $('#trackChanges_OTP tfoot tr');
                    r.find('th').each(function() {
                        $(this).css('padding', 8);
                    });
                    $('#trackChanges_OTP thead').append(r);
                    $('#search_0').css('text-align', 'center');

                    // DataTable
                    var table = $('#trackChanges_OTP').DataTable();

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
                    "url": baseurl + "/assets/plugins/datatables/lang/es.json",
                },
                dom: 'Blfrtip',
                buttons: [{
                    text: 'Excel <span class="fa fa-file-excel-o"></span>',
                    className: 'btn-cami_cool',
                    extend: 'excel',
                    title: 'ZOLID EXCEL',
                    filename: 'zolid ' + fecha_actual
                }, {
                    text: 'Imprimir <span class="fa fa-print"></span>',
                    className: 'btn-cami_cool',
                    extend: 'print',
                    title: 'Reporte Zolid',
                }],
                select: true,

                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],

                columnDefs: [{
                    // targets: -1,
                    // visible: false,
                    defaultContent: "",
                    // targets: -1,
                    orderable: false,
                }],
                order: [
                    [0, 'desc']
                ],
                drawCallback: onDraw
            }
        },

        getButonsPrintOTP: function(obj) {
            var button = `<a class="btn btn-default btn-xs ver-mail btn_datatable_cami" title="ver OTP" onclick="showFormControl('${obj.k_id_ot_padre}', '${obj.n_nombre_cliente}', '${obj.id_sede}', '${obj.nombre_sede}')"><i class="fa fa-bars" aria-hidden="true"></i></a>`
            return button;

        },
    };
    controlCOTP.init();

    // ****************************SECCION DE MODULO DE CONTROL DE CAMBIO ****************************

    controlCambioAll = {
        init: function() {
            controlCambioAll.events();
            controlCambioAll.getListAllCc_table();

        },
        //Eventos de la ventana.
        events: function() {

        },
        getListAllCc_table: function() {
            //metodo ajax (post)
            $.post(baseurl + '/Sede/c_getList_All_Table', {
                    //parametros

                },
                // función que recibe los datos
                function(data) {
                    // convertir el json a objeto de javascript
                    var obj = JSON.parse(data);
                    controlCambioAll.printTable(obj);
                }
            );
        },
        printTable: function(data) {
            // nombramos la variable para la tabla y llamamos la configuiracion que se encuentra en /assets/js/modules/helper.js
            controlCambioAll.trackChanges_All = $('#trackChanges_All').DataTable(controlCambioAll.configTableHeadquarters(data, [

                {
                    title: "Id Control Cambios",
                    data: "id_control_cambios"
                }, {
                    title: "Sede",
                    data: "nombre_sede"
                }, {
                    title: "ID OTP",
                    data: "id_ot_padre"
                }, {
                    title: "Responsable",
                    data: "nombre_responsable"
                }, {
                    title: "Causa",
                    data: "nombre_causa"
                }, {
                    title: "Fecha Compromiso",
                    data: "fecha_compromiso"
                }, {
                    title: "Fecha Programación Inicial",
                    data: "fecha_programacion_inicial"
                }, {
                    title: "Narrativa Escalamiento",
                    data: controlCambioAll.getNarrativaTotal
                }, {
                    title: "Estado",
                    data: "estado_cc"
                }, {
                    title: "Faltantes",
                    data: "faltantes"
                }, {
                    title: "A Tiempo",
                    data: "en_tiempos"
                }, {
                    title: "Fecha Creación",
                    data: "fecha_creacion_cc"
                },
            ]));
        },
        // Datos de configuracion del datatable
        configTableHeadquarters: function(data, columns, onDraw) {
            return {
                initComplete: function() {
                    $('#trackChanges_All  tfoot th').each(function() {
                        $(this).html('<input type="text" placeholder="Buscar" />');
                    });

                    var r = $('#trackChanges_All tfoot tr');
                    r.find('th').each(function() {
                        $(this).css('padding', 8);
                    });
                    $('#trackChanges_All thead').append(r);
                    $('#search_0').css('text-align', 'center');

                    // DataTable
                    var table = $('#trackChanges_All').DataTable();

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
                    "url": baseurl + "/assets/plugins/datatables/lang/es.json",
                },
                dom: 'Blfrtip',
                buttons: [{
                    text: 'Excel <span class="fa fa-file-excel-o"></span>',
                    className: 'btn-cami_cool',
                    extend: 'excel',
                    title: 'ZOLID EXCEL',
                    filename: 'zolid ' + fecha_actual
                }, {
                    text: 'Imprimir <span class="fa fa-print"></span>',
                    className: 'btn-cami_cool',
                    extend: 'print',
                    title: 'Reporte Zolid',
                }],
                select: true,

                "lengthMenu": [
                    [10, 25, 50, -1],
                    [10, 25, 50, "All"]
                ],

                columnDefs: [{
                    // targets: -1,
                    // visible: false,
                    defaultContent: "",
                    // targets: -1,
                    orderable: false,
                }],
                order: [
                    [1, 'desc']
                ],
                drawCallback: onDraw
            }
        },

        // observacion con funcion de mostrar mas
        getNarrativaTotal: function(obj) {
            // console.log(obj);
            if (typeof obj.narrativa_escalamiento == 'string') {
                var array_cadena = obj.narrativa_escalamiento.split(" ");
                var cadena = "";
                if (array_cadena.length > 10) {

                    for (var i = 0; i < 10; i++) {
                        cadena += array_cadena[i] + " ";
                    }

                    // console.log("cadena", cadena);

                    return `<div class="tooltipo">${cadena} <img class="rigth" style="width:15px; margin-left:96%;" src="${baseurl}/assets/images/plus.png">
                              <span class="tooltiptext">${obj.narrativa_escalamiento}</span>
                            </div>
                            `;

                }
            }
            return obj.narrativa_escalamiento;
        },

    };
    controlCambioAll.init();
});

// subir archivos
$(function() {
    upload = {
        init: function() {
            upload.events();
        },

        //Eventos de la ventana.
        events: function() {
            $("#upFile").on("click", upload.clic_on_button);
            $("#getFile").on("change", upload.style_icon);
            $("#clArchivo").on("click", upload.clArchivo);
            $("#formArchivos").on("submit", upload.submit_form);
            $('#getFile').on("change", upload.get_Name);
            $('#trackChanges_Office').on("click", 'a.btn_file', upload.show_mdl_file);
        },
        clic_on_button: function() {
            $('#getFile').click();
            return false;
        },
        style_icon: function() {
            $("#upFile").removeClass("btn-light");
            $("#upFile").addClass("btn-primary");
            $("#ico-btn-file").removeClass("fa-upload");
            $("#ico-btn-file").addClass("fa-check");
            $("#upFile").attr('disabled', true);

            return false;
        },
        clArchivo: function() {
            $("#upFile").addClass("btn-light");
            $("#upFile").removeClass("btn-primary");
            $("#ico-btn-file").addClass("fa-upload");
            $("#ico-btn-file").removeClass("fa-check");
            $("#upFile").attr('disabled', false);
            $('#input_file').val('');

        },
        submit_form: function(e) {
            e.preventDefault();

            var algo = $('#input_file').val();
            console.log("algo", algo);

            var datos = $(this).serializeArray(); //datos serializados
            var archivos = new FormData($("#formArchivos")[0]);

            //agergaremos los datos serializados al objecto archivos
            $.each(datos, function(key, input) {
                archivos.append(input.name, input.value);
            });

            $.ajax({
                type: 'post',
                url: baseurl + '/Upload/insertFiles',
                data: archivos, //enviamos archivos
                contentType: false,
                processData: false
            }).done(function(valor) {
                var res = JSON.parse(valor);
                if (res == 1) {
                    var carpeta = $('#mdl_sede').val();
                    upload.getFileName(carpeta);
                }

            }).fail(function(data) {
                alert("Error");

            });
        },
        get_Name: function() {
            var archivo = $('#getFile').val();
            var nombre = archivo.substring(archivo.lastIndexOf("\\") + 1);
            $('#input_file').val(nombre);
            $('#smtArchivo').attr('disabled', false);
            // $('#smtArchivo').attr('disabed', false);
        },
        show_mdl_file: function() {
            const sede = trackChangesHeadquarters.trackChanges_Office.row($(this).parents("tr")).data().nombre_sede;
            var id_sede = trackChangesHeadquarters.trackChanges_Office.row($(this).parents("tr")).data().id_sede;
            upload.getFileName(sede, id_sede);
            $('#mdl_sede').val(sede);
            $('#title_sede').html(sede);
            $('#modal_file').modal('show');
        },

        // Obtiene los nombres de la carpeta
        getFileName: function(carpeta, id_sede) {
            upload.clArchivo();
            $('#tabla-archivos tbody').html('');
            $('#smtArchivo').attr('disabled', true);
            $.post(baseurl + '/Upload/c_getFillName', {
                carpeta: carpeta,
                id_sede: id_sede
            }, function(data) {
                var files = JSON.parse(data);
                $.each(files, function(i, archivo) {
                    $('#tabla-archivos tbody').append(`
                                <tr>
                                    <td class="text-center">${archivo.nombre_archivo}</td>
                                    <td><a href="${baseurl}/upload/download_file/${archivo.id_control_cambios}" class="btn btn-primary btn-xs" target="_blank"><i class="btn_show fa fa-download" aria-hidden="true"></i></a></td>
                                </tr>

                            `);

                });

            });
        },

    };
    upload.init();

    alto_impacto = {
        init: function() {
            alto_impacto.events();
            alto_impacto.multiselect();

        },

        //Eventos de la ventana.
        events: function() {
            $('#btn_alto_impacto').click(alto_impacto.control_cambio_alto_impacto);
            // $('#submit_multiple').submit(alto_impacto.validarFormulario);
            $('#mdl_cc_alto_impacto').on('submit','form.formModalMultiple',alto_impacto.validarFormulario);

        },

        // validar el formulario de envio
        validarFormulario: function(){
            const val_multi_sedes = $('#multi_sedes').val();
            const val_multi_ordenes = $('#multi_ordenes').val();
            if (val_multi_sedes.length == 0 && val_multi_ordenes.length == 0) {
                helper.miniAlert('A cuales ordenes deseas crear control de cambios?', 'question')
                return false;
            } else {
                return true;
            }
        },

        // modal seccion para controles de cambio de alto impacto
        control_cambio_alto_impacto: function() {
            $('#mdl_cc_alto_impacto').modal('show');
        },

        // artreglar a cuadros de multiselect + searching
        multiselect: function() {
            // run pre selected options
            $('#multi_sedes').multiSelect(alto_impacto.config_multiselect_search('Sedes'));
            $('#multi_ordenes').multiSelect(alto_impacto.config_multiselect_search('Ordenes'));
        },

        // configuracion para multiselect con searching
        config_multiselect_search: function(placeholder){
            return {
                selectableHeader: "<input type='text' class='search-input form-control input-sm m-b-5' autocomplete='off' placeholder='"+placeholder+"'>",
                selectionHeader: "<input type='text' class='search-input form-control input-sm m-b-5' autocomplete='off' placeholder='Seleccionadas'>",
                afterInit: function(ms) {
                    var that = this,
                        $selectableSearch = that.$selectableUl.prev(),
                        $selectionSearch = that.$selectionUl.prev(),
                        selectableSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selectable:not(.ms-selected)',
                        selectionSearchString = '#' + that.$container.attr('id') + ' .ms-elem-selection.ms-selected';

                    that.qs1 = $selectableSearch.quicksearch(selectableSearchString)
                        .on('keydown', function(e) {
                            if (e.which === 40) {
                                that.$selectableUl.focus();
                                return false;
                            }
                        });

                    that.qs2 = $selectionSearch.quicksearch(selectionSearchString)
                        .on('keydown', function(e) {
                            if (e.which == 40) {
                                that.$selectionUl.focus();
                                return false;
                            }
                        });
                },
                afterSelect: function() {
                    this.qs1.cache();
                    this.qs2.cache();
                },
                afterDeselect: function() {
                    this.qs1.cache();
                    this.qs2.cache();
                }

            };
        },
    };
    alto_impacto.init();

});