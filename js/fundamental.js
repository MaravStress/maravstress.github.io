function Animate() {
    requestAnimationFrame(Animate);
    _update();
    renderer.render(scene, camera);
}

function Resize(){
    window.addEventListener('resize', () => {
        const newWidth = container.clientWidth;
        const newHeight = container.clientHeight;
        
        camera.aspect = newWidth / newHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(newWidth, newHeight);
    });
    
    // También ejecutar inmediatamente para configurar el tamaño inicial correctamente
    const initialWidth = container.clientWidth;
    const initialHeight = container.clientHeight;
    camera.aspect = initialWidth / initialHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(initialWidth, initialHeight);
}

// Render 
function RendererSettings(renderer, container){
        const containerWidth = container.clientWidth;
        const containerHeight = container.clientHeight;
        
        renderer.setSize(containerWidth, containerHeight);
        renderer.setClearColor(0xf0f0f0, 1);
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.shadowMap.autoUpdate = true;
        renderer.physicallyCorrectLights = true;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.outputEncoding = THREE.sRGBEncoding;

        // Configuraciones adicionales para mejor calidad
        renderer.outputEncoding = THREE.sRGBEncoding;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 1.0;
        renderer.antialias = true;
        
        // Configuraciones para evitar fragmentación visual
        renderer.sortObjects = true;
        renderer.preserveDrawingBuffer = false;
        renderer.powerPreference = "high-performance";

        
} 