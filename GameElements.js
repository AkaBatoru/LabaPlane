import { Group, Vector3 } from './additional_sourses/three.js-master/build/three.module.js';
import { GLTFLoader } from './additional_sourses/three.js-master/examples/jsm/loaders/GLTFLoader.js';
import { Raycaster} from './additional_sourses/three.js-master/src/core/Raycaster.js';

class GameElements {
    constructor (gamePar) {
		this.stuffPath = gamePar.stuffPath;
		this.gameObj = gamePar;
		this.sceneObj = gamePar.scene;
		this.loadingStar() ;
		this.loadingBomb();
		this.tempPos = new Vector3();
    }

    loadingStar() {
		const loader = new GLTFLoader( ).setPath(`${this.stuffPath}models/`);
		this.ready = false;
		loader.load ('star.glb', gltf => {
			this.starModel = gltf.scene.children[0];
			this.starModel.name = 'star';
			if (this.bombModel !== undefined) this.initialize();
		});
		
    }

	loadingBomb () {
		const loader = new GLTFLoader( ).setPath(`${this.stuffPath}models/`);
		loader.load('bomb.glb', gltf => {

			this.bombModel = gltf.scene.children[0];
			if (this.starModel !== undefined) this.initialize();
		}); 
    }

	initialize (){
		this.obstacles = [];
		
		const obstacleGroup = new Group();
		obstacleGroup.add(this.starModel);
		
		this.bombModel.rotation.x = -Math.PI*0.5;
		this.bombModel.position.y = 7.5;
		
		obstacleGroup.add(this.bombModel);
		
		let rotate=true;
		
		for(let y=6; y>-6; y-=2){
			rotate = !rotate;
			if (y==0) continue;
			const bombModel = this.bombModel.clone();
			bombModel.rotation.x =(rotate) ? -Math.PI*0.5 : 0;
			bombModel.position.y =y;
			obstacleGroup.add (bombModel);
		}

		this.obstacles.push (obstacleGroup);
		this.sceneObj.add(obstacleGroup);
		for(let i=0; i<7; i++){
			const obstacles=obstacleGroup.clone();
			this.sceneObj.add (obstacles) ;
			this.obstacles.push(obstacles);
			
		}
		this.gameObj.test1();
		this.reset();
		this.ready=true;
	}
	
	reset () {
		this.obstaclePos =
		{
			/* стартовая позиция*/
			pos: 15,
			/* смещение по вертикали */
			offset: 5
		};
		this.obstacles.forEach( obstacle => this.positioningObstacle(obstacle));
	}
    
	positioningObstacle( obstaclePar ) {
		this.obstaclePos.pos += 30;
		const offset = (Math.random()*2 - 1)* this.obstaclePos.offset;
		this.obstaclePos.offset += 0.2;
		obstaclePar.position.set(0, offset, this.obstaclePos.pos );
		obstaclePar.children[0].rotation.y = Math.random() * Math.PI * 2;
		obstaclePar.userData.hit = false;
	}

	update (postPar) {
		
	}
	
	hit (objPar) {
		
	}
	/* Столкновение
	https://threejs.org/docs/#api/en/core/Raycaster
		var ray = new THREE.Raycaster( position, vectors[i].sub(position).normalize() );
		var intersects = ray.intersectObjects( objs );
		if ( intersects.length > 0 && intersects[0].distance <= 10) 
		{
			Объекты находятся на дистанции меньше заданной
		}
	*/

   
}
export { GameElements };


