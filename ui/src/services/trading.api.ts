import axios, { AxiosInstance } from 'axios';
import { BacktestResult, TradingRequest, StockPriceResponse, EMACalculationResponse } from '../models/trading.model';

class TradingAPI {
  private apiClient: AxiosInstance;
  private baseURL: string;

  constructor(baseURL: string = 'http://localhost:8000') {
    this.baseURL = baseURL;
    this.apiClient = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    // Add response interceptor for error handling
    this.apiClient.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Set the base URL for API requests
   */
  setBaseURL(baseURL: string): void {
    this.baseURL = baseURL;
    this.apiClient.defaults.baseURL = baseURL;
  }

  /**
   * Get backtest results for a specific ticker and date range
   */
  async getBacktestResults(request: TradingRequest): Promise<BacktestResult> {
    try {
      const response = await this.apiClient.get<BacktestResult>(
        '/stock/optimize',
        {
          params: {
            ticker: request.ticker,
            start_date: this.formatDate(request.start_date),
            end_date: this.formatDate(request.end_date),
          }
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch backtest results: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get multiple backtest results for different tickers
   */
  async getMultipleBacktestResults(
    requests: TradingRequest[]
  ): Promise<BacktestResult[]> {
    try {
      const promises = requests.map((req) => this.getBacktestResults(req));
      return await Promise.all(promises);
    } catch (error) {
      throw new Error(
        `Failed to fetch multiple backtest results: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get trading history for a specific ticker
   */
  async getTradingHistory(
    ticker: string,
    startDate: string,
    endDate: string
  ): Promise<BacktestResult> {
    try {
      const response = await this.apiClient.get<BacktestResult>(
        `/stock/optimize`,
        {
          params: {
            ticker: ticker,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch trading history: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get optimal parameters for a ticker
   */
  async getOptimalParams(ticker: string): Promise<any> {
    try {
      const response = await this.apiClient.get(`/optimal-params/${ticker}`);
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch optimal parameters: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get available tickers
   */
  async getAvailableTickers(): Promise<string[]> {
    try {
      const response = await this.apiClient.get<{ tickers: string[] }>(
        '/tickers'
      );
      return response.data.tickers;
    } catch (error) {
      throw new Error(
        `Failed to fetch available tickers: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get stock price data for a specific ticker and date range
   */
  async getStockPriceData(request: TradingRequest): Promise<StockPriceResponse> {
    try {
      const response = await this.apiClient.get<StockPriceResponse>(
        '/stock',
        {
          params: {
            ticker: request.ticker,
            start_date: this.formatDate(request.start_date),
            end_date: this.formatDate(request.end_date),
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch stock price data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Get EMA calculation data for charting (Price, EMA Short/Long, MACD)
   */
  async getEMACalculationData(
    ticker: string,
    startDate: string,
    endDate: string
  ): Promise<EMACalculationResponse> {
    try {
      const response = await this.apiClient.get<EMACalculationResponse>(
        `/stock/optimize-indicators/${ticker}`,
        {
          params: {
            ticker,
            start_date: startDate,
            end_date: endDate,
          },
        }
      );
      return response.data;
    } catch (error) {
      throw new Error(
        `Failed to fetch EMA calculation data: ${error instanceof Error ? error.message : 'Unknown error'}`
      );
    }
  }

  /**
   * Helper function to format Date to YYYY-MM-DD string
   */
  private formatDate(date: Date): string {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  /**
   * Health check for API
   */
  async healthCheck(): Promise<boolean> {
    try {
      await this.apiClient.get('/health');
      return true;
    } catch (error) {
      console.warn('API health check failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const tradingAPI = new TradingAPI();

// Export class for custom initialization if needed
export default TradingAPI;
