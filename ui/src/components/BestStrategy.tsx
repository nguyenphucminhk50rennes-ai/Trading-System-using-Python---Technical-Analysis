import { useEffect, useState } from 'react';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, ComposedChart, Area
} from "recharts";
import { RefreshCw, Loader2, AlertCircle } from "lucide-react";
import WaveDecoration from "./WaveDecoration";
import { tradingAPI } from "../services/trading.api";
import { EMADataPoint, OptimalParams } from "../models/trading.model";
import { useTradingFilter } from "../context/TradingFilterContext";

interface ChartData extends EMADataPoint {
  idx: number; // For X-axis display
}

const BestStrategy = () => {
  const { ticker, startDate, endDate } = useTradingFilter();
  const [emaData, setEmaData] = useState<ChartData[]>([]);
  const [macdData, setMacdData] = useState<ChartData[]>([]);
  const [indicators, setIndicators] = useState<{ name: string; value: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch EMA calculation data from API
        const response = await tradingAPI.getEMACalculationData(
          ticker,
          startDate,
          endDate
        );

        // Transform data to include idx for charting
        const transformedData = response.data.map((item, index) => ({
          ...item,
          idx: index,
        }));

        setEmaData(transformedData);
        setMacdData(transformedData);

        // Calculate indicator percentages from optimal params
        const totalValue = 
          response.optimal_params.ema_short + 
          response.optimal_params.ema_long + 
          response.optimal_params.macd_signal_span;

        setIndicators([
          {
            name: "EMA Short",
            value: response.optimal_params.ema_short,
          },
          {
            name: "EMA Long",
            value: response.optimal_params.ema_long,
          },
          {
            name: "MACD Signal",
            value: response.optimal_params.macd_signal_span,
          },
        ]);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch data');
        console.error('Error fetching EMA data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [ticker, startDate, endDate]);

  if (error) {
    return (
      <section className="section-container">
        <WaveDecoration className="top-0 left-0 w-[600px] -rotate-3" />
        <h2 className="text-4xl md:text-6xl font-bold font-display text-center mb-12 uppercase tracking-wider z-10 text-foreground">
          Best Strategy Trading
        </h2>
        <div className="flex items-center justify-center gap-3 p-6 glass-card text-red-400 z-10">
          <AlertCircle className="w-6 h-6" />
          <span>{error}</span>
        </div>
      </section>
    );
  }

  if (loading) {
    return (
      <section className="section-container">
        <WaveDecoration className="top-0 left-0 w-[600px] -rotate-3" />
        <h2 className="text-4xl md:text-6xl font-bold font-display text-center mb-12 uppercase tracking-wider z-10 text-foreground">
          Best Strategy Trading
        </h2>
        <div className="flex items-center justify-center gap-3 p-6 glass-card z-10">
          <Loader2 className="w-6 h-6 animate-spin text-accent" />
          <span className="text-foreground">Loading data...</span>
        </div>
      </section>
    );
  }
  return (
    <section className="section-container">
      <WaveDecoration className="top-0 left-0 w-[600px] -rotate-3" />

      <h2 className="text-4xl md:text-6xl font-bold font-display text-center mb-12 uppercase tracking-wider z-10 text-foreground">
        Best Strategy Trading
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 z-10">
        {/* Indicators panel */}
        <div className="glass-card p-8 w-full lg:w-80">
          <div className="flex items-center gap-2 mb-8">
            <RefreshCw className="w-5 h-5 text-accent" />
            <h3 className="text-xl font-bold font-display text-foreground">Indicators composition</h3>
          </div>

          <div className="space-y-6">
            {indicators.map((ind) => (
              <div key={ind.name}>
                <div className="flex justify-between mb-2">
                  <span className="text-sm text-foreground">{ind.name}</span>
                  <span className="text-lg font-bold text-muted-foreground">{ind.value}</span>
                </div>
      
              </div>
            ))}
          </div>
        </div>

        {/* Charts */}
        <div className="flex-1 space-y-4">
          <div className="glass-card p-4">
            <p className="text-xs text-center text-muted-foreground mb-2">Technical Analysis - Price & EMA</p>
            <ResponsiveContainer width="100%" height={200}>
              <LineChart data={emaData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 25% 22%)" />
                <XAxis dataKey="idx" stroke="hsl(215 20% 55%)" tick={false} />
                <YAxis stroke="hsl(215 20% 55%)" />
                <Tooltip contentStyle={{ background: "hsl(228 35% 14%)", border: "1px solid hsl(228 25% 22%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
                <Line type="monotone" dataKey="close" stroke="hsl(0 0% 80%)" strokeWidth={1} dot={false} name="Price" />
                <Line type="monotone" dataKey="ema_short" stroke="hsl(230 80% 60%)" strokeWidth={1} dot={false} name="EMA Short" />
                <Line type="monotone" dataKey="ema_long" stroke="hsl(340 80% 55%)" strokeWidth={1} dot={false} name="EMA Long" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="glass-card p-4">
            <p className="text-xs text-center text-muted-foreground mb-2">MACD Index</p>
            <ResponsiveContainer width="100%" height={180}>
              <ComposedChart data={macdData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 25% 22%)" />
                <XAxis dataKey="idx" stroke="hsl(215 20% 55%)" tick={false} />
                <YAxis stroke="hsl(215 20% 55%)" />
                <Tooltip contentStyle={{ background: "hsl(228 35% 14%)", border: "1px solid hsl(228 25% 22%)", borderRadius: "8px", color: "hsl(210 40% 96%)" }} />
                <Bar dataKey="macd_histogram" fill="hsl(340 60% 50% / 0.5)" name="Histogram" />
                <Line type="monotone" dataKey="macd" stroke="hsl(230 80% 60%)" strokeWidth={1.5} dot={false} name="MACD" />
                <Line type="monotone" dataKey="macd_signal" stroke="hsl(340 80% 55%)" strokeWidth={1.5} dot={false} name="Signal" />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BestStrategy;
