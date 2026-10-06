import {
	Box3, DirectionalLight, DoubleSide, Group, HemisphereLight, MathUtils,
	Mesh, MeshPhongMaterial, PerspectiveCamera, Scene, Sphere, Spherical, Vector3, WebGLRenderer
} from 'three';
import { OBJLoader } from 'three/addons/loaders/OBJLoader.js';
import { MTLLoader } from 'three/addons/loaders/MTLLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import type { BufferGeometry, Material, Texture } from 'three';

function disposeModel(model: Group) {
	const geometries = new Set<BufferGeometry>();
	const materials = new Set<Material>();
	const textures = new Set<Texture>();
	model.traverse((object) => {
		if (!(object instanceof Mesh)) return;
		geometries.add(object.geometry);
		for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
			materials.add(material);
			for (const value of Object.values(material)) {
				if (value && typeof value === 'object' && 'isTexture' in value) textures.add(value as Texture);
			}
		}
	});
	geometries.forEach((geometry) => geometry.dispose());
	materials.forEach((material) => material.dispose());
	textures.forEach((texture) => texture.dispose());
}

// Imported only when the viewer is needed. Render on interaction or resize,
// rather than running a permanent animation loop for a static CAD model.
export function createObjViewer(canvas: HTMLCanvasElement) {
	const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true });
	renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
	const scene = new Scene();
	const camera = new PerspectiveCamera(42, 1, 0.01, 100);
	const controls = new OrbitControls(camera, canvas);
	controls.enableDamping = false;
	controls.minDistance = 0.15;
	controls.maxDistance = 30;
	controls.rotateSpeed = 0.7;
	controls.zoomSpeed = 0.8;
	const ambient = new HemisphereLight(0xffffff, 0x64748b, 2);
	const key = new DirectionalLight(0xffffff, 2.5);
	key.position.set(3, 6, 5);
	const fill = new DirectionalLight(0xffffff, 1);
	fill.position.set(-4, 2, -3);
	scene.add(ambient, key, fill);
	let model: Group | undefined;
	let disposed = false;
	let radius = 1;
	let previousWidth = 0;
	let previousHeight = 0;

	function render() {
		if (!disposed) renderer.render(scene, camera);
	}
	function reset() {
		const vertical = MathUtils.degToRad(camera.fov);
		const horizontal = 2 * Math.atan(Math.tan(vertical / 2) * camera.aspect);
		const distance = radius / Math.sin(Math.min(vertical, horizontal) / 2) * 1.12;
		controls.target.set(0, 0, 0);
		camera.position.set(0.6, 0.85, 1).normalize().multiplyScalar(distance);
		controls.update();
		render();
	}
	function resize() {
		const { width, height } = canvas.getBoundingClientRect();
		if (!width || !height) return;
		if (width === previousWidth && height === previousHeight) return;
		previousWidth = width;
		previousHeight = height;
		// Preserve rotation, pan, and relative zoom when the viewport changes.
		const halfFov = MathUtils.degToRad(camera.fov) / 2;
		const oldLimit = Math.atan(Math.tan(halfFov) * Math.min(1, camera.aspect));
		const newLimit = Math.atan(Math.tan(halfFov) * Math.min(1, width / height));
		if (model) {
			const offset = camera.position.clone().sub(controls.target);
			camera.position.copy(controls.target).add(offset.multiplyScalar(Math.sin(oldLimit) / Math.sin(newLimit)));
		}
		camera.aspect = width / height;
		camera.updateProjectionMatrix();
		renderer.setSize(width, height, false);
		controls.update();
		render();
	}
	controls.addEventListener('change', render);
	const resizeObserver = new ResizeObserver(resize);
	resizeObserver.observe(canvas);
	resize();

	return {
		load(obj: string, mtl: string, zUp: boolean) {
			const materials = new MTLLoader().parse(mtl, '');
			const next = new OBJLoader().setMaterials(materials).parse(obj);
			if (zUp) next.rotation.x = -Math.PI / 2;
			const bounds = new Box3().setFromObject(next);
			const size = bounds.getSize(new Vector3());
			const largestDimension = Math.max(size.x, size.y, size.z);
			if (!Number.isFinite(largestDimension) || largestDimension <= 0) {
				disposeModel(next);
				throw new Error('The model contains no displayable geometry.');
			}
			// Normalize only the displayed object, leaving source OBJ files unchanged.
			const scale = 2 / largestDimension;
			next.position.copy(bounds.getCenter(new Vector3())).multiplyScalar(-scale);
			next.scale.setScalar(scale);
			next.traverse((object) => {
				if (!(object instanceof Mesh)) return;
				for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
					material.side = DoubleSide;
					// Fusion exports its clear diffuser appearance as opaque black in MTL.
					// Restore a visible translucent surface without changing the source files.
					if (material instanceof MeshPhongMaterial && material.name === 'Clear') {
						material.color.set(0xdcebea);
						material.transparent = true;
						material.opacity = 0.7;
						material.depthWrite = false;
					}
				}
			});
			if (model) { scene.remove(model); disposeModel(model); }
			model = next;
			scene.add(model);
			radius = new Box3().setFromObject(model).getBoundingSphere(new Sphere()).radius;
			reset();
		},
		reset,
		zoom(factor: number) {
			const offset = camera.position.clone().sub(controls.target);
			const distance = MathUtils.clamp(offset.length() * factor, controls.minDistance, controls.maxDistance);
			camera.position.copy(controls.target).add(offset.setLength(distance));
			controls.update();
			render();
		},
		rotate(horizontal: number, vertical: number) {
			const orbit = new Spherical().setFromVector3(camera.position.clone().sub(controls.target));
			orbit.theta += horizontal;
			orbit.phi = MathUtils.clamp(orbit.phi + vertical, 0.05, Math.PI - 0.05);
			camera.position.copy(controls.target).add(new Vector3().setFromSpherical(orbit));
			controls.update();
			render();
		},
		dispose() {
			disposed = true;
			resizeObserver.disconnect();
			controls.removeEventListener('change', render);
			controls.dispose();
			if (model) disposeModel(model);
			scene.clear();
			renderer.dispose();
			renderer.forceContextLoss();
		}
	};
}

export type ObjViewer = ReturnType<typeof createObjViewer>;
