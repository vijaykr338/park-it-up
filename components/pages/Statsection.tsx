import React from "react";
import CountUp from "@/components/ui/count-up";

const Statsection = () => {
  return (
    //   <section ref={statsRef} className="stats-section py-16">
    <section className="stats-section p-8 sm:p-12 w-full bg-[#141a24]">
      <div className="container mx-auto px-4 max-w-7xl bg-[#232834] rounded-xl p-6 sm:p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          <div className="text-gray-100">
            <h2 className="text-3xl sm:text-4xl font-bold text-gradient mb-4 md:text-left text-center">
              There are systems that offer nearby listings and competitive
              prices
            </h2>
          </div>
          <div className="stat-item text-center">
            <div className="text-5xl sm:text-6xl font-bold text-blue-200 mb-2">
              <CountUp from={0} to={99} direction="up" duration={1} className="text-white" />
              <span className="text-[#4d84a4] text-5xl">%</span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">
              Accurate data based on our system
            </p>
          </div>
          <div className="stat-item text-center">
            <div className="text-5xl sm:text-6xl font-bold text-blue-200 mb-2">
              <CountUp from={0} to={570} direction="up" duration={1} className="text-white"/>
              <span className="text-[#4d84a4] text-5xl">k+</span>
            </div>
            <p className="text-gray-300 text-base sm:text-lg">
              Users who are actively using the application
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Statsection;
