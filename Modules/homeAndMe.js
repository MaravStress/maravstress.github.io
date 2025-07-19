 //   ================================================================== Configuramos todo lo esencial
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
        ImportModel('home', { x: 0, y: 7, z: 0 }, { x: 0, y: 0, z: 0 }, function(model) {
           home = model;
           console.log('cargamos home correctamente!!');
        });

        ImportModel('me', { x: 0, y: -3.6, z: 17 }, { x: 0, y: 0, z: 0 }, function(model) {
           me = model;
           console.log('cargamos me correctamente!!');
        });

        // ================================================================== Funciones 
        let lastMouse = { x: 0, y: 0 };
        let mouseDelta = { x: 0, y: 0 };
        let scrollTop = 0;
        let maxScroll = 0;
        let scrollPercent = 0;

        let speedCamera = 20;


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
            camera.position.x +=  mouseDelta.x * 0.01 * fuerzaMouse;
        }

        function onScroll(e){
            scrollTop = window.pageYOffset || document.documentElement.scrollTop;
            maxScroll = document.body.scrollHeight - window.innerHeight;
            scrollPercent = scrollTop / maxScroll;

            // desplazamiento de la camara
            camera.position.y = - (scrollPercent * speedCamera);

            console.log('scrollTop:', scrollTop, 'maxScroll:', maxScroll, 'scrollPercent:', scrollPercent);
        }
               
        let meOrigen_Y = 0;
        function _update(){
            // regresamos a la posición original de la cámara
            let rango =  0.02;
            let velocidad = 0.06;
            if(camera.position.x > rango || camera.position.x < -rango){
                camera.position.x -= camera.position.x * velocidad; 
            }
            
            // anclar me
            if(scrollTop > 300 && 700 > scrollTop){
                //me.position.y = meOrigen_Y ;//- (scrollPercent * 9);
                let porcentaje = (scrollTop - 300) / (maxScroll - 300);
                me.position.y = meOrigen_Y - (porcentaje * speedCamera);
            }else if(scrollTop < 300 && meOrigen_Y == 0){
                meOrigen_Y  = me.position.y;

        }
    }

        //   ================================================================== Inputs
        container.addEventListener('mousemove', onMouseMove); 
        window.addEventListener('scroll', onScroll);


        Resize();
        Animate();