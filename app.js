
// ==========================
// 1. 题库
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
// 2. 状态变量
// ==========================

let currentIndex = 0;
let answers = [];


// ==========================
// 3. 渲染题目
// ==========================

function renderQuestion() {
  const q = questions[currentIndex];

  document.getElementById("questionBox").innerHTML = `
    <div style="font-size:18px; margin-bottom:20px;">
      ${q.text}
    </div>

    <div>
      <button onclick="answer(1)">1</button>
      <button onclick="answer(2)">2</button>
      <button onclick="answer(3)">3</button>
      <button onclick="answer(4)">4</button>
      <button onclick="answer(5)">5</button>
    </div>

    <div style="margin-top:10px; font-size:12px; color:gray;">
      ${currentIndex + 1} / ${questions.length}
    </div>
  `;
}


// ==========================
// 4. 记录答案
// ==========================

function answer(value) {
  const q = questions[currentIndex];

  answers.push({
    type: q.type,
    value: value
  });

  currentIndex++;

  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}


// ==========================
// 5. 评分系统
// ==========================

function calculateScore(answers) {
  const score = {
    IH: 0,
    SM: 0,
    EA: 0,
    RO: 0,
    NN: 0,
    IR: 0
  };

  answers.forEach(a => {
    score[a.type] += a.value;
  });

  // normalize to 0–100
  Object.keys(score).forEach(k => {
    score[k] = Math.round((score[k] / 25) * 100);
  });

  const sorted = Object.entries(score).sort((a, b) => b[1] - a[1]);

  return {
    scores: score,
    primary: sorted[0][0],
    secondary: sorted[1][0]
  };
}


// ==========================
// 6. 结果页面
// ==========================

function showResult() {
  const result = calculateScore(answers);

  const nameMap = {
    IH: "Information Hunter（信息猎手）",
    SM: "System Modeler（系统建模者）",
    EA: "Execution Agent（执行代理）",
    RO: "Resource Optimizer（资源优化者）",
    NN: "Network Node（网络节点）",
    IR: "Intuitive Reactor（直觉反应者）"
  };

  document.getElementById("questionBox").style.display = "none";

  document.getElementById("resultBox").style.display = "block";

  document.getElementById("resultBox").innerHTML = `
    <h2>AI Worldview Result</h2>

    <h1>${nameMap[result.primary]}</h1>

    <p>Secondary: ${nameMap[result.secondary]}</p>

    <hr/>

    <h3>Scores</h3>
    <pre>${JSON.stringify(result.scores, null, 2)}</pre>

    <button onclick="location.reload()">Retake Test</button>
  `;
}


// ==========================
// 7. 初始化
// ==========================

window.onload = function () {
  renderQuestion();
};