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