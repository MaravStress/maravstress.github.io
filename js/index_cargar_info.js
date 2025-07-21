async function loadHabilidades() {
    try {
        const contenido = await Load('bd/bd_habilidades.json');
        if (contenido) {
            const grupos = JSON.parse(contenido);
            const container = document.getElementById('habilidades-container');
            
            // Limpiar contenedor
            container.innerHTML = '';
            
            // Renderizar cada grupo de habilidades
            grupos.forEach(grupo => {
                const colDiv = document.createElement('div');
                colDiv.className = 'col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center';
                
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card shadow h-100 w-100';
                cardDiv.style.maxWidth = '350px';
                
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header text-center bg-white border-bottom-0';
                cardHeader.innerHTML = `<strong class="fs-4">${grupo.nombre}</strong>`;
                
                const ul = document.createElement('ul');
                ul.className = 'list-group list-group-flush';
                
                // Agregar cada habilidad
                grupo.habilidades.forEach(habilidad => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item';
                    li.textContent = habilidad;
                    ul.appendChild(li);
                });
                
                cardDiv.appendChild(cardHeader);
                cardDiv.appendChild(ul);
                colDiv.appendChild(cardDiv);
                container.appendChild(colDiv);
            });
            
            console.log('Habilidades cargadas correctamente');
        } else {
            console.error('No se pudo cargar el archivo de habilidades');
            // Mostrar mensaje de error en el contenedor
            const container = document.getElementById('habilidades-container');
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No se pudieron cargar las habilidades</p></div>';
        }
    } catch (error) {
        console.error('Error al cargar habilidades:', error);
        // const container = document.getElementById('habilidades-container');
        //  container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Error al cargar las habilidades</p></div>';
    }
}

async function loadProyectos() {
    try {
        const contenido = await Load('bd/bd_proyectos.json');
        if (contenido) {
            const proyectos = JSON.parse(contenido);
            const container = document.getElementById('proyectos-container');
            
            // Limpiar contenedor
            container.innerHTML = '';
            
            // Renderizar cada proyecto
            proyectos.forEach(proyecto => {
                const col = document.createElement('div');
                col.className = 'col-md-4 mb-4';
                
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card h-100 shadow-sm';
                cardDiv.style.cursor = 'pointer';
                
                const cardBody = document.createElement('div');
                cardBody.className = 'card-body';
                
                const cardTitle = document.createElement('h5');
                cardTitle.className = 'card-title';
                cardTitle.textContent = proyecto.title;
                
                const cardText = document.createElement('p');
                cardText.className = 'card-text';
                cardText.textContent = proyecto.shortDescription;
                
                // Agregar evento click para mostrar modal
                cardDiv.addEventListener('click', () => {
                    mostrarModalProyecto(proyecto);
                });
                
                cardBody.appendChild(cardTitle);
                cardBody.appendChild(cardText);
                cardDiv.appendChild(cardBody);
                col.appendChild(cardDiv);
                container.appendChild(col);
            });
            
            console.log('Proyectos cargados correctamente');
        } else {
            console.error('No se pudo cargar el archivo de proyectos');
            // Mostrar mensaje de error en el contenedor
            const container = document.getElementById('proyectos-container');
            container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">No se pudieron cargar los proyectos</p></div>';
        }
    } catch (error) {
        console.error('Error al cargar proyectos:', error);
        const container = document.getElementById('proyectos-container');
        container.innerHTML = '<div class="col-12 text-center"><p class="text-muted">Error al cargar los proyectos</p></div>';
    }
}

function mostrarModalProyecto(proyecto) {
    // Actualizar el contenido del modal
    document.getElementById('proyectoModalLabel').textContent = proyecto.title;
    document.getElementById('modal-descripcion-corta').textContent = proyecto.shortDescription;
    document.getElementById('modal-descripcion-larga').textContent = proyecto.longDescription;
    
    // Mostrar el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('proyectoModal'));
    modal.show();
}
