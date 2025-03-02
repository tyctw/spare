// Vocational groups data definition
const vocationalGroups = {
  '機械群': ['機械科', '鑄造科', '板金科', '機械木模科', '配管科', '模具科', '機電科', '製圖科', '生物產業機電科', '電腦機械製圖科'],
  '動力機械群': ['汽車科', '重機科', '飛機修護科', '動力機械科', '農業機械科', '軌道車輛科'],
  '電機與電子群': ['資訊科', '電子科', '控制科', '電機科', '冷凍空調科', '航空電子科', '電機空調科'],
  '化工群': ['化工科', '紡織科', '染整科'],
  '土木與建築群': ['建築科', '土木科', '消防工程科', '空間測繪科'],
  '商業與管理群': ['商業經營科', '國際貿易科', '會計事務科', '資料處理科', '不動產事務科', '電子商務科', '流通管理科', '農產行銷科', '航運管理科'],
  '外語群': ['應用外語科（英文組）', '應用外語科（日文組）'],
  '設計群': ['家具木工科', '美工科', '陶瓷工程科', '室內空間設計科', '圖文傳播科', '金屬工藝科', '家具設計科', '廣告設計科', '多媒體設計科', '多媒體應用科', '室內設計科'],
  '農業群': ['農場經營科', '園藝科', '森林科', '野生動物保育科', '造園科', '畜產保健科'],
  '食品群': ['食品加工科', '食品科', '水產食品科', '烘焙科'],
  '家政群': ['家政科', '服裝科', '幼兒保育科', '美容科', '時尚模特兒科', '流行服飾科', '時尚造型科', '照顧服務科'],
  '餐旅群': ['觀光事業科', '餐飲管理科'],
  '水產群': ['漁業科', '水產養殖科'],
  '海事群': ['輪機科', '航海科'],
  '藝術群': ['戲劇科', '音樂科', '舞蹈科', '美術科', '影劇科', '西樂科', '國樂科', '電影電視科', '表演藝術科', '多媒體動畫科', '時尚工藝科']
};

// Utility functions and event handlers

function toggleVocationalGroup() {
  const schoolType = document.getElementById('schoolType').value;
  const vocationalGroupContainer = document.getElementById('vocationalGroupContainer');
  const vocationalGroup = document.getElementById('vocationalGroup');

  if (schoolType === '職業類科') {
    vocationalGroupContainer.style.display = 'block';
  } else {
    vocationalGroupContainer.style.display = 'none';
    vocationalGroup.value = 'all';
  }
}

function toggleInstructions() {
  showInstructions();
}

function showInstructions() {
  var modal = document.getElementById('instructionsModal');
  modal.style.display = 'block';
}

function closeInstructions() {
  var modal = document.getElementById('instructionsModal');
  modal.style.display = 'none';
}

function showDisclaimer() {
  var modal = document.getElementById('disclaimerModal');
  modal.style.display = 'block';
}

function closeDisclaimer() {
  var modal = document.getElementById('disclaimerModal');
  modal.style.display = 'none';
}

function showInvitationValidationAnimation() {
  const invitationGroup = document.getElementById('invitationCode').closest('.form-group');
  if (!invitationGroup) return;
  invitationGroup.style.position = 'relative';
  const overlay = document.createElement('div');
  overlay.id = 'invitationValidationOverlay';
  overlay.className = 'validation-overlay';
  overlay.innerHTML = `
    <div class="validation-spinner"></div>
    <div class="validation-text">驗證邀請碼中</div>
    <div style="font-size: 0.8rem; color: rgba(255,255,255,0.9); margin-top: 5px; text-align: center;">
      <span style="display: inline-block; animation: pulse 1.5s infinite;">連接到伺服器...</span>
    </div>
    <div class="validation-progress" style="width: 80%; height: 4px; background: rgba(255,255,255,0.3); border-radius: 2px; overflow: hidden; margin-top: 10px;">
      <div style="height: 100%; width: 0%; background: white; border-radius: 2px; animation: progressMove 2s cubic-bezier(0.1, 0.42, 0.85, 1) forwards;"></div>
    </div>
  `;
  invitationGroup.appendChild(overlay);
  
  // Add success animation sequence with enhanced visuals
  setTimeout(() => {
    if (overlay && overlay.parentNode) {
      const statusText = overlay.querySelector('.validation-text');
      const subText = overlay.querySelector('div[style*="font-size: 0.8rem"]');
      if (statusText) {
        statusText.innerHTML = '驗證成功 <i class="fas fa-check" style="margin-left: 5px; font-size: 0.8em;"></i>';
        statusText.style.animation = 'pulse 1s infinite';
      }
      if (subText) {
        subText.innerHTML = '<span style="color: #e9ffc2;">邀請碼有效</span>';
        subText.style.animation = 'fadeInUp 0.5s ease-out forwards';
      }
      
      const checkmark = document.createElement('div');
      checkmark.innerHTML = '<i class="fas fa-check-circle" style="color: #e9ffc2; font-size: 3rem; filter: drop-shadow(0 0 10px rgba(255,255,255,0.5)); animation: popIn 0.5s cubic-bezier(0.26, 1.56, 0.44, 1);"></i>';
      const spinner = overlay.querySelector('.validation-spinner');
      if (spinner && spinner.parentNode) {
        spinner.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => {
          spinner.parentNode.replaceChild(checkmark, spinner);
          
          // Add celebration particles effect
          createParticles(overlay);
        }, 300);
      }
      
      // Style the progress bar to complete
      const progressBar = overlay.querySelector('.validation-progress div');
      if (progressBar) {
        progressBar.style.width = '100%';
        progressBar.style.background = '#e9ffc2';
        progressBar.style.boxShadow = '0 0 8px rgba(233, 255, 194, 0.8)';
      }
    }
  }, 1500);
}

function createParticles(container) {
  for (let i = 0; i < 20; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: 8px;
      height: 8px;
      background: white;
      border-radius: 50%;
      pointer-events: none;
      opacity: 0;
    `;
    container.appendChild(particle);
    
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const duration = 0.5 + Math.random() * 1;
    const delay = Math.random() * 0.3;
    
    particle.animate([
      { transform: 'translate(-50%, -50%)', opacity: 1 },
      { transform: `translate(${x - 50}%, ${y - 50}%) scale(0)`, opacity: 0 }
    ], {
      duration: duration * 1000,
      delay: delay * 1000,
      easing: 'cubic-bezier(0.1, 0.5, 0.9, 0.1)'
    });
    
    // Remove particle after animation
    setTimeout(() => particle.remove(), (duration + delay) * 1000);
  }
}

function hideInvitationValidationAnimation() {
  const overlay = document.getElementById('invitationValidationOverlay');
  if (overlay) {
    overlay.style.animation = 'fadeOut 0.5s ease';
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }
}

function showLoading() {
  const loadingOverlay = document.createElement('div');
  loadingOverlay.className = 'loading-overlay';
  
  loadingOverlay.innerHTML = `
    <div class="loading-spinner-container">
      <div class="loading-spinner"></div>
      <div class="loading-text">分析中，請稍候...</div>
      <div class="loading-progress"></div>
      <div class="loading-steps">
        <div class="loading-step" data-step="1">
          <i class="fas fa-check-circle"></i>
          <span>驗證邀請碼</span>
        </div>
        <div class="loading-step" data-step="2">
          <i class="fas fa-check-circle"></i>
          <span>計算總積分</span>
        </div>
        <div class="loading-step" data-step="3">
          <i class="fas fa-check-circle"></i>
          <span>分析落點區間</span>
        </div>
        <div class="loading-step" data-step="4">
          <i class="fas fa-check-circle"></i>
          <span>生成分析報告</span>
        </div>
      </div>
    </div>
  `;

  document.body.appendChild(loadingOverlay);
  
  requestAnimationFrame(() => {
    loadingOverlay.style.display = 'flex';
    simulateLoadingSteps();
  });
}

function simulateLoadingSteps() {
  const steps = document.querySelectorAll('.loading-step');
  const stepDelay = 500; // Time between each step

  steps.forEach((step, index) => {
    setTimeout(() => {
      step.classList.add('active');
    }, stepDelay * (index + 1));
  });
}

function hideLoading() {
  const loadingOverlay = document.querySelector('.loading-overlay');
  if (loadingOverlay) {
    loadingOverlay.style.opacity = '0';
    loadingOverlay.style.transition = 'opacity 0.3s ease';
    
    setTimeout(() => {
      loadingOverlay.remove();
    }, 300);
  }
}

async function logUserActivity(action, details = {}) {
  try {
    const userAgent = navigator.userAgent;
    const screenResolution = `${window.screen.width}x${window.screen.height}`;
    const viewportSize = `${window.innerWidth}x${window.innerHeight}`;
    const timestamp = new Date().toISOString();
    const language = navigator.language;
    const platform = navigator.platform;
    const timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const colorDepth = window.screen.colorDepth;
    const hardwareConcurrency = navigator.hardwareConcurrency || null;
    const connection = navigator.connection ? {
      effectiveType: navigator.connection.effectiveType,
      downlink: navigator.connection.downlink,
      rtt: navigator.connection.rtt,
      saveData: navigator.connection.saveData
    } : {};

    const data = {
      timestamp,
      action,
      userAgent,
      screenResolution,
      viewportSize,
      darkMode: document.body.classList.contains('dark-mode'),
      language,
      platform,
      timeZone,
      colorDepth,
      hardwareConcurrency,
      connection,
      ...details
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbyKpf-7eCHizQsPNYAgtV7MlVKd09pRi2PF0G4QhKUls3OaKd5vdp1e7ASk-ta8w1Bo/exec', {
      method: 'POST',
      body: JSON.stringify(data)
    });

    if (!response.ok) {
      throw new Error('Failed to log activity');
    }
  } catch (error) {
    console.error('Error logging activity:', error);
  }
}

async function analyzeScores() {
  const analyzeButton = document.getElementById('analyzeButton');
  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
  }

  try {
    const invitationCode = document.getElementById('invitationCode').value;
    if (!invitationCode.trim()) {
      alert("請填寫邀請碼");
      return;
    }
    
    // Validate invitation code with animation
    showInvitationValidationAnimation();
    let validationResponse;
    try {
      validationResponse = await fetch('https://script.google.com/a/macros/jiooq.com/s/AKfycbxGOW2caEmqW51hNmTe3Kq24D-UzfhKuhtS3xMP0OB9WNCjxKvwSGU5W4VnszDjfdZw/exec', {
        method: 'POST',
        body: JSON.stringify({
          action: 'validateInvitationCode',
          invitationCode: invitationCode
        })
      });
    } catch (error) {
      hideInvitationValidationAnimation();
      throw error;
    }
    hideInvitationValidationAnimation();

    if (!validationResponse.ok) {
      throw new Error('邀請碼驗證失敗');
    }

    const validationResult = await validationResponse.json();
    if (!validationResult.valid) {
      alert('邀請碼錯誤或已過期，請確認最新的邀請碼。');
      return;
    }
    
    showLoading();

    const schoolOwnership = document.getElementById('schoolOwnership').value;
    const schoolType = document.getElementById('schoolType').value;
    const vocationalGroup = document.getElementById('vocationalGroup').value;
    const analysisIdentity = document.getElementById('analysisIdentity').value;
    
    // Get selected region from radio buttons
    const analysisAreaRadio = document.querySelector('input[name="analysisArea"]:checked');
    const analysisArea = analysisAreaRadio ? analysisAreaRadio.value : '';

    // Updated fields to check
    const fields = ['analysisIdentity', 'chinese', 'english', 'math', 'science', 'social', 'composition'];
    let isAllFieldsFilled = true;
    let emptyFields = [];

    fields.forEach(field => {
      const value = document.getElementById(field).value;
      if (value === "") {
        isAllFieldsFilled = false;
        emptyFields.push(field);
      }
    });
    
    // Check if a region is selected
    if (!analysisArea) {
      isAllFieldsFilled = false;
      emptyFields.push('analysisArea');
    }

    if (!isAllFieldsFilled) {
      let errorMessage = '請填寫以下欄位會考成績：\n';
      const fieldNames = {
        'analysisArea': '請選擇地區',
        'analysisIdentity': '請選擇身份',
        'chinese': '國文',
        'english': '英文',
        'math': '數學',
        'science': '自然',
        'social': '社會',
        'composition': '作文'
      };
      emptyFields.forEach(field => {
        errorMessage += `- ${fieldNames[field]}\n`;
      });
      alert(errorMessage);
      return;
    }
    
    await logUserActivity('analyze_scores', {
      scores: {
        chinese: document.getElementById('chinese').value,
        english: document.getElementById('english').value,
        math: document.getElementById('math').value,
        science: document.getElementById('science').value,
        social: document.getElementById('social').value,
        composition: document.getElementById('composition').value
      },
      filters: {
        schoolOwnership,
        schoolType,
        vocationalGroup,
        analysisIdentity
      },
      region: analysisArea
    });

    const scores = {
      chinese: document.getElementById('chinese').value,
      english: document.getElementById('english').value,
      math: document.getElementById('math').value,
      science: document.getElementById('science').value,
      social: document.getElementById('social').value,
      composition: parseInt(document.getElementById('composition').value)
    };

    const response = await fetch('https://script.google.com/macros/s/AKfycbxQD0ENt4twxvuThmgRZ2dbvjKbt38IjRYMCFuPmNXGxXNWyY7VVOGH_vZZFBHlZOaV/exec', {
      method: 'POST',
      body: JSON.stringify({
        scores,
        filters: {
          schoolOwnership,
          schoolType,
          vocationalGroup,
          analysisIdentity
        },
        region: analysisArea
      })
    });

    if (!response.ok) {
      throw new Error('無法取得學校資料');
    }

    const data = await response.json();
    displayResults(data);
  } catch (error) {
    await logUserActivity('analyze_error', { error: error.message });
    alert('發生錯誤：' + error.message);
  } finally {
    if (analyzeButton) {
      analyzeButton.disabled = false;
      analyzeButton.innerHTML = '<i class="fas fa-search icon"></i>分析落點';
    }
    setTimeout(hideLoading, 2000);
  }
}

document.getElementById('exportResults').onclick = showExportOptions;

window.onload = function() {
  showDisclaimer();
};

document.oncontextmenu = function () {
  return false;
};

document.body.onkeydown = function(e) {
  var keyCode = e.keyCode || e.which || e.charCode;
  if (
    keyCode === 123 ||
    (e.ctrlKey && e.shiftKey && (keyCode === 73 || keyCode === 74 || keyCode === 67)) ||
    (e.ctrlKey && keyCode === 85)
  ) {
    e.preventDefault();
    return false;
  }
};

(function() {
  var threshold = 160;
  setInterval(function() {
    if (window.outerWidth - window.innerWidth > threshold || window.outerHeight - window.innerHeight > threshold) {
      document.body.innerHTML = "<h1>禁止使用開發者工具</h1>";
      throw "開發者工具被禁用";
    }
  }, 1000);
})();

let userRating = 0;

function initRating() {
  const stars = document.querySelectorAll("#starsContainer .star");
  
  stars.forEach((star, index) => {
    star.addEventListener("click", function() {
      userRating = Number(this.getAttribute("data-value"));
      updateStarDisplay(userRating);
      
      stars.forEach((s, i) => {
        if (i <= index) {
          s.style.animationDelay = `${i * 0.1}s`;
          s.classList.add('active');
        }
      });
    });
    
    star.addEventListener("mouseover", function() {
      const rating = Number(this.getAttribute("data-value"));
      stars.forEach((s, i) => {
        if (i < rating) {
          s.style.transform = `scale(${1 + (rating - i) * 0.1})`;
        } else {
          s.style.transform = 'scale(1)';
        }
      });
    });
    
    star.addEventListener("mouseout", function() {
      stars.forEach(s => {
        s.style.transform = s.classList.contains('active') ? 'scale(1.2)' : 'scale(1)';
      });
    });
  });

  const submitRatingButton = document.getElementById("submitRating");
  submitRatingButton.addEventListener("click", async function() {
    if (userRating === 0) {
      alert("請選擇評分星數！");
      return;
    }
    
    this.disabled = true;
    this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 提交中...';
    
    try {
      await logUserActivity("user_rating", { rating: userRating });
      
      const ratingMsg = document.getElementById("ratingMessage");
      ratingMsg.textContent = "感謝您的評分！您的意見對我們很重要。";
      ratingMsg.classList.add('show');
      ratingMsg.style.display = "block";
      
      this.innerHTML = '<i class="fas fa-check-circle"></i> 評分成功';
      this.style.background = 'linear-gradient(135deg, #2ecc71, #27ae60)';
    } catch (error) {
      console.error('Rating submission error:', error);
      this.disabled = false;
      this.innerHTML = '<i class="fas fa-paper-plane"></i> 重新提交';
      alert('評分提交失敗，請稍後再試！');
    }
  });
}

function updateStarDisplay(rating) {
  const stars = document.querySelectorAll("#starsContainer .star");
  stars.forEach((star, index) => {
    if (index < rating) {
      star.classList.add("active");
    } else {
      star.classList.remove("active");
    }
  });
}

function toggleMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  menu.classList.toggle("show");
  overlay.classList.toggle("show");
  
  var links = menu.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].style.animationDelay = (i * 0.1) + 's';
  }
}

function closeMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  menu.classList.remove("show");
  overlay.classList.remove("show");
}

document.addEventListener('click', function(event) {
  var menu = document.getElementById("fullscreenMenu");
  var menuIcon = document.querySelector(".menu-icon");
  if (menu.classList.contains('show') && !menu.contains(event.target) && !menuIcon.contains(event.target)) {
    closeMenu();
  }
});

const html5QrCode = new Html5Qrcode("qr-reader");
const qrConfig = { fps: 10, qrbox: { width: 250, height: 250 } };

document.getElementById('scanQRCode').addEventListener('click', () => {
  const qrReader = document.getElementById('qr-reader');
  if (qrReader.style.display === 'none' || qrReader.style.display === '') {
    qrReader.style.display = 'block';
    html5QrCode.start({ facingMode: "environment" }, qrConfig, onScanSuccess);
  } else {
    qrReader.style.display = 'none';
    html5QrCode.stop();
  }
});

function onScanSuccess(decodedText, decodedResult) {
  document.getElementById('invitationCode').value = decodedText;
  html5QrCode.stop();
  document.getElementById('qr-reader').style.display = 'none';
  document.getElementById('qr-result').textContent = `您的邀請碼是：${decodedText}`;

  logUserActivity('qr_scan_success', { invitationCode: decodedText });
}

function handleQRCodeImage(file) {
  logUserActivity('qr_image_upload', { fileName: file.name });

  const reader = new FileReader();
  reader.onload = e => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      ctx.drawImage(img, 0, 0, img.width, img.height);
      const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const code = jsQR(imageData.data, imageData.width, imageData.height);
      if (code) {
        document.getElementById('invitationCode').value = code.data;
        document.getElementById('qr-result').textContent = `您的邀請碼是：${code.data}`;
      } else {
        document.getElementById('qr-result').textContent = '無法識別 QR 碼，請嘗試其他圖片';
      }
    };
    img.src = e.target.result;
  };
  reader.readAsDataURL(file);
}

document.getElementById('fileInput').addEventListener('change', event => {
  const file = event.target.files[0];
  if (file) {
    handleQRCodeImage(file);
  }
});

function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDarkMode = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDarkMode);
  
  const icon = document.querySelector('#darkModeToggle i');
  icon.classList.add('transitioning');
  
  setTimeout(() => {
    if (isDarkMode) {
      icon.classList.remove('fa-moon');
      icon.classList.add('fa-sun');
    } else {
      icon.classList.remove('fa-sun');
      icon.classList.add('fa-moon');
    }
    
    setTimeout(() => {
      icon.classList.remove('transitioning');
    }, 600);
  }, 300);

  logUserActivity('toggle_dark_mode', { enabled: isDarkMode });
}

const savedDarkMode = localStorage.getItem('darkMode') === 'true';
if (savedDarkMode) {
  document.body.classList.add('dark-mode');
  const icon = document.querySelector('#darkModeToggle i');
  icon.classList.remove('fa-moon');
  icon.classList.add('fa-sun');
}

document.getElementById('darkModeToggle').addEventListener('click', toggleDarkMode);

document.getElementById('currentYear').textContent = new Date().getFullYear();

function displayResults(data) {
  const { totalPoints, totalCredits, eligibleSchools } = data;

  let results = `
    <div class="results-container">
      <div class="results-header">
        <h2><i class="fas fa-clipboard-check icon"></i>分析結果總覽</h2>
        <div class="results-summary">
          <div class="result-card total-points">
            <i class="fas fa-star icon"></i>
            <div class="result-value">${totalPoints}</div>
            <div class="result-label">總積分</div>
          </div>
          ${totalCredits !== null ? `
          <div class="result-card total-credits">
            <i class="fas fa-award icon"></i>
            <div class="result-value">${totalCredits}</div>
            <div class="result-label">總積點</div>
          </div>
          ` : ''}
          <div class="result-card schools-count">
            <i class="fas fa-school icon"></i>
            <div class="result-value">${eligibleSchools ? eligibleSchools.length : 0}</div>
            <div class="result-label">符合條件學校數</div>
          </div>
        </div>
      </div>

      <div class="results-details">
        <h3><i class="fas fa-chart-bar icon"></i>成績分析</h3>
        <div class="scores-summary">
          <div class="score-item">
            <span class="score-label">國文：</span>
            <span class="score-value ${getScoreClass(document.getElementById('chinese').value)}">
              ${document.getElementById('chinese').value}
            </span>
          </div>
          <div class="score-item">
            <span class="score-label">英文：</span>
            <span class="score-value ${getScoreClass(document.getElementById('english').value)}">
              ${document.getElementById('english').value}
            </span>
          </div>
          <div class="score-item">
            <span class="score-label">數學：</span>
            <span class="score-value ${getScoreClass(document.getElementById('math').value)}">
              ${document.getElementById('math').value}
            </span>
          </div>
          <div class="score-item">
            <span class="score-label">自然：</span>
            <span class="score-value ${getScoreClass(document.getElementById('science').value)}">
              ${document.getElementById('science').value}
            </span>
          </div>
          <div class="score-item">
            <span class="score-label">社會：</span>
            <span class="score-value ${getScoreClass(document.getElementById('social').value)}">
              ${document.getElementById('social').value}
            </span>
          </div>
          <div class="score-item">
            <span class="score-label">作文：</span>
            <span class="score-value composition-score">
              ${document.getElementById('composition').value} 級分
            </span>
          </div>
        </div>`;
  
  if (eligibleSchools && eligibleSchools.length > 0) {
    let groupedSchools = {};
    eligibleSchools.forEach(school => {
      if (!groupedSchools[school.type]) {
        groupedSchools[school.type] = [];
      }
      groupedSchools[school.type].push(school);
    });
  
    results += `
      <div class="schools-analysis">
        <h3><i class="fas fa-university icon"></i>學校分析</h3>
        <div class="school-type-summary">
          ${Object.entries(groupedSchools).map(([type, schools]) => `
            <div class="school-type-card">
              <div class="school-type-header">
                <i class="fas fa-building icon"></i>
                <h4>${type}</h4>
                <span class="school-count">${schools.length}所</span>
              </div>
              <div class="school-list">
                ${schools.map(school => `
                  <div class="school-item">
                    <div class="school-name">
                      <i class="fas fa-graduation-cap icon"></i>
                      ${school.name}
                      ${school.ownership ? `<span class="school-ownership">【${school.ownership}】</span>` : ''}
                    </div>
                    <div class="school-details">
                      ${school.lastYearCutoff ? `
                        <span class="cutoff-score">
                          <i class="fas fa-chart-line icon"></i>
                          去年最低錄取: ${school.lastYearCutoff}
                        </span>
                      ` : ''}
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div class="analysis-notes">
        <h3><i class="fas fa-info-circle icon"></i>分析說明</h3>
        <ul>
          <li><i class="fas fa-lightbulb icon"></i>建議同時考慮學校特色、地理位置等因素</li>
          <li><i class="fas fa-book icon"></i>請詳閱各校招生簡章了解詳細資訊</li>
          <li><i class="fas fa-comments icon"></i>建議諮詢師長意見做為參考</li>
        </ul>
      </div>`;
  } else {
    results += `
      <div class="no-results">
        <i class="fas fa-search icon"></i>
        <p>根據您的成績，暫時沒有符合條件的學校。</p>
        <ul class="suggestions">
          <li>嘗試調整篩選條件</li>
          <li>考慮更多類型的學校</li>
          <li>諮詢老師獲取更多建議</li>
        </ul>
      </div>`;
  }
  
  results += '<div class="data-update-time">資料更新時間：' + new Date().toLocaleString('zh-TW') + '</div>';
  
  results += '</div></div>';
  
  const resultsElement = document.getElementById('results');
  resultsElement.innerHTML = results;
  resultsElement.style.display = 'none';
  
  setTimeout(() => {
    resultsElement.style.display = 'block';
    resultsElement.style.animation = 'fadeIn 0.5s ease-out';
    document.getElementById('exportResults').style.display = 'inline-block';
  }, 100);
}

function getScoreClass(score) {
  const scoreClasses = { 'A++': 'score-excellent', 'A+': 'score-great', 'A': 'score-good', 'B++': 'score-above-average', 'B+': 'score-average', 'B': 'score-below-average', 'C': 'score-needs-improvement' };
  return scoreClasses[score] || '';
}

function showExportOptions() {
  const exportMenu = document.createElement('div');
  exportMenu.className = 'export-menu';
  exportMenu.innerHTML = `
    <div class="export-menu-content">
      <h3><i class="fas fa-file-export"></i> 選擇匯出格式</h3>
      <button onclick="exportResults('txt')">
        <i class="fas fa-file-alt"></i> 文字檔 (.txt)
      </button>
      <button onclick="exportResults('pdf')">
        <i class="fas fa-file-pdf"></i> PDF檔 (.pdf)
      </button>
      <button onclick="exportResults('excel')" class="excel-export-btn">
        <i class="fas fa-file-excel"></i> Excel檔 (.xlsx)
      </button>
      <button onclick="exportResults('json')">
        <i class="fas fa-file-code"></i> JSON檔 (.json)
      </button>
      <button onclick="exportResults('print')">
        <i class="fas fa-print"></i> 直接列印
      </button>
      <button onclick="closeExportMenu()" class="cancel-button">
        <i class="fas fa-times"></i> 取消
      </button>
    </div>
  `;
  document.body.appendChild(exportMenu);
  
  requestAnimationFrame(() => {
    exportMenu.classList.add('show');
  });
}

async function exportResults(format = 'txt') {
  logUserActivity('export_results', { format });
  const resultsElement = document.getElementById('results');
  const resultsText = resultsElement.innerText;
  
  const now = new Date();
  const dateTime = now.toLocaleString('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false
  });
  
  const watermark =
    "********************************\n" +
    "*                              *\n" +
    "*  會考落點分析系統  *\n" +
    "*       以下資料僅供參考      *\n" +
    "*                              *\n" +
    `*   產生時間: ${dateTime}   *\n` +
    "*                              *\n" +
    "********************************\n\n";
  
  const contentWithWatermark = watermark + resultsText;
  
  switch (format) {
    case 'txt':
      exportTxt(contentWithWatermark);
      break;
    case 'pdf':
      await exportPdf(contentWithWatermark);
      break;
    case 'json':
      exportJson(resultsText);
      break;
    case 'excel':
      exportExcel();
      break;
    case 'print':
      printResults();
      break;
  }
}

function exportTxt(content) {
  const watermarkUrl = "\n\n網站: https://tyctw.github.io/spare/";
  const blob = new Blob([content + watermarkUrl], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, '會考落點分析結果.txt');
}

async function exportPdf(content) {
  if (!window.jsPDF) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  doc.setFont('helvetica');
  doc.setFontSize(12);
  
  const splitText = doc.splitTextToSize(content, 180);
  let y = 20;
  
  splitText.forEach(line => {
    if (y > 280) {
      doc.addPage();
      y = 20;
    }
    doc.text(line, 15, y);
    y += 7;
  });
  
  // Add watermark URL to each page
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text('網站: https://tyctw.github.io/spare/', 15, 285);
  }
  
  doc.save('會考落點分析結果.pdf');
}

function exportJson(content) {
  const lines = content.split('\n');
  const jsonData = {
    title: '會考落點分析結果',
    generateTime: new Date().toISOString(),
    content: lines.filter(line => line.trim()),
    scores: {
      chinese: document.getElementById('chinese').value,
      english: document.getElementById('english').value,
      math: document.getElementById('math').value,
      science: document.getElementById('science').value,
      social: document.getElementById('social').value,
      composition: document.getElementById('composition').value
    },
    watermark: "https://tyctw.github.io/spare/"
  };
  
  const blob = new Blob([JSON.stringify(jsonData, null, 2)], { type: 'application/json;charset=utf-8' });
  downloadFile(blob, '會考落點分析結果.json');
}

function downloadFile(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.style.display = 'none';
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  URL.revokeObjectURL(url);
  a.remove();
}

async function loadScript(url) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = url;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function closeExportMenu() {
  const exportMenu = document.querySelector('.export-menu');
  if (exportMenu) {
    exportMenu.classList.remove('show');
    setTimeout(() => exportMenu.remove(), 300);
  }
}

async function exportExcel() {
  showLoading();
  
  try {
    // Load required libraries if not already loaded
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    
    // Get the scores and analysis results
    const scores = {
      chinese: document.getElementById('chinese').value,
      english: document.getElementById('english').value,
      math: document.getElementById('math').value,
      science: document.getElementById('science').value,
      social: document.getElementById('social').value,
      composition: document.getElementById('composition').value
    };
    
    // Create workbook with fancy styling
    const wb = XLSX.utils.book_new();
    wb.Props = {
      Title: "會考落點分析結果",
      Subject: "落點分析",
      Author: "會考落點分析系統",
      CreatedDate: new Date()
    };
    
    // Create summary worksheet
    const summaryData = [
      ["會考落點分析結果"],
      [],
      ["產生日期", new Date().toLocaleDateString('zh-TW')],
      ["總積分", document.querySelector('.total-points .result-value')?.textContent || ""],
      [],
      ["成績摘要"],
      ["科目", "成績", "積分"],
      ["國文", scores.chinese, getScoreValue(scores.chinese)],
      ["英文", scores.english, getScoreValue(scores.english)],
      ["數學", scores.math, getScoreValue(scores.math)],
      ["自然", scores.science, getScoreValue(scores.science)],
      ["社會", scores.social, getScoreValue(scores.social)],
      ["作文", `${scores.composition} 級分`, scores.composition]
    ];
    
    const summaryWs = XLSX.utils.aoa_to_sheet(summaryData);
    
    // Style the summary sheet
    const summaryRange = XLSX.utils.decode_range(summaryWs['!ref']);
    applyExcelStyling(summaryWs, summaryRange);
    
    // Merge title cell
    summaryWs['!merges'] = [{ s: {r: 0, c: 0}, e: {r: 0, c: 2} }];
    
    // Add the summary worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, summaryWs, "分析摘要");
    
    // Create schools worksheet
    const schoolsData = [["序號", "學校名稱", "類型", "屬性", "最低分數"]];
    
    // Get eligible schools
    const schoolElements = document.querySelectorAll('.school-item');
    schoolElements.forEach((school, index) => {
      const schoolName = school.querySelector('.school-name')?.textContent.trim() || "";
      const schoolType = getSchoolParentType(school);
      const schoolOwnership = getSchoolOwnership(school);
      const cutoffScore = school.querySelector('.cutoff-score')?.textContent.trim() || "";
      
      schoolsData.push([index + 1, schoolName, schoolType, schoolOwnership, cutoffScore]);
    });
    
    const schoolsWs = XLSX.utils.aoa_to_sheet(schoolsData);
    
    // Style the schools sheet
    const schoolsRange = XLSX.utils.decode_range(schoolsWs['!ref']);
    applyExcelStyling(schoolsWs, schoolsRange);
    
    // Make header row bold
    for (let C = schoolsRange.s.c; C <= schoolsRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({r: 0, c: C});
      if(!schoolsWs[cell]) continue;
      schoolsWs[cell].s = { 
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { fgColor: { rgb: "2a9d8f" } },
        alignment: { horizontal: "center", vertical: "center" }
      };
    }
    
    // Add the schools worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, schoolsWs, "符合學校");
    
    // Add recommendations sheet
    const recommendationsData = [
      ["會考落點分析建議"],
      [],
      ["根據您的成績，以下是一些建議："],
      [],
      ["1. 參考多方資訊，不要僅依賴本分析結果"],
      ["2. 諮詢學校輔導老師或升學顧問的專業意見"],
      ["3. 密切關注各校的官方網站和招生簡章"],
      ["4. 考慮學校特色、地理位置等因素"],
      [],
      ["重要提醒：本分析結果僅供參考，實際錄取情況可能因多種因素而有所不同"]
    ];
    
    const recWs = XLSX.utils.aoa_to_sheet(recommendationsData);
    
    // Style the recommendations sheet
    const recRange = XLSX.utils.decode_range(recWs['!ref']);
    applyExcelStyling(recWs, recRange);
    
    // Add the recommendations worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, recWs, "建議事項");
    
    // Add watermark worksheet
    const watermarkData = [
      ["會考落點分析系統 - https://tyctw.github.io/spare/"],
      ["產生日期: " + new Date().toLocaleDateString('zh-TW')]
    ];
    
    const watermarkWs = XLSX.utils.aoa_to_sheet(watermarkData);
    XLSX.utils.book_append_sheet(wb, watermarkWs, "關於系統");
    
    // Create and download the Excel file
    XLSX.writeFile(wb, "會考落點分析結果.xlsx");
    
    logUserActivity('export_excel_success');
  } catch (error) {
    console.error("Excel export error:", error);
    alert("Excel 匯出失敗，請確認您的瀏覽器支援此功能");
    logUserActivity('export_excel_error', { error: error.message });
  } finally {
    hideLoading();
  }
}

function getScoreValue(score) {
  const scoreValues = { 'A++': 6, 'A+': 6, 'A': 6, 'B++': 4, 'B+': 4, 'B': 4, 'C': 2 };
  return scoreValues[score] || 0;
}

function getSchoolParentType(schoolElement) {
  // Navigate up to find the school-type-card
  const parentCard = schoolElement.closest('.school-type-card');
  if (parentCard) {
    const typeHeader = parentCard.querySelector('.school-type-header h4');
    if (typeHeader) {
      return typeHeader.textContent.trim();
    }
  }
  return "";
}

function getSchoolOwnership(schoolElement) {
  const ownershipElem = schoolElement.querySelector('.school-ownership');
  if (ownershipElem) {
    return ownershipElem.textContent.replace(/[\[\]【】]/g, '').trim();
  }
  return "";
}

function applyExcelStyling(worksheet, range) {
  // Set column widths
  const colWidths = [10, 30, 15, 15, 20];
  for (let i = 0; i <= range.e.c; i++) {
    worksheet['!cols'] = worksheet['!cols'] || [];
    worksheet['!cols'][i] = { wch: colWidths[i] || 15 };
  }
  
  // Style all cells
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({r: R, c: C});
      if(!worksheet[cell]) continue;
      
      worksheet[cell].s = worksheet[cell].s || {};
      
      // Basic styling for all cells
      worksheet[cell].s = {
        font: { name: "Arial", sz: 11 },
        alignment: { vertical: "center" },
        border: {
          top: { style: "thin", color: { rgb: "CCCCCC" } },
          bottom: { style: "thin", color: { rgb: "CCCCCC" } },
          left: { style: "thin", color: { rgb: "CCCCCC" } },
          right: { style: "thin", color: { rgb: "CCCCCC" } }
        }
      };
      
      // Style header rows
      if (R === 0 || (R === 5 && C === 0)) {
        worksheet[cell].s.font = { bold: true, sz: 14, color: { rgb: "2a9d8f" } };
      }
      
      // Style subheader rows
      if (R === 6 && C <= 2) {
        worksheet[cell].s.font = { bold: true };
        worksheet[cell].s.fill = { fgColor: { rgb: "E9C46A" } };
      }
      
      // Alternate row colors for data
      if (R >= 7) {
        worksheet[cell].s.fill = {
          fgColor: { rgb: R % 2 ? "F4F1DE" : "FFFFFF" }
        };
      }
    }
  }
}

function printResults() {
  logUserActivity('print_results');
  
  const resultContent = document.getElementById('results').innerHTML;
  const originalTitle = document.title;
  const printStyles = `
    <style>
      @media print {
        body { 
          font-family: 'Noto Sans TC', sans-serif;
          color: #264653;
          background: white;
        }
        .results-container {
          background: white;
          box-shadow: none;
          padding: 10px;
          margin: 0;
        }
        .result-card {
          border: 1px solid #ddd;
          page-break-inside: avoid;
        }
        .school-type-card {
          page-break-inside: avoid;
          border: 1px solid #ddd;
          margin-bottom: 15px;
        }
        .school-item {
          page-break-inside: avoid;
        }
        .no-print {
          display: none !important;
        }
        @page {
          size: A4;
          margin: 1.5cm;
        }
        footer {
          position: fixed;
          bottom: 0;
          width: 100%;
          text-align: center;
          font-size: 0.8rem;
          color: #777;
          padding: 10px 0;
          border-top: 1px solid #ddd;
        }
        .watermark {
          position: fixed;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%) rotate(-45deg);
          font-size: 4rem;
          color: rgba(0,0,0,0.05);
          font-weight: bold;
          z-index: -1;
          pointer-events: none;
        }
      }
    </style>`;
  
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('請允許開啟彈出視窗以啟用列印功能');
    return;
  }
  
  const now = new Date();
  const formattedDate = now.toLocaleString('zh-TW');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>會考落點分析結果</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
      ${printStyles}
    </head>
    <body>
      <div class="watermark">會考落點分析</div>
      <h1 style="text-align: center; color: #2a9d8f;">會考落點分析結果</h1>
      <div style="text-align: right; font-size: 0.9rem; color: #666; margin-bottom: 20px;">
        產生時間: ${formattedDate}
      </div>
      ${resultContent}
      <footer>
        <p> 會考落點分析系統 | 此分析結果僅供參考</p>
        <p style="color: #555; font-size: 0.85rem;">網站: https://tyctw.github.io/spare/</p>
      </footer>
      <script>
        window.onload = function() {
          window.print();
          window.onfocus = function() { window.close(); }
        }
      </script>
    </body>
    </html>
  `);
  
  printWindow.document.close();
}

initRating();

function toggleIdentitySelector() {
  const identityOptions = document.querySelectorAll('.identity-option .identity-input');
  identityOptions.forEach(option => {
    if (option.checked) {
      document.getElementById('analysisIdentity').value = option.value;
    }
  });
}