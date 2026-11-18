"use client";
import { Suspense, useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { ContactShadows, MeshReflectorMaterial, useGLTF } from "@react-three/drei";
import {
  CanvasTexture,
  MathUtils,
  MeshPhysicalMaterial,
  MeshStandardMaterial,
  Shape,
  SRGBColorSpace
} from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { LiveScreen, Tag } from "./industryUI";
const cache = /* @__PURE__ */ new Map();
function geo(key, make) {
  let g = cache.get(key);
  if (!g) {
    g = make();
    cache.set(key, g);
  }
  return g;
}
const rbox = (w, h, d, r) => {
  const rad = Math.max(1e-3, Math.min(r, w / 2 - 1e-3, h / 2 - 1e-3, d / 2 - 1e-3));
  return geo(`b${w}_${h}_${d}_${rad}`, () => new RoundedBoxGeometry(w, h, d, 3, rad));
};
function B({ s, p, r, c, rad = 0.02, rough = 0.7, metal = 0, cast = true, recv = true, glow, opacity, env = 1, children }) {
  return <mesh geometry={rbox(s[0], s[1], s[2], rad)} position={p} rotation={r} castShadow={cast && !glow} receiveShadow={recv}>
      {glow ? <meshBasicMaterial color={c} toneMapped={false} /> : <meshStandardMaterial color={c} roughness={rough} metalness={metal} envMapIntensity={env} transparent={opacity !== void 0} opacity={opacity ?? 1} />}
      {children}
    </mesh>;
}
function Glass({ s, p, r, tint = "#a9c4cf", opacity = 0.28 }) {
  return <mesh geometry={rbox(s[0], s[1], s[2], 0.01)} position={p} rotation={r}>
      <meshPhysicalMaterial color={tint} roughness={0.04} metalness={0.1} clearcoat={1} transparent opacity={opacity} envMapIntensity={1.8} depthWrite={false} />
    </mesh>;
}
function Plant({ p, h = 1.4, color = "#4d6b50" }) {
  return <group position={p}>
      <mesh position={[0, 0.25, 0]} castShadow>
        <cylinderGeometry args={[0.28, 0.2, 0.5, 24]} />
        <meshStandardMaterial color="#e8e2d8" roughness={0.6} />
      </mesh>
      {[0, 1, 2, 3, 4, 5].map((i) => {
    const a = i / 6 * Math.PI * 2;
    return <mesh key={i} position={[Math.cos(a) * 0.18, 0.5 + h * 0.4, Math.sin(a) * 0.18]} rotation={[Math.sin(a) * 0.4, 0, -Math.cos(a) * 0.4]} scale={[0.16, h * 0.55, 0.1]} castShadow>
            <sphereGeometry args={[1, 12, 10]} />
            <meshStandardMaterial color={color} roughness={0.8} />
          </mesh>;
  })}
    </group>;
}
function Tree({ p, h = 3.4, r = 1.2, color = "#6b8556" }) {
  return <group position={p}>
      <mesh position={[0, h * 0.35, 0]} castShadow>
        <cylinderGeometry args={[0.1, 0.16, h * 0.7, 10]} />
        <meshStandardMaterial color="#6a5642" roughness={1} />
      </mesh>
      {[
    [0, h * 0.82, 0, 1],
    [r * 0.5, h * 0.7, 0.2, 0.7],
    [-r * 0.5, h * 0.72, -0.1, 0.75]
  ].map(([x, y, z, k], i) => <mesh key={i} position={[x, y, z]} scale={[r * k, r * k * 0.85, r * k]} castShadow>
          <icosahedronGeometry args={[1, 2]} />
          <meshStandardMaterial color={color} roughness={0.95} />
        </mesh>)}
    </group>;
}
function Cypress({ p, h = 3.4 }) {
  return <mesh position={[p[0], p[1] + h / 2, p[2]]} scale={[0.42, h / 2, 0.42]} castShadow>
      <sphereGeometry args={[1, 16, 14]} />
      <meshStandardMaterial color="#4f6549" roughness={0.95} />
    </mesh>;
}
function Sky({ top = "#cfe0ee", bottom = "#f6efe6" }) {
  const tex = useMemo(() => {
    const c = document.createElement("canvas");
    c.width = 4;
    c.height = 256;
    const x = c.getContext("2d");
    const g = x.createLinearGradient(0, 0, 0, 256);
    g.addColorStop(0, top);
    g.addColorStop(1, bottom);
    x.fillStyle = g;
    x.fillRect(0, 0, 4, 256);
    const t = new CanvasTexture(c);
    t.colorSpace = SRGBColorSpace;
    return t;
  }, [top, bottom]);
  useEffect(() => () => tex.dispose(), [tex]);
  return <mesh position={[0, 14, -42]}>
      <planeGeometry args={[220, 70]} />
      <meshBasicMaterial map={tex} toneMapped={false} fog={false} />
    </mesh>;
}
function Fogger({ color, near, far }) {
  return <fog attach="fog" args={[color, near, far]} />;
}
function Rig({ from, to, look, fov, animate, intro = 2.6 }) {
  const t0 = useRef(null);
  useFrame(({ clock, camera, pointer }) => {
    const cam = camera;
    if (cam.fov !== fov) {
      cam.fov = fov;
      cam.updateProjectionMatrix();
    }
    if (t0.current === null) t0.current = clock.elapsedTime;
    const t = animate ? clock.elapsedTime - t0.current : 99;
    const u = MathUtils.clamp(t / intro, 0, 1);
    const k = 1 - Math.pow(1 - u, 3);
    const sway = animate ? Math.sin(clock.elapsedTime * 0.22) * 0.35 : 0;
    cam.position.set(MathUtils.lerp(from[0], to[0], k) + sway + pointer.x * 0.25, MathUtils.lerp(from[1], to[1], k) + pointer.y * 0.12, MathUtils.lerp(from[2], to[2], k));
    cam.lookAt(look[0], look[1], look[2]);
  });
  return null;
}
function Sun({ pos, color = "#fff1dc", intensity = 2, lite, extent = 14 }) {
  return <directionalLight
    position={pos}
    intensity={intensity}
    color={color}
    castShadow={!lite}
    shadow-mapSize={[lite ? 1024 : 2048, lite ? 1024 : 2048]}
    shadow-camera-left={-extent}
    shadow-camera-right={extent}
    shadow-camera-top={extent * 0.7}
    shadow-camera-bottom={-extent * 0.7}
    shadow-camera-near={1}
    shadow-camera-far={60}
    shadow-bias={-5e-4}
    shadow-normalBias={0.04}
  />;
}
function Floor({ color, lite, size = [60, 40], mirror = 0.5, y = 0 }) {
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, y, 0]} receiveShadow>
      <planeGeometry args={size} />
      {lite ? <meshStandardMaterial color={color} roughness={0.35} metalness={0.15} /> : <MeshReflectorMaterial color={color} roughness={0.85} metalness={0.1} blur={[380, 100]} mixBlur={1} mixStrength={1.1} mirror={mirror} resolution={512} depthScale={0.8} minDepthThreshold={0.4} maxDepthThreshold={1.2} />}
    </mesh>;
}
const CAR_URL = "/models/car.glb";
useGLTF.setDecoderPath("/draco/");
useGLTF.preload(CAR_URL);
function Car() {
  const { scene } = useGLTF(CAR_URL);
  const model = useMemo(() => {
    const root = scene.clone(true);
    const paint = new MeshPhysicalMaterial({ color: "#a8a49b", metalness: 0.55, roughness: 0.3, clearcoat: 1, clearcoatRoughness: 0.03, envMapIntensity: 1.5 });
    const glass = new MeshPhysicalMaterial({ color: "#0d141b", metalness: 0.2, roughness: 0.04, transparent: true, opacity: 0.62, envMapIntensity: 2.2, clearcoat: 1, depthWrite: false });
    const rubber = new MeshStandardMaterial({ color: "#161617", roughness: 0.92, metalness: 0 });
    const rim = new MeshStandardMaterial({ color: "#c9ccd2", roughness: 0.28, metalness: 1, envMapIntensity: 1.5 });
    root.traverse((o) => {
      const m = o;
      if (!m.isMesh) return;
      m.castShadow = true;
      m.receiveShadow = true;
      const n = (m.name || "").toLowerCase();
      const mn = (m.material.name || "").toLowerCase();
      if (mn === "body_color" || n === "body") m.material = paint;
      else if (mn.includes("glass") && !mn.includes("taillight") && !mn.includes("projector")) {
        m.material = glass;
        m.castShadow = false;
      } else if (mn === "tires" || n === "tire") m.material = rubber;
      else if (n.startsWith("rim") || n === "wheel") m.material = rim;
      else {
        const mat = m.material;
        if (mat && "envMapIntensity" in mat) mat.envMapIntensity = 1.3;
      }
    });
    return root;
  }, [scene]);
  return <primitive object={model} />;
}
function AutomotiveScene({ animate, lite }) {
  const car = useRef(null);
  useFrame(({ clock }) => {
    if (car.current && animate) car.current.rotation.y = -0.6 + Math.sin(clock.elapsedTime * 0.3) * 0.06;
  });
  const mullions = useMemo(() => Array.from({ length: 12 }, (_, i) => -16.2 + i * 1.65), []);
  const CHAMP = "#d9c4a0";
  return <>
      <Rig from={[-3, 2.9, 12.6]} to={[-0.4, 2.2, 8.8]} look={[1.4, 1.65, -2.4]} fov={34} animate={animate} />
      <Sky top="#cddfec" bottom="#f6f1e8" />
      <Fogger color="#f1efea" near={20} far={46} />
      <hemisphereLight args={["#fffaf2", "#ddd8cf", 1.2]} />
      <Sun pos={[-4, 8, 7]} color="#fff6e8" intensity={1.5} lite={lite} extent={13} />
      <spotLight position={[-0.6, 6.4, 2]} angle={0.45} penumbra={1} intensity={55} color="#fff3e2" castShadow={false} target-position={[-0.6, 0, -0.4]} />

      <Floor color="#e8e4dd" lite={lite} mirror={0.5} />

      {
    /* exterior: paving and soft trees seen through the glass */
  }
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, -19]}>
        <planeGeometry args={[90, 26]} />
        <meshStandardMaterial color="#d3d8c6" roughness={1} />
      </mesh>
      {[
    [-13, 0, -15],
    [-8.5, 0, -18],
    [-4.5, 0, -16],
    [-0.5, 0, -19]
  ].map((p, i) => <Tree key={i} p={p} h={3.4 + i % 2 * 0.8} r={1.1} color={i % 2 ? "#a3b58e" : "#9bb086"} />)}

      {
    /* shell: floor-to-ceiling glazing on the left, plaster feature wall on the right */
  }
      <Glass s={[18.6, 5.6, 0.06]} p={[-7.6, 2.95, -6.3]} tint="#cfe0e6" opacity={0.16} />
      {mullions.map((x, i) => <B key={i} s={[0.07, 5.7, 0.14]} p={[x, 2.95, -6.3]} c="#4a443d" metal={0.4} rough={0.45} cast={false} />)}
      <B s={[18.8, 0.14, 0.2]} p={[-7.6, 5.78, -6.3]} c="#4a443d" metal={0.4} rough={0.45} />
      <B s={[18.8, 0.18, 0.3]} p={[-7.6, 0.09, -6.3]} c="#4a443d" metal={0.4} rough={0.45} />
      <B s={[12, 7, 0.4]} p={[7.9, 3.5, -6.4]} c="#ece6db" rough={0.9} />
      <B s={[5.2, 4.2, 0.08]} p={[5.8, 3.2, -6.15]} c="#d9ceba" rough={0.8} />
      <B s={[0.05, 4.4, 0.05]} p={[3.1, 3.2, -6.1]} c={CHAMP} glow />
      {
    /* ceiling with recessed light strips */
  }
      <B s={[40, 0.4, 24]} p={[0, 7, 4]} c="#f6f4ef" rough={0.9} />
      {[-9, -5.4, -1.8, 1.8, 5.4, 9].map((x, i) => <B key={i} s={[0.14, 0.05, 11]} p={[x, 6.78, -0.5]} c="#ffffff" glow />)}
      <B s={[40, 0.08, 0.08]} p={[0, 6.7, -6]} c={CHAMP} glow />

      {
    /* display platform with the car */
  }
      <mesh position={[-0.6, 0.09, -0.4]} receiveShadow castShadow>
        <cylinderGeometry args={[3.2, 3.3, 0.18, 96]} />
        <meshStandardMaterial color="#efebe3" roughness={0.35} metalness={0.15} />
      </mesh>
      <mesh position={[-0.6, 0.185, -0.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[2.95, 3, 96]} />
        <meshBasicMaterial color={CHAMP} toneMapped={false} />
      </mesh>
      <group ref={car} position={[-0.6, 0.18, -0.4]} rotation={[0, -0.6, 0]}>
        <group rotation={[0, -Math.PI / 2, 0]} scale={1.04}>
          <Suspense fallback={null}>
            <Car />
          </Suspense>
        </group>
      </group>
      <ContactShadows position={[-0.6, 0.19, -0.4]} opacity={0.5} blur={2.6} scale={9} far={1.6} resolution={512} frames={1} color="#3a342c" />
      <Tag industry="automotive" position={[-0.6, 3, -0.4]} />

      {
    /* reception console under the live-call display */
  }
      <B s={[6.2, 1, 1.1]} p={[6, 0.5, -4.6]} c="#f8f6f1" rad={0.1} rough={0.35} />
      <B s={[6.5, 0.07, 1.4]} p={[6, 1.04, -4.6]} c="#cdbb97" rad={0.03} rough={0.3} metal={0.3} />
      <B s={[5.9, 0.05, 0.03]} p={[6, 0.3, -4.03]} c="#f4e6c8" glow />
      <LiveScreen industry="automotive" animate={animate} w={4.7} position={[5.8, 3.45, -6.1]} />
      <Plant p={[2.6, 0, -5.4]} h={2} />
      <Plant p={[9.6, 0, -5.4]} h={1.7} color="#56765a" />

      {
    /* vehicle information stand */
  }
      <B s={[0.1, 1.2, 0.1]} p={[2.9, 0.6, 1.2]} c="#b9b3a8" metal={0.6} rough={0.35} />
      <B s={[0.9, 0.56, 0.05]} p={[2.9, 1.35, 1.2]} r={[-0.25, -0.5, 0]} c="#fbf8f2" rough={0.4} />
      <B s={[0.7, 0.03, 0.02]} p={[2.9, 1.3, 1.23]} r={[-0.25, -0.5, 0]} c={CHAMP} glow />

      {
    /* waiting lounge */
  }
      {[
    [-5.6, 0.6],
    [-4, 1.9]
  ].map(([x, z], i) => <group key={i} position={[x, 0, z]} rotation={[0, 0.55 - i * 0.25, 0]}>
          <B s={[1.1, 0.38, 0.95]} p={[0, 0.34, 0]} c="#c9b8a0" rad={0.12} rough={0.9} />
          <B s={[1.1, 0.6, 0.22]} p={[0, 0.72, -0.4]} c="#c9b8a0" rad={0.1} rough={0.9} />
          {[-0.45, 0.45].map((lx) => <B key={lx} s={[0.05, 0.16, 0.05]} p={[lx, 0.08, 0.38]} c="#2a2a2a" metal={0.6} />)}
        </group>)}
      <mesh position={[-4.9, 0.22, 1.4]} castShadow>
        <cylinderGeometry args={[0.42, 0.42, 0.06, 40]} />
        <meshStandardMaterial color="#f5f3ee" roughness={0.3} />
      </mesh>
      <mesh position={[-4.9, 0.1, 1.4]}>
        <cylinderGeometry args={[0.05, 0.12, 0.2, 20]} />
        <meshStandardMaterial color="#cfcfcc" metalness={0.6} roughness={0.3} />
      </mesh>
      <Plant p={[-7.2, 0, -4.8]} h={2.2} />
    </>;
}
function RealEstateScene({ animate, lite }) {
  const slats = useMemo(() => Array.from({ length: 32 }, (_, i) => -2 + i * 0.2), []);
  return <>
      <Rig from={[-1, 4.2, 16]} to={[1.4, 3, 12.2]} look={[1.6, 1.9, -0.6]} fov={32} animate={animate} />
      <Sky />
      <Fogger color="#f1ebe2" near={26} far={64} />
      <hemisphereLight args={["#e3edf7", "#b9c0a2", 0.85]} />
      <Sun pos={[9, 8, 7]} color="#ffe9c9" intensity={3} lite={lite} extent={14} />

      {
    /* ground, terrace, pool */
  }
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[90, 60]} />
        <meshStandardMaterial color="#c4cdae" roughness={1} />
      </mesh>
      <B s={[13, 0.1, 6]} p={[0.8, 0.05, 0.2]} c="#e6e0d5" rough={0.9} />
      <B s={[6.8, 0.12, 3.6]} p={[-2.6, 0.06, 2.6]} c="#f0ebe2" rough={0.8} />
      <mesh position={[-2.6, 0.125, 2.6]} receiveShadow>
        <boxGeometry args={[6.2, 0.02, 3]} />
        <meshPhysicalMaterial color="#7fc3cd" roughness={0.04} metalness={0.15} clearcoat={1} envMapIntensity={2} />
      </mesh>
      {[-1, 1].map((k) => <B key={k} s={[0.7, 0.12, 1.8]} p={[-2.6 + k * 1.1, 0.16, 4.8]} c="#f4f1ea" rad={0.04} />)}

      {
    /* house: ground floor, cantilevered upper volume, roofs */
  }
      <B s={[9.2, 2.5, 4.4]} p={[-0.2, 1.3, -3]} c="#f3f0ea" rough={0.85} />
      <B s={[6.6, 1.7, 3.8]} p={[1.4, 3.35, -3.2]} c="#f3f0ea" rough={0.85} />
      <B s={[10, 0.2, 5.2]} p={[-0.2, 2.62, -3]} c="#2f2e2c" rough={0.5} metal={0.3} />
      <B s={[7.2, 0.2, 4.5]} p={[1.4, 4.28, -3.2]} c="#2f2e2c" rough={0.5} metal={0.3} />
      {
    /* timber slat cladding on the upper volume */
  }
      <B s={[2.6, 1.4, 0.06]} p={[-1.4, 3.35, -1.27]} c="#9a7550" rough={0.7} />
      {slats.slice(0, 13).map((x, i) => <B key={i} s={[0.05, 1.4, 0.04]} p={[-2.6 + i * 0.2, 3.35, -1.22]} c="#6f5238" rough={0.8} cast={false} />)}
      <Glass s={[3.8, 1.3, 0.06]} p={[2.4, 3.35, -1.28]} tint="#6f8d9a" opacity={0.4} />
      <B s={[3.8, 1.3, 0.02]} p={[2.4, 3.35, -1.6]} c="#f3c98f" glow />
      {
    /* ground-floor glazing with a lit interior */
  }
      <Glass s={[6.2, 2.1, 0.06]} p={[-1.6, 1.25, -0.82]} tint="#6f8d9a" opacity={0.4} />
      <B s={[6.2, 2.1, 0.02]} p={[-1.6, 1.25, -1.6]} c="#f3c98f" glow />
      <B s={[6.4, 0.1, 0.12]} p={[-1.6, 2.35, -0.8]} c="#2b2a29" metal={0.5} rough={0.4} />
      <B s={[6.4, 0.1, 0.12]} p={[-1.6, 0.18, -0.8]} c="#2b2a29" metal={0.5} rough={0.4} />
      {[-4.7, -3.1, -1.5, 0.1, 1.5].map((x) => <B key={x} s={[0.07, 2.1, 0.1]} p={[x, 1.25, -0.8]} c="#2b2a29" metal={0.5} rough={0.4} />)}
      <B s={[2.6, 0.5, 0.9]} p={[-2.2, 0.45, -1.3]} c="#c7b8a4" rad={0.1} />
      <B s={[2.6, 0.7, 0.2]} p={[-2.2, 0.85, -1.62]} c="#c7b8a4" rad={0.1} />
      {[-0.6, 0.6].map((x) => <mesh key={x} position={[x - 1.1, 2, -1.2]}>
          <sphereGeometry args={[0.12, 16, 12]} />
          <meshBasicMaterial color="#fff2d6" toneMapped={false} />
        </mesh>)}
      {
    /* entrance */
  }
      <B s={[1, 2.2, 0.1]} p={[3.4, 1.2, -0.84]} c="#2b2a29" rough={0.4} metal={0.5} />
      <B s={[3.2, 2.4, 0.5]} p={[3.4, 1.25, -1]} c="#e2dccf" rough={0.9} />
      <B s={[1.6, 0.1, 0.9]} p={[3.4, 0.1, -0.35]} c="#d6cfc2" />

      {
    /* landscape */
  }
      {[
    [-7.2, 0, -2.2],
    [-6.2, 0, -0.4],
    [7.2, 0, -1.6],
    [8.1, 0, 0.6],
    [6.4, 0, 1.8]
  ].map((p, i) => <Cypress key={i} p={p} h={3.6 + i % 3 * 0.5} />)}
      <Tree p={[-6.6, 0, 3.6]} h={3} r={1.1} color="#778f5c" />
      <Tree p={[5.6, 0, 4.2]} h={2.6} r={0.95} color="#6f8856" />

      {
    /* sales-gallery display */
  }
      <B s={[0.4, 1.3, 0.4]} p={[5.6, 0.65, 3]} c="#d9d3c7" rough={0.8} />
      <LiveScreen industry="real-estate" animate={animate} w={4.4} position={[5.6, 2.55, 3]} rotation={[0, -0.32, 0]} />
      <Tag industry="real-estate" position={[5.6, 4.5, 3]} />
    </>;
}
function HealthcareScene({ animate, lite }) {
  const slats = useMemo(() => Array.from({ length: 30 }, (_, i) => -8.4 + i * 0.24), []);
  return <>
      <Rig from={[-3, 2.8, 12.5]} to={[-0.4, 2.1, 9.4]} look={[1, 1.8, -2.5]} fov={34} animate={animate} />
      <Fogger color="#f2f3f1" near={18} far={40} />
      <hemisphereLight args={["#ffffff", "#dfe3e0", 1.25]} />
      <Sun pos={[-4, 8, 6]} color="#fffaf0" intensity={1.4} lite={lite} extent={12} />

      <Floor color="#e5e8e6" lite={lite} mirror={0.45} />
      {
    /* shell */
  }
      <B s={[34, 7, 0.4]} p={[0, 3.5, -6.4]} c="#f3f5f4" rough={0.9} />
      <B s={[34, 0.4, 24]} p={[0, 6.9, 4]} c="#f7f8f7" rough={0.9} />
      {[-6, -2.4, 1.2, 4.8].map((x, i) => <B key={i} s={[3.2, 0.06, 1.2]} p={[x, 6.65, -1.5]} c="#ffffff" glow />)}
      {
    /* warm timber feature wall with a medical mark */
  }
      <B s={[7.4, 5.2, 0.22]} p={[-5.2, 2.7, -6.1]} c="#caa77d" rough={0.6} />
      {slats.slice(0, 31).map((x, i) => <B key={i} s={[0.04, 5.2, 0.06]} p={[-8.7 + i * 0.24, 2.7, -5.96]} c="#a98259" rough={0.7} cast={false} />)}
      <B s={[0.95, 0.3, 0.06]} p={[-5.2, 4, -5.9]} c="#2bb59d" glow />
      <B s={[0.3, 0.95, 0.06]} p={[-5.2, 4, -5.9]} c="#2bb59d" glow />

      {
    /* reception desk */
  }
      <B s={[7, 1.1, 1.2]} p={[2.4, 0.55, -3.6]} c="#f8f9f8" rad={0.12} rough={0.35} />
      <B s={[7.3, 0.08, 1.5]} p={[2.4, 1.14, -3.6]} c="#d4d8d6" rad={0.04} rough={0.25} metal={0.2} />
      <B s={[6.8, 0.05, 0.03]} p={[2.4, 0.32, -2.98]} c="#d4f2ec" glow />
      {
    /* Aurlynn voice terminal on the desk */
  }
      <mesh position={[0.6, 1.3, -3.4]} castShadow>
        <cylinderGeometry args={[0.2, 0.22, 0.26, 40]} />
        <meshStandardMaterial color="#f2f2f0" roughness={0.3} metalness={0.2} />
      </mesh>
      <mesh position={[0.6, 1.435, -3.4]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0.12, 0.15, 48]} />
        <meshBasicMaterial color="#e0a56e" toneMapped={false} />
      </mesh>
      <B s={[0.5, 0.34, 0.04]} p={[3.4, 1.35, -3.5]} c="#1a1714" rad={0.02} metal={0.6} />
      {
    /* live appointments display */
  }
      <LiveScreen industry="healthcare" animate={animate} w={4.8} position={[3.6, 3.7, -6.05]} />
      <Tag industry="healthcare" position={[3.6, 6, -5.2]} />

      {
    /* waiting area */
  }
      {[
    [-3.4, 0.2],
    [-1.8, 1.4]
  ].map(([x, z], i) => <group key={i} position={[x, 0, z]} rotation={[0, 0.5 - i * 0.2, 0]}>
          <B s={[1.1, 0.38, 0.95]} p={[0, 0.34, 0]} c="#8fa89f" rad={0.12} rough={0.9} />
          <B s={[1.1, 0.6, 0.22]} p={[0, 0.72, -0.4]} c="#8fa89f" rad={0.1} rough={0.9} />
          {[-0.45, 0.45].map((lx) => <B key={lx} s={[0.05, 0.16, 0.05]} p={[lx, 0.08, 0.38]} c="#2a2a2a" metal={0.6} />)}
        </group>)}
      <mesh position={[-2.4, 0.22, 0.1]} castShadow>
        <cylinderGeometry args={[0.45, 0.45, 0.06, 40]} />
        <meshStandardMaterial color="#f5f5f3" roughness={0.3} />
      </mesh>
      <mesh position={[-2.4, 0.1, 0.1]}>
        <cylinderGeometry args={[0.05, 0.12, 0.2, 20]} />
        <meshStandardMaterial color="#cfcfcc" metalness={0.6} roughness={0.3} />
      </mesh>
      <Plant p={[-6.6, 0, -4.6]} h={2.2} />
      <Plant p={[7.4, 0, -4.8]} h={1.9} />
      <Plant p={[-0.4, 0, -5.2]} h={1.5} color="#56765a" />
      {
    /* glass partition */
  }
      <Glass s={[0.06, 3.4, 5]} p={[-7.8, 1.7, -1.8]} tint="#bfd6d4" opacity={0.22} />
      <B s={[0.1, 3.4, 0.1]} p={[-7.8, 1.7, 0.7]} c="#2a2a2a" metal={0.6} />
      <B s={[0.1, 3.4, 0.1]} p={[-7.8, 1.7, -4.3]} c="#2a2a2a" metal={0.6} />
    </>;
}
function EducationScene({ animate, lite }) {
  const winRows = [1.4, 3.2];
  return <>
      <Rig from={[-1, 4.6, 24]} to={[0.8, 3, 17.2]} look={[1.4, 2.7, 0]} fov={34} animate={animate} />
      <Sky top="#c9dcec" bottom="#f4efe5" />
      <Fogger color="#f1ece3" near={32} far={80} />
      <hemisphereLight args={["#e9f1f8", "#cfc7b4", 1.15]} />
      <Sun pos={[8, 12, 9]} color="#fff1da" intensity={2.4} lite={lite} extent={18} />

      {
    /* campus ground */
  }
      <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[120, 70]} />
        <meshStandardMaterial color="#bccaa0" roughness={1} />
      </mesh>
      <B s={[16, 0.06, 7]} p={[0, 0.03, 1.4]} c="#e2d9ca" rough={0.9} />
      <B s={[3.4, 0.05, 18]} p={[0, 0.04, 10]} c="#e6dece" rough={0.9} />

      {
    /* central hall */
  }
      <B s={[9, 6.4, 4.4]} p={[0, 3.2, -4.4]} c="#ebe3d4" rough={0.9} />
      <B s={[10.4, 0.5, 5.4]} p={[0, 6.5, -3.9]} c="#f1eadd" rough={0.8} />
      <mesh position={[0, 6.75, -1.4]} castShadow>
        <extrudeGeometry args={[(() => {
    const s = new Shape();
    s.moveTo(-5.2, 0);
    s.lineTo(5.2, 0);
    s.lineTo(0, 1.7);
    s.lineTo(-5.2, 0);
    return s;
  })(), { depth: 0.6, bevelEnabled: false }]} />
        <meshStandardMaterial color="#f1eadd" roughness={0.8} />
      </mesh>
      {
    /* portico columns */
  }
      {[-3.6, -2.16, -0.72, 0.72, 2.16, 3.6].map((x, i) => <group key={i} position={[x, 0, -1.1]}>
          <B s={[0.8, 0.3, 0.8]} p={[0, 0.35, 0]} c="#f6f0e4" />
          <mesh position={[0, 3, 0]} castShadow receiveShadow>
            <cylinderGeometry args={[0.27, 0.3, 5.2, 28]} />
            <meshStandardMaterial color="#f7f1e6" roughness={0.7} />
          </mesh>
          <B s={[0.8, 0.3, 0.8]} p={[0, 5.75, 0]} c="#f6f0e4" />
        </group>)}
      <B s={[9.6, 0.5, 1]} p={[0, 6.1, -1.1]} c="#f3ecdf" />
      {
    /* steps */
  }
      {[0, 1, 2, 3].map((i) => <B key={i} s={[10.2 - i * 0.2, 0.16, 0.9]} p={[0, 0.09 + i * 0.16, -0.2 + (3 - i) * 0.7 - 0.2]} c="#ebe4d6" rough={0.9} />)}
      {
    /* entrance and the admissions display above it */
  }
      <Glass s={[2.6, 3, 0.1]} p={[0, 1.8, -2.18]} tint="#7d96a6" opacity={0.45} />
      <B s={[2.4, 2.8, 0.04]} p={[0, 1.8, -2.4]} c="#ffd9a0" glow />
      <B s={[0.4, 1.4, 0.4]} p={[3.8, 0.7, 6.4]} c="#e2d9ca" rough={0.8} />
      <LiveScreen industry="education" animate={animate} w={5.2} position={[3.8, 2.85, 6.4]} rotation={[0, -0.18, 0]} />
      <Tag industry="education" position={[3.8, 5.2, 6.4]} />

      {
    /* wings */
  }
      {[-1, 1].map((sd) => <group key={sd}>
          <B s={[7.2, 4.6, 3.8]} p={[sd * 8.2, 2.3, -4.6]} c="#e6dcca" rough={0.9} />
          <B s={[7.6, 0.3, 4.2]} p={[sd * 8.2, 4.7, -4.6]} c="#f2ebde" />
          {winRows.map(
    (y) => [-2.4, -0.8, 0.8, 2.4].map((dx) => <group key={`${y}${dx}`} position={[sd * 8.2 + dx, y, -2.66]}>
                <B s={[0.9, 1.2, 0.08]} c="#9fb9c9" glow={false} rough={0.1} metal={0.3} env={1.8} cast={false} />
                <B s={[1.05, 1.35, 0.05]} p={[0, 0, -0.03]} c="#f4eee3" cast={false} />
              </group>)
  )}
        </group>)}

      {
    /* trees, lamp posts */
  }
      {[
    [-5.8, 0, 3.2],
    [5.8, 0, 3.2],
    [-12.6, 0, 0.4],
    [12.6, 0, 0.4],
    [-9, 0, 6.2],
    [9, 0, 6.2]
  ].map((p, i) => <Tree key={i} p={p} h={3.8 + i % 2 * 0.6} r={1.5} color={i % 2 ? "#6e8a58" : "#7a9460"} />)}
      {[-2.4, 2.4].map((x) => <group key={x} position={[x, 0, 4.6]}>
          <mesh position={[0, 1.4, 0]} castShadow>
            <cylinderGeometry args={[0.04, 0.05, 2.8, 12]} />
            <meshStandardMaterial color="#2c2b29" metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, 2.85, 0]}>
            <sphereGeometry args={[0.14, 16, 12]} />
            <meshBasicMaterial color="#fff0d2" toneMapped={false} />
          </mesh>
        </group>)}
    </>;
}
export {
  AutomotiveScene,
  EducationScene,
  HealthcareScene,
  RealEstateScene
};
