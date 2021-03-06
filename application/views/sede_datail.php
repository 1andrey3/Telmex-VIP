<div class="cont_logos" style="width: 90px;float: right; ">
  <img src="<?= URL::to('assets/img/claro.png') ?>" class="" style="height:34px;">
  <img src="<?= URL::to('assets/img/bbva.png') ?>" class="" style="height:28px;margin-top: 2px;">
</div>
<?php if (isset($otp[0]->nombre_sede)): ?>
	<h3 align="center">Detalle de la sede <b><?= $otp[0]->nombre_sede ?></b>  :  Cliente <b><?= $otp[0]->n_nombre_cliente ?></b></h3>
	<h4 align="center">Cantidad de <b> control de cambios</b> de esta sede: <b><?= count($log) ?></b></h4>
<?php endif ?>

<!--*********************  MODULO PESTAÑAS  *********************-->
<ul class="nav nav-tabs">
	<li class="active"><a data-toggle="tab" href="#pestana_tabla_otp">Tabla OTP</a></li>
	<li class=""><a data-toggle="tab" href="#pestana_log">Control de cambios <span class="badge badge_cami"><?= count($log) ?></span></a></li>
</ul>

<!--*********************  CONTENIDO PESTAÑAS  *********************-->
<div class="tab-content">

	<div id="pestana_tabla_otp" class="tab-pane fade in active">
		<h3>Tabla OTP</h3>
		<!-- INICIO TABLA DE OTP DE UNA SEDE -->
		<table id="table_sede_otp" class="table datatables_detalles table-hover table-bordered table-striped dataTable_camilo" width="100%">
			<thead>
				<th>OTP</th>
				<th>TIPO</th>
				<th>SERVICIO</th>
				<th>ESTADO</th>
				<th width="1%">Cant Ctrl Camb</th>
				<th>OPC</th>
			</thead>
		<?php foreach ($otp as $item_otp): ?>
			<tr>
				<td><?= $item_otp->k_id_ot_padre ?></td>
				<td><?= $item_otp->orden_trabajo ?></td>
				<td><?= $item_otp->servicio ?></td>
				<td><?= $item_otp->estado_orden_trabajo ?></td>
				<td><?= $item_otp->num_ctrl ?></td>
				<td><div class='btn-group'>
		                <a class='btn btn-default btn-xs new_control btn_datatable_cami' title='Nuevo Control de Causa' onclick='showFormControl("<?= $item_otp->k_id_ot_padre ?>","<?= $item_otp->n_nombre_cliente ?>","<?= $item_otp->id_sede ?>", "<?= $item_otp->num_ctrl ?>", "<?= $item_otp->nombre_sede ?>");'><i class="fa fa-bars" aria-hidden="true"></i></a>
		            </div>
		        </td>		
			</tr>
		<?php endforeach ?>
			<tfoot>
				<tr>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
					<th></th>
				</tr>
			</tfoot>
		</table>
	</div>
	<!-- ***********************************************INICIO DE PESTAÑA 2*********************************************** -->
	<div id="pestana_log" class="tab-pane fade">
		<h3>Control de cambios</h3>
		<table id="table_log_ctrl_cambios" class="table datatables_detalles table-hover table-bordered table-striped dataTable_camilo f-s-10" width="100%">
			<thead>
				<th>Id Control Cambios</th>
				<th>otp</th>
				<th>responsable</th>
				<th>causa</th>
				<th>compromiso</th>
				<th>fecha programacion inicial</th>
				<th>nueva fecha programacion</th>
				<th>narrativa escalamiento</th>
				<th>estado</th>
				<th>observaciones</th>
				<th>faltantes</th>
				<th>en tiem</th>
				<th>creado</th>
			</thead>
		<?php foreach ($log as $item_log): ?>
			<tr>
				<th><?=$item_log->control_cambios ?></th>
				<th><?=$item_log->id_ot_padre ?></th>
				<th><?=$item_log->nombre_responsable ?></th>
				<th><?=$item_log->nombre_causa ?></th>
				<th><?=$item_log->fecha_compromiso ?></th>
				<th><?=$item_log->fecha_programacion_inicial ?></th>
				<th><?=$item_log->nueva_fecha_programacion ?></th>
				<th><?=$item_log->narrativa_escalamiento ?></th>
				<th><?=$item_log->estado_cc ?></th>
				<th><?=$item_log->observaciones_cc ?></th>
				<th><?=$item_log->faltantes ?></th>
				<th><?=$item_log->en_tiempos ?></th>
				<th><?=$item_log->fecha_creacion_cc ?></th>
			</tr>
		<?php endforeach ?>
			<tfoot>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
				<th></th>
			</tfoot>
		</table>
	</div>

</div>


<!-- ==============================================MODAL FORMULARIO + LOG ==============================================-->
<div id="mdl-control_cambios" class="modal fade" data-backdrop="static" data-keyboard="false" role="dialog" >
    <div class="modal-dialog modal-lg">
        <div class="modal-content">
            <div class="modal-header">
                <button type="button" class="close cerrar" data-dismiss="modal" aria-label="Close"><span class="glyphicon glyphicon-remove" aria-hidden="true"></span></button>
                <h3 class="modal-title" id="myModalLabel">    Orden Ot Hija N <label id="id_ot_modal"></label></h3>
            </div>
            <div class="modal-body">
				<!--*********************  MODULO PESTAÑAS  *********************-->
				<ul class="nav nav-tabs">
					<li class="active"><a data-toggle="tab" href="#form">Formulario</a></li>
					<li class=""><a data-toggle="tab" href="#log_otp">Historial <span class="badge badge_cami" id="bdg_historial">...</span></a></li>
                </ul></a></li>
				</ul>
				
				<!--*********************  CONTENIDO PESTAÑAS  *********************-->
				<div class="tab-content">
				
					<div id="form" class="tab-pane fade in active">
						<h3>Nuevo Control de Cambio</h3>

				          <form class="well form-horizontal" id="formModal" action="<?= URL::to("sede/insert_control") ?>"  method="post" enctype="multipart/form-data">
				            <fieldset>
				              <div class="widget bg_white m-t-25 display-block">
				                <h2 class="h4 mp clr-98c2d8">
				                  <i class="fa fa-fw fa-question-circle"></i>&nbsp;&nbsp; General
				                </h2>
				                <fieldset class="col-md-6 control-label">
				                  <!-- valores ocultos -->
				                  <input type="hidden" id="id_sede" name="id_sede" value="">
				                  <input type="hidden" id="nombre_sede" name="nombre_sede" value="">

				                  <div class="form-group">
				                    <label for="id_ot_padre" class="col-md-3 control-label">otp:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon"><i class="fa fa-braille" aria-hidden="true"></i></span>
				                        <input name="id_ot_padre" id="id_ot_padre" class="form-control" type="text" readonly="true">
				                      </div>
				                    </div>
				                  </div>

				                  <div class="form-group">
				                    <label for="n_nombre_cliente" class="col-md-3 control-label">Cliente:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon"><i class="fa fa-user-circle-o" aria-hidden="true"></i></span>
				                        <input name="n_nombre_cliente" id="n_nombre_cliente" class="form-control" type="text" disabled="true">
				                      </div>
				                    </div>
				                  </div>

				                </fieldset>
				                <!--  fin seccion izquierda form-->
				                <!--  inicio seccion derecha form-->
				                <fieldset>

				                  <div class="form-group">
				                    <label for="id_responsable" class="col-md-3 control-label">Responsable CC:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon" id="statusColor"><i class="fa fa-street-view" aria-hidden="true"></i></span>
				                        <select name="id_responsable" id="id_responsable" class="form-control" required>
				                          <option value="">Seleccione</option>
				                        </select>
				                      </div>
				                    </div>
				                  </div>

				                  
				                  <div class="form-group">
				                    <label for="id_causa" class="col-md-3 control-label">Causa CC:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon" id="statusColor"><i class="fa fa-th-list" aria-hidden="true"></i></span>
				                        <select name="id_causa" id="id_causa" class="form-control" required>
				                          <option value="">Seleccione</option>
				                        </select>
				                      </div>
				                    </div>
				                  </div>

				                  <div class="form-group">
				                    <label for="fecha_compromiso" class="col-md-3 control-label">Compromiso:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon"><i class='glyphicon glyphicon-calendar'></i></span>
				                        <input name="fecha_compromiso" id="fecha_compromiso" class="form-control" type="date" required>
				                      </div>
				                    </div>
				                  </div>

				                </fieldset>
				                <!--  fin seccion derecha form---->
				              </div>

				              <div class="widget bg_white m-t-25 display-block">
				         
				                <fieldset class="col-md-6 control-label">
				                  <div class="form-group">
				                    <label for="fecha_programacion_inicial" class="col-md-3 control-label">Programación Inicial:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon"><i class='glyphicon glyphicon-calendar'></i></span>
				                        <input name="fecha_programacion_inicial" id="fecha_programacion_inicial" class="form-control" type="date" required>
				                      </div>
				                    </div>
				                  </div>

				                  <div class="form-group">
				                    <label for="nueva_fecha_programacion" class="col-md-3 control-label">Nueva Programación:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon"><i class='glyphicon glyphicon-calendar'></i></span>
				                        <input name="nueva_fecha_programacion" id="nueva_fecha_programacion" class="form-control" type="date" required>
				                      </div>
				                    </div>
				                  </div>
				                </fieldset>
				                <!--  fin seccion izquierda form---->

				                <!-- inicio seccion derecha form-- -->
				                <fieldset>
				                  <div class="form-group">
				                    <label for="estado_cc" class="col-md-3 control-label">Estado:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon" id="statusColor"><i class="fa fa-list" aria-hidden="true"></i></span>
				                        <select name="estado_cc" id="estado_cc" class="form-control" required>
					                        <option value="">Seleccione</option>
					                        <option value="NO INICIADO">NO INICIADO</option>
											<option value="EJECUTADO">EJECUTADO</option>
											<option value="RECHAZADO">RECHAZADO</option>
											<option value="PTE. CORRECCION">PTE. CORRECCION</option>
											<option value="ESCALADO CLARO">ESCALADO CLARO</option>
				                        </select>
				                      </div>
				                    </div>
				                  </div>
								<!-- FIN REQUERIDOS -->

				                  <div class="form-group">
				                    <label for="observaciones_cc" class="col-md-3 control-label">Observaciones:</label>
				                    <div class="col-md-8 selectContainer">
				                      <div class="input-group">
				                        <span class="input-group-addon" id="statusColor"><i class="fa fa-list" aria-hidden="true"></i></span>
				                        <select name="observaciones_cc" id="observaciones_cc" class="form-control">
					                        <option value="">Seleccione</option>
					                        <option value="pte- correccion -se requiere fecha de finalización del pendiente para ajustar">pte- correccion -se requiere fecha de finalización del pendiente para ajustar</option>
											<option value="cc- rechazado - sin gestion del ing de es">cc- rechazado - sin gestion del ing de es</option>
											<option value="cc- rechazado - corrección no realizada en tiempos">cc- rechazado - corrección no realizada en tiempos</option>
											<option value="cc- rechazado - linea de escalamiento fuera de tiempo">cc- rechazado - linea de escalamiento fuera de tiempo</option>
											<option value="cc- rechazado - causa no aplica debe ser por cliente">cc- rechazado - causa no aplica debe ser por cliente</option>
											<option value="cc- rechazado - tipificación no aplica deacuerdo a la narraiva del escalamiento">cc- rechazado - tipificación no aplica deacuerdo a la narraiva del escalamiento</option>
											<option value="cc- rechazado - ot en sia - no requiere cc">cc- rechazado - ot en sia - no requiere cc</option>
											<option value="cc- rechazado - se solicitan las mismas fechas de cc anterior">cc- rechazado - se solicitan las mismas fechas de cc anterior</option>
											<option value="cc- rechazado - sin linea de escalamiento">cc- rechazado - sin linea de escalamiento</option>
											<option value="cc- rechazado - cc duplicado">cc- rechazado - cc duplicado</option>
				                        </select>
				                      </div>
				                    </div>
				                  </div>
				                </fieldset>
				              </div>

				              <div class="widget bg_white m-t-25 display-block col-md-12 p-r-10pc">
				                <h2 class="h4 mp clr-98c2d8">
				                  <i class="fa fa-fw fa-check"></i>&nbsp;&nbsp; Faltantes
				                </h2>
				                
				                <fieldset class="col-md-6 control-label">
				                	<div class="col-md-6">
					                	<div class="form-check check_cami">
											<label>UM
												<input id="UM" type="checkbox" name="faltantes[]" value="UM"> <span class="label-text"></span>
											</label>
										</div>
										<div class="form-check check_cami">
											<label>CT
												<input id="CT" type="checkbox" name="faltantes[]" value="CT"> <span class="label-text"></span>
											</label>
										</div>
									</div>
									<div class="col-md-6">
										<div class="form-check check_cami">
											<label>Configuración
												<input id="Configuración" type="checkbox" name="faltantes[]" value="configuracion"> <span class="label-text"></span>
											</label>
										</div>
										<div class="form-check check_cami">
											<label>Equipos
												<input id="Equipos" type="checkbox" name="faltantes[]" value="equipos"> <span class="label-text"></span>
											</label>
										</div>
									</div>
				                </fieldset>
				                <!--  fin seccion izquierda form---->

				                <!--  inicio seccion derecha form---->
				                <fieldset class="col-md-6 control-label">
				                	<div class="col-md-4">
					                	<div class="form-check check_cami">
											<label>PDT
												<input id="PDT" type="checkbox" name="faltantes[]" value="PDT"> <span class="label-text"></span>
											</label>
										</div>
										<div class="form-check check_cami">
											<label>Incump f
												<input id="Incump fecha" type="checkbox" name="faltantes[]" value="incumplimiento_fecha"> <span class="label-text"></span>
											</label>
										</div>
									</div>
									<div class="col-md-4">
										<div class="form-check check_cami">
											<label>ES
												<input id="ES" type="checkbox" name="faltantes[]" value="ES"> <span class="label-text"></span>
											</label>
										</div>
										<div class="form-check check_cami">
											<label>a SIAO
												<input id="a SIAO" type="checkbox" name="faltantes[]" value="paso_a_SIAO"> <span class="label-text"></span>
											</label>
										</div>
									</div>
									<div class="col-md-4">
										<div class="form-check check_cami">
											<label>cupos sat
												<input id="cupos saturación" type="checkbox" name="faltantes[]" value="cupos_saturacion"> <span class="label-text"></span>
											</label>
										</div>
									</div>
				                </fieldset>
				              </div>

				              <div class="widget bg_white m-t-25 display-block col-md-12">
								<fieldset class="col-md-2 control-label widget m-r-20">
					                 <b>¿en tiempos?</b>
									<input type="radio" name="en_tiempos" value="si" id="radio-one" class="form-radio" checked><label for="radio-one">SI</label>
									<input type="radio" name="en_tiempos" value="no" id="radio-one" class="form-radio"><label for="radio-one">NO</label>
								</fieldset>

								<fieldset class="col-md-19 widget control-label">
									<!--********************* TEXT AREA *********************-->
									<div class="form-group">
										<label for="narrativa_escalamiento" class="col-md-3 control-label">Narrativa de escalamiento:</label>
										<div class="col-md-9 selectContainer">
											<div class="input-group">
												<span class="input-group-addon"><i class="glyphicon glyphicon-edit"></i></span>
												<textarea class="form-control" name="narrativa_escalamiento" id="narrativa_escalamiento" rows="2" required></textarea>
											</div>
										</div>
									</div>
									
								</fieldset>
								<br>
					              <!--*********************  INPUT TEXT  *********************-->
					              <div class="form-group">
					              	<label for="archivo" class="col-md-3 control-label">Evidencia: &nbsp;</label>
					              	<div class="col-md-8 selectContainer">
					              		<div class="input-group">
					              			<span class="input-group-addon"><i class="glyphicon glyphicon-file"></i></span>
					              			<input type="file" name="archivo" id="archivo" class="form-control" accept="*" required>
					              		</div>
					              	</div>
					              </div>
				              </div>
				              
				              
				            </fieldset>
				      		<?php if (Auth::user()->n_role_user != 'clarocc'): ?>
				            <center >
				            	<input type="submit" name="" value="guardar" class="btn-cami_cool m-t-20">
				            </center>
				            <?php endif ?>

				          </form>

					</div>
					
					<!-- *************************INICIO SEGUNDA PESTAÑA************************* -->
					<div id="log_otp" class="tab-pane fade">
						<h3>Historial</h3>
						<table id="tabla_Historial" class='table table-hover table-bordered table-striped dataTable_camilo' width="100%">
                        </table>
					</div>
				</div>
			</div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default cerrar" id="mbtnCerrarModal" data-dismiss="modal"><i class='glyphicon glyphicon-remove'></i>&nbsp;Cancelar</button>
            </div>
        </div>
    </div>
</div>

<script src="<?= URL::to("assets/plugins/sweetalert2/sweetalert2.all.js") ?>"></script>
<?php 
    $correcto = $this->session->flashdata('ok');
    $id_cc = $this->session->flashdata('id');
    if ($correcto == 'ok') {  ?>
        <script>
            swal('Correcto',`Se creó el control de cambios<br><b>ZCC<?= $id_cc ?></b>`, 'success');

        </script>
<?php } 

if ($correcto == 'error') {  ?>
        <script>
            swal('Error',`Se generó un error al insertar el registro`, 'error');

        </script>
<?php } ?>





<script>
	var responsable_list = <?= json_encode($responsable) ?>;
	var causa_list = <?= json_encode($causa) ?>;
</script>