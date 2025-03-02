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

let isTurnstileVerified = false;

function turnstileCallback(token) {
  // When the user completes the Turnstile challenge, set verified to true
  isTurnstileVerified = true;
  logUserActivity('turnstile_verified', { success: true });
}

async function analyzeScores() {
  const analyzeButton = document.getElementById('analyzeButton');
  if (analyzeButton) {
    analyzeButton.disabled = true;
    analyzeButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> 分析中...';
  }

  try {
    // Check if Turnstile is verified
    if (!isTurnstileVerified) {
      alert("請先完成人機驗證");
      if (analyzeButton) {
        analyzeButton.disabled = false;
        analyzeButton.innerHTML = '<i class="fas fa-search icon"></i>分析落點';
      }
      return;
    }

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

    const turnstileToken = getTurnstileToken();

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
        region: analysisArea,
        token: turnstileToken
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

function getTurnstileToken() {
  return document.querySelector('[name="cf-turnstile-response"]')?.value || '';
}