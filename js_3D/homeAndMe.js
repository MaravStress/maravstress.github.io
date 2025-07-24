<<<<<<< HEAD
import * as THREE from 'https://unpkg.com/three@0.160.1/build/three.module.js';
import { GLTFLoader } from 'https://unpkg.com/three@0.160.1/examples/jsm/loaders/GLTFLoader.js';


//   ================================================================== Configuramos todo lo esencial
=======
 //   ================================================================== Configuramos todo lo esencial
>>>>>>> parent of ec01fc2 (Ahora tenemos materiales de calidad)
        const scene = new THREE.Scene();
        const container = document.getElementById('threejs-container');
        const camera = new THREE.PerspectiveCamera(70, container.clientWidth / container.clientHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ antialias: true });
        RendererSettings(renderer, container);
        container.appendChild(renderer.domElement);
        // Position the camera
        camera.position.z = 20;
        camera.position.y = 0;
        

        //   ==================================================================  Luces
        const ambientLight = createAmbientLight(0xffffff, 0.6);
        scene.add(ambientLight);

        const directionalLight = createDirectionalLight(0xffffff, 0.8, { x: 5, y: 10, z: 5 }, { x: 0, y: 0, z: 0 }, true);
        scene.add(directionalLight);
        
        // Añadir luz adicional para mejor iluminación
        const directionalLight2 = createDirectionalLight(0xffffff, 0.4, { x: -5, y: 5, z: -5 }, { x: 0, y: 0, z: 0 }, true);
        scene.add(directionalLight2);

        
        

        //  ================================================================== Cargamos modelos
        // Declaracion de modelos
        let home = null;
        let me = null;

        // Cargamos modelos
        ImportModel('home', { x: 0, y: 5, z: 0 }, { x: 0, y: 0, z: 0 }, function(model) {
           home = model;
           console.log('cargamos home correctamente!!');
        });

        ImportModel('me', { x: 0, y: -5, z: 0 }, { x: 0, y: 0, z: 0 }, function(model) {
           me = model;
           console.log('cargamos me correctamente!!');
        });

        // ================================================================== Funciones 
        let lastMouse = { x: 0, y: 0 };
        let mouseDelta = { x: 0, y: 0 };
        let scrollTop = 0;
        let maxScroll = 0;
        let scrollPercent = 0;
        let speedDownCamera = 20;
        let CameraObjetivePosition = { x: 0, y: 0, z: 0 };


        function onMouseMove(e) {
            if (lastMouse.x === 0 && lastMouse.y === 0) {
                lastMouse.x = e.clientX;
                lastMouse.y = e.clientY;
                return; // No hay movimiento previo, no hacemos nada
            }
            mouseDelta.x = e.clientX - lastMouse.x;
            mouseDelta.y = e.clientY - lastMouse.y;
            lastMouse.x = e.clientX;
            lastMouse.y = e.clientY;
            let fuerzaMouse = 0.1;
            CameraObjetivePosition.x +=  mouseDelta.x * 0.01 * fuerzaMouse;
        }

        function onScroll(e){
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            maxScroll = document.body.scrollHeight - window.innerHeight;
            scrollPercent = scrollTop / maxScroll;

            // desplazamiento de la camara
            
            console.log('scrollTop:', scrollTop, 'maxScroll:', maxScroll, 'scrollPercent:', scrollPercent);
        }
               
        let meOrigen_Y = 0;
        function _update(){
            // regresamos a la posición original de la cámara
            let rango =  0.02;
            let velocidad = 0.06;
            if(CameraObjetivePosition.x > rango || CameraObjetivePosition.x < -rango){
                CameraObjetivePosition.x -= CameraObjetivePosition.x * velocidad; 
            }
            
            const valor_Corte = 300;
            if(scrollTop < valor_Corte){

                CameraObjetivePosition.y = - (scrollPercent * speedDownCamera);
                CameraObjetivePosition.z = interpolar(20, 2, scrollTop / valor_Corte);
            }

            // mov camera smoothly
            const cameraSpeed = 0.1;
            const rangoSmooth = 0.01;
            if(Math.abs(CameraObjetivePosition.x - camera.position.x) > rangoSmooth || Math.abs(CameraObjetivePosition.y - camera.position.y) > rangoSmooth || Math.abs(CameraObjetivePosition.z - camera.position.z) > rangoSmooth){
                camera.position.x += (CameraObjetivePosition.x - camera.position.x) * cameraSpeed;
                camera.position.y += (CameraObjetivePosition.y - camera.position.y) * cameraSpeed;
                camera.position.z += (CameraObjetivePosition.z - camera.position.z) * cameraSpeed;
            }
        }

        //   ================================================================== Inputs
        container.addEventListener('mousemove', onMouseMove); 
        window.addEventListener('scroll', onScroll);


        Resize();
        Animate();