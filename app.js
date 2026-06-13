// Single-file app logic for AI Worldview SPA
// - Landing -> Test -> Result
// - Preserves original scoring logic
// - Clean DOM interactions for easier porting to other platforms

// ==========================
// 1. Question bank (unchanged text & ids)
// ==========================
const questions = [
  // IH
  { id: 1, type: "IH", text: "我每天会多次查看新闻或资讯更新" },
  { id: 2, type: "IH", text: "当我听到新信息时，会立刻去搜索相关内容" },
  { id: 3, type: "IH", text: "即使没有明确目的，我也会浏览信息流" },
  { id: 4, type: "IH", text: "我很难忽略未读消息或通知" },
  { id: 5, type: "IH", text: "我会主动寻找最新发生的事情" },

  // SM
  { id: 6, type: "SM", text: "我习惯把复杂问题拆解成结构再理解" },
  { id: 7, type: "SM", text: "我会用框架或模型来理解问题" },
  { id: 8, type: "SM", text: "我更关注事情背后的原因" },
  { id: 9, type: "SM", text: "我喜欢把信息整理成体系" },
  { id: 10, type: "SM", text: "我会寻找问题之间的逻辑关系" },

  // EA
  { id: 11, type: "EA", text: "我倾向于先行动再调整" },
  { id: 12, type: "EA", text: "我不喜欢长时间停留在计划阶段" },
  { id: 13, type: "EA", text: "我通过实践解决问题" },
  { id: 14, type: "EA", text: "有想法我会很快去尝试" },
  { id: 15, type: "EA", text: "我更喜欢做而不是想" },

  // RO
  { id: 16, type: "RO", text: "我会比较多个选择再做决定" },
  { id: 17, type: "RO", text: "我会考虑时间和成本的投入是否值得" },
  { id: 18, type: "RO", text: "我倾向于寻找最优或性价比最高的方案" },
  { id: 19, type: "RO", text: "信息不足时我会延迟决策" },
  { id: 20, type: "RO", text: "我会权衡不同选择的利弊" },

  // NN
  { id: 21, type: "NN", text: "我经常把看到的信息分享给别人" },
  { id: 22, type: "NN", text: "我活跃在多个不同社群中" },
  { id: 23, type: "NN", text: "我会主动连接不同的人或资源" },
  { id: 24, type: "NN", text: "别人有时会通过我获取信息" },
  { id: 25, type: "NN", text: "我喜欢传播有价值的信息" },

  // IR
  { id: 26, type: "IR", text: "我通常会很快形成判断" },
  { id: 27, type: "IR", text: "即使信息不完整，我也能做决定" },
  { id: 28, type: "IR", text: "我经常依赖直觉判断事情" },
  { id: 29, type: "IR", text: "我倾向于快速给出结论" },
  { id: 30, type: "IR", text: "我有时觉得第一感觉是可靠的" }
];

// ==========================
// 2. Application state
// ==========================
let currentIndex = 0; // 0..questions.length-1
let answers = new Array(questions.length).fill(null); // entries: 1..5 or null

// UI elements (will be assigned on DOMContentLoaded)
let el = {};

// Human-readable archetype names (used in result view)
const nameMap = {
  IH: "Information Hunter（信息猎手）",
  SM: "System Modeler（系统建模者）",
  EA: "Execution Agent（执行代理）",
  RO: "Resource Optimizer（资源优化者）",
  NN: "Network Node（网络节点）",
  IR: "Intuitive Reactor（直觉反应者）"
};

// Strengths, blind spots and recommendations per archetype (short templates)
const traits = {
  IH: {
    strengths: [
      "快速捕捉新信息与趋势",
      "保持信息敏感、更新及时"
    ],
    blindspots: [
      "可能信息过载、判断疲劳",
      "倾向于浅尝辄止、缺少深度梳理"
    ],
    recs: [
      "建立信息过滤与验证机制",
      "将信息转换为长期价值（笔记、知识库）"
    ]
  },
  SM: {
    strengths: [
      "擅长结构化、建立模型与系统化思考",
      "善于把杂乱信息整理成有用框架"
    ],
    blindspots: [
      "可能过度依赖抽象模型，忽视实操细节",
      "在不确定情境下行动较慢"
    ],
    recs: [
      "结合快速试错机制来验证模型",
      "把模型与小范围实验结合，降低理论盲点"
    ]
  },
  EA: {
    strengths: [
      "强执行力，行动导向，善于快速落地",
      "能够在不完美信息下推进项目"
    ],
    blindspots: [
      "可能忽略规划与长远成本",
      "易陷入局部最优，缺少系统审视"
    ],
    recs: [
      "为行动设定短中长期检查点",
      "在重要决策上留出回顾时间，补强系统视角"
    ]
  },
  RO: {
    strengths: [
      "注重资源与成本效率，善于权衡",
      "在有限条件下能找到高性价比方案"
    ],
    blindspots: [
      "可能过度谨慎，错失时机",
      "在不确定但高回报的场景中优柔寡断"
    ],
    recs: [
      "对高影响但高不确定的机会做小规模试验",
      "把长期价值纳入成本衡量"
    ]
  },
  NN: {
    strengths: [
      "善于传播与连接资源、人脉",
      "在社群中拥有影响力，推动信息流动"
    ],
    blindspots: [
      "可能过于关注他人反馈或传播效果",
      "容易把注意力分散在社交活动上"
    ],
    recs: [
      "把关系与传播转化为具体协作机会",
      "为社交活动设置明确目标（知识分享/合作）"
    ]
  },
  IR: {
    strengths: [
      "决策快速、直觉敏锐，适合应急场景",
      "能在信息不全时仍推动前进"
    ],
    blindspots: [
      "可能低估验证与数据的重要性",
      "直觉失误时成本较高"
    ],
    recs: [
      "对重要判断建立简单验证步骤",
      "结合数据/反馈周期来校准直觉"
    ]
  }
};

// ==========================
// 3. Calculation (preserve existing logic)
// ==========================
function calculateScore(answersArray) {
  const score = { IH: 0, SM: 0, EA: 0, RO: 0, NN: 0, IR: 0 };

  // accumulate by type
  answersArray.forEach((val, idx) => {
    if (val == null) return;
    const type = questions[idx].type;
    score[type] += val;
  });

  // normalize to 0–100 (same formula as original: sum / 25 * 100)
  Object.keys(score).forEach(k => {
    score[k] = Math.round((score[k] / 25) * 100);
  });

  // sort to pick top two (ties resolved by order)
  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);

  return {
    scores: score,
    primary: sorted[0][0],
    secondary: sorted[1][0]
  };
}

// ==========================
// 4. UI rendering helpers
// ==========================
function showView(name) {
  ["view-landing", "view-test", "view-result"].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    el.style.display = id === name ? "" : "none";
  });
}

function updateProgressUI() {
  const answeredCount = answers.filter(v => v != null).length;
  const percent = Math.round(((currentIndex) / questions.length) * 100);
  const progressBar = el.progressBar;
  if (progressBar) progressBar.style.width = `${percent}%`;

  if (el.qCounter) el.qCounter.textContent = `${currentIndex + 1} / ${questions.length}`;
  // show estimated time remains (very rough)
  if (el.estTime) {
    const left = Math.max(0, questions.length - currentIndex);
    const estMin = Math.ceil((left * 3) / questions.length * 1); // approx
    el.estTime.textContent = `约 ${estMin} 分钟`;
  }
}

function renderQuestionUI() {
  const q = questions[currentIndex];
  el.questionText.textContent = q.text;

  // render answer buttons 1..5
  el.answersList.innerHTML = "";
  for (let v = 1; v <= 5; v++) {
    const btn = document.createElement("button");
    btn.className = "answer-btn";
    btn.textContent = String(v);
    btn.dataset.value = v;
    btn.onclick = () => {
      selectAnswer(v);
    };
    // highlight if selected
    if (answers[currentIndex] === v) {
      btn.style.borderColor = "#999";
      btn.style.background = "#f0f8ff";
    }
    el.answersList.appendChild(btn);
  }

  // Prev/Next display logic
  el.prevBtn.style.display = currentIndex > 0 ? "" : "none";
  el.nextBtn.style.display = answers[currentIndex] == null ? "none" : "";

  updateProgressUI();
}

// Called when user picks an answer
function selectAnswer(value) {
  answers[currentIndex] = value;
  // visually update the buttons (re-render)
  renderQuestionUI();

  // If not last question, automatically advance after small delay for flow (configurable)
  if (currentIndex < questions.length - 1) {
    // give the user a short moment to see feedback, then advance
    setTimeout(() => {
      currentIndex++;
      renderQuestionUI();
    }, 220);
  } else {
    // last question -> show results
    // slight delay for UX
    setTimeout(() => {
      showResultView();
    }, 220);
  }
}

// Move to previous question
function goPrev() {
  if (currentIndex > 0) {
    currentIndex--;
    renderQuestionUI();
  }
}

// Next button (if present)
function goNext() {
  if (answers[currentIndex] != null) {
    if (currentIndex < questions.length - 1) {
      currentIndex++;
      renderQuestionUI();
    } else {
      showResultView();
    }
  }
}

// ==========================
// 5. Result rendering
// ==========================
function showResultView() {
  const result = calculateScore(answers);
  showView("view-result");

  // Names
  const primaryName = nameMap[result.primary] || result.primary;
  const secondaryName = nameMap[result.secondary] || result.secondary;
  el.primaryName.textContent = primaryName;
  el.secondaryName.textContent = secondaryName;

  // Cognitive profile (horizontal bars)
  el.profileList.innerHTML = "";
  Object.entries(result.scores).forEach(([k, v]) => {
    const row = document.createElement("div");
    row.className = "profile-row";

    const label = document.createElement("div");
    label.className = "profile-label";
    label.textContent = nameMap[k] || k;

    const barWrap = document.createElement("div");
    barWrap.className = "profile-bar";

    const barInner = document.createElement("div");
    barInner.className = "profile-bar-inner";
    barInner.style.width = v + "%";

    barWrap.appendChild(barInner);

    const badge = document.createElement("div");
    badge.style.minWidth = "44px";
    badge.style.textAlign = "right";
    badge.textContent = `${v}%`;

    row.appendChild(label);
    row.appendChild(barWrap);
    row.appendChild(badge);

    el.profileList.appendChild(row);
  });

  // Strengths & Blindspots: merge top two archetypes for personalized text
  const topTwo = [result.primary, result.secondary];
  const strengths = new Set();
  const blindspots = new Set();
  const recs = new Set();

  topTwo.forEach(t => {
    const data = traits[t];
    if (!data) return;
    data.strengths.forEach(s => strengths.add(s));
    data.blindspots.forEach(b => blindspots.add(b));
    data.recs.forEach(r => recs.add(r));
  });

  // render lists
  el.strengthsList.innerHTML = "";
  if (strengths.size === 0) {
    el.strengthsList.innerHTML = "<li>你的回答展示了平衡的认知倾向。</li>";
  } else {
    strengths.forEach(s => {
      const li = document.createElement("li");
      li.textContent = s;
      el.strengthsList.appendChild(li);
    });
  }

  el.blindspotsList.innerHTML = "";
  if (blindspots.size === 0) {
    el.blindspotsList.innerHTML = "<li>未检出明显盲点，可在实践中继续观察。</li>";
  } else {
    blindspots.forEach(b => {
      const li = document.createElement("li");
      li.textContent = b;
      el.blindspotsList.appendChild(li);
    });
  }

  // recommendations
  el.recommendations.innerHTML = "";
  recs.forEach(r => {
    const p = document.createElement("div");
    p.textContent = "• " + r;
    el.recommendations.appendChild(p);
  });

  // Note: Raw scores are not shown in the UI (hidden implementation detail)
}

// Retake (reset)
function retake() {
  currentIndex = 0;
  answers = new Array(questions.length).fill(null);
  showView("view-test");
  renderQuestionUI();
}

// Export summary (no raw scores)
function exportSummary() {
  const result = calculateScore(answers);
  const primary = nameMap[result.primary] || result.primary;
  const secondary = nameMap[result.secondary] || result.secondary;

  const lines = [];
  lines.push("AI Worldview 测试摘要");
  lines.push("");
  lines.push(`主要原型: ${primary}`);
  lines.push(`次要原型: ${secondary}`);
  lines.push("");
  lines.push("认知建议:");
  const topTwo = [result.primary, result.secondary];
  const recs = new Set();
  topTwo.forEach(t => {
    const data = traits[t];
    if (!data) return;
    data.recs.forEach(r => recs.add(r));
  });
  recs.forEach(r => lines.push("- " + r));

  const blob = new Blob([lines.join("\n")], { type: "text/plain;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "AI_Worldview_Summary.txt";
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

// ==========================
// 6. Initialization & bindings
// ==========================
document.addEventListener("DOMContentLoaded", () => {
  // cache UI elements
  el = {
    // landing
    startBtn: document.getElementById("startBtn"),
    // test
    qCounter: document.getElementById("qCounter"),
    progressBar: document.getElementById("progressBar"),
    estTime: document.getElementById("estTime"),
    questionText: document.getElementById("questionText"),
    answersList: document.getElementById("answersList"),
    prevBtn: document.getElementById("prevBtn"),
    nextBtn: document.getElementById("nextBtn"),
    // result
    primaryName: document.getElementById("primaryName"),
    secondaryName: document.getElementById("secondaryName"),
    profileList: document.getElementById("profileList"),
    strengthsList: document.getElementById("strengthsList"),
    blindspotsList: document.getElementById("blindspotsList"),
    recommendations: document.getElementById("recommendations"),
    retakeBtn: document.getElementById("retakeBtn"),
    downloadBtn: document.getElementById("downloadBtn"),
  };

  // Bind landing start
  if (el.startBtn) {
    el.startBtn.addEventListener("click", () => {
      showView("view-test");
      currentIndex = 0;
      answers = new Array(questions.length).fill(null);
      renderQuestionUI();
    });
  }

  // Prev / Next
  if (el.prevBtn) el.prevBtn.addEventListener("click", goPrev);
  if (el.nextBtn) el.nextBtn.addEventListener("click", goNext);

  // Retake & download
  if (el.retakeBtn) el.retakeBtn.addEventListener("click", () => {
    // show landing again for clearer UX or jump directly to test
    showView("view-landing");
  });
  if (el.downloadBtn) el.downloadBtn.addEventListener("click", exportSummary);

  // Start at landing
  showView("view-landing");
});
