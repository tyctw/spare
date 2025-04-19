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
  
  if (schoolType === '職業類科') {
    vocationalGroupContainer.style.display = 'block';
    // Add small delay before adding visible class for smooth animation
    setTimeout(() => {
      vocationalGroupContainer.classList.add('visible');
    }, 10);
  } else {
    vocationalGroupContainer.classList.remove('visible');
    // Hide after animation completes
    setTimeout(() => {
      vocationalGroupContainer.style.display = 'none';
      // Uncheck all checkboxes when hiding
      document.querySelectorAll('.vocational-group-input').forEach(input => {
        input.checked = false;
      });
      // Ensure "All" option is checked by default
      document.getElementById('groupAll').checked = true;
    }, 300);
  }
}

function getSelectedVocationalGroups() {
  const selected = [];
  document.querySelectorAll('.vocational-group-input:checked').forEach(input => {
    selected.push(input.value);
  });
  return selected.length > 0 ? selected : ['all'];
}

// Add vocational group validation with enhanced feedback
function handleVocationalGroupSelection(event) {
  const checkbox = event.target;
  const allCheckbox = document.getElementById('groupAll');
  const checkboxLabel = checkbox.nextElementSibling;
  
  // Add visual feedback with animation
  if (checkbox.checked) {
    checkboxLabel.classList.add('pulse-animation');
    setTimeout(() => {
      checkboxLabel.classList.remove('pulse-animation');
    }, 500);
  }
  
  // If "All" option is checked, uncheck all other options
  if (checkbox.id === 'groupAll' && checkbox.checked) {
    document.querySelectorAll('.vocational-group-input:not(#groupAll)').forEach(input => {
      input.checked = false;
      input.nextElementSibling.classList.remove('pulse-animation');
    });
  } 
  // If a specific option is checked, uncheck "All" option
  else if (checkbox.id !== 'groupAll' && checkbox.checked) {
    allCheckbox.checked = false;
    allCheckbox.nextElementSibling.classList.remove('pulse-animation');
  }
  
  // If no option is checked, automatically check "All" option
  const anyChecked = Array.from(document.querySelectorAll('.vocational-group-input:not(#groupAll)')).some(input => input.checked);
  if (!anyChecked) {
    allCheckbox.checked = true;
    allCheckbox.nextElementSibling.classList.add('pulse-animation');
    setTimeout(() => {
      allCheckbox.nextElementSibling.classList.remove('pulse-animation');
    }, 500);
  }
}

// Apply event listeners to vocational group checkboxes
function initVocationalGroupValidation() {
  document.querySelectorAll('.vocational-group-input').forEach(checkbox => {
    checkbox.addEventListener('change', handleVocationalGroupSelection);
  });
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
  const invitationInput = document.getElementById('invitationCode');
  const invitationCode = invitationInput.value;
  
  if (!invitationGroup) return;
  
  // 儲存邀請碼供動畫使用
  const codeDigits = invitationCode.split('');
  
  invitationGroup.style.position = 'relative';
  
  // 創建覆蓋層
  const overlay = document.createElement('div');
  overlay.id = 'invitationValidationOverlay';
  overlay.className = 'validation-overlay';
  
  // 創建更精美的動畫內容
  overlay.innerHTML = `
    <div class="validation-content">
      <div class="validation-header">
        <div class="validation-step active" data-step="1">
          <div class="step-indicator">1</div>
          <div class="step-label">初始化</div>
        </div>
        <div class="validation-step" data-step="2">
          <div class="step-indicator">2</div>
          <div class="step-label">驗證中</div>
        </div>
        <div class="validation-step" data-step="3"> 
          <div class="step-indicator">3</div>
          <div class="step-label">完成</div>
        </div>
        <div class="validation-progress-bar">
          <div class="validation-progress-inner"></div>
        </div>
      </div>
      
      <div class="validation-body">
        <div class="scanner-container">
          <div class="scanner-light"></div>
          <div class="code-display"></div>
        </div>
        
        <div class="validation-message">正在連接伺服器...</div>
        <div class="validation-details">驗證邀請碼格式</div>
      </div>
      
      <div class="validation-spinner-container">
        <div class="validation-spinner"></div>
      </div>
    </div>
  `;
  
  invitationGroup.appendChild(overlay);
  
  // 創建掃描動畫效果
  setTimeout(() => {
    const codeDisplay = overlay.querySelector('.code-display');
    if (codeDisplay) {
      // 建立字符動畫效果
      let html = '';
      codeDigits.forEach((digit, index) => {
        html += `<span class="code-char" style="animation-delay: ${index * 100}ms">${digit}</span>`;
      });
      codeDisplay.innerHTML = html;
      
      // 啟動掃描動畫
      overlay.querySelector('.scanner-light').classList.add('scanning');
      
      // 更新訊息
      overlay.querySelector('.validation-message').textContent = '驗證邀請碼中...';
      overlay.querySelector('.validation-details').textContent = '正在檢查邀請碼有效性';
      
      // 啟動第二階段
      overlay.querySelector('.validation-step[data-step="2"]').classList.add('active');
      overlay.querySelector('.validation-progress-inner').style.width = '66%';
    }
  }, 800);
  
  // 模擬驗證過程
  setTimeout(() => {
    // 讓字符一個個變綠色，表示驗證進行中
    const codeChars = overlay.querySelectorAll('.code-char');
    codeChars.forEach((char, index) => {
      setTimeout(() => {
        char.classList.add('verified');
      }, index * 200);
    });
    
    // 最後一個字符變綠後，顯示成功
    setTimeout(() => {
      // 停止掃描動畫
      overlay.querySelector('.scanner-light').classList.remove('scanning');
      overlay.querySelector('.scanner-light').classList.add('complete');
      
      // 更新訊息
      overlay.querySelector('.validation-message').innerHTML = '<i class="fas fa-check-circle"></i> 驗證成功';
      overlay.querySelector('.validation-details').textContent = '邀請碼有效，授權成功';
      
      // 啟動第三階段
      overlay.querySelector('.validation-step[data-step="3"]').classList.add('active');
      overlay.querySelector('.validation-progress-inner').style.width = '100%';
      
      // 移除spinner，添加成功動畫
      const spinnerContainer = overlay.querySelector('.validation-spinner-container');
      spinnerContainer.innerHTML = '<div class="success-checkmark"><div class="check-icon"><span class="icon-line line-tip"></span><span class="icon-line line-long"></span></div></div>';
      
      // 創建煙花效果
      createVerificationFireworks(overlay);
      
    }, codeChars.length * 200 + 300);
  }, 1500);
  
  // 等待一段時間後隱藏動畫
  setTimeout(() => {
    hideInvitationValidationAnimation();
  }, 5000);
}

// 創建驗證成功的煙花效果
function createVerificationFireworks(container) {
  for (let i = 0; i < 30; i++) {
    const firework = document.createElement('div');
    firework.className = 'verification-firework';
    
    // 隨機位置和顏色
    const x = Math.random() * 100;
    const y = Math.random() * 100;
    const size = 3 + Math.random() * 5;
    const colors = ['#2ecc71', '#3498db', '#e9c46a', '#f4a261', '#ffffff'];
    const color = colors[Math.floor(Math.random() * colors.length)];
    
    firework.style.cssText = `
      position: absolute;
      width: ${size}px;
      height: ${size}px;
      background: ${color};
      border-radius: 50%;
      top: 50%;
      left: 50%;
      opacity: 0;
      z-index: 200;
    `;
    
    container.appendChild(firework);
    
    // 創建動畫
    const angle = Math.random() * Math.PI * 2;
    const distance = 20 + Math.random() * 80;
    const destinationX = Math.cos(angle) * distance;
    const destinationY = Math.sin(angle) * distance;
    
    // 使用Web Animation API
    firework.animate(
      [
        { transform: 'translate(-50%, -50%) scale(0)', opacity: 1 },
        { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(1)`, opacity: 1, offset: 0.7 },
        { transform: `translate(calc(-50% + ${destinationX}px), calc(-50% + ${destinationY}px)) scale(0)`, opacity: 0 }
      ], 
      {
        duration: 1000 + Math.random() * 1000,
        easing: 'cubic-bezier(0.22, 0.61, 0.36, 1)',
        delay: Math.random() * 300
      }
    );
    
    // 自動移除元素
    setTimeout(() => {
      firework.remove();
    }, 2000 + Math.random() * 1000);
  }
}

function hideInvitationValidationAnimation() {
  const overlay = document.getElementById('invitationValidationOverlay');
  if (overlay) {
    overlay.classList.add('fade-out');
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
    const vocationalGroups = getSelectedVocationalGroups();
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
        vocationalGroups,
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

    const response = await fetch('https://script.google.com/macros/s/AKfycbwyCrdfpk5Lmw-ifJR4E_hkMiolZx4LitVt14gIP5CDeiZYSWjhEtD4K1hW6BFYkQIqsA/exec', {
      method: 'POST',
      body: JSON.stringify({
        scores,
        filters: {
          schoolOwnership,
          schoolType,
          vocationalGroups,
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

// Toggle menu
function toggleMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  
  // Toggle the menu and overlay visibility
  menu.classList.toggle("show");
  overlay.classList.toggle("show");
  
  // Add animation to menu items with proper delays
  var links = menu.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    // Reset any previous styles first
    links[i].style.transitionDelay = '0s';
    
    // Apply new delay if opening menu
    if (menu.classList.contains('show')) {
      links[i].style.transitionDelay = (0.1 + i * 0.05) + 's';
    }
  }
  
  // Prevent body scrolling when menu is open
  if (menu.classList.contains('show')) {
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
}

function closeMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  
  // If menu is not open, don't do anything
  if (!menu.classList.contains('show')) return;
  
  // Reverse the animation for links
  var links = menu.querySelectorAll('a');
  for (var i = 0; i < links.length; i++) {
    links[i].style.transitionDelay = (0.05 * (links.length - i - 1)) + 's';
    links[i].style.transform = 'translateX(40px)';
    links[i].style.opacity = '0';
    links[i].style.pointerEvents = 'none';
  }
  
  // Delay the menu hiding to allow for animations
  setTimeout(() => {
    menu.classList.remove("show");
    overlay.classList.remove("show");
    document.body.style.overflow = '';
    
    // Reset styles after animation completes
    setTimeout(() => {
      links.forEach(link => {
        link.style.transform = '';
        link.style.opacity = '';
        link.style.pointerEvents = 'auto';
        link.style.transitionDelay = '0s';
      });
    }, 300);
  }, 300);
}

// Close menu when clicking outside
document.addEventListener('click', function(event) {
  var menu = document.getElementById("fullscreenMenu");
  var menuIcon = document.querySelector(".menu-icon");
  
  if (menu.classList.contains('show') && 
      !menu.contains(event.target) && 
      !menuIcon.contains(event.target)) {
    closeMenu();
  }
});

// Add scroll event to change header appearance
window.addEventListener('scroll', function() {
  var header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Add menu hover effects for better interaction
document.addEventListener('DOMContentLoaded', function() {
  // Set menu year
  if (document.getElementById('menuVersionYear')) {
    document.getElementById('menuVersionYear').textContent = new Date().getFullYear();
  }
  
  // Add hover effect to menu items
  var menuItems = document.querySelectorAll('.fullscreen-menu a');
  menuItems.forEach(function(item) {
    item.addEventListener('mouseenter', function() {
      // Reduce opacity of other items
      menuItems.forEach(function(otherItem) {
        if (otherItem !== item) {
          otherItem.style.opacity = '0.7';
        }
      });
    });
    
    item.addEventListener('mouseleave', function() {
      // Restore opacity
      menuItems.forEach(function(otherItem) {
        otherItem.style.opacity = '';
      });
    });
  });
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
  reader.onerror = function() {
    console.error('Failed to load QR code image');
    document.getElementById('qr-result').textContent = '無法識別 QR 碼，請嘗試其他圖片';
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

  // Get region info
  const selectedRegionRadio = document.querySelector('input[name="analysisArea"]:checked');
  const regionId = selectedRegionRadio ? selectedRegionRadio.value : '';
  const regionName = selectedRegionRadio ? selectedRegionRadio.parentElement.querySelector('.region-name').textContent : '未指定區域';

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
          <div class="result-card region-info">
            <i class="fas fa-map-marker-alt icon"></i>
            <div class="result-value">${regionName}</div>
            <div class="result-label">分析區域</div>
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
        <div class="comparison-actions">
          <button id="compareSchoolsBtn" class="comparison-button" onclick="showSchoolComparison()">
            <i class="fas fa-exchange-alt"></i> 查看學校比較
            <span id="comparisonBadge" class="comparison-badge">0</span>
          </button>
        </div>
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
                    </div>
                    <div class="school-details">
                      ${school.ownership ? `
                        <span class="school-ownership">
                          <i class="fas fa-university icon"></i>
                          ${school.ownership}
                        </span>
                      ` : ''}
                      ${school.group ? `
                        <span class="school-group">
                          <i class="fas fa-layer-group icon"></i>
                          ${school.group}
                        </span>
                      ` : ''}
                      ${school.lastYearCutoff ? `
                        <span class="cutoff-score">
                          <i class="fas fa-chart-line icon"></i>
                          去年最低錄取: ${school.lastYearCutoff}
                        </span>
                      ` : ''}
                    </div>
                    <div class="school-actions">
                      <button class="add-comparison-btn" onclick="addSchoolToComparison('${school.name}', '${school.type}', ${JSON.stringify(school).replace(/"/g, '&quot;')})">
                        <i class="fas fa-plus-circle"></i> 加入比較
                      </button>
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
    
    // Initialize comparison badge
    updateComparisonBadge();
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

function closeExportMenu() {
  const exportMenu = document.querySelector('.export-menu');
  if (exportMenu) {
    exportMenu.classList.remove('show');
    
    setTimeout(() => {
      exportMenu.remove();
    }, 300);
  }
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
  const selectedRegionRadio = document.querySelector('input[name="analysisArea"]:checked');
  const regionName = selectedRegionRadio ? selectedRegionRadio.parentElement.querySelector('.region-name').textContent : '未指定區域';
  
  const watermarkUrl = `\n\n網站: https://tyctw.github.io/spare/\n分析區域: ${regionName}`;
  const blob = new Blob([content + watermarkUrl], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, '會考落點分析結果.txt');
}

async function exportPdf(content) {
  if (!window.jsPDF) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add header
  doc.setFillColor(42, 157, 143);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('會考落點分析結果', 105, 12, { align: 'center' });
  
  // Add timestamp
  const timestamp = new Date().toLocaleString('zh-TW');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`產生時間: ${timestamp} | 分析區域: ${document.querySelector('input[name="analysisArea"]:checked').parentElement.querySelector('.region-name').textContent}`, 105, 20, { align: 'center' });
  
  // Add main content with improved styling
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  const splitText = doc.splitTextToSize(content, 180);
  let y = 30;
  
  // Add decorative element
  doc.setDrawColor(233, 196, 106);
  doc.setLineWidth(0.5);
  doc.line(15, 25, 195, 25);
  
  splitText.forEach(line => {
    // Check if line is a heading (like "分析結果總覽")
    if (line.includes('總覽') || line.includes('分析') || line.includes('符合條件')) {
      doc.setFont('helvetica', 'bold');
      doc.setFillColor(244, 241, 222);
      doc.rect(15, y-5, 180, 8, 'F');
      doc.setTextColor(42, 157, 143);
      y += 2;
    } else {
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(0);
    }
    
    if (y > 280) {
      doc.addPage();
      // Add header to new page
      doc.setFillColor(42, 157, 143);
      doc.rect(0, 0, 210, 20, 'F');
      doc.setTextColor(255);
      doc.setFontSize(16);
      doc.setFont('helvetica', 'bold');
      doc.text('會考落點分析結果', 105, 12, { align: 'center' });
      doc.setTextColor(0);
      doc.setFontSize(12);
      doc.setFont('helvetica', 'normal');
      // Add decorative element to new page
      doc.setDrawColor(233, 196, 106);
      doc.setLineWidth(0.5);
      doc.line(15, 25, 195, 25);
      y = 30;
    }
    doc.text(line, 15, y);
    y += 7;
  });
  
  // Add watermark URL and QR code to each page
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(10);
  doc.setTextColor(150);
  
  // Generate QR code for the site URL
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=40x40&data=https://tyctw.github.io/spare/`;
  
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    // Add footer with styled URL
    doc.setDrawColor(42, 157, 143);
    doc.setLineWidth(0.5);
    doc.line(15, 280, 195, 280);
    
    // Add styled page numbers
    doc.setFillColor(42, 157, 143);
    doc.circle(195, 285, 5, 'F');
    doc.setTextColor(255);
    doc.setFont('helvetica', 'bold');
    doc.text(i.toString(), 195, 287, { align: 'center' });
    
    // Add watermark text
    doc.setTextColor(100);
    doc.setFont('helvetica', 'italic');
    doc.text(`網站: https://tyctw.github.io/spare/`, 105, 285, { align: 'center' });
    
    // Add footer design element
    doc.setDrawColor(233, 196, 106);
    doc.setLineWidth(0.3);
    doc.line(15, 282, 195, 282);
  }
  
  // Using image is optional but make it more aesthetic - QR code on the first page
  await loadQRCodeToPDF(doc, qrUrl, 1);
  
  doc.save('會考落點分析結果.pdf');
}

// Helper function to load QR code to PDF
async function loadQRCodeToPDF(doc, qrUrl, page) {
  try {
    return new Promise((resolve) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = function() {
        try {
          doc.setPage(page);
          doc.addImage(img, 'PNG', 20, 260, 20, 20);
          resolve();
        } catch (e) {
          console.error('Error adding image to PDF:', e);
          resolve(); // Still resolve to allow PDF generation
        }
      };
      img.onerror = function() {
        console.error('Failed to load QR code image');
        resolve(); // Still resolve to allow PDF generation
      };
      img.src = qrUrl;
    });
  } catch (e) {
    console.error('Error in QR code loading:', e);
    return Promise.resolve(); // Continue without the QR code
  }
}

function printResults() {
  logUserActivity('print_results');
  
  const resultContent = document.getElementById('results').innerHTML;
  const originalTitle = document.title;
  
  // Get region info
  const selectedRegionRadio = document.querySelector('input[name="analysisArea"]:checked');
  const regionName = selectedRegionRadio ? selectedRegionRadio.parentElement.querySelector('.region-name').textContent : '未指定區域';
  
  const now = new Date();
  const formattedDate = now.toLocaleString('zh-TW');
  
  // Generate QR code for the site URL
  const qrCodeURL = `https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://tyctw.github.io/spare/`;
  
  // Enhanced score presentation
  const scores = {
    chinese: document.getElementById('chinese').value,
    english: document.getElementById('english').value,
    math: document.getElementById('math').value,
    science: document.getElementById('science').value,
    social: document.getElementById('social').value,
    composition: document.getElementById('composition').value
  };
  
  // Get total scores
  const totalPoints = document.querySelector('.total-points .result-value')?.textContent || "";
  const totalCredits = document.querySelector('.total-credits .result-value')?.textContent || "";
  
  // Process schools for better printing
  const schools = Array.from(document.querySelectorAll('.school-item')).map(school => {
    return {
      name: school.querySelector('.school-name')?.textContent.trim() || "",
      type: getSchoolParentType(school),
      ownership: getSchoolOwnership(school),
      group: getSchoolGroup(school),
      cutoff: school.querySelector('.cutoff-score')?.textContent.trim() || ""
    };
  });
  
  // Group schools by type for better organization
  const schoolsByType = {};
  schools.forEach(school => {
    if (!schoolsByType[school.type]) {
      schoolsByType[school.type] = [];
    }
    schoolsByType[school.type].push(school);
  });
  
  printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('請允許開啟彈出視窗以啟用列印功能');
    return;
  }
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>會考落點分析結果</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        @media print {
          body { 
            font-family: 'Noto Sans TC', sans-serif;
            color: #264653;
            background: white;
            margin: 0;
            padding: 0;
          }
          .results-container {
            background: white;
            box-shadow: none;
            padding: 20px;
            margin: 0;
          }
          .result-card {
            border: 1px solid #ddd;
            page-break-inside: avoid;
            background: linear-gradient(135deg, #f8f9fa, #e9ecef);
            color: #264653;
            box-shadow: none;
            transform: none !important;
          }
          .school-type-card {
            page-break-inside: avoid;
            border: 1px solid #ddd;
            margin-bottom: 20px;
            background: white;
            box-shadow: none;
            transform: none !important;
          }
          .school-item {
            page-break-inside: avoid;
            border-left: 3px solid #2a9d8f;
            background: #f9f9f9;
            margin: 8px 0;
            transition: none;
          }
          .school-name {
            font-weight: bold;
            color: #2a9d8f;
          }
          .no-print {
            display: none !important;
          }
          h1, h2, h3 {
            color: #2a9d8f;
          }
          @page {
            size: A4;
            margin: 2cm;
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
            color: rgba(0,0,0,0.03);
            font-weight: bold;
            z-index: -1;
            pointer-events: none;
            width: 100%;
            text-align: center;
          }
          
          /* Enhanced print styling */
          .print-header {
            text-align: center;
            border-bottom: 3px solid #2a9d8f;
            padding-bottom: 20px;
            margin-bottom: 30px;
            position: relative;
          }
          .print-header:after {
            content: '';
            position: absolute;
            bottom: -6px;
            left: 0;
            width: 100%;
            height: 1px;
            background: #e9c46a;
          }
          .print-logo {
            font-size: 3rem;
            color: #2a9d8f;
            margin-bottom: 10px;
            display: block;
          }
          .print-title {
            font-size: 2.2rem;
            color: #2a9d8f;
            margin: 0;
            letter-spacing: 2px;
          }
          .print-subtitle {
            font-size: 1rem;
            color: #666;
            margin: 8px 0 0 0;
            font-style: italic;
          }
          .print-timestamp {
            text-align: right;
            font-style: italic;
            color: #666;
            margin-bottom: 30px;
            border-bottom: 1px dashed #ddd;
            padding-bottom: 15px;
          }
          .print-section {
            margin-bottom: 30px;
            position: relative;
          }
          .print-section:after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, #ddd, transparent);
            width: 80%;
            margin: 30px auto 0;
          }
          .print-section-title {
            font-size: 1.4rem;
            color: #2a9d8f;
            border-left: 5px solid #2a9d8f;
            padding-left: 15px;
            margin-bottom: 20px;
            background: #f9f9f9;
            padding: 10px 15px;
            border-radius: 0 5px 5px 0;
          }
          .print-footer-page {
            font-size: 0.8rem;
            text-align: right;
            color: #999;
            position: fixed;
            bottom: 5mm;
            right: 5mm;
          }
          .print-qr {
            text-align: center;
            margin: 40px 0 30px;
            padding-top: 20px;
            border-top: 1px dashed #eee;
          }
          .print-qr img {
            width: 120px;
            height: 120px;
            border: 1px solid #eee;
            padding: 5px;
            box-shadow: 0 2px 5px rgba(0,0,0,0.05);
          }
          .print-qr-text {
            font-size: 0.9rem;
            color: #666;
            margin-top: 10px;
            font-style: italic;
          }
          .print-decoration {
            position: absolute;
            top: 0;
            right: 0;
            width: 150px;
            height: 150px;
            background: linear-gradient(135deg, transparent 75%, rgba(42, 157, 143, 0.1) 75%);
            z-index: -1;
          }
          
          /* Enhanced print styling for school list */
          .print-school-list {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
          }
          
          .print-scores {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            margin: 20px 0;
          }
          
          .print-score-item {
            background: #f9f9f9;
            padding: 10px;
            border-radius: 5px;
            text-align: center;
            border: 1px solid #eee;
          }
          
          .print-score-label {
            font-weight: 500;
            color: #666;
          }
          
          .print-score-value {
            font-size: 1.2rem;
            font-weight: bold;
            color: #2a9d8f;
            margin-top: 5px;
          }
          
          /* Print watermark on each page */
          .print-page-watermark {
            position: fixed;
            bottom: 5mm;
            left: 0;
            width: 100%;
            text-align: center;
            font-size: 0.75rem;
            color: #999;
          }
          
          /* Gentle page break decorations */
          .page-break-after {
            page-break-after: always;
            position: relative;
          }
          
          .page-break-after::after {
            content: '';
            position: absolute;
            bottom: -15px;
            left: 0;
            width: 100%;
            height: 1px;
            background: linear-gradient(90deg, transparent, #ddd, transparent);
            width: 80%;
            margin: 30px auto 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="print-decoration"></div>
      <div class="watermark">會考落點分析系統</div>
      
      <div class="print-header">
        <span class="print-logo"><i class="fas fa-chart-line"></i></span>
        <h1 class="print-title">會考落點分析結果</h1>
        <p class="print-subtitle">本分析結果僅供參考，請以各校最新招生簡章為準</p>
      </div>
      
      <div class="print-timestamp">
        分析時間: ${formattedDate} | 分析區域: ${regionName}
      </div>
      
      <div class="print-section">
        <h2 class="print-section-title"><i class="fas fa-star"></i> 成績總覽</h2>
        
        <div style="display: flex; justify-content: space-between; margin-bottom: 20px;">
          <div style="background: #f4f1de; padding: 15px; border-radius: 10px; width: 30%; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 0.9rem; color: #666;">總積分</div>
            <div style="font-size: 2rem; font-weight: bold; color: #2a9d8f;">${totalPoints}</div>
          </div>
          
          ${totalCredits ? `
          <div style="background: #f4f1de; padding: 15px; border-radius: 10px; width: 30%; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 0.9rem; color: #666;">總積點</div>
            <div style="font-size: 2rem; font-weight: bold; color: #2a9d8f;">${totalCredits}</div>
          </div>
          ` : ''}
          
          <div style="background: #f4f1de; padding: 15px; border-radius: 10px; width: 30%; text-align: center; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
            <div style="font-size: 0.9rem; color: #666;">符合學校數</div>
            <div style="font-size: 2rem; font-weight: bold; color: #2a9d8f;">${schools.length}</div>
          </div>
        </div>
        
        <h3 style="margin-top: 25px; color: #264653; font-size: 1.2rem; border-bottom: 1px solid #eee; padding-bottom: 10px;">
          <i class="fas fa-graduation-cap"></i> 各科成績
        </h3>
        
        <div class="print-scores">
          <div class="print-score-item">
            <div class="print-score-label">國文</div>
            <div class="print-score-value">${scores.chinese}</div>
          </div>
          <div class="print-score-item">
            <div class="print-score-label">英文</div>
            <div class="print-score-value">${scores.english}</div>
          </div>
          <div class="print-score-item">
            <div class="print-score-label">數學</div>
            <div class="print-score-value">${scores.math}</div>
          </div>
          <div class="print-score-item">
            <div class="print-score-label">自然</div>
            <div class="print-score-value">${scores.science}</div>
          </div>
          <div class="print-score-item">
            <div class="print-score-label">社會</div>
            <div class="print-score-value">${scores.social}</div>
          </div>
          <div class="print-score-item">
            <div class="print-score-label">作文</div>
            <div class="print-score-value">${scores.composition} 級分</div>
          </div>
        </div>
      </div>
      
      <div class="page-break-after"></div>
      
      <div class="print-section">
        <h2 class="print-section-title"><i class="fas fa-school"></i> 符合條件的學校</h2>
        
        ${Object.entries(schoolsByType).map(([type, typeSchools]) => `
          <div style="margin-bottom: 30px;">
            <h3 style="color: #264653; font-size: 1.2rem; background: #e9f4f3; padding: 8px 15px; border-radius: 5px; display: flex; align-items: center; justify-content: space-between;">
              <span><i class="fas fa-building"></i> ${type}</span>
              <span style="font-size: 0.9rem; background: #2a9d8f; color: white; padding: 3px 10px; border-radius: 15px;">${typeSchools.length}所</span>
            </h3>
            
            <div class="print-school-list">
              ${typeSchools.map(school => `
                <div style="border: 1px solid #eee; border-left: 3px solid #2a9d8f; padding: 10px; border-radius: 5px; background: #f9f9f9; margin-bottom: 10px;">
                  <div style="font-weight: bold; color: #264653; margin-bottom: 5px;">
                    <i class="fas fa-graduation-cap" style="color: #2a9d8f; margin-right: 5px;"></i>
                    ${school.name}
                  </div>
                  <div style="display: flex; justify-content: space-between; font-size: 0.9rem; color: #666; margin-top: 5px;">
                    <span>${school.ownership}</span>
                    ${school.group ? `<span><i class="fas fa-layer-group" style="margin-right: 5px;"></i>${school.group}</span>` : ''}
                    <span>${school.cutoff}</span>
                  </div>
                </div>
              `).join('')}
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="print-qr">
        <img src="${qrCodeURL}" alt="網站 QR 碼">
        <div class="print-qr-text">掃描 QR 碼訪問會考落點分析系統</div>
      </div>
      
      <div class="print-page-watermark">
        會考落點分析系統 | https://tyctw.github.io/spare/
      </div>
      
      <div class="print-footer-page">頁 <span class="pageNumber"></span></div>
      
      <script>
        window.onload = function() {
          // Add page numbers
          const style = document.createElement('style');
          style.innerHTML = '@page { counter-increment: page; }';
          document.head.appendChild(style);
          
          const pageNumbers = document.querySelectorAll('.pageNumber');
          pageNumbers.forEach(el => {
            el.textContent = '1';
          });
          
          window.print();
          setTimeout(() => {
            window.close();
          }, 1000);
        }
      </script>
    </body>
  </html>
  `);
  
  printWindow.document.close();
}

function toggleIdentitySelector() {
  const identityOptions = document.querySelectorAll('.identity-option .identity-input');
  identityOptions.forEach(option => {
    if (option.checked) {
      document.getElementById('analysisIdentity').value = option.value;
    }
  });
}

function applyExcelStyling(worksheet, range) {
  // Prettier column widths based on expected content
  const colWidths = [8, 35, 15, 15, 20, 15];
  worksheet['!cols'] = [];
  for (let i = 0; i <= range.e.c; i++) {
    worksheet['!cols'][i] = { wch: colWidths[i] || 15 };
  }
  
  // Enhanced styling for title
  const titleCell = XLSX.utils.encode_cell({r: 0, c: 0});
  if(worksheet[titleCell]) {
    worksheet[titleCell].s = {
      font: { bold: true, sz: 18, color: { rgb: "2A9D8F" } },
      alignment: { horizontal: "center", vertical: "center" },
      border: {
        bottom: { style: "medium", color: { rgb: "E9C46A" } }
      },
      fill: { patternType: "solid", fgColor: { rgb: "F4F1DE" } }
    };
  }
  
  // Style all cells with more aesthetically pleasing designs
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({r: R, c: C});
      if(!worksheet[cell]) continue;
      
      if (R !== 0 || C !== 0) { // Skip title cell as we styled it already
        // Base style for all cells
        worksheet[cell].s = { 
          font: { name: "Arial", sz: 11 },
          alignment: { vertical: "center", wrapText: true },
          border: {
            top: { style: "thin", color: { rgb: "DDDDDD" } },
            bottom: { style: "thin", color: { rgb: "DDDDDD" } },
            left: { style: "thin", color: { rgb: "DDDDDD" } },
            right: { style: "thin", color: { rgb: "DDDDDD" } }
          }
        };
        
        // Style section headers (in summary sheet)
        if (R === 6 || (R === 7 && C === 0)) {
          worksheet[cell].s.font = { bold: true, sz: 12, color: { rgb: "FFFFFF" } };
          worksheet[cell].s.fill = { patternType: "solid", fgColor: { rgb: "2a9d8f" } };
          worksheet[cell].s.alignment = { horizontal: "center", vertical: "center" };
          worksheet[cell].s.border = {
            top: { style: "medium", color: { auto: 1 } },
            bottom: { style: "medium", color: { auto: 1 } },
            left: { style: "medium", color: { auto: 1 } },
            right: { style: "medium", color: { auto: 1 } }
          };
        }
        
        // Style column headers in data section
        if (R === 7 && C > 0) {
          worksheet[cell].s.font = { bold: true, color: { rgb: "264653" } };
          worksheet[cell].s.fill = { patternType: "solid", fgColor: { rgb: "E9C46A" } };
          worksheet[cell].s.alignment = { horizontal: "center" };
        }
        
        // Style date and total score rows with accent colors
        if (R >= 2 && R <= 4) {
          if (C === 0) {
            worksheet[cell].s.font = { bold: true, color: { rgb: "264653" } };
            worksheet[cell].s.fill = { patternType: "solid", fgColor: { rgb: "F4F1DE" } };
          } else if (C === 1) {
            worksheet[cell].s.font = { bold: true, sz: 12, color: { rgb: "2A9D8F" } };
            worksheet[cell].s.alignment = { horizontal: "center" };
          }
        }
        
        // Style the score data with alternate row colors and better alignment
        if (R >= 8) {
          // Set text alignment based on column type
          if (C === 0) { // Serial number
            worksheet[cell].s.alignment.horizontal = "center";
          } else if (C === 1) { // School name
            worksheet[cell].s.alignment.horizontal = "left";
            worksheet[cell].s.font.bold = true;
          } else { // Other data columns
            worksheet[cell].s.alignment.horizontal = "center";
          }
          
          // Alternate row background colors
          worksheet[cell].s.fill = {
            patternType: "solid",
            fgColor: { rgb: R % 2 ? "F8F9FA" : "FFFFFF" }
          };
          
          // Special formatting for match status column
          if (C === 5) { // Match status column
            const cellValue = worksheet[cell].v;
            if (cellValue && cellValue.toString().includes('★★★')) {
              worksheet[cell].s.font.color = { rgb: "107C10" }; // Green for very suitable
              worksheet[cell].s.fill.fgColor = { rgb: "E8F5E9" };
            } else if (cellValue && cellValue.toString().includes('★★')) {
              worksheet[cell].s.font.color = { rgb: "0078D7" }; // Blue for suitable
              worksheet[cell].s.fill.fgColor = { rgb: "E3F2FD" };
            } else if (cellValue && cellValue.toString().includes('★')) {
              worksheet[cell].s.font.color = { rgb: "D83B01" }; // Orange for just suitable
              worksheet[cell].s.fill.fgColor = { rgb: "FFF3E0" };
            }
          }
        }
      }
    }
  }
  
  // Add thin border to the entire table
  const borderStyle = { style: "thin", color: { rgb: "BBBBBB" } };
  if (range.e.r > 0 && range.e.c > 0) {
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({r: R, c: C});
        if (!worksheet[cell]) continue;
        
        worksheet[cell].s = worksheet[cell].s || {};
        
        // Only set borders that haven't been styled yet
        if (!worksheet[cell].s.border.top) worksheet[cell].s.border.top = borderStyle;
        if (!worksheet[cell].s.border.bottom) worksheet[cell].s.border.bottom = borderStyle;
        if (!worksheet[cell].s.border.left) worksheet[cell].s.border.left = borderStyle;
        if (!worksheet[cell].s.border.right) worksheet[cell].s.border.right = borderStyle;
      }
    }
  }
}

async function exportExcel() {
  showLoading();
  
  try {
    // Load required libraries if not already loaded
    if (!window.XLSX) {
      await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
    }
    
    // Get region info
    const selectedRegionRadio = document.querySelector('input[name="analysisArea"]:checked');
    const regionName = selectedRegionRadio ? selectedRegionRadio.parentElement.querySelector('.region-name').textContent : '未指定區域';
    
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
    
    // Create summary worksheet with enhanced styling
    const summaryData = [
      ["會考落點分析結果"],
      [],
      ["產生日期", new Date().toLocaleDateString('zh-TW')],
      ["分析區域", regionName],
      ["總積分", document.querySelector('.total-points .result-value')?.textContent || ""],
      ["總積點", document.querySelector('.total-credits .result-value')?.textContent || ""],
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
    
    // Create schools worksheet with enhanced styling
    const schoolsData = [
      ["符合條件學校"],
      [],
      ["學校名稱", "類型", "屬性", "最低錄取分數", "入學管道", "地理位置", "特色課程數", "學校網站"],
      ...Array.from(document.querySelectorAll('.school-item')).map(school => {
        return [
          school.querySelector('.school-name')?.textContent.trim() || "",
          getSchoolParentType(school),
          getSchoolOwnership(school),
          school.querySelector('.cutoff-score')?.textContent.trim() || "",
          getSchoolGroup(school),
          getSchoolLocation(school),
          school.querySelector('.school-group')?.textContent.trim() || "",
          school.querySelector('.school-link')?.href || ""
        ];
      })
    ];
    
    const schoolsWs = XLSX.utils.aoa_to_sheet(schoolsData);
    
    // Style the schools sheet
    const schoolsRange = XLSX.utils.decode_range(schoolsWs['!ref']);
    applyExcelStyling(schoolsWs, schoolsRange);
    
    // Make header row bold with enhanced styling
    for (let C = schoolsRange.s.c; C <= schoolsRange.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({r: 0, c: C});
      if(!schoolsWs[cell]) continue;
      
      schoolsWs[cell].s = { 
        font: { bold: true, color: { rgb: "FFFFFF" } },
        fill: { patternType: "solid", fgColor: { rgb: "2a9d8f" } },
        alignment: { horizontal: "center", vertical: "center" },
        border: {
          top: { style: "medium", color: { auto: 1 } },
          bottom: { style: "medium", color: { auto: 1 } },
          left: { style: "medium", color: { auto: 1 } },
          right: { style: "medium", color: { auto: 1 } }
        }
      };
    }
    
    // Set custom column widths
    schoolsWs['!cols'] = [
      { wch: 30 },  // 學校名稱
      { wch: 15 }, // 類型
      { wch: 12 }, // 屬性
      { wch: 20 }, // 最低錄取分數
      { wch: 18 },  // 入學管道
      { wch: 15 }, // 地理位置
      { wch: 18 },  // 特色課程數
      { wch: 35 }   // 學校網站
    ];
    
    // Add the schools worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, schoolsWs, "符合學校");
    
    // Add recommendations sheet with enhanced styling
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
    
    // Add watermark worksheet with enhanced styling
    const watermarkData = [
      ["會考落點分析系統 - https://tyctw.github.io/spare/"],
      ["產生日期: " + new Date().toLocaleDateString('zh-TW')],
      [""],
      ["此分析結果僅供參考，請依各校最新招生簡章為準"],
      [""],
      ["資料來源: https://tyctw.github.io/spare/"]
    ];
    
    const watermarkWs = XLSX.utils.aoa_to_sheet(watermarkData);
    
    // Apply special styling to watermark sheet
    const watermarkRange = XLSX.utils.decode_range(watermarkWs['!ref']);
    for (let R = watermarkRange.s.r; R <= watermarkRange.e.r; ++R) {
      for (let C = watermarkRange.s.c; C <= watermarkRange.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({r: R, c: C});
        if(!watermarkWs[cell]) continue;
        
        watermarkWs[cell].s = {
          font: R === 0 ? 
            { bold: true, sz: 14, color: { rgb: "2a9d8f" } } : 
            { italic: true, sz: 11, color: { rgb: "777777" } },
          alignment: { horizontal: "center", vertical: "center" }
        };
      }
    }
    
    // Set watermark sheet column width
    watermarkWs['!cols'] = [{ wch: 100 }];
    
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

function getSchoolGroup(schoolElement) {
  const groupElem = schoolElement.querySelector('.school-group');
  if (groupElem) {
    return groupElem.textContent.trim();
  }
  return "";
}

function getSchoolLocation(schoolElement) {
  const locationElem = schoolElement.querySelector('.school-location');
  if (locationElem) {
    return locationElem.textContent.trim();
  }
  return "";
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

document.addEventListener('DOMContentLoaded', function() {
  initVocationalGroupValidation();
  initRating();
  updateComparisonBadge();
  addStructuredData();
  generateSitemap();
  
  // Track page visits for analytics
  logUserActivity('page_view', {
    path: window.location.pathname,
    referrer: document.referrer,
    screenSize: `${window.innerWidth}x${window.innerHeight}`
  });
});

// Add school comparison functionality
function addSchoolToComparison(schoolName, schoolType, schoolDetails) {
  let comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  
  // Check if school already exists in comparison
  if (comparisonList.some(school => school.name === schoolName)) {
    showNotification('此學校已在比較清單中', 'warning');
    return;
  }
  
  // Limit to maximum 4 schools
  if (comparisonList.length >= 4) {
    showNotification('比較清單最多只能加入4所學校', 'warning');
    return;
  }
  
  // Add school to comparison list with enhanced details
  comparisonList.push({
    name: schoolName,
    type: schoolType,
    details: {
      ...schoolDetails,
      addedOn: new Date().toISOString()
    }
  });
  
  localStorage.setItem('schoolComparison', JSON.stringify(comparisonList));
  updateComparisonBadge();
  
  // Add visual feedback with animation to the button
  const button = event.target.closest('.add-comparison-btn');
  if (button) {
    button.innerHTML = '<i class="fas fa-check"></i> 已加入';
    button.classList.add('added');
    button.disabled = true;
    
    setTimeout(() => {
      button.innerHTML = '<i class="fas fa-check"></i> 已加入比較';
    }, 1000);
  }
  
  showNotification(`已新增 ${schoolName} 到比較清單`, 'success');
}

function removeSchoolFromComparison(schoolName) {
  let comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  
  // Find the column to animate before removal
  const columnIndex = comparisonList.findIndex(school => school.name === schoolName);
  if (columnIndex > -1) {
    const columns = document.querySelectorAll(`.school-column`);
    if (columns[columnIndex]) {
      columns[columnIndex].classList.add('removing');
      // Add animation to all cells in this column
      const table = document.querySelector('.comparison-table');
      if (table) {
        const rows = table.querySelectorAll('tr');
        rows.forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells[columnIndex + 1]) { // +1 because first column is for labels
            cells[columnIndex + 1].classList.add('removing');
          }
        });
      }
    }
  }
  
  // Remove after animation completes
  setTimeout(() => {
    comparisonList = comparisonList.filter(school => school.name !== schoolName);
    localStorage.setItem('schoolComparison', JSON.stringify(comparisonList));
    updateComparisonBadge();
    
    // Update the comparison display after removal
    if (document.getElementById('comparisonContainer')) {
      showSchoolComparison();
    }
    
    showNotification(`已從比較清單中移除 ${schoolName}`, 'info');
  }, 300);
}

function showSchoolComparison() {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  const comparisonContainer = document.getElementById('comparisonContainer');
  
  if (!comparisonContainer) {
    // Create comparison modal if it doesn't exist
    const modal = document.createElement('div');
    modal.id = 'schoolComparisonModal';
    modal.className = 'modal';
    
    modal.innerHTML = `
      <div class="modal-content comparison-modal-content">
        <span class="close" onclick="closeComparisonModal()">&times;</span>
        <h2><i class="fas fa-balance-scale icon"></i> 學校比較</h2>
        <div id="comparisonContainer"></div>
        <button class="confirm-button" onclick="closeComparisonModal()">
          <i class="fas fa-check-circle icon"></i> 關閉
        </button>
      </div>
    `;
    
    document.body.appendChild(modal);
    modal.style.display = 'block';
    
    setTimeout(() => {
      document.querySelector('.comparison-modal-content').classList.add('show');
    }, 10);
  }
  
  const container = document.getElementById('comparisonContainer');
  
  if (comparisonList.length === 0) {
    container.innerHTML = `
      <div class="empty-comparison">
        <i class="fas fa-info-circle icon-large"></i>
        <p>您尚未新增任何學校到比較清單</p>
        <p>請在分析結果中點擊「加入比較」按鈕新增學校</p>
      </div>
    `;
    return;
  }
  
  // Generate comparison table
  let comparisonHTML = `
    <div class="comparison-controls">
      <button onclick="clearComparison()" class="clear-button">
        <i class="fas fa-trash-alt"></i> 清空比較清單
      </button>
      <button onclick="exportComparison()" class="export-button">
        <i class="fas fa-file-export"></i> 匯出比較結果
      </button>
    </div>
    <div class="comparison-table-container">
      <table class="comparison-table">
        <thead>
          <tr>
            <th>比較項目</th>
            ${comparisonList.map(school => `
              <th class="school-column">
                ${school.name}
                <button class="remove-school-btn" onclick="removeSchoolFromComparison('${school.name.replace(/'/g, "\\'")}')">
                  <i class="fas fa-times"></i>
                </button>
              </th>
            `).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>學校類型</td>
            ${comparisonList.map(school => `<td>${school.type || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>學校屬性</td>
            ${comparisonList.map(school => `<td>${school.details?.ownership || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>去年最低錄取分數</td>
            ${comparisonList.map(school => `<td class="score-cell">${school.details?.lastYearCutoff || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>入學管道</td>
            ${comparisonList.map(school => `<td>${school.details?.admissionMethod || '一般入學'}</td>`).join('')}
          </tr>
          <tr>
            <td>地理位置</td>
            ${comparisonList.map(school => `<td>${school.details?.location || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>特色課程數</td>
            ${comparisonList.map(school => `<td>${school.details?.specialPrograms?.length || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>學校網站</td>
            ${comparisonList.map(school => 
              school.details?.website ? 
              `<td><a href="${school.details.website}" target="_blank" class="school-link"><i class="fas fa-external-link-alt"></i> 前往網站</a></td>` : 
              `<td>未提供</td>`
            ).join('')}
          </tr>
          <tr>
            <td>查看詳情</td>
            ${comparisonList.map(school => `
              <td><button class="add-comparison-btn" onclick="showSchoolDetails('${school.name.replace(/'/g, "\\'")}')">
                <i class="fas fa-search"></i> 學校詳情
              </button></td>
            `).join('')}
          </tr>
        </tbody>
      </table>
    </div>
  `;
  
  container.innerHTML = comparisonHTML;
  
  // Add hover effects to table rows
  setTimeout(() => {
    const rows = document.querySelectorAll('.comparison-table tr');
    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        row.classList.add('highlight-hover');
      });
      row.addEventListener('mouseleave', () => {
        row.classList.remove('highlight-hover');
      });
    });
  }, 100);
}

function closeComparisonModal() {
  const modal = document.getElementById('schoolComparisonModal');
  if (modal) {
    modal.style.display = 'none';
    modal.remove();
  }
}

function clearComparison() {
  if (confirm('確定要清空所有比較的學校嗎？')) {
    // Add fade-out animation to comparison table
    const table = document.querySelector('.comparison-table');
    if (table) {
      table.classList.add('fade-out');
    }
    
    setTimeout(() => {
      localStorage.setItem('schoolComparison', '[]');
      updateComparisonBadge();
      showSchoolComparison();
      showNotification('已清空比較清單', 'info');
    }, 300);
  }
}

function exportComparison() {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  if (comparisonList.length === 0) {
    showNotification('沒有可匯出的比較資料', 'warning');
    return;
  }
  
  showExportComparisonOptions();
  
  logUserActivity('export_comparison', { schools: comparisonList.map(s => s.name) });
}

function showExportComparisonOptions() {
  const exportMenu = document.createElement('div');
  exportMenu.className = 'export-menu';
  exportMenu.innerHTML = `
    <div class="export-menu-content">
      <h3><i class="fas fa-file-export"></i> 選擇比較結果匯出格式</h3>
      <button onclick="exportComparisonFormat('txt')">
        <i class="fas fa-file-alt"></i> 文字檔 (.txt)
      </button>
      <button onclick="exportComparisonFormat('pdf')">
        <i class="fas fa-file-pdf"></i> PDF檔 (.pdf)
      </button>
      <button onclick="exportComparisonFormat('excel')">
        <i class="fas fa-file-excel"></i> Excel檔 (.xlsx)
      </button>
      <button onclick="exportComparisonFormat('image')">
        <i class="fas fa-image"></i> 圖片檔 (.png)
      </button>
      <button onclick="exportComparisonFormat('print')">
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

function exportComparisonFormat(format) {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  
  closeExportMenu();
  showLoading();
  
  setTimeout(async () => {
    try {
      switch (format) {
        case 'txt':
          exportComparisonToText(comparisonList);
          break;
        case 'pdf':
          await exportComparisonToPdf(comparisonList);
          break;
        case 'excel':
          await exportComparisonToExcel(comparisonList);
          break;
        case 'image':
          await exportComparisonToImage();
          break;
        case 'print':
          printComparisonResults(comparisonList);
          break;
      }
      showNotification('比較資料已成功匯出', 'success');
    } catch (error) {
      console.error('Export error:', error);
      showNotification('匯出失敗，請稍後再試', 'error');
    } finally {
      hideLoading();
    }
  }, 500);
}

function exportComparisonToText(comparisonList) {
  // Create more detailed comparison text
  let comparisonText = '學校比較結果\n';
  comparisonText += '====================\n\n';
  comparisonText += `產生時間: ${new Date().toLocaleString('zh-TW')}\n`;
  comparisonText += `比較學校數量: ${comparisonList.length}所\n\n`;
  
  comparisonText += '比較項目\t' + comparisonList.map(school => school.name).join('\t') + '\n';
  comparisonText += '學校類型\t' + comparisonList.map(school => school.type || '未知').join('\t') + '\n';
  comparisonText += '學校屬性\t' + comparisonList.map(school => school.details?.ownership || '未知').join('\t') + '\n';
  comparisonText += '最低錄取\t' + comparisonList.map(school => school.details?.lastYearCutoff || '未知').join('\t') + '\n';
  comparisonText += '入學管道\t' + comparisonList.map(school => school.details?.admissionMethod || '一般入學').join('\t') + '\n';
  comparisonText += '地理位置\t' + comparisonList.map(school => school.details?.location || '未知').join('\t') + '\n\n';
  
  comparisonText += '備註: 此比較結果僅供參考，請以各校最新招生簡章為準。\n';
  comparisonText += '資料來源: 會考落點分析系統 https://tyctw.github.io/spare/';
  
  const blob = new Blob([comparisonText], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, '學校比較結果.txt');
}

async function exportComparisonToPdf(comparisonList) {
  if (!window.jsPDF) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // Add header
  doc.setFillColor(42, 157, 143);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('學校比較結果', 105, 12, { align: 'center' });
  
  // Add timestamp
  const timestamp = new Date().toLocaleString('zh-TW');
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  doc.text(`產生時間: ${timestamp} | 比較學校數量: ${comparisonList.length}所`, 105, 20, { align: 'center' });
  
  // Add schools table
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  
  // Set up table headers
  const headers = ['比較項目'];
  comparisonList.forEach(school => {
    headers.push(school.name);
  });
  
  // Set up table rows
  const tableData = [
    headers,
    ['學校類型', ...comparisonList.map(school => school.type || '未知')],
    ['學校屬性', ...comparisonList.map(school => school.details?.ownership || '未知')],
    ['最低錄取', ...comparisonList.map(school => school.details?.lastYearCutoff || '未知')],
    ['入學管道', ...comparisonList.map(school => school.details?.admissionMethod || '一般入學')],
    ['地理位置', ...comparisonList.map(school => school.details?.location || '未知')]
  ];
  
  // Calculate column widths
  const columnCount = headers.length;
  const columnWidth = 190 / columnCount;
  
  // Draw table
  let y = 40;
  tableData.forEach((row, rowIndex) => {
    // Set background color for headers
    if (rowIndex === 0) {
      doc.setFillColor(230, 230, 230);
      doc.rect(10, y - 5, 190, 10, 'F');
    } else if (rowIndex % 2 === 1) {
      doc.setFillColor(245, 245, 245);
      doc.rect(10, y - 5, 190, 10, 'F');
    }
    
    // Draw cells
    row.forEach((cell, cellIndex) => {
      const x = 10 + (cellIndex * columnWidth);
      // First column bold
      if (cellIndex === 0) {
        doc.setFont('helvetica', 'bold');
      } else {
        doc.setFont('helvetica', 'normal');
      }
      
      // Special formatting for header row
      if (rowIndex === 0) {
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(42, 157, 143);
      } else {
        doc.setTextColor(0);
      }
      
      // Handle long text
      const cellText = cell.toString();
      if (cellText.length > 15) {
        doc.setFontSize(8);
      } else {
        doc.setFontSize(10);
      }
      
      doc.text(cellText, x + (columnWidth / 2), y, { align: 'center' });
    });
    
    y += 10;
  });
  
  // Add footer
  y += 10;
  doc.setFont('helvetica', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text('此比較結果僅供參考，請以各校最新招生簡章為準。', 105, y, { align: 'center' });
  
  y += 5;
  doc.text('資料來源: 會考落點分析系統 https://tyctw.github.io/spare/', 105, y, { align: 'center' });
  
  // Add watermark to each page
  const pageCount = doc.internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(150);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(`會考落點分析系統 - 第 ${i} 頁，共 ${pageCount} 頁`, 105, 295, { align: 'center' });
  }
  
  doc.save('學校比較結果.pdf');
}

async function exportComparisonToExcel(comparisonList) {
  if (!window.XLSX) {
    await loadScript('https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js');
  }
  
  // Create workbook
  const wb = XLSX.utils.book_new();
  wb.Props = {
    Title: "學校比較結果",
    Subject: "會考落點分析",
    Author: "會考落點分析系統",
    CreatedDate: new Date()
  };
  
  // Prepare data for the comparison sheet
  const comparisonData = [
    ["學校比較結果"],
    [],
    ["產生時間", new Date().toLocaleDateString('zh-TW')],
    ["比較學校數量", comparisonList.length + "所"],
    [],
    ["比較項目", ...comparisonList.map(s => s.name)],
    ["學校類型", ...comparisonList.map(s => s.type || '未知')],
    ["學校屬性", ...comparisonList.map(s => s.details?.ownership || '未知')],
    ["最低錄取", ...comparisonList.map(s => s.details?.lastYearCutoff || '未知')],
    ["入學管道", ...comparisonList.map(s => s.details?.admissionMethod || '一般入學')],
    ["地理位置", ...comparisonList.map(s => s.details?.location || '未知')]
  ];
  
  // Create the worksheet
  const ws = XLSX.utils.aoa_to_sheet(comparisonData);
  
  // Style the worksheet
  const range = XLSX.utils.decode_range(ws['!ref']);
  for (let R = range.s.r; R <= range.e.r; ++R) {
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell = XLSX.utils.encode_cell({r: R, c: C});
      if(!ws[cell]) continue;
      
      ws[cell].s = {
        font: { name: "Arial", sz: 11 },
        alignment: { vertical: "center", wrapText: true },
        border: {
          top: { style: "thin", color: { rgb: "DDDDDD" } },
          bottom: { style: "thin", color: { rgb: "DDDDDD" } },
          left: { style: "thin", color: { rgb: "DDDDDD" } },
          right: { style: "thin", color: { rgb: "DDDDDD" } }
        }
      };
      
      if (R === 0) {
        ws[cell].s.font = { bold: true, sz: 14, color: { rgb: "2A9D8F" } };
      } else if (R === 5) {
        ws[cell].s.font = { bold: true, color: { rgb: "FFFFFF" } };
        ws[cell].s.fill = { patternType: "solid", fgColor: { rgb: "2A9D8F" } };
      } else if (C === 0 && R > 5) {
        ws[cell].s.font = { bold: true };
        ws[cell].s.fill = { patternType: "solid", fgColor: { rgb: "F4F1DE" } };
      } else if (R % 2 === 0 && R > 5) {
        ws[cell].s.fill = { patternType: "solid", fgColor: { rgb: "F9F9F9" } };
      }
    }
  }
  
  // Set column widths
  ws['!cols'] = [
    { wch: 15 }, // 比較項目
    ...comparisonList.map(() => ({ wch: 20 })) // School columns
  ];
  
  // Merge title cell
  ws['!merges'] = [
    { s: {r: 0, c: 0}, e: {r: 0, c: Math.min(comparisonList.length, 3)} }
  ];
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, "學校比較");
  
  // Create detail sheets for each school
  comparisonList.forEach(school => {
    // Prepare data for individual school
    const schoolData = [
      [school.name + " 詳細資料"],
      [],
      ["類型", school.type || "未知"],
      ["屬性", school.details?.ownership || "未知"],
      ["最低錄取分數", school.details?.lastYearCutoff || "未知"],
      ["入學管道", school.details?.admissionMethod || "一般入學"],
      ["地理位置", school.details?.location || "未知"],
      ["學校網站", school.details?.website || "未提供"]
    ];
    
    // Create the worksheet
    const schoolWs = XLSX.utils.aoa_to_sheet(schoolData);
    
    // Style the worksheet
    const schoolRange = XLSX.utils.decode_range(schoolWs['!ref']);
    for (let R = schoolRange.s.r; R <= schoolRange.e.r; ++R) {
      for (let C = schoolRange.s.c; C <= schoolRange.e.c; ++C) {
        const cell = XLSX.utils.encode_cell({r: R, c: C});
        if(!schoolWs[cell]) continue;
        
        schoolWs[cell].s = {
          font: { name: "Arial", sz: 11 },
          alignment: { vertical: "center", wrapText: true }
        };
        
        if (R === 0) {
          schoolWs[cell].s.font = { bold: true, sz: 14, color: { rgb: "2A9D8F" } };
        } else if (C === 0 && R > 1) {
          schoolWs[cell].s.font = { bold: true };
          schoolWs[cell].s.fill = { patternType: "solid", fgColor: { rgb: "F4F1DE" } };
        }
      }
    }
    
    // Set column widths
    schoolWs['!cols'] = [{ wch: 15 }, { wch: 30 }];
    
    // Merge title cell
    schoolWs['!merges'] = [
      { s: {r: 0, c: 0}, e: {r: 0, c: 1} }
    ];
    
    // Add the worksheet to the workbook
    XLSX.utils.book_append_sheet(wb, schoolWs, school.name.slice(0, 20)); // Limit sheet name length
  });
  
  // Add watermark sheet
  const watermarkData = [
    ["會考落點分析系統 - 學校比較結果"],
    ["產生時間: " + new Date().toLocaleDateString('zh-TW')],
    [""],
    ["此比較結果僅供參考，請以各校最新招生簡章為準"],
    [""],
    ["資料來源: https://tyctw.github.io/spare/"]
  ];
  
  const watermarkWs = XLSX.utils.aoa_to_sheet(watermarkData);
  XLSX.utils.book_append_sheet(wb, watermarkWs, "關於");
  
  // Create and download the Excel file
  XLSX.writeFile(wb, "學校比較結果.xlsx");
}

async function exportComparisonToImage() {
  try {
    if (!window.html2canvas) {
      await loadScript('https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js');
    }
    
    const comparisonTable = document.querySelector('.comparison-table-container');
    if (!comparisonTable) {
      throw new Error('比較表格不存在');
    }
    
    // Create a temporary container with styled header
    const container = document.createElement('div');
    container.style.cssText = 'background: white; padding: 20px; font-family: Arial, sans-serif;';
    
    // Add header
    const header = document.createElement('div');
    header.style.cssText = 'text-align: center; margin-bottom: 20px;';
    header.innerHTML = `
      <h2 style="color: #2a9d8f; margin: 0;">學校比較結果</h2>
      <p style="color: #666; margin: 5px 0;">產生時間: ${new Date().toLocaleString('zh-TW')}</p>
    `;
    container.appendChild(header);
    
    // Clone the comparison table
    const tableClone = comparisonTable.cloneNode(true);
    // Remove action buttons
    tableClone.querySelectorAll('.remove-school-btn').forEach(btn => btn.remove());
    container.appendChild(tableClone);
    
    // Add footer
    const footer = document.createElement('div');
    footer.style.cssText = 'text-align: center; margin-top: 20px; font-style: italic; color: #666; font-size: 12px;';
    footer.innerHTML = '資料來源: 會考落點分析系統 https://tyctw.github.io/spare/';
    container.appendChild(footer);
    
    // Append to body temporarily but hide it
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    document.body.appendChild(container);
    
    // Render to canvas
    const canvas = await html2canvas(container, {
      scale: 2, // Higher resolution
      backgroundColor: 'white',
      logging: false
    });
    
    // Clean up
    document.body.removeChild(container);
    
    // Convert canvas to image and download
    const imageUrl = canvas.toDataURL('image/png');
    const link = document.createElement('a');
    link.download = '學校比較結果.png';
    link.href = imageUrl;
    link.click();
    
  } catch (error) {
    console.error('Image export error:', error);
    showNotification('圖片匯出失敗', 'error');
    throw error;
  }
}

function printComparisonResults(comparisonList) {
  const printWindow = window.open('', '_blank');
  
  if (!printWindow) {
    alert('請允許開啟彈出視窗以啟用列印功能');
    return;
  }
  
  // Get current date/time
  const timestamp = new Date().toLocaleString('zh-TW');
  
  printWindow.document.write(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>學校比較結果</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0-beta3/css/all.min.css">
      <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+TC:wght@300;400;500;700&display=swap" rel="stylesheet">
      <style>
        @media print {
          body { 
            font-family: 'Noto Sans TC', sans-serif;
            color: #264653;
            background: white;
            margin: 0;
            padding: 20px;
          }
          
          .print-header {
            text-align: center;
            border-bottom: 3px solid #2a9d8f;
            padding-bottom: 20px;
            margin-bottom: 30px;
          }
          
          .print-logo {
            font-size: 3rem;
            color: #2a9d8f;
            margin-bottom: 10px;
          }
          
          .print-title {
            font-size: 2rem;
            color: #2a9d8f;
            margin: 0;
          }
          
          .print-subtitle {
            font-size: 1rem;
            color: #666;
            margin: 8px 0 0 0;
          }
          
          .print-timestamp {
            text-align: right;
            font-style: italic;
            color: #666;
            margin-bottom: 20px;
          }
          
          table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 20px;
            page-break-inside: avoid;
          }
          
          th, td {
            padding: 10px;
            text-align: center;
            border: 1px solid #ddd;
          }
          
          th {
            background-color: #2a9d8f;
            color: white;
            font-weight: bold;
          }
          
          tr:nth-child(even) {
            background-color: #f9f9f9;
          }
          
          td:first-child {
            background-color: #f4f1de;
            font-weight: bold;
            text-align: left;
          }
          
          .print-footer {
            text-align: center;
            margin-top: 30px;
            font-style: italic;
            color: #666;
            font-size: 0.9rem;
            padding-top: 10px;
            border-top: 1px dashed #ddd;
          }
          
          .print-page-number {
            text-align: center;
            font-size: 0.8rem;
            color: #999;
            margin-top: 20px;
          }
          
          .watermark {
            position: fixed;
            bottom: 20px;
            right: 20px;
            font-size: 0.8rem;
            color: #ccc;
            z-index: -1;
          }
          
          .school-details {
            background: #f9f9f9;
            padding: 15px;
            margin-bottom: 20px;
            border-radius: 5px;
            border-left: 3px solid #2a9d8f;
            page-break-inside: avoid;
          }
          
          .school-details h3 {
            color: #2a9d8f;
            margin-top: 0;
            border-bottom: 1px solid #eee;
            padding-bottom: 10px;
          }
          
          @page {
            size: A4;
            margin: 2cm;
          }
        }
      </style>
    </head>
    <body>
      <div class="watermark">會考落點分析系統</div>
      
      <div class="print-header">
        <div class="print-logo"><i class="fas fa-exchange-alt"></i></div>
        <h1 class="print-title">學校比較結果</h1>
        <p class="print-subtitle">本比較結果僅供參考，請以各校最新招生簡章為準</p>
      </div>
      
      <div class="print-timestamp">
        產生時間: ${timestamp} | 共比較 ${comparisonList.length} 所學校
      </div>
      
      <table>
        <thead>
          <tr>
            <th style="min-width: 100px;">比較項目</th>
            ${comparisonList.map(school => `<th>${school.name}</th>`).join('')}
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>學校類型</td>
            ${comparisonList.map(school => `<td>${school.type || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>學校屬性</td>
            ${comparisonList.map(school => `<td>${school.details?.ownership || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>最低錄取分數</td>
            ${comparisonList.map(school => `<td>${school.details?.lastYearCutoff || '未知'}</td>`).join('')}
          </tr>
          <tr>
            <td>入學管道</td>
            ${comparisonList.map(school => `<td>${school.details?.admissionMethod || '一般入學'}</td>`).join('')}
          </tr>
          <tr>
            <td>地理位置</td>
            ${comparisonList.map(school => `<td>${school.details?.location || '未知'}</td>`).join('')}
          </tr>
        </tbody>
      </table>
      
      <div class="school-details-section">
        <h2 style="color: #2a9d8f; border-bottom: 2px solid #e9c46a; padding-bottom: 10px;">
          學校詳細資訊
        </h2>
        
        ${comparisonList.map(school => `
          <div class="school-details">
            <h3>${school.name}</h3>
            <div class="detail-row">
              <div class="detail-label">學校類型：</div>
              <div>${school.type || '未知'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">學校屬性：</div>
              <div>${school.details?.ownership || '未知'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">最低錄取分數：</div>
              <div>${school.details?.lastYearCutoff || '未知'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">入學管道：</div>
              <div>${school.details?.admissionMethod || '一般入學'}</div>
            </div>
            <div class="detail-row">
              <div class="detail-label">地理位置：</div>
              <div>${school.details?.location || '未知'}</div>
            </div>
          </div>
        `).join('')}
      </div>
      
      <div class="print-footer">
        此比較結果僅供參考，請以各校最新招生簡章為準。<br>
        資料來源: 會考落點分析系統 https://tyctw.github.io/spare/
      </div>
      
      <div class="print-page-number">頁 <span class="pageNumber"></span></div>
      
      <script>
        window.onload = function() {
          window.print();
          setTimeout(() => {
            window.close();
          }, 1000);
        }
      </script>
    </body>
  </html>
  `);
  
  printWindow.document.close();
}

function showSchoolDetails(schoolName) {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  const school = comparisonList.find(s => s.name === schoolName);
  
  if (!school) {
    showNotification('無法顯示學校詳細資訊', 'error');
    return;
  }
  
  // Create modal for school details
  const modal = document.createElement('div');
  modal.id = 'schoolDetailsModal';
  modal.className = 'modal';
  
  // Enhanced school details with more information and visualization
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 800px;">
      <span class="close" onclick="closeSchoolDetailsModal()">&times;</span>
      <h2 style="color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-school"></i> ${school.name} 詳細資訊
      </h2>
      
      <div class="school-detail-tabs">
        <button class="school-detail-tab active" onclick="switchSchoolTab(event, 'basic-info')">
          <i class="fas fa-info-circle"></i> 基本資訊
        </button>
        <button class="school-detail-tab" onclick="switchSchoolTab(event, 'admission-info')">
          <i class="fas fa-user-graduate"></i> 入學資訊
        </button>
        <button class="school-detail-tab" onclick="switchSchoolTab(event, 'program-info')">
          <i class="fas fa-book"></i> 課程特色
        </button>
        <button class="school-detail-tab" onclick="switchSchoolTab(event, 'facilities')">
          <i class="fas fa-building"></i> 校園設施
        </button>
      </div>
      
      <div class="school-detail-content active" id="basic-info">
        <div class="school-info-grid">
          <div class="school-info-item">
            <div class="info-label"><i class="fas fa-graduation-cap"></i> 學校類型</div>
            <div class="info-value">${school.type || '未知'}</div>
          </div>
          <div class="school-info-item">
            <div class="info-label"><i class="fas fa-university"></i> 學校屬性</div>
            <div class="info-value">${school.details?.ownership || '未知'}</div>
          </div>
          <div class="school-info-item">
            <div class="info-label"><i class="fas fa-map-marker-alt"></i> 地理位置</div>
            <div class="info-value">${school.details?.location || '未提供'}</div>
          </div>
          <div class="school-info-item">
            <div class="info-label"><i class="fas fa-phone"></i> 聯絡電話</div>
            <div class="info-value">${school.details?.phone || '未提供'}</div>
          </div>
          <div class="school-info-item">
            <div class="info-label"><i class="fas fa-envelope"></i> 聯絡信箱</div>
            <div class="info-value">${school.details?.email || '未提供'}</div>
          </div>
          <div class="school-info-item">
            <div class="info-label"><i class="fas fa-globe"></i> 學校網站</div>
            <div class="info-value">
              ${school.details?.website ? 
                `<a href="${school.details.website}" target="_blank" class="school-link"><i class="fas fa-external-link-alt"></i> 前往網站</a>` : 
                '未提供'}
            </div>
          </div>
        </div>
        
        <div class="school-description">
          <h3><i class="fas fa-info-circle"></i> 學校簡介</h3>
          <p>${school.details?.description || '暫無學校簡介資訊。'}</p>
        </div>
      </div>
      
      <div class="school-detail-content" id="admission-info">
        <div class="admission-info-container">
          <div class="admission-stats">
            <h3><i class="fas fa-chart-line"></i> 入學統計</h3>
            <div class="stats-grid">
              <div class="stat-item">
                <div class="stat-value">${school.details?.lastYearCutoff || '未知'}</div>
                <div class="stat-label">去年最低錄取分數</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${school.details?.applicantsCount || '未知'}</div>
                <div class="stat-label">去年報名人數</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${school.details?.acceptedCount || '未知'}</div>
                <div class="stat-label">去年錄取人數</div>
              </div>
              <div class="stat-item">
                <div class="stat-value">${school.details?.acceptanceRate || '未知'}</div>
                <div class="stat-label">錄取率</div>
              </div>
            </div>
          </div>
          
          <div class="admission-requirements">
            <h3><i class="fas fa-clipboard-list"></i> 入學要求</h3>
            <ul>
              ${school.details?.admissionRequirements ? 
                school.details.admissionRequirements.map(req => `<li>${req}</li>`).join('') : 
                '<li>暫無詳細入學要求資訊。</li>'}
            </ul>
          </div>
          
          <div class="admission-timeline">
            <h3><i class="fas fa-calendar-alt"></i> 入學時程</h3>
            <div class="timeline">
              ${school.details?.admissionTimeline ? 
                generateTimelineHTML(school.details.admissionTimeline) : 
                '<p>暫無入學時程資訊。</p>'}
            </div>
          </div>
        </div>
      </div>
      
      <div class="school-detail-content" id="program-info">
        <div class="program-info-container">
          <h3><i class="fas fa-star"></i> 特色課程</h3>
          <div class="program-list">
            ${school.details?.specialPrograms ? 
              school.details.specialPrograms.map(program => `
                <div class="program-item">
                  <div class="program-title">${program.title}</div>
                  <div class="program-description">${program.description}</div>
                </div>
              `).join('') : 
              '<p>暫無特色課程資訊。</p>'}
          </div>
          
          <h3><i class="fas fa-trophy"></i> 學生成就</h3>
          <div class="achievements">
            ${school.details?.achievements ? 
              school.details.achievements.map(achievement => `
                <div class="achievement-item">
                  <i class="fas fa-award"></i>
                  <div>${achievement}</div>
                </div>
              `).join('') : 
              '<p>暫無學生成就資訊。</p>'}
          </div>
        </div>
      </div>
      
      <div class="school-detail-content" id="facilities">
        <div class="facilities-container">
          <h3><i class="fas fa-building"></i> 校園設施</h3>
          <div class="facilities-grid">
            ${school.details?.facilities ? 
              school.details.facilities.map(facility => `
                <div class="facility-item">
                  <i class="${getFacilityIcon(facility.type)}"></i>
                  <div class="facility-name">${facility.name}</div>
                  <div class="facility-description">${facility.description}</div>
                </div>
              `).join('') : 
              '<p>暫無校園設施資訊。</p>'}
          </div>
        </div>
      </div>
      
      <div class="school-actions">
        <button class="confirm-button" onclick="closeSchoolDetailsModal()">
          <i class="fas fa-check-circle"></i> 關閉
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
  
  // Add styles for school details modal
  const style = document.createElement('style');
  style.textContent = `
    .school-detail-tabs {
      display: flex;
      overflow-x: auto;
      border-bottom: 1px solid #ddd;
      margin: 20px 0;
    }
    
    .school-detail-tab {
      padding: 10px 20px;
      background: none;
      border: none;
      cursor: pointer;
      font-weight: 500;
      color: var(--text-color);
      transition: all 0.3s ease;
      white-space: nowrap;
    }
    
    .school-detail-tab:hover {
      color: var(--primary-color);
    }
    
    .school-detail-tab.active {
      color: var(--primary-color);
      border-bottom: 3px solid var(--primary-color);
    }
    
    .school-detail-content {
      display: none;
      animation: fadeIn 0.3s ease-out;
    }
    
    .school-detail-content.active {
      display: block;
    }
    
    .school-info-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      margin-bottom: 20px;
    }
    
    .school-info-item {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .info-label {
      font-size: 0.9rem;
      color: #666;
      margin-bottom: 5px;
      display: flex;
      align-items: center;
      gap: 8px;
    }
    
    .info-value {
      font-weight: 500;
      font-size: 1.1rem;
    }
    
    .school-description {
      background: #f9f9f9;
      padding: 20px;
      border-radius: 8px;
      margin-top: 20px;
      border-left: 3px solid var(--primary-color);
    }
    
    .admission-stats {
      margin-bottom: 20px;
    }
    
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .stat-item {
      background: linear-gradient(135deg, var(--primary-color), #239687);
      color: white;
      padding: 15px;
      border-radius: 8px;
      text-align: center;
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    
    .stat-value {
      font-size: 1.8rem;
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .stat-label {
      font-size: 0.9rem;
      opacity: 0.9;
    }
    
    .admission-requirements ul {
      list-style-type: none;
      padding: 0;
    }
    
    .admission-requirements li {
      padding: 8px 0 8px 25px;
      position: relative;
    }
    
    .admission-requirements li:before {
      content: "✓";
      position: absolute;
      left: 0;
      color: var(--primary-color);
      font-weight: bold;
    }
    
    .timeline {
      position: relative;
      max-width: 1200px;
      margin: 20px auto;
    }
    
    .timeline::after {
      content: '';
      position: absolute;
      width: 6px;
      background-color: #e9c46a;
      top: 0;
      bottom: 0;
      left: 50%;
      margin-left: -3px;
      border-radius: 3px;
    }
    
    .timeline-item {
      padding: 10px 40px;
      position: relative;
      width: 50%;
      box-sizing: border-box;
    }
    
    .timeline-item::after {
      content: '';
      position: absolute;
      width: 20px;
      height: 20px;
      background-color: white;
      border: 4px solid var(--primary-color);
      border-radius: 50%;
      top: 15px;
      z-index: 1;
    }
    
    .timeline-left {
      left: 0;
    }
    
    .timeline-right {
      left: 50%;
    }
    
    .timeline-left::after {
      right: -10px;
    }
    
    .timeline-right::after {
      left: -10px;
    }
    
    .timeline-content {
      padding: 15px;
      background-color: #f9f9f9;
      border-radius: 8px;
      box-shadow: 0 3px 8px rgba(0,0,0,0.1);
    }
    
    .timeline-date {
      font-weight: bold;
      color: var(--primary-color);
      margin-bottom: 5px;
    }
    
    .program-item {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      margin-bottom: 15px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      border-left: 3px solid var(--accent-color);
    }
    
    .program-title {
      font-weight: bold;
      font-size: 1.1rem;
      margin-bottom: 8px;
      color: var(--accent-color);
    }
    
    .program-description {
      font-size: 0.95rem;
      color: #666;
    }
    
    .achievements {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .achievement-item {
      background: #f9f9f9;
      padding: 10px 15px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      gap: 10px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
    }
    
    .achievement-item i {
      color: #f1c40f;
      font-size: 1.2rem;
    }
    
    .facilities-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      gap: 15px;
      margin-top: 15px;
    }
    
    .facility-item {
      background: #f9f9f9;
      padding: 15px;
      border-radius: 8px;
      box-shadow: 0 2px 5px rgba(0,0,0,0.05);
      text-align: center;
      transition: all 0.3s ease;
    }
    
    .facility-item:hover {
      transform: translateY(-3px);
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    
    .facility-item i {
      font-size: 2rem;
      color: var(--primary-color);
      margin-bottom: 10px;
    }
    
    .facility-name {
      font-weight: bold;
      margin-bottom: 5px;
    }
    
    .facility-description {
      font-size: 0.9rem;
      color: #666;
    }
    
    /* Dark mode adjustments */
    .dark-mode .school-info-item,
    .dark-mode .school-description,
    .dark-mode .program-item,
    .dark-mode .timeline-content,
    .dark-mode .achievement-item,
    .dark-mode .facility-item {
      background: rgba(255, 255, 255, 0.05);
    }
    
    /* Mobile adjustments */
    @media (max-width: 768px) {
      .school-detail-tabs {
        flex-wrap: wrap;
      }
      
      .school-detail-tab {
        font-size: 0.9rem;
        padding: 8px 15px;
      }
      
      .timeline::after {
        left: 31px;
      }
      
      .timeline-item {
        width: 100%;
        padding-left: 70px;
        padding-right: 25px;
      }
      
      .timeline-right {
        left: 0;
      }
      
      .timeline-left::after, .timeline-right::after {
        left: 20px;
      }
    }
  `;
  document.head.appendChild(style);
}

function closeSchoolDetailsModal() {
  const modal = document.getElementById('schoolDetailsModal');
  if (modal) {
    modal.style.display = 'none';
    modal.remove();
  }
}

function switchSchoolTab(event, tabId) {
  // Hide all content sections
  document.querySelectorAll('.school-detail-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.school-detail-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to clicked tab
  event.currentTarget.classList.add('active');
  
  // Show selected content
  document.getElementById(tabId).classList.add('active');
}

function generateTimelineHTML(timeline) {
  if (!timeline || !Array.isArray(timeline) || timeline.length === 0) {
    return '<p>暫無入學時程資訊。</p>';
  }
  
  let html = '';
  timeline.forEach((item, index) => {
    const position = index % 2 === 0 ? 'timeline-left' : 'timeline-right';
    html += `
      <div class="timeline-item ${position}">
        <div class="timeline-content">
          <div class="timeline-date">${item.date}</div>
          <div class="timeline-event">${item.event}</div>
        </div>
      </div>
    `;
  });
  
  return html;
}

function getFacilityIcon(facilityType) {
  const iconMap = {
    'library': 'fas fa-book',
    'laboratory': 'fas fa-flask',
    'sports': 'fas fa-running',
    'auditorium': 'fas fa-theater-masks',
    'cafe': 'fas fa-utensils',
    'dorm': 'fas fa-bed',
    'computer': 'fas fa-desktop',
    'art': 'fas fa-palette',
    'music': 'fas fa-music',
    'pool': 'fas fa-swimming-pool',
    'garden': 'fas fa-leaf'
  };
  
  return iconMap[facilityType] || 'fas fa-building';
}

// Function to add school visualization with enhanced data display
function showAdvancedComparisonView() {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  
  if (comparisonList.length === 0) {
    showNotification('請先加入學校到比較清單', 'warning');
    return;
  }
  
  closeComparisonModal();
  
  // Create advanced comparison modal
  const modal = document.createElement('div');
  modal.id = 'advancedComparisonModal';
  modal.className = 'modal';
  
  modal.innerHTML = `
    <div class="modal-content" style="max-width: 90%; width: 1000px; max-height: 85vh; overflow-y: auto;">
      <span class="close" onclick="closeAdvancedComparisonModal()">&times;</span>
      <h2 style="color: var(--primary-color); display: flex; align-items: center; gap: 10px;">
        <i class="fas fa-chart-bar"></i> 進階學校比較分析
      </h2>
      
      <div class="comparison-view-tabs">
        <div class="comparison-tab active" onclick="switchComparisonTab(event, 'table-view')">
          <i class="fas fa-table"></i> 表格視圖
        </div>
        <div class="comparison-tab" onclick="switchComparisonTab(event, 'card-view')">
          <i class="fas fa-id-card"></i> 卡片視圖
        </div>
      </div>
      
      <div class="comparison-view-content active" id="table-view">
        <div class="comparison-table-container">
          <table class="comparison-table">
            <thead>
              <tr>
                <th>比較項目</th>
                ${comparisonList.map(school => `
                  <th class="school-column">
                    ${school.name}
                    <button class="remove-school-btn" onclick="removeSchoolFromComparison('${school.name.replace(/'/g, "\\'")}')">
                      <i class="fas fa-times"></i>
                    </button>
                  </th>
                `).join('')}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>學校類型</td>
                ${comparisonList.map(school => `<td>${school.type || '未知'}</td>`).join('')}
              </tr>
              <tr>
                <td>學校屬性</td>
                ${comparisonList.map(school => `<td>${school.details?.ownership || '未知'}</td>`).join('')}
              </tr>
              <tr>
                <td>去年最低錄取分數</td>
                ${comparisonList.map(school => `<td class="score-cell">${school.details?.lastYearCutoff || '未知'}</td>`).join('')}
              </tr>
              <tr>
                <td>入學管道</td>
                ${comparisonList.map(school => `<td>${school.details?.admissionMethod || '一般入學'}</td>`).join('')}
              </tr>
              <tr>
                <td>地理位置</td>
                ${comparisonList.map(school => `<td>${school.details?.location || '未知'}</td>`).join('')}
              </tr>
              <tr>
                <td>特色課程數</td>
                ${comparisonList.map(school => `<td>${school.details?.specialPrograms?.length || '未知'}</td>`).join('')}
              </tr>
              <tr>
                <td>學校網站</td>
                ${comparisonList.map(school => 
                  school.details?.website ? 
                  `<td><a href="${school.details.website}" target="_blank" class="school-link"><i class="fas fa-external-link-alt"></i> 前往網站</a></td>` : 
                  `<td>未提供</td>`
                ).join('')}
              </tr>
              <tr>
                <td>查看詳情</td>
                ${comparisonList.map(school => `
                  <td><button class="add-comparison-btn" onclick="showSchoolDetails('${school.name.replace(/'/g, "\\'")}')">
                    <i class="fas fa-search"></i> 學校詳情
                  </button></td>
                `).join('')}
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <div class="comparison-view-content" id="card-view">
        <div class="school-cards-container">
          ${comparisonList.map(school => `
            <div class="school-card">
              <div class="school-card-header">
                <div class="school-card-title">${school.name}</div>
                <div class="school-card-badge">${school.type || '未知'}</div>
              </div>
              <div class="school-card-content">
                <div class="school-card-item">
                  <div class="school-card-label">學校屬性</div>
                  <div class="school-card-value">${school.details?.ownership || '未知'}</div>
                </div>
                <div class="school-card-item">
                  <div class="school-card-label">最低錄取分數</div>
                  <div class="school-card-value">${school.details?.lastYearCutoff || '未知'}</div>
                </div>
                <div class="school-card-item">
                  <div class="school-card-label">入學管道</div>
                  <div class="school-card-value">${school.details?.admissionMethod || '一般入學'}</div>
                </div>
                <div class="school-card-item">
                  <div class="school-card-label">地理位置</div>
                  <div class="school-card-value">${school.details?.location || '未知'}</div>
                </div>
              </div>
              <div class="school-card-actions">
                <button class="school-card-button" onclick="showSchoolDetails('${school.name.replace(/'/g, "\\'")}')">
                  <i class="fas fa-search"></i> 查看詳情
                </button>
                <button class="school-card-button" style="margin-left: 10px; background: #e74c3c;" onclick="removeSchoolFromComparison('${school.name.replace(/'/g, "\\'")}')">
                  <i class="fas fa-trash-alt"></i> 移除
                </button>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
      
      <div style="text-align: center; margin-top: 20px;">
        <button class="confirm-button" onclick="exportComparison()">
          <i class="fas fa-file-export"></i> 匯出比較結果
        </button>
        <button class="confirm-button" style="margin-left: 10px; background: #e74c3c;" onclick="clearComparison()">
          <i class="fas fa-trash-alt"></i> 清空比較
        </button>
      </div>
    </div>
  `;
  
  document.body.appendChild(modal);
  modal.style.display = 'block';
}

function closeAdvancedComparisonModal() {
  const modal = document.getElementById('advancedComparisonModal');
  if (modal) {
    modal.style.display = 'none';
    modal.remove();
  }
}

function switchComparisonTab(event, tabId) {
  // Hide all content
  document.querySelectorAll('.comparison-view-content').forEach(content => {
    content.classList.remove('active');
  });
  
  // Remove active class from all tabs
  document.querySelectorAll('.comparison-tab').forEach(tab => {
    tab.classList.remove('active');
  });
  
  // Add active class to clicked tab
  event.currentTarget.classList.add('active');
  
  // Show selected content
  document.getElementById(tabId).classList.add('active');
}

function showSchoolComparison() {
  // Use the advanced comparison view instead
  showAdvancedComparisonView();
}

function showNotification(message, type = 'info') {
  // Remove existing notification if any
  const existingNotification = document.querySelector('.notification');
  if (existingNotification) {
    existingNotification.remove();
  }
  
  const notification = document.createElement('div');
  notification.className = `notification ${type}`;
  
  const iconMap = {
    'success': 'fas fa-check-circle',
    'warning': 'fas fa-exclamation-triangle',
    'error': 'fas fa-times-circle',
    'info': 'fas fa-info-circle'
  };
  
  notification.innerHTML = `
    <i class="${iconMap[type] || iconMap.info}"></i>
    <span>${message}</span>
  `;
  
  document.body.appendChild(notification);
  
  // Animate in
  setTimeout(() => {
    notification.classList.add('show');
  }, 10);
  
  // Auto remove after 3 seconds
  setTimeout(() => {
    notification.classList.remove('show');
    setTimeout(() => {
      notification.remove();
    }, 300);
  }, 3000);
}

function updateComparisonBadge() {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  const badge = document.getElementById('comparisonBadge');
  if (badge) {
    // Previous count for animation
    const prevCount = parseInt(badge.textContent || '0');
    const newCount = comparisonList.length;
    
    // Update count with animation
    badge.textContent = newCount;
    badge.style.display = newCount > 0 ? 'flex' : 'none';
    
    if (newCount > prevCount) {
      badge.classList.add('pulse-animation');
      setTimeout(() => badge.classList.remove('pulse-animation'), 500);
    }
  }
}

function exportJson(resultsText) {
  // Create a structured JSON object from the analysis data
  const now = new Date();
  const dateTime = now.toLocaleString('zh-TW');
  
  // Get region info
  const selectedRegionRadio = document.querySelector('input[name="analysisArea"]:checked');
  const regionName = selectedRegionRadio ? selectedRegionRadio.parentElement.querySelector('.region-name').textContent : '未指定區域';
  
  // Get detailed results data
  const totalPoints = document.querySelector('.total-points .result-value')?.textContent || "";
  const totalCredits = document.querySelector('.total-credits .result-value')?.textContent || "";
  
  // Get scores
  const scores = {
    chinese: document.getElementById('chinese').value,
    english: document.getElementById('english').value,
    math: document.getElementById('math').value,
    science: document.getElementById('science').value,
    social: document.getElementById('social').value,
    composition: document.getElementById('composition').value
  };
  
  // Get schools
  const schools = Array.from(document.querySelectorAll('.school-item')).map(school => {
    return {
      name: school.querySelector('.school-name')?.textContent.trim() || "",
      type: getSchoolParentType(school),
      ownership: getSchoolOwnership(school),
      group: school.querySelector('.school-group')?.textContent.trim() || "",
      cutoffScore: school.querySelector('.cutoff-score')?.textContent.trim() || ""
    };
  });
  
  // Organize schools by type
  const schoolsByType = {};
  schools.forEach(school => {
    if (!schoolsByType[school.type]) {
      schoolsByType[school.type] = [];
    }
    schoolsByType[school.type].push(school);
  });
  
  // Create final JSON object
  const jsonData = {
    timestamp: dateTime,
    region: regionName,
    analysis: {
      totalPoints: totalPoints,
      totalCredits: totalCredits,
      scores: scores
    },
    results: {
      totalEligibleSchools: schools.length,
      schoolsByType: schoolsByType
    },
    metadata: {
      version: "1.0",
      generator: "會考落點分析系統",
      url: "https://tyctw.github.io/spare/"
    }
  };
  
  // Convert to formatted JSON string
  const jsonString = JSON.stringify(jsonData, null, 2);
  
  // Download as file
  const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
  downloadFile(blob, '會考落點分析結果.json');
}

// Add structured data for rich results in search engines
function addStructuredData() {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "會考落點分析系統",
    "description": "免費會考落點分析系統，幫助您快速分析國中會考成績對應的高中落點，提供精確的學校錄取機率評估及分析報告。",
    "url": "https://tyctw.github.io/spare/",
    "applicationCategory": "EducationalApplication",
    "operatingSystem": "All",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "TWD"
    },
    "author": {
      "@type": "Organization",
      "name": "落點分析研究團隊"
    }
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(structuredData);
  document.head.appendChild(script);
}

// Generate dynamic sitemap for better SEO
async function generateSitemap() {
  try {
    const response = await fetch('https://script.google.com/macros/s/AKfycbwyCrdfpk5Lmw-ifJR4E_hkMiolZx4LitVt14gIP5CDeiZYSWjhEtD4K1hW6BFYkQIqsA/exec', {
      method: 'POST',
      body: JSON.stringify({
        action: 'getSitemapData'
      })
    });
    
    if (response.ok) {
      const data = await response.json();
      if (data.success && data.sitemap) {
        const sitemapLink = document.createElement('link');
        sitemapLink.rel = 'sitemap';
        sitemapLink.type = 'application/xml';
        sitemapLink.href = data.sitemap;
        document.head.appendChild(sitemapLink);
      }
    }
  } catch (error) {
    console.error('Error generating sitemap:', error);
  }
}

// Add header scroll effect
window.addEventListener('scroll', function() {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.classList.add('scrolled');
  } else {
    header.classList.remove('scrolled');
  }
});

// Show current year in versions
document.addEventListener('DOMContentLoaded', function() {
  if (document.getElementById('menuVersionYear')) {
    document.getElementById('menuVersionYear').textContent = new Date().getFullYear();
  }
});

// Toggle menu
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

document.addEventListener('click', function(event) {
  var menu = document.getElementById("fullscreenMenu");
  var menuIcon = document.querySelector(".menu-icon");
  
  if (menu.classList.contains('show') && 
      !menu.contains(event.target) && 
      !menuIcon.contains(event.target)) {
    closeMenu();
  }
});

function closeMenu() {
  var menu = document.getElementById("fullscreenMenu");
  var overlay = document.getElementById("menuOverlay");
  
  // Add a small delay to prevent accidental clicks when menu is closing
  const links = menu.getElementsByTagName('a');
  for (var i = 0; i < links.length; i++) {
    links[i].style.pointerEvents = 'none';
  }
  
  menu.classList.remove("show");
  overlay.classList.remove("show");
  
  // Re-enable links after animation completes
  setTimeout(() => {
    for (var i = 0; i < links.length; i++) {
      links[i].style.pointerEvents = 'auto';
    }
  }, 300);
}