module Alphavantage extend ActiveSupport::Concern
  #
  #  # # # # # # # # # # # #
  #  # #  SAMPLE DATA  # # #
  #  # # # # # # # # # # # #
  #
  # https://www.alphavantage.co/query?function=TIME_SERIES_INTRADAY&symbol=MSFT&interval=1min&apikey=demo
  # {
  #   "Meta Data"=>
  #   {
  #     "1. Information"=>"Intraday (1min) prices and volumes",
  #     "2. Symbol"=>"MSFT",
  #     "3. Last Refreshed"=>"2017-10-20 16:00:00",
  #     "4. Interval"=>"1min",
  #     "5. Output Size"=>"Compact",
  #     "6. Time Zone"=>"US/Eastern"
  #   },
  #   "Time Series (1min)"=>
  #   {
  #     "2017-10-20 16:00:00"=>
  #     {
  #       "1. open"=>"78.7000",
  #       "2. high"=>"78.8100",
  #       "3. low"=>"78.6950",
  #       "4. close"=>"78.8100",
  #       "5. volume"=>"2663315"
  #     },
  #     "2017-10-20 15:59:00"=>
  #     {
  #       "1. open"=>"78.7000",
  #       "2. high"=>"78.7200",
  #       "3. low"=>"78.6900",
  #       "4. close"=>"78.7000",
  #       "5. volume"=>"320215"
  #     },
  #     .
  #     .
  #     .
  #   }
  # }

  # Make data request(s) for symbols and return results in daily_trades.
  def fillDailyTrades(symbols, daily_trades)
    begin
      # TODO put conn creation in session variable to cut overhead?
      conn = Faraday.new(url: 'https://www.alphavantage.co/query')
    rescue Faraday::ClientError => e  # Can't connect. Error out all symbols.
      puts "PRICE FETCH ERROR for: #{symbols.inspect}"
      puts "Faraday client error: #{e}"
      fetch_failure(symbols, daily_trades)
    end

    api_key = ENV['ALPHA_VANTAGE_API_KEY']

    symbols.each.with_index { |symbol, i|
      begin
        puts "PRICE FETCH BEGIN for: #{symbol}"
        resp = conn.get do |req|
          req.params['function'] = 'TIME_SERIES_INTRADAY'
          req.params['interval'] = '1min'
          req.params['symbol']   = symbol
          req.params['apikey']   = api_key
        end
        puts "PRICE FETCH END   for: #{symbol}"
        response = JSON.parse(resp.body)
      rescue Faraday::ClientError => e
        puts "PRICE FETCH ERROR for: #{symbol}"
        puts "Faraday client error: #{e}"
        daily_trade = error_trade(symbol)
      rescue SyntaxError => e
        puts "JSON parse error: #{e}"
        daily_trade = error_trade(symbol)
      else
        # Error example:
        #   {"Error Message"=>"Invalid API call. Please retry or visit the documentation (https://www.alphavantage.co/documentation/) for TIME_SERIES_INTRADAY."}
        if response.key?('Error Message') || response.length == 0
          puts "Price request failure for symbol (#{symbol}): #{response['Error Message']}"
          daily_trade = error_trade(symbol)
        else
          header = response['Meta Data']
          tick   = response['Time Series (1min)'].first
          time   = tick.first
          prices = tick.second

          # TODO Get timezone from Meta Data.
          # TODO Derive day_change value.
          daily_trade = DailyTrade.new do |dt|
            dt.stock_symbol = StockSymbol.find_by(name: symbol)
            dt.trade_date   = time + " EDT"
            dt.open_price   = prices['1. open'].to_f
            dt.high_price   = prices['2. high'].to_f
            dt.low_price    = prices['3. low'].to_f
            dt.close_price  = prices['4. close'].to_f
            dt.trade_volume = prices['5. volume'].to_f
            dt.day_change   = 0.0
          end
        end
      ensure
        daily_trades[i] = daily_trade
      end
    }
  end

  # TODOO Consolidate these two functions into one place in common with yahoo.rb
  def error_trade(symbol)
    DailyTrade.new(stock_symbol: StockSymbol.new(name: symbol), close_price: nil)
  end

  def fetch_failure(symbols, daily_trades)
    symbols.each.with_index { |symbol, i|
      daily_trades[i] = error_trade(symbol)
    }
  end
end
