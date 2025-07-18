function ImportModel(nameModel, callback){
    const loader = new THREE.GLTFLoader();
    // Ubicacion de los modelos, 
    // IMPORTANTE todos se llaman obj, el nombre esta en la carpeta
    loader.load('resources/objs/' + nameModel + '/obj.glb', 
        function (gltf) {
            // Success callback
            const loadedModel = gltf.scene;
            
            // Asegurar que todos los materiales respondan a la luz
            loadedModel.traverse(function (child) {
                if (child.isMesh) {
                    // Si el material es BasicMaterial, convertirlo a StandardMaterial
                    if (child.material.isMeshBasicMaterial) {
                        child.material = new THREE.MeshStandardMaterial({
                            color: child.material.color,
                            map: child.material.map,
                            transparent: child.material.transparent,
                            opacity: child.material.opacity
                        });
                    }
                    // Habilitar sombras si es necesario
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });
            
            scene.add(loadedModel);
            
            // Calcular el bounding box del modelo para escalarlo apropiadamente
            const box = new THREE.Box3().setFromObject(loadedModel);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            
            // Normalizar el tamaño del modelo para que sea consistente
            const maxDimension = Math.max(size.x, size.y, size.z);
            const desiredSize = 5; // Tamaño deseado para el modelo
            const scale = desiredSize / maxDimension;
            
            // Aplicar escala
            loadedModel.scale.setScalar(scale);
            
            // Centrar el modelo
            loadedModel.position.copy(center).multiplyScalar(-scale);
            
            console.log('Model loaded successfully!');
            
            // Call the callback with the loaded model
            if (callback) callback(loadedModel);
        },
        function (progress) {
            // Progress callback
            console.log('Loading progress: ', (progress.loaded / progress.total * 100) + '%');
        },
        function (error) {
            // Error callback
            console.error('Error loading model:', error);
            
            // Fallback: create a cube if model loading fails
            const geometry = new THREE.BoxGeometry();
            const material = new THREE.MeshStandardMaterial({ 
                color: 0x0077ff,
                wireframe: false
            });
            const fallbackModel = new THREE.Mesh(geometry, material);
            scene.add(fallbackModel);
            console.log('Fallback cube created due to model loading error');
            
            // Call the callback with the fallback model
            if (callback) callback(fallbackModel);
        }
    );
}





// Luz direccional
function createDirectionalLight(
    color = 0xffffff,
    intensity = 1,
    position = {x: 0, y: 1, z: 0},
    target = {x: 0, y: 0, z: 0},
    castShadow = true
) {
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(position.x, position.y, position.z);
    light.target.position.set(target.x, target.y, target.z);
    light.castShadow = castShadow;
    
    // Configuración simplificada y compatible para sombras direccionales
    if (castShadow) {
        light.shadow.mapSize.width = 2048;  // Resolución moderada pero buena
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 50;
        light.shadow.camera.left = -10;
        light.shadow.camera.right = 10;
        light.shadow.camera.top = 10;
        light.shadow.camera.bottom = -10;
        // Eliminar propiedades que pueden no estar soportadas en r128
        light.shadow.bias = -0.0001; // Prevenir shadow acne
    }
    
    return light;
}


// Luz puntual
function createPointLight(
    position = {x: 0, y: 0, z: 0},
    color = 0xffffff,
    intensity = 1,
    distance = 0,
    decay = 2,
    castShadow = true
) {
    const light = new THREE.PointLight(color, intensity, distance, decay);
    light.position.set(position.x, position.y, position.z);
    light.castShadow = castShadow;
    
    // Configuración simplificada para sombras puntuales
    if (castShadow) {
        light.shadow.mapSize.width = 1024;   // Resolución moderada
        light.shadow.mapSize.height = 1024;
        light.shadow.camera.near = 0.1;
        light.shadow.camera.far = 25;
        light.shadow.bias = -0.0001;
    }
    
    return light;
}

// Luz ambiental
function createAmbientLight( color = 0xffffff, intensity = 0.3 ) {
    // AmbientLight no soporta sombras, pero se incluye el parámetro para consistencia
    return new THREE.AmbientLight(color, intensity);
}

// Luz focal (SpotLight)
function createSpotLight( color = 0xffffff, intensity = 1, distance = 0,
    angle = Math.PI / 3,
    penumbra = 0,
    decay = 2,
    position = {x: 0, y: 1, z: 0},
    target = {x: 0, y: 0, z: 0},
    castShadow = true
) {
    const light = new THREE.SpotLight(color, intensity, distance, angle, penumbra, decay);
    light.position.set(position.x, position.y, position.z);
    light.target.position.set(target.x, target.y, target.z);
    light.castShadow = castShadow;
    
    // Configuración mejorada para sombras spotlight
    if (castShadow) {
        light.shadow.mapSize.width = 2048;
        light.shadow.mapSize.height = 2048;
        light.shadow.camera.near = 0.5;
        light.shadow.camera.far = 50;
        light.shadow.camera.fov = 30;
        light.shadow.radius = 10;
        light.shadow.blurSamples = 25;
    }
    
    return light;
}

// Luz hemisférica
function createHemisphereLight(
    skyColor = 0xffffff,
    groundColor = 0x444444,
    intensity = 1,
    position = {x: 0, y: 1, z: 0}
) {
    // HemisphereLight no soporta sombras, pero se incluye el parámetro para consistencia
    const light = new THREE.HemisphereLight(skyColor, groundColor, intensity);
    light.position.set(position.x, position.y, position.z);
    return light;
}