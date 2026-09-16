(function () {
  "use strict";

  /* ---------------- Present mode ---------------- */

  function stripAnchors(node) {
    if (node.querySelectorAll) {
      node.querySelectorAll(".anchor-heading").forEach(function (a) {
        a.remove();
      });
    }
    return node;
  }

  function buildSlides(root) {
    var slides = [];
    var current = null;
    Array.prototype.forEach.call(root.children, function (node) {
      if (node.tagName === "H2") {
        current = document.createElement("div");
        current.className = "workshop-slide";
        current.appendChild(stripAnchors(node.cloneNode(true)));
        slides.push(current);
      } else if (current) {
        current.appendChild(stripAnchors(node.cloneNode(true)));
      }
    });
    if (!slides.length && root.children.length) {
      current = document.createElement("div");
      current.className = "workshop-slide";
      Array.prototype.forEach.call(root.children, function (node) {
        current.appendChild(stripAnchors(node.cloneNode(true)));
      });
      slides.push(current);
    }
    return slides;
  }

  function initPresent() {
    var overlay = document.querySelector(".workshop-present-overlay");
    var slidesRoot = document.querySelector(".workshop-slides");
    var btn = document.querySelector(".workshop-present-btn");
    if (!overlay || !slidesRoot || !btn) return;

    var slides = buildSlides(slidesRoot);
    if (!slides.length) return;

    var index = 0;
    var slideEl = overlay.querySelector(".workshop-present-slide");
    var counterEl = overlay.querySelector(".workshop-present-counter");
    var prevBtn = overlay.querySelector(".workshop-present-prev");
    var nextBtn = overlay.querySelector(".workshop-present-next");
    var closeBtn = overlay.querySelector(".workshop-present-close");

    function render() {
      slideEl.innerHTML = "";
      slideEl.appendChild(slides[index].cloneNode(true));
      counterEl.textContent = (index + 1) + " / " + slides.length;
      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === slides.length - 1;
    }

    function open() {
      index = 0;
      overlay.hidden = false;
      document.body.style.overflow = "hidden";
      render();
    }

    function close() {
      overlay.hidden = true;
      document.body.style.overflow = "";
    }

    function next() {
      if (index < slides.length - 1) {
        index++;
        render();
      }
    }

    function prev() {
      if (index > 0) {
        index--;
        render();
      }
    }

    btn.addEventListener("click", open);
    closeBtn.addEventListener("click", close);
    nextBtn.addEventListener("click", next);
    prevBtn.addEventListener("click", prev);

    document.addEventListener("keydown", function (e) {
      if (overlay.hidden) return;
      if (e.key === "Escape") close();
      else if (e.key === "ArrowRight") next();
      else if (e.key === "ArrowLeft") prev();
    });
  }

  /* ---------------- Shared helpers ---------------- */

  function safeParse(str, fallback) {
    try {
      return JSON.parse(str);
    } catch (e) {
      return fallback;
    }
  }

  function escapeHtml(str) {
    var div = document.createElement("div");
    div.textContent = str;
    return div.innerHTML;
  }

  /* ---------------- Lab ---------------- */

  var codeMirrorLoading = null;
  function loadCodeMirror() {
    if (window.CodeMirror) return Promise.resolve();
    if (codeMirrorLoading) return codeMirrorLoading;
    codeMirrorLoading = new Promise(function (resolve, reject) {
      var link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.css";
      document.head.appendChild(link);

      var script = document.createElement("script");
      script.src = "https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.16/codemirror.min.js";
      script.onload = resolve;
      script.onerror = reject;
      document.head.appendChild(script);
    });
    return codeMirrorLoading;
  }

  function initLab(root) {
    var starterEl = root.querySelector(".workshop-lab-starter");
    var starter = starterEl.value;
    var mount = root.querySelector(".workshop-lab-cm-mount");
    var checks = safeParse(root.dataset.checks, []);
    var results = root.querySelector(".workshop-lab-results");
    var checkBtn = root.querySelector(".workshop-lab-check");
    var resetBtn = root.querySelector(".workshop-lab-reset");
    var solutionToggle = root.querySelector(".workshop-lab-solution-toggle");
    var solutionEl = root.querySelector(".workshop-lab-solution");

    var editor;
    if (window.CodeMirror) {
      editor = window.CodeMirror(mount, {
        value: starter,
        lineNumbers: true,
        tabSize: 2,
        viewportMargin: Infinity
      });
    } else {
      // CDN unreachable: fall back to a plain textarea, still fully usable.
      var ta = document.createElement("textarea");
      ta.value = starter;
      ta.rows = 12;
      ta.style.width = "100%";
      ta.style.fontFamily = "monospace";
      mount.appendChild(ta);
      editor = {
        getValue: function () {
          return ta.value;
        },
        setValue: function (v) {
          ta.value = v;
        }
      };
    }

    checkBtn.addEventListener("click", function () {
      var value = editor.getValue();
      var allPass = true;
      var html = "";
      checks.forEach(function (check) {
        var pass;
        if (check.type === "regex") {
          pass = new RegExp(check.test).test(value);
        } else if (check.type === "not_contains") {
          pass = value.indexOf(check.test) === -1;
        } else {
          pass = value.indexOf(check.test) !== -1;
        }
        if (!pass) allPass = false;
        html +=
          '<div class="workshop-lab-result-item ' +
          (pass ? "pass" : "fail") +
          '">' +
          (pass ? "✅ " : "❌ ") +
          escapeHtml(check.message) +
          "</div>";
      });
      html =
        '<div class="workshop-lab-result-banner ' +
        (allPass ? "pass" : "fail") +
        '">' +
        (allPass ? "All checks passed — nice work!" : "Not quite yet — see the checks below.") +
        "</div>" +
        html;
      results.innerHTML = html;
    });

    resetBtn.addEventListener("click", function () {
      editor.setValue(starter);
      results.innerHTML = "";
    });

    solutionToggle.addEventListener("click", function () {
      solutionEl.hidden = !solutionEl.hidden;
      solutionToggle.textContent = solutionEl.hidden ? "Show solution" : "Hide solution";
    });
  }

  function initLabs() {
    var labs = document.querySelectorAll(".workshop-lab");
    if (!labs.length) return;
    loadCodeMirror()
      .then(function () {
        labs.forEach(initLab);
      })
      .catch(function () {
        labs.forEach(initLab);
      });
  }

  /* ---------------- Quiz ---------------- */

  function initQuiz(root) {
    var questions = safeParse(root.dataset.questions, []);
    var container = root.querySelector(".workshop-quiz-questions");
    var scoreEl = root.querySelector(".workshop-quiz-score");
    var answered = 0;
    var correctCount = 0;

    function updateScore() {
      scoreEl.textContent =
        answered === 0
          ? "Answer the questions below to see your score."
          : "Score: " + correctCount + " / " + answered + " answered so far (" + questions.length + " total)";
    }

    questions.forEach(function (q, qIndex) {
      var qEl = document.createElement("div");
      qEl.className = "workshop-quiz-question";

      var textEl = document.createElement("div");
      textEl.className = "workshop-quiz-question-text";
      textEl.textContent = qIndex + 1 + ". " + q.q;
      qEl.appendChild(textEl);

      var explainEl = document.createElement("div");
      explainEl.className = "workshop-quiz-explain";
      explainEl.hidden = true;
      explainEl.textContent = q.explain || "";

      var buttons = [];
      q.choices.forEach(function (choice, cIndex) {
        var btn = document.createElement("button");
        btn.type = "button";
        btn.className = "workshop-quiz-choice";
        btn.textContent = choice;
        btn.addEventListener("click", function () {
          if (btn.disabled) return;
          buttons.forEach(function (b) {
            b.disabled = true;
          });
          var isCorrect = cIndex === q.correct;
          btn.classList.add(isCorrect ? "correct" : "incorrect");
          if (!isCorrect) buttons[q.correct].classList.add("correct");
          explainEl.hidden = false;
          answered++;
          if (isCorrect) correctCount++;
          updateScore();
        });
        buttons.push(btn);
        qEl.appendChild(btn);
      });

      qEl.appendChild(explainEl);
      container.appendChild(qEl);
    });

    updateScore();
  }

  function initQuizzes() {
    document.querySelectorAll(".workshop-quiz").forEach(initQuiz);
  }

  /* ---------------- Init ---------------- */

  document.addEventListener("DOMContentLoaded", function () {
    initPresent();
    initLabs();
    initQuizzes();
  });
})();
