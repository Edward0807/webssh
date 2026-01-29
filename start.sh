#!/bin/bash
export PORT=${PORT:-''}      # web端口，留空默认8888
export USER=${USER:-''}      # 登录用户名，可为空
export PASS=${PASS:-''}      # 登录密码，可为空

ARCH=$(uname -m)
FILE_NAME="webssh"

# 根据架构设置下载URL
if [ "$ARCH" = "arm64" ] || [ "$ARCH" = "aarch64" ]; then
    ARCH="arm64"
elif [ "$ARCH" = "amd64" ] || [ "$ARCH" = "x86_64" ]; then
    ARCH="amd64"
elif [ "$ARCH" = "s390x" ]; then
    ARCH="s390x"
else
    echo "Unsupported architecture: $ARCH"
    exit 1
fi

BASE_URL="https://github.com/eooce/webssh/releases/latest/download"
FILE_URL="${BASE_URL}/webssh_linux_${ARCH}"

# 如果文件不存在，则下载
if [ ! -f "./$FILE_NAME" ]; then
    echo -e "\e[1;32mDownloading $FILE_NAME for $ARCH architecture...\e[0m"
    curl -L -sS -o "./$FILE_NAME" "$FILE_URL" || { echo -e "\e[1;31mFailed to download $FILE_URL\e[0m"; exit 1; }
    chmod +x "./$FILE_NAME"
fi

# 启动 webssh
echo -e "\e[1;34mStarting webssh...\e[0m"

# 判断启动参数组合
if [ -n "$PORT" ] && [ -n "$USER" ] && [ -n "$PASS" ]; then
    nohup "./$FILE_NAME" -p "$PORT" -a "$USER:$PASS" >/dev/null 2>&1 &
elif [ -n "$PORT" ]; then
    nohup "./$FILE_NAME" -p "$PORT" >/dev/null 2>&1 &
elif [ -n "$USER" ] && [ -n "$PASS" ]; then
    nohup "./$FILE_NAME" -a "$USER:$PASS" >/dev/null 2>&1 &
else
    nohup "./$FILE_NAME" >/dev/null 2>&1 &
fi

sleep 3

# 检查进程是否运行
if ps | grep -v grep | grep -q "./$FILE_NAME"; then
    echo -e "\e[1;32mwebssh is running\e[0m"
else
    echo -e "\e[1;31mFailed to start webssh\e[0m"
    exit 1
fi

# 获取IP地址
IP=$(curl -s --max-time 1 ipv4.ip.sb || curl -s --max-time 1 api.ipify.org || {
    ipv6=$(curl -s --max-time 1 ipv6.ip.sb)
    echo "[$ipv6]"
} || echo "未能获取到IP")

# 显示访问信息
if [ -n "$PORT" ]; then
    echo -e "\e[1;32mwebssh 已启动，访问 http://${IP}:${PORT}\e[0m"
else
    echo -e "\e[1;32mwebssh 已启动，访问 http://${IP}:8888\e[0m"
fi
