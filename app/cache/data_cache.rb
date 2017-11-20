# This module handles access to the data cache.
# All requests for data cache data should go through these methods.
module DataCache
  Dir[File.dirname(__FILE__) + '/data_cache/*.rb'].each { |file| require file }

  # Stay within feed vendor limits. Don't risk getting blacklisted or throttled.
  # Also, don't lock up the Trade database table for too long.
  FEED_BATCH_SIZE  = 50      # Number of records to process in one transaction.
  FEED_BATCH_DELAY =  1.000  # Delay time between transactions (in seconds).

  # Update instrument cache from instrument_data records.
  # instrument_data: [{symbol name},...]
  def self.bulk_load(instrument_data)
    InstrumentCache.bulk_load(instrument_data)
  end

  # Retrieve the latest values for the given array of index symbols.
  def self.last_indexes(symbols)
    IndexCache.last_indexes(symbols)
  end

  # Retrieve the latest prices for the given instrument list.
  # Specify getLivePrices to retrieve feed data. Otherwise, just get prices from database.
  def self.last_prices(instruments, getLivePrices)
    TradeCache.last_prices(instruments, getLivePrices)
  end
end