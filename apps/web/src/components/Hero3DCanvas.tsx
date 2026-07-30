import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html, Float } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

interface HotspotProps {
  position: [number, number, number];
  title: string;
  price: string;
  category: string;
  image: string;
  onClick: () => void;
}

const HotspotMarker: React.FC<HotspotProps> = ({ position, title, price, category, image, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <Html position={position} center distanceFactor={8} zIndexRange={[100, 0]}>
      <div 
        className="relative group cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onClick={onClick}
      >
        <button 
          type="button" 
          className="w-7 h-7 rounded-full bg-brand-linen/95 dark:bg-brand-walnut/90 shadow-xl border border-brand-terracotta/40 flex items-center justify-center animate-pulse hover:scale-125 transition-all cursor-pointer"
        >
          <span className="w-2.5 h-2.5 rounded-full bg-brand-terracotta" />
        </button>

        {hovered && (
          <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-48 bg-brand-linen dark:bg-brand-charcoal text-brand-walnut dark:text-brand-linen p-3 shadow-2xl border border-brand-sand-dark/30 rounded text-left pointer-events-auto transition-all animate-fade-up">
            <img src={image} className="w-full h-20 object-cover mb-2 rounded border border-brand-sand-dark/15" alt={title} />
            <span className="text-[9px] uppercase tracking-wider font-semibold text-brand-terracotta block">{category}</span>
            <h5 className="font-serif font-bold text-xs line-clamp-1">{title}</h5>
            <div className="flex justify-between items-center pt-2 mt-1 border-t border-brand-sand-dark/15">
              <span className="text-brand-terracotta text-xs font-bold">{price}</span>
              <span className="text-[9px] uppercase tracking-wider font-bold text-brand-walnut dark:text-brand-linen">Shop →</span>
            </div>
          </div>
        )}
      </div>
    </Html>
  );
};

// 3D Room Scene Geometry
const RoomScene: React.FC<{ onSelectProduct: (path: string) => void }> = ({ onSelectProduct }) => {
  return (
    <group position={[0, -0.6, 0]}>
      {/* Soft Ambient & Directional Studio Lights */}
      <ambientLight intensity={1.2} />
      <directionalLight position={[5, 8, 5]} intensity={1.5} castShadow color="#FFF8EE" />
      <pointLight position={[-3, 4, -2]} intensity={0.8} color="#FFDDAA" />

      {/* Tactile Woven Floor Rug */}
      <mesh position={[0, 0, 0]} receiveShadow>
        <boxGeometry args={[4.2, 0.04, 3.2]} />
        <meshStandardMaterial color="#E6E0D4" roughness={0.9} />
      </mesh>

      {/* Bouclé Lounge Sofa */}
      <group position={[-0.8, 0.4, -0.2]}>
        {/* Main Seat Cushion */}
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.8, 0.35, 1.1]} />
          <meshStandardMaterial color="#F4F0E8" roughness={0.8} />
        </mesh>
        {/* Backrest */}
        <mesh position={[0, 0.55, -0.42]} castShadow>
          <boxGeometry args={[1.8, 0.5, 0.28]} />
          <meshStandardMaterial color="#F0EBE0" roughness={0.85} />
        </mesh>
        {/* Wooden Legs */}
        {[-0.8, 0.8].map((x, i) => (
          <mesh key={i} position={[x, -0.1, 0.3]} castShadow>
            <cylinderGeometry args={[0.04, 0.03, 0.25, 16]} />
            <meshStandardMaterial color="#3D2E26" roughness={0.4} />
          </mesh>
        ))}
      </group>

      {/* Travertine Low Coffee Table */}
      <group position={[0.7, 0.25, 0.4]}>
        {/* Table Slab Top */}
        <mesh position={[0, 0.12, 0]} castShadow>
          <cylinderGeometry args={[0.65, 0.65, 0.06, 32]} />
          <meshStandardMaterial color="#DDD5C7" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Table Pedestal Leg */}
        <mesh position={[0, -0.05, 0]} castShadow>
          <cylinderGeometry args={[0.3, 0.35, 0.28, 32]} />
          <meshStandardMaterial color="#CBBFA9" roughness={0.5} />
        </mesh>
        {/* Ceramic Vase on Table */}
        <mesh position={[0.15, 0.28, -0.1]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.25, 16]} />
          <meshStandardMaterial color="#BC6C58" roughness={0.6} />
        </mesh>
      </group>

      {/* Sculptural Brass Floor Lamp */}
      <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.2}>
        <group position={[1.4, 1.1, -0.8]}>
          {/* Base */}
          <mesh position={[0, -0.8, 0]} castShadow>
            <cylinderGeometry args={[0.2, 0.2, 0.04, 24]} />
            <meshStandardMaterial color="#B89768" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Pole Stem */}
          <mesh position={[0, 0, 0]} castShadow>
            <cylinderGeometry args={[0.02, 0.02, 1.6, 16]} />
            <meshStandardMaterial color="#B89768" metalness={0.8} roughness={0.2} />
          </mesh>
          {/* Lamp Shade */}
          <mesh position={[0, 0.8, 0]} castShadow>
            <coneGeometry args={[0.35, 0.3, 24]} />
            <meshStandardMaterial color="#FAF8F5" roughness={0.3} />
          </mesh>
        </group>
      </Float>

      {/* 3D Interactive Hotspot Markers */}
      <HotspotMarker 
        position={[-0.8, 0.8, -0.2]} 
        title="Oasis Bouclé Lounge Chair" 
        price="₹890.00" 
        category="Furniture" 
        image="https://images.unsplash.com/photo-1592078615290-033ee584e267?auto=format&fit=crop&q=80&w=300"
        onClick={() => onSelectProduct('/products')}
      />

      <HotspotMarker 
        position={[0.7, 0.5, 0.4]} 
        title="Travertine Low Coffee Table" 
        price="₹750.00" 
        category="Living Room" 
        image="https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=300"
        onClick={() => onSelectProduct('/products?category=furniture')}
      />

      <HotspotMarker 
        position={[1.4, 1.6, -0.8]} 
        title="Brushed Brass Floor Lamp" 
        price="₹420.00" 
        category="Lighting" 
        image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=300"
        onClick={() => onSelectProduct('/products?category=lighting')}
      />
    </group>
  );
};

export const Hero3DCanvas: React.FC = () => {
  const navigate = useNavigate();
  const [hasWebGL, setHasWebGL] = useState(true);

  useEffect(() => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
      if (!gl) setHasWebGL(false);
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  // WebGL Static Image Fallback for Mobile / Low-End Devices
  if (!hasWebGL) {
    return (
      <div className="relative w-full h-full min-h-[420px] bg-brand-sand-dark/20 flex items-center justify-center">
        <img 
          src="https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&q=80&w=1200" 
          alt="HommieSpace Luxury Room Scene" 
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/20" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full min-h-[420px] bg-gradient-to-b from-brand-sand-light/40 via-brand-linen to-brand-sand-light/20 dark:from-brand-charcoal dark:to-brand-walnut/40">
      <Suspense fallback={
        <div className="w-full h-full flex items-center justify-center text-xs font-sans text-brand-clay animate-pulse">
          Loading Interactive 3D Room Scene...
        </div>
      }>
        <Canvas 
          camera={{ position: [3, 2.5, 4.5], fov: 42 }}
          shadows
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <RoomScene onSelectProduct={(path) => navigate(path)} />
          <OrbitControls 
            enableZoom={false} 
            autoRotate 
            autoRotateSpeed={0.8} 
            maxPolarAngle={Math.PI / 2 - 0.05} 
            minPolarAngle={Math.PI / 4}
            dampingFactor={0.05}
          />
        </Canvas>
      </Suspense>

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-4 right-4 bg-brand-linen/90 dark:bg-brand-charcoal/90 border border-brand-sand-dark/30 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-brand-walnut dark:text-brand-linen shadow-lg pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-ping" />
        Interactive 3D Scene · Drag to Orbit
      </div>
    </div>
  );
};

export default Hero3DCanvas;
