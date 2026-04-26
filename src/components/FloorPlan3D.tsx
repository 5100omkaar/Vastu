import { useState, Suspense, useMemo } from "react";
import { Canvas, ThreeEvent } from "@react-three/fiber";
import { OrbitControls, Text } from "@react-three/drei";
import * as THREE from "three";

interface RoomScore {
    room: string; score: number; direction: string; element: string; status: string;
}
interface FloorPlan3DProps { rooms: RoomScore[]; }

// ── Constants ─────────────────────────────────────────────────────────────────
const WALL_H = 2.6;
const WALL_T = 0.22;
const EXT_CLR = "#2a2a2a";   // dark exterior wall
const INT_CLR = "#8b7355";   // warm interior wall
const WOOD_CLR = "#c8a96e";   // light wood floor

function scoreToColor(s: number) {
    return s >= 75 ? "#22c55e" : s >= 50 ? "#f59e0b" : "#ef4444";
}

// ── Direction → grid cell ─────────────────────────────────────────────────────
const DIR_MAP: Record<string, [number, number]> = {
    north: [1, 0], n: [1, 0], northeast: [2, 0], ne: [2, 0],
    east: [2, 1], e: [2, 1], southeast: [2, 2], se: [2, 2],
    south: [1, 2], s: [1, 2], southwest: [0, 2], sw: [0, 2],
    west: [0, 1], w: [0, 1], northwest: [0, 0], nw: [0, 0],
    center: [1, 1], central: [1, 1],
};
function dirToGrid(d: string): [number, number] {
    return DIR_MAP[d.toLowerCase().replace(/[^a-z]/g, "")] ?? [1, 1];
}

interface RoomCell extends RoomScore {
    col: number; row: number; cx: number; cz: number; w: number; d: number;
}
const CS = 4.8; // cell size

function buildLayout(rooms: RoomScore[]): RoomCell[] {
    const occ = new Map<string, boolean>();
    const fb: [number, number][] = [[1, 1], [0, 1], [2, 1], [1, 0], [1, 2], [0, 0], [2, 0], [0, 2], [2, 2], [3, 1], [1, 3], [-1, 1], [1, -1]];
    let fi = 0;
    return rooms.map(r => {
        let [col, row] = dirToGrid(r.direction);
        if (occ.has(`${col},${row}`)) {
            while (fi < fb.length) { const [fc, fr] = fb[fi++]; if (!occ.has(`${fc},${fr}`)) { col = fc; row = fr; break; } }
        }
        occ.set(`${col},${row}`, true);
        return { ...r, col, row, cx: (col - 1) * CS, cz: (row - 1) * CS, w: CS - WALL_T, d: CS - WALL_T };
    });
}

// ── Shared materials (memoised outside components) ────────────────────────────
const woodMat = new THREE.MeshStandardMaterial({ color: WOOD_CLR, roughness: 0.55, metalness: 0.0 });
const tileMat = new THREE.MeshStandardMaterial({ color: "#6b7280", roughness: 0.4 });
const darkTile = new THREE.MeshStandardMaterial({ color: "#374151", roughness: 0.5 });
const wallMat = new THREE.MeshStandardMaterial({ color: INT_CLR, roughness: 0.7 });
const extMat = new THREE.MeshStandardMaterial({ color: EXT_CLR, roughness: 0.6 });
const whiteMat = new THREE.MeshStandardMaterial({ color: "#f5f5f5", roughness: 0.8 });
const glassMat = new THREE.MeshStandardMaterial({ color: "#c8e6f5", transparent: true, opacity: 0.45, roughness: 0.05 });

// ── Furniture ─────────────────────────────────────────────────────────────────

function Box({ pos, size, color, roughness = 0.6, metalness = 0, emissive, emissiveIntensity = 0 }:
    {
        pos: [number, number, number]; size: [number, number, number]; color: string;
        roughness?: number; metalness?: number; emissive?: string; emissiveIntensity?: number
    }) {
    return (
        <mesh position={pos} castShadow receiveShadow>
            <boxGeometry args={size} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness}
                emissive={emissive ?? color} emissiveIntensity={emissive ? emissiveIntensity : 0} />
        </mesh>
    );
}

function Cyl({ pos, r, h, color, roughness = 0.5, metalness = 0 }:
    { pos: [number, number, number]; r: number; h: number; color: string; roughness?: number; metalness?: number }) {
    return (
        <mesh position={pos} castShadow>
            <cylinderGeometry args={[r, r, h, 16]} />
            <meshStandardMaterial color={color} roughness={roughness} metalness={metalness} />
        </mesh>
    );
}

function Sofa({ x = 0, z = 0, ry = 0 }: { x?: number; z?: number; ry?: number }) {
    return (
        <group position={[x, 0, z]} rotation={[0, ry, 0]}>
            <Box pos={[0, 0.22, 0]} size={[2.0, 0.44, 0.75]} color="#9e8c7a" roughness={0.85} />
            <Box pos={[0, 0.62, -0.3]} size={[2.0, 0.76, 0.14]} color="#8a7a6a" roughness={0.85} />
            <Box pos={[-0.93, 0.5, 0]} size={[0.14, 0.56, 0.75]} color="#8a7a6a" roughness={0.85} />
            <Box pos={[0.93, 0.5, 0]} size={[0.14, 0.56, 0.75]} color="#8a7a6a" roughness={0.85} />
            {[-0.62, 0, 0.62].map((px, i) => (
                <Box key={i} pos={[px, 0.5, 0.05]} size={[0.58, 0.2, 0.62]} color="#c4b09a" roughness={0.9} />
            ))}
            {/* throw pillow */}
            <Box pos={[0.5, 0.68, 0.05]} size={[0.3, 0.22, 0.28]} color="#e07060" roughness={0.9} />
        </group>
    );
}

function CoffeeTable({ x = 0, z = 0 }: { x?: number; z?: number }) {
    return (
        <group position={[x, 0, z]}>
            <Box pos={[0, 0.38, 0]} size={[1.1, 0.06, 0.6]} color="#7a5c2a" roughness={0.4} metalness={0.05} />
            {[[-0.46, -0.25], [0.46, -0.25], [-0.46, 0.25], [0.46, 0.25]].map(([lx, lz], i) => (
                <Cyl key={i} pos={[lx, 0.19, lz]} r={0.03} h={0.38} color="#5c4020" roughness={0.5} />
            ))}
            {/* decorative bowl */}
            <Cyl pos={[0, 0.44, 0]} r={0.14} h={0.06} color="#c8a050" roughness={0.3} metalness={0.3} />
        </group>
    );
}

function Bed({ x = 0, z = 0, ry = 0 }: { x?: number; z?: number; ry?: number }) {
    return (
        <group position={[x, 0, z]} rotation={[0, ry, 0]}>
            <Box pos={[0, 0.2, 0]} size={[1.8, 0.4, 2.2]} color="#6b4c2a" roughness={0.7} />
            <Box pos={[0, 0.44, 0.1]} size={[1.68, 0.2, 1.9]} color="#e8ddd0" roughness={0.9} />
            <Box pos={[0, 0.56, 0.2]} size={[1.66, 0.08, 1.5]} color="#f0c8b0" roughness={0.95} />
            {[-0.42, 0.42].map((px, i) => (
                <Box key={i} pos={[px, 0.58, -0.78]} size={[0.6, 0.14, 0.42]} color="#ffffff" roughness={1} />
            ))}
            <Box pos={[0, 0.78, -1.05]} size={[1.8, 1.0, 0.1]} color="#5a3c1e" roughness={0.7} />
            {/* bedside tables */}
            {[-1.05, 1.05].map((px, i) => (
                <group key={i} position={[px, 0, 0]}>
                    <Box pos={[0, 0.38, 0]} size={[0.42, 0.76, 0.42]} color="#7a5c3a" roughness={0.6} />
                    <Cyl pos={[0, 0.78, 0]} r={0.16} h={0.04} color="#8b6914" roughness={0.3} />
                    {/* lamp */}
                    <Cyl pos={[0, 0.88, 0]} r={0.03} h={0.22} color="#c0c0c0" roughness={0.3} metalness={0.7} />
                    <Cyl pos={[0, 1.06, 0]} r={0.12} h={0.18} color="#f5f0e0" roughness={0.9} />
                </group>
            ))}
        </group>
    );
}

function DiningSet({ x = 0, z = 0 }: { x?: number; z?: number }) {
    return (
        <group position={[x, 0, z]}>
            <Box pos={[0, 0.76, 0]} size={[1.7, 0.07, 0.95]} color="#a0522d" roughness={0.5} />
            {[[-0.72, -0.4], [0.72, -0.4], [-0.72, 0.4], [0.72, 0.4]].map(([lx, lz], i) => (
                <Cyl key={i} pos={[lx, 0.38, lz]} r={0.04} h={0.76} color="#7a3e1a" roughness={0.6} />
            ))}
            {/* fruit bowl */}
            <Cyl pos={[0, 0.82, 0]} r={0.18} h={0.07} color="#e8c060" roughness={0.3} metalness={0.2} />
            <Cyl pos={[0, 0.88, 0]} r={0.1} h={0.08} color="#e05030" roughness={0.8} />
            {/* chairs */}
            {[[-1.12, 0, 0], [1.12, 0, Math.PI], [0, -0.65, Math.PI / 2], [0, 0.65, -Math.PI / 2]].map(([cx, cz, cry], i) => (
                <group key={i} position={[cx, 0, cz]} rotation={[0, cry, 0]}>
                    <Box pos={[0, 0.46, 0]} size={[0.44, 0.05, 0.44]} color="#c8a06a" roughness={0.7} />
                    <Box pos={[0, 0.8, -0.19]} size={[0.44, 0.64, 0.05]} color="#b89050" roughness={0.7} />
                    {[[-0.18, -0.18], [0.18, -0.18], [-0.18, 0.18], [0.18, 0.18]].map(([lx, lz], j) => (
                        <Cyl key={j} pos={[lx, 0.23, lz]} r={0.025} h={0.46} color="#8b6914" roughness={0.6} />
                    ))}
                </group>
            ))}
        </group>
    );
}

function KitchenL({ w, d }: { w: number; d: number }) {
    const hw = w / 2, hd = d / 2;
    return (
        <group>
            {/* back counter */}
            <Box pos={[0, 0.46, -hd + 0.3]} size={[w - 1.2, 0.92, 0.58]} color="#d4c5a9" roughness={0.6} />
            <Box pos={[0, 0.92, -hd + 0.3]} size={[w - 1.18, 0.05, 0.6]} color="#708090" roughness={0.25} metalness={0.5} />
            {/* side counter */}
            <Box pos={[hw - 0.3, 0.46, 0]} size={[0.58, 0.92, d - 1.2]} color="#d4c5a9" roughness={0.6} />
            <Box pos={[hw - 0.3, 0.92, 0]} size={[0.6, 0.05, d - 1.18]} color="#708090" roughness={0.25} metalness={0.5} />
            {/* sink */}
            <Box pos={[-hw * 0.3, 0.95, -hd + 0.3]} size={[0.52, 0.05, 0.38]} color="#a8b8c8" roughness={0.15} metalness={0.8} />
            {/* stove */}
            {[[-0.12, -0.1], [-0.12, 0.1]].map(([bx, bz], i) => (
                <Cyl key={i} pos={[hw * 0.3 + bx, 0.95, -hd + 0.3 + bz]} r={0.1} h={0.03} color="#222" roughness={0.3} metalness={0.7} />
            ))}
            {/* upper cabinets */}
            <Box pos={[0, 1.78, -hd + 0.18]} size={[w - 1.4, 0.58, 0.3]} color="#e8dcc8" roughness={0.6} />
            <Box pos={[hw - 0.18, 1.78, 0]} size={[0.3, 0.58, d - 1.4]} color="#e8dcc8" roughness={0.6} />
            {/* fridge */}
            <Box pos={[-hw + 0.35, 1.0, -hd + 0.35]} size={[0.62, 2.0, 0.62]} color="#e0e0e0" roughness={0.3} metalness={0.3} />
            <Box pos={[-hw + 0.35, 1.0, -hd + 0.04]} size={[0.58, 1.9, 0.04]} color="#c8c8c8" roughness={0.2} metalness={0.5} />
        </group>
    );
}

function BathroomSet({ w, d }: { w: number; d: number }) {
    const hw = w / 2, hd = d / 2;
    return (
        <group>
            {/* bathtub */}
            <Box pos={[0, 0.3, -hd + 0.55]} size={[1.55, 0.6, 0.75]} color="#e8f4f8" roughness={0.3} />
            <Box pos={[0, 0.46, -hd + 0.55]} size={[1.35, 0.3, 0.56]} color="#c0dce8" roughness={0.2} metalness={0.05} />
            {/* toilet */}
            <group position={[hw - 0.38, 0, hd - 0.5]}>
                <Cyl pos={[0, 0.24, 0]} r={0.2} h={0.48} color="#f0ede8" roughness={0.4} />
                <Box pos={[0, 0.5, -0.1]} size={[0.38, 0.06, 0.28]} color="#e8e4de" roughness={0.4} />
                <Box pos={[0, 0.66, -0.22]} size={[0.36, 0.3, 0.14]} color="#e8e4de" roughness={0.4} />
            </group>
            {/* vanity */}
            <Box pos={[-hw + 0.35, 0.44, hd - 0.35]} size={[0.62, 0.88, 0.5]} color="#c8b89a" roughness={0.6} />
            <Box pos={[-hw + 0.35, 0.9, hd - 0.35]} size={[0.64, 0.05, 0.52]} color="#a8b8c8" roughness={0.2} metalness={0.6} />
            {/* mirror */}
            <Box pos={[-hw + 0.35, 1.5, hd - 0.1]} size={[0.55, 0.7, 0.04]} color="#c8e0f0" roughness={0.05} metalness={0.2} />
            {/* shower area - dark tiles */}
            <mesh position={[hw - 0.9, 0.02, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[1.4, d * 0.5]} />
                <primitive object={darkTile} />
            </mesh>
            <Box pos={[hw - 0.22, 0.9, 0]} size={[0.04, 1.8, d * 0.5]} color="#555" roughness={0.4} />
        </group>
    );
}

function PoojaRoom({ w, d }: { w: number; d: number }) {
    const hd = d / 2;
    return (
        <group>
            <Box pos={[0, 0.95, -hd + 0.22]} size={[1.0, 1.9, 0.38]} color="#c8a050" roughness={0.5} />
            <Box pos={[0, 1.92, -hd + 0.22]} size={[1.0, 0.1, 0.38]} color="#d4a840" roughness={0.4} />
            {/* arch */}
            <mesh position={[0, 1.92, -hd + 0.22]} castShadow>
                <cylinderGeometry args={[0.5, 0.5, 0.1, 16, 1, false, 0, Math.PI]} />
                <meshStandardMaterial color="#d4a840" roughness={0.4} />
            </mesh>
            {/* diya */}
            <mesh position={[0, 1.1, -hd + 0.44]} castShadow>
                <coneGeometry args={[0.05, 0.16, 8]} />
                <meshStandardMaterial color="#ff8c00" emissive="#ff4500" emissiveIntensity={2} />
            </mesh>
            <pointLight position={[0, 1.2, -hd + 0.5]} intensity={1.2} color="#ff6600" distance={3} />
            {/* flowers */}
            {[-0.25, 0.25].map((px, i) => (
                <Cyl key={i} pos={[px, 1.05, -hd + 0.44]} r={0.06} h={0.1} color="#ff9900" roughness={0.9} />
            ))}
        </group>
    );
}

function StudyDesk({ x = 0, z = 0, ry = 0 }: { x?: number; z?: number; ry?: number }) {
    return (
        <group position={[x, 0, z]} rotation={[0, ry, 0]}>
            <Box pos={[0, 0.76, 0]} size={[1.5, 0.05, 0.68]} color="#8b7355" roughness={0.5} />
            {[[-0.68, -0.3], [0.68, -0.3], [-0.68, 0.3], [0.68, 0.3]].map(([lx, lz], i) => (
                <Box key={i} pos={[lx, 0.38, lz]} size={[0.05, 0.76, 0.05]} color="#6b5a3e" roughness={0.6} />
            ))}
            {/* monitor */}
            <Box pos={[0, 1.2, -0.24]} size={[0.75, 0.46, 0.05]} color="#1a1a2e" roughness={0.2} metalness={0.6} />
            <Box pos={[0, 0.82, -0.24]} size={[0.07, 0.18, 0.07]} color="#2a2a3e" roughness={0.4} />
            {/* keyboard */}
            <Box pos={[0, 0.79, 0.1]} size={[0.55, 0.02, 0.18]} color="#333" roughness={0.3} metalness={0.4} />
            {/* chair */}
            <group position={[0, 0, 0.7]}>
                <Cyl pos={[0, 0.46, 0]} r={0.24} h={0.06} color="#2a2a2a" roughness={0.4} />
                <Cyl pos={[0, 0.24, 0]} r={0.04} h={0.48} color="#555" roughness={0.3} metalness={0.5} />
                <Box pos={[0, 0.78, -0.02]} size={[0.44, 0.7, 0.06]} color="#1a1a2a" roughness={0.4} />
            </group>
        </group>
    );
}

function Plant({ x = 0, z = 0 }: { x?: number; z?: number }) {
    return (
        <group position={[x, 0, z]}>
            <Cyl pos={[0, 0.2, 0]} r={0.14} h={0.4} color="#c1440e" roughness={0.8} />
            <Cyl pos={[0, 0.28, 0]} r={0.12} h={0.06} color="#8b3a0e" roughness={0.7} />
            <mesh position={[0, 0.56, 0]} castShadow>
                <sphereGeometry args={[0.3, 12, 12]} />
                <meshStandardMaterial color="#2d7a2d" roughness={0.9} />
            </mesh>
            <mesh position={[0.14, 0.62, 0.1]} castShadow>
                <sphereGeometry args={[0.18, 10, 10]} />
                <meshStandardMaterial color="#3a9a3a" roughness={0.9} />
            </mesh>
        </group>
    );
}

function TVUnit({ x = 0, z = 0, ry = 0 }: { x?: number; z?: number; ry?: number }) {
    return (
        <group position={[x, 0, z]} rotation={[0, ry, 0]}>
            <Box pos={[0, 0.3, 0]} size={[1.8, 0.6, 0.42]} color="#2a2a2a" roughness={0.4} metalness={0.3} />
            <Box pos={[0, 1.06, 0.04]} size={[1.55, 0.9, 0.07]} color="#111" roughness={0.2} metalness={0.6} />
            <Box pos={[0, 1.06, 0.09]} size={[1.42, 0.8, 0.02]} color="#1a3a5c" emissive="#1a3a5c" emissiveIntensity={0.6} roughness={0.1} />
        </group>
    );
}

// ── Floor material per room ───────────────────────────────────────────────────
function FloorMesh({ w, d, roomName }: { w: number; d: number; roomName: string }) {
    const n = roomName.toLowerCase();
    let mat = woodMat;
    if (n.includes("bath") || n.includes("toilet") || n.includes("wash")) mat = tileMat;
    else if (n.includes("kitchen")) mat = tileMat;
    else if (n.includes("pooja") || n.includes("puja")) {
        mat = new THREE.MeshStandardMaterial({ color: "#f5e6c0", roughness: 0.5 });
    }
    return (
        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.01, 0]} receiveShadow>
            <planeGeometry args={[w, d]} />
            <primitive object={mat} />
        </mesh>
    );
}

// ── Window panel ──────────────────────────────────────────────────────────────
function Window({ x, z, ry }: { x: number; z: number; ry: number }) {
    const ww = 1.0, wh = 0.9, sill = 0.9;
    return (
        <group position={[x, 0, z]} rotation={[0, ry, 0]}>
            {/* glass */}
            <mesh position={[0, sill + wh / 2, 0]}>
                <boxGeometry args={[ww, wh, 0.04]} />
                <primitive object={glassMat} />
            </mesh>
            {/* frame */}
            <Box pos={[0, sill + wh / 2, 0]} size={[ww + 0.06, wh + 0.06, 0.06]} color="#ffffff" roughness={0.4} />
            <Box pos={[0, sill + wh / 2, 0.02]} size={[ww, 0.04, 0.05]} color="#ffffff" roughness={0.4} />
            <Box pos={[0, sill + wh / 2, 0.02]} size={[0.04, wh, 0.05]} color="#ffffff" roughness={0.4} />
        </group>
    );
}

// ── Room furniture selector ───────────────────────────────────────────────────
function RoomFurniture({ name, w, d }: { name: string; w: number; d: number }) {
    const n = name.toLowerCase();
    const hw = w / 2, hd = d / 2;

    if (n.includes("living") || n.includes("hall") || n.includes("drawing") || n.includes("lounge")) return (
        <>
            <Sofa x={0} z={hd - 1.1} ry={Math.PI} />
            <CoffeeTable x={0} z={hd - 2.4} />
            <TVUnit x={0} z={-hd + 0.35} ry={0} />
            <Plant x={hw - 0.5} z={hd - 0.55} />
            <Plant x={-hw + 0.5} z={hd - 0.55} />
        </>
    );
    if (n.includes("master") || n.includes("bedroom") || n.includes("bed")) return (
        <>
            <Bed x={0} z={-hd + 1.4} ry={0} />
            <Plant x={-hw + 0.5} z={hd - 0.5} />
        </>
    );
    if (n.includes("kitchen")) return <KitchenL w={w} d={d} />;
    if (n.includes("dining")) return <DiningSet x={0} z={0} />;
    if (n.includes("bath") || n.includes("toilet") || n.includes("wc") || n.includes("wash")) return <BathroomSet w={w} d={d} />;
    if (n.includes("pooja") || n.includes("puja") || n.includes("prayer") || n.includes("temple")) return <PoojaRoom w={w} d={d} />;
    if (n.includes("study") || n.includes("office") || n.includes("work")) return (
        <>
            <StudyDesk x={0} z={-hd + 0.8} ry={0} />
            <Plant x={hw - 0.5} z={-hd + 0.5} />
        </>
    );
    if (n.includes("stair")) return (
        <>
            {[0, 1, 2, 3, 4, 5].map(i => (
                <Box key={i} pos={[-hw * 0.4 + i * 0.36, i * 0.24 + 0.12, 0]} size={[0.38, 0.24, d * 0.55]} color="#c8b89a" roughness={0.7} />
            ))}
        </>
    );
    return <Plant x={hw - 0.5} z={-hd + 0.5} />;
}

// ── Single room ───────────────────────────────────────────────────────────────
function Room({ cell, hovered, onHover }: {
    cell: RoomCell; hovered: boolean; onHover: (n: string | null) => void;
}) {
    const { cx, cz, w, d, room, score, direction } = cell;
    const sc = scoreToColor(score);
    const over = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(room); };
    const out = (e: ThreeEvent<PointerEvent>) => { e.stopPropagation(); onHover(null); };

    return (
        <group position={[cx, 0, cz]}>
            {/* Floor */}
            <group onPointerOver={over} onPointerOut={out}>
                <FloorMesh w={w} d={d} roomName={room} />
            </group>

            {/* Score tint overlay */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]}>
                <planeGeometry args={[w, d]} />
                <meshStandardMaterial color={sc} transparent opacity={hovered ? 0.18 : 0.08} />
            </mesh>

            {/* Interior walls — shared walls are thin dividers */}
            {/* North */}
            <mesh position={[0, WALL_H / 2, -d / 2]} castShadow receiveShadow>
                <boxGeometry args={[w, WALL_H, WALL_T]} />
                <primitive object={hovered ? whiteMat : wallMat} />
            </mesh>
            {/* South */}
            <mesh position={[0, WALL_H / 2, d / 2]} castShadow receiveShadow>
                <boxGeometry args={[w, WALL_H, WALL_T]} />
                <primitive object={hovered ? whiteMat : wallMat} />
            </mesh>
            {/* West */}
            <mesh position={[-w / 2, WALL_H / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[WALL_T, WALL_H, d]} />
                <primitive object={hovered ? whiteMat : wallMat} />
            </mesh>
            {/* East */}
            <mesh position={[w / 2, WALL_H / 2, 0]} castShadow receiveShadow>
                <boxGeometry args={[WALL_T, WALL_H, d]} />
                <primitive object={hovered ? whiteMat : wallMat} />
            </mesh>

            {/* Windows on north wall */}
            <Window x={0} z={-d / 2} ry={0} />

            {/* Door gap on south wall — open passage */}
            <Box pos={[-(w / 2 - 0.55), WALL_H / 2, d / 2]} size={[w - 1.1, WALL_H, WALL_T]} color={INT_CLR} roughness={0.7} />
            <Box pos={[0, WALL_H - 0.3, d / 2]} size={[1.1, 0.6, WALL_T]} color={INT_CLR} roughness={0.7} />
            {/* door panel */}
            <Box pos={[0.3, WALL_H / 2 - 0.3, d / 2 + 0.04]} size={[0.88, WALL_H - 0.6, 0.04]} color="#7a5c2a" roughness={0.5} />
            <Cyl pos={[0.62, WALL_H / 2 - 0.3, d / 2 + 0.08]} r={0.035} h={0.035} color="#d4a800" roughness={0.1} metalness={0.9} />

            {/* Score bar on floor */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.03, d / 2 - 0.1]}>
                <planeGeometry args={[w * (score / 100), 0.14]} />
                <meshStandardMaterial color={sc} emissive={sc} emissiveIntensity={0.5} />
            </mesh>

            {/* Furniture */}
            <RoomFurniture name={room} w={w} d={d} />

            {/* Label */}
            <Text position={[0, WALL_H + 0.42, 0]} fontSize={0.3} color="#1e293b"
                anchorX="center" anchorY="middle" maxWidth={w - 0.5}
                outlineWidth={0.018} outlineColor="#ffffff">
                {room}
            </Text>
            <Text position={[0, WALL_H + 0.1, 0]} fontSize={0.2} color={sc}
                anchorX="center" anchorY="middle"
                outlineWidth={0.012} outlineColor="#ffffff">
                {score}/100 · {direction.toUpperCase()}
            </Text>
        </group>
    );
}

// ── Outer shell (dark exterior like the reference image) ──────────────────────
function OuterShell({ sx, sz }: { sx: number; sz: number }) {
    const bw = sx + WALL_T * 2, bd = sz + WALL_T * 2, h = WALL_H, t = WALL_T * 1.8;
    return (
        <group>
            <mesh position={[0, h / 2, -bd / 2]} castShadow><boxGeometry args={[bw + t, h, t]} /><primitive object={extMat} /></mesh>
            <mesh position={[0, h / 2, bd / 2]} castShadow><boxGeometry args={[bw + t, h, t]} /><primitive object={extMat} /></mesh>
            <mesh position={[-bw / 2, h / 2, 0]} castShadow><boxGeometry args={[t, h, bd]} /><primitive object={extMat} /></mesh>
            <mesh position={[bw / 2, h / 2, 0]} castShadow><boxGeometry args={[t, h, bd]} /><primitive object={extMat} /></mesh>
            {/* base slab */}
            <mesh position={[0, -0.06, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
                <planeGeometry args={[bw + t, bd + t]} />
                <meshStandardMaterial color="#1a1a1a" roughness={0.8} />
            </mesh>
        </group>
    );
}

// ── Compass ───────────────────────────────────────────────────────────────────
function Compass({ size }: { size: number }) {
    const r = size / 2 + 2.2;
    return (
        <>
            {([["N", 0, -r, "#dc2626"], ["S", 0, r, "#64748b"], ["E", r, 0, "#64748b"], ["W", -r, 0, "#64748b"]] as [string, number, number, string][])
                .map(([l, x, z, c]) => (
                    <Text key={l} position={[x, 0.05, z]} rotation={[-Math.PI / 2, 0, 0]}
                        fontSize={0.7} color={c} anchorX="center" anchorY="middle"
                        fontWeight={l === "N" ? "bold" : "normal"} outlineWidth={0.03} outlineColor="#ffffff">
                        {l}
                    </Text>
                ))}
        </>
    );
}

// ── Scene ─────────────────────────────────────────────────────────────────────
function Scene({ rooms }: { rooms: RoomScore[] }) {
    const [hovered, setHovered] = useState<string | null>(null);
    const cells = useMemo(() => buildLayout(rooms), [rooms]);
    const cols = cells.map(c => c.col), rows = cells.map(c => c.row);
    const sx = (Math.max(...cols) - Math.min(...cols) + 1) * CS;
    const sz = (Math.max(...rows) - Math.min(...rows) + 1) * CS;

    return (
        <>
            {/* Bright neutral daylight */}
            <ambientLight intensity={1.4} color="#fff8f2" />
            <directionalLight position={[14, 22, 14]} intensity={1.6} castShadow
                shadow-mapSize={[2048, 2048]} shadow-camera-far={80}
                shadow-camera-left={-30} shadow-camera-right={30}
                shadow-camera-top={30} shadow-camera-bottom={-30} />
            <directionalLight position={[-10, 14, -10]} intensity={0.5} color="#ddeeff" />
            <hemisphereLight args={["#ffffff", "#e8e0d0", 0.5]} />

            {/* Ground */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.08, 0]} receiveShadow>
                <planeGeometry args={[80, 80]} />
                <meshStandardMaterial color="#e8e4dc" roughness={0.9} />
            </mesh>

            <OuterShell sx={sx} sz={sz} />
            <Compass size={Math.max(sx, sz)} />

            {cells.map((cell, i) => (
                <Room key={i} cell={cell} hovered={hovered === cell.room} onHover={setHovered} />
            ))}

            <OrbitControls enablePan enableZoom enableRotate
                minDistance={6} maxDistance={50}
                maxPolarAngle={Math.PI / 2.05}
                target={[0, WALL_H / 2, 0]} />
        </>
    );
}

// ── Export ────────────────────────────────────────────────────────────────────
export default function FloorPlan3D({ rooms }: FloorPlan3DProps) {
    return (
        <div className="w-full rounded-xl overflow-hidden border border-gray-200"
            style={{ height: 560, background: "#f0ece4" }}>
            <Canvas camera={{ position: [12, 18, 20], fov: 42 }} shadows
                gl={{ antialias: true, toneMapping: THREE.ACESFilmicToneMapping }}
                onCreated={({ gl }) => { gl.toneMappingExposure = 1.15; }}>
                <Suspense fallback={null}>
                    <Scene rooms={rooms} />
                </Suspense>
            </Canvas>
            <div className="flex flex-wrap items-center justify-center gap-5 py-2.5 bg-white border-t border-gray-200">
                {[{ color: "#22c55e", label: "Good (75–100)" }, { color: "#f59e0b", label: "Average (50–74)" }, { color: "#ef4444", label: "Poor (0–49)" }]
                    .map(({ color, label }) => (
                        <div key={label} className="flex items-center gap-1.5">
                            <span className="h-3 w-3 rounded-sm inline-block" style={{ background: color }} />
                            <span className="text-xs text-gray-500">{label}</span>
                        </div>
                    ))}
                <span className="text-xs text-gray-400">Drag · Scroll · Hover room for details</span>
            </div>
        </div>
    );
}
