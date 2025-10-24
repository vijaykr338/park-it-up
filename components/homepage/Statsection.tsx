import React from "react";
import CountUp from "@/components/ui/count-up";

const Statsection = () => {
  return (
    //   <section ref={statsRef} className="stats-section py-16">
    <section className="stats-section p-8 sm:p-12 w-full bg-[#0a121a]">
      <div className="container mx-auto px-4 max-w-7xl bg-[#232834] rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div>
            <p className="text-lg font-bold text-gradient2 leading-tight">
              Urban drivers spend an average of 17 minutes looking for parking
              every day — leading to frustration, fuel loss, and congestion.
            </p>
          </div>
          <div className="stat-item text-center">
            <div className="text-5xl sm:text-6xl font-bold text-white mb-2">
              <CountUp
                from={0}
                to={30}
                direction="up"
                duration={1}
                className="text-white"
              />
              <span className="text-[#4d84a4] text-5xl">%</span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">
              of traffic in cities is caused by vehicles searching for parking.
            </p>
          </div>
          <div className="stat-item text-center">
            <div className="text-5xl sm:text-6xl font-bold text-white mb-2">
              <CountUp
                from={0}
                to={220}
                direction="up"
                duration={1}
                className="text-white"
              />
              <span className="text-[#4d84a4] text-5xl">M+</span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">
              registered vehicles in India by 2025 — and growing fast.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statsection;