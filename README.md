# research-ppt-skill

[![License](https://img.shields.io/badge/license-Apache--2.0-blue)](./LICENSE)
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

### 仓库结构

```
research-ppt-skill/
├── README.md
├── LICENSE                        # Apache-2.0
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

[Apache-2.0](./LICENSE) © 2026 Ci Nie
