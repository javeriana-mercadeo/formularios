<form id="form_SF" action="https://webto.salesforce.com/servlet/servlet.WebToLead?encoding=UTF-8" method="POST" novalidate aria-label="Formulario de contacto">
          
          <!-- Hidden fields for Salesforce -->
          <input type="hidden" name="oid" value="00Df4000003l8Bf">
          <input type="hidden" name="retURL" id="retURL" value="">
          <input type="hidden" name="debug" value="1">
          <input type="hidden" name="debugEmail" value="gesalas@javeriana.edu.co">
          
          <!-- Información del evento -->
          <input type="text" placeholder="*Nombre evento" id="nevento" name="00NJw000006f1BF" maxlength="40" required readonly />
          <div class="error_text" id="error_nevento" style="display: none;">Completa este campo</div>
          
          <input type="text" placeholder="*Fecha evento" id="fevento" name="00NJw000006f1BE" maxlength="80" required readonly />
          <div class="error_text" id="error_fevento" style="display: none;">Completa este campo</div>
        
          <!-- Información del participante -->
          <div class="name-row">
            <div class="name-field">
              <input type="text" placeholder="*Nombre(s)" id="first_name" name="first_name" maxlength="40" required />
              <div class="error_text" id="error_first_name" style="display: none;">Completa este campo</div>
            </div>
            <div class="name-field">
              <input type="text" placeholder="*Apellidos" id="last_name" name="last_name" maxlength="80" required />
              <div class="error_text" id="error_last_name" style="display: none;">Completa este campo</div>
            </div>
          </div>
          
          <!-- Documento de identidad -->
          <div class="document-row">
            <div class="document-type-field">
              <select id="tipo_doc" name="00N5G00000WmhsT" required>
                <option value="">*Tipo de documento</option>
                <option value="CC">Cédula Ciudadanía</option>
                <option value="CE">Cédula Extranjería</option>
                <option value="PA">Pasaporte</option>
                <option value="TI">Tarjeta Identidad</option>
              </select>
              <div class="error_text" id="error_tipo_doc" style="display: none;">Selecciona</div>
            </div>
            <div class="document-number-field">
              <input type="text" placeholder="*Número de documento" id="numero_doc" name="00N5G00000WmhsR" maxlength="255" required />
              <div class="error_text" id="error_numero_doc" style="display: none;">Completa este campo</div>
            </div>
          </div>
          
          <!-- Email y celular -->
          <input type="email" placeholder="*Email" id="email" name="email" maxlength="80" required />
          <div class="error_text" id="error_email" style="display: none;">Ingresa un correo válido</div>
          
          <!-- Phone row -->
          <div class="phone-row">
            <div class="prefix-field">
              <select id="prefijoCel" name="00NJw000002mzb7" required>
                <option value="">(+) Indicativo</option>
                <!-- Options will be populated by JavaScript -->
              </select>
              <div class="error_text" id="error_prefijoCel" style="display: none;">*Seleccione</div>
            </div>
            <div class="mobile-field">
              <input type="text" placeholder="*Teléfono celular" id="mobile" name="mobile" minlength="8" maxlength="15" required />
              <div class="error_text" id="error_mobile" style="display: none;">*Campo obligatorio (entre 8 y 10 caracteres)</div>
            </div>
          </div>
          
          <!-- Ubicación -->
          <select id="pais" name="00N5G00000WmhvJ" required>
            <option value="">*País de residencia</option>
            <!-- Options will be populated by JavaScript -->
          </select>
          <div class="error_text" id="error_pais" style="display: none;">Selecciona</div>
          
          <select id="departamento" name="00N5G00000WmhvX" style="display: none;">
            <option value="">*Selecciona el departamento</option>
            <!-- Options will be populated by JavaScript -->
          </select>
          <div class="error_text" id="error_departamento" style="display: none;">Selecciona</div>
          
          <select id="ciudad" name="00N5G00000WmhvO" style="display: none;">
            <option value="">*Selecciona la Ciudad</option>
            <!-- Options will be populated by JavaScript -->
          </select>
          <div class="error_text" id="error_ciudad" style="display: none;">Selecciona</div>
          
          <!-- Tipo de asistente -->
          <select id="tipo_asistente" name="00NJw000001J3g6" required>
            <option value="">*Tipo de asistente</option>
            <option value="Aspirante">Aspirante</option>
            <option value="Padre de familia y/o acudiente">Padre de familia y/o acudiente</option>
            <option value="Docente y/o psicoorientador">Docente y/o psicoorientador</option>
          </select>
          <div class="error_text" id="error_tipo_asistente" style="display: none;">Selecciona</div>
          
          <!-- Hidden field for non-applicants -->
          <input type="hidden" id="programa_noap" name="00N5G00000WmhvV" value="">
          
          <!-- Nivel académico (hidden, always PREGRADO) -->
          <select id="nivelacademico" name="nivelacademico" style="display: none;">
            <option value="PREG">Pregrado</option>
          </select>
          <div class="error_text" id="error_nivelacademico" style="display: none;">Selecciona el nivel académico</div>
          
          <!-- Colegio -->
          <div id="colegio_section" style="display: none;">
            <h5 style="color: #4d7fcb; margin-top: 20px;">Selecciona tu colegio:</h5>
            <p style="color: #666; font-size: 15px;">Puedes filtrar por ciudad/departamento o escribir una palabra clave</p>
            
            <!-- Filtros de departamento y ciudad -->
            <select id="selectedDepartment" style="width: 100%; margin-bottom: 15px;">
              <option value="">Filtrar por Departamento</option>
              <!-- Options will be populated by JavaScript -->
            </select>
            
            <select id="selectedCity" style="width: 100%;">
              <option value="">Filtrar por Ciudad</option>
              <!-- Options will be populated by JavaScript -->
            </select>
            
            <!-- Campo de búsqueda -->
            <input type="text" id="searchTerm" placeholder="Filtrar por nombre o palabra clave" style="width: 100%; margin-top: 10px;" />
            
            <!-- Lista de colegios filtrados -->
            <ul id="colegios_list" style="display: none; max-height: 200px; overflow-y: auto; margin-top: 10px; width: 100%; font-size: 14px; list-style: none; padding: 0; border: 1px solid #ddd;">
              <!-- Items will be populated by JavaScript -->
            </ul>
            
            <input type="hidden" id="colegio" name="00NJw0000041omr">
            <div class="error_text" id="error_colegio" style="display: none;">Selecciona un colegio</div>
          </div>
          
          <!-- Facultad y programa -->
          <div id="programa_section" style="display: none; margin-top: 20px;">
            <h5 style="color: #4d7fcb; text-align: center;">¿En cuál programa estás interesado?</h5>
            
            <select id="facultad" name="Facultad">
              <option value="">*Selecciona la facultad</option>
              <!-- Options will be populated by JavaScript -->
            </select>
            <div class="error_text" id="error_facultad" style="display: none;">Selecciona</div>
            
            <select id="programa" name="00N5G00000WmhvV" style="margin-top: 10px; display: none;">
              <option value="">*Selecciona el programa</option>
              <option value="NOAP" style="display: none;">NOAP</option>
              <!-- Options will be populated by JavaScript -->
            </select>
            <div class="error_text" id="error_programa" style="display: none;">Selecciona</div>
          </div>
          
          <!-- Período de ingreso -->
          <div id="periodo_section" style="display: none; margin-top: 10px;">
            <select id="periodo_esperado" name="00N5G00000WmhvI" maxlength="20">
              <option value="">*Periodo esperado de Ingreso</option>
              <!-- Options will be populated by JavaScript -->
            </select>
            <div class="error_text" id="error_periodo_esperado" style="display: none;">Selecciona</div>
          </div>
          
          <!-- Hidden fields -->
          <div style="display: none;">
            <select id="origen_sol" name="00NJw000001J3Hl">
              <option selected value="Web to Lead">Web to Lead</option>
            </select>
            <select id="fuenteAutoriza" name="00N5G00000WmhvT">
              <option value="Landing Eventos">Landing Eventos</option>
            </select>
            <select id="lead_source" name="lead_source">
              <option value="Landing Pages">Landing Pages</option>
            </select>
            <input id="company" name="company" maxlength="40" type="text" value="NA" />
            <input id="fuente" name="00N5G00000WmhvW" type="text" />
            <input id="subfuente" name="00N5G00000WmhvZ" type="text" />
            <input id="medio" name="00NJw000001J3g8" type="text" />
            <input id="articulo" name="00NJw000006f1BB" maxlength="255" type="text" />
            <input id="campana" name="00N5G00000Wmi8x" maxlength="255" type="text" />
          </div>
          
          <!-- Autorización de datos -->
          <div style="margin-top: 20px;">
            <p style="color: #666;">¿Autoriza usted el tratamiento de sus datos personales de acuerdo con la <a href="https://www.javeriana.edu.co/informacion/politica-y-tratamiento-de-datos-personales" style="color: #4d7fcb;" target="_blank">autorización de privacidad</a>?</p>
            
            <div class="radio-inline-group">
              <div class="radio-option">
                <input type="radio" id="autoriza-si" name="00N5G00000WmhvF" value="1">
                <label for="autoriza-si" style="color: #333; margin-left: 5px;">Sí</label>
              </div>
              <div class="radio-option">
                <input type="radio" id="autoriza-no" name="00N5G00000WmhvF" value="0">
                <label for="autoriza-no" style="color: #333; margin-left: 5px;">No</label>
              </div>
            </div>
            
            <div class="error_text" id="error_autoriza" style="display: none; margin-top: 10px;">
              La Pontificia Universidad Javeriana requiere de su autorización para el tratamiento de sus datos personales para continuar con el presente proceso, sin la autorización legalmente no podemos darle continuidad al mismo
            </div>
          </div>

          <button type="submit" id="submit_btn" disabled style="margin-top: 20px;">Enviar Ahora</button>
          
          <div id="successMsg" style="border: 2px solid green; background-color: lightgrey; padding: 10px; border-radius: 5px; display: none; margin-top: 10px;">
            Gracias por tu mensaje. Ha sido enviado.
          </div>
        </form>