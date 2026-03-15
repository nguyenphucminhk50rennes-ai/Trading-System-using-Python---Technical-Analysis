import dashboardImg from "@/assets/dashboard-3d.png";
import { BarChart3 } from "lucide-react";
import WaveDecoration from "./WaveDecoration";

const HeroSection = () => {
  return (
    <section className="section-container">
      <WaveDecoration className="top-0 right-0 w-[500px] rotate-12" />
      <WaveDecoration className="bottom-0 left-0 w-[400px] -rotate-12" />

      <div className="flex items-center justify-between gap-8 flex-col lg:flex-row z-10">
        <div className="flex-1 max-w-2xl">
          <p className="text-sm font-bold tracking-[0.3em] uppercase text-foreground mb-8">
            Stock Selection
          </p>

          <span className="inline-block px-5 py-2 rounded-full text-sm font-medium bg-primary/20 text-primary border border-primary/30 mb-6 float-right lg:float-none lg:absolute lg:right-24 lg:top-16">
            Technical Analysis
          </span>

          <h1 className="text-5xl md:text-7xl font-bold font-display leading-tight mb-6 text-foreground">
            Trading Strategy
            <br />
            & System
            <span className="inline-block w-24 h-1 bg-foreground ml-4 align-middle" />
          </h1>

          <p className="text-muted-foreground text-lg leading-relaxed mb-10 border-l-2 border-primary pl-5">
            Dashboard presents trading strategy and create system for
            automatically calculate indicators, present result intermediately.
          </p>

          <div className="flex items-center gap-4">
            <button className="gradient-button flex items-center gap-2">
              Dashboard Stats
            </button>
            <div className="w-12 h-12 rounded-full border-2 border-primary flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-primary" />
            </div>
          </div>

          <p className="mt-10 text-muted-foreground font-medium">
            By Nguyen Phuc Minh
          </p>
        </div>

        <div className="flex-1 flex justify-center">
          <img
            src={dashboardImg}
            alt="Trading Dashboard 3D"
            className="w-full max-w-lg animate-float drop-shadow-2xl"
          />
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
