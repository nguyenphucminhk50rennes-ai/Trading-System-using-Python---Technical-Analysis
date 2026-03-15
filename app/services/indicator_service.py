"""
Service for calculating technical indicators (EMA, MACD) on stock data.
"""
import pandas as pd
from typing import Dict, Tuple


def calculate_ema(data: pd.DataFrame, span: int, column: str = 'Close') -> pd.Series:
    """
    Calculate Exponential Moving Average (EMA).
    
    Args:
        data: DataFrame containing the price data
        span: Number of periods for the EMA calculation
        column: Column name to calculate EMA on (default: 'Close')
    
    Returns:
        Series containing EMA values
    """
    return data[column].ewm(span=span, adjust=False).mean()


def calculate_macd(data: pd.DataFrame, 
                   fast_span: int = 12, 
                   slow_span: int = 26, 
                   signal_span: int = 9,
                   column: str = 'Close') -> Tuple[pd.Series, pd.Series, pd.Series]:
    """
    Calculate MACD (Moving Average Convergence Divergence).
    
    Args:
        data: DataFrame containing the price data
        fast_span: Period for fast EMA (default: 12)
        slow_span: Period for slow EMA (default: 26)
        signal_span: Period for signal line EMA (default: 9)
        column: Column name to calculate MACD on (default: 'Close')
    
    Returns:
        Tuple of (MACD line, Signal line, Histogram)
    """
    ema_fast = data[column].ewm(span=fast_span, adjust=False).mean()
    ema_slow = data[column].ewm(span=slow_span, adjust=False).mean()
    
    macd_line = ema_fast - ema_slow
    signal_line = macd_line.ewm(span=signal_span, adjust=False).mean()
    macd_histogram = macd_line - signal_line
    
    return macd_line, signal_line, macd_histogram


def calculate_indicators(data: pd.DataFrame,
                        ema_short_span: int = 8,
                        ema_long_span: int = 16,
                        macd_fast: int = 12,
                        macd_slow: int = 26,
                        macd_signal: int = 9) -> pd.DataFrame:
    """
    Calculate all indicators (short EMA, long EMA, MACD, MACD Signal, MACD Histogram).
    
    Args:
        data: DataFrame containing stock data with 'Close' column
        ema_short_span: Period for short EMA (default: 8)
        ema_long_span: Period for long EMA (default: 16)
        macd_fast: Period for MACD fast EMA (default: 12)
        macd_slow: Period for MACD slow EMA (default: 26)
        macd_signal: Period for MACD signal line (default: 9)
    
    Returns:
        DataFrame with added indicator columns
    """
    df = data.copy()
    
    # Calculate EMAs
    df['EMA_short'] = calculate_ema(df, ema_short_span)
    df['EMA_long'] = calculate_ema(df, ema_long_span)
    
    # Calculate MACD components
    macd_line, signal_line, histogram = calculate_macd(
        df, 
        fast_span=macd_fast,
        slow_span=macd_slow,
        signal_span=macd_signal
    )
    
    df['MACD'] = macd_line
    df['MACD_Signal'] = signal_line
    df['MACD_Histogram'] = histogram
    
    return df


def get_indicators_summary(data: pd.DataFrame) -> Dict:
    """
    Get a summary of the latest indicator values.
    
    Args:
        data: DataFrame with indicator columns
    
    Returns:
        Dictionary with latest indicator values
    """
    if data.empty:
        return {}
    
    latest = data.iloc[-1]
    
    return {
        'date': str(latest.get('Date', latest.name)),
        'close': float(latest.get('Close', 0)),
        'ema_short': float(latest.get('EMA_short', float('nan'))),
        'ema_long': float(latest.get('EMA_long', float('nan'))),
        'macd': float(latest.get('MACD', float('nan'))),
        'macd_signal': float(latest.get('MACD_Signal', float('nan'))),
        'macd_histogram': float(latest.get('MACD_Histogram', float('nan')))
    }


def get_indicators_for_date_range(data: pd.DataFrame, 
                                  start_idx: int = None, 
                                  end_idx: int = None) -> pd.DataFrame:
    """
    Extract indicator values for a specific date range.
    
    Args:
        data: DataFrame with indicator columns
        start_idx: Start index (default: None, from beginning)
        end_idx: End index (default: None, to end)
    
    Returns:
        DataFrame with date and indicator columns
    """
    df = data.copy()
    
    # Select range
    if start_idx is not None or end_idx is not None:
        df = df.iloc[start_idx:end_idx]
    
    # Select relevant columns
    columns_to_keep = ['Date', 'Close', 'Open', 'High', 'Low', 'Volume',
                       'EMA_short', 'EMA_long', 'MACD', 'MACD_Signal', 'MACD_Histogram']
    
    available_columns = [col for col in columns_to_keep if col in df.columns]
    
    return df[available_columns].copy()
