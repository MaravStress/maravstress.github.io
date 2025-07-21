let _habilidades = [];
let _proyectos = [];


// ////////////////////////////////////////////////////////////////////////////////  Cargar y guardar 

    async function save_Habilidades() {
        const contenido = JSON.stringify(_habilidades, null, 2);
        await Save('bd_habilidades.json', contenido);
    }
    async function save_Proyectos() {
        const contenido = JSON.stringify(_proyectos, null, 2);
        await Save('bd_proyectos.json', contenido);
    }
    function saveToHere() {
        // Guardar en el elemento con id bd_habilidades
        const bdElement = document.getElementById('bd_habilidades');
        const contenido = JSON.stringify(_habilidades, null, 2);
        if (bdElement) {
            bdElement.textContent = contenido;
        }
        console.log('Datos guardados en elemento bd_habilidades:', _habilidades);
    }

    async function loadFromHere() {

        // Intentar cargar desde el elemento bd_habilidades
        const bdElement = document.getElementById('bd_habilidades');

        await Load('bd/bd_habilidades.json').then(contenido => {
            if (contenido) {
                bdElement.textContent = contenido;
                _habilidades = JSON.parse(contenido);
            }
        });

        // Cargar proyectos desde el elemento bd_proyectos
        const bdProyectosElement = document.getElementById('bd_proyectos');
        await Load('bd/bd_proyectos.json').then(contenido => {
            if (contenido) {
                bdProyectosElement.textContent = contenido;
                _proyectos = JSON.parse(contenido);
            }
        });

        render_Habilidades();
        renderProjects();
    }


// ////////////////////////////////////////////////////////////////////////////////  Habilidades

    function render_Habilidades() {
        const list = document.getElementById('groups-list');
        list.innerHTML = '';
        _habilidades.forEach((grupo, gi) => {
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

    

    // Grupo
    document.getElementById('add-group-btn').onclick = () => {
        document.getElementById('group-index').value = '';
        document.getElementById('group-name').value = '';
        new bootstrap.Modal(document.getElementById('groupModal')).show();
    };

    window.editGroup = function(idx) {
        document.getElementById('group-index').value = idx;
        document.getElementById('group-name').value = _habilidades[idx].nombre;
        new bootstrap.Modal(document.getElementById('groupModal')).show();
    };

    window.deleteGroup = function(idx) {
        if (confirm('¿Eliminar este grupo?')) {
            _habilidades.splice(idx, 1);
            render_Habilidades();
            saveToHere();
        }
    };

    document.getElementById('group-form').onsubmit = function(e) {
        e.preventDefault();
        const idx = document.getElementById('group-index').value;
        const nombre = document.getElementById('group-name').value.trim();
        if (idx === '') {
            _habilidades.push({nombre, habilidades: []});
        } else {
            _habilidades[idx].nombre = nombre;
        }
        bootstrap.Modal.getInstance(document.getElementById('groupModal')).hide();
        render_Habilidades();
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
        document.getElementById('skill-name').value = _habilidades[gi].habilidades[hi];
        new bootstrap.Modal(document.getElementById('skillModal')).show();
    };

    window.deleteSkill = function(gi, hi) {
        if (confirm('¿Eliminar esta habilidad?')) {
            _habilidades[gi].habilidades.splice(hi, 1);
            render_Habilidades();
            saveToHere();
        }
    };

    document.getElementById('skill-form').onsubmit = function(e) {
        e.preventDefault();
        const gi = document.getElementById('skill-group-index').value;
        const hi = document.getElementById('skill-index').value;
        const nombre = document.getElementById('skill-name').value.trim();
        if (hi === '') {
            _habilidades[gi].habilidades.push(nombre);
        } else {
            _habilidades[gi].habilidades[hi] = nombre;
        }
        bootstrap.Modal.getInstance(document.getElementById('skillModal')).hide();
        render_Habilidades();
        saveToHere();
    };


// ////////////////////////////////////////////////////////////////////////////////  Proyectos


    function AddProjects() {
      // Limpiar el formulario
      document.getElementById('project-form').reset();
      document.getElementById('project-index').value = '';
      
      // Cambiar el título del modal
      document.getElementById('projectModalLabel').textContent = 'Agregar Proyecto';
      
      // Mostrar el modal
      const modal = new bootstrap.Modal(document.getElementById('projectModal'));
      modal.show();
    }

    

    function renderProjects() {
      const projectsList = document.getElementById('projects-list');
      projectsList.innerHTML = '';
      
      _proyectos.forEach((project, index) => {
        const projectCard = document.createElement('div');
        projectCard.className = 'card mb-3';
        projectCard.innerHTML = `
          <div class="card-body">
            <h5 class="card-title">${project.title}</h5>
            <p class="card-text"><strong>ID:</strong> ${project.id}</p>
            <p class="card-text"><strong>Descripción corta:</strong> ${project.shortDescription}</p>
            <p class="card-text">${project.longDescription}</p>
            <button class="btn btn-warning btn-sm" onclick="editProject(${index})">Editar</button>
            <button class="btn btn-danger btn-sm" onclick="deleteProject(${index})">Eliminar</button>
          </div>
        `;
        projectsList.appendChild(projectCard);
      });
    }

    function AddProjects() {
      document.getElementById('project-index').value = '';
      document.getElementById('project-id').value = '';
      document.getElementById('project-title').value = '';
      document.getElementById('project-short-description').value = '';
      document.getElementById('project-long-description').value = '';
      new bootstrap.Modal(document.getElementById('projectModal')).show();
    }

    function editProject(index) {
      const project = _proyectos[index];
      document.getElementById('project-index').value = index;
      document.getElementById('project-id').value = project.id;
      document.getElementById('project-title').value = project.title;
      document.getElementById('project-short-description').value = project.shortDescription;
      document.getElementById('project-long-description').value = project.longDescription;
      new bootstrap.Modal(document.getElementById('projectModal')).show();
    }

    function deleteProject(index) {
      if (confirm('¿Estás seguro de que quieres eliminar este proyecto?')) {
        _proyectos.splice(index, 1);
        renderProjects();
        updateProjectsDisplay();
      }
    }

    function updateProjectsDisplay() {
      document.getElementById('bd_proyectos').textContent = JSON.stringify(_proyectos, null, 2);
    }

    

    document.getElementById('project-form').addEventListener('submit', function(e) {
      e.preventDefault();
      
      const projectData = {
        id: document.getElementById('project-id').value,
        title: document.getElementById('project-title').value,
        shortDescription: document.getElementById('project-short-description').value,
        longDescription: document.getElementById('project-long-description').value
      };
      
      const index = document.getElementById('project-index').value;
      
      if (index === '') {
        _proyectos.push(projectData);
      } else {
        _proyectos[parseInt(index)] = projectData;
      }
      
      renderProjects();
      updateProjectsDisplay();
      bootstrap.Modal.getInstance(document.getElementById('projectModal')).hide();
    });

    // Initialize
    document.addEventListener('DOMContentLoaded', function() {
      renderProjects();
      updateProjectsDisplay();
    });



// ////////////////////////////////////////////////////////////////////////////////  Ejecutar funciones al cargar la página


loadFromHere();