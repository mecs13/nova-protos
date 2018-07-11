/**
 * @fileOverview
 * @name torus.js
 * @author Nova Media LLC
 * @license TBD

 This class defines the Torus, our UI for VR applications. So far, it handles mounting the Torus interface (map, ground, and shell) and provides an API for creating basic buttons that respond to clicks

 */

import {
    SphereButton,
    CubeButton,
    TorusButton,
} from './Button.js'

import {
    getObj,
} from './helpers.js'

/**
 * Handles instantiating a Torus UI
 * @param {THREE.scene} scene - Scene to mount Torus into
 * @param {Controls} controls - Controls to bind button clicks to
 */
class Torus {
    constructor(scene, controls) {
        this.scene = scene
        this.controls = controls
        this.torus = {
            buttons: [],
        }

        this.init = this.init.bind(this)
        this.createButton = this.createButton.bind(this)

        this.init()
    }
    /**
    * Initialized the Torus by importing its geometry and mounting it into the scene
    */
    init() {
        const cb = attrName => object => {
            this.scene.add(object)
            const d = {}
            d.geometry = object
            this.torus[attrName] = d
        }
        const getOptions = s => ({
            scale: {x: s, y: s, z: s},
        })

        const s = 20
        getObj('map/map', cb('map'), getOptions(s))
        getObj('ground/ground', cb('ground'), getOptions(s))
        getObj('shell/shell', cb('shell'), getOptions(0))
    }
    /**
    * Creates a button on the Torus
    * @param {funciton} onClick - Callback to be called when button is clicked
    * @param {dict} _options - Button options
    */
    createButton(onClick, options = {}) {
        let button

        if(options.shape === 'sphere')
            button = new SphereButton(this.controls, onClick, options)
        else if(options.shape === 'torus')
            button = new TorusButton(this.controls, onClick, options)
        else
            button = new CubeButton(this.controls, onClick, options)

        // Add to scene and keep reference
        this.scene.add(button.getInstance())
        this.torus.buttons.push(button)
    }
}

export default Torus
