import Torus from '../../bloomaway/js/torus.js'
import Controls from '../../bloomaway/js/controls.js'

class audioXR {
    constructor() {
        this.renderer = null
        this.scene = null
        this.camera = null
        this.uniforms = null
        this.displacement = null
        this.geometry = null
        this.plane = null
        this.torus = null
        this.controls = null

        this.init = this.init.bind(this)
        this.init = this.init.bind(this)
        this.animate = this.animate.bind(this)
        this.applyDisplacements = this.applyDisplacements.bind(this)
        this.onWindowResize = this.onWindowResize.bind(this)
        this.render = this.render.bind(this)

        this.init()
        this.animate()
    }
    init() {
        // Camera setup
        this.camera = new THREE.PerspectiveCamera(30, window.innerWidth / window.innerHeight, 1, 10000)
        this.camera.position.z = 60
        this.camera.position.x = 5

        // Scene setup
        this.scene = new THREE.Scene()

        this.controls = new Controls(this.camera, this.scene)

        // Shader variables setup
        this.uniforms = {
            amplitude: {
                value: 10,
            },
            scaleFactor: {
                value: 1.0,
            },
            texture: {
                value: new THREE.TextureLoader().load('textures/about-us.png'),
            }
        }
        this.uniforms.texture.value.wrapS = this.uniforms.texture.value.wrapT = THREE.MirroredRepeatWrapping
        const shaderMaterial = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: document.getElementById('vertexshader').textContent,
            fragmentShader: document.getElementById('fragmentshader').textContent,
            side: THREE.DoubleSide,
        })

        // setting up the geometry
        // play with controls on: https://threejs.org/docs/#api/geometries/PlaneBufferGeometry
        this.geometry = new THREE.SphereBufferGeometry(5, 32, 32)

        // Deforming plane with displacements
        this.displacement = new Float32Array(this.geometry.attributes.position.count)
        this.applyDisplacements(this.displacement)

        // Setting up the shaders' attributes
        this.geometry.addAttribute('displacement', new THREE.BufferAttribute(this.displacement, 1))

        // Creating the mesh
        this.plane = new THREE.Mesh(this.geometry, shaderMaterial)

        // Adding the mesh to our scene
        this.scene.add(this.plane)

        // Rendering
        this.renderer = new THREE.WebGLRenderer()
        this.renderer.setPixelRatio(window.devicePixelRatio)
        this.renderer.setSize(window.innerWidth, window.innerHeight)
        const container = document.getElementById('container')
        container.appendChild(this.renderer.domElement)

        // Event listeners
        window.addEventListener('resize', this.onWindowResize, false)
    }
    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight
        this.camera.updateProjectionMatrix()
        this.renderer.setSize(window.innerWidth, window.innerHeight)
    }
    applyDisplacements(displacement) {
        for (let i = 0; i < displacement.length; i++) {
            if(window.data && i % 2 === 0) {
                const x = window.data[i % window.data.length] / 128
                displacement[i] = 0.2 * Math.pow(x, 2)
            }
        }
    }
    animate() {
        requestAnimationFrame(this.animate)
        this.render()
    }
    render() {
        const time = Date.now() * 0.001

        // Rotating and scaling plane wrt time
        this.plane.rotation.z = 0.5 * time
        this.plane.rotation.y = 0.5 * time
        this.uniforms.scaleFactor.value = 1

        this.applyDisplacements(this.displacement)
        this.geometry.attributes.displacement.needsUpdate = true

        // Render
        this.renderer.render(this.scene, this.camera)
    }
}

window.audioXR = new audioXR()