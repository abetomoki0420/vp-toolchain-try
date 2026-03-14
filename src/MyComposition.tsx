import { AbsoluteFill, interpolate, useCurrentFrame } from "remotion";

// シード付き疑似乱数（フレームをまたいで一貫した値を生成）
const seededRandom = (seed: number) => {
  const x = Math.sin(seed + 1) * 10000;
  return x - Math.floor(x);
};

type Particle = {
  id: number;
  x: number;       // 0-100 (%)
  y: number;       // 0-100 (%)
  size: number;
  speed: number;
  hue: number;
  phase: number;   // 点滅の位相オフセット
  delay: number;   // 出現フレームの遅延
};

const PARTICLE_COUNT = 80;

const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
  id: i,
  x: seededRandom(i * 7) * 100,
  y: seededRandom(i * 13) * 100,
  size: seededRandom(i * 3) * 5 + 2,
  speed: seededRandom(i * 17) * 0.8 + 0.3,
  hue: seededRandom(i * 11) * 360,
  phase: seededRandom(i * 5) * Math.PI * 2,
  delay: seededRandom(i * 19) * 30,
}));

const SPARKLE_COUNT = 30;

type Sparkle = {
  id: number;
  x: number;
  y: number;
  size: number;
  hue: number;
  rotationSpeed: number;
  delay: number;
};

const sparkles: Sparkle[] = Array.from({ length: SPARKLE_COUNT }, (_, i) => ({
  id: i,
  x: seededRandom(i * 23 + 100) * 100,
  y: seededRandom(i * 29 + 100) * 100,
  size: seededRandom(i * 31) * 16 + 8,
  hue: seededRandom(i * 37) * 60 + 40, // 黄色〜オレンジ系
  rotationSpeed: (seededRandom(i * 41) - 0.5) * 4,
  delay: seededRandom(i * 43) * 60,
}));

const SparkleShape = ({ size, color, rotation }: { size: number; color: string; rotation: number }) => (
  <svg
    width={size}
    height={size}
    viewBox="-1 -1 2 2"
    style={{ transform: `rotate(${rotation}deg)`, overflow: "visible" }}
  >
    {[0, 45, 90, 135].map((angle) => (
      <line
        key={angle}
        x1="0" y1="0"
        x2={Math.cos((angle * Math.PI) / 180) * 0.9}
        y2={Math.sin((angle * Math.PI) / 180) * 0.9}
        stroke={color}
        strokeWidth="0.12"
        strokeLinecap="round"
      />
    ))}
    <circle cx="0" cy="0" r="0.15" fill={color} />
  </svg>
);

export const MyComposition = () => {
  const frame = useCurrentFrame();

  const opacity = interpolate(frame, [0, 30], [0, 1], { extrapolateRight: "clamp" });
  const scale = interpolate(frame, [0, 30], [0.5, 1], { extrapolateRight: "clamp" });
  const hue = interpolate(frame, [0, 90], [270, 360]);

  // テキストの輝きパルス
  const glowIntensity = interpolate(
    Math.sin((frame / 20) * Math.PI * 2),
    [-1, 1],
    [10, 30],
  );

  return (
    <AbsoluteFill
      style={{
        background: "linear-gradient(135deg, #0d0d1a 0%, #1a1a2e 50%, #16213e 100%)",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: 24,
        overflow: "hidden",
      }}
    >
      {/* パーティクル */}
      {particles.map((p) => {
        const appeared = frame >= p.delay;
        if (!appeared) return null;
        const localFrame = frame - p.delay;
        const twinkle = (Math.sin(localFrame * p.speed + p.phase) + 1) / 2;
        const particleOpacity = interpolate(localFrame, [0, 10], [0, 1], { extrapolateRight: "clamp" }) * (0.3 + twinkle * 0.7);
        const floatY = Math.sin(localFrame * p.speed * 0.5 + p.phase) * 4;

        return (
          <div
            key={p.id}
            style={{
              position: "absolute",
              left: `${p.x}%`,
              top: `${p.y}%`,
              transform: `translate(-50%, calc(-50% + ${floatY}px))`,
              width: p.size,
              height: p.size,
              borderRadius: "50%",
              background: `hsl(${p.hue}, 90%, 75%)`,
              opacity: particleOpacity,
              boxShadow: `0 0 ${p.size * 2}px ${p.size}px hsl(${p.hue}, 90%, 70%)`,
            }}
          />
        );
      })}

      {/* キラキラ（スター形状） */}
      {sparkles.map((s) => {
        const appeared = frame >= s.delay;
        if (!appeared) return null;
        const localFrame = frame - s.delay;
        const twinkle = (Math.sin(localFrame * 0.15 + s.id) + 1) / 2;
        const sparkleOpacity = interpolate(localFrame, [0, 15], [0, 1], { extrapolateRight: "clamp" }) * (0.4 + twinkle * 0.6);
        const rotation = localFrame * s.rotationSpeed;

        return (
          <div
            key={s.id}
            style={{
              position: "absolute",
              left: `${s.x}%`,
              top: `${s.y}%`,
              transform: `translate(-50%, -50%)`,
              opacity: sparkleOpacity,
              filter: `drop-shadow(0 0 ${s.size * 0.4}px hsl(${s.hue}, 100%, 80%))`,
            }}
          >
            <SparkleShape
              size={s.size}
              color={`hsl(${s.hue}, 100%, 85%)`}
              rotation={rotation}
            />
          </div>
        );
      })}

      {/* メインテキスト */}
      <div
        style={{
          opacity,
          transform: `scale(${scale})`,
          fontSize: 72,
          fontWeight: "bold",
          color: `hsl(${hue}, 80%, 70%)`,
          fontFamily: "sans-serif",
          textAlign: "center",
          textShadow: `0 0 ${glowIntensity}px hsl(${hue}, 80%, 70%), 0 0 ${glowIntensity * 2}px hsl(${hue}, 80%, 50%)`,
          zIndex: 10,
        }}
      >
        Hello Remotion!
      </div>

      {/* サブテキスト */}
      <div
        style={{
          opacity: interpolate(frame, [20, 50], [0, 1], { extrapolateRight: "clamp" }),
          fontSize: 24,
          color: "rgba(255,255,255,0.8)",
          fontFamily: "sans-serif",
          textShadow: "0 0 12px rgba(255,255,255,0.5)",
          zIndex: 10,
        }}
      >
        ReactでアニメーションをつくるReact動画ツール
      </div>
    </AbsoluteFill>
  );
};
