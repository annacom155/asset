#!/usr/bin/env python3
"""
VNC 端口转发服务（Python版）- 无第三方依赖
使用纯标准库实现本机IP获取
"""

import socket
import threading
import os
from typing import Tuple

# 配置常量
LOCAL_VNC_HOST = "127.0.0.1"
LOCAL_VNC_PORT = 5901
REMOTE_PORT = 8801


def get_local_ip_address() -> str:
    """
    使用UDP socket探测本机IP地址（无需第三方库）
    原理：连接一个外部地址（不发送数据），获取本地出口IP
    :return: IPv4 字符串
    :raises: RuntimeError 如果失败
    """
    try:
        # 创建一个UDP socket（不会真的发送数据）
        with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
            # 连接一个外部地址（Google DNS），不会真的发包
            s.connect(("8.8.8.8", 80))
            ip = s.getsockname()[0]
            if ip and not ip.startswith("127."):
                return ip
    except Exception as e:
        # 如果UDP方式失败，尝试遍历接口（仅限Linux，但简单）
        try:
            # 这种方式在Linux下可用，通过ioctl（但需要root或/proc）
            # 更简单：尝试绑定0.0.0.0获取默认路由接口IP
            with socket.socket(socket.AF_INET, socket.SOCK_DGRAM) as s:
                s.bind(("0.0.0.0", 0))  # 绑定任意端口
                # 实际上无法直接获取，所以我们 fallback
                pass
        except:
            pass

    # 最后的尝试：通过hostname（不一定准）
    try:
        hostname = socket.gethostname()
        ip = socket.gethostbyname(hostname)
        if ip and not ip.startswith("127.") and ip != "::1":
            return ip
    except:
        pass

    raise RuntimeError("无法自动获取本机IP地址，请手动指定")


def forward_data(src: socket.socket, dst: socket.socket, direction: str):
    """单向数据转发"""
    try:
        while True:
            data = src.recv(8192)
            if not data:
                break
            try:
                dst.sendall(data)
            except (BrokenPipeError, ConnectionResetError, OSError) as e:
                print(f"{direction} 写入失败: {e}")
                break
    except Exception as e:
        print(f"{direction} 读取失败: {e}")
    finally:
        try:
            dst.close()
        except:
            pass
        try:
            src.close()
        except:
            pass


def handle_connection(client_conn: socket.socket):
    """处理客户端连接"""
    peer_addr = client_conn.getpeername()
    print(f"\n客户端已连接: {peer_addr[0]}:{peer_addr[1]}")

    try:
        vnc_conn = socket.create_connection((LOCAL_VNC_HOST, LOCAL_VNC_PORT))
        print(f"已连接到本地VNC服务器: {LOCAL_VNC_HOST}:{LOCAL_VNC_PORT}")
    except Exception as e:
        print(f"连接到VNC服务器失败: {e}")
        client_conn.close()
        return

    t1 = threading.Thread(target=forward_data, args=(client_conn, vnc_conn, "客户端->VNC"), daemon=True)
    t2 = threading.Thread(target=forward_data, args=(vnc_conn, client_conn, "VNC->客户端"), daemon=True)

    t1.start()
    t2.start()
    t1.join()
    t2.join()

    print(f"连接关闭: {peer_addr[0]}:{peer_addr[1]}")


def start_forwarding(host: str):
    """启动服务"""
    listen_addr = (host, REMOTE_PORT)
    server_socket = socket.socket(socket.AF_INET, socket.SOCK_STREAM)
    server_socket.setsockopt(socket.SOL_SOCKET, socket.SO_REUSEADDR, 1)

    try:
        server_socket.bind(listen_addr)
        server_socket.listen(5)
        print(f"服务器已启动，监听地址: {host}:{REMOTE_PORT}")
        print("等待客户端连接...")
    except Exception as e:
        print(f"监听失败: {e}")
        server_socket.close()
        return

    try:
        while True:
            try:
                client_conn, addr = server_socket.accept()
                print(f"[新连接] {addr[0]}:{addr[1]}")
                client_thread = threading.Thread(target=handle_connection, args=(client_conn,), daemon=True)
                client_thread.start()
            except KeyboardInterrupt:
                print("\n正在停止服务...")
                break
            except Exception as e:
                print(f"接受连接失败: {e}")
                continue
    finally:
        server_socket.close()


def main():
    print("=== VNC端口转发服务 (Python) ===")
    
    try:
        local_ip = get_local_ip_address()
    except Exception as e:
        print(f"无法获取本机IP地址: {e}")
        print("提示：你可以手动修改代码，将 host 设为 '0.0.0.0' 或具体IP")
        exit(1)

    remote_host = local_ip
    print(f"本地VNC: {LOCAL_VNC_HOST}:{LOCAL_VNC_PORT}")
    print(f"局域网远程地址: {remote_host}:{REMOTE_PORT}")
    print("VNC密码: 123456")
    print("-" * 50)

    try:
        start_forwarding(remote_host)
    except KeyboardInterrupt:
        print("\n服务已终止。")
    except Exception as e:
        print(f"转发服务异常: {e}")
        exit(1)


if __name__ == "__main__":
    main()
