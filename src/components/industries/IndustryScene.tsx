"use client";

import { Canvas } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import type { IndustryId } from "./industries";
import { AutomotiveScene, EducationScene, HealthcareScene, RealEstateScene } from "./IndustryEnvironments";

type Props = { industry: IndustryId; lite: boolean; animate: boolean; active: boolean; onReady?: () => void };

/**
 * One persistent canvas; the environment inside it is swapped while the wrapper cross-fades,
 * so switching tabs never tears down and rebuilds WebGL.
 */
export default function IndustryScene({ industry, lite, animate, active, onReady }: Props) {
  return (
    <Canvas
      frameloop={animate && active ? "always" : "demand"}
      dpr={lite ? [1, 1.5] : [1, 2]}
      shadows={lite ? false : "percentage"}
      camera={{ position: [4, 3, 12], fov: 32, near: 0.1, far: 140 }}
      gl={{ antialias: !lite, alpha: true }}
      onCreated={() => onReady?.()}
      aria-hidden
    >
      <Environment resolution={256} frames={1}>
        <Lightformer form="rect" intensity={2.6} color="#fff3e4" position={[-4, 6, 5]} scale={[12, 4, 1]} />
        <Lightformer form="rect" intensity={1.6} color="#ffd9b0" position={[8, 3, 3]} scale={[3, 6, 1]} />
        <Lightformer form="rect" intensity={1.4} color="#ffffff" position={[0, 7, -6]} scale={[18, 5, 1]} />
        <Lightformer form="rect" intensity={1.0} color="#fff1e2" position={[0, 3, 12]} scale={[30, 8, 1]} />
      </Environment>
      {industry === "automotive" && <AutomotiveScene key="a" animate={animate} lite={lite} />}
      {industry === "real-estate" && <RealEstateScene key="r" animate={animate} lite={lite} />}
      {industry === "healthcare" && <HealthcareScene key="h" animate={animate} lite={lite} />}
      {industry === "education" && <EducationScene key="e" animate={animate} lite={lite} />}
    </Canvas>
  );
}
