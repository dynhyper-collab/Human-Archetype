# Human Archetype

简体中文说明（Chinese README）

## 概述

Human Archetype 是一个基于前端的简易问卷/测试，名为 "AI Worldview Test"（AI 世界观测试）。通过一组多项选择题（1-5 分），测出用户在六个维度上的偏好/类型，并给出主要与次要的人格原型（Archetype）。该项目仅使用 HTML + JavaScript 实现，直接在浏览器中运行。

主要特点：
- 30 道题，分为 6 个维度：IH、SM、EA、RO、NN、IR
- 每题 1-5 分，最终将每个维度的得分规范化到 0–100
- 显示主要（primary）与次要（secondary）人设，以及各维度分数

## 如何运行

1. 克隆或下载本仓库。
2. 在浏览器中打开 `index.html`（双击或在浏览器中使用“打开文件”）。

命令行启动一个简单的静态服务器（可选，推荐用于测试浏览器安全策略）：

- 使用 Python 3:
  - 在仓库目录运行：
    ```bash
    python -m http.server 8000
    ```
  - 然后在浏览器打开 http://localhost:8000

## 项目结构

- index.html — 测试的页面，包含界面与对 app.js 的引用。
- app.js — 问题数据、答题流程、评分与结果展示的主要逻辑。

(注意：index.html 中引用了 `style.css`，如果你希望增加/覆盖样式，可以在仓库根目录创建 `style.css`。页面也包含内联样式，缺少外部样式文件时仍能正常显示。)

## 题目与维度说明

代码中将题目分为 6 个类型（type）：
- IH — Information Hunter（信息猎手）：偏向信息收集、关注资讯更新。
- SM — System Modeler（系统建模者）：偏向结构化、逻辑与体系化思考。
- EA — Execution Agent（执行代理）：偏向行动、实践优先。
- RO — Resource Optimizer（资源优化者）：偏向权衡与效率、追求性价比。
- NN — Network Node（网络节点）：偏向传播与社交网络连接。
- IR — Intuitive Reactor（直觉反应者）：偏向直觉与快速判断。

评分把每个维度的原始分（每维度 5 道题，每题 1–5 分）换算到 0–100 的范围，取最高的两个维度作为主要/次要原型。

## 修改 & 贡献

- 想要修改题目或维度：编辑 `app.js` 中的 `questions` 数组。
- 想要自定义样式：添加或修改 `style.css`。
- 欢迎提 issue 提出改进建议或功能需求。

## 许可

仓库当前未包含明确的许可证；如果你计划公开共享或允许他人复用代码，建议添加一个 LICENSE（例如 MIT）。

## 联系

仓库：https://github.com/dynhyper-collab/Human-Archetype
