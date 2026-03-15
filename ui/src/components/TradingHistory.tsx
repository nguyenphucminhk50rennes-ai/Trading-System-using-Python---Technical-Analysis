import { GroupedTrade, groupTradesIntoPairs, Trade } from "@/models/trading.model";
import { tradingAPI } from "@/services/trading.api";
import { CalendarCheck, ChevronLeft, ChevronRight, DollarSign, Star, TrendingUp, Users } from "lucide-react";
import { useEffect, useState } from "react";
import WaveDecoration from "./WaveDecoration";

const columns = [
  { icon: Star, label: "Entry Date" },
  { icon: Users, label: "Entry Price" },
  { icon: CalendarCheck, label: "Exit Date" },
  { icon: Users, label: "Exit Price" },
  { icon: DollarSign, label: "Profit ($)" },
  { icon: TrendingUp, label: "Profit (%)" },
];

interface TradingHistoryProps {
  data: Trade[] | null;
  isLoading: boolean;
}
const TradingHistory = ({ data, isLoading }: TradingHistoryProps) => {
  const tradingData = data ? groupTradesIntoPairs(data) : [];
  const [currentPage, setCurrentPage] = useState(0);
  
  const itemsPerPage = 10;

  // Pagination logic
  const startIndex = currentPage * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = tradingData.slice(startIndex, endIndex);
  const totalPages = Math.ceil(tradingData.length / itemsPerPage);

  const handlePrevious = () => {
    setCurrentPage(prev => Math.max(prev - 1, 0));
  };

  const handleNext = () => {
    if (currentPage < totalPages - 1) {
      setCurrentPage(prev => prev + 1);
    }
  };

  // Get profit color - green for positive, red for negative
  const getProfitColor = (profit: number): string => {
    if (profit > 0) return "text-green-400";
    if (profit < 0) return "text-red-400";
    return "text-muted-foreground";
  };

  // Format number to 2 decimal places
  const formatNumber = (value: number): string => {
    return value.toFixed(2);
  };

  // Format date to DD/MM/YYYY
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  return (
    <section className="section-container">
      <WaveDecoration className="top-0 left-0 w-[600px] -rotate-3" />
      <WaveDecoration className="bottom-0 right-0 w-[500px] rotate-6" />

      <h2 className="text-5xl md:text-6xl font-bold font-display mb-10 z-10 text-foreground">
        Trading History
      </h2>

      <div className="z-10 flex flex-col items-center justify-center w-full">
        <div className="w-full max-w-6xl overflow-x-auto">
          {/* Header */}
          <div className="grid grid-cols-7 gap-3 mb-3">
            {columns.map((col) => (
              <div key={col.label} className="glass-card p-4 flex flex-col items-center gap-2">
                <col.icon className="w-5 h-5 text-muted-foreground" />
                <span className="text-sm font-bold text-foreground">{col.label}</span>
              </div>
            ))}
          </div>

          {/* Rows */}
          {isLoading ? (
            <div className="text-center py-8 text-muted-foreground">Đang tải dữ liệu...</div>
          ) : currentData.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">Không có dữ liệu giao dịch</div>
          ) : (
            currentData.map((row, i) => (
              <div key={i} className="grid grid-cols-7 gap-3 mb-2">
                <div className="glass-card p-3 text-center text-sm text-muted-foreground">
                  {formatDate(row.entryDate)}
                </div>
                <div className="glass-card p-3 text-center text-sm text-muted-foreground">
                  ${formatNumber(row.entryPrice)}
                </div>
                <div className="glass-card p-3 text-center text-sm text-muted-foreground">
                  {formatDate(row.exitDate)}
                </div>
                <div className="glass-card p-3 text-center text-sm text-muted-foreground">
                  ${formatNumber(row.exitPrice)}
                </div>
                <div className={`glass-card p-3 text-center text-sm font-medium ${getProfitColor(row.profitDollar)}`}>
                  {row.profitDollar > 0 ? '+' : ''}{formatNumber(row.profitDollar)}
                </div>
                <div className={`glass-card p-3 text-center text-sm font-medium ${getProfitColor(row.profitPercent)}`}>
                  {row.profitPercent > 0 ? '+' : ''}{formatNumber(row.profitPercent)}%
                </div>
              </div>
            ))
          )}

          {/* Pagination Controls */}
          {tradingData.length > 0 && (
            <div className="flex items-center justify-center gap-4 mt-8 z-10">
              <button
                onClick={handlePrevious}
                disabled={currentPage === 0}
                className="glass-card p-3 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Trang trước"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>

              <span className="text-sm font-medium text-foreground px-4">
                Page <span className="text-accent">{currentPage + 1}</span> / <span className="text-accent">{totalPages}</span>
              </span>

              <button
                onClick={handleNext}
                disabled={currentPage === totalPages - 1}
                className="glass-card p-3 hover:bg-accent/50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                title="Next Page"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default TradingHistory;
