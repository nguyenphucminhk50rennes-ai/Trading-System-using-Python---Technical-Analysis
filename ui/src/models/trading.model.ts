export type TradeType = "Buy" | "Sell" | "Sell (SL)";

export interface OptimalParams {
  ema_short: number;
  ema_long: number;
  macd_signal_span: number;
}

/**
 * Grouped trade pair with entry and exit information
 */
export interface GroupedTrade {
  /** Entry date (YYYY-MM-DD) */
  entryDate: string;
  /** Entry price */
  entryPrice: number;
  /** Exit date (YYYY-MM-DD) */
  exitDate: string;
  /** Exit price */
  exitPrice: number;
  /** Profit in dollars (exitPrice - entryPrice) */
  profitDollar: number;
  /** Profit in percentage ((exitPrice - entryPrice) / entryPrice) */
  profitPercent: number;
}

export interface Trade {
  /** YYYY-MM-DD */
  date: string;
  type: TradeType;
  price: number;
  /** profit theo từng lệnh (vd: 0.5879 = +58.79%) */
  profit: number;
  /** vốn sau lệnh */
  capital: number;
}
export interface TradingRequest{
  ticker: string;
  /** YYYY-MM-DD */
  start_date: Date;
  /** YYYY-MM-DD */
  end_date: Date;
}
export interface BacktestResult {
  ticker: string;

  /** YYYY-MM-DD */
  start_date: string;
  /** YYYY-MM-DD */
  end_date: string;

  total_records: number;

  optimal_params: OptimalParams;

  final_capital: number;

  /**
   * Tổng lợi nhuận theo dạng tỉ lệ (vd: 22.4396 = +2243.96%)
   * (khớp với sample của bạn: 1000 -> 23439.66)
   */
  total_profit: number;

  /** tỉ lệ thắng (0..1) */
  win_rate: number;

  avg_profit_per_trade: number;

  profit_loss_ratio: number;

  /** lợi nhuận năm hóa (0..?) */
  annualized_return: number;

  total_trades: number;

  trades: Trade[];
}

/**
 * Group consecutive Buy and Sell trades into trade pairs
 * @param trades Array of individual trades
 * @returns Array of grouped trade pairs
 * 
 * Example:
 * Input: [Buy, Sell, Buy, Sell]
 * Output: [GroupedTrade{entry: Buy, exit: Sell}, GroupedTrade{entry: Buy, exit: Sell}]
 */
export function groupTradesIntoPairs(trades: Trade[]): GroupedTrade[] {
  const groupedTrades: GroupedTrade[] = [];
  let i = 0;

  while (i < trades.length) {
    const currentTrade = trades[i];

    // Look for a Buy trade
    if (currentTrade.type === "Buy") {
      const entryPrice = currentTrade.price;
      const entryDate = currentTrade.date;

      // Look for the next Sell or Sell (SL) trade
      let j = i + 1;
      let exitTrade: Trade | null = null;

      while (j < trades.length) {
        if (trades[j].type === "Sell" || trades[j].type === "Sell (SL)") {
          exitTrade = trades[j];
          break;
        }
        j++;
      }

      // If we found a matching sell, create a grouped trade
      if (exitTrade) {
        const exitPrice = exitTrade.price;
        const exitDate = exitTrade.date;
        const profitDollar = exitPrice - entryPrice;
        const profitPercent = (profitDollar / entryPrice) * 100;
        
        groupedTrades.push({
          entryDate,
          entryPrice,
          exitDate,
          exitPrice,
          profitDollar,
          profitPercent,
        });

        // Move index past both the buy and sell
        i = j + 1;
      } else {
        // No matching sell found, skip this buy
        i++;
      }
    } else {
      // Skip non-Buy trades
      i++;
    }
  }

  return groupedTrades;
}

export interface StockPriceItem {
  date: string;        // ISO date string (e.g., "2020-01-02")
  close: number;
  high: number;
  low: number;
  open: number;
  volume: number;
}

export interface StockPriceResponse {
  ticker: string;
  start_date: string;   // ISO date string
  end_date: string;     // ISO date string
  total_records: number;
  data: StockPriceItem[];
}

/**
 * EMA and MACD calculation data point
 */
export interface EMADataPoint {
  date: string;           // YYYY-MM-DD
  close: number;          // Close price
  ema_short: number;      // Short EMA
  ema_long: number;       // Long EMA
  macd: number;           // MACD line
  macd_signal: number;    // MACD signal line
  macd_histogram: number; // MACD histogram
}

/**
 * EMA calculation response from /api/ema-calculation
 */
export interface EMACalculationResponse {
  ticker: string;
  start_date: string;      // YYYY-MM-DD
  end_date: string;        // YYYY-MM-DD
  total_records: number;
  optimal_params: OptimalParams;
  data: EMADataPoint[];
}