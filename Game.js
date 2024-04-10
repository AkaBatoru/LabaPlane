
import * as THREE from 'three';
import { RGBELoader } from './additional_sourses/three.js-master/examples/jsm/loaders/RGBELoader.js';
import { Plane } from './Plane.js';
import { GameElements } from './GameElements.js';

class Game {
    constructor() {
        const container = document.createElement('div');
        document.body.appendChild(container);

        this.clock = new THREE.Clock();

        this.stuffPath = './additional_sourses/stuff/';
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        this.camera.position.set(-4.36, 0, -4.74);
        this.camera.lookAt(0, 0, 6);
        this.cameraHandler = new THREE.Object3D();
        this.cameraHandler.add(this.camera);
        this.cameraTarget = new THREE.Vector3(0, 0, 6);

        this.scene = new THREE.Scene();
        this.scene.add(this.cameraHandler);
		
		this.box = new THREE.Box3();
		

        const ambienLight = new THREE.HemisphereLight(0xfffffe, 0xbbbbfe, 1);
        ambienLight.position.set(0.6, 1.1, 0.26);
        this.scene.add(ambienLight);

        this.renderer = new THREE.WebGLRenderer({ antialias: true, alpfa: true });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        container.appendChild(this.renderer.domElement);

        //2 part --->
        /**/
        //клавиатура
        document.addEventListener('keydown', this.keyDown.bind(this));
        document.addEventListener('keyup', this.keyUp.bind(this));
        // тач-события 
        document.addEventListener('touchstart', this.mouseDown.bind(this) );
        document.addEventListener('touchend', this.mouseUp.bind(this) );
        // мышь
        document.addEventListener('mousedown', this.mouseDown.bind(this) );
        document.addEventListener('mouseup', this.mouseUp.bind(this) );

        this.spaceKey = false;
        this.active = false;
        //кнопка
        const btn = document.getElementById('startBtn');
        btn.addEventListener('click', this.startGame.bind(this));
        //2part <--- /**/

        this.loadGame();
		//this.test1();

        //добавляем bind(иначе потеряем this в качестве контекста). https://learn.javascript.ru/bind
        window.addEventListener('resize', this.resizing.bind(this));

    }
	
	test1(){
		const box3= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[0].children[4])
				// make a BoxGeometry of the same size as Box3
				const dimensions = new THREE.Vector3().subVectors( box3.max, box3.min );
				const boxGeo = new THREE.BoxGeometry(dimensions.x, dimensions.y, dimensions.z);

				// move new mesh center so it's aligned with the original object
				//const matrix = new THREE.Matrix4().setPosition(dimensions.addVectors(box3.min, box3.max).multiplyScalar( 0.5 ));
				//boxGeo.applyMatrix4(matrix);

				// make a mesh
				const mesh = new THREE.Mesh(boxGeo, new THREE.MeshBasicMaterial( { color: 0xffcc55 } ));
				mesh.position.z = this.obstaclesObj.obstacles[0].children[4].position.z;
				this.scene.add(mesh);
	}

    resizing() {
        this.camera.aspet = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);

    }

    loadGame() {
        this.loading = true;
        this.loadSkyTexture();
        this.planeObj = new Plane(this);
		
		this.obstaclesObj = new GameElements (this);

    }

    loadSkyTexture() {
        this.scene.background = new THREE.CubeTextureLoader()
            .setPath(`${this.stuffPath}models/skyTexture/`)
            .load([
                'sky1x.jpg',
                'sky2x.jpg',
                'sky1y.jpg',
                'sky2y.jpg',
                'sky1z.jpg',
                'sky2z.jpg',
            ], () => {
                this.renderer.setAnimationLoop(this.rendering.bind(this));
            });

    }

    updateCamera() {
        this.cameraHandler.position.copy(this.planeObj.position);
        this.cameraHandler.position.y = 1;
        this.cameraTarget.copy(this.planeObj.position);
        this.cameraTarget.z += 7;
        this.camera.lookAt(this.cameraTarget);
    }

    rendering() {
        if (this.loading) {
            if (this.planeObj.ready) {
                this.loading = false;
            }
            else {
                return;
            }
        }
        const time = this.clock.getElapsedTime();
        this.planeObj.update(time);
		/*
		console.log("planeY = " + this.planeObj.tempPos.y);
		console.log("planeZ = " + this.planeObj.tempPos.z);
		console.log(this.obstaclesObj.obstacles[4]);
		console.log("ObY = " + this.obstaclesObj.obstacles[0].position.y);
		console.log(this.obstaclesObj.obstacles[0].position.z);
		
		console.log(this.obstaclesObj.obstacles[0]);
		
		const box = new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[0].children[6]);
		console.log(box);
		*/
		//const size = box.getSize(new Vector3()).length();
		/*this.obstaclesObj.obstacles[7].position.z*/
		
		// звезда
		if (this.active){
			for(let i=0; i<7; i++){
				if ( this.planeObj.tempPos.z > this.obstaclesObj.obstacles[i].position.z && 
				this.planeObj.tempPos.z < this.obstaclesObj.obstacles[i].position.z + this.planeObj.velocity.z)
				{ 
				const minY= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[i].children[0]).min.y;
				const maxY= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[i].children[0]).max.y;
				
				
				//const Plane_minY= new THREE.Box3().setFromObject(this.planeObj);
				//const Plane_maxY= new THREE.Box3().setFromObject(this.planeObj.tempPos);
				
				if (i == 0) {
					console.log("STAR " + minY + "  " + maxY ); 
					//console.log("PLANE y " + Plane_minY + "  " );
					console.log("planeY = " + this.planeObj.tempPos.y);
				
					
				}
				   if ( this.planeObj.tempPos.y > minY && 
					this.planeObj.tempPos.y < maxY )
					{ 
						this.incScore();
					}	
				}
			}
		}
		// бомбы
		for(let i=0; i<7; i++){
			if ( this.planeObj.tempPos.z > this.obstaclesObj.obstacles[i].position.z && 
			this.planeObj.tempPos.z < this.obstaclesObj.obstacles[i].position.z + this.planeObj.velocity.z)
			{ 
				for(let u=1; u<7; u++){
					
					const minYB1= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[i].children[u]).min.y-0.5;
					const maxYB1= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[i].children[u]).max.y+0.5;
					if (i==0) {
					console.log("BOMB1 " + minYB1 + "  " + maxYB1 );
					}
					 if ( this.planeObj.tempPos.y > minYB1 && this.planeObj.tempPos.y < maxYB1 )
						{ 
							console.log("BOMB1 " + minYB1 + "  " + maxYB1 ); 
							this.decLives();
						}
				}
				/*//const minYB2= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[i].children[5]).min.y;
				//const maxYB2= new THREE.Box3().setFromObject(this.obstaclesObj.obstacles[i].children[6]).max.y;
				if (i == 0) {
					console.log("BOMB1 " + minYB1 + "  " + maxYB1 ); 
					console.log("BOMB2 " + minYB2 + "  " + maxYB2 ); 
				}
				   if (( this.planeObj.tempPos.y > minYB1 && this.planeObj.tempPos.y < maxYB1 ) 
					   || ( this.planeObj.tempPos.y > minYB2 && this.planeObj.tempPos.y < maxYB2 ))
				{ 
				this.decLives();
				}	*/
		}

		}
		
		
		if (this.active){
            this.obstaclesObj.update(this.planeObj.position);
        }

		
        this.updateCamera();
        this.renderer.render(this.scene, this.camera);


    }

    //2 part --->  /**/
    startGame() {
        const intro = document.getElementById('introduction');
        const btn = document.getElementById('startBtn');
		// 3 часть
		const gameover = document.getElementById('gameover');
		
		//3
        intro.style.display = 'none';
        btn.style.display = 'none';
		gameover.style.display = 'none';
		
		//3 часть
		this.score = 0;
        this.lives = 3;

        let elm = document.getElementById('score');
        elm.innerHTML = this.score;
        
        elm = document.getElementById('lives');
        elm.innerHTML = this.lives;

        this.planeObj.reset();
        this.obstaclesObj.reset();

        this.active = true;
	
	
		if ( this.planeObj.tempPos.z==this.obstaclesObj.obstacles[0].position.z){
			incScore();
		}
    }
    mouseDown(evt) {
        this.spaceKey = true;
    }
    mouseUp(evt) {
        this.spaceKey= false;
    }
    keyDown(evt) {
        switch (evt.keyCode) {
            case 32:
                this.spaceKey = true;
                break;
        }
    }
    keyUp(evt) {
        switch (evt.keyCode) {
            case 32:
                this.spaceKey = false;
                break;
        }
    }
       //2 part <---/**/
	   
	   
	gameOver(){
		this.active=false;
		
		const gameover =document.getElementById('gameover');
		const btn = document.getElementById('startBtn');
		gameover.style.display = 'block';
		btn.style.display = 'block';
		
	}
	
	incScore(){
		this.score++;
		
		const elm =document.getElementById('score');
		
		elm.innerHTML=this.score;
	}
	
	decLives(){
		this.lives--;
		
		const elm =document.getElementById('lives');
		
		elm.innerHTML=this.lives;
		
		if (this.lives==0) this.gameOver();
		
	}
}
export { Game };


