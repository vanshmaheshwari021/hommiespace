import React, { Suspense, useState, useEffect } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Html } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';

interface ErrorBoundaryProps {
  fallback: React.ReactNode;
  children: React.ReactNode;
}

class ErrorBoundary3D extends React.Component<ErrorBoundaryProps, { hasError: boolean }> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error: any) {
    console.warn('R3F 3D Canvas fallback triggered:', error);
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback;
    }
    return this.props.children;
  }
}

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
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.8, 0.35, 1.1]} />
          <meshStandardMaterial color="#F4F0E8" roughness={0.8} />
        </mesh>
        <mesh position={[0, 0.5, -0.45]} castShadow>
          <boxGeometry args={[1.8, 0.45, 0.25]} />
          <meshStandardMaterial color="#EAE4D8" roughness={0.8} />
        </mesh>
        <mesh position={[-0.8, 0.35, 0]} castShadow>
          <boxGeometry args={[0.25, 0.35, 1.1]} />
          <meshStandardMaterial color="#EAE4D8" roughness={0.8} />
        </mesh>
        <mesh position={[0.8, 0.35, 0]} castShadow>
          <boxGeometry args={[0.25, 0.35, 1.1]} />
          <meshStandardMaterial color="#EAE4D8" roughness={0.8} />
        </mesh>
      </group>

      {/* Travertine Coffee Table */}
      <group position={[0.5, 0.25, 0.3]}>
        <mesh position={[0, 0.15, 0]} castShadow>
          <boxGeometry args={[1.2, 0.08, 0.7]} />
          <meshStandardMaterial color="#D9CEB8" roughness={0.4} metalness={0.1} />
        </mesh>
        <mesh position={[-0.45, 0.07, -0.2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.14, 16]} />
          <meshStandardMaterial color="#A39682" />
        </mesh>
        <mesh position={[0.45, 0.07, 0.2]} castShadow>
          <cylinderGeometry args={[0.06, 0.06, 0.14, 16]} />
          <meshStandardMaterial color="#A39682" />
        </mesh>

        {/* Ceramic Vase Accent */}
        <mesh position={[0.2, 0.3, 0]} castShadow>
          <cylinderGeometry args={[0.08, 0.12, 0.25, 16]} />
          <meshStandardMaterial color="#BC6C58" roughness={0.6} />
        </mesh>
      </group>

      {/* Architectural Brass Floor Lamp */}
      <group position={[1.4, 0, -0.8]}>
        <mesh position={[0, 0.02, 0]}>
          <cylinderGeometry args={[0.25, 0.25, 0.04, 32]} />
          <meshStandardMaterial color="#3D2E26" metalness={0.6} />
        </mesh>
        <mesh position={[0, 1.1, 0]}>
          <cylinderGeometry args={[0.02, 0.02, 2.2, 16]} />
          <meshStandardMaterial color="#C5A059" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh position={[0, 2.1, 0]}>
          <coneGeometry args={[0.3, 0.35, 32]} />
          <meshStandardMaterial color="#F9F6F0" roughness={0.3} />
        </mesh>
      </group>

      {/* 3D Hotspot Pulse Markers */}
      <HotspotMarker 
        position={[-0.8, 0.75, 0]}
        title="Minimalist Oak Lounge Chair"
        price="₹24,500"
        category="Furniture"
        image="https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&w=400&q=80"
        onClick={() => onSelectProduct('/products?category=furniture')}
      />

      <HotspotMarker 
        position={[0.5, 0.45, 0.3]}
        title="Nordic Ceramic Vase Set"
        price="₹4,200"
        category="Kitchenware"
        image="https://images.unsplash.com/photo-1612196808214-b7e239e5f6b7?auto=format&fit=crop&w=400&q=80"
        onClick={() => onSelectProduct('/products?category=kitchenware')}
      />

      <HotspotMarker 
        position={[1.4, 2.2, -0.8]}
        title="Sculptural Ceramic Pendant Lamp"
        price="₹12,800"
        category="Lighting"
        image="https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&w=400&q=80"
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
      if (!gl) {
        setHasWebGL(false);
      }
    } catch (e) {
      setHasWebGL(false);
    }
  }, []);

  const editorialFallback = (
    <div className="relative w-full h-full min-h-[420px] bg-brand-sand-light dark:bg-brand-charcoal overflow-hidden group">
      <img 
        src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80" 
        alt="Luxury Scandinavian Interior" 
        className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-brand-charcoal/80 via-transparent to-transparent flex flex-col justify-end p-8 text-left">
        <span className="text-brand-linen text-[10px] uppercase font-mono tracking-widest bg-brand-terracotta px-3 py-1 w-max mb-2">Curated Showroom</span>
        <h3 className="font-serif text-2xl font-bold text-white">Quiet Luxury Living Spaces</h3>
      </div>
    </div>
  );

  if (!hasWebGL) {
    return editorialFallback;
  }

  return (
    <div className="relative w-full h-full min-h-[420px] bg-gradient-to-b from-brand-sand-light/40 via-brand-linen to-brand-sand-light/20 dark:from-brand-charcoal dark:to-brand-walnut/40">
      <ErrorBoundary3D fallback={editorialFallback}>
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
      </ErrorBoundary3D>

      {/* Floating 3D Interaction Badge */}
      <div className="absolute bottom-4 right-4 bg-brand-linen/90 dark:bg-brand-charcoal/90 border border-brand-sand-dark/30 px-3 py-1.5 rounded-full text-[10px] uppercase font-bold tracking-widest text-brand-walnut dark:text-brand-linen shadow-lg pointer-events-none flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-brand-terracotta animate-ping" />
        Interactive 3D Scene · Drag to Orbit
      </div>
    </div>
  );
};

export default Hero3DCanvas;
