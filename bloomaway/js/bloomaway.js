class Bloomaway {
    constructor() {
        this.container = null
        this.camera = null
        this.scene = null
        this.renderer = null
        this.light = null
        this.gltf = null
        this.obj = []

        this.init = this.init.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.getObj = this.getObj.bind(this)
        this.getGltf = this.getGltf.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initRenderer = this.initRenderer.bind(this)

        this.init()
        this.animate()
    }
    init() {
        // Bind to DOM
				this.container = document.createElement('div')
				document.body.appendChild(this.container)
				window.addEventListener('resize', this.onWindowResize, false)

        this.initScene()
        this.initRenderer()
        this.initLight()
        this.camera = new Camera(this.scene, this.renderer)
    }
    initRenderer() {
				this.renderer = new THREE.WebGLRenderer({ antialias: true })
				this.renderer.setPixelRatio(window.devicePixelRatio)
				this.renderer.setSize(window.innerWidth, window.innerHeight)
				this.renderer.gammaOutput = true
				this.container.appendChild(this.renderer.domElement)
    }
    initScene() {
				this.scene = new THREE.Scene()

				// Models
        const scaleCallback = obj => obj.scale.set(2, 2, 2)
        this.getObj('map/map', scaleCallback)
        this.getObj('ground/ground', scaleCallback)
        this.getObj('shell/shell', scaleCallback)
        this.getGltf('bateau/scene', scaleCallback)
    }
    initLight() {
				this.light = new THREE.HemisphereLight(0xbbbbff, 0x444422)
				this.light.position.set(0, 1, 0)
				this.scene.add(this.light)
    }
    getGltf(name) {
        const loader = new THREE.GLTFLoader()
        loader.load('gltf/' + name + '.gltf', gltf => {
            this.gltf = gltf
            const s = 0.001
            this.gltf.scene.scale.set(s, s, s)
            this.gltf.scene.position.x = -5
            this.gltf.scene.position.z = 9
            this.gltf.scene.position.y = 21
            this.gltf.scene.rotateOnAxis(new THREE.Vector3(0, 1, 0), Math.PI / 2)
         	  this.scene.add(this.gltf.scene)
        });
    }
    getObj(name, callback = () => {}) {
        const onProgress = () => {}
        const onError = e => { console.log(e) }
				new THREE.MTLLoader()
            .setPath('obj/')
            .load(name + '.mtl', materials => {
                materials.preload()
                console.log(materials)
                new THREE.OBJLoader()
                    .setMaterials(materials)
                    .setPath('obj/')
                    .load( name + '.obj', object => {
                        object.position.x = 0
                        object.position.y = 0
                        object.position.z = 0

                        const s = 1
                        object.scale.set(s, s, s)

                        this.scene.add(object)
                        this.obj.push(object)

                        callback(object)
                    }, onProgress, onError)
            });
    }
		onWindowResize() {
				this.camera.onWindowResize()
				this.renderer.setSize(window.innerWidth, window.innerHeight)
		}
		animate() {
				requestAnimationFrame(this.animate)
				this.renderer.render(this.scene, this.camera.getInstance())

        this.camera.animate()
		}
}

window.bloomaway = new Bloomaway()
