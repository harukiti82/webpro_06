"use strict";

let total = 0;
let correct = 0;
let streak = 0;
let currentToken = null;

function updateScore() {
  document.getElementById('score').textContent =
    `正解 ${correct} / 出題 ${total}　連続 ${streak}`;
}

async function loadQuestion() {
  document.getElementById('result').innerHTML = '';
  document.getElementById('next-btn').style.display = 'none';
  document.getElementById('setumei').textContent = '読み込み中...';
  document.getElementById('choices').innerHTML = '';

  try {
    const res = await fetch('/pokemonquiz/new');
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    currentToken = data.token;
    document.getElementById('setumei').textContent = data.setumei;

    const choicesEl = document.getElementById('choices');
    data.choices.forEach(choice => {
      const btn = document.createElement('button');
      btn.className = 'quiz-choice';
      btn.textContent = choice.name;
      btn.dataset.id = choice.id;
      btn.addEventListener('click', () => submitAnswer(choice.id));
      choicesEl.appendChild(btn);
    });
  } catch (e) {
    document.getElementById('result').textContent = '通信エラーが発生しました。ページを再読み込みしてください';
  }
}

async function submitAnswer(choiceId) {
  // 連打防止
  document.querySelectorAll('.quiz-choice').forEach(btn => {
    btn.disabled = true;
  });

  try {
    const res = await fetch('/pokemonquiz/answer', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token: currentToken, choiceId })
    });
    const data = await res.json();
    if (data.error) throw new Error(data.error);

    total++;
    if (data.correct) {
      correct++;
      streak++;
    } else {
      streak = 0;
    }
    updateScore();

    // ボタンの色付け
    document.querySelectorAll('.quiz-choice').forEach(btn => {
      if (Number(btn.dataset.id) === data.correctId) {
        btn.classList.add('correct');
      } else if (Number(btn.dataset.id) === choiceId && !data.correct) {
        btn.classList.add('wrong');
      }
    });

    // 結果表示
    const resultEl = document.getElementById('result');
    const verdict = data.correct ? '正解！' : `残念！正解は ${data.correctName}`;
    resultEl.innerHTML = `<p class="quiz-verdict">${verdict}</p>
      <img src="/public/${data.correctImage}" width="200" alt="${data.correctName}">`;

    document.getElementById('next-btn').style.display = 'inline-block';
  } catch (e) {
    document.getElementById('result').textContent = '通信エラーが発生しました。ページを再読み込みしてください';
  }
}

document.getElementById('next-btn').addEventListener('click', loadQuestion);

loadQuestion();
