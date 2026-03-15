import { useState, useCallback } from 'react';
import { BacktestResult, TradingRequest, StockPriceResponse } from '../models/trading.model';
import { tradingAPI } from '../services/trading.api';

interface UseBacktestState {
  data: BacktestResult | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch backtest results
 */
export const useBacktest = () => {
  const [state, setState] = useState<UseBacktestState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchBacktest = useCallback(async (request: TradingRequest) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await tradingAPI.getBacktestResults(request);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, []);

  return {
    ...state,
    fetchBacktest,
  };
};

interface UseMultipleBacktestState {
  data: BacktestResult[] | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch multiple backtest results
 */
export const useMultipleBacktest = () => {
  const [state, setState] = useState<UseMultipleBacktestState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchMultipleBacktest = useCallback(
    async (requests: TradingRequest[]) => {
      setState({ data: null, loading: true, error: null });
      try {
        const results = await tradingAPI.getMultipleBacktestResults(requests);
        setState({ data: results, loading: false, error: null });
        return results;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    []
  );

  return {
    ...state,
    fetchMultipleBacktest,
  };
};

interface UseTradingHistoryState {
  data: BacktestResult | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch trading history
 */
export const useTradingHistory = () => {
  const [state, setState] = useState<UseTradingHistoryState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchTradingHistory = useCallback(
    async (ticker: string, startDate: string, endDate: string) => {
      setState({ data: null, loading: true, error: null });
      try {
        const result = await tradingAPI.getTradingHistory(
          ticker,
          startDate,
          endDate
        );
        setState({ data: result, loading: false, error: null });
        return result;
      } catch (error) {
        const err = error instanceof Error ? error : new Error('Unknown error');
        setState({ data: null, loading: false, error: err });
        throw err;
      }
    },
    []
  );

  return {
    ...state,
    fetchTradingHistory,
  };
};

interface UseAvailableTickersState {
  data: string[] | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch available tickers
 */
export const useAvailableTickers = () => {
  const [state, setState] = useState<UseAvailableTickersState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchTickers = useCallback(async () => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await tradingAPI.getAvailableTickers();
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, []);

  return {
    ...state,
    fetchTickers,
  };
};

interface UseStockPriceDataState {
  data: StockPriceResponse | null;
  loading: boolean;
  error: Error | null;
}

/**
 * Hook to fetch stock price data
 */
export const useStockPriceData = () => {
  const [state, setState] = useState<UseStockPriceDataState>({
    data: null,
    loading: false,
    error: null,
  });

  const fetchStockPriceData = useCallback(async (request: TradingRequest) => {
    setState({ data: null, loading: true, error: null });
    try {
      const result = await tradingAPI.getStockPriceData(request);
      setState({ data: result, loading: false, error: null });
      return result;
    } catch (error) {
      const err = error instanceof Error ? error : new Error('Unknown error');
      setState({ data: null, loading: false, error: err });
      throw err;
    }
  }, []);

  return {
    ...state,
    fetchStockPriceData,
  };
};
