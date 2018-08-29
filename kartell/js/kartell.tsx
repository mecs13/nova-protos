// kartell
import * as ReactDOM from "react-dom";
import * as React from "react";
import "aframe";

const Model = (props: {
    isSelected: boolean,
    position: string,
    collisionBoxScale: string,
    collisionBoxPosition: string,
}) => (
  <a-entity position={props.position}>
    <a-obj-model
      id="model"
      foo={()=> console.log(props) }
      scale="0.013 0.013 0.013"
      src="./kartell/obj/chair.obj"
      material={"color: " + (props.isSelected ? "red" : "green")}
    />
    <a-entity
      class="collidable"
      geometry="primitive: box"
      material={
        "color: rgba(0, 0, 0); opacity: " + (props.isSelected ? "0.3" : "0.0")
      }
      scale={ props.collisionBoxScale }
      position={ props.collisionBoxPosition }
    />
  </a-entity>
);

export interface AppState {
  triggerDown: boolean;
  intersection: boolean;
  modelPosition: THREE.Vector3;
}

const defaultState = {
  triggerDown: false,
  intersection: false,
  modelPosition: new THREE.Vector3(2.5, 0, 2.5),
};

class App extends React.Component<{}, AppState> {
  raq: number;
  modelDistance: number;
  constructor(props) {
    super(props);

    this.state = defaultState;

    this.modelDistance = 0

    this.update = this.update.bind(this);
    this.isSelected = this.isSelected.bind(this);

    this.update();

    document.addEventListener("triggerdown", () => {
      this.setState({triggerDown: true});
    });

    document.addEventListener("triggerup", () => {
      this.setState({triggerDown: false});
    });

    document.addEventListener("raycaster-intersected", (e: CustomEvent) => {
      const {el, intersection} = e.detail;

      this.modelDistance = intersection.distance;

      this.setState({intersection: true});
    });

    document.addEventListener(
      "raycaster-intersected-cleared",
      (e: CustomEvent) => {
        this.setState({intersection: false});
      },
    );

    document.addEventListener("trackpaddown", (e: CustomEvent) => {
      if (this.isSelected()) this.modelDistance += 0.25;
        console.log(this.modelDistance)
    });
    document.addEventListener("thumbstickdown", (e: CustomEvent) => {
      if (this.isSelected()) this.modelDistance -= 0.25;
    });
  }

  update() {
    this.raq = requestAnimationFrame(() => {
      if (this.isSelected()) {
        const raycasterDirection = AFRAME.scenes[0].querySelector("[raycaster]")
          .components.raycaster.raycaster.ray.direction.clone();

        const modelPosition = raycasterDirection
          .normalize()
          .multiplyScalar(this.modelDistance);

        this.setState({modelPosition});
      }
      this.update();
    });
  }
  isSelected() {
    return this.state.triggerDown && this.state.intersection
  }
  render() {
    const modelPosition = this.state.modelPosition.x
                        + " "
                        + (this.isSelected() ? 0.2 : 0)
                        + " "
                        + this.state.modelPosition.z

    return (
      <a-scene>
        <a-obj-model
          src="./kartell/obj/kartell-room.obj"
          mtl="./kartell/obj/kartell-room.mtl"
        />
        <Model
          collisionBoxPosition="0 0.55 0"
          collisionBoxScale="0.85 1.171 0.8"
          position={modelPosition}
          isSelected={this.isSelected()} />
        <a-obj-model
          id="collision-box"
          src="./kartell/obj/Collision.obj"
          mtl="./kartell/obj/Collision.mtl"
          scale="0.9 0.9 0.9"
          visible="false"
        />
        <a-sky color="#ECECEC" />
        <a-entity
          laser-controls="hand: right"
          raycaster="objects: .collidable; recursive: true"
          line="color: red; opacity: 0.75"
        />
      </a-scene>
    );
  }
}

ReactDOM.render(<App />, document.getElementById("mount-point"));
