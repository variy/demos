## 调用本地接口调试， 请开启 ./build/router-server.js的路由的服务。代码构建和路由服务是两个服务启动，这样当改写路由文件时，webpack不会重启（重启大概要花20几秒）


## 生产构建 gulp --env=PROD

## 本地调试 node app --reqd=testFAT 

## @pj 项目名，默认 investplus
* @env 构建环境, DEV、PROD、srcmapPROD
* @reqd 请求地址,  local, backend, FAT, UAT, testPROD, PROD 