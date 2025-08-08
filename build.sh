#!/bin/bash
# Install Ruby and dependencies
curl -sSL https://get.rvm.io | bash -s stable
source ~/.rvm/scripts/rvm
rvm install 3.1.0
rvm use 3.1.0 --default
gem install bundler
bundle install
bundle exec jekyll build
