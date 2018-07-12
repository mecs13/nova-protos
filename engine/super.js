import * as THREE from 'three'

import Camera from './camera.ts'
import Controls from './controls.ts'

class Super {
    constructor() {
        // Initialize attributes
        this.container = null
        this.camera = null
        this.controls = null
        this.scene = null
        this.renderer = null
        this.light = null

        // bindings
        this.init = this.init.bind(this)
        //this.updateScene = this.updateScene.bind(this)
        this.animate = this.animate.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.initLight = this.initLight.bind(this)
        this.initScene = this.initScene.bind(this)
        this.initDOM = this.initDOM.bind(this)
        this.initRenderer = this.initRenderer.bind(this)

    }
    init() {
        this.initDOM()
        this.initScene()
        this.initRenderer()
        this.initLight()

        //innitializing camera of bloomaway class
        this.camera = new Camera(this.scene)
        this.controls = new Controls(this.camera.getInstance(), this.scene)
    }
    initDOM() {
        this.container = document.createElement('div')
        document.body.appendChild(this.container)
        window.addEventListener('resize', this.onWindowResize, false)
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
    }
    initLight() {
        this.light = new THREE.HemisphereLight(0xbbbbff, 0x444422)
        this.light.position.set(0, 1, 0)
        this.scene.add(this.light)
    }
    onWindowResize() {
        this.camera.onWindowResize()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    animate() {
        requestAnimationFrame(this.animate)
        this.renderer.render(this.scene, this.camera.getInstance())
        this.controls.update()
    }
}

export default Super
