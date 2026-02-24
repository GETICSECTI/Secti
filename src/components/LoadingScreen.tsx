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
        {/* Inline styles to define keyframes for a moving-blue effect */}
        <style>{`
          @keyframes blueMove {
            0% { background-color: #195CE3; transform: scale(1.15); }
            20% { background-color: #195CE3; transform: scale(1.15); }
            33% { background-color: #0C2856; transform: scale(1); }
            100% { background-color: #0C2856; transform: scale(1); }
          }
          .loading-dot { width: .5rem; height: .5rem; border-radius: 9999px; background-color: #0C2856; display: inline-block; }
          .loading-dot.dot-1 { animation: blueMove 1.2s infinite linear 0s; }
          .loading-dot.dot-2 { animation: blueMove 1.2s infinite linear 0.4s; }
          .loading-dot.dot-3 { animation: blueMove 1.2s infinite linear 0.8s; }
        `}</style>

        <div className="flex items-center justify-center space-x-2">
          <span className="loading-dot dot-1" />
          <span className="loading-dot dot-2" />
          <span className="loading-dot dot-3" />
        </div>
      </div>
    </div>
  );
};
