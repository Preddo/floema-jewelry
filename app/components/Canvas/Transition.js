import { Program, Mesh, Plane } from 'ogl'
import GSAP from 'gsap'

import vertex from 'shaders/plane-vertex.glsl'
import fragment from 'shaders/plane-fragment.glsl'

export default class Transition {
  constructor({ collections, details, url, gl, scene, sizes })
  {
    // this.from = collections || details
    this.gl = gl
    this.scene = scene
    this.geometry = new Plane(this.gl)
    this.sizes = sizes
    this.url = url

    this.collections = collections
    this.details = details


    this.extra = {
      x: 0,
      y: 0
    }
  }

  createProgram(texture )
  {
    this.program = new Program(this.gl, {
      fragment,
      vertex,
      uniforms: {
        uAlpha: { value: 1 },
        tMap: { value: texture }
      }
    })
  }

  createMesh(mesh)
  {
    this.mesh = new Mesh(this.gl, {
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.scale.x = mesh.scale.x
    this.mesh.scale.y = mesh.scale.y
    this.mesh.scale.z = mesh.scale.z

    this.mesh.rotation.x = mesh.rotation.x
    this.mesh.rotation.y = mesh.rotation.y
    this.mesh.rotation.z = mesh.rotation.z

    this.mesh.position.x = mesh.position.x
    this.mesh.position.y = mesh.position.y
    this.mesh.position.z = mesh.position.z + 0.01

    this.mesh.setParent(this.scene)
  }

  setElement(element) {
    if (element.id === 'collections') {
      const { index, medias } = element

      const media = medias[index]

      this.createProgram( media.texture)
      this.createMesh(media.mesh)

      this.transition = 'detail'
    } else {
      this.createProgram(element.texture)
      this.createMesh(element.mesh)

      this.transition = 'collections'
    }
  }

  /**
   * Animations
   */
  animate(element, onComplete)
  {
    const timeline = GSAP.timeline()

    timeline.to(this.mesh.position, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.position.x,
      y: element.position.y,
      z: element.position.z,
    }, 0)

    timeline.to(this.mesh.scale, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.scale.x,
      y: element.scale.y,
      z: element.scale.z,
    }, 0)

    timeline.to(this.mesh.rotation, {
      duration: 1.5,
      ease: 'expo.inOut',
      x: element.rotation.x,
      y: element.rotation.y,
      z: element.rotation.z,
    }, 0)

    timeline.call(_ => {
      onComplete()
    })

    timeline.call( _ => {
      this.scene.removeChild(this.mesh)
    }, null, '+=0.2')
  }

}


