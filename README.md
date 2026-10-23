# research-ppt-skill

[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)
[![Output](https://img.shields.io/badge/output-.pptx-orange)](https://www.npmjs.com/package/pptxgenjs)

AI Agent **Skill** 集合：把论文变成研究组组会风格的中文学术 PPT。当前包含一个技能 [`research-report-cn`](./research-report-cn/)。

---

## research-report-cn · 研究组风格学术汇报 PPT

按**研究组组会风格**生成中文学术 PPT（`.pptx`）：论文精读、文献汇报、组会汇报、综述与研究方向梳理。

固定视觉语言，不靠模板碰运气：左上紫色竖条 + 标题下细线、右上主题徽标、紫色「问题/描述」标签块配浅紫要点条、表格下方绿色 take-away 结论条、每章前重复目录且当前章节标红、封面左侧紫色栏。

> Agent 读论文 PDF → 建数据账本核对每个数字 → 裁论文配图 → 写一份只含内容的 deck 脚本 → 排版库产出 .pptx → 渲染预览逐页检查。

### 它生成什么

| 能力 | 说明 |
|---|---|
| 汇报类型 | 论文精读（1–3 篇）、文献汇报、组会进展汇报、综述 / 研究方向梳理 |
| 固定视觉 | 紫色体系 + 浅紫要点条 + 绿色结论条；红色**只**用于当前目录项与关键词 |
| 数据可信 | 每个数字进 `numbers.md` 数据账本；平均值/差值/排名一律用 Python 算，与原文对不上就写进讨论页 |
| 配图 | 从论文 PDF 裁「方法框架图」「动机现象图」，带坐标检查，不带页眉/图题 |
| 质量闸门 | 构建时自动排版溢出检查（`no warnings`）+ 渲染成每页 PNG 与缩略图总览逐页目检 |
| 四种模板 | A 标签要点页 / B 表格页 / C 列举页 / D 图片页，按内容自动匹配 |

**页面尺寸**：16:9（13.33″ × 7.5″），白底，中文宋体 + 西文 Times New Roman。
**页数**：内容页 ≈ 时长（分钟）× 0.6。15 分钟约 9 页，30 分钟约 18 页。

---

## 演示 Demo

`demo/` 里是实际跑这个技能产出的成品，用来对照 **同一个技能、不同模型** 的差别。文件名后缀 `_by <模型>` 标明是哪个模型生成的。

| 文件 | 模型 | 任务 | 规模 |
|---|---|---|---|
| 📥 **[GAD_demo_by DeepSeek v4.1 Flash.pptx](./demo/GAD_demo_by%20DeepSeek%20v4.1%20Flash.pptx)** | DeepSeek v4.1 Flash | 同一任务：按 `example_deck.js` 的两篇 GAD 论文精读 | 32 页 / 1.0 MB |
| 📥 **[GAD_demo_by GPT 6.1 Sol.pptx](./demo/GAD_demo_by%20GPT%206.1%20Sol.pptx)** | GPT 6.1 Sol | 同一任务 | 32 页 / 0.88 MB |
| 📥 **[AI_Agent_and_Harness_Survey_by DeepSeek v4.1 Flash.pptx](./demo/AI_Agent_and_Harness_Survey_by%20DeepSeek%20v4.1%20Flash.pptx)** | DeepSeek v4.1 Flash | 另一个任务：模型自己调研并生成综述 | 33 页 / 0.72 MB |

前两个是**同一任务的两个模型版本**，可以直接对比封面左栏、目录标红、表格密度与 take-away 写法的差异。

> GitHub 不能在线预览 `.pptx`，下载后用 PowerPoint / WPS / LibreOffice 打开。
> 想自己复现：`cp assets/rr_lib.js assets/example_deck.js <目录>/ && cd <目录> && mv example_deck.js build.js && NODE_PATH=$(npm root -g) node build.js`

### 逐页结构 · GAD 精读（32 页）

| 页 | 内容 | 模板 |
|---:|---|---|
| 1 | 封面（左栏主题纹理 · `# Generalist GAD`） | cover |
| 2 | 完整目录 | toc |
| 3 | 目录 · 研究背景 | section |
| 4 | 通用图异常检测：问题设定 | A 标签要点 |
| 5 | 现有通用 GAD 方法速览 | B 表格 |
| 6 | 目录 · ReFi-GAD（第 1 篇） | section |
| 7 | 目录 · 子节：动机 | sub |
| 8 | 现象：预训练反而带来负迁移 | D 图片 side |
| 9 | 根因：PCA 只对齐了维度，没对齐语义 | D 图片 side |
| 10 | 目录 · 子节：方法 | sub |
| 11 | ReFi-GAD 整体框架 | D 图片 full |
| 12 | 关系指纹 ReFi：五个维度 | B 表格 |
| 13 | 模型：域共享编码 + SNR 自适应细化 | A 标签要点 |
| 14 | 目录 · 子节：实验 | sub |
| 15 | 主实验：14 个数据集 AUROC (%) | B 表格 |
| 16 | 消融与跨域分析 | B 表格 |
| 17 | 目录 · AG-Forge / TS-GGAD（第 2 篇） | section |
| 18 | 目录 · 子节：动机 | sub |
| 19 | 现象：真实训练数据太少 | D 图片 side |
| 20 | 目录 · 子节：方法 | sub |
| 21 | AG-Forge + TS-GGAD 整体框架 | D 图片 full |
| 22 | AG-Forge：三阶段合成流水线 | B 表格 |
| 23 | TS-GGAD：双流模型与课程学习 | A 标签要点 |
| 24 | 目录 · 子节：实验 | sub |
| 25 | 主实验：合成数据能否替代真实数据 | B 表格 |
| 26 | 消融：哪些设计最关键 | B 表格 |
| 27 | 目录 · 对比与思考 | section |
| 28 | 两篇论文对比 | B 表格 |
| 29 | 值得讨论的问题 | A 标签要点 |
| 30 | 目录 · 未来方向 | section |
| 31 | 未来方向 | C 列举 |
| 32 | 谢谢聆听 | closing |

**看点**：目录共出现 12 次（完整目录 1 次 + 每章章节页与子节页），当前章节/子节标红；红色只出现在目录项与 `{{关键词}}` 两处；表格页都带绿色 take-away 解读条；第 29 页把论文正文数字与表格对上不齐的地方列出来讨论，而不是悄悄取一个。

### 逐页结构 · Agent / Harness 综述（33 页）

这个 deck 没有论文 PDF 可裁，三张配图是脚本自绘的示意图（见 `figs/make_figs.py`）；结构按技能的**综述 / 方向梳理**模板走。

| 页 | 章节 | 内容 | 模板 |
|---:|---|---|---|
| 1 | — | 封面（左栏方向概览图 · `# Agent Harness`） | cover |
| 2 | — | 完整目录 | toc |
| 3–6 | 1 背景：从 LLM 到 Agent | 内核定义 + 三条线演进图 + 范式时间线 | A / D full / B |
| 7–11 | 2 编码智能体 | SWE-bench 四变体 / agentic vs agentless / 系统与分数 | B / A / B |
| 12–21 | 3 **Harness**（核心章） | 定义与 11 项职责 / agent 循环图 / 换 harness 差多少 / 代表实现 / 自动演化 | A / B / D full / D side / B / A |
| 22–27 | 4 评测：分数在测量什么 | 基准图景 / 四类缺陷 / 通过 benchmark ≠ 可合并 | B / A / A |
| 28–30 | 5 对比与思考 | 三条线横向对比 / 值得讨论的问题 | B / A |
| 31–32 | 6 未来方向 | 五个方向 | C |
| 33 | — | 谢谢聆听 | closing |

**看点**：`layout check: no warnings`；85 处红色全部落在「当前目录项」与 `{{关键词}}` 两处；数据账本 `numbers.md` 79 行，PPT 里 36 个关键数字全部可追溯；引用逐条注明来源等级（顶会 / arXiv / 官方 / 预印本），预印本数字单独标注。


### 仓库结构

```
research-ppt-skill/
├── README.md
├── LICENSE                        # MIT
├── demo/                          # 成品 deck（文件名后缀 _by <模型>）
│   ├── GAD_demo_by DeepSeek v4.1 Flash.pptx            # 32 页，同一任务
│   ├── GAD_demo_by GPT 6.1 Sol.pptx                    # 32 页，同一任务
│   └── AI_Agent_and_Harness_Survey_by DeepSeek v4.1 Flash.pptx   # 33 页，综述任务
└── research-report-cn/            # 技能目录（目录名 = skill name）
    ├── SKILL.md                   # 技能主文档：8 步流程 + API 速查 + 视觉规范 + 常见错误
    ├── assets/
    │   ├── rr_lib.js              # 排版库（封面/目录/四种模板/结尾/字体修正/溢出检查）
    │   └── example_deck.js        # 完整示例：两篇图异常检测论文的 32 页组会精读
    └── scripts/
        ├── pdf_figures.py         # PDF 渲染 → 墨迹带定位 → 精确裁图
        └── preview.py             # .pptx → 每页 PNG + 12 页缩略图总览
```

**核心约定**：`rr_lib.js` 是库，**永不修改**；每次汇报只写一个新的 deck 脚本（从 `example_deck.js` 复制改名 `build.js`），只改内容。排版问题靠改内容解决（拆页、删字、换 layout），不靠改库。

### 安装

```bash
git clone https://github.com/codezzzsleep/research-ppt-skill.git
# 把技能目录放进你的 Agent skills 路径：
cp -r research-ppt-skill/research-report-cn ~/.claude/skills/     # Claude 风格
cp -r research-ppt-skill/research-report-cn <你的 skills 目录>/    # 其他 Agent 框架
```

> 本仓库也支持 SSH：`git clone git@github.com:codezzzsleep/research-ppt-skill.git`

依赖：

```bash
npm install -g pptxgenjs        # 生成 pptx（jszip 随其安装）
pip install pillow              # 裁图与缩略图
# poppler-utils（pdftotext / pdftoppm）；LibreOffice（soffice）用于渲染预览，推荐安装
```

### 使用

在支持 Skill 的 Agent 里直接触发：

```
/research-report-cn
```

或直接说：**「帮我把这篇论文做成组会精读 PPT」**（附上 PDF）。

Agent 会先问 4 个问题（是否放单位 logo / 封面左栏放什么 / 汇报时长 / 要点语言），然后自动走完
读材料 → 数据账本 → 大纲 → 裁图 → 写 deck 脚本 → 构建 → 渲染检查 → 交付。

手动使用（不走 Agent 流程）：

```bash
cd research-report-cn
cp assets/rr_lib.js assets/example_deck.js <工作目录>/
cd <工作目录> && mv example_deck.js build.js
NODE_PATH=$(npm root -g) node build.js      # 产出 .pptx；有排版警告时退出码为 2
python3 scripts/preview.py deck.pptx preview --dpi 80
```

### deck 脚本速览

```js
const deck = createDeck({
  title, author,
  badge: { cn: "主题短名", en: "PAPER READING 2026" },
  logos: [], logoOn: "all",
  toc: [ { key, labelCn, labelEn, subs: [ { key, labelCn, labelEn } ] } ],
});

deck.cover({ titleCn, subtitleCn, meta: [["汇 报 人", "..."]] , left: { type: "overview", steps: [...] } });
deck.toc();
deck.section("key");              // 章节目录：整章标红
deck.sub("key", "subKey");        // 子节目录：只有当前子节标红

deck.stampSlide({ title, stamp: ["问题","描述"], claims, details, source, notes });      // A
deck.tableSlide({ title, header, rows, takeaway, source, notes });                        // B
deck.listSlide({ title, items, source, notes });                                          // C
deck.figureSlide({ title, image, layout: "side"|"full", points, takeaway, source });      // D
deck.closing({ footer: "欢迎批评指正" });
deck.save("deck.pptx");
```

完整 API、封面左栏三选一（方向概览图 / 主题纹理 / 单位 logo）、写作规则见 [`SKILL.md`](./research-report-cn/SKILL.md)。

### 适用与不适用

**适用**：组会汇报、论文精读、文献汇报、paper reading、综述 PPT、研究进展汇报，或给出论文 PDF 要求做汇报 PPT。
**不适用**：面向新生的入门科普讲座；商业路演。

---

## License

[MIT](./LICENSE) © 2026 Ci Nie
