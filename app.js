// ==========================
// app.js - interactive test wiring
// - Wires Start Test and Learn More
// - Preserves scoring logic
// - Keeps single-page behavior (no reload)
// - Event listeners attached after DOM ready
// - Compatible with future WeChat Mini Program migration (avoid window-specific heavy APIs)
// ==========================

// 1. 题库 (unchanged)
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

// 2. 状态变量
var currentIndex = 0;
var answers = [];

// 3. 渲染题目
function renderQuestion() {
  var q = questions[currentIndex];

  var qCounter = document.getElementById('qCounter');
  var questionText = document.getElementById('questionText');
  var answersList = document.getElementById('answersList');
  var progressBar = document.getElementById('progressBar');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');

  if (!q || !questionText || !answersList) return;

  // update counter and progress
  qCounter && (qCounter.textContent = (currentIndex + 1) + ' / ' + questions.length);
  progressBar && (progressBar.style.width = Math.round((currentIndex / questions.length) * 100) + '%');

  // question text
  questionText.textContent = q.text;

  // build answer buttons
  answersList.innerHTML = '';
  for (var i = 1; i <= 5; i++) {
    var btn = document.createElement('button');
    btn.className = 'answer-btn';
    btn.type = 'button';
    btn.textContent = i;
    // closure to capture i
    (function (val) {
      btn.addEventListener('click', function () {
        submitAnswer(val);
      });
    })(i);
    answersList.appendChild(btn);
  }

  // prev visibility
  if (prevBtn) prevBtn.style.display = currentIndex > 0 ? 'inline-block' : 'none';
  if (nextBtn) nextBtn.style.display = 'none';
}

// 4. 记录答案（preserve scoring behavior: sum per archetype, 5 questions each -> max 25）
function submitAnswer(value) {
  var q = questions[currentIndex];
  if (!q) return;

  // store answer at index (so prev can overwrite)
  answers[currentIndex] = { type: q.type, value: value };

  currentIndex++;
  if (currentIndex < questions.length) {
    renderQuestion();
  } else {
    showResult();
  }
}

// 5. 评分系统 (unchanged logic)
function calculateScore(answersArr) {
  var score = { IH: 0, SM: 0, EA: 0, RO: 0, NN: 0, IR: 0 };

  answersArr.forEach(function (a) {
    if (!a) return;
    score[a.type] += a.value;
  });

  Object.keys(score).forEach(function (k) {
    score[k] = Math.round((score[k] / 25) * 100);
  });

  var sorted = Object.entries(score).sort(function (a, b) { return b[1] - a[1]; });

  return { scores: score, primary: sorted[0][0], secondary: sorted[1][0] };
}

// 6. 展示结果到现有 DOM（use ids from index.html）
function showResult() {
  var result = calculateScore(answers);

  var nameMap = {
    IH: "Information Hunter（信息猎手）",
    SM: "System Modeler（系统建模者）",
    EA: "Execution Agent（执行代理）",
    RO: "Resource Optimizer（资源优化者）",
    NN: "Network Node（网络节点）",
    IR: "Intuitive Reactor（直觉反应者）"
  };

  var landingView = document.getElementById('view-landing');
  var testView = document.getElementById('view-test');
  var resultView = document.getElementById('view-result');

  landingView && (landingView.style.display = 'none');
  testView && (testView.style.display = 'none');
  resultView && (resultView.style.display = 'block');

  var primaryName = document.getElementById('primaryName');
  var secondaryName = document.getElementById('secondaryName');
  var profileList = document.getElementById('profileList');
  var strengthsList = document.getElementById('strengthsList');
  var blindspotsList = document.getElementById('blindspotsList');
  var recommendations = document.getElementById('recommendations');

  primaryName && (primaryName.textContent = nameMap[result.primary] || result.primary);
  secondaryName && (secondaryName.textContent = nameMap[result.secondary] || result.secondary);

  if (profileList) {
    profileList.innerHTML = '';
    Object.keys(result.scores).forEach(function (k) {
      var row = document.createElement('div');
      row.className = 'profile-row';

      var label = document.createElement('div');
      label.className = 'profile-label';
      label.textContent = nameMap[k] || k;

      var barWrap = document.createElement('div');
      barWrap.className = 'profile-bar';

      var barInner = document.createElement('div');
      barInner.className = 'profile-bar-inner';
      barInner.style.width = (result.scores[k] || 0) + '%';

      barWrap.appendChild(barInner);

      var percent = document.createElement('div');
      percent.style.width = '48px';
      percent.style.textAlign = 'right';
      percent.style.fontSize = '13px';
      percent.style.color = 'var(--muted)';
      percent.textContent = (result.scores[k] || 0) + '%';

      row.appendChild(label);
      row.appendChild(barWrap);
      row.appendChild(percent);

      profileList.appendChild(row);
    });
  }

  var archetypeInfo = {
    IH: {
      strengths: ['信息敏感，获取速度快', '擅长发现新趋势与机会'],
      blindspots: ['可能信息过载', '易被碎片化信息干扰'],
      rec: '建议搭配结构化工具，筛选与沉淀重要信息，形成可复用的知识结构。'
    },
    SM: {
      strengths: ['擅长结构化与框架化思考', '善于把复杂问题系统化'],
      blindspots: ['可能过度分析', '实施速度可能较慢'],
      rec: '将模型应用到实践场景，产出可验证的假设并迭代。'
    },
    EA: {
      strengths: ['执行力强，喜欢试错', '快速把想法变为行为'],
      blindspots: ['可能忽略长期规划', '容易重复低价值工作'],
      rec: '在快速试错的同时建立最小可复用的流程与反馈环。'
    },
    RO: {
      strengths: ['注重成本与收益', '擅长资源配置与效率化'],
      blindspots: ['可能过于保守', '错失高风险高回报机会'],
      rec: '保留一定探索预算，结合实验数据优化决策。'
    },
    NN: {
      strengths: ['善于传播与连接', '构建影响力与资源网络'],
      blindspots: ['可能关注表层传播效果', '信息可信度把控不足'],
      rec: '增强内容筛选与价值判断，搭建高质量信息的传播链路。'
    },
    IR: {
      strengths: ['直觉敏锐，反应迅速', '在不确定环境能快速决策'],
      blindspots: ['可能忽略数据与证据', '直觉错误成本较高'],
      rec: '结合直觉与短周期验证，形成“直觉→小规模验证→放大”的流程。'
    }
  };

  var info = archetypeInfo[result.primary] || { strengths: [], blindspots: [], rec: '' };

  if (strengthsList) {
    strengthsList.innerHTML = '';
    info.strengths.forEach(function (s) {
      var li = document.createElement('li');
      li.textContent = s;
      strengthsList.appendChild(li);
    });
  }

  if (blindspotsList) {
    blindspotsList.innerHTML = '';
    info.blindspots.forEach(function (b) {
      var li = document.createElement('li');
      li.textContent = b;
      blindspotsList.appendChild(li);
    });
  }

  if (recommendations) {
    recommendations.innerHTML = '<div style="color:var(--muted);">' + info.rec + '</div>';
  }
}

// 7. Learn More: smooth scroll or modal fallback
function showLearnMoreModal() {
  if (document.getElementById('learnMoreModal')) {
    document.getElementById('learnMoreModal').style.display = 'flex';
    return;
  }

  var overlay = document.createElement('div');
  overlay.id = 'learnMoreModal';
  overlay.style.position = 'fixed';
  overlay.style.left = '0';
  overlay.style.top = '0';
  overlay.style.right = '0';
  overlay.style.bottom = '0';
  overlay.style.background = 'rgba(0,0,0,0.4)';
  overlay.style.display = 'flex';
  overlay.style.alignItems = 'center';
  overlay.style.justifyContent = 'center';
  overlay.style.zIndex = '9999';

  var modal = document.createElement('div');
  modal.style.width = '90%';
  modal.style.maxWidth = '720px';
  modal.style.background = 'var(--card-bg, #fff)';
  modal.style.borderRadius = '12px';
  modal.style.padding = '18px';
  modal.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
  modal.style.maxHeight = '80vh';
  modal.style.overflowY = 'auto';

  var title = document.createElement('h3');
  title.textContent = '关于 AI Worldview';
  modal.appendChild(title);

  var p1 = document.createElement('p');
  p1.style.color = 'var(--muted)';
  p1.textContent = 'AI Worldview 是一套用于快速了解个人在信息获取、结构化思考、执行力、资源优化、社交传播与直觉判断等维度上的认知倾向的测评。';
  modal.appendChild(p1);

  var p2 = document.createElement('p');
  p2.style.color = 'var(--muted)';
  p2.textContent = '人类认知原型是基于日常行为与认知偏好抽象出的六类角色，帮助你理解在协作与 AI 赋能环境中的优势与盲点。';
  modal.appendChild(p2);

  var p3 = document.createElement('p');
  p3.style.color = 'var(--muted)';
  p3.textContent = '完成测试后，你将获得：主要与次要认知原型、认知轮廓可视化、优势与盲点摘要，以及 AI 时代的实践建议。';
  modal.appendChild(p3);

  var btnClose = document.createElement('button');
  btnClose.className = 'btn';
  btnClose.textContent = '关闭';
  btnClose.style.marginTop = '12px';
  btnClose.addEventListener('click', function () { overlay.style.display = 'none'; });
  modal.appendChild(btnClose);

  overlay.appendChild(modal);
  document.body.appendChild(overlay);
}

function smoothScrollToIntro() {
  var target = document.getElementById('intro') || document.getElementById('about');
  if (target && target.scrollIntoView) {
    target.scrollIntoView({ behavior: 'smooth' });
  } else {
    showLearnMoreModal();
  }
}

// 8. Attach event listeners after DOM loaded
function attachEventListeners() {
  var startBtn = document.getElementById('startBtn');
  var learnMoreBtn = document.getElementById('learnMoreBtn');
  var prevBtn = document.getElementById('prevBtn');
  var nextBtn = document.getElementById('nextBtn');
  var retakeBtn = document.getElementById('retakeBtn');
  var downloadBtn = document.getElementById('downloadBtn');

  if (startBtn) {
    startBtn.addEventListener('click', function (e) {
      e && e.preventDefault && e.preventDefault();
      currentIndex = 0;
      answers = [];
      var landingView = document.getElementById('view-landing');
      var testView = document.getElementById('view-test');
      landingView && (landingView.style.display = 'none');
      testView && (testView.style.display = 'block');
      // reset scroll to top of test view
      var qBox = document.getElementById('questionBox');
      qBox && qBox.scrollIntoView && qBox.scrollIntoView({ behavior: 'smooth' });
      renderQuestion();
    });
  }

  if (learnMoreBtn) {
    learnMoreBtn.addEventListener('click', function (e) {
      e && e.preventDefault && e.preventDefault();
      smoothScrollToIntro();
    });
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', function () {
      if (currentIndex > 0) {
        currentIndex--;
        // allow user to change previous answer
        renderQuestion();
      }
    });
  }

  if (nextBtn) {
    // optional: skip (treat as neutral = 3)
    nextBtn.addEventListener('click', function () {
      if (currentIndex < questions.length) {
        answers[currentIndex] = { type: questions[currentIndex].type, value: 3 };
        currentIndex++;
        if (currentIndex < questions.length) renderQuestion();
        else showResult();
      }
    });
  }

  if (retakeBtn) {
    retakeBtn.addEventListener('click', function () {
      currentIndex = 0;
      answers = [];
      var landingView = document.getElementById('view-landing');
      var testView = document.getElementById('view-test');
      var resultView = document.getElementById('view-result');
      resultView && (resultView.style.display = 'none');
      testView && (testView.style.display = 'none');
      landingView && (landingView.style.display = 'block');
      landingView && landingView.scrollIntoView && landingView.scrollIntoView({ behavior: 'smooth' });
    });
  }

  if (downloadBtn) {
    // placeholder for export; keep non-blocking and compatible
    downloadBtn.addEventListener('click', function () {
      // export summary (without raw scores) - simple text blob
      var primary = document.getElementById('primaryName') ? document.getElementById('primaryName').textContent : '';
      var secondary = document.getElementById('secondaryName') ? document.getElementById('secondaryName').textContent : '';
      var text = 'AI Worldview 测试摘要\n主要原型: ' + primary + '\n次要原型: ' + secondary + '\n（原始分数未包含）';
      try {
        var blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
        var url = URL.createObjectURL(blob);
        var a = document.createElement('a');
        a.href = url;
        a.download = 'AI_Worldview_Summary.txt';
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      } catch (e) {
        // fallback: show modal with text for copying
        showLearnMoreModal();
      }
    });
  }
}

// initialize listeners when DOM ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', attachEventListeners);
} else {
  attachEventListeners();
}
