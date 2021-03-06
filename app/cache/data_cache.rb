# This module handles access to the data cache.
# All requests for data cache data should go through these methods.
module DataCache
  Dir[File.dirname(__FILE__) + '/data_cache/*.rb'].each { |file| require file }

  ### for use by cache handlers ###
  # Stay within feed vendor limits. Don't risk getting blacklisted or throttled.
  # Also, don't hit the database too hard.
  INDEX_BATCH_SIZE   =  1    # Number of symbols in one index request.
  INDEX_BATCH_DELAY  = 20.0  # Delay time between index requests (in seconds).
  SERIES_BATCH_SIZE  =  1    # Number of symbols in one series request.
  SERIES_BATCH_DELAY = 20.0  # Delay time between series requests (in seconds).
  TRADE_BATCH_SIZE   = 50    # Number of symbols in one feed request.
  TRADE_BATCH_DELAY  =  1.0  # Delay time between feed requests (in seconds).

  # Update instrument cache from instrument_data records.
  # instrument_data: [{symbol name},...]
  def self.instrument_bulk_load(instrument_data)
    InstrumentCache.bulk_load(instrument_data)
  end

  # Retrieve the latest values for the given array of index symbols.
  def self.index_values(symbols)
    IndexCache.indexes(symbols)
  end

  # Retrieve the latest monthly series values for the given array of symbols.
  def self.monthly_series(symbols, start_date, end_date)
    SeriesCache.series(symbols, start_date, end_date)
  end

  # Retrieve the latest prices for the given instrument list.
  # Specify get_live_prices to retrieve feed data. Otherwise, just get prices from database.
  def self.price_values(instruments, get_live_prices)
    TradeCache.prices(instruments, get_live_prices)
  end

  # Update series data for the given symbols.
  def self.series_bulk_load(symbol_array)
    SeriesCache.bulk_load(symbol_array)
  end
end
