import React, { createContext, useContext, useState, ReactNode } from 'react';

interface TradingFilterContextType {
  ticker: string;
  startDate: string;
  endDate: string;
  setTicker: (ticker: string) => void;
  setStartDate: (date: string) => void;
  setEndDate: (date: string) => void;
  updateFilters: (ticker: string, startDate: string, endDate: string) => void;
}

const TradingFilterContext = createContext<TradingFilterContextType | undefined>(
  undefined
);

export const TradingFilterProvider = ({ children }: { children: ReactNode }) => {
  const [ticker, setTicker] = useState<string>('TSLA');
  const [startDate, setStartDate] = useState<string>('2020-01-01');
  const [endDate, setEndDate] = useState<string>('2026-02-01');

  const updateFilters = (newTicker: string, newStartDate: string, newEndDate: string) => {
    setTicker(newTicker);
    setStartDate(newStartDate);
    setEndDate(newEndDate);
  };

  return (
    <TradingFilterContext.Provider
      value={{
        ticker,
        startDate,
        endDate,
        setTicker,
        setStartDate,
        setEndDate,
        updateFilters,
      }}
    >
      {children}
    </TradingFilterContext.Provider>
  );
};

export const useTradingFilter = () => {
  const context = useContext(TradingFilterContext);
  if (!context) {
    throw new Error(
      'useTradingFilter must be used within a TradingFilterProvider'
    );
  }
  return context;
};
