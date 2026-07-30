import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface Hotspot {
  id: string;
  title: string;
  price: string;
  category: string;
  image: string;
  path: string;
  top: string;
  left: string;
}

const HOTSPOTS: Hotspot[] = [
  {
    id: 'chair',
    title: 'Minimalist Oak Lounge Chair',
    price: '₹24,500',
    category: 'Furniture',
    image: 'https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=600&q=80',
    path: '/products?category=furniture',
    top: '52%',
    left: '32%'
  },
  {
    id: 'table',
    title: 'Nordic Ceramic Vase Set',
    price: '₹4,200',
    category: 'Kitchenware',
    image: 'https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=600&q=80',
    path: '/products?category=kitchenware',
    top: '64%',
    left: '58%'
  },
  {
    id: 'lamp',
    title: 'Sculptural Ceramic Lamp',
    price: '₹12,800',
    category: 'Lighting',
    image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=600&q=80',
    path: '/products?category=lighting',
    top: '28%',
    left: '74%'
  }
];

export const Hero3DCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const navigate = useNavigate();
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [is3DReady, setIs3DReady] = useState(false);

  useEffect(() => {
    if (!canvasRef.current || !containerRef.current) return;

    const container = containerRef.current;
    const canvas = canvasRef.current;

    // 1. Three.js Scene Setup
    const scene = new THREE.Scene();
    scene.background = null;

    // 2. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      40,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(3.5, 2.8, 5);

    // 3. Renderer Setup
    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    // 4. Studio Lighting
    const ambientLight = new THREE.AmbientLight(0xfff8ee, 1.2);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xfff5ea, 1.6);
    dirLight.position.set(5, 8, 4);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    scene.add(dirLight);

    const fillLight = new THREE.PointLight(0xffddaa, 0.8);
    fillLight.position.set(-4, 3, -2);
    scene.add(fillLight);

    // 5. Procedural 3D Living Room Group
    const roomGroup = new THREE.Group();
    roomGroup.position.set(0, -0.6, 0);

    // Rug Base
    const rugGeo = new THREE.BoxGeometry(4.2, 0.04, 3.2);
    const rugMat = new THREE.MeshStandardMaterial({ color: 0xe6e0d4, roughness: 0.9 });
    const rug = new THREE.Mesh(rugGeo, rugMat);
    rug.receiveShadow = true;
    roomGroup.add(rug);

    // Lounge Sofa (Bouclé Fabric)
    const sofaGroup = new THREE.Group();
    sofaGroup.position.set(-0.8, 0.4, -0.2);

    const sofaMat = new THREE.MeshStandardMaterial({ color: 0xf4f0e8, roughness: 0.8 });
    const cushionGeo = new THREE.BoxGeometry(1.8, 0.35, 1.1);
    const cushion = new THREE.Mesh(cushionGeo, sofaMat);
    cushion.position.set(0, 0.15, 0);
    cushion.castShadow = true;
    cushion.receiveShadow = true;
    sofaGroup.add(cushion);

    const backrestGeo = new THREE.BoxGeometry(1.8, 0.45, 0.25);
    const backrest = new THREE.Mesh(backrestGeo, sofaMat);
    backrest.position.set(0, 0.5, -0.45);
    backrest.castShadow = true;
    sofaGroup.add(backrest);

    const armLeftGeo = new THREE.BoxGeometry(0.25, 0.35, 1.1);
    const armLeft = new THREE.Mesh(armLeftGeo, sofaMat);
    armLeft.position.set(-0.8, 0.35, 0);
    armLeft.castShadow = true;
    sofaGroup.add(armLeft);

    const armRight = armLeft.clone();
    armRight.position.set(0.8, 0.35, 0);
    sofaGroup.add(armRight);

    roomGroup.add(sofaGroup);

    // Travertine Coffee Table
    const tableGroup = new THREE.Group();
    tableGroup.position.set(0.5, 0.25, 0.3);

    const tableTopGeo = new THREE.BoxGeometry(1.2, 0.08, 0.7);
    const tableMat = new THREE.MeshStandardMaterial({ color: 0xd9ceb8, roughness: 0.4, metalness: 0.1 });
    const tableTop = new THREE.Mesh(tableTopGeo, tableMat);
    tableTop.position.set(0, 0.15, 0);
    tableTop.castShadow = true;
    tableGroup.add(tableTop);

    const legGeo = new THREE.CylinderGeometry(0.06, 0.06, 0.14, 16);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xa39682 });
    const leg1 = new THREE.Mesh(legGeo, legMat);
    leg1.position.set(-0.45, 0.07, -0.2);
    tableGroup.add(leg1);

    const leg2 = leg1.clone();
    leg2.position.set(0.45, 0.07, 0.2);
    tableGroup.add(leg2);

    // Ceramic Vase Accent
    const vaseGeo = new THREE.CylinderGeometry(0.08, 0.12, 0.25, 16);
    const vaseMat = new THREE.MeshStandardMaterial({ color: 0xbc6c58, roughness: 0.6 });
    const vase = new THREE.Mesh(vaseGeo, vaseMat);
    vase.position.set(0.2, 0.3, 0);
    vase.castShadow = true;
    tableGroup.add(vase);

    roomGroup.add(tableGroup);

    // Brass Floor Lamp
    const lampGroup = new THREE.Group();
    lampGroup.position.set(1.4, 0, -0.8);

    const lampBaseGeo = new THREE.CylinderGeometry(0.25, 0.25, 0.04, 32);
    const lampBaseMat = new THREE.MeshStandardMaterial({ color: 0x3d2e26, metalness: 0.6 });
    const lampBase = new THREE.Mesh(lampBaseGeo, lampBaseMat);
    lampBase.position.set(0, 0.02, 0);
    lampGroup.add(lampBase);

    const stemGeo = new THREE.CylinderGeometry(0.02, 0.02, 2.2, 16);
    const brassMat = new THREE.MeshStandardMaterial({ color: 0xc5a059, metalness: 0.8, roughness: 0.2 });
    const stem = new THREE.Mesh(stemGeo, brassMat);
    stem.position.set(0, 1.1, 0);
    lampGroup.add(stem);

    const shadeGeo = new THREE.ConeGeometry(0.3, 0.35, 32);
    const shadeMat = new THREE.MeshStandardMaterial({ color: 0xf9f6f0, roughness: 0.3 });
    const shade = new THREE.Mesh(shadeGeo, shadeMat);
    shade.position.set(0, 2.1, 0);
    lampGroup.add(shade);

    roomGroup.add(lampGroup);
    scene.add(roomGroup);

    // 6. Orbit Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableZoom = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 0.8;
    controls.maxPolarAngle = Math.PI / 2 - 0.05;
    controls.minPolarAngle = Math.PI / 4;
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    setIs3DReady(true);

    // 7. Animation Loop
    let animationFrameId: number;
    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // 8. Handle Resize
    const handleResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
    };
  }, []);

  return (
    <div ref={containerRef} className="relative w-full h-full min-h-[480px] bg-gradient-to-b from-brand-sand-light/50 via-brand-linen to-brand-sand-light/30 dark:from-brand-charcoal dark:to-brand-walnut/40 overflow-hidden border border-brand-sand-dark/20 dark:border-brand-sand-dark/10 shadow-2xl">
      {/* Native WebGL Three.js 3D Canvas */}
      <canvas 
        ref={canvasRef} 
        className="w-full h-full cursor-grab active:cursor-grabbing block" 
      />

      {/* Interactive Hotspots Overlaid on 3D Room */}
      {is3DReady && HOTSPOTS.map((spot) => (
        <div
          key={spot.id}
          className="absolute z-20"
          style={{ top: spot.top, left: spot.left }}
        >
          <div 
            className="relative cursor-pointer"
            onMouseEnter={() => setActiveHotspot(spot.id)}
            onMouseLeave={() => setActiveHotspot(null)}
            onClick={() => navigate(spot.path)}
          >
            <button 
              type="button" 
              className="w-7 h-7 rounded-full bg-white/95 dark:bg-brand-walnut/90 shadow-2xl border border-brand-terracotta/50 flex items-center justify-center animate-pulse hover:scale-125 transition-all cursor-pointer"
            >
              <span className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" />
            </button>

            <AnimatePresence>
              {activeHotspot === spot.id && (
                <motion.div 
                  initial={{ opacity: 0, y: 10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen p-3 shadow-2xl border border-brand-sand-dark/30 rounded-none text-left pointer-events-auto z-30"
                >
                  <img src={spot.image} className="w-full h-20 object-cover mb-2 border border-brand-sand-dark/15" alt={spot.title} />
                  <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-terracotta block">{spot.category}</span>
                  <h5 className="font-serif font-bold text-xs line-clamp-1">{spot.title}</h5>
                  <div className="flex justify-between items-center pt-2 mt-1 border-t border-brand-sand-dark/15">
                    <span className="text-brand-terracotta text-xs font-bold">{spot.price}</span>
                    <span className="text-[9px] uppercase tracking-wider font-bold text-brand-walnut dark:text-brand-linen hover:text-brand-terracotta">Shop →</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      ))}

      {/* Floating 3D Control Badge */}
      <div className="absolute bottom-4 right-4 bg-brand-linen/90 dark:bg-brand-charcoal/90 border border-brand-sand-dark/30 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-brand-walnut dark:text-brand-linen shadow-lg pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-ping" />
        Interactive 3D Room · Drag to Orbit
      </div>
    </div>
  );
};

export default Hero3DCanvas;
