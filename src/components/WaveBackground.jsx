export default function WaveBackground() {
  return (
    <div className="relative  h-32">
      <div className="absolute overflow-hidden left-0 w-[200%] h-full animate-wave-move">
        <img
          src="/wave.svg"  // ton image SVG ou PNG
          alt="vague"
          className="w-full h-full object-cover"
        />
      </div>
    </div>
  );
}
