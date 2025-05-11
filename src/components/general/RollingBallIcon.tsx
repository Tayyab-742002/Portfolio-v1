"use client";
import React, { useEffect, useRef } from "react";
import { gsap } from "gsap";
import * as THREE from "three";

const RollingBallIcon: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const cameraRef = useRef<THREE.OrthographicCamera | null>(null);
  const ballRef = useRef<THREE.Mesh | null>(null);
  const pathRef = useRef<{ getPointAt: (t: number) => THREE.Vector3 } | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const renderer = new THREE.WebGLRenderer({
      canvas,
      antialias: true,
      alpha: true,
    });
    rendererRef.current = renderer;

    renderer.setSize(40, 40);
    renderer.setClearColor(0x000000, 0);

    const scene = new THREE.Scene();
    sceneRef.current = scene;

    const camera = new THREE.OrthographicCamera(-15, 15, 15, -15, 0.1, 1000);
    camera.position.z = 100;
    cameraRef.current = camera;

    // Create smaller circular boundary
    const boundaryGeometry = new THREE.RingGeometry(12, 13, 64);
    const boundaryMaterial = new THREE.MeshBasicMaterial({
      color: 0x0099ff,
      side: THREE.DoubleSide,
    });
    const boundary = new THREE.Mesh(boundaryGeometry, boundaryMaterial);
    scene.add(boundary);

    // Create smaller ball (60% of circle size)
    const ballGeometry = new THREE.CircleGeometry(7.2, 32);
    const ballMaterial = new THREE.MeshBasicMaterial({ color: 0x0099ff });
    const ball = new THREE.Mesh(ballGeometry, ballMaterial);
    ballRef.current = ball;
    scene.add(ball);

    // Define smaller path for animation
    const radius = 6;
    const path = {
      getPointAt: (t: number): THREE.Vector3 => {
        const angle = t * Math.PI * 2;
        return new THREE.Vector3(
          radius * Math.sin(angle),
          radius * Math.cos(angle),
          0
        );
      },
    };
    pathRef.current = path;

    const initialPoint = path.getPointAt(0);
    ball.position.copy(initialPoint);

    const animate = (): void => {
      animationRef.current = requestAnimationFrame(animate);
      renderer.render(scene, camera);
    };

    animate();

    const ballTimeline = gsap.timeline({ repeat: -1 });
    ballTimeline.to(
      {},
      {
        duration: 6,
        onUpdate: function () {
          const progress = this.progress();
          const point = path.getPointAt(progress);
          if (ballRef.current) {
            ballRef.current.position.copy(point);
          }
        },
      }
    );

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      renderer.dispose();
      ballTimeline.kill();
      boundaryGeometry.dispose();
      boundaryMaterial.dispose();
      ballGeometry.dispose();
      ballMaterial.dispose();
    };
  }, []);

  return (
    <div className="icon-container">
      <canvas ref={canvasRef} width={40} height={40} />
      <style jsx>{`
        .icon-container {
          width: 40px;
          height: 40px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: transparent;
        }
      `}</style>
    </div>
  );
};

export default RollingBallIcon;
