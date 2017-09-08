require 'capybara'
require 'capybara/dsl'
include Capybara::DSL

Capybara.javascript_driver = :selenium
Capybara.current_driver = :selenium
Capybara.register_driver :selenium do |app|
  Capybara::Selenium::Driver.new(app, :browser => :chrome)
end

keyword = ARGV[0]
keyword ||= "logitech mouse"

url = "http://24h.pchome.com.tw/"
visit(url)

sleep(rand(2..5))   # 模擬人延遲

find('input#keyword').set(keyword)
puts "查詢 #{keyword} 相關商品"
find('input#doSearch').click

sleep(1)

productSum = find('span#SearchInfo span').text.to_i
puts "共找到 #{productSum} 筆商品"

x, y = 0, 2000

for i in 1..productSum
  page.execute_script("window.scrollTo(#{x}, #{y})")
  products = all('dl.col3f')
  x += 1500
  y += 1500
  break if products.size == productSum
end

products.each_with_index do |product, index|
  if (products.length - 1 == index)
    productName = product.find('h5').text
    productPrice = product.find('.price').text
    puts "No.#{index + 1}: #{productPrice} - #{productName}"
  end
end

#page.execute_script("window.scrollTo(0, document.body.scrollHeight)")