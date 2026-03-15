from pydantic import BaseModel, Field
from typing import Optional, List
from datetime import date


class StockData(BaseModel):
    """ phan nay bo ha?????
    Model for individual stock data record.
    
    Attributes:
        date: Trading date in YYYY-MM-DD format
        close: Closing price
        high: Highest price of the day
        low: Lowest price of the day
        open: Opening price
        volume: Trading volume
    """
    date: str = Field(..., description="Trading date in YYYY-MM-DD format")
    close: float = Field(..., description="Closing price", gt=0)
    high: float = Field(..., description="Highest price of the day", gt=0)
    low: float = Field(..., description="Lowest price of the day", gt=0)
    open: float = Field(..., description="Opening price", gt=0)
    volume: int = Field(..., description="Trading volume", ge=0)

    class Config:
        json_schema_extra = {
            "example": {
                "date": "2020-01-09",
                "close": 32.089332580566406,
                "high": 33.253334045410156,
                "low": 31.524667739868164,
                "open": 33.13999938964844,
                "volume": 426606000
            }
        }


class StockDataResponse(BaseModel):
    """
    Response model for stock data query.
    
    Attributes:
        ticker: Stock ticker symbol
        start_date: Start date of the query
        end_date: End date of the query
        total_records: Total number of records returned
        data: List of stock data records
    """
    ticker: str = Field(..., description="Stock ticker symbol")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    total_records: int = Field(..., description="Total number of records", ge=0)
    data: List[StockData] = Field(..., description="List of stock data records")

    class Config:
        json_schema_extra = {
            "example": {
                "ticker": "TSLA",
                "start_date": "2020-01-01",
                "end_date": "2020-01-31",
                "total_records": 20,
                "data": [
                    {
                        "date": "2020-01-09",
                        "close": 32.089332580566406,
                        "high": 33.253334045410156,
                        "low": 31.524667739868164,
                        "open": 33.13999938964844,
                        "volume": 426606000
                    }
                ]
            }
        }


class OptimizationParams(BaseModel):
    """
    Optimal parameters found by optimization.
    
    Attributes:
        ema_short: Short-term EMA span
        ema_long: Long-term EMA span
        macd_signal_span: MACD signal line span
    """
    ema_short: int = Field(..., description="Short-term EMA span")
    ema_long: int = Field(..., description="Long-term EMA span")
    macd_signal_span: int = Field(..., description="MACD signal line span")


class TradeDetail(BaseModel):
    """
    Individual trade information.
    
    Attributes:
        date: Trade date
        type: Trade type (Buy/Sell/Sell (SL)/Sell (EOD))
        price: Trade price
        profit: Profit/Loss percentage
        capital: Capital after this trade
    """
    date: str = Field(..., description="Trade date")
    type: str = Field(..., description="Trade type (Buy/Sell/Sell (SL)/Sell (EOD))")
    price: float = Field(..., description="Trade price")
    profit: float = Field(..., description="Profit/Loss percentage")
    capital: float = Field(..., description="Capital after trade")


class OptimizationResult(BaseModel):
    """
    Complete optimization results.
    
    Attributes:
        ticker: Stock ticker symbol
        start_date: Start date
        end_date: End date
        total_records: Total number of records
        optimal_params: Optimal parameters found
        final_capital: Final capital after backtest
        total_profit: Total profit (%)
        win_rate: Percentage of winning trades
        avg_profit_per_trade: Average profit per trade (%)
        profit_loss_ratio: Ratio of average win to average loss
        annualized_return: Annualized return rate (%)
        total_trades: Total number of trades executed
    """
    ticker: str = Field(..., description="Stock ticker symbol")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    total_records: int = Field(..., description="Total number of records", ge=0)
    optimal_params: OptimizationParams = Field(..., description="Optimal parameters")
    final_capital: float = Field(..., description="Final capital after backtest")
    total_profit: float = Field(..., description="Total profit percentage")
    win_rate: float = Field(..., description="Win rate of trades")
    avg_profit_per_trade: float = Field(..., description="Average profit per trade")
    profit_loss_ratio: float = Field(..., description="Profit/Loss ratio")
    annualized_return: float = Field(..., description="Annualized return")
    total_trades: int = Field(..., description="Total number of trades", ge=0)


class OptimizationDetailResult(BaseModel):
    """
    Detailed optimization results including trade history.
    
    Attributes:
        ticker: Stock ticker symbol
        start_date: Start date
        end_date: End date
        total_records: Total number of records
        optimal_params: Optimal parameters found
        final_capital: Final capital after backtest
        total_profit: Total profit (%)
        win_rate: Percentage of winning trades
        avg_profit_per_trade: Average profit per trade (%)
        profit_loss_ratio: Ratio of average win to average loss
        annualized_return: Annualized return rate (%)
        total_trades: Total number of trades executed
        trades: List of detailed trade information
    """
    ticker: str = Field(..., description="Stock ticker symbol")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    total_records: int = Field(..., description="Total number of records", ge=0)
    optimal_params: OptimizationParams = Field(..., description="Optimal parameters")
    final_capital: float = Field(..., description="Final capital after backtest")
    total_profit: float = Field(..., description="Total profit percentage")
    win_rate: float = Field(..., description="Win rate of trades")
    avg_profit_per_trade: float = Field(..., description="Average profit per trade")
    profit_loss_ratio: float = Field(..., description="Profit/Loss ratio")
    annualized_return: float = Field(..., description="Annualized return")
    total_trades: int = Field(..., description="Total number of trades", ge=0)
    trades: List[TradeDetail] = Field(..., description="Detailed trade history")


class IndicatorData(BaseModel):
    """
    Stock data with calculated technical indicators.
    
    Attributes:
        date: Trading date in YYYY-MM-DD format
        close: Closing price
        ema_short: Short-term Exponential Moving Average
        ema_long: Long-term Exponential Moving Average
        macd: MACD line
        macd_signal: MACD signal line
        macd_histogram: MACD histogram
    """
    date: str = Field(..., description="Trading date in YYYY-MM-DD format")
    close: float = Field(..., description="Closing price")
    ema_short: Optional[float] = Field(None, description="Short-term EMA")
    ema_long: Optional[float] = Field(None, description="Long-term EMA")
    macd: Optional[float] = Field(None, description="MACD line")
    macd_signal: Optional[float] = Field(None, description="MACD signal line")
    macd_histogram: Optional[float] = Field(None, description="MACD histogram")

    class Config:
        json_schema_extra = {
            "example": {
                "date": "2020-01-09",
                "close": 32.089332580566406,
                "ema_short": 32.15,
                "ema_long": 32.08,
                "macd": 0.07,
                "macd_signal": 0.05,
                "macd_histogram": 0.02
            }
        }


class IndicatorResponse(BaseModel):
    """
    Response model for stock data with technical indicators.
    
    Attributes:
        ticker: Stock ticker symbol
        start_date: Start date of the query
        end_date: End date of the query
        total_records: Total number of records returned
        data: List of stock data with indicators
    """
    ticker: str = Field(..., description="Stock ticker symbol")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    total_records: int = Field(..., description="Total number of records", ge=0)
    data: List[IndicatorData] = Field(..., description="List of stock data with indicators")

    class Config:
        json_schema_extra = {
            "example": {
                "ticker": "TSLA",
                "start_date": "2020-01-01",
                "end_date": "2020-01-31",
                "total_records": 20,
                "data": [
                    {
                        "date": "2020-01-09",
                        "close": 32.089332580566406,
                        "ema_short": 32.15,
                        "ema_long": 32.08,
                        "macd": 0.07,
                        "macd_signal": 0.05,
                        "macd_histogram": 0.02
                    }
                ]
            }
        }


class IndicatorSummary(BaseModel):
    """
    Summary of the latest indicator values.
    
    Attributes:
        date: Latest trading date
        close: Latest closing price
        ema_short: Latest short-term EMA
        ema_long: Latest long-term EMA
        macd: Latest MACD value
        macd_signal: Latest MACD signal value
        macd_histogram: Latest MACD histogram value
    """
    date: str = Field(..., description="Latest trading date")
    close: float = Field(..., description="Latest closing price")
    ema_short: Optional[float] = Field(None, description="Latest short-term EMA")
    ema_long: Optional[float] = Field(None, description="Latest long-term EMA")
    macd: Optional[float] = Field(None, description="Latest MACD value")
    macd_signal: Optional[float] = Field(None, description="Latest MACD signal value")
    macd_histogram: Optional[float] = Field(None, description="Latest MACD histogram value")


class OptimizedIndicatorResponse(BaseModel):
    """
    Response for optimized indicators with the parameters used.
    
    Attributes:
        ticker: Stock ticker symbol
        start_date: Start date of the query
        end_date: End date of the query
        total_records: Total number of records returned
        optimal_params: The optimal parameters used for calculation
        data: List of stock data with indicators
    """
    ticker: str = Field(..., description="Stock ticker symbol")
    start_date: str = Field(..., description="Start date in YYYY-MM-DD format")
    end_date: str = Field(..., description="End date in YYYY-MM-DD format")
    total_records: int = Field(..., description="Total number of records", ge=0)
    optimal_params: OptimizationParams = Field(..., description="Optimal parameters used")
    data: List[IndicatorData] = Field(..., description="List of stock data with indicators")

    class Config:
        json_schema_extra = {
            "example": {
                "ticker": "TSLA",
                "start_date": "2020-01-01",
                "end_date": "2020-01-31",
                "total_records": 20,
                "optimal_params": {
                    "ema_short": 8,
                    "ema_long": 16,
                    "macd_signal_span": 5
                },
                "data": [
                    {
                        "date": "2020-01-02",
                        "close": 28.68,
                        "ema_short": 28.68,
                        "ema_long": 28.68,
                        "macd": 0.0,
                        "macd_signal": 0.0,
                        "macd_histogram": 0.0
                    }
                ]
            }
        }
