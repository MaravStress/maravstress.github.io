function ImportModel(nameModel, position = { x: 0, y: 0, z: 0 }, rotation = { x: 0, y: 0, z: 0 }, callback) {
    

    const loader = new THREE.GLTFLoader();
    // Ubicacion de los modelos, 
    // IMPORTANTE todos se llaman obj, el nombre esta en la carpeta
    loader.load('resources/objs/' + nameModel + '/obj.glb', 
        function (gltf) {
            // Success callback
            const loadedModel = gltf.scene;
            
            // AGREGAR MANEJO DE ANIMACIONES
            let mixer = null;
            if (gltf.animations && gltf.animations.length > 0) {
                mixer = new THREE.AnimationMixer(loadedModel);
                
                // Reproducir todas las animaciones
                gltf.animations.forEach(clip => {
                    const action = mixer.clipAction(clip);
                    action.play();
                });
                
               // console.log(`Animaciones encontradas para ${nameModel}:`, gltf.animations.length);
            }
            
            // Configurar el modelo (mantener código existente)
            loadedModel.traverse(function (child) {
                if (child.isMesh) {
                    // Configurar el material correctamente
                    if (child.material) {
                        // Si es un array de materiales
                        if (Array.isArray(child.material)) {
                            child.material = child.material.map(material => configureMaterial(material));
                        } else {
                            child.material = configureMaterial(child.material);
                        }
                        console.log(`Material configurado para ${nameModel}:`, child.material);
                    }
                    
                    // Configurar geometría
                    if (child.geometry) {
                        child.geometry.computeVertexNormals();
                        child.geometry.computeBoundingBox();
                    }
                    
                    // Habilitar sombras
                    child.castShadow = true;
                    child.receiveShadow = true;
                    
                    // Asegurar que se renderice correctamente
                    child.frustumCulled = false;
                }
            });
            
            // Función auxiliar para configurar materiales
            function configureMaterial(material) {
                // Forzar actualización del material
                material.needsUpdate = true;
                
                // Si ya es PhysicalMaterial, solo configurar propiedades básicas
                if (material.isMeshPhysicalMaterial) {
                    material.flatShading = false;
                    material.side = THREE.FrontSide;
                    material.alphaTest = material.alphaTest || 0.01;
                    material.skinning = true;
                    material.transparent = true;
                    material.needsUpdate = true;
                    // material.envMap = envMap;
                    material.envMapIntensity = 1;
                    material.depthWrite = false;
                    return material;
                }
                
                // Para cualquier otro tipo de material, convertir a PhysicalMaterial
                const newMaterial = new THREE.MeshPhysicalMaterial({
                    // Propiedades básicas (disponibles en todos los materiales)
                    color: material.color || new THREE.Color(0xffffff),
                    map: material.map,
                    transparent: material.transparent,
                    opacity: material.opacity !== undefined ? material.opacity : 1.0,
                    alphaTest: material.alphaTest || 0.01,
                    
                    // Propiedades avanzadas (si están disponibles)
                    normalMap: material.normalMap || null,
                    roughnessMap: material.roughnessMap || null,
                    metalnessMap: material.metalnessMap || null,
                    aoMap: material.aoMap || null,
                    emissive: material.emissive || new THREE.Color(0x000000),
                    emissiveMap: material.emissiveMap || null,
                    
                    // Valores específicos según el tipo original
                    metalness: material.metalness || 0.0,
                    roughness: material.roughness || (material.isMeshPhongMaterial ? 0.7 : 0.5),
                    
                    // Propiedades específicas de PhysicalMaterial
                    clearcoat: material.clearcoat || 0.0,
                    clearcoatRoughness: material.clearcoatRoughness || 0.0,
                    reflectivity: material.reflectivity || 0.5,
                    ior: material.ior || 1.5,
                    transmission: material.transmission || 0.0,
                    transmissionMap: material.transmissionMap || null,
                    transparent: material.transparent || false,
                    
                    thickness: material.thickness || 0.0,
                    attenuationColor: new THREE.Color(1, 1, 1),
                    attenuationDistance: Infinity,
                
                    // Configuraciones adicionales
                    flatShading: false,
                    side: THREE.FrontSide,
                    skinning: true
                });
                
                return newMaterial;
            }
            
            scene.add(loadedModel);
            
            // Configurar escala, posición y rotación por defecto
            loadedModel.scale.set(1, 1, 1);
            loadedModel.position.set(position.x, position.y, position.z);
            loadedModel.rotation.set(rotation.x, rotation.y, rotation.z);
            
            // ✅ AGREGAR MIXER AL MODELO
            loadedModel.mixer = mixer;
            
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

// funciones matematicas
function interpolar(inicio, fin, porcentaje) {
  return inicio + (fin - inicio) * porcentaje;
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