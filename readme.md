# 概览

这是一个脚手架工具用于生成符合一般开发规范的原始项目。


[![NPM version](https://badge.fury.io/js/mx-fe-bone.svg)](http://badge.fury.io/js/mx-fe-bone) [![Build Status](https://travis-ci.org/ysmood/mx-fe-bone.svg)](https://travis-ci.org/ysmood/mx-fe-bone) [![Deps Up to Date](https://david-dm.org/ysmood/mx-fe-bone.svg?style=flat)](https://david-dm.org/ysmood/mx-fe-bone)


# 快速上手

0. 创建一个空文件夹, `cd` 到这个文件夹里

0. 执行 `npm i mx-fe-bone`

0. 执行 `node_modules/.bin/mx-fe-bone`，请耐心等待，这个步骤会下载开发的全部基础依赖，会比较耗时。
   如果是 typescript 项目，请执行 `node_modules/.bin/mx-fe-bone --lang typescript`。

0. 阅读生成的项目的 readme.md


# API

执行 `node_modules/.bin/mx-fe-bone --help`，查看全部 API。

# 脚手架升级

脚手架本身也会升级一些功能。两个步骤：

0. git commit 或 stash 你当前的改动，否则后果自负！
0. 执行 “快速上手” 中的 第 2 步，请选择想要用的版本
0. 执行 `node_modules/.bin/mx-fe-bone update` 升级脚手架
0. 然后用 git 对比改动，将需要的升级改动 commit 掉
