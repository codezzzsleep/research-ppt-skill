---
name: research-report-cn
description: 按研究组组会风格生成中文学术 PPT（.pptx）：论文精读、文献汇报、组会汇报、综述与研究方向梳理。固定视觉：左上紫色竖条加标题细线、右上主题徽标、紫色“问题/描述”标签块配浅紫要点条、表格下方绿色 take-away 结论条、每章前重复目录且当前章节标红、封面左侧紫色栏（主题纹理 / 方向概览图 / 单位 logo 三选一）。流程包含开场提问（logo、封面样式、时长、语言）、从论文 PDF 裁配图、数据账本核对每个数字、自动排版检查和渲染预览。用户提到组会、论文精读、文献汇报、paper reading、综述 PPT、研究进展汇报，或给出论文 PDF 要求做汇报 PPT 时使用。不用于面向新生的入门科普讲座，也不用于商业路演。
---

# 研究组风格学术汇报 PPT

用 `assets/rr_lib.js`（排版库）+ 一个只写内容的 deck 脚本生成 .pptx。排版、字体、溢出检查、页码、目录高亮都由库负责；你负责**读懂材料、核对数字、组织内容**。

完整示例：`assets/example_deck.js`（两篇图异常检测论文的 32 页组会精读）。动手前先通读一遍，内容密度、语气、每页写法都以它为准。

---

## 第 1 步：开场提问（先问再做）

下面四项会改变产出，而且从材料里推断不出来。**一次问完**：有提问工具（如 AskUserQuestion）就用工具，最多 4 题；没有就用一段文字列出来问。用户已经说过的项不要再问。

| # | 问题 | 选项 | 默认（没人回答时） |
|---|---|---|---|
| 1 | 放不放单位 logo？ | 不放 / 每页右上角 + 封面 / 只放封面 | 不放 |
| 2 | 封面左栏放什么？ | 方向概览图 / 主题纹理 / 单位 logo（仅在有 logo 时提供） | 方向概览图 |
| 3 | 汇报时长？ | 10–15 分钟 / 20–30 分钟 / 40 分钟以上 | 20–30 分钟 |
| 4 | 标签要点和结论条用什么语言？ | 英文（研究组原版风格） / 中文 | 英文 |

- 选了放 logo：请用户上传 logo 文件（透明背景 PNG 最好，最多 2 个，如学校 + 实验室）。用户没上传就按“不放”做，并在交付时说明。
- 汇报人姓名、日期：用户给了就用；没给就填 `[ 汇报人姓名 ]` 占位，交付时提醒。不要为此单独追问。
- 无人值守（定时任务、用户说“你看着办”、问了没人答）：全部取默认值，在交付说明第一句写明用了哪些默认值。

---

## 第 2 步：读材料，建“数据账本”

1. 全文：`pdftotext paper.pdf paper.txt`，通读正文、实验、结论。
2. **表格必须看图核对**：pdftotext 抽出来的表格经常错位。用 `python3 scripts/pdf_figures.py render paper.pdf raw --pages 6-9` 渲染含表格的页，用看图工具读数字。
3. 每篇论文整理出：要解决的问题 / 动机证据（哪张图哪张表）/ 方法组件 / 主结果 / 消融 / 作者自述局限。
4. **数据账本** `numbers.md`：PPT 里出现的每个数字一行，写明数值、出处（Table/Fig/正文）、是否自己计算。
   - 平均值、差值、排名等**一律用 Python 算**，不要心算。
   - 把自己算的结果和论文正文里声称的数字对一遍。对不上的（例如正文说提升 20.39%，按表格算是 24.10）记下来，放进“值得讨论的问题”页，**不要悄悄改成其中一个**。
   - 两篇论文的同一个方法结果不同，通常是设定不同（支撑集大小、数据划分）。查清原因写进对比页。

---

## 第 3 步：定大纲（TOC）

按汇报类型选结构。章节 3–6 个；子节只给需要多页展开的章节，每章 ≤ 3 个子节。

**论文精读（1–3 篇）**——示例脚本就是这个结构：
```
封面 → 完整目录
研究背景：问题设定(A) + 现有方法速览(B)
每篇论文一章，子节 = 动机 / 方法 / 实验
  动机：现象图(D-side) + 根因或洞察(D-side 或 A)
  方法：框架图(D-full) + 核心组件表(B) + 模型细节(A)
  实验：主结果表(B) + 消融/分析表(B)
对比与思考：对比表(B) + 值得讨论的问题(A)
未来方向(C) → 结尾
```

**综述 / 方向梳理**：
```
封面 → 完整目录
背景与问题定义(A)
每条技术路线一章（子节 = 子路线或代表方法）：主流思路(A) + 方法演进表(B) + 代表框架图(D)
横向对比(B) + 开放挑战(A)
未来方向(C) → 结尾
```

**页数**：内容页（不算目录、封面、结尾）≈ 时长（分钟）× 0.6。15 分钟约 9 页，30 分钟约 18 页，45 分钟约 26 页。超了就合并，少了不硬凑。

---

## 第 4 步：裁论文配图

每篇论文至少裁两张：**方法框架图**、**最能说明动机的那张现象图**。主结果用表格页（B）自己重排，不要直接贴论文的大表。

```bash
python3 scripts/pdf_figures.py render paper.pdf raw --pages 1-6         # 300 dpi 渲染
python3 scripts/pdf_figures.py bands raw/p-04.png --x 0.06 0.95 --y 0.03 0.45
#   0.060-0.073  h=42px    <- 页眉（不要）
#   0.085-0.291  h=681px   <- 图本体
#   0.301-0.336  h=116px   <- 图题（不要）
python3 scripts/pdf_figures.py crop raw/p-04.png figs/framework.png --box 0.06 0.080 0.95 0.295
```
- 双栏论文：用 `--x 0.05 0.50` 或 `--x 0.50 0.95` 只扫一栏。
- 裁完**一定打开看**：不能带页眉、图题、正文；坐标轴标签不能被切掉。
- 宽图（宽高比 > 2）用 `layout: "full"`；接近方形的用 `layout: "side"`，右侧配要点。

---

## 第 5 步：写 deck 脚本

```bash
cp assets/rr_lib.js assets/example_deck.js <工作目录>/
cd <工作目录> && mv example_deck.js build.js     # 只改 build.js，绝不改 rr_lib.js
NODE_PATH=$(npm root -g) node build.js           # 找不到 pptxgenjs 就在工作目录 npm i pptxgenjs
```

### API 速查

```js
const deck = createDeck({
  title, author,
  badge: { cn: "主题短名", en: "PAPER READING 2026" },   // 右上角徽标；综述用 "SURVEY 2026"
  logos: [],              // 第 1 步的答案：[] 或 ["logo1.png", "logo2.png"]
  logoOn: "all",          // "all" | "cover"
  toc: [ { key, labelCn, labelEn, subs: [ { key, labelCn, labelEn } ] } ],
});

deck.cover({ titleCn /* 可用 \n 手动断行，≤ 2 行 */, subtitleCn, subtitleEn1, subtitleEn2,
             meta: [["汇 报 人", "..."], ["汇报时间", "..."]] /* ≤ 3 行 */, left: {...}, tag: "# Topic" });
deck.toc();                 // 完整目录（不高亮）
deck.section("key");        // 章节目录：该章及其全部子节标红
deck.sub("key", "subKey");  // 子节目录：只有该子节标红

deck.stampSlide({ title, stamp: ["问题","描述"], claims: [...], details: [...], source, notes });  // 模板 A
deck.tableSlide({ title, stamp?, claims?, header, rows, colW?, align?, oursRow?, rank?, takeaway, source, notes }); // 模板 B
deck.listSlide({ title, items, source, notes });                                                   // 模板 C
deck.figureSlide({ title, stamp?, claims?, image, caption, layout: "side"|"full", imageW?, points?, takeaway?, source, notes }); // 模板 D
deck.closing({ footer: "欢迎批评指正" });
deck.save("xxx.pptx");      // 有警告时退出码为 2
```
- `details` / `points` / `items`：`[{ cn, en?, subs?: [{ cn, en? }] }]`。`en` 以灰色斜体跟在中文后面。
- 表格单元格：字符串，或 `{ text, colspan, rowspan, align, bold, emph }`（`emph` 为浅紫底，用于“共同点”“统一处理”这类总结行）。
- `oursRow: 5`：第 5 行（从 0 数）为本文方法，整行浅紫底加粗。
- `rank: [{ col: 2 }, { col: 5, better: "low" }]`：该列最好值加粗、次好值加下划线（和论文表格惯例一致）。
- `{{关键词}}`：在 stamp 要点里显示为红色加粗，其他位置显示为加粗。
- 每章开头调 `deck.section(key)`；有子节的章，每个子节前再调 `deck.sub(key, subKey)`。

### 封面左栏（三选一，来自第 1 步）

**方向概览图** `left: { type: "overview", title: "方向概览", steps: [...] }`
- 3–5 步，自上而下从大方向收敛到本次讲的工作；一行最多并列 2 个（`{ items: [a, b] }`）。
- 本次汇报的论文标 `hi: true`（白底紫字）。标签 ≤ 8 个汉字，注释 ≤ 12 个汉字。

**主题纹理** `left: { type: "motif", lines: [...], highlight: [行号], note: "一行英文说明" }`
- 纹理**必须编码汇报主题，是一个真实、自洽的实例**，不是随机 0/1：
  - 哈希检索 → 每行是一个样本的 K 位二进制哈希码，相似样本共享多数位；
  - 图学习 → 对称、对角为 0 的邻接矩阵，可高亮异常或目标节点；
  - 推荐系统 → 用户 × 物品的 0/1 交互矩阵；
  - 视觉 → 0–9 灰度值组成的小图案；NLP / 大模型 → token id 序列；时间序列 → 量化后的数值行。
- ≤ 8 行，每行 ≤ 8 个符号，用空格隔开；`note` 用一行说明它是什么。

**单位 logo** `left: { type: "logo", path: "logo.png", caption: "学校 · 实验室" }`：大 logo 放在白色卡片上。只在用户提供了 logo 时可选。

---

## 第 6 步：各页模板怎么选、怎么写

| 页面要做的事 | 模板 | 标签（两行各两字） |
|---|---|---|
| 提出问题、交代背景 | A stampSlide | 问题/描述、问题/背景 |
| 讲核心想法、方法结构 | A stampSlide 或 D-full | 核心/思想、核心/原理、模型/结构、模型/训练 |
| 展示论文里的现象或动机图 | D figureSlide side | 问题/描述、核心/洞察 |
| 框架图 | D figureSlide full | 核心/思想 |
| 方法组件拆解、方法对比、实验结果、消融 | B tableSlide | 实验/结果、消融/分析、方法/演进、横向/对比、数据/合成 |
| 讨论、质疑、局限 | A stampSlide | 问题/讨论 |
| 平铺列举（未来方向等） | C listSlide | 不加标签 |

**写作规则**
- **标签要点 claims**：1–2 条，每条一行（英文约 ≤ 95 字符，中文约 ≤ 45 字），说的是这一页的结论而不是题目；`{{}}` 每条 1–2 个。
- **details**：主条目 2–4 个，每个子条目 1–2 条；子条目写具体事实（数字、机制），不写空话。
- **表格**：≤ 7 行 × ≤ 6 列；数字统一小数位；必须配 `takeaway`。
- **takeaway**：一句话、≤ 2 行，必须是**解读**而不是复述。“A 的 MAP 比 B 高”是复述；“特征学习和二值化耦合得越紧，MAP 提升越明显”是解读。好的 takeaway 也会点出例外（如“唯一的例外是 Amazon”）。
- **source**：每个内容页写来源（论文简称、Table/Fig 编号；自己算的注明“由 Table 1 计算”）。
- **notes**：每个内容页写 1–2 句讲稿：这页要讲出的一句话，加上需要口头交代的注意事项。
- **诚实**：论文里的不一致、方法吃亏的数据集、作者自述的局限都要讲，统一放到对比页和讨论页。
- **语言**：标题、details、表格用中文（专有名词保留英文）；claims 和 takeaway 按第 1 步第 4 题的答案。

---

## 第 7 步：构建、清零警告、渲染检查

1. `node build.js` 必须输出 `layout check: no warnings`。每条 `[WARN] slide N` 都要处理（拆页、删字、换 layout），**不要靠改库来消除警告**。
2. 渲染预览：`python3 scripts/preview.py xxx.pptx preview --dpi 80`，生成 `preview/slide-NN.png` 和 `preview/sheet-K.png`（每张 12 页的缩略图总览）。
3. 逐张看 sheet，逐页检查：
   - [ ] 没有文字溢出、遮挡、被切掉；表格没有压到结论条
   - [ ] 配图清晰，没带页眉或图题，图注 ≤ 2 行
   - [ ] 目录：章节页整章标红，子节页只有当前子节标红
   - [ ] 红色只出现在两处：当前目录项、stamp 要点里的关键词
   - [ ] 封面：标题 ≤ 2 行；左栏和主题对得上；有 logo 时 logo 没压住标题
4. 对照 `numbers.md` 抽查：每个表格至少核对两个数字回原文。
5. 没有 LibreOffice 时跳过第 2–3 条，但要在交付时说明“未做渲染检查”。

## 第 8 步：交付

- 保存 .pptx 到用户能拿到的位置（如 `/mnt/user-data/outputs/`），连同 sheet 缩略图一起发给用户，方便用户按页码提意见。
- 说明不超过 5 行：页数和结构；用了哪些默认值；需要用户补的占位（汇报人姓名、缺的 logo / 配图）；讨论页列出的数据问题。

---

## 视觉规范（库已实现，不要在 deck 脚本里改）

| 元素 | 规范 |
|---|---|
| 版式 | 16:9 宽屏（13.33″ × 7.5″），白底 |
| 主色 | 深紫 `4527A0`：左上竖条、标签块、目录标记、封面左栏 |
| 辅色 | 浅紫 `E8E2F5`（要点条、标题线）；绿 `DCE9D5` / 边框 `9DBE86`（结论条） |
| 红 | `C62828`，**只用于**当前目录项和 stamp 要点关键词 |
| 字体 | 中文宋体，西文 Times New Roman（同一行内自动分开） |
| 标题 | 32 pt 加粗深灰，**不用主色**；放不下时自动缩到 26 pt |
| 正文 | A 页主条目 18 / 子条目 15；C 页 20 / 16；表格 14（必要时自动缩小） |
| 页眉 | 左上紫色竖条 + 标题下浅紫细线 + 右上徽标（有 logo 时徽标移到 logo 下方） |
| 页脚 | 左下来源（10 pt 灰斜体），右下页码 |
| 目录 | 每章前重复出现；带 3 个子节的章节共出现 4 次（章节页 + 3 个子节页） |

## 常见错误

- 改 `rr_lib.js` 去迁就某一页：应该改内容（拆页、删字）。
- 表格没有 takeaway，或者 takeaway 只是复述表格。
- 每页都用 stamp 标签：标签会变成装饰。列举页用 C，图页可以不加标签。
- 心算平均值，或照抄论文正文的“提升 X%”却不核对表格。
- 直接截论文整页或带图题的图；直接贴论文的 14 列大表（要重排成 ≤ 6 列的汇总表）。
- 封面纹理用随机 0/1，和主题无关。
- 颜色值带 `#`（库会报错）。

## 文件

- `assets/rr_lib.js`：排版库（封面、目录、四种内容模板、结尾、字体修正、溢出检查）。
- `assets/example_deck.js`：完整示例 deck 脚本，复制后改内容。
- `scripts/pdf_figures.py`：PDF 渲染、定位、裁图。
- `scripts/preview.py`：pptx → 每页 PNG + 缩略图总览（自动把宋体和 Times New Roman 映射到可用的替代字体）。

## 依赖

```bash
npm install -g pptxgenjs          # jszip 随 pptxgenjs 一起安装
pip install pillow                # 裁图和缩略图
# poppler-utils（pdftotext、pdftoppm）；LibreOffice（soffice，用于预览，推荐安装）
```
