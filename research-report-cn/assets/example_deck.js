// ============================================================================
// example_deck.js — 完整示例：两篇论文的组会精读（32 页）
//
// 用法：把本文件和 rr_lib.js 复制到工作目录，改名 build.js，只改内容，然后
//   NODE_PATH=$(npm root -g) node build.js
// 本示例的配图来自论文 PDF（用 scripts/pdf_figures.py 裁出，放在 ./figs/）。
// 没有这些图时会画灰色虚线占位框并报警告——这正是“图还没裁”的提示。
// ============================================================================
const path = require("path");
const { createDeck } = require("./rr_lib");
const fig = (f) => path.join(__dirname, "figs", f);

// ---- 开场提问得到的答案（见 SKILL.md 第 1 步）。没问到的保持默认值。
const INTAKE = {
  presenter: "[ 汇报人姓名 ]",        // 用户没给就保留占位，并在交付时提醒
  date: "2026 年 10 月",
  logos: [],                          // 无 logo = []；有 = ["logo_school.png", "logo_lab.png"]（≤2）
  logoOn: "all",                      // "all" 每页右上角 | "cover" 只放封面
  coverLeft: "overview",              // "motif" | "overview" | "logo"
};

const SRC1 = "来源：Liu et al., Rethinking Feature Alignment in Generalist GAD, ICML 2026";
const SRC2 = "来源：Liu et al., Is Real-World Training Data Necessary for Generalist GAD?, arXiv:2610.12167";

const deck = createDeck({
  title: "通用图异常检测论文精读",
  author: "汇报人",
  badge: { cn: "通用图异常检测", en: "PAPER READING 2026" },
  logos: INTAKE.logos,
  logoOn: INTAKE.logoOn,
  toc: [
    { key: "bg", labelCn: "研究背景", labelEn: "Background: Generalist GAD", subs: [] },
    { key: "refi", labelCn: "ReFi-GAD：用关系指纹对齐特征", labelEn: "ICML 2026", subs: [
      { key: "m", labelCn: "动机：负迁移从何而来", labelEn: "Motivation" },
      { key: "x", labelCn: "方法：关系指纹与模型", labelEn: "Method" },
      { key: "e", labelCn: "实验：性能与消融", labelEn: "Experiments" },
    ] },
    { key: "forge", labelCn: "AG-Forge：只用合成数据训练", labelEn: "arXiv 2026", subs: [
      { key: "m", labelCn: "动机：真实数据之困", labelEn: "Motivation" },
      { key: "x", labelCn: "方法：合成流水线与 TS-GGAD", labelEn: "Method" },
      { key: "e", labelCn: "实验：性能与消融", labelEn: "Experiments" },
    ] },
    { key: "disc", labelCn: "对比与思考", labelEn: "Comparison & Discussion", subs: [] },
    { key: "future", labelCn: "未来方向", labelEn: "Future Directions", subs: [] },
  ],
});

// ------------------------------------------------------------------ cover
// 封面左栏三选一。三种写法都给出，按 INTAKE.coverLeft 取用。
const COVER_LEFT = {
  // 主题纹理：必须“编码主题”。这里是 7 节点图的邻接矩阵（对称、对角为 0）：
  // 节点 1–3、5–7 各成一个三角形社区，节点 4 连接所有节点 = 异常枢纽，高亮。
  motif: { type: "motif", lines: [
    "0 1 1 1 0 0 0",
    "1 0 1 1 0 0 0",
    "1 1 0 1 0 0 0",
    "1 1 1 0 1 1 1",
    "0 0 0 1 0 1 1",
    "0 0 0 1 1 0 1",
    "0 0 0 1 1 1 0",
  ], highlight: [3], note: "adjacency matrix · node 4 is the anomalous hub" },
  // 方向概览图：从大方向一路收敛到本次汇报的论文（hi: true 的是本次讲的）
  overview: { type: "overview", title: "方向概览", steps: [
    { label: "传统 GAD", note: "每张图单独训练" },
    { label: "通用 GAD", note: "训练一次，迁移到新图" },
    { label: "两个瓶颈", note: "特征异质 · 数据稀缺" },
    { items: [
      { label: "ReFi-GAD", note: "关系指纹对齐特征", hi: true },
      { label: "AG-Forge", note: "合成数据训练", hi: true },
    ] },
  ] },
  // 单位 logo：大 logo 放白色卡片上
  logo: { type: "logo", path: INTAKE.logos[0] || "placeholder", caption: "" },
};
deck.cover({
  titleCn: "通用图异常检测：\n从特征对齐到合成数据",
  subtitleCn: "两篇 Generalist GAD 论文精读",
  subtitleEn1: "ReFi-GAD · Relational Fingerprints (ICML 2026)",
  subtitleEn2: "AG-Forge + TS-GGAD · Synthetic Training (arXiv 2026)",
  meta: [["汇 报 人", INTAKE.presenter], ["论文作者", "Griffith University & 同济大学"], ["汇报时间", INTAKE.date]],
  left: COVER_LEFT[INTAKE.coverLeft],
  tag: "# Generalist GAD",
});
deck.toc();

// ------------------------------------------------------------------ 1 背景
deck.section("bg");
deck.stampSlide({
  title: "通用图异常检测：问题设定",
  stamp: ["问题", "背景"],
  claims: [
    "Conventional GAD needs {{dataset-specific training}} on every new graph",
    "Generalist GAD trains {{one detector}} on source graphs and deploys it on unseen graphs",
  ],
  details: [
    { cn: "传统 GAD", en: "Dataset-specific GAD", subs: [
      { cn: "每张图单独训练，且需要完整访问目标图" },
      { cn: "隐私敏感、时效要求高的场景难以部署" },
    ] },
    { cn: "通用 GAD", en: "Generalist GAD", subs: [
      { cn: "在多张源图上预训练，目标图上不重训、不微调" },
      { cn: "推理时只给少量带标签的正常 / 异常节点作为支撑集（few-shot support set）" },
    ] },
    { cn: "代表方法", en: "Representative methods", subs: [
      { cn: "ARC (NeurIPS'24) · UNPrompt (IJCAI'25) · AnomalyGFM (KDD'25) · IA-GGAD (NeurIPS'25)" },
    ] },
  ],
  source: SRC1,
  notes: "先讲清楚通用 GAD 和传统 GAD 的区别：训练一次、处处可用；推理时只需要少量带标签的支撑集，不更新参数。",
});
deck.tableSlide({
  title: "现有通用 GAD 方法速览",
  stamp: ["现有", "方法"],
  claims: ["Existing methods differ in the {{transfer mechanism}} but share the same input pipeline"],
  header: ["方法", "发表", "核心思路"],
  colW: [2.4, 2.0, 7.8],
  align: ["center", "center", "left"],
  rows: [
    ["ARC", "NeurIPS'24", "把 GAD 看作少样本问题：上下文学习 + 基于平滑度的特征对齐"],
    ["AnomalyGFM", "KDD'25", "预训练-微调范式，原型对齐，支持零样本推理与提示微调"],
    ["UNPrompt", "IJCAI'25", "统一邻域提示（neighborhood prompt），把异质图信息标准化"],
    ["IA-GGAD", "NeurIPS'25", "学习域不变特征与结构对应关系，提升迁移鲁棒性"],
    [{ text: "共同点：特征对齐依赖 PCA / SVD 线性降维；训练数据只有 1–7 个真实数据集（合计约 9 万节点）", colspan: 3, emph: true, bold: true, align: "left" }],
  ],
  takeaway: "Both papers start from this shared pipeline: PCA aligns dimensions but not semantics (→ ReFi-GAD), and real training data is too scarce to scale (→ AG-Forge).",
  source: "来源：两篇论文的相关工作部分",
  notes: "这一页是两篇论文的共同出发点：第一篇攻击“特征怎么对齐”，第二篇攻击“训练数据从哪来”。",
});

// ------------------------------------------------------------------ 2 ReFi-GAD
deck.section("refi");
deck.sub("refi", "m");
deck.figureSlide({
  title: "现象：预训练反而带来负迁移",
  stamp: ["问题", "描述"],
  claims: ["After source-graph pre-training, existing generalist models show {{negative transfer}} on many unseen graphs"],
  image: fig("refi_fig1.png"),
  caption: "ReFi-GAD Fig. 1：预训练带来的 AUROC 增益（绿 = 正迁移，红 = 负迁移）",
  imageW: 6.2,
  points: [
    { cn: "四个代表方法普遍负迁移", subs: [
      { cn: "14 个数据集中有 7–9 个变差" },
      { cn: "UNPrompt、AnomalyGFM 平均增益为负" },
    ] },
    { cn: "ReFi-GAD：12 个正迁移", subs: [{ cn: "平均增益 +4.67%" }] },
    { cn: "作者的判断", subs: [{ cn: "现有方法的效果主要来自架构设计，而非预训练学到的知识" }] },
  ],
  source: SRC1,
  notes: "图里每一行是一个方法，柱子是预训练相对免训练版本的增益。右侧括号是负迁移:正迁移的数据集个数。",
});
deck.figureSlide({
  title: "根因：PCA 只对齐了维度，没对齐语义",
  stamp: ["核心", "洞察"],
  claims: [
    "PCA matches feature {{dimensionality}}, not feature {{semantics}}",
    "What transfers is the {{architectural prior}}, e.g. neighborhood consistency",
  ],
  image: fig("refi_fig2.png"),
  caption: "ReFi-GAD 论文 Fig. 2：(a) PCA 对齐后的 t-SNE；(b) 免训练版本去掉邻域一致性后的 AUROC",
  imageW: 6.6,
  points: [
    { cn: "(a) 对齐后仍按数据集成簇", subs: [
      { cn: "Cora 是高维稀疏词袋，YelpChi 是低维稠密统计量" },
    ] },
    { cn: "(b) 去掉邻域一致性，性能明显下降", subs: [
      { cn: "三种免训练方法平均 AUROC 下降 9.5–21.5 个点" },
    ] },
    { cn: "由此引出的问题", subs: [{ cn: "能否把异常线索本身直接提取成可迁移特征？" }] },
  ],
  source: SRC1,
  notes: "(b) 的三组柱子：76.56→64.72，74.28→52.81，66.93→57.43。说明可迁移的是“邻域一致性”这类先验，而不是 PCA 后的特征。",
});

deck.sub("refi", "x");
deck.figureSlide({
  title: "ReFi-GAD 整体框架",
  stamp: ["核心", "思想"],
  claims: ["Replace raw features with a 5-dim {{relational fingerprint}}, then learn shared and domain-adaptive representations"],
  image: fig("refi_framework.png"),
  caption: "ReFi-GAD 论文 Fig. 3：关系指纹提取 → 域共享编码 → 域自适应细化 → 异常打分",
  layout: "full",
  source: SRC1,
  notes: "左半部分把任意图的节点都变成 5 维指纹；右半部分是在指纹上学习的检测模型。下面两页分别展开。",
});
deck.tableSlide({
  title: "关系指纹 ReFi：五个维度",
  stamp: ["核心", "原理"],
  claims: ["Each node is described by its {{relation to context}}, not by its raw feature values"],
  header: ["维度", "类型", "计算方式", "异常信号"],
  colW: [3.0, 1.1, 5.0, 3.1],
  align: ["left", "center", "left", "left"],
  rows: [
    ["NP 邻域位置一致性", "上下文", "相似度加权图卷积后，与邻居的平均欧氏距离", "越大越偏离局部社区"],
    ["ND 邻域方向一致性", "上下文", "与邻居的平均余弦相似度", "越小越不同质"],
    ["GD 全局方向一致性", "上下文", "两阶图卷积后，与全图中心的余弦相似度", "越小越像全局离群点"],
    ["d 度", "结构", "邻接矩阵按行求和", "过高（枢纽）或过低（孤立）"],
    ["LC 局部聚类系数", "结构", "2T / [d(d−1)]，T 为所在三角形数", "反映所在社区的紧密程度"],
    [{ text: "统一处理：每一维做排名变换 r(m) = rank(m) / n，消除不同图之间的数值尺度差异", colspan: 4, emph: true, align: "left" }],
  ],
  takeaway: "Rank-normalized relational statistics give every graph the same 5-dim, semantically consistent input space, which is exactly what PCA could not provide.",
  source: SRC1,
  notes: "强调：不管原始特征是词袋还是统计量，算出来的都是“节点和上下文的关系”，所以语义天然一致。",
});
deck.stampSlide({
  title: "模型：域共享编码 + SNR 自适应细化",
  stamp: ["模型", "结构"],
  claims: ["A context-aware {{Transformer}} learns shared patterns; {{SNR weighting}} adapts dimensions to each target graph"],
  details: [
    { cn: "域共享编码", en: "Domain-shared encoding", subs: [
      { cn: "单层 MLP 把 5 维 ReFi 投影到高维，再送入 Transformer" },
      { cn: "注意力掩码：支撑节点互相可见，查询节点只看支撑集和自己" },
    ] },
    { cn: "SNR 域自适应细化", en: "SNR-guided refinement", subs: [
      { cn: "逐维信噪比 s = (h_a − h_n)² / σ_n²，衡量每一维的区分度" },
      { cn: "权重 m = σ(λs + β) 对表示重新加权，突出当前图的关键维度" },
    ] },
    { cn: "打分与训练", en: "Scoring & training", subs: [
      { cn: "与异常 / 正常支撑节点的相似度之差作为异常分数" },
      { cn: "源图上按 episode 训练（BCE 损失），目标图上不更新参数" },
    ] },
  ],
  source: SRC1,
  notes: "SNR 的直觉：异常中心和正常中心差得越远、正常样本方差越小，这一维越有用。",
});

deck.sub("refi", "e");
deck.tableSlide({
  title: "主实验：14 个数据集 AUROC (%)",
  stamp: ["实验", "结果"],
  claims: ["ReFi-GAD ranks first on {{13 of 14}} datasets, +7.39 AUROC over the strongest baseline"],
  header: ["方法", "类型", "Group 1 平均", "Group 2 平均", "14 集平均", "平均排名"],
  colW: [2.3, 2.5, 1.85, 1.85, 1.85, 1.85],
  rows: [
    ["SmoothGNN", "传统 GAD 中最强", "71.66", "67.37", "69.52", "5.43"],
    ["ARC", "通用 GAD", "81.25", "69.71", "75.48", "3.50"],
    ["AnomalyGFM", "通用 GAD", "44.67", "52.27", "48.47", "12.21"],
    ["UNPrompt", "通用 GAD", "67.19", "64.83", "66.01", "5.93"],
    ["IA-GGAD", "通用 GAD", "84.93", "70.44", "77.69", "2.86"],
    ["ReFi-GAD", "本文", "86.76", "83.41", "85.08", "1.14"],
  ],
  oursRow: 5,
  rank: [{ col: 2 }, { col: 3 }, { col: 4 }, { col: 5, better: "low" }],
  takeaway: "The gain is largest on Group 2 (83.41 vs 70.44), the harder transfer direction, so the fingerprint carries knowledge that PCA features cannot; Amazon is the one exception (71.21 vs 82.49).",
  source: SRC1 + "；平均值由论文 Table 1 计算",
  notes: "两组数据集交替做训练集和测试集。Group 2 上提升 13 个点，是最能说明“可迁移”的证据。也要老实说：Amazon 上不如 IA-GGAD。",
});
deck.tableSlide({
  title: "消融与跨域分析",
  stamp: ["消融", "分析"],
  claims: ["Almost all of the gain comes from the {{fingerprint}} itself; SNR refinement adds a small extra"],
  header: ["实验", "设置", "平均 AUROC", "结论"],
  colW: [2.7, 3.6, 2.6, 3.3],
  align: ["center", "left", "center", "left"],
  rows: [
    [{ text: "模块消融（Group 2）", rowspan: 3 }, "w/o R：用 PCA 代替 ReFi", "59.31（−24.10）", "ReFi 是性能的主要来源"],
    ["w/o D：去掉 SNR 细化", "82.53（−0.88）", "细化模块带来小幅增益"],
    ["完整 ReFi-GAD", "83.41", "—"],
    ["单维度消融", "分别去掉 5 维之一", "80.52 – 82.54", "五个维度互补，缺一不可"],
    ["完全跨域（引文域为目标）", "IA-GGAD → ReFi-GAD", "90.55 → 95.32", "跨域场景下优势仍在"],
    ["预训练增益（同上设定）", "现有方法 → ReFi-GAD", "−10.79% ~ −0.11% → +4.15%", "只有 ReFi-GAD 是正迁移"],
  ],
  takeaway: "The fingerprint is the real contribution: swapping it for PCA erases almost the whole gain, while the SNR module only fine-tunes an already transferable representation.",
  source: SRC1 + "；Table 2–4 与 Fig. 6",
  notes: "注意：正文写 w/o R、w/o D 提升 20.39%、0.70%，按表 2 计算是 24.10、0.88，结论不变，引用时以表格为准。",
});

// ------------------------------------------------------------------ 3 AG-Forge
deck.section("forge");
deck.sub("forge", "m");
deck.figureSlide({
  title: "现象：真实训练数据太少",
  stamp: ["问题", "描述"],
  claims: [
    "Real GAD training data is {{scarce}}: 1–7 datasets, about 90k nodes in total",
    "Can a generalist detector be trained on {{synthetic graphs}} only?",
  ],
  image: fig("forge_fig1.png"),
  caption: "AG-Forge 论文 Fig. 1：真实数据（约 9 万节点）vs 合成数据（约 100 万节点）",
  imageW: 5.4,
  points: [
    { cn: "挑战一：合成图要足够逼真", en: "Fidelity", subs: [
      { cn: "真实图的结构、特征、异常模式高度异质且相互耦合" },
    ] },
    { cn: "挑战二：数据放大后，模型成了瓶颈", en: "Capacity", subs: [
      { cn: "现有模型换成合成数据训练，效果持平但不再上涨" },
      { cn: "更大的 TS-GGAD：真实数据 82.9 → 合成数据 86.6" },
    ] },
  ],
  source: SRC2,
  notes: "图里四个现有方法的两根柱子几乎一样高，只有作者的新模型在合成数据上明显更好。这引出两个贡献：数据生成器 + 更强的模型。",
});

deck.sub("forge", "x");
deck.figureSlide({
  title: "AG-Forge + TS-GGAD 整体框架",
  stamp: ["核心", "思想"],
  claims: ["{{AG-Forge}} synthesizes anomalous graphs; {{TS-GGAD}} learns from them with an easy-to-hard curriculum"],
  image: fig("forge_framework.png"),
  caption: "AG-Forge 论文 Fig. 2：上 = 合成流水线；左下 = TS-GGAD 双流模型；右下 = 课程学习",
  layout: "full",
  source: SRC2,
  notes: "上半部分是数据怎么造，下半部分是模型怎么学。",
});
deck.tableSlide({
  title: "AG-Forge：三阶段合成流水线",
  stamp: ["数据", "合成"],
  claims: ["Structure → feature → anomaly, each stage with {{composable}} options and a {{difficulty knob δ}}"],
  header: ["阶段", "可选类型", "做法要点"],
  colW: [1.8, 4.7, 5.7],
  align: ["center", "left", "left"],
  rows: [
    ["① 结构生成", "CS 社区结构 · SF 无标度 · PB 投影二部图 · SW 小世界", "分别用随机块模型、枢纽式增长、二部图投影、环格重连生成；节点数随机采样"],
    ["② 特征生成", "Dense 稠密 · Sparse 稀疏 · Binary 二值", "每个社区一个潜在中心，加节点扰动后随机投影到 D 维，再转成对应类型"],
    ["③ 异常注入", "LD 局部稠密化 · LC 链接集中 · AS 属性抑制 · CD 社区分散 · Mix 混合", "难度系数 δ 控制扰动强度与伪装程度，δ 越大越难检测"],
  ],
  takeaway: "Because every stage is randomized and composable, the generator covers regions of graph space that the handful of real datasets never reach; the paper's t-SNE shows synthetic nodes spreading around and between real ones.",
  source: SRC2 + "；Sec. 3.1 与 Fig. 7",
  notes: "δ 很关键：既用来造不同难度的数据，又被后面的课程学习用来排序。",
});
deck.stampSlide({
  title: "TS-GGAD：双流模型与课程学习",
  stamp: ["模型", "训练"],
  claims: ["Two streams capture {{topological}} and {{semantic}} anomaly evidence; a per-node gate fuses them"],
  details: [
    { cn: "拓扑流", en: "Topology stream", subs: [{ cn: "沿用 ReFi 的 5 维统计量（排名归一化）+ 带注意力掩码的 Transformer" }] },
    { cn: "语义流", en: "Semantic stream", subs: [{ cn: "PCA 统一维度 → 基于地标节点（landmark）的散射归一化 → MLP" }] },
    { cn: "样本级门控", en: "Gated fusion", subs: [{ cn: "用节点的拓扑描述预测两路权重，按节点自适应融合两路异常证据" }] },
    { cn: "课程学习", en: "Curriculum", subs: [{ cn: "按 δ 由易到难加入训练图；按 EMA 损失调整采样概率；节点级 focal loss" }] },
  ],
  source: SRC2,
  notes: "拓扑流基本就是第一篇的 ReFi；新增的是语义流和门控，以及为大规模合成数据设计的课程学习。",
});

deck.sub("forge", "e");
deck.tableSlide({
  title: "主实验：合成数据能否替代真实数据",
  stamp: ["实验", "结果"],
  claims: ["Trained on synthetic data only, TS-GGAD ranks first on {{all 14}} datasets (avg 86.61)"],
  header: ["方法", "真实数据训练", "AG-Forge 合成数据训练", "变化"],
  colW: [3.0, 3.0, 3.6, 2.6],
  rows: [
    ["ARC", "74.82", "74.79", "−0.03"],
    ["UNPrompt", "66.17", "66.11", "−0.06"],
    ["IA-GGAD", "76.92", "76.79", "−0.13"],
    ["ReFi-GAD", "81.22", "81.59", "+0.37"],
    ["TS-GGAD", "82.9（Fig. 1）", "86.61", "+3.7"],
  ],
  oursRow: 4,
  rank: [{ col: 2 }],
  takeaway: "Synthetic data is a drop-in replacement for real data (all four baselines within ±0.4), but only the higher-capacity TS-GGAD turns the extra data into accuracy: +5.39 AUROC over ReFi-GAD.",
  source: SRC2 + "；14 集平均 AUROC，由 Table 1 计算",
  notes: "关键信息：合成数据本身不吃亏，但要有更强的模型才能吃到红利。",
});
deck.tableSlide({
  title: "消融：哪些设计最关键",
  stamp: ["消融", "分析"],
  claims: ["Removing the {{topology stream}} costs 20 points: ReFi-style statistics remain the backbone"],
  header: ["消融对象", "变体", "AUROC", "相对完整模型 (86.61)"],
  colW: [2.6, 4.2, 2.6, 2.8],
  align: ["center", "left", "center", "center"],
  rows: [
    [{ text: "TS-GGAD 组件", rowspan: 4 }, "− 拓扑流", "66.13", "−20.48"],
    ["− 课程学习", "81.18", "−5.43"],
    ["− 语义流", "82.03", "−4.58"],
    ["− 门控（改为简单融合）", "85.64", "−0.97"],
    [{ text: "AG-Forge 策略", rowspan: 3 }, "去掉一种结构生成（4 种之一）", "83.07 – 85.22", "平均 −2.33"],
    ["去掉一种特征生成（3 种之一）", "84.29 – 85.57", "平均 −1.80"],
    ["去掉一种异常注入（4 种之一）", "85.33 – 85.66", "平均 −1.07"],
  ],
  takeaway: "Structural diversity matters more than feature or anomaly diversity, and the ReFi-style topology stream dominates the model: the second paper scales up the first one's idea rather than replacing it.",
  source: SRC2 + "；Fig. 3–4",
  notes: "两篇论文的联系在这一页最清楚：去掉第一篇的指纹（拓扑流），性能掉 20 个点。",
});

// ------------------------------------------------------------------ 4 对比与思考
deck.section("disc");
deck.tableSlide({
  title: "两篇论文对比",
  stamp: ["横向", "对比"],
  claims: ["Same problem, same benchmark, two different {{bottlenecks}}"],
  header: ["维度", "ReFi-GAD（ICML'26）", "AG-Forge + TS-GGAD（arXiv'26）"],
  colW: [2.4, 4.9, 4.9],
  align: ["center", "left", "left"],
  rows: [
    ["瓶颈判断", "特征异质：PCA 只对齐维度", "数据稀缺：真实训练图只有约 9 万节点"],
    ["核心做法", "5 维关系指纹替代原始特征", "合成异常图 + 双流模型 + 课程学习"],
    ["训练数据", "真实图（两组数据集交替训练）", "100% 合成图（约 100 万节点）"],
    ["14 集平均 AUROC", "85.08（支撑集 k = 50）", "86.61（K = 30；同设定下 ReFi 为 81.22）"],
    ["作者自述局限", "依赖带标签支撑集；指纹需人工设计", "缺少系统的合成数据质量评估"],
  ],
  takeaway: "Read together, the papers form one line of work: first make the input transferable, then make the training data scalable, with the 5-dim fingerprint as the thread between them.",
  source: "来源：两篇论文",
  notes: "第二篇里 ReFi-GAD 只有 81.22，比第一篇自报的 85.08 低，原因是支撑集从 50 降到 30。",
});
deck.stampSlide({
  title: "值得讨论的问题",
  stamp: ["问题", "讨论"],
  claims: ["Points to {{double-check}} before building on these results"],
  details: [
    { cn: "同一方法，两篇结果不同", subs: [
      { cn: "ReFi-GAD 14 集平均：论文一 85.08（k = 50），论文二 81.22（K = 30）" },
      { cn: "支撑集大小影响明显，横向比较前要先对齐设定" },
    ] },
    { cn: "正文数字与表格不一致", subs: [
      { cn: "论文一称 w/o R、w/o D 的差距为 20.39%、0.70%；按表 2 计算为 24.10、0.88" },
    ] },
    { cn: "PCA 在论文二里又出现了", subs: [
      { cn: "语义流仍用 PCA + 地标归一化；去掉语义流掉 4.58，说明原始语义信息仍不可缺" },
    ] },
  ],
  source: "来源：根据两篇论文的表格自行核算",
  notes: "这一页是给老师和同学讨论用的，不是挑错：三点都可以作为我们后续工作的切入点。",
});

// ------------------------------------------------------------------ 5 未来方向
deck.section("future");
deck.listSlide({
  title: "未来方向",
  items: [
    { cn: "零样本通用 GAD", en: "Zero-shot generalist GAD", subs: [{ cn: "去掉推理时对带标签支撑集的依赖（论文一作者提出）" }] },
    { cn: "可学习的关系指纹", en: "Learned relational fingerprints", subs: [{ cn: "自动学习或搜索关系属性，替代人工设计的 5 个维度" }] },
    { cn: "合成数据的质量评估与筛选", en: "Synthetic data curation", subs: [{ cn: "给合成图的“有用程度”定标准，指导生成与采样（论文二作者提出）" }] },
    { cn: "继续放大规模", en: "Scaling up", subs: [{ cn: "两篇都观察到“数据大 + 模型大”效果最好，可探索 PFN 式图异常基础模型" }] },
  ],
  source: "来源：两篇论文的结论部分",
});

deck.closing({ footer: "欢迎批评指正" });
deck.save(path.join(__dirname, "通用图异常检测_论文精读.pptx"));
