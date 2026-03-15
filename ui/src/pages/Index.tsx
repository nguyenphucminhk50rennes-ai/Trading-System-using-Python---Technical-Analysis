import HeroSection from "@/components/HeroSection";
import ExecutiveSummary from "@/components/ExecutiveSummary";
import BestStrategy from "@/components/BestStrategy";
import TradingResults from "@/components/TradingResults";
import TradingHistory from "@/components/TradingHistory";
import { BacktestResult, StockPriceItem } from "@/models/trading.model";
import { useEffect, useState } from "react";
import { tradingAPI } from "@/services/trading.api";
import { useTradingFilter } from "@/context/TradingFilterContext";

const Index = () => {
  const { ticker, startDate, endDate } = useTradingFilter();
  const [data, setData] = useState<BacktestResult | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [stockData, setStockData] = useState<StockPriceItem[]>([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await tradingAPI.getBacktestResults({
          ticker,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
        });

        setData(response);

        const stockPriceData = await tradingAPI.getStockPriceData({
          ticker,
          start_date: new Date(startDate),
          end_date: new Date(endDate),
        });
        setStockData(stockPriceData.data);
      } catch (error) {
        console.error('Failed to fetch trading data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchData();
  }, [ticker, startDate, endDate]);

  return (
    <div className="bg-background min-h-screen">
      <HeroSection />
      <ExecutiveSummary stockDataItems={stockData} isLoading={isLoading} />
      <BestStrategy />
      <TradingResults data={data} stockData={stockData} />
      <TradingHistory data={data?.trades || []} isLoading={isLoading} />
    </div>
  );
};

export default Index;
