import yfinance as yf
import pandas as pd
from typing import Optional

from app.models.stock_model import StockData


def download_stock_data(
    ticker: str = "TSLA",
    start_date: str = "2020-01-01",
    end_date: str = "2026-02-01",
    save_to_csv: bool = False
) -> pd.DataFrame:
    """
    Download stock data from Yahoo Finance and return as list of StockData models.
    
    Args:
        ticker (str): Stock ticker symbol (default: "TSLA")
        start_date (str): Start date in format YYYY-MM-DD (default: "2020-01-01")
        end_date (str): End date in format YYYY-MM-DD (default: "2026-02-01")
        save_to_csv (bool): If True, save data to CSV file (default: False)
    
    Returns:
        list[StockData]: List of StockData models containing stock data with columns:
                     Date, Close, High, Low, Open, Volume
    
    Example:
        >>> df = download_stock_data("AAPL", "2023-01-01", "2024-01-01")
        >>> print(df.head())
    """
    try:
        # Download data from Yahoo Finance
        data = yf.download(ticker, start=start_date, end=end_date, progress=False)
        
        # Reset index to convert Date from index to column
        data = data.reset_index()
        
        # Flatten column names in case of MultiIndex
        data.columns = [col[0] if isinstance(col, tuple) else col for col in data.columns]
        
        # Select and reorder columns
        data = data[['Date', 'Close', 'High', 'Low', 'Open', 'Volume']]
        
        # Format Date column as string
        data['Date'] = data['Date'].dt.strftime('%Y-%m-%d')
        
        # Convert DataFrame to list of StockData models

        
        # Optionally save to CSV
        if save_to_csv:
            csv_filename = f"{ticker}_data.csv"
            data.to_csv(csv_filename, index=False)
            print(f"\n✓ Dữ liệu {ticker} từ {start_date} đến {end_date} đã được lưu vào {csv_filename}")
        
        return data
    
    except Exception as e:
        print(f"✗ Lỗi khi tải dữ liệu: {str(e)}")
        return pd.DataFrame()


