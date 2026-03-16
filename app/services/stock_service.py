from app.utils.data_downloader import download_stock_data
import pandas as pd
import matplotlib.pyplot as plt


def fetch_stock_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch stock data for a given ticker and date range.
    
    :param ticker: Stock ticker symbol.
    :param start_date: Start date for fetching data (YYYY-MM-DD).
    :param end_date: End date for fetching data (YYYY-MM-DD).
    :return: DataFrame containing stock data.
    """
    return download_stock_data(ticker, start_date, end_date, save_to_csv=False)


def fetch_and_store_stock_data(ticker: str, start_date: str, end_date: str, storage_path: str) -> pd.DataFrame:
    """
    Fetch stock data for a given ticker and date range, then store it to the specified path.
    
    :param ticker: Stock ticker symbol.
    :param start_date: Start date for fetching data (YYYY-MM-DD).
    :param end_date: End date for fetching data (YYYY-MM-DD).
    :param storage_path: Path to store the downloaded stock data.
    :return: DataFrame containing stock data.
    """
    stock_data = download_stock_data(ticker, start_date, end_date, save_to_csv=True)
    return stock_data


def plot_stock_data(df: pd.DataFrame) -> None:
    """
    Plot stock price data.
    
    :param df: DataFrame containing stock data with 'Date' and 'Close' columns.
    """
    plt.figure(figsize=(12, 6))
    plt.plot(df['Date'], df['Close'], label='Close Price')
    plt.title('Stock Price Over The Period')
    plt.xlabel('Date')
    plt.ylabel('Close Price')
    plt.grid(True)
    plt.legend()
    plt.show()


def display_optimization_results(best_params, best_trades, best_total_profit, best_final_capital, 
                                 best_win_rate, best_avg_profit, best_annualized_return):
    """
    Display optimization results in a formatted output.
    
    :param best_params: Dictionary containing optimized parameters (EMA_short, EMA_long, MACD_Signal_span)
    :param best_trades: DataFrame containing best trades
    :param best_total_profit: Total profit percentage
    :param best_final_capital: Final capital after trading
    :param best_win_rate: Win rate percentage
    :param best_avg_profit: Average profit per trade
    :param best_annualized_return: Annualized return percentage
    """
    print("\n" + "="*80)
    print("OPTIMIZATION RESULTS")
    print("="*80)
    
    print("\nOptimized Parameters:")
    print(f"  EMA_short: {best_params.get('EMA_short', 'N/A')}")
    print(f"  EMA_long: {best_params.get('EMA_long', 'N/A')}")
    print(f"  MACD_Signal_span: {best_params.get('MACD_Signal_span', 'N/A')}")
    
    print("\nOptimized Backtest Results:")
    print(f"  Total Trades: {len(best_trades)}")
    print(f"  Total Return (%): {round(best_total_profit * 100, 2)}")
    print(f"  Annualized Return (%): {round(best_annualized_return * 100, 2)}")
    print(f"  Win Rate (%): {round(best_win_rate * 100, 2)}")
    print(f"  Average Profit per Trade (%): {round(best_avg_profit * 100, 2)}")
    print(f"  Final Capital: ${round(best_final_capital, 2)}")
    print("="*80 + "\n")


def generate_trading_history_summary(best_trades: pd.DataFrame) -> pd.DataFrame:
    """
    Generate a summary of trading history from trades DataFrame.
    
    :param best_trades: DataFrame containing all trades with columns: Type, Date, Price, Profit
    :return: DataFrame with trading history summary (Entry Date, Entry Price, Exit Date, Exit Price, Profit)
    """
    summary_data = []
    open_long_entry = None  # Stores {'date': date, 'price': price} for an open long position
    
    for index, row in best_trades.iterrows():
        trade_type = row['Type']
        trade_date = row['Date']
        trade_price = row['Price']
        trade_profit_pct_decimal = row['Profit']
        
        if trade_type == 'Buy':
            # Open a new long position
            open_long_entry = {'date': trade_date, 'price': trade_price}
        elif trade_type.startswith('Sell') and open_long_entry is not None:
            # Close a long position ('Sell', 'Sell (SL)', or 'Sell (EOD)')
            entry_date = open_long_entry['date']
            entry_price = open_long_entry['price']
            exit_date = trade_date
            exit_price = trade_price
            
            profit_dollar = (exit_price - entry_price)
            
            summary_data.append({
                'Type': 'Long',
                'Entry Date': entry_date.strftime('%Y-%m-%d') if hasattr(entry_date, 'strftime') else str(entry_date),
                'Entry Price': f'{entry_price:.2f}',
                'Exit Date': exit_date.strftime('%Y-%m-%d') if hasattr(exit_date, 'strftime') else str(exit_date),
                'Exit Price': f'{exit_price:.2f}',
                'Profit ($)': f'{profit_dollar:.2f}',
                'Profit (%)': f'{trade_profit_pct_decimal * 100:.2f}%'
            })
            open_long_entry = None  # Close the long position
    
    # Convert to DataFrame
    summary_df = pd.DataFrame(summary_data)
    
    print("\n" + "="*80)
    print("OPTIMIZED TRADING HISTORY SUMMARY")
    print("="*80)
    print(summary_df.to_string(index=False))
    print("="*80 + "\n")
    
    return summary_df


def plot_optimized_trading_history(df: pd.DataFrame, summary_df: pd.DataFrame) -> None:
    """
    Plot optimized trading history showing entry and exit points.
    
    :param df: Original DataFrame with Date and Close price
    :param summary_df: Summary DataFrame with Entry Date, Entry Price, Exit Date, Exit Price
    """
    # Ensure dates are datetime
    df_copy = df.copy()
    df_copy['Date'] = pd.to_datetime(df_copy['Date'])
    summary_df['Entry Date'] = pd.to_datetime(summary_df['Entry Date'])
    summary_df['Exit Date'] = pd.to_datetime(summary_df['Exit Date'])
    
    plt.figure(figsize=(16, 8))
    plt.plot(df_copy['Date'], df_copy['Close'], label='Close Price', alpha=0.7, color='blue', linewidth=2)
    
    # Plot entry and exit points from the optimized trades summary
    entry_plotted = False
    exit_plotted = False
    
    for i, trade in summary_df.iterrows():
        entry_date = trade['Entry Date']
        entry_price = float(trade['Entry Price'])  # Convert string price to float
        exit_date = trade['Exit Date']
        exit_price = float(trade['Exit Price'])    # Convert string price to float
        trade_type = trade['Type']
        
        # Plot entry point
        if trade_type == 'Long':
            plt.scatter(entry_date, entry_price, marker='^', color='green', s=150, zorder=5, 
                       label='Buy Entry' if not entry_plotted else "")
            entry_plotted = True
        
        # Plot exit point
        if trade_type == 'Long':
            plt.scatter(exit_date, exit_price, marker='v', color='red', s=150, zorder=5, 
                       label='Sell Exit' if not exit_plotted else "")
            exit_plotted = True
        
        # Draw a line connecting entry and exit for better visualization
        plt.plot([entry_date, exit_date], [entry_price, exit_price], color='gray', 
                linestyle='--', linewidth=0.8, alpha=0.6)
    
    plt.title('Optimized Trading History (Buy/Sell Events)', fontsize=14, fontweight='bold')
    plt.xlabel('Date', fontsize=12)
    plt.ylabel('Close Price ($)', fontsize=12)
    plt.legend(fontsize=10)
    plt.grid(True, alpha=0.3)
    plt.tight_layout()
    plt.show()


def print_optimized_parameters(best_params: dict) -> None:
    """
    Print detailed information about optimized parameters.
    
    :param best_params: Dictionary containing optimized parameters
    """
    print("\n" + "="*80)
    print("OPTIMIZED PARAMETERS DETAILS")
    print("="*80)
    print(f"EMA Short Period: {best_params.get('EMA_short', 'N/A')}")
    print(f"EMA Long Period: {best_params.get('EMA_long', 'N/A')}")
    print(f"MACD Signal Span: {best_params.get('MACD_Signal_span', 'N/A')}")
    print("="*80 + "\n")


def plot_optimized_technical_analysis(df: pd.DataFrame, best_params: dict, 
                                     calculate_ema_func, calculate_macd_func, 
                                     plot_tech_func) -> None:
    """
    Calculate indicators with optimized parameters and plot technical analysis.
    
    :param df: Original DataFrame with price data
    :param best_params: Dictionary containing optimized parameters (EMA_short, EMA_long, MACD_Signal_span)
    :param calculate_ema_func: Function to calculate EMA
    :param calculate_macd_func: Function to calculate MACD
    :param plot_tech_func: Function to plot technical analysis
    """
    # Recalculate indicators with optimized parameters
    df_optimized = df.copy()
    df_optimized = calculate_ema_func(df_optimized, best_params['EMA_short'], best_params['EMA_long'])
    df_optimized = calculate_macd_func(df_optimized, best_params['MACD_Signal_span'])
    
    # Plot the technical analysis with optimized parameters
    print("\nTechnical Analysis Plots with Optimized Parameters:")
    plot_tech_func(
        df_optimized,
        ema_short_col='EMA_short',
        ema_long_col='EMA_long',
        title="Technical Analysis (Optimized Parameters)"
    )