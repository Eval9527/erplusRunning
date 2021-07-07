erplus 定时运行任务

# 配置
去 config.js 中添加 token

token 获取方式：登陆之后去 cookies 中获取 token

# 运行
## 安装依赖
```shell script
npm install
```
## 启动服务
```shell script
node index.js
```

## TODO
- [x] 节假日及周日跳过任务


## 建议
- 可改造成 Actions 自动运行
- 可改造成自己电脑，比如：Windows 自动运行

### 自己电脑开机自动运行
我自己的思路：

建一个文件夹 `script`，存放所有需要开机自动运行的脚本，

在这个文件夹上面建一个运行所有 `script` 里面脚本的脚本 `index.bat`

创建这个 `index.bat` 脚本的快捷方式，把这个快捷方式放到 `C:\Users\Administrator\AppData\Roaming\Microsoft\Windows\Start Menu\Programs\Startup`

这样就可以开机自启动

```
auto-run-script
 ├── index.bat  // 运行 script 下的所有脚本
 └── script
     └── erplus.bat  // 这个 ERPLUS 脚本
```

```
# index.bat
for /r "E:\auto-run-script\script" %%i in (*.bat) do (start "" "%%i") // 这里填写了完整路径
```

```
# erplus.bat
node "E:\erplus\index.js"
```
