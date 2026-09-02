/**
 * DOMコンテンツ読み込み完了後に全スクリプトを実行
 */
document.addEventListener('DOMContentLoaded', () => {

  /* ==================================================
     1. カラーテーマ切り替え & メイン画像のフェード切替
     ================================================== */
  const colorButtons = document.querySelectorAll('.color-btn');
  const mainImage = document.getElementById('mainImage');
  const htmlElement = document.documentElement;

  if (colorButtons.length > 0 && mainImage) {
    colorButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        // アクティブボタンのスタイル切替
        colorButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        // htmlタグの data-theme 属性を変更（CSS変数が切り替わる）
        const theme = btn.dataset.color;
        htmlElement.setAttribute('data-theme', theme);

        // 画像の滑らかなフェード切替処理
        const newImgSrc = btn.dataset.img;
        mainImage.classList.add('fade-out');

        setTimeout(() => {
          mainImage.src = newImgSrc;
          mainImage.classList.remove('fade-out');
        }, 300);
      });
    });
  }

  /* ==================================================
     2. モーダルナビゲーションメニューの開閉制御
     ================================================== */
  const menuOpenBtn = document.getElementById('menuOpen');
  const menuCloseBtn = document.getElementById('menuClose');
  const reviewMenu = document.getElementById('reviewMenu');

  if (menuOpenBtn && menuCloseBtn && reviewMenu) {
    const menuLinks = reviewMenu.querySelectorAll('a');

    // メニューを開く（背景スクロールの固定化）
    menuOpenBtn.addEventListener('click', () => {
      reviewMenu.classList.add('is-active');
      document.body.style.overflow = 'hidden';
    });

    // メニューを閉じる
    const closeMenu = () => {
      reviewMenu.classList.remove('is-active');
      document.body.style.overflow = '';
    };

    menuCloseBtn.addEventListener('click', closeMenu);
    // メニュー内リンククリック時にも自動で閉じる
    menuLinks.forEach(link => link.addEventListener('click', closeMenu));
  }

  /* ==================================================
     3. ページ切り替え処理（SPA風）
     ================================================== */
  const page1 = document.getElementById('page1');
  const page2 = document.getElementById('page2');
  const btnToPage2 = document.getElementById('goToPage2');
  const btnToPage1 = document.getElementById('goToPage1');

  if (btnToPage2 && btnToPage1 && page1 && page2) {
    btnToPage2.addEventListener('click', () => {
      page1.style.display = 'none';
      page2.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    btnToPage1.addEventListener('click', () => {
      page2.style.display = 'none';
      page1.style.display = 'block';
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  /* ==================================================
     4. ボタン効果音＆ページ遷移（アンプスイッチ音）
     ================================================== */
  const ampButtons = document.querySelectorAll('.amp-btn');
  ampButtons.forEach(button => {
    button.addEventListener('click', (e) => {
      const targetUrl = button.getAttribute('href');
      if (targetUrl && targetUrl !== '#' && !button.getAttribute('target')) {
        e.preventDefault();
        playClickSound(); // クリック効果音を再生
        setTimeout(() => { window.location.href = targetUrl; }, 120);
      }
    });
  });

  /* ==================================================
     5. ⚡ 電源スイッチ（真空管ウォームアップ演出付き）
     ================================================== */
  const powerSwitch = document.getElementById('powerSwitch');
  const powerLamp = document.getElementById('powerLamp');

  if (powerSwitch && powerLamp) {
    powerSwitch.addEventListener('click', () => {
      playClickSound();
      powerSwitch.classList.toggle('on');

      if (powerSwitch.classList.contains('on')) {
        // ON時：真空管のように1.2秒かけてゆっくり画面が明るくなる演出
        document.body.style.transition = 'filter 1.2s cubic-bezier(0.25, 1, 0.5, 1)';
        document.body.style.filter = 'none';
        powerLamp.classList.add('active');
      } else {
        // OFF時：一瞬で画面が暗くなる（トーンダウン）演出
        document.body.style.transition = 'filter 0.2s ease-out';
        document.body.style.filter = 'brightness(0.3) grayscale(0.8)';
        powerLamp.classList.remove('active');
      }
    });
  }

  /* ==================================================
     6. 🎛️ 各ノブの連動イベント（赤熱グロー演出付き）
     ================================================== */
  // TREBLEノブ: 画面全体のフォントサイズを無段階調整
  createKnobControl('knobTreble', 'valTreble', -135, 135, (val) => {
    const scale = 0.8 + (val / 10) * 0.4;
    document.documentElement.style.setProperty('--dynamic-font-scale', scale);
  });

  // VOLUMEノブ: 画面全体の明るさ調整 ＋ アンプ奥が真空管の熱で赤く光る演出
  createKnobControl('knobVol', 'valVol', -135, 135, (val) => {
    const bright = 0.5 + (val / 10) * 0.7;
    document.documentElement.style.setProperty('--dynamic-brightness', bright);

    // 音量を上げるほどアンプのグリル奥が真空管の熱で赤橙色に発光
    const ampGrille = document.querySelector('.amp-grille-area');
    if (ampGrille) {
      const glowIntensity = (val / 10) * 20;
      const opacity = (val / 10) * 0.8;
      ampGrille.style.boxShadow = `inset 0 0 ${glowIntensity + 10}px rgba(255, 90, 0, ${opacity})`;
    }
  });

  // BASSノブ: 画面周囲の影（ビネット感）の強さを調整
  createKnobControl('knobBass', 'valBass', -135, 135, (val) => {
    const shadowIntensity = val / 10;
    document.body.style.boxShadow = `inset 0 0 ${shadowIntensity * 100}px rgba(0,0,0,0.9)`;
  });

  /* ==================================================
     7. 🔇 ANC（ノイズキャンセリング）体験シミュレーター
     ================================================== */
  const ancBtn = document.getElementById('ancToggle');
  const ancStatus = document.getElementById('ancStatus');
  let ancActive = false;

  if (ancBtn && ancStatus) {
    ancBtn.addEventListener('click', () => {
      playClickSound();
      ancActive = !ancActive;

      if (ancActive) {
        ancBtn.textContent = 'ANC：ON（静寂モード）';
        ancBtn.style.backgroundColor = '#4caf50';
        ancBtn.style.color = '#ffffff';
        ancStatus.textContent = '周囲の暗騒音（エアコン音・街の雑音）を消音中...';
        ancStatus.style.color = '#4caf50';
      } else {
        ancBtn.textContent = 'ANC：OFF（外音取り込み）';
        ancBtn.style.backgroundColor = 'var(--accent-gold)';
        ancBtn.style.color = '#000000';
        ancStatus.textContent = '外音取り込み中：周囲の音が自然に聞こえます';
        ancStatus.style.color = 'var(--text-color)';
      }
    });
  }

});

/* ==================================================
   🔊 共通ヘルパー関数 (Web Audio API & ノブ操作制御)
   ================================================== */

/**
 * Web Audio APIを使用したリアルタイムクリック効果音生成
 */
function playClickSound() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    if (ctx.state === 'suspended') {
      ctx.resume(); // ブラウザの自動再生制御に対応
    }
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    
    osc.type = 'triangle'; // アンプのトグルスイッチに似た硬い音色
    osc.frequency.setValueAtTime(1200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(80, ctx.currentTime + 0.03);
    
    gain.gain.setValueAtTime(0.4, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.03);
    
    osc.connect(gain);
    gain.connect(ctx.destination);
    
    osc.start();
    osc.stop(ctx.currentTime + 0.03);
  } catch (e) {
    // 古いブラウザ用のフォールバック（エラー回避）
  }
}

/**
 * 丸型アンプノブのドラッグ・タッチ・キーボード操作制御関数
 */
function createKnobControl(knobId, valId, minRot = -135, maxRot = 135, onChange) {
  const knob = document.getElementById(knobId);
  const valDisplay = document.getElementById(valId);
  if (!knob) return;

  let isDragging = false;
  let startY = 0;
  let currentRotation = 0;
  let lastSoundStep = 5;

  // 初期値の読み込みと角度計算
  const initialVal = parseFloat(knob.getAttribute('data-value') || 5);
  currentRotation = ((initialVal - 0) / 10) * (maxRot - minRot) + minRot;
  knob.style.transform = `rotate(${currentRotation}deg)`;

  // ノブの回転更新と画面反映処理
  function setRotation(deg) {
    currentRotation = Math.min(Math.max(deg, minRot), maxRot);
    knob.style.transform = `rotate(${currentRotation}deg)`;

    const normalizedVal = ((currentRotation - minRot) / (maxRot - minRot)) * 10;
    if (valDisplay) valDisplay.textContent = normalizedVal.toFixed(1);

    // 1.0刻みでカリカリと軽い操作音を再生
    const currentStep = Math.floor(normalizedVal);
    if (currentStep !== lastSoundStep) {
      playClickSound();
      lastSoundStep = currentStep;
    }

    if (onChange) onChange(normalizedVal);
  }

  function updateKnob(deltaY) {
    setRotation(currentRotation - deltaY * 1.2);
  }

  // ドラッグ/タッチ開始
  function onStart(e) {
    isDragging = true;
    startY = e.clientY || (e.touches && e.touches[0].clientY);
    playClickSound();
    knob.classList.add('is-dragging');
    document.body.style.touchAction = 'none'; // 操作中の画面スクロール防止
  }

  // ドラッグ/タッチ移動
  function onMove(e) {
    if (!isDragging) return;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY);
    const deltaY = clientY - startY;
    updateKnob(deltaY);
    startY = clientY;
  }

  // ドラッグ/タッチ終了
  function onEnd() {
    if (!isDragging) return;
    isDragging = false;
    knob.classList.remove('is-dragging');
    document.body.style.touchAction = '';
  }

  // マウス/タッチのイベントリスナー設定
  knob.addEventListener('mousedown', onStart);
  window.addEventListener('mousemove', onMove);
  window.addEventListener('mouseup', onEnd);

  knob.addEventListener('touchstart', onStart, { passive: true });
  window.addEventListener('touchmove', onMove, { passive: true });
  window.addEventListener('touchend', onEnd);

  // アクセシビリティ対応：キーボード矢印キー操作
  knob.addEventListener('keydown', (e) => {
    const stepDeg = (maxRot - minRot) / 10;
    if (e.key === 'ArrowUp' || e.key === 'ArrowRight') {
      e.preventDefault();
      setRotation(currentRotation + stepDeg * 0.5);
    } else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') {
      e.preventDefault();
      setRotation(currentRotation - stepDeg * 0.5);
    }
  });
  isAncOn = !isAncOn;

      if (isAncOn) {
        ancFilter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
      } else {
        ancFilter.frequency.exponentialRampToValueAtTime(2500, audioCtx.currentTime + 0.3);
      }
    }
    isAncOn = !isAncOn;

      if (isAncOn) {
        ancFilter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
      } else {
        ancFilter.frequency.exponentialRampToValueAtTime(2500, audioCtx.currentTime + 0.3);
      }
      isAncOn = !isAncOn;

      if (isAncOn) {
        ancFilter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
      } else {
        ancFilter.frequency.exponentialRampToValueAtTime(2500, audioCtx.currentTime + 0.3);
      }isAncOn = !isAncOn;

      if (isAncOn) {
        ancFilter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
      } else {
        ancFilter.frequency.exponentialRampToValueAtTime(2500, audioCtx.currentTime + 0.3);
      }
      isAncOn = !isAncOn;

      if (isAncOn) {
        ancFilter.frequency.exponentialRampToValueAtTime(80, audioCtx.currentTime + 0.3);
      } else {
        ancFilter.frequency.exponentialRampToValueAtTime(2500, audioCtx.currentTime + 0.3);
      }
// ==================================================
// 🎨 テーマ切り替え＆メイン画像切り替え
// ==================================================
const themeToggleBtn = document.getElementById('themeToggleBtn');
const htmlElement = document.documentElement;
const mainImage = document.getElementById('mainImage');
const interactiveCabinet = document.querySelector('.interactive-cabinet');

const images = {
  black: 'images/amp-black.jpg', // ご自身の画像パスに変更してください
  cream: 'images/amp-cream.jpg'
};

if (themeToggleBtn) {
  themeToggleBtn.addEventListener('click', () => {
    if (interactiveCabinet) {
      interactiveCabinet.classList.add('amp-flash');
      setTimeout(() => interactiveCabinet.classList.remove('amp-flash'), 300);
    }

    const currentTheme = htmlElement.getAttribute('data-theme') || 'black';
    const newTheme = currentTheme === 'black' ? 'cream' : 'black';
    
    htmlElement.setAttribute('data-theme', newTheme);

    if (mainImage && images[newTheme]) {
      mainImage.classList.add('fade-out');
      setTimeout(() => {
        mainImage.src = images[newTheme];
        mainImage.classList.remove('fade-out');
      }, 300);
    }
  });
}

// ==================================================
// 🎛️ インタラクティブ・ノブ ドラッグ＆キーボード操作
// ==================================================
function setupKnob(knobId, tooltipId, cssVariable, unit, minVal, maxVal, defaultVal) {
  const knob = document.getElementById(knobId);
  const tooltip = document.getElementById(tooltipId);
  if (!knob || !tooltip) return;

  const wrapper = knob.closest('.knob-wrapper');
  let value = defaultVal;
  let isDragging = false;
  let startX = 0;
  let startValue = defaultVal;

  function updateValue(newValue) {
    value = Math.min(maxVal, Math.max(minVal, newValue));
    const rotation = ((value - minVal) / (maxVal - minVal)) * 270 - 135;
    knob.style.transform = `rotate(${rotation}deg)`;
    
    const scaleVal = value / 100;
    document.documentElement.style.setProperty(cssVariable, scaleVal);
    
    tooltip.textContent = `${Math.round(value)}${unit}`;
    knob.setAttribute('aria-valuenow', Math.round(value));
  }

  // 初期位置の適用
  updateValue(defaultVal);

  // ポインター (マウス / タッチ) ドラッグ処理
  knob.addEventListener('pointerdown', (e) => {
    isDragging = true;
    startX = e.clientX;
    startValue = value;
    knob.setPointerCapture(e.pointerId);
    if (wrapper) wrapper.classList.add('is-dragging');
  });

  knob.addEventListener('pointermove', (e) => {
    if (!isDragging) return;
    const deltaX = e.clientX - startX;
    const sensitivity = 0.5;
    updateValue(startValue + deltaX * sensitivity);
  });

  const stopDrag = (e) => {
    if (isDragging) {
      isDragging = false;
      try { knob.releasePointerCapture(e.pointerId); } catch(err) {}
      if (wrapper) wrapper.classList.remove('is-dragging');
    }
  };

  knob.addEventListener('pointerup', stopDrag);
  knob.addEventListener('pointercancel', stopDrag);

  // キーボード操作アクセシビリティ (矢印キー)
  knob.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowRight' || e.key === 'ArrowUp') {
      e.preventDefault();
      updateValue(value + 2);
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') {
      e.preventDefault();
      updateValue(value - 2);
    }
  });
}

// ノブの初期化設定 (FONT: 50%-150%, BRIGHT: 50%-150%)
setupKnob('knobFont', 'fontTooltip', '--dynamic-font-scale', '%', 50, 150, 100);
setupKnob('knobBright', 'brightTooltip', '--dynamic-brightness', '%', 50, 150, 100);

// ==================================================
// ⚡ ANC疑似体験デモのボタン切り替えイベント
// ==================================================
const ancToggleBtn = document.getElementById('ancToggleBtn');
const ancStatusText = document.getElementById('ancStatusText');
let isAncOn = false;

if (ancToggleBtn && ancStatusText) {
  ancToggleBtn.addEventListener('click', () => {
    isAncOn = !isAncOn;
    if (isAncOn) {
      ancStatusText.textContent = '🎧 ANC ON Mode (Noise Blocked)';
      ancStatusText.style.color = '#4caf50';
      ancToggleBtn.textContent = 'Turn ANC OFF';
    } else {
      ancStatusText.textContent = '🔊 Train Noise Mode (Low-Frequency Noise Active)';
      ancStatusText.style.color = 'var(--text-color, #333)';
      ancToggleBtn.textContent = 'Turn ANC ON';
    }
  });
}  