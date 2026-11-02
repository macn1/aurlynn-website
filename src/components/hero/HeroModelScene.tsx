"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, MeshReflectorMaterial, PerformanceMonitor, useGLTF } from "@react-three/drei";
import { CanvasTexture, Color, Fog, NoToneMapping, MathUtils, Mesh, MeshPhysicalMaterial, Object3D, Quaternion, SRGBColorSpace, Vector3 } from "three";
import type { Group } from "three";
import { heroMotion } from "@/lib/animation/heroMotion";
import { downgradeTier, type Tier } from "@/lib/quality";

const MODEL_URL = "/models/aurlynn_acoustic_sphere.glb";
// Sphere centre in the model; the camera is framed so this lands on CY of the art.
const SPHERE_Y = 1.45;

type Disc = { node: Object3D; base: Vector3; quat: Quaternion; side: 1 | -1; index: number };

const axisX = new Vector3(1, 0, 0);
const axisZ = new Vector3(0, 0, 1);
const axisY = new Vector3(0, 1, 0);
const YAW = 0.4; // turns each plate toward the camera so it reads as an ellipse, not an edge
const tmpQ = new Quaternion();

type Parts = { sphere: Object3D | null; discs: Disc[] };

function Model() {
  const gltf = useGLTF(MODEL_URL);
  const group = useRef<Group>(null);
  const parts = useRef<Parts>({ sphere: null, discs: [] });
  const root = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  // Index the authored nodes once and tune the glass: warm attenuation for thickness, frosted discs.
  useEffect(() => {
    const found: Parts = { sphere: null, discs: [] };
    root.children.forEach((node) => {
      if (node.name.startsWith("CentralSphere")) found.sphere = node;
      const m = node.name.match(/^(Left|Right)Disc(\d\d)_Glass/);
      if (m) {
        const side = m[1] === "Left" ? -1 : 1;
        found.discs.push({
          node,
          base: node.position.clone(),
          quat: new Quaternion().setFromAxisAngle(axisY, -side * YAW).multiply(node.quaternion),
          side,
          index: Number(m[2]) - 1,
        });
      }
    });
    parts.current = found;

    root.traverse((o) => {
      const mesh = o as Mesh;
      if (!mesh.isMesh) return;
      const mat = mesh.material as MeshPhysicalMaterial;
      if (mat.transmission > 0) {
        const isSphere = mesh.name.startsWith("CentralSphere");
        mat.thickness = isSphere ? 0.9 : 0.3;
        mat.color = new Color("#ffffff");
        mat.attenuationColor = new Color("#fff3e8");
        mat.attenuationDistance = isSphere ? 9 : 5;
        mat.roughness = isSphere ? 0.02 : 0.14;
        mat.envMapIntensity = isSphere ? 1.7 : 1.4;
        mat.needsUpdate = true;
      } else {
        mat.envMapIntensity = 1.4;
      }
    });
  }, [root]);

  useFrame(({ clock }, delta) => {
    const t = clock.elapsedTime;
    const m = heroMotion;
    const { sphere, discs } = parts.current;
    const g = group.current;
    if (g) {
      g.rotation.y = MathUtils.damp(g.rotation.y, m.px * 0.16, 3, delta);
      g.rotation.x = MathUtils.damp(g.rotation.x, m.py * 0.05, 3, delta);
    }
    if (sphere) {
      sphere.scale.setScalar(1 - 0.16 * m.scroll);
      sphere.position.y = SPHERE_Y + Math.sin(t * 0.7) * 0.04 + m.scroll * 0.12;
      sphere.rotation.y = t * 0.05;
    }
    for (const d of discs) {
      const phase = d.index * 1.3 + (d.side === 1 ? 0.6 : 0);
      const spread = 1 + 0.35 * m.scroll;
      d.node.position.set(
        d.base.x * spread,
        d.base.y + Math.sin(t * 0.55 + phase) * 0.035,
        d.base.z + Math.sin(t * 0.4 + phase * 0.7) * 0.07,
      );
      // independent wobble layered over the authored orientation
      tmpQ.setFromAxisAngle(axisX, Math.sin(t * 0.35 + phase) * 0.035 + m.px * 0.03 * d.side);
      d.node.quaternion.copy(d.quat).multiply(tmpQ);
      tmpQ.setFromAxisAngle(axisZ, Math.sin(t * 0.3 + phase * 1.2) * 0.025);
      d.node.quaternion.multiply(tmpQ);
      d.node.scale.setScalar(1 - 0.08 * m.scroll);
    }
  });

  return (
    <group ref={group}>
      <primitive object={root} />
    </group>
  );
}

/** Warm pool of light on the floor under the sphere. */
function FloorGlow() {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = c.height = 512;
    const ctx = c.getContext("2d")!;
    const g = ctx.createRadialGradient(256, 256, 0, 256, 256, 256);
    g.addColorStop(0, "rgba(255,206,160,0.9)");
    g.addColorStop(1, "rgba(255,200,150,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 512, 512);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, []);
  useEffect(() => () => tex.dispose(), [tex]);
  return (
    <mesh position={[0, 0.2, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
      <planeGeometry args={[18, 7]} />
      <meshBasicMaterial map={tex} transparent depthWrite={false} toneMapped={false} opacity={0.5} />
    </mesh>
  );
}

/** Glossy floor: blurred, distance-faded reflections of the sphere and plates, like the studio render. */
function Floor({ lite }: { lite: boolean }) {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, SPHERE_Y - 1.25 - 0.005, -3]}>
      <planeGeometry args={[60, 22]} />
      <MeshReflectorMaterial
        color="#f6dccd"
        mirror={0.55}
        blur={lite ? [500, 200] : [1100, 420]}
        mixBlur={3.2}
        mixStrength={lite ? 0.7 : 1}
        resolution={lite ? 384 : 1024}
        depthScale={2.2}
        minDepthThreshold={0.25}
        maxDepthThreshold={1.5}
        roughness={0.9}
        metalness={0}
        envMapIntensity={0.15}
        emissive="#f8eee8"
        emissiveIntensity={0.68}
      />
    </mesh>
  );
}

function Invalidate({ animate }: { animate: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!animate) invalidate();
  }, [animate, invalidate]);
  return null;
}

type Props = { tier: Tier; lite: boolean; animate: boolean; active: boolean; onReady: () => void };

export default function HeroModelScene({ tier, lite, animate, active, onReady }: Props) {
  const full = tier === "high" && !lite;
  return (
    <Canvas
      frameloop={animate && active ? "always" : "demand"}
      dpr={full ? [1, 1.75] : 1}
      camera={{ position: [0, SPHERE_Y - 0.15, 14], fov: 15, near: 0.1, far: 60 }}
      gl={{ antialias: full, powerPreference: "high-performance" }}
      onCreated={({ camera, scene, gl }) => {
        gl.toneMapping = NoToneMapping;
        // refraction buffer at half resolution on lighter tiers
        (gl as unknown as { transmissionResolutionScale?: number }).transmissionResolutionScale = full ? 1 : 0.5;
        camera.lookAt(0, SPHERE_Y - 0.15, 0);
        // Transmission refracts what is behind the glass; an opaque page-matched backdrop keeps it cream, not white.
        scene.background = new Color("#f8eee8");
        scene.fog = new Fog("#f8eee8", 16, 34);
        onReady();
      }}
      aria-hidden
    >
      <PerformanceMonitor bounds={() => [36, 60]} flipflops={1} ms={300} iterations={8} onDecline={downgradeTier} />
      <Environment resolution={full ? 512 : 128} frames={1}>
        {/* soft fill, kept low so the glass stays clear */}
        <Lightformer form="rect" intensity={1} color="#fff1e4" position={[0, 3, -8]} scale={[26, 10, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#ffe7d2" position={[0, -3, 6]} scale={[20, 2, 1]} />
        {/* crisp softboxes: these become the highlights on the sphere and plates */}
        <Lightformer form="rect" intensity={7} color="#ffffff" position={[-4.5, 4, 5]} scale={[3.2, 2.2, 1]} />
        <Lightformer form="rect" intensity={4.5} color="#ffd9b0" position={[6, 0.5, 3]} scale={[1.2, 5, 1]} />
        <Lightformer form="rect" intensity={3} color="#ffffff" position={[-7, 0, 2]} scale={[0.8, 6, 1]} />
        <Lightformer form="ring" intensity={3} color="#fff6ec" position={[0, 6, 1]} scale={4} />
      </Environment>
      <ambientLight intensity={0.5} color="#fff1e4" />
      {full && <Floor lite={lite} />}
      <FloorGlow />
      <Model />
      <Invalidate animate={animate} />
    </Canvas>
  );
}

useGLTF.preload(MODEL_URL);
