import { Vector3 } from './additional_sourses/three.js-master/build/three.module.js';
import { GLTFLoader } from './additional_sourses/three.js-master/examples/jsm/loaders/GLTFLoader.js';

class Plane {
    constructor(gamePar) {
        this.stuffPath = gamePar.stuffPath;
        this.gameObj = gamePar;
        this.sceneObj = gamePar.scene;
        this.loading();
        this.tempPos = new Vector3();

    }

    get position() {
        if (this.planeModel !== undefined)
            this.planeModel.getWorldPosition(this.tempPos);
        return this.tempPos;

    }

    set visible(modePar) {
        this.planeModel.visible = modePar;

    }

    loading() {
        const loader = new GLTFLoader().setPath(`${this.stuffPath}models/`);
        this.ready = false;

        loader.load(
            'planeModel.glb',
            gltf => {
                this.sceneObj.add(gltf.scene);
                this.planeModel = gltf.scene;
				this.velocity = new Vector3(0, 0, 0.1);

                this.propellerObj = this.planeModel.getObjectByName("propeller");
                this.ready = true;

            }
        );

    }

    update(time) {
		//пропеллер крутится
        if (this.propellerObj !== undefined) this.propellerObj.rotateZ(1);
        //1 part
        /*
        this.planeModel.rotation.set(0,0, Math.sin(time*3)*0.2,'XYZ');
        this.planeModel.position.y=Math.cos(time)*1.5;
        */
       //2 part --->
	   //перемещение самолета в пространстве
        if (this.gameObj.active) {
            if (!this.gameObj.spaceKey) {
                this.velocity.y -= 0.001;
            }
            else {
                this.velocity.y += 0.001;
            }
            this.velocity.z += 0.0001;
            this.planeModel.rotation.set(0, 0, Math.sin(time * 3) * 0.2, 'XYZ');
            this.planeModel.translateZ(this.velocity.z);
            this.planeModel.translateY(this.velocity.y);
			//расстояние
			let u=this.velocity.distanceTo(this.tempPos);
			//console.log("PLANE y " + this.planeModel.position.y);
			//console.log("s =" + u);
				//console.log("planeY = " + this.planeModel.propellerObj.tempPos.y);
			
        } 
		else{
            this.planeModel.rotation.set(0, 0, Math.sin(time * 3) * 0.2, 'XYZ');
            this.planeModel.position.y = Math.cos(time) * 1.5;
		}
    }
        //2 part <---

		reset () {
		this.planeModel.position.set(0,0,0);
		this.velocity.set(0,0,0.1);
	}
	// узнать расстояние между самолетом и препятствием 
	// при расстоянии = 0 происходит изменение счета и добавление нового препятствия
	// this.velocity.distanceTo(this.tempPos);

}

export { Plane };