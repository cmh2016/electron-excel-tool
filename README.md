# excel多文件对比小工具

> An electron-vue project for excel tool

#### Build Setup

``` bash
# install dependencies 开发环境建议 yarn
npm install

# serve with hot reload at localhost:9080 开发环境建议 yarn
npm run dev 

# build electron application for production 开发环境建议 yarn
npm run build 



```

#### 注意事项

1. 多层嵌套for循环时优化
2. 开发是建议使用yarn，优点暂不表述
3. 特别注意： build时出现白屏及处理。
>第一种：本机开发打包白屏，但是run dev正常。请参考webpack.renderer.config.js第110行 。 第二种：本机打包正常，copy给其他电脑白屏，报各种模块不存在，请使用【npm】打包！！！一切问题迎刃而解。怀疑是yarn安装依赖没有被打包。
---

This project was generated with [electron-vue](https://github.com/SimulatedGREG/electron-vue)@[4c6ee7b](https://github.com/SimulatedGREG/electron-vue/tree/4c6ee7bf4f9b4aa647a22ec1c1ca29c2e59c3645) using [vue-cli](https://github.com/vuejs/vue-cli). Documentation about the original structure can be found [here](https://simulatedgreg.gitbooks.io/electron-vue/content/index.html).
