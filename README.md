# research-ppt-skill

[![License](https://img.shields.io/badge/license-MIT-green)](./LICENSE)

**上传 1–3 篇论文 PDF，得到一份能直接拿去组会汇报的 `.pptx`。**

这个技能让 AI 通读论文、逐条核对每个数字、从论文 PDF 里裁出配图，并在交付前检查排版，最后给出可编辑的 PowerPoint 文件。适用于论文精读、组会汇报和文献综述。技能本体在 `research-report-cn/` 目录里。

![效果预览](docs/showcase.png)

## 安装

**Claude 网页版 / 桌面版**：先在 Settings → Capabilities 里打开 “Code execution and file creation”；到 [Releases](https://github.com/codezzzsleep/research-ppt-skill/releases) 下载 `research-report-cn.zip`；再在 Customize → Skills → + → Upload a skill 上传这个文件。

**Claude Code**：

```bash
git clone https://github.com/codezzzsleep/research-ppt-skill.git
cp -r research-ppt-skill/research-report-cn ~/.claude/skills/
```

**其他 Agent**：把 `research-report-cn/` 放进它的 skills 目录，并确认它能执行命令。

## 使用

把论文 PDF 交给它，然后说：

> 用 research-report-cn 把这两篇论文做成组会精读 PPT，汇报 20 分钟。

开始前它会问 4 个问题：放不放单位 logo、封面左栏放什么、汇报时长、要点用中文还是英文。不想回答就说“按默认设置直接做”，它会用默认值往下走。

示例成品见 [demo/GAD_demo.pptx](./demo/GAD_demo.pptx)，共 32 页。

工作流程、版式规范和 API 见 [research-report-cn/SKILL.md](./research-report-cn/SKILL.md)。

## 依赖

在 Claude 应用里自带；本地运行需要 `npm install -g pptxgenjs`、`pip install pillow` 和 poppler-utils，LibreOffice 可选，用于生成渲染预览。

## License

MIT © 2026 Ci Nie。示例中引用的论文内容与配图版权归原作者所有。
