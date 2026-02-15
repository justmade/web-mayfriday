#!/bin/bash

# 设置代理
export https_proxy=http://127.0.0.1:6152
export http_proxy=http://127.0.0.1:6152
export all_proxy=socks5://127.0.0.1:6153

# 推送到 GitHub
git push -u origin main
