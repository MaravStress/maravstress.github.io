async function Save(ubicacionArchivo, contenido) {
    // Verificar si el navegador soporta File System Access API
    if ('showSaveFilePicker' in window) {
        try {
            // Sugerir una ubicación específica y nombre de archivo
            const fileHandle = await window.showSaveFilePicker({
                suggestedName: ubicacionArchivo,
                startIn: 'downloads', // Puedes usar 'desktop', 'documents', 'downloads', etc.
                types: [{
                    description: 'JSON files',
                    accept: { 'application/json': ['.json'] }
                }]
            });
            
            const writable = await fileHandle.createWritable();
            await writable.write(contenido);
            await writable.close();
            
            console.log(`Archivo guardado en la ubicación seleccionada: ${ubicacionArchivo}`);
            return true;
        } catch (error) {
            if (error.name !== 'AbortError') {
                console.error('Error al guardar archivo:', error);
            }
            return false;
        }
    } else {
        // Fallback: descarga tradicional
        const blob = new Blob([contenido], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = ubicacionArchivo;
        a.click();
        URL.revokeObjectURL(url);
        
        console.log(`Archivo ${ubicacionArchivo} descargado (método tradicional)`);
        return true;
    }
}

async function Load(ubicacionArchivo) {
    try {
        const response = await fetch(ubicacionArchivo);
        if (!response.ok) {
            throw new Error(`Error al cargar archivo: ${response.status}`);
        }
        const contenido = await response.text();
        console.log(`Archivo ${ubicacionArchivo} cargado correctamente`);
        return contenido;
    } catch (error) {
        console.error(`Error al cargar ${ubicacionArchivo}:`, error);
        return null;
    }
}
