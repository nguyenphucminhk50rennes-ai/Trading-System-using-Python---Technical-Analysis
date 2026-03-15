/**
 * Trading API Integration Examples
 * 
 * This file contains example usage of the Trading API service and hooks
 */

import { TradingRequest, BacktestResult } from '../models/trading.model';
import { tradingAPI } from '../services/trading.api';
import {
  useBacktest,
  useMultipleBacktest,
  useTradingHistory,
  useAvailableTickers,
} from '../hooks/use-trading-api';

/**
 * Example 1: Direct API Usage
 * Using the tradingAPI instance directly for one-off requests
 */
export async function exampleDirectAPIUsage() {
  try {
    // Initialize API with custom base URL if needed
    tradingAPI.setBaseURL('http://your-api-server.com/api');

    // Check if API is available
    const isHealthy = await tradingAPI.healthCheck();
    console.log('API Health:', isHealthy);

    // Get available tickers
    const tickers = await tradingAPI.getAvailableTickers();
    console.log('Available Tickers:', tickers);

    // Get backtest results
    const backtestRequest: TradingRequest = {
      ticker: 'AAPL',
      start_date: new Date('2023-01-01'),
      end_date: new Date('2023-12-31'),
    };

    const backtestResult = await tradingAPI.getBacktestResults(backtestRequest);
    console.log('Backtest Result:', backtestResult);

    // Get trading history
    const tradingHistory = await tradingAPI.getTradingHistory(
      'AAPL',
      '2023-01-01',
      '2023-12-31'
    );
    console.log('Trading History:', tradingHistory);

    // // Get optimal parameters
    // const optimalParams = await tradingAPI.getOptimalParams('AAPL');
    // console.log('Optimal Parameters:', optimalParams);
  } catch (error) {
    console.error('API Error:', error);
  }
}

/**
 * Example 2: React Component with useBacktest Hook
 */
export function ExampleBacktestComponent() {
  const { data, loading, error, fetchBacktest } = useBacktest();

  const handleFetchBacktest = async () => {
    try {
      const request: TradingRequest = {
        ticker: 'GOOGL',
        start_date: new Date('2023-01-01'),
        end_date: new Date('2023-12-31'),
      };
      await fetchBacktest(request);
    } catch (err) {
      console.error('Failed to fetch backtest:', err);
    }
  };

  return (
    <div>
      <button onClick={handleFetchBacktest} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Backtest'}
      </button>

      {error && <div style={{ color: 'red' }}>{error.message}</div>}

      {data && (
        <div>
          <h2>{data.ticker}</h2>
          <p>Total Profit: {data.total_profit}%</p>
          <p>Win Rate: {(data.win_rate * 100).toFixed(2)}%</p>
          <p>Total Trades: {data.total_trades}</p>
          <p>Annualized Return: {data.annualized_return.toFixed(2)}%</p>
        </div>
      )}
    </div>
  );
}

/**
 * Example 3: React Component with useMultipleBacktest Hook
 */
export function ExampleMultipleBacktestComponent() {
  const { data, loading, error, fetchMultipleBacktest } = useMultipleBacktest();

  const handleFetchMultiple = async () => {
    try {
      const requests: TradingRequest[] = [
        {
          ticker: 'AAPL',
          start_date: new Date('2023-01-01'),
          end_date: new Date('2023-12-31'),
        },
        {
          ticker: 'GOOGL',
          start_date: new Date('2023-01-01'),
          end_date: new Date('2023-12-31'),
        },
        {
          ticker: 'MSFT',
          start_date: new Date('2023-01-01'),
          end_date: new Date('2023-12-31'),
        },
      ];
      await fetchMultipleBacktest(requests);
    } catch (err) {
      console.error('Failed to fetch multiple backtests:', err);
    }
  };

  return (
    <div>
      <button onClick={handleFetchMultiple} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Multiple Backtests'}
      </button>

      {error && <div style={{ color: 'red' }}>{error.message}</div>}

      {data && (
        <div>
          <h2>Backtest Results Summary</h2>
          <table>
            <thead>
              <tr>
                <th>Ticker</th>
                <th>Total Profit (%)</th>
                <th>Win Rate (%)</th>
                <th>Total Trades</th>
              </tr>
            </thead>
            <tbody>
              {data.map((result) => (
                <tr key={result.ticker}>
                  <td>{result.ticker}</td>
                  <td>{result.total_profit.toFixed(2)}</td>
                  <td>{(result.win_rate * 100).toFixed(2)}</td>
                  <td>{result.total_trades}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Example 4: React Component with useTradingHistory Hook
 */
export function ExampleTradingHistoryComponent() {
  const { data, loading, error, fetchTradingHistory } = useTradingHistory();

  const handleFetchHistory = async () => {
    try {
      await fetchTradingHistory('AAPL', '2023-01-01', '2023-12-31');
    } catch (err) {
      console.error('Failed to fetch trading history:', err);
    }
  };

  return (
    <div>
      <button onClick={handleFetchHistory} disabled={loading}>
        {loading ? 'Loading...' : 'Fetch Trading History'}
      </button>

      {error && <div style={{ color: 'red' }}>{error.message}</div>}

      {data && (
        <div>
          <h2>Trading History for {data.ticker}</h2>
          <p>Period: {data.start_date} to {data.end_date}</p>
          <p>Final Capital: ${data.final_capital.toFixed(2)}</p>

          <h3>Trades ({data.trades.length})</h3>
          <table>
            <thead>
              <tr>
                <th>Date</th>
                <th>Type</th>
                <th>Price</th>
                <th>Profit (%)</th>
                <th>Capital</th>
              </tr>
            </thead>
            <tbody>
              {data.trades.map((trade, idx) => (
                <tr key={idx}>
                  <td>{trade.date}</td>
                  <td>{trade.type}</td>
                  <td>${trade.price.toFixed(2)}</td>
                  <td>{(trade.profit * 100).toFixed(2)}</td>
                  <td>${trade.capital.toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

/**
 * Example 5: React Component with useAvailableTickers Hook
 */
export function ExampleAvailableTickersComponent() {
  const { data, loading, error, fetchTickers } = useAvailableTickers();

  React.useEffect(() => {
    fetchTickers();
  }, [fetchTickers]);

  return (
    <div>
      {loading && <p>Loading tickers...</p>}
      {error && <div style={{ color: 'red' }}>{error.message}</div>}
      {data && (
        <div>
          <h2>Available Tickers ({data.length})</h2>
          <ul>
            {data.map((ticker) => (
              <li key={ticker}>{ticker}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

/**
 * API Configuration Guide:
 *
 * 1. Set the correct API base URL:
 *    tradingAPI.setBaseURL('http://your-api-server.com/api');
 *
 * 2. Expected API Endpoints:
 *    - POST   /api/backtest              - Run backtest
 *    - GET    /api/trading-history/:ticker - Get trading history
 *    - GET    /api/optimal-params/:ticker  - Get optimal parameters
 *    - GET    /api/tickers                - Get available tickers
 *    - GET    /api/health                - Health check
 *
 * 3. Request/Response Format:
 *    - All requests use JSON format
 *    - Timeout is set to 30 seconds
 *    - Automatic error handling and logging
 *
 * 4. Error Handling:
 *    - API errors are caught and logged
 *    - State includes error object for component handling
 *    - All errors are re-thrown for custom handling
 */
