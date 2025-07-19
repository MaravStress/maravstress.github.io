let grupos = [];

    function renderGroups() {
        const list = document.getElementById('groups-list');
        list.innerHTML = '';
        grupos.forEach((grupo, gi) => {
            const groupCard = document.createElement('div');
            groupCard.className = 'card mb-3';
            groupCard.innerHTML = `
                <div class="card-header d-flex justify-content-between align-items-center">
                    <span>${grupo.nombre}</span>
                    <div>
                        <button class="btn btn-sm btn-warning me-1" onclick="editGroup(${gi})">Editar</button>
                        <button class="btn btn-sm btn-danger me-1" onclick="deleteGroup(${gi})">Eliminar</button>
                        <button class="btn btn-sm btn-success" onclick="addSkill(${gi})">Agregar Habilidad</button>
                    </div>
                </div>
                <ul class="list-group list-group-flush" id="skills-list-${gi}">
                    ${grupo.habilidades.map((hab, hi) => `
                        <li class="list-group-item d-flex justify-content-between align-items-center">
                            <span>${hab}</span>
                            <div>
                                <button class="btn btn-sm btn-warning me-1" onclick="editSkill(${gi},${hi})">Editar</button>
                                <button class="btn btn-sm btn-danger" onclick="deleteSkill(${gi},${hi})">Eliminar</button>
                            </div>
                        </li>
                    `).join('')}
                </ul>
            `;
            list.appendChild(groupCard);
        });
    }

    async function saveHabilidades() {
        const contenido = JSON.stringify(grupos, null, 2);
        await Save('bd_habilidades.json', contenido);
    }

    function saveToHere() {
        // Guardar en el elemento con id bd_habilidades
        const bdElement = document.getElementById('bd_habilidades');
        const contenido = JSON.stringify(grupos, null, 2);
        if (bdElement) {
            bdElement.textContent = contenido;
        }
        console.log('Datos guardados en elemento bd_habilidades:', grupos);
    }

    async function loadFromHere() {

        // Intentar cargar desde el elemento bd_habilidades
        const bdElement = document.getElementById('bd_habilidades');

        await Load('bd/bd_habilidades.json').then(contenido => {
            if (contenido) {
                bdElement.textContent = contenido;
            }
        });

        if (bdElement && bdElement.textContent.trim() !== '' && bdElement.textContent.trim() !== '[]') {
            try {
                grupos = JSON.parse(bdElement.textContent);
                console.log('Datos cargados desde elemento bd_habilidades:', grupos);
            } catch (error) {
                console.error('Error al parsear datos de bd_habilidades:', error);
                grupos = [];
            }
        } else {
            // Si no hay datos, iniciar con array vacío
            grupos = [];
            console.log('Iniciando con datos vacíos');
        }
        renderGroups();
    }

    // Grupo
    document.getElementById('add-group-btn').onclick = () => {
        document.getElementById('group-index').value = '';
        document.getElementById('group-name').value = '';
        new bootstrap.Modal(document.getElementById('groupModal')).show();
    };

    window.editGroup = function(idx) {
        document.getElementById('group-index').value = idx;
        document.getElementById('group-name').value = grupos[idx].nombre;
        new bootstrap.Modal(document.getElementById('groupModal')).show();
    };

    window.deleteGroup = function(idx) {
        if (confirm('¿Eliminar este grupo?')) {
            grupos.splice(idx, 1);
            renderGroups();
            saveToHere();
        }
    };

    document.getElementById('group-form').onsubmit = function(e) {
        e.preventDefault();
        const idx = document.getElementById('group-index').value;
        const nombre = document.getElementById('group-name').value.trim();
        if (idx === '') {
            grupos.push({nombre, habilidades: []});
        } else {
            grupos[idx].nombre = nombre;
        }
        bootstrap.Modal.getInstance(document.getElementById('groupModal')).hide();
        renderGroups();
        saveToHere();
    };

    // Habilidad
    window.addSkill = function(gi) {
        document.getElementById('skill-group-index').value = gi;
        document.getElementById('skill-index').value = '';
        document.getElementById('skill-name').value = '';
        new bootstrap.Modal(document.getElementById('skillModal')).show();
    };

    window.editSkill = function(gi, hi) {
        document.getElementById('skill-group-index').value = gi;
        document.getElementById('skill-index').value = hi;
        document.getElementById('skill-name').value = grupos[gi].habilidades[hi];
        new bootstrap.Modal(document.getElementById('skillModal')).show();
    };

    window.deleteSkill = function(gi, hi) {
        if (confirm('¿Eliminar esta habilidad?')) {
            grupos[gi].habilidades.splice(hi, 1);
            renderGroups();
            saveToHere();
        }
    };

    document.getElementById('skill-form').onsubmit = function(e) {
        e.preventDefault();
        const gi = document.getElementById('skill-group-index').value;
        const hi = document.getElementById('skill-index').value;
        const nombre = document.getElementById('skill-name').value.trim();
        if (hi === '') {
            grupos[gi].habilidades.push(nombre);
        } else {
            grupos[gi].habilidades[hi] = nombre;
        }
        bootstrap.Modal.getInstance(document.getElementById('skillModal')).hide();
        renderGroups();
        saveToHere();
    };

    loadFromHere();