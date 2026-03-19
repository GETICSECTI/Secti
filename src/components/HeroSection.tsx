interface HeroSectionProps {
  title: string;
  subtitle: string;
  showDecorativePattern?: boolean;
}

export const HeroSection = ({ title, subtitle, showDecorativePattern = true }: HeroSectionProps) => {
  return (
    <div className="relative h-80 md:h-96 bg-linear-to-r from-[#0C2856] to-[#195CE3] overflow-hidden">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="text-center text-white px-4">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-4">{title}</h1>
          <p className="text-lg md:text-xl max-w-3xl mx-auto">
            {subtitle}
          </p>
        </div>
      </div>
      {/* Decorative pattern */}
      {showDecorativePattern && (
        <div className="hidden md:block md:absolute bottom-0 left-0 right-0 h-16 bg-white" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }}></div>
      )}
    </div>
  );
};
