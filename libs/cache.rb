class Cache
  @@prefix = "tiqav_"

  @@cache =
    Dalli::Client.new(
                      (ENV['MEMCACHIER_SERVERS'] || ENV['MEMCACHE_SERVERS'] || 'localhost:11211') ,
                      {
                        :username => (ENV['MEMCACHIER_USERNAME'] || ENV['MEMCACHE_USERNAME']),
                        :password => (ENV['MEMCACHIER_PASSWORD'] || ENV['MEMCACHE_PASSWORD'])
                      }
                      )

  def self.cache
    @@cache
  end

  def self.prefix=(prefix)
    @@prefix = prefix
  end

  def self.get(key)
    res = cache.get "#{@@prefix}_#{key}"
    return nil if res.to_s.empty?
    JSON.parse res rescue return nil
  end

  def self.set(key, value, expire=3600*72)
    cache.set "#{@@prefix}_#{key}", value.to_json, expire
    value
  end
end
