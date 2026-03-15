import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceDot } from "recharts";
import { Gauge, DollarSign, TrendingUp, Target, Percent, BarChart3 } from "lucide-react";
import WaveDecoration from "./WaveDecoration";
import { BacktestResult, groupTradesIntoPairs, StockPriceItem } from "@/models/trading.model";

// Format number with thousand separators
const formatNumberWithCommas = (num: number, decimals: number = 2): string => {
  return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};

// Convert trades to chart data with prices
const convertTradesToChartData = (trades: any[] = []) => {
  return trades.map((trade, idx) => ({
    idx,
    date: trade.date,
    price: trade.price,
    type: trade.type,
  }));
};

const convertStockItemToChartData = (trades: StockPriceItem[] = []) => {
  return trades.map((trade, idx) => ({
    idx,
    date: trade.date,
    price: trade.close,
    type: "Stock",
  }));
};
interface TradingResultsProps {
 data: BacktestResult | null;
 stockData: StockPriceItem[]; // Add stock price data for charting
}
const TradingResults = ({ data, stockData }: TradingResultsProps) => {
  const finalCapital = data ? `$${formatNumberWithCommas(data.final_capital)}` : "Loading...";
  const totalProfit = data ? `$${formatNumberWithCommas(data.final_capital - 1000)}` : "$0.00";
  const avgProfit = data ? `$${formatNumberWithCommas((data.final_capital - 1000) / Math.max(data.total_trades, 1))}` : "$0.00";

  // Prepare chart data from actual trades
  const sellBuyChartData = data ? convertTradesToChartData(data.trades) : [];
  const stockChartData = convertStockItemToChartData(stockData);

  const chartData = [...stockChartData, ...sellBuyChartData].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const stats = [
  { icon: DollarSign, label: "Initial Capital", value: "$1,000.00" },
  { icon: TrendingUp, label: "Total Profit", value: totalProfit },
  { icon: Target, label: "Win rate", value: `${data?.win_rate ? (data.win_rate * 100).toFixed(2) + '%' : '0%'}` },
  { icon: DollarSign, label: "Final Capital", value: `${finalCapital}` },
  { icon: Percent, label: "Annualized Return", value: `${data?.annualized_return ? (data.annualized_return * 100).toFixed(2) + '%' : '0%'}` },
  { icon: BarChart3, label: "Average profit", value: avgProfit },
];

  return (
    <section className="section-container">
      <WaveDecoration className="top-0 left-0 w-[500px]" />
      <WaveDecoration className="bottom-0 right-0 w-[400px] rotate-12" />

      <h2 className="text-5xl md:text-6xl font-bold font-display text-center mb-10 z-10 text-foreground">
        Trading Results
      </h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 mb-10 z-10">
        {stats.map((s) => (
          <div key={s.label} className="stat-card">
            <s.icon className="w-5 h-5 text-muted-foreground flex-shrink-0" />
            <div>
              <p className="text-sm text-muted-foreground">{s.label}:</p>
              <p className="text-lg font-bold text-foreground">{s.value}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="glass-card p-8 z-10">
        <div className="flex items-center gap-3 mb-4">
          <Gauge className="w-7 h-7 text-muted-foreground" />
          <h3 className="text-xl font-bold font-display uppercase text-foreground">Plot Signal</h3>
        </div>

        {chartData.length > 0 ? (
          <ResponsiveContainer width="100%" height={350}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(228 25% 22%)" />
              <XAxis 
                dataKey="date" 
                stroke="hsl(215 20% 55%)" 
                tick={{ fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis stroke="hsl(215 20% 55%)" />
              <Tooltip 
                contentStyle={{ 
                  background: "hsl(228 35% 14%)", 
                  border: "1px solid hsl(228 25% 22%)", 
                  borderRadius: "8px", 
                  color: "hsl(210 40% 96%)" 
                }}
                formatter={(value: any, name: any) => {
                  if (name === "price") {
                    return [`$${(value as number).toFixed(2)}`, "Price"];
                  }
                  return value;
                }}
              />
              <Line 
                type="monotone" 
                dataKey="price" 
                stroke="hsl(0 0% 85%)" 
                strokeWidth={1.5} 
                dot={false}
                isAnimationActive={true}
              />
              
              {/* Buy and Sell signals from actual trades */}
              {chartData.map((point, idx) => {
                // Only show dots for Buy (green) and Sell (red), skip Stock data
                if (point.type === "Stock") return null;
                
                const isGreen = point.type === "Buy";
                const color = isGreen ? "hsl(140 100% 40%)" : "hsl(0 100% 50%)";
                
                return (
                  <ReferenceDot
                    key={`${point.type}-${idx}`}
                    x={idx}
                    y={point.price}
                    r={5}
                    fill={color}
                    stroke="white"
                    strokeWidth={1}
                  />
                );
              })}
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <div className="h-[350px] flex items-center justify-center text-muted-foreground">
            Không có dữ liệu giao dịch để hiển thị
          </div>
        )}

        {/* Legend */}
        <div className="flex gap-8 mt-6 justify-center text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(140 70% 50%)" }}></div>
            <span className="text-muted-foreground">Buy Signal</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: "hsl(0 70% 55%)" }}></div>
            <span className="text-muted-foreground">Sell Signal</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TradingResults;
