source 'https://rubygems.org'

def gem_node(gem_name, local_path, nwo, branch="master")
  if File.directory?(File.expand_path(local_path, __dir__))
    gem gem_name, :path => local_path
  else
    gem gem_name, :git => "https://github.com/#{nwo}", :branch => branch
  end
end

gem_node 'jekyll', '../jekyll', 'jekyll/jekyll'

group :jekyll_plugins do
  gem 'classifier-reborn'
  gem 'jekyll-algolia'
  gem 'jekyll-archives'
  gem 'jekyll-cloudinary'
  gem 'jekyll-mermaid'
  gem 'jekyll-microtypo'
  gem 'jekyll-postfiles', '~> 2.1'
  gem 'jekyll-pwa-plugin'
  gem 'jekyll-sitemap'
  gem 'jekyll-tagging-related_posts'

  gem_node 'jekyll-locale', '../jekyll-locale', 'ashmaroli/jekyll-locale'
  gem_node 'jekyll-paginate-v2', '../jekyll-paginate-v2', 'borisschapira/jekyll-paginate-v2', 'default-values'
end

if Gem.win_platform?
  gem 'tzinfo-data'
  gem 'wdm'
end

group :jekyll_tests do
  gem 'ffi', '~> 1.9', '>= 1.9.18'
  gem 'html-proofer'
end

gem 'rake'
