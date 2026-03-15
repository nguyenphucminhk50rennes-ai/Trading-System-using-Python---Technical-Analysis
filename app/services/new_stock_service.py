from app.utils.data_downloader import download_stock_data
import pandas as pd
import matplotlib.pyplot as plt
import matplotlib.dates as mdates
import numpy as np
from sklearn.model_selection import ParameterGrid
from app.models import OptimizationDetailResult, OptimizationParams, TradeDetail


def fetch_stock_data(ticker: str, start_date: str, end_date: str) -> pd.DataFrame:
    """
    Fetch stock data for a given ticker and date range.
    
    :param ticker: Stock ticker symbol.
    :param start_date: Start date for fetching data (YYYY-MM-DD).
    :param end_date: End date for fetching data (YYYY-MM-DD).
    :return: DataFrame containing stock data.
    """
    return download_stock_data(ticker, start_date, end_date, save_to_csv=False)


def convert_to_optimization_detail_result(
    ticker: str,
    start_date: str,
    end_date: str,
    total_records: int,
    best_params: dict,
    best_trades_df: pd.DataFrame,
    best_total_profit: float,
    best_final_capital: float,
    best_win_rate: float,
    best_avg_profit: float,
    best_profit_loss_ratio: float,
    best_annualized_return: float
) -> OptimizationDetailResult:
    """
    Convert optimization results to OptimizationDetailResult model.
    
    Args:
        ticker: Stock ticker symbol
        start_date: Start date
        end_date: End date
        total_records: Total number of records
        best_params: Dictionary of best parameters
        best_trades_df: DataFrame of trades
        best_total_profit: Total profit percentage
        best_final_capital: Final capital
        best_win_rate: Win rate
        best_avg_profit: Average profit per trade
        best_profit_loss_ratio: Profit/Loss ratio
        best_annualized_return: Annualized return
    
    Returns:
        OptimizationDetailResult model
    """
    # Convert trades DataFrame to list of TradeDetail models
    trades_list = []
    if best_trades_df is not None and not best_trades_df.empty:
        for _, row in best_trades_df.iterrows():
            trade = TradeDetail(
                date=str(row['Date']),
                type=row['Type'],
                price=float(row['Price']),
                profit=float(row['Profit']),
                capital=float(row['Capital'])
            )
            trades_list.append(trade)
    
    return OptimizationDetailResult(
        ticker=ticker,
        start_date=start_date,
        end_date=end_date,
        total_records=total_records,
        optimal_params=OptimizationParams(
            ema_short=best_params['EMA_short'],
            ema_long=best_params['EMA_long'],
            macd_signal_span=best_params['MACD_Signal_span']
        ),
        final_capital=best_final_capital,
        total_profit=best_total_profit,
        win_rate=best_win_rate,
        avg_profit_per_trade=best_avg_profit,
        profit_loss_ratio=best_profit_loss_ratio,
        annualized_return=best_annualized_return,
        total_trades=len(trades_list),
        trades=trades_list
    )

# Calculate EMA
def calculate_ema(df, short=8, long=16):
    df['EMA_short'] = df['Close'].ewm(span=short, adjust=False).mean()
    df['EMA_long'] = df['Close'].ewm(span=long, adjust=False).mean()
    return df


# Calculate MACD
def calculate_macd(df, macd_signal_span=9):
    df['MACD'] = df['EMA_short'] - df['EMA_long']
    df['MACD_Signal'] = df['MACD'].ewm(span=macd_signal_span, adjust=False).mean()
    df['MACD_Histogram'] = df['MACD']
    return df


def plot_technical_analysis_advanced(df,
                                    ema_short_col='EMA_short',
                                    ema_long_col='EMA_long',
                                    title="Biểu đồ Phân tích Kỹ thuật"):

    fig, axes = plt.subplots(2, 1, figsize=(16, 10), sharex=True)

    # 1. Biểu đồ giá và EMA
    ax1 = axes[0]
    ax1.plot(df['Date'], df['Close'], label='Giá đóng cửa', color='black', linewidth=1.5)
    ax1.plot(df['Date'], df[ema_short_col], label=f'EMA ({ema_short_col.split("_")[1]})',
             color='blue', linewidth=1.2, alpha=0.8)
    ax1.plot(df['Date'], df[ema_long_col], label=f'EMA ({ema_long_col.split("_")[1]})',
             color='red', linewidth=1.2, alpha=0.8)

    # Tô màu vùng giữa hai EMA
    ax1.fill_between(df['Date'], df[ema_short_col], df[ema_long_col],
                     where=(df[ema_short_col] >= df[ema_long_col]),
                     color='lightgreen', alpha=0.3, label='EMA ngắn > EMA dài')
    ax1.fill_between(df['Date'], df[ema_short_col], df[ema_long_col],
                     where=(df[ema_short_col] < df[ema_long_col]),
                     color='lightcoral', alpha=0.3, label='EMA ngắn < EMA dài')

    ax1.set_title(f'{title} - Giá và EMA', fontsize=14, fontweight='bold')
    ax1.set_ylabel('Giá ($)', fontsize=12)
    ax1.legend(loc='upper left', fontsize=10)
    ax1.grid(True, alpha=0.3)

    # 2. Biểu đồ MACD
    ax2 = axes[1]
    ax2.plot(df['Date'], df['MACD'], label='MACD', color='blue', linewidth=1.5)
    ax2.plot(df['Date'], df['MACD_Signal'], label='Signal Line', color='red', linewidth=1.5)

    # Tô màu histogram: xanh khi MACD > Signal, đỏ khi ngược lại
    colors = ['green' if h > 0 else 'red' for h in df['MACD_Histogram']]
    ax2.bar(df['Date'], df['MACD_Histogram'], color=colors, alpha=0.5, label='Histogram', width=0.8)

    ax2.axhline(0, color='black', linewidth=0.5, alpha=0.5)
    ax2.set_title('Chỉ số MACD', fontsize=14, fontweight='bold')
    ax2.set_ylabel('MACD', fontsize=12)
    ax2.set_xlabel('Thời gian', fontsize=12)
    ax2.legend(loc='upper left', fontsize=10)
    ax2.grid(True, alpha=0.3)

    # Định dạng trục thời gian với các năm cụ thể
    ax2.xaxis.set_major_locator(mdates.YearLocator())
    ax2.xaxis.set_major_formatter(mdates.DateFormatter('%Y'))

    # Xoay nhãn trục X cho dễ đọc
    plt.setp(ax2.xaxis.get_majorticklabels(), rotation=45)

    plt.tight_layout()
    # plt.show() # Removed plt.show() here
    plt.close()  # Close figure for batch testing

    return fig


# Generate signals
def generate_signals(df):
    df['Signal'] = 0

    # Buy condition:
    # 1. MACD Histogram chuyển từ âm sang dương
    # 2. Giá trên EMA dài (xu hướng tăng)
    # 3. EMA ngắn > EMA dài (xu hướng tăng xác nhận)
    buy_condition = (
        (df['MACD_Histogram'] > 0) &
        (df['MACD_Histogram'].shift(1) <= 0) &
        (df['Close'] > df['EMA_long']) &
        (df['EMA_short'] > df['EMA_long'])
    )

    # Sell conditions:
    # 1. MACD Histogram chuyển từ dương sang âm
    # 2. Giá dưới EMA dài (xu hướng giảm)
    # 3. EMA ngắn < EMA dài (xu hướng giảm xác nhận)
    sell_condition = (
        (df['MACD_Histogram'] < 0) &
        (df['MACD_Histogram'].shift(1) >= 0) &
        (df['Close'] < df['EMA_long']) &
        (df['EMA_short'] < df['EMA_long'])
    )

    df.loc[buy_condition, 'Signal'] = 1
    df.loc[sell_condition, 'Signal'] = -1

    return df


# Summarize signals (bỏ)
def summarize_signals(df):
    buy_signals = df[df['Signal'] == 1]
    sell_signals = df[df['Signal'] == -1]

    print(f"Total amount of buy signals: {len(buy_signals)}")
    print(f"Total amount of sell signals: {len(sell_signals)}")
    print("Buy signal hisotry:")
    print(buy_signals[['Date', 'Close', 'MACD', 'Signal']])
    print("\nSell signal history:")
    print(sell_signals[['Date', 'Close', 'MACD', 'Signal']])


# Plot signals 
def plot_buy_sell_signals(df):
    buy_signal = df[df['Signal'] == 1]
    sell_signal = df[df['Signal'] == -1]
    plt.figure(figsize=(14, 6))
    plt.plot(df['Date'], df['Close'], label='Close Price')
    plt.scatter(buy_signal['Date'], buy_signal['Close'], label='Buy Signal', marker='^', color='green', s=100)
    plt.scatter(sell_signal['Date'], sell_signal['Close'], label='Sell Signal', marker='v', color='red', s=100)
    plt.title('Signal Summary')
    plt.ylabel('Closed Price ($)')
    plt.legend()
    plt.grid()
    plt.tight_layout()
    # plt.show()  # Commented out for batch testing
    plt.close()  # Close the figure after creating it


# Backtest
def backtest_strategy_fixed(df, initial_capital=1000, stop_loss=0.10):
    position = 0  # 0: No position, 1: Long
    capital = initial_capital
    shares = 0    # Số lượng cổ phiếu đang nắm giữ
    trades = []
    entry_price = 0
    entry_capital = 0  # Vốn dùng cho vị thế hiện tại (capital at the time of entry)

    daily_capital_records = [{'Date': df['Date'].iloc[0], 'Capital': initial_capital}]

    for i in range(1, len(df)):
        signal = df['Signal'].iloc[i]
        close_price = df['Close'].iloc[i]
        date = df['Date'].iloc[i]

        # --- Calculate current equity for daily_capital_records ---
        if position == 1:
            current_equity = shares * close_price
        else: # position == 0
            current_equity = capital
        daily_capital_records.append({'Date': date, 'Capital': current_equity})

        # --- STOP-LOSS CHECK (only for LONG positions) ---
        if position == 1:
            current_profit = (close_price - entry_price) / entry_price
            if current_profit <= -stop_loss:
                # Sell due to stop loss
                capital = shares * close_price  # Liquidate shares, recover cash
                profit_pct = max(current_profit, -stop_loss) # Cap the reported profit at stop_loss
                trades.append({'Date': date, 'Type': 'Sell (SL)', 'Price': close_price,
                              'Profit': profit_pct, 'Capital': capital})
                position = 0
                shares = 0
                entry_capital = 0
                entry_price = 0
                daily_capital_records[-1]['Capital'] = capital # Update daily capital for this day after stop-loss
                continue # Move to next day, cannot open new position on same day after stop-loss

        # --- SIGNAL PROCESSING ---
        if position == 0: # Currently no position, only look for BUY signals
            if signal == 1:  # BUY signal
                shares = capital / close_price  # Use all available capital to buy shares
                entry_capital = capital
                capital = 0  # Capital is now invested in shares
                position = 1
                entry_price = close_price
                trades.append({'Date': date, 'Type': 'Buy', 'Price': close_price,
                              'Profit': 0, 'Capital': entry_capital})
            # If signal is -1 (sell) and position is 0, do nothing (no short selling)

        elif position == 1: # Currently LONG position
            if signal == -1: # SELL signal received while long (take profit/loss)
                profit = (close_price - entry_price) / entry_price
                capital = entry_capital * (1 + profit)  # Liquidate shares, recover capital + P&L
                trades.append({'Date': date, 'Type': 'Sell', 'Price': close_price,
                              'Profit': profit, 'Capital': capital})
                position = 0 # Now flat
                shares = 0
                entry_capital = 0
                entry_price = 0

            # If signal is 1 (buy) while position is 1, do nothing (already long)

    # --- CLOSE FINAL POSITION (if any remaining LONG position at end of data) ---
    if position == 1:
        capital = shares * df['Close'].iloc[-1]
        profit = (df['Close'].iloc[-1] - entry_price) / entry_price
        trades.append({'Date': df['Date'].iloc[-1], 'Type': 'Sell (EOD)',
                      'Price': df['Close'].iloc[-1], 'Profit': profit, 'Capital': capital})

    # Final total profit calculation
    total_profit = (capital - initial_capital) / initial_capital

    # Construct daily_capital_series from daily_capital_records
    daily_capital_df = pd.DataFrame(daily_capital_records)
    daily_capital_df = daily_capital_df.set_index('Date')['Capital']
    # Ensure all dates from original df are covered, forward-fill missing ones (e.g., weekends)
    daily_capital_series = daily_capital_df.reindex(pd.to_datetime(df['Date'])).ffill()

    return trades, total_profit, capital, daily_capital_series


def calculate_metrics(trades_df, initial_capital, daily_capital):
    """
    trades_df: DataFrame chứa các lệnh
    daily_capital: Series chứa vốn mỗi ngày (equity curve)
    """

    if trades_df.empty:
        return { 'total_trades': 0, 'win_rate': 0, 'profit_loss_ratio': 0, 'total_return': 0, 'annualized_return': 0, 'avg_profit_per_trade': 0 }

    # 1. Basic metrics
    total_trades = len(trades_df)
    winning_trades = len(trades_df[trades_df['Profit'] > 0])
    losing_trades = len(trades_df[trades_df['Profit'] < 0])
    win_rate = winning_trades / total_trades if total_trades > 0 else 0

    # 3. Additional metrics - use final capital from the last trade's Capital column
    final_capital = trades_df['Capital'].iloc[-1]
    total_return = (final_capital - initial_capital) / initial_capital
    
    # Annualized return based on number of days (assuming ~252 trading days per year)
    num_days = len(daily_capital)
    if num_days > 1:
        annualized_return = (1 + total_return) ** (252 / num_days) - 1
    else:
        annualized_return = 0

    return {
        'total_trades': total_trades,
        'win_rate': win_rate,
        'total_return': total_return,
        'annualized_return': annualized_return,
        'avg_profit_per_trade': trades_df['Profit'].mean()
    }


def run_backtest_and_report(df, initial_capital=1000, stop_loss=0.10):
    """
    Run the backtest strategy and calculate metrics
    """
    trades_list_fixed, total_profit_fixed, final_capital_fixed, daily_capital_series_fixed = backtest_strategy_fixed(df, initial_capital, stop_loss)
    trades_df_fixed = pd.DataFrame(trades_list_fixed)

    metrics = calculate_metrics(trades_df_fixed, initial_capital, daily_capital_series_fixed)

    print("\n--- Backtest Results (Fixed Strategy) ---")
    print(f"Initial Capital: ${initial_capital}")
    print(f"Final Capital: ${final_capital_fixed:.2f}")
    print(f"Total Return: {metrics['total_return']:.2%}")
    print(f"Annualized Return: {metrics['annualized_return']:.2%}")
    print(f"Total Trades: {metrics['total_trades']}")
    print(f"Win Rate: {metrics['win_rate']:.2%}")
    print(f"Average Profit per Trade: {metrics['avg_profit_per_trade']:.2%}")
    print(f"Profit/Loss Ratio: {metrics['profit_loss_ratio']:.2f}")

    print("\nDetailed Trade History:")
    print(trades_df_fixed.to_string())

    return metrics, trades_df_fixed, daily_capital_series_fixed


# Optimization (expanded parameter grid)
def optimize_strategy(df):
    param_grid = {
        'EMA_short': [8, 12, 16],
        'EMA_long': [16, 26, 30, 40],
        'MACD_Signal_span': [5, 9, 13]
    }
    best_annualized_return = -np.inf
    best_params = None
    best_trades_df = None # Store as DataFrame for consistency
    best_metrics = None
    best_final_capital = None

    for params in ParameterGrid(param_grid):
        temp_df = df.copy()
        temp_df = calculate_ema(temp_df, params['EMA_short'], params['EMA_long'])
        temp_df = calculate_macd(temp_df, params['MACD_Signal_span'])
        temp_df = generate_signals(temp_df) # No need to pass RSI parameters since we're not using RSI in this version

        trades_list, current_total_profit, current_final_capital, daily_capital_series = backtest_strategy_fixed(temp_df)
        current_trades_df = pd.DataFrame(trades_list)
        current_metrics = calculate_metrics(current_trades_df, 1000, daily_capital_series)

        # Handle NaN returns - skip parameters that produce NaN
        annualized_ret = current_metrics['annualized_return']
        if np.isnan(annualized_ret):
            annualized_ret = -np.inf  # Assign lowest value to NaN returns
        
        # Debug: Print trades count for each parameter set (commented out for API usage)
        # print(f"Params: {params} | Trades: {len(trades_list)} | Return: {current_metrics['annualized_return']:.2%} | Capital: ${current_final_capital:.2f}")

        if annualized_ret > best_annualized_return:
            best_annualized_return = annualized_ret
            best_params = params
            best_trades_df = current_trades_df
            best_metrics = current_metrics
            best_final_capital = current_final_capital

    # (Debug output suppressed for API usage)
    # print(f"\nBest annualized return found: {best_annualized_return:.2%}")
    return best_params, best_trades_df, best_metrics['total_return'], best_final_capital, \
           best_metrics['win_rate'], best_metrics['avg_profit_per_trade'], \
           best_metrics['profit_loss_ratio'], best_metrics['annualized_return']


def run_optimize_strategy(df):
    """
    Run parameter optimization maximizing annualized return and display results
    """
    best_params, best_trades, best_total_profit, best_final_capital, best_win_rate, best_avg_profit, best_profit_loss_ratio, best_annualized_return = optimize_strategy(df)
    
    return best_params, best_trades, best_total_profit, best_final_capital, best_win_rate, best_avg_profit, best_profit_loss_ratio, best_annualized_return


def caculate_statistic(ticker = "TSLA", 
    start_date = "2020-01-01",
    end_date = "2026-02-01"):
      # 1. Fetch stock data using download_stock_data
    print("=" * 60)
    print("1. Fetching stock data...")
    print("=" * 60)
    data = fetch_stock_data(ticker, start_date, end_date)
    print(f"[OK] Fetched {len(data)} records for {ticker}\n")

    # 2. Calculate EMA and MACD for visualization
    print("=" * 60)
    print("2. Calculating technical indicators...")
    print("=" * 60)
    data = calculate_ema(data, short=8, long=16)
    data = calculate_macd(data, macd_signal_span=9)
    data = generate_signals(data)
    print("[OK] EMA, MACD, and signals calculated\n")

    # 3. Plot technical analysis
    print("=" * 60)
    print("3. Plotting technical analysis...")
    print("=" * 60)
    plot_technical_analysis_advanced(data, title="TSLA Technical Analysis")
    print("[OK] Technical analysis chart plotted\n")

    # 4. Summarize signals
    print("=" * 60)
    print("4. Signal Summary:")
    print("=" * 60)
    summarize_signals(data)
    print()

    # 5. Plot buy/sell signals
    print("=" * 60)
    print("5. Plotting buy/sell signals...")
    print("=" * 60)
    plot_buy_sell_signals(data)
    print("[OK] Buy/sell signals chart plotted\n")

    # 6. Run backtest with current parameters
    print("=" * 60)
    print("6. Running backtest with default parameters...")
    print("=" * 60)
    metrics, trades_df, daily_capital = run_backtest_and_report(data)
    print()

    # 7. Optimize strategy (grid search)
    print("=" * 60)
    print("7. Running optimization (grid search)...")
    print("=" * 60)
    best_params, best_trades, best_total_profit, best_final_capital, best_win_rate, best_avg_profit, best_profit_loss_ratio, best_annualized_return = optimize_strategy(data)
    print(f"[OK] Optimization complete!")
    print(f"  Best parameters: {best_params}")
    print(f"  Best annualized return: {best_annualized_return:.2%}")
    print(f"  Final capital: ${best_final_capital:.2f}\n") 

    return {
        "best_params": best_params,
        "best_trades": best_trades,
        "best_total_profit": best_total_profit,
        "best_final_capital": best_final_capital,
        "best_win_rate": best_win_rate,
        "best_avg_profit": best_avg_profit,
        "best_profit_loss_ratio": best_profit_loss_ratio,
        "best_annualized_return": best_annualized_return
    }