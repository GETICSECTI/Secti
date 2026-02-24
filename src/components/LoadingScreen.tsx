import MarcaCTI from '../assets/MarcaCTI.png';

export const LoadingScreen = () => {
  return (
    <div className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center">
      {/* Background gradient subtle */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0C2856]/5 to-[#195CE3]/5 pointer-events-none" />

      {/* Content */}
      <div className="relative z-10 flex flex-col items-center justify-center space-y-8">
        {/* Logo */}
        <div className="animate-pulse">
          <img src={MarcaCTI} alt="SECTI" className="h-20 w-auto" />
        </div>

        {/* Progress dots */}
        <div className="flex items-center justify-center space-x-2">
          <div className="w-2 h-2 rounded-full bg-[#0C2856] animate-bounce" style={{ animationDelay: '0s' }} />
          <div className="w-2 h-2 rounded-full bg-[#195CE3] animate-bounce" style={{ animationDelay: '0.1s' }} />
          <div className="w-2 h-2 rounded-full bg-[#0C2856] animate-bounce" style={{ animationDelay: '0.2s' }} />
        </div>
      </div>
    </div>
  );
};

