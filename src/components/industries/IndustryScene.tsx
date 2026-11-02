"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Environment, Lightformer } from "@react-three/drei";
import {
  BufferGeometry,
  CatmullRomCurve3,
  ExtrudeGeometry,
  Float32BufferAttribute,
  Group,
  MathUtils,
  Mesh,
  MeshStandardMaterial,
  Shape,
  Vector3,
} from "three";
import type { IndustryId } from "./industries";

const IVORY = "#f3ebe2";
const WARM = "#ffd9a8";
const CHAMPAGNE = "#d4a574";

/* ------------------------------------------------------------------ Automotive */

const ROAD_POINTS = [
  [-4.6, 0, 0.9],
  [-3.4, 0, -1.2],
  [-0.6, 0, -2.3],
  [2.6, 0, -1.7],
  [4.5, 0, 0.1],
  [3.3, 0, 1.9],
  [0.2, 0, 2.2],
  [-2.6, 0, 2.0],
].map(([x, y, z]) => new Vector3(x, y, z));

function buildRibbon(curve: CatmullRomCurve3, half: number, y: number) {
  const N = 240;
  const pos: number[] = [];
  const idx: number[] = [];
  for (let i = 0; i <= N; i++) {
    const u = (i / N) % 1;
    const p = curve.getPointAt(u);
    const t = curve.getTangentAt(u);
    const nx = -t.z;
    const nz = t.x;
    pos.push(p.x + nx * half, y, p.z + nz * half, p.x - nx * half, y, p.z - nz * half);
    if (i < N) {
      const a = i * 2;
      idx.push(a, a + 1, a + 2, a + 1, a + 3, a + 2);
    }
  }
  const g = new BufferGeometry();
  g.setAttribute("position", new Float32BufferAttribute(pos, 3));
  g.setIndex(idx);
  g.computeVertexNormals();
  return g;
}

function useRoad() {
  const curve = useMemo(() => new CatmullRomCurve3(ROAD_POINTS, true, "catmullrom", 0.5), []);
  const geometry = useMemo(() => buildRibbon(curve, 0.78, 0.03), [curve]);
  const shoulder = useMemo(() => buildRibbon(curve, 0.98, 0.012), [curve]);
  const edgeGeometry = useMemo(() => {
    const pts = curve.getSpacedPoints(300).map((p) => new Vector3(p.x, 0.05, p.z));
    return new BufferGeometry().setFromPoints(pts);
  }, [curve]);
  useEffect(
    () => () => {
      geometry.dispose();
      shoulder.dispose();
      edgeGeometry.dispose();
    },
    [geometry, shoulder, edgeGeometry],
  );
  return { curve, geometry, shoulder, edgeGeometry };
}

function Wheel({ x, z, wheelRefs }: { x: number; z: number; wheelRefs: React.RefObject<Group[]> }) {
  return (
    <group position={[x, 0.17, z]}>
      <group
        ref={(g) => {
          if (g && wheelRefs.current && !wheelRefs.current.includes(g)) wheelRefs.current.push(g);
        }}
      >
        <mesh rotation={[Math.PI / 2, 0, 0]}>
          <cylinderGeometry args={[0.17, 0.17, 0.14, 24]} />
          <meshStandardMaterial color="#1f1d1c" roughness={0.6} />
        </mesh>
        {/* spokes so the rotation is readable */}
        <mesh position={[0, 0, z > 0 ? 0.075 : -0.075]}>
          <boxGeometry args={[0.2, 0.03, 0.012]} />
          <meshStandardMaterial color="#8d7d6b" metalness={0.6} roughness={0.35} />
        </mesh>
        <mesh position={[0, 0, z > 0 ? 0.075 : -0.075]}>
          <boxGeometry args={[0.03, 0.2, 0.012]} />
          <meshStandardMaterial color="#8d7d6b" metalness={0.6} roughness={0.35} />
        </mesh>
      </group>
    </group>
  );
}

function Car({ curve, animate }: { curve: CatmullRomCurve3; animate: boolean }) {
  const group = useRef<Group>(null);
  const wheels = useRef<Group[]>([]);
  const progress = useRef(0.02);
  const prev = useRef(new Vector3());
  const camTarget = useRef(new Vector3());
  const length = useMemo(() => curve.getLength(), [curve]);
  const { bodyGeo, glassGeo } = useMemo(() => {
    // side profile (x = length, y = height), extruded across the width with a soft bevel
    const body = new Shape();
    body.moveTo(-0.88, 0.14);
    body.lineTo(-0.9, 0.34);
    body.bezierCurveTo(-0.9, 0.42, -0.78, 0.46, -0.64, 0.47);
    body.bezierCurveTo(-0.5, 0.56, -0.38, 0.7, -0.2, 0.72);
    body.bezierCurveTo(0.05, 0.74, 0.24, 0.72, 0.42, 0.52);
    body.bezierCurveTo(0.6, 0.45, 0.84, 0.42, 0.92, 0.32);
    body.lineTo(0.92, 0.14);
    body.closePath();
    const glass = new Shape();
    glass.moveTo(-0.5, 0.49);
    glass.bezierCurveTo(-0.42, 0.6, -0.34, 0.69, -0.2, 0.7);
    glass.bezierCurveTo(0, 0.72, 0.16, 0.7, 0.34, 0.52);
    glass.closePath();
    return {
      bodyGeo: new ExtrudeGeometry(body, { depth: 0.6, bevelEnabled: true, bevelSize: 0.05, bevelThickness: 0.06, bevelSegments: 6, curveSegments: 24 }),
      glassGeo: new ExtrudeGeometry(glass, { depth: 0.63, bevelEnabled: true, bevelSize: 0.012, bevelThickness: 0.012, bevelSegments: 2, curveSegments: 24 }),
    };
  }, []);
  useEffect(
    () => () => {
      bodyGeo.dispose();
      glassGeo.dispose();
    },
    [bodyGeo, glassGeo],
  );

  useFrame(({ camera }, delta) => {
    const g = group.current;
    if (!g) return;
    if (animate) progress.current = (progress.current + (delta * 0.9) / length) % 1;
    const p = curve.getPointAt(progress.current);
    const ahead = curve.getPointAt((progress.current + 0.004) % 1);
    g.position.copy(p);
    g.rotation.y = Math.atan2(-(ahead.z - p.z), ahead.x - p.x);
    const dist = p.distanceTo(prev.current);
    prev.current.copy(p);
    if (dist < 1) wheels.current.forEach((w) => (w.rotation.z -= dist / 0.17));

    // camera tracks the car subtly, keeping the road in frame
    camTarget.current.lerp(p, 1 - Math.pow(0.35, delta));
    const cx = camTarget.current.x * 0.32 + 0.3;
    const cz = camTarget.current.z * 0.2;
    camera.position.x = MathUtils.damp(camera.position.x, cx + 1.8, 2, delta);
    camera.position.z = MathUtils.damp(camera.position.z, 8.6 + cz, 2, delta);
    camera.position.y = 3.4;
    camera.lookAt(camTarget.current.x * 0.5 - 0.9, 0.2, camTarget.current.z * 0.5);
  });

  return (
    <group ref={group}>
      <group scale={0.95}>
        <mesh geometry={bodyGeo} position={[0, 0, -0.33]} castShadow>
          <meshPhysicalMaterial color="#6b6764" metalness={0.45} roughness={0.34} clearcoat={1} clearcoatRoughness={0.1} envMapIntensity={1.4} />
        </mesh>
        <mesh geometry={glassGeo} position={[0, 0, -0.345]}>
          <meshPhysicalMaterial color="#39424a" metalness={0.7} roughness={0.08} envMapIntensity={1.8} />
        </mesh>
        {/* lights */}
        {[0.22, -0.22].map((z) => (
          <group key={z}>
            <mesh position={[-0.875, 0.36, z]}>
              <boxGeometry args={[0.02, 0.05, 0.2]} />
              <meshStandardMaterial color="#ff8a3d" emissive="#ff7a2a" emissiveIntensity={3} toneMapped={false} />
            </mesh>
            <mesh position={[0.9, 0.3, z * 1.05]}>
              <boxGeometry args={[0.02, 0.04, 0.15]} />
              <meshStandardMaterial color="#fff6e2" emissive="#fff2cf" emissiveIntensity={2.4} toneMapped={false} />
            </mesh>
          </group>
        ))}
        <Wheel x={0.52} z={0.33} wheelRefs={wheels} />
        <Wheel x={0.52} z={-0.33} wheelRefs={wheels} />
        <Wheel x={-0.5} z={0.33} wheelRefs={wheels} />
        <Wheel x={-0.5} z={-0.33} wheelRefs={wheels} />
      </group>
    </group>
  );
}

function AutomotiveScene({ animate }: { animate: boolean }) {
  const { curve, geometry, shoulder, edgeGeometry } = useRoad();
  return (
    <group>
      <mesh geometry={shoulder}>
        <meshStandardMaterial color="#ecdccb" roughness={0.9} side={2} />
      </mesh>
      <mesh geometry={geometry} receiveShadow>
        <meshStandardMaterial color="#fffaf4" emissive="#fff3e6" emissiveIntensity={0.35} roughness={0.55} side={2} />
      </mesh>
      <lineLoop geometry={edgeGeometry}>
        <lineBasicMaterial color={CHAMPAGNE} transparent opacity={0.55} />
      </lineLoop>
      <Car curve={curve} animate={animate} />
      {/* minimal architectural blocks beside the road */}
      {[
        [-1.5, 0.35, -3.4, 1.8, 0.7, 0.5],
        [3.4, 0.5, -3.1, 0.9, 1, 0.9],
        [-4.8, 0.3, 2.9, 1.2, 0.6, 0.6],
        [1.2, 0.25, 3.6, 2.4, 0.5, 0.4],
      ].map(([x, y, z, w, h, d], i) => (
        <mesh key={i} position={[x, y, z]} castShadow>
          <boxGeometry args={[w, h, d]} />
          <meshStandardMaterial color="#fbf6ef" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ Real estate */

function Windows({ items, pulse }: { items: [number, number, number, number, number][]; pulse: boolean }) {
  const mats = useRef<MeshStandardMaterial[]>([]);
  useFrame(({ clock }) => {
    if (!pulse) return;
    mats.current.forEach((m, i) => {
      m.emissiveIntensity = 0.5 + 0.9 * (0.5 + 0.5 * Math.sin(clock.elapsedTime * 0.5 + i * 1.7));
    });
  });
  return (
    <>
      {items.map(([x, y, z, w, h], i) => (
        <mesh key={i} position={[x, y, z]}>
          <planeGeometry args={[w, h]} />
          <meshStandardMaterial
            ref={(m) => {
              if (m) mats.current[i] = m;
            }}
            color={WARM}
            emissive={WARM}
            emissiveIntensity={0.8}
          />
        </mesh>
      ))}
    </>
  );
}

function RealEstateScene({ animate }: { animate: boolean }) {
  const group = useRef<Group>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * 0.12;
    camera.position.set(Math.sin(t) * 8.5, 2.6 + Math.sin(t * 0.7) * 0.3, Math.cos(t) * 8.5);
    camera.lookAt(0, 0.9, 0);
    if (group.current) group.current.rotation.y = 0;
  });
  void animate;
  return (
    <group ref={group}>
      <mesh position={[0, 0.06, 0]} receiveShadow>
        <boxGeometry args={[7.4, 0.12, 4.6]} />
        <meshStandardMaterial color="#efe4d8" roughness={0.9} />
      </mesh>
      <mesh position={[-0.7, 0.85, 0]} castShadow>
        <boxGeometry args={[3.6, 1.5, 2.6]} />
        <meshStandardMaterial color={IVORY} roughness={0.85} />
      </mesh>
      <mesh position={[0.5, 1.95, 0.1]} castShadow>
        <boxGeometry args={[3.4, 0.9, 2.4]} />
        <meshStandardMaterial color="#fbf7f1" roughness={0.8} />
      </mesh>
      <mesh position={[2.1, 0.55, 0.4]} castShadow>
        <boxGeometry args={[1.6, 0.9, 1.8]} />
        <meshStandardMaterial color="#e9dccd" roughness={0.9} />
      </mesh>
      <mesh position={[0.5, 2.43, 0.1]}>
        <boxGeometry args={[3.8, 0.07, 2.8]} />
        <meshStandardMaterial color={CHAMPAGNE} metalness={0.6} roughness={0.35} />
      </mesh>
      {/* pool */}
      <mesh position={[-0.9, 0.14, 2.9]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[2.8, 1.2]} />
        <meshStandardMaterial color="#e3ece9" roughness={0.1} metalness={0.2} />
      </mesh>
      <Windows
        pulse
        items={[
          [-1.6, 0.9, 1.31, 0.9, 0.9],
          [-0.2, 0.9, 1.31, 0.9, 0.9],
          [-0.3, 2.0, 1.31, 1.2, 0.6],
          [1.4, 2.0, 1.31, 1.2, 0.6],
          [2.1, 0.6, 1.31, 0.7, 0.5],
        ]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ Healthcare */

function HealthcareScene({ animate }: { animate: boolean }) {
  const cross = useRef<Mesh>(null);
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * 0.18;
    camera.position.set(Math.sin(t) * 1.4, 1.5 + Math.sin(t * 0.8) * 0.12, 8.4 - Math.sin(t * 0.6) * 0.5);
    camera.lookAt(0, 1.15, 0);
    if (cross.current) {
      (cross.current.material as MeshStandardMaterial).emissiveIntensity = 0.7 + Math.sin(clock.elapsedTime * 0.9) * 0.25;
    }
  });
  void animate;
  return (
    <group>
      <mesh position={[0, 0.05, 0]} receiveShadow>
        <boxGeometry args={[9, 0.1, 5.6]} />
        <meshStandardMaterial color="#f1e7dc" roughness={0.45} metalness={0.1} />
      </mesh>
      {/* back wall + arched opening feel via two piers */}
      <mesh position={[0, 1.6, -2.5]}>
        <boxGeometry args={[9, 3.2, 0.2]} />
        <meshStandardMaterial color="#f7f1ea" roughness={0.9} />
      </mesh>
      <mesh ref={cross} position={[0, 2.0, -2.38]}>
        <boxGeometry args={[0.18, 0.9, 0.06]} />
        <meshStandardMaterial color="#fff" emissive={WARM} emissiveIntensity={0.8} />
      </mesh>
      <mesh position={[0, 2.0, -2.37]}>
        <boxGeometry args={[0.9, 0.18, 0.06]} />
        <meshStandardMaterial color="#fff" emissive={WARM} emissiveIntensity={0.8} />
      </mesh>
      {/* reception desk */}
      <mesh position={[0, 0.5, -0.6]} castShadow>
        <boxGeometry args={[3.2, 1, 0.8]} />
        <meshStandardMaterial color={IVORY} roughness={0.7} />
      </mesh>
      <mesh position={[0, 1.02, -0.6]}>
        <boxGeometry args={[3.3, 0.06, 0.9]} />
        <meshStandardMaterial color={CHAMPAGNE} metalness={0.6} roughness={0.3} />
      </mesh>
      {/* pendant lights */}
      {[-1.4, 0, 1.4].map((x) => (
        <group key={x} position={[x, 0, -0.6]}>
          <mesh position={[0, 2.3, 0]}>
            <cylinderGeometry args={[0.005, 0.005, 1.4, 6]} />
            <meshStandardMaterial color="#b8a898" />
          </mesh>
          <mesh position={[0, 1.55, 0]}>
            <sphereGeometry args={[0.2, 24, 16]} />
            <meshStandardMaterial color="#fffaf2" emissive={WARM} emissiveIntensity={1.4} />
          </mesh>
        </group>
      ))}
      {/* waiting benches */}
      {[-3, 3].map((x) => (
        <mesh key={x} position={[x, 0.28, 1.2]} castShadow>
          <boxGeometry args={[1.6, 0.4, 0.55]} />
          <meshStandardMaterial color="#e6d8c8" roughness={0.85} />
        </mesh>
      ))}
      {[-3.6, 3.6].map((x) => (
        <mesh key={x} position={[x, 1.6, -2.2]}>
          <cylinderGeometry args={[0.16, 0.16, 3.2, 20]} />
          <meshStandardMaterial color={IVORY} roughness={0.8} />
        </mesh>
      ))}
    </group>
  );
}

/* ------------------------------------------------------------------ Education */

function EducationScene({ animate }: { animate: boolean }) {
  useFrame(({ clock, camera }) => {
    const t = clock.elapsedTime * 0.1;
    camera.position.set(Math.sin(t) * 3.4, 2.4 + Math.sin(t * 0.7) * 0.25, 9 + Math.cos(t) * 0.8);
    camera.lookAt(0, 1.3, 0);
  });
  void animate;
  const cols = [-1.5, -0.75, 0, 0.75, 1.5];
  return (
    <group>
      <mesh position={[0, 0.05, 0.4]} receiveShadow>
        <boxGeometry args={[10, 0.1, 6]} />
        <meshStandardMaterial color="#efe4d8" roughness={0.9} />
      </mesh>
      {/* main hall */}
      <mesh position={[0, 1.2, -0.6]} castShadow>
        <boxGeometry args={[4.4, 2.2, 1.8]} />
        <meshStandardMaterial color={IVORY} roughness={0.85} />
      </mesh>
      <mesh position={[0, 2.5, -0.3]}>
        <boxGeometry args={[4.9, 0.18, 2.4]} />
        <meshStandardMaterial color={CHAMPAGNE} metalness={0.5} roughness={0.35} />
      </mesh>
      {cols.map((x) => (
        <mesh key={x} position={[x, 1.2, 0.65]} castShadow>
          <cylinderGeometry args={[0.1, 0.1, 2.2, 18]} />
          <meshStandardMaterial color="#fbf7f1" roughness={0.7} />
        </mesh>
      ))}
      {[0, 1, 2].map((i) => (
        <mesh key={i} position={[0, 0.14 + i * 0.1, 1.15 + (2 - i) * 0.22]} receiveShadow>
          <boxGeometry args={[3.2 + (2 - i) * 0.3, 0.1, 0.5]} />
          <meshStandardMaterial color="#f7efe6" roughness={0.9} />
        </mesh>
      ))}
      {/* clock tower */}
      <mesh position={[3.2, 1.8, -1]} castShadow>
        <boxGeometry args={[0.9, 3.4, 0.9]} />
        <meshStandardMaterial color="#f7f0e8" roughness={0.85} />
      </mesh>
      <mesh position={[3.2, 3.85, -1]} castShadow>
        <coneGeometry args={[0.7, 0.9, 4]} />
        <meshStandardMaterial color={CHAMPAGNE} metalness={0.5} roughness={0.4} />
      </mesh>
      <mesh position={[3.2, 2.9, -0.53]}>
        <circleGeometry args={[0.26, 28]} />
        <meshStandardMaterial color="#fffaf2" emissive={WARM} emissiveIntensity={0.9} />
      </mesh>
      {/* side wings */}
      {[-3.4, 3.3].map((x, i) => (
        <mesh key={x} position={[x * (i ? 0.62 : 1), 0.7, 0.2]} castShadow>
          <boxGeometry args={[1.8, 1.2, 1.5]} />
          <meshStandardMaterial color="#e9dccd" roughness={0.9} />
        </mesh>
      ))}
      <Windows
        pulse
        items={[
          [-1.4, 1.5, 0.31, 0.5, 0.6],
          [-0.5, 1.5, 0.31, 0.5, 0.6],
          [0.5, 1.5, 0.31, 0.5, 0.6],
          [1.4, 1.5, 0.31, 0.5, 0.6],
        ]}
      />
    </group>
  );
}

/* ------------------------------------------------------------------ Canvas */

const CAMERAS: Record<IndustryId, { position: [number, number, number]; fov: number }> = {
  automotive: { position: [2, 3.4, 8.6], fov: 28 },
  "real-estate": { position: [0, 2.6, 8.5], fov: 32 },
  healthcare: { position: [0, 1.5, 8.4], fov: 34 },
  education: { position: [0, 2.4, 9], fov: 34 },
};

function Lights({ animate }: { animate: boolean }) {
  const dir = useRef<import("three").DirectionalLight>(null);
  useFrame(({ clock }) => {
    if (dir.current && animate) dir.current.intensity = 2.1 + Math.sin(clock.elapsedTime * 0.35) * 0.35;
  });
  return (
    <>
      <hemisphereLight args={["#fff8ee", "#f0e2d4", 1.6]} />
      <directionalLight ref={dir} position={[-4, 6, 4]} intensity={2.1} color="#fff0dc" castShadow />
      <directionalLight position={[5, 2, -3]} intensity={0.7} color="#ffd9b0" />
    </>
  );
}

function Invalidate({ animate }: { animate: boolean }) {
  const invalidate = useThree((s) => s.invalidate);
  useEffect(() => {
    if (!animate) invalidate();
  }, [animate, invalidate]);
  return null;
}

type Props = { industry: IndustryId; lite: boolean; animate: boolean; active: boolean; onReady?: () => void };

export default function IndustryScene({ industry, lite, animate, active, onReady }: Props) {
  const cam = CAMERAS[industry];
  return (
    <Canvas
      key={industry}
      frameloop={animate && active ? "always" : "demand"}
      dpr={lite ? [1, 1.5] : [1, 2]}
      shadows={!lite}
      camera={{ position: cam.position, fov: cam.fov, near: 0.1, far: 60 }}
      gl={{ antialias: !lite, alpha: true }}
      onCreated={() => onReady?.()}
      aria-hidden
    >
      <Lights animate={animate} />
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.4} color="#fff3e4" position={[-4, 5, 4]} scale={[8, 3, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffd9b0" position={[6, 2, 2]} scale={[2, 5, 1]} />
        <Lightformer form="rect" intensity={1.2} color="#ffffff" position={[0, 6, -6]} scale={[14, 4, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#fff1e2" position={[0, 2, 10]} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#fff1e2" position={[-10, 2, 0]} rotation-y={Math.PI / 2} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={1.1} color="#fff1e2" position={[10, 2, 0]} rotation-y={-Math.PI / 2} scale={[30, 8, 1]} />
        <Lightformer form="rect" intensity={0.9} color="#f5e3d0" position={[0, -4, 0]} rotation-x={Math.PI / 2} scale={[30, 30, 1]} />
      </Environment>
      {industry === "automotive" && <AutomotiveScene animate={animate} />}
      {industry === "real-estate" && <RealEstateScene animate={animate} />}
      {industry === "healthcare" && <HealthcareScene animate={animate} />}
      {industry === "education" && <EducationScene animate={animate} />}
      {!lite && <ContactShadows position={[0, 0.01, 0]} opacity={0.22} scale={16} blur={2.8} far={3} color="#c9a888" />}
      <Invalidate animate={animate} />
    </Canvas>
  );
}
