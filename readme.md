# 概览

这是一个脚手架工具用于生成符合一般开发规范的原始项目。


[![NPM version](https://badge.fury.io/js/febone.svg)](http://badge.fury.io/js/febone) [![Build Status](https://travis-ci.org/ysmood/febone.svg)](https://travis-ci.org/ysmood/febone) [![Deps Up to Date](https://david-dm.org/ysmood/febone.svg?style=flat)](https://david-dm.org/ysmood/febone)


# 快速上手

0. 创建一个空文件夹, `cd` 到这个文件夹里

0. 执行 `npm i febone`

0. 执行 `node_modules/.bin/febone`，请耐心等待，这个步骤会下载开发的全部基础依赖，会比较耗时。
   如果是 typescript 项目，请执行 `node_modules/.bin/febone --lang typescript`。

0. 阅读生成的项目的 readme.md，或者在线文档 [febone](tpl/doc/febone.md)。


# API

执行 `node_modules/.bin/febone --help`，查看全部命令行 API。

# 脚手架升级

在项目文件夹执行 `node_modules/.bin/no update-bone`。
