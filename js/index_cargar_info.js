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
                colDiv.className = 'col-12 col-md-6 col-lg-4 mb-4 d-flex justify-content-center  ';
                
                const cardDiv = document.createElement('div');
                cardDiv.className = 'card shadow h-100 w-100 bg-blur rounded-4';
                cardDiv.style.maxWidth = '350px';
                
                const cardHeader = document.createElement('div');
                cardHeader.className = 'card-header text-center bg-blur border-bottom-0 rounded-top-4';
                cardHeader.innerHTML = `<strong class="fs-4">${grupo.nombre}</strong>`;
                
                const ul = document.createElement('ul');
                ul.className = 'bg-transparent  list-group-flush ';
                
                // Agregar cada habilidad
                grupo.habilidades.forEach(habilidad => {
                    const li = document.createElement('li');
                    li.className = 'list-group-item py-1';
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
                container.innerHTML += `
                    <div class="col-md-6 mb-4 hover-zoom">
                        <div class="card h-100 shadow rounded-4 bg-blur " style="cursor: pointer;" onclick="mostrarModalProyecto(${JSON.stringify(proyecto).replace(/"/g, '&quot;')})">
                            <div class="card-body">
                                <h5 class="card-title">${proyecto.title}</h5>
                                <p class="card-text">${proyecto.shortDescription}</p>
                            </div>
                            <div class="m-2 rounded-3 parallax-bg-1" style="width: auto; aspect-ratio: 4 / 1;  background-image: url(bd/img/${proyecto.id}/banner.png);"></div>

                        </div>
                    </div>
                `;
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

function mostrarModalProyecto(proyecto) { // Actualizar el contenido del modal
    // Texto
    document.getElementById('proyectoModalLabel').textContent = proyecto.title;
    document.getElementById('modal-descripcion-corta').textContent = proyecto.shortDescription;
    document.getElementById('modal-descripcion-larga').textContent = proyecto.longDescription;
    // imagenes:
    const modalbanner = document.getElementById('modal-banner');
    const modalImagenes1 = document.getElementById('modal-imagenes-1');
    const modalImagenes2 = document.getElementById('modal-imagenes-2');
    const modalImagenes3 = document.getElementById('modal-imagenes-3');

    modalbanner.style.backgroundImage = `url(bd/img/${proyecto.id}/banner.png)`;
    modalImagenes1.src = `bd/img/${proyecto.id}/img-1.png`;
    modalImagenes2.src = `bd/img/${proyecto.id}/img-2.png`;
    modalImagenes3.src = `bd/img/${proyecto.id}/img-3.png`;
    // Mostrar el modal usando Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('proyectoModal'));
    modal.show();
}

