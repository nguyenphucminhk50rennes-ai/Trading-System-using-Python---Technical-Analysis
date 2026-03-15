import { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Users, CalendarDays, CalendarCheck, Search, AlertCircle, Loader2 } from "lucide-react";
import WaveDecoration from "./WaveDecoration";
import { StockPriceItem } from "@/models/trading.model";
import { useTradingFilter } from "@/context/TradingFilterContext";
import { Skeleton } from "@/components/ui/skeleton";

interface ExecutiveSummaryProps {
  stockDataItems: StockPriceItem[];
  isLoading: boolean;
}

const ExecutiveSummary = ({ stockDataItems , isLoading}: ExecutiveSummaryProps) => {
  const { ticker, startDate, endDate, updateFilters } = useTradingFilter();
  
  const [inputTicker, setInputTicker] = useState<string>(ticker);
  const [inputStartDate, setInputStartDate] = useState<string>(startDate);
  const [inputEndDate, setInputEndDate] = useState<string>(endDate);
  const [error, setError] = useState<string>("");
  // Format stock data for chart
  const chartData = stockDataItems.map((item) => ({
    date: item.date,
    price: item.close,
    high: item.high,
    low: item.low,
    open: item.open,
    volume: item.volume,
  }));

  // Get date range from context
  const displayStartDate = startDate;
  const displayEndDate = endDate;

  // Format date for display
  const formatDateDisplay = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  };

  // Handle search
  const handleSearch = () => {
    setError("");
    
    // Validate ticker
    if (!inputTicker.trim()) {
      setError("Ticker không được để trống");
      return;
    }
    
    // Validate dates
    if (!inputStartDate || !inputEndDate) {
      setError("Vui lòng chọn ngày bắt đầu và kết thúc");
      return;
    }
    
    // Validate endDate >= startDate
    if (new Date(inputEndDate) < new Date(inputStartDate)) {
      setError("Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu");
      return;
    }
    
    // Update context
    updateFilters(inputTicker.trim().toUpperCase(), inputStartDate, inputEndDate);
  };

  return (
    <section className="section-container">
      <WaveDecoration className="top-0 left-0 w-[500px] -rotate-6" />
      <WaveDecoration className="bottom-0 right-0 w-[400px] rotate-12" />

      <h2 className="text-5xl md:text-6xl font-bold font-display mb-12 z-10 text-foreground">
        Executive Summary
      </h2>

      <div className="flex flex-col lg:flex-row gap-8 z-10">
        {/* Left panel - inputs */}
        <div className="glass-card p-8 w-full lg:w-80 flex flex-col gap-8">
          {/* Error message */}
          {error && (
            <div className="flex items-start gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg">
              <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-red-400">{error}</span>
            </div>
          )}

          {/* Ticker Input */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <Users className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">Stock Ticker</span>
            </div>
            <input
              type="text"
              value={inputTicker}
              onChange={(e) => setInputTicker(e.target.value)}
              placeholder="e.g., TSLA, AAPL"
              className="w-full px-4 py-3 bg-secondary border border-secondary-foreground rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm uppercase"
            />
          </div>

          {/* Start Date Input */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarDays className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">Starting Date</span>
            </div>
            <input
              type="date"
              value={inputStartDate}
              onChange={(e) => setInputStartDate(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-secondary-foreground rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* End Date Input */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <CalendarCheck className="w-5 h-5 text-muted-foreground" />
              <span className="text-sm font-bold uppercase tracking-wider text-foreground">Ending Date</span>
            </div>
            <input
              type="date"
              value={inputEndDate}
              onChange={(e) => setInputEndDate(e.target.value)}
              className="w-full px-4 py-3 bg-secondary border border-secondary-foreground rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-accent text-sm"
            />
          </div>

          {/* Search Button */}
          <button
            onClick={handleSearch}
            className="w-full px-6 py-3 bg-gradient-to-r from-accent to-accent/80 hover:from-accent/90 hover:to-accent/70 text-foreground font-bold uppercase tracking-wider rounded-lg transition-all flex items-center justify-center gap-2"
          >
            <Search className="w-5 h-5" />
            Search
          </button>

          {/* Current Values Display */}
          <div className="border-t border-secondary-foreground pt-4">
            <div className="text-xs text-muted-foreground space-y-2">
              <p><span className="text-foreground font-semibold">Ticker:</span> {ticker}</p>
              <p><span className="text-foreground font-semibold">From:</span> {formatDateDisplay(displayStartDate)}</p>
              <p><span className="text-foreground font-semibold">To:</span> {formatDateDisplay(displayEndDate)}</p>
            </div>
          </div>
        </div>

        {/* Right panel - chart */}
        <div className="glass-card p-8 flex-1">
          <div className="flex items-center gap-3 mb-2">
            <Users className="w-8 h-8 text-muted-foreground" />
            <div>
              <h3 className="text-xl font-bold font-display text-foreground">Price of {ticker}</h3>
              <p className="text-muted-foreground text-sm">Over the period {formatDateDisplay(displayStartDate)} - {formatDateDisplay(displayEndDate)}</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              <div className="flex items-center justify-center gap-2 text-muted-foreground">
                <Loader2 className="w-5 h-5 animate-spin" />
                <span className="text-sm">Loading chart data...</span>
              </div>
              <Skeleton className="w-full h-[300px] rounded-lg" />
            </div>
          ) : chartData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 25% 22%)" />
                <XAxis 
                  dataKey="date" 
                  stroke="hsl(215 20% 55%)" 
                  tick={{ fontSize: 12 }}
                  angle={-45}
                  textAnchor="end"
                  height={60}
                />
                <YAxis stroke="hsl(215 20% 55%)" />
                <Tooltip
                  contentStyle={{
                    background: "hsl(228 35% 14%)",
                    border: "1px solid hsl(228 25% 22%)",
                    borderRadius: "8px",
                    color: "hsl(210 40% 96%)",
                  }}
                  formatter={(value: any) => `$${(value as number).toFixed(2)}`}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="hsl(265 80% 60%)"
                  strokeWidth={2}
                  dot={false}
                  isAnimationActive={true}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="h-[300px] flex items-center justify-center text-muted-foreground">
              Không có dữ liệu giá cổ phiếu
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default ExecutiveSummary;
