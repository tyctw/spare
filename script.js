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

// Function to change instruction panel
function changeInstructionPanel(panelNumber) {
  // Update active panel
  document.querySelectorAll('.instruction-panel').forEach(panel => {
    panel.classList.remove('active');
  });
  const activePanel = document.querySelector(`.instruction-panel[data-panel="${panelNumber}"]`);
  activePanel.classList.add('active');
  
  // Update active step
  document.querySelectorAll('.instruction-step').forEach(step => {
    step.classList.remove('active');
  });
  document.querySelector(`.instruction-step[data-step="${panelNumber}"]`).classList.add('active');
  
  // Update mobile indicator dots
  document.querySelectorAll('.indicator-dot').forEach(dot => {
    dot.classList.remove('active');
  });
  document.querySelector(`.indicator-dot[data-dot="${panelNumber}"]`).classList.add('active');
  
  // On mobile, scroll content to top and ensure buttons remain visible
  if (window.innerWidth <= 768) {
    const contentEl = activePanel.querySelector('.instruction-panel-content');
    if (contentEl) {
      contentEl.scrollTop = 0;
    }
    
    // Flash navigation buttons to draw attention
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(btn => {
      btn.classList.add('flash-highlight');
      setTimeout(() => {
        btn.classList.remove('flash-highlight');
      }, 500);
    });
  }
}

// Initialize instruction panel step click handlers
function initInstructionSteps() {
  document.querySelectorAll('.instruction-step').forEach(step => {
    const stepNumber = step.getAttribute('data-step');
    step.addEventListener('click', () => {
      changeInstructionPanel(stepNumber);
    });
  });
}

function showInstructions() {
  var modal = document.getElementById('instructionsModal');
  modal.style.display = 'block';
  // Reset any previous fade-out
  modal.classList.remove('fade-out');
  
  // 修正手機版樣式
  if (window.innerWidth <= 768) {
    document.body.style.overflow = 'hidden'; // 防止背景滾動
    modal.style.overflowY = 'auto';
    
    // Create a temporary nav helper tip that appears after a delay
    setTimeout(() => {
      const helperTip = modal.querySelector('.nav-helper-tip');
      if (helperTip) {
        helperTip.style.opacity = '1';
      }
    }, 1500);
  }
  
  // Initialize instruction steps
  initInstructionSteps();
  
  // Reset to first panel
  changeInstructionPanel(1);
}

function closeInstructions() {
  var modal = document.getElementById('instructionsModal');
  // Add fade-out animation
  modal.classList.add('fade-out');
  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out');
    // 恢復滾動
    document.body.style.overflow = '';
  }, 300);
}

function showDisclaimer() {
  var modal = document.getElementById('disclaimerModal');
  modal.style.display = 'block';
  // Reset any previous fade-out
  modal.classList.remove('fade-out');
}

function closeDisclaimer() {
  var modal = document.getElementById('disclaimerModal');
  // Add fade-out animation
  modal.classList.add('fade-out');
  // Wait for animation to complete before hiding
  setTimeout(() => {
    modal.style.display = 'none';
    modal.classList.remove('fade-out');
  }, 300);
}

function showInvitationValidationAnimation() {
  const overlay = document.createElement('div');
  overlay.className = 'validation-overlay';
  
  // 創建驗證內容
  overlay.innerHTML = `
    <div class="validation-content">
      <div class="validation-steps">
        <div class="validation-step active" data-step="1">
          <div class="step-circle">
            <i class="fas fa-file-alt"></i>
          </div>
          <div class="step-label">資料收集</div>
        </div>
        <div class="validation-step" data-step="2">
          <div class="step-circle">
            <i class="fas fa-shield-alt"></i>
          </div>
          <div class="step-label">驗證中</div>
        </div>
        <div class="validation-step" data-step="3">
          <div class="step-circle">
            <i class="fas fa-check"></i>
          </div>
          <div class="step-label">完成</div>
        </div>
        <div class="progress-line">
          <div class="progress-line-inner"></div>
        </div>
      </div>
      
      <div class="validation-body">
        <div class="validation-circle">
          <div class="validation-percentage">0%</div>
        </div>
        <div class="validation-message">正在初始化...</div>
        <div class="validation-details">準備驗證邀請碼</div>
        <div class="code-display"></div>
        <div class="success-checkmark">
          <svg class="checkmark" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 52 52">
            <circle class="checkmark-circle" cx="26" cy="26" r="25" fill="none"/>
            <path class="checkmark-check" fill="none" d="M14.1 27.2l7.1 7.2 16.7-16.8"/>
          </svg>
        </div>
      </div>
    </div>
  `;
  
  document.body.appendChild(overlay);
  
  // 獲取邀請碼
  const invitationCode = document.getElementById('invitationCode').value;
  const codeDigits = invitationCode.split('');
  
  // 顯示邀請碼字符
  const codeDisplay = overlay.querySelector('.code-display');
  setTimeout(() => {
    codeDigits.forEach((digit, index) => {
      const charDiv = document.createElement('div');
      charDiv.className = 'code-char';
      charDiv.textContent = digit;
      charDiv.style.animationDelay = `${index * 100}ms`;
      codeDisplay.appendChild(charDiv);
    });
  }, 500);
  
  // 更新進度和狀態
  const progressLine = overlay.querySelector('.progress-line-inner');
  const percentage = overlay.querySelector('.validation-percentage');
  const message = overlay.querySelector('.validation-message');
  const details = overlay.querySelector('.validation-details');
  
  let progress = 0;
  const progressInterval = setInterval(() => {
    if (progress < 100) {
      progress += 1;
      percentage.textContent = `${progress}%`;
      progressLine.style.width = `${progress}%`;
      
      // 更新步驟狀態
      if (progress === 33) {
        const step1 = overlay.querySelector('.validation-step[data-step="1"]');
        const step2 = overlay.querySelector('.validation-step[data-step="2"]');
        step1.classList.add('completed');
        step2.classList.add('active');
        message.textContent = '驗證邀請碼中...';
        details.textContent = '檢查邀請碼有效性';
        
        // 開始驗證每個字符
        const codeChars = overlay.querySelectorAll('.code-char');
        codeChars.forEach((char, index) => {
          setTimeout(() => {
            char.classList.add('verified');
          }, index * 200);
        });
      }
      
      if (progress === 66) {
        const step2 = overlay.querySelector('.validation-step[data-step="2"]');
        const step3 = overlay.querySelector('.validation-step[data-step="3"]');
        step2.classList.add('completed');
        step3.classList.add('active');
        message.textContent = '驗證成功';
        details.textContent = '邀請碼有效，授權成功';
      }
      
      if (progress === 100) {
        clearInterval(progressInterval);
        const checkmark = overlay.querySelector('.success-checkmark');
        checkmark.classList.add('show');
        
        // 3秒後關閉動畫
        setTimeout(() => {
          hideInvitationValidationAnimation();
        }, 3000);
      }
    }
  }, 30);
}

function hideInvitationValidationAnimation() {
  const overlay = document.querySelector('.validation-overlay');
  if (overlay) {
    overlay.classList.add('fade-out');
    setTimeout(() => {
      overlay.remove();
    }, 500);
  }
}

function showLoading() {
  const overlay = document.querySelector('.analyzing-overlay');
  overlay.classList.add('active');
  
  // 重置所有步驟狀態
  document.querySelectorAll('.analyzing-step').forEach(step => {
    step.classList.remove('active', 'completed');
  });
  
  // 重置進度
  const circle = document.querySelector('.analyzing-circle');
  const percentage = document.querySelector('.analyzing-percentage');
  circle.style.setProperty('--progress', '0%');
  percentage.textContent = '0%';
  
  // 模擬分析進度
  let currentStep = 1;
  let progress = 0;
  
  const updateProgress = () => {
    if (progress >= 100) return;
    
    progress += 1;
    circle.style.setProperty('--progress', `${progress}%`);
    percentage.textContent = `${progress}%`;
    
    // 更新步驟狀態
    const stepThresholds = [25, 50, 75, 100];
    const newStep = stepThresholds.findIndex(threshold => progress <= threshold) + 1;
    
    if (newStep !== currentStep) {
      // 完成前一個步驟
      if (currentStep > 0) {
        const prevStep = document.querySelector(`[data-step="${currentStep}"]`);
        prevStep.classList.remove('active');
        prevStep.classList.add('completed');
      }
      
      // 激活新步驟
      const nextStep = document.querySelector(`[data-step="${newStep}"]`);
      nextStep.classList.add('active');
      
      currentStep = newStep;
    }
    
    if (progress < 100) {
      setTimeout(updateProgress, 50);
    }
  };
  
  // 開始第一個步驟
  const firstStep = document.querySelector('[data-step="1"]');
  firstStep.classList.add('active');
  
  // 開始更新進度
  setTimeout(updateProgress, 50);
}

function hideLoading() {
  const overlay = document.querySelector('.analyzing-overlay');
  overlay.classList.remove('active');
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

    const response = await fetch('https://script.google.com/macros/s/AKfycbzWLq0xIeCId9v47p36I1upDBlvnw9JD7j_lzEEo7lTC2c98lf_s22wfPU4sXp0-jeOrA/exec', {
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
    const exportButton = document.getElementById('exportResults');
    if (exportButton) {
      exportButton.style.display = 'inline-block';
      exportButton.onclick = showExportOptions;
    }
    
    // Initialize comparison badge
    updateComparisonBadge();
    refreshResultsComparisonButtons(); // 新增：渲染後同步按鈕狀態
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
  
  // 使用與TXT匯出相同的水印格式
  const horizontalLine = "===============================================\n";
  const titleLine = "               會考落點分析結果                \n";
  
  const watermark = 
    horizontalLine +
    titleLine +
    horizontalLine + "\n" +
    "【系統提示】\n" +
    "  以下資料僅供參考，請以各校最新招生簡章為準\n" +
    `  產生時間: ${dateTime}\n\n`;
  
  const contentWithWatermark = watermark + resultsText;
  
  switch (format) {
    case 'txt':
      exportTxt(contentWithWatermark);
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
  
  // 使用身份識別代替學生名稱
  const identitySelector = document.querySelector('input[name="identitySelector"]:checked');
  const studentType = identitySelector ? identitySelector.value : '使用者';
  
  // 創建更美觀的文本格式
  const horizontalLine = "===============================================\n";
  const titleLine = "               會考落點分析結果                \n";
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
  
  let formattedContent = horizontalLine;
  formattedContent += titleLine;
  formattedContent += horizontalLine + "\n";
  
  // 添加基本信息
  formattedContent += "【基本資料】\n";
  formattedContent += `身份: ${studentType === 'student' ? '學生' : (studentType === 'teacher' ? '老師' : (studentType === 'parent' ? '家長' : '使用者'))}\n`;
  formattedContent += `分析區域: ${regionName}\n`;
  formattedContent += `產生時間: ${dateTime}\n\n`;
  
  // 添加成績資料
  formattedContent += "【成績資料】\n";
  formattedContent += `國文: ${document.getElementById('chinese').value || '未填'}\n`;
  formattedContent += `英文: ${document.getElementById('english').value || '未填'}\n`;
  formattedContent += `數學: ${document.getElementById('math').value || '未填'}\n`;
  formattedContent += `自然: ${document.getElementById('science').value || '未填'}\n`;
  formattedContent += `社會: ${document.getElementById('social').value || '未填'}\n`;
  formattedContent += `作文: ${document.getElementById('composition').value || '未填'}\n\n`;
  
  // 添加分析結果
  formattedContent += "【分析結果】\n";
  // 移除原始的水印標題，只保留分析內容
  const resultsContent = content.split("********************************\n\n")[1] || content;
  formattedContent += resultsContent;
  
  // 添加頁腳
  formattedContent += "\n" + horizontalLine;
  formattedContent += "備註: 此分析結果僅供參考，請以各校最新招生簡章為準。\n";
  formattedContent += `網站: https://tyctw.github.io/spare/\n`;
  formattedContent += `分析區域: ${regionName}\n`;
  formattedContent += `產生日期: ${now.toLocaleDateString('zh-TW')}\n`;
  formattedContent += horizontalLine;
  
  const blob = new Blob([formattedContent], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, `會考落點分析結果_${now.toLocaleDateString('zh-TW').replace(/\//g, '')}.txt`);
}

async function exportPdf(content) {
  if (!window.jsPDF) {
    await loadScript('https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js');
  }
  
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF();
  
  // 由於繁體中文字體可能導致問題，先使用默認字體
  // 在未來可以添加更複雜的中文支援
  
  // Add header
  doc.setFillColor(42, 157, 143);
  doc.rect(0, 0, 210, 20, 'F');
  doc.setTextColor(255);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  
  // 由於可能缺少中文支援，使用英文標題以確保正常顯示
  doc.text('Exam Result Analysis', 105, 12, { align: 'center' });
  
  // Add timestamp
  const timestamp = new Date().toLocaleString();
  doc.setFontSize(10);
  doc.setFont('helvetica', 'italic');
  const selectedRegionRadio = document.querySelector('input[name="analysisArea"]:checked');
  const regionName = selectedRegionRadio ? selectedRegionRadio.parentElement.querySelector('.region-name').textContent : '';
  doc.text(`Created: ${timestamp} | Region: ${regionName}`, 105, 20, { align: 'center' });
  
  // Add main content with improved styling
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  
  // 準備內容 - 使用純英文確保顯示正常
  let processedContent = '';
  // 添加成績
  processedContent += 'SCORE SUMMARY:\n\n';
  processedContent += `Chinese: ${document.getElementById('chinese').value || '-'}\n`;
  processedContent += `English: ${document.getElementById('english').value || '-'}\n`;
  processedContent += `Math: ${document.getElementById('math').value || '-'}\n`;
  processedContent += `Science: ${document.getElementById('science').value || '-'}\n`;
  processedContent += `Social: ${document.getElementById('social').value || '-'}\n`;
  processedContent += `Writing: ${document.getElementById('composition').value || '-'}\n\n`;
  processedContent += 'ANALYSIS RESULTS\n\n';
  // 從原始內容中提取數據部分
  if (content.includes('符合條件的學校：')) {
    const schoolMatch = content.match(/符合條件的學校：(.+?)(?=\n\n|$)/s);
    if (schoolMatch && schoolMatch[1]) {
      processedContent += 'Eligible Schools:\n' + schoolMatch[1].replace(/[\u4e00-\u9fa5]/g, '') + '\n\n';
    }
  }
  
  const splitText = doc.splitTextToSize(processedContent, 180);
  let y = 30;
  
  // Add decorative element
  doc.setDrawColor(233, 196, 106);
  doc.setLineWidth(0.5);
  doc.line(15, 25, 195, 25);
  
  splitText.forEach(line => {
    if (line.includes('SCORE SUMMARY') || line.includes('ANALYSIS RESULTS') || line.includes('Eligible Schools')) {
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
      doc.text('Exam Result Analysis', 105, 12, { align: 'center' });
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
    doc.text(`Website: https://tyctw.github.io/spare/`, 105, 285, { align: 'center' });
    
    // Add footer design element
    doc.setDrawColor(233, 196, 106);
    doc.setLineWidth(0.3);
    doc.line(15, 282, 195, 282);
  }
  
  // Using image is optional but make it more aesthetic - QR code on the first page
  await loadQRCodeToPDF(doc, qrUrl, 1);
  
  doc.save('exam_result_analysis.pdf');
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
  try {
    // 使用 FileSaver.js 庫如果可用
    if (window.saveAs) {
      window.saveAs(blob, filename);
      return;
    }
    
    // 標準方法
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.style.display = 'none';
    a.href = url;
    a.download = filename;
    
    // Safari 需要向 DOM 添加元素
    document.body.appendChild(a);
    
    // 監測異常
    let clickFailed = false;
    try {
      a.click();
    } catch (e) {
      clickFailed = true;
      console.error('下載點擊失敗:', e);
    }
    
    // 延遲釋放 URL 和移除元素
    setTimeout(() => {
      URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      // 如果 click() 方法失敗，嘗試另一種方式
      if (clickFailed) {
        // 嘗試打開新窗口
        const newWindow = window.open(url, '_blank');
        if (!newWindow) alert('請允許彈出視窗以下載檔案，或右鍵點擊並選擇「另存為」');
        
        // 在新頁面中延遲清理 URL 物件
        setTimeout(() => URL.revokeObjectURL(url), 1000);
      }
    }, 100);
  } catch (error) {
    console.error('檔案下載失敗:', error);
    alert('下載檔案時發生錯誤，請稍後再試。');
    
    // 顯示下載問題通知
    showNotification('檔案下載失敗，請檢查瀏覽器設定。', 'error');
  }
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

  // 全域互動紀錄：點擊
  document.body.addEventListener('click', function(e) {
    const target = e.target.closest('button, a, input[type="button"], input[type="submit"]');
    if (target) {
      logUserActivity('ui_click', {
        tag: target.tagName,
        id: target.id,
        class: target.className,
        text: target.innerText || target.value || '',
        name: target.name || '',
        value: target.value || '',
        href: target.href || '',
        time: new Date().toISOString()
      });
    }
  });

  // 全域互動紀錄：表單變更
  document.body.addEventListener('change', function(e) {
    const target = e.target;
    if (["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName)) {
      logUserActivity('ui_change', {
        tag: target.tagName,
        id: target.id,
        class: target.className,
        name: target.name || '',
        value: target.value || '',
        type: target.type || '',
        time: new Date().toISOString()
      });
    }
  });
});

// 頁面離開時紀錄
window.addEventListener('beforeunload', function() {
  logUserActivity('page_exit', { time: new Date().toISOString() });
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
  
  // 找到要刪除的元素
  const schoolCard = document.querySelector(`.school-card[data-school="${schoolName}"]`);
  const tableColumn = document.querySelector(`.school-column[data-school="${schoolName}"]`);
  
  // 添加移除動畫
  if (schoolCard) {
    schoolCard.classList.add('removing');
  }
  if (tableColumn) {
    tableColumn.classList.add('removing');
    // 同時為該列的所有單元格添加動畫
    const table = document.querySelector('.comparison-table');
    if (table) {
      const columnIndex = Array.from(table.querySelectorAll('th.school-column')).findIndex(th => th.getAttribute('data-school') === schoolName);
      if (columnIndex > -1) {
        table.querySelectorAll('tr').forEach(row => {
          const cells = row.querySelectorAll('td, th');
          if (cells[columnIndex + 1]) {
            cells[columnIndex + 1].classList.add('removing');
          }
        });
      }
    }
  }
  
  // 移除學校並更新存儲
  comparisonList = comparisonList.filter(school => school.name !== schoolName);
  localStorage.setItem('schoolComparison', JSON.stringify(comparisonList));
  
  // 更新徽章和按鈕狀態
  updateComparisonBadge();
  refreshResultsComparisonButtons();
  
  // 延遲更新視圖，等待動畫完成
  setTimeout(() => {
    // 重新渲染整個比較視圖
    if (document.getElementById('advancedComparisonModal')) {
      showAdvancedComparisonView();
    }
    
    // 如果比較清單為空，顯示提示訊息
    if (comparisonList.length === 0) {
      const container = document.getElementById('comparisonContainer');
      if (container) {
        container.innerHTML = `
          <div class="empty-comparison">
            <i class="fas fa-info-circle icon-large"></i>
            <p>您尚未新增任何學校到比較清單</p>
            <p>請在分析結果中點擊「加入比較」按鈕新增學校</p>
          </div>
        `;
      }
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
        <button class="new-close-button" onclick="closeComparisonModal()">
          <i class="fas fa-times"></i>
        </button>
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
              <th class="school-column" data-school="${school.name}">
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
  const horizontalLine = "===============================================\n";
  const titleLine = "               學校比較結果                \n";
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
  
  // 頭部信息
  let comparisonText = horizontalLine;
  comparisonText += titleLine;
  comparisonText += horizontalLine + "\n";
  comparisonText += `【基本資訊】\n`;
  comparisonText += `產生時間: ${dateTime}\n`;
  comparisonText += `比較學校數量: ${comparisonList.length}所\n\n`;
  
  // 學校名稱區域
  comparisonText += `【比較學校】\n`;
  comparisonList.forEach((school, index) => {
    comparisonText += `${index + 1}. ${school.name} (${school.type || '未知類型'})\n`;
  });
  comparisonText += "\n";
  
  // 詳細比較表格 - 使用固定寬度格式化
  comparisonText += `【詳細比較】\n`;
  
  // 確定每個欄位的最大寬度
  const nameWidths = comparisonList.map(school => Math.max(10, school.name.length + 2));
  const totalWidth = nameWidths.reduce((sum, width) => sum + width, 20); // 20 for first column
  
  // 創建標題行
  let headerLine = padText("比較項目", 20);
  comparisonList.forEach((school, index) => {
    headerLine += padText(school.name, nameWidths[index]);
  });
  comparisonText += headerLine + "\n";
  
  // 創建分隔線
  let separatorLine = "-".repeat(totalWidth) + "\n";
  comparisonText += separatorLine;
  
  // 創建各項比較內容行
  const compareItems = [
    { name: "學校類型", getter: school => school.type || '未知' },
    { name: "學校屬性", getter: school => school.details?.ownership || '未知' },
    { name: "最低錄取", getter: school => school.details?.lastYearCutoff || '未知' },
    { name: "入學管道", getter: school => school.details?.admissionMethod || '一般入學' },
    { name: "地理位置", getter: school => school.details?.location || '未知' }
  ];
  
  // 可能的額外比較項 - 如果至少有一所學校有此數據則添加
  if (comparisonList.some(school => school.details?.admissionRate)) {
    compareItems.push({ name: "錄取率", getter: school => school.details?.admissionRate || '未知' });
  }
  
  if (comparisonList.some(school => school.details?.studentCount)) {
    compareItems.push({ name: "學生人數", getter: school => school.details?.studentCount || '未知' });
  }
  
  if (comparisonList.some(school => school.details?.schoolRank)) {
    compareItems.push({ name: "學校排名", getter: school => school.details?.schoolRank || '未知' });
  }
  
  // 生成比較表格
  compareItems.forEach((item, itemIndex) => {
    let line = padText(item.name, 20);
    comparisonList.forEach((school, schoolIndex) => {
      line += padText(item.getter(school), nameWidths[schoolIndex]);
    });
    comparisonText += line + "\n";
    
    // 每兩行添加一個細分隔線，提高可讀性
    if (itemIndex < compareItems.length - 1 && itemIndex % 2 === 1) {
      comparisonText += "-".repeat(totalWidth) + "\n";
    }
  });
  
  // 添加頁腳
  comparisonText += "\n" + horizontalLine;
  comparisonText += "【備註說明】\n";
  comparisonText += "此比較結果僅供參考，請以各校最新招生簡章為準。\n";
  comparisonText += "資料可能隨時更新，最終依各校公告為主。\n\n";
  comparisonText += `【資料來源】\n`;
  comparisonText += `會考落點分析系統 https://tyctw.github.io/spare/\n`;
  comparisonText += `產生日期: ${now.toLocaleDateString('zh-TW')}\n`;
  comparisonText += horizontalLine;
  
  const blob = new Blob([comparisonText], { type: 'text/plain;charset=utf-8' });
  downloadFile(blob, `學校比較結果_${now.toLocaleDateString('zh-TW').replace(/\//g, '')}.txt`);
}

// 輔助函數：將文本填充到固定寬度
function padText(text, width) {
  const padded = text.padEnd(width);
  return padded;
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
      <button class="new-close-button" onclick="closeSchoolDetailsModal()">
        <i class="fas fa-times"></i>
      </button>
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
      <button class="new-close-button" onclick="closeAdvancedComparisonModal()">
        <i class="fas fa-times"></i>
      </button>
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
                  <th class="school-column" data-school="${school.name}">
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
            <div class="school-card" data-school="${school.name}">
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
                <button class="school-card-button remove-btn" onclick="removeSchoolFromComparison('${school.name.replace(/'/g, "\\'")}')">
                  <i class="fas fa-times"></i>
                </button>
              </div>
            </div>
          `).join('')}
        </div>
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

// 為分析區域選擇器添加動畫效果
document.addEventListener('DOMContentLoaded', function() {
  const regionInputs = document.querySelectorAll('.region-input');
  
  regionInputs.forEach(input => {
    input.addEventListener('change', function() {
      if (this.checked) {
        // 獲取當前選中的區域圖標
        const regionIcon = this.nextElementSibling.querySelector('.region-icon');
        
        // 添加並在動畫結束後移除動畫類
        regionIcon.classList.add('pulse-animation');
        setTimeout(() => {
          regionIcon.classList.remove('pulse-animation');
        }, 800);
        
        // 添加波紋效果
        addRippleEffect(this.nextElementSibling);
      }
    });
  });
  
  // 添加波紋效果函數
  function addRippleEffect(element) {
    const ripple = document.createElement('span');
    ripple.className = 'ripple-effect';
    element.appendChild(ripple);
    
    // 動畫完成後移除波紋元素
    setTimeout(() => {
      ripple.remove();
    }, 800);
  }
});

// 新增：同步分析區塊加入比較按鈕狀態
function refreshResultsComparisonButtons() {
  const comparisonList = JSON.parse(localStorage.getItem('schoolComparison') || '[]');
  document.querySelectorAll('.school-item').forEach(item => {
    const btn = item.querySelector('.add-comparison-btn');
    const schoolName = item.querySelector('.school-name')?.textContent?.trim();
    if (btn && schoolName) {
      if (comparisonList.some(s => s.name === schoolName)) {
        btn.innerHTML = '<i class="fas fa-check"></i> 已加入比較';
        btn.classList.add('added');
        btn.disabled = true;
      } else {
        btn.innerHTML = '<i class="fas fa-plus-circle"></i> 加入比較';
        btn.classList.remove('added');
        btn.disabled = false;
      }
    }
  });
}

function showGradeLevelReference() {
  // 創建模態框
  const modal = document.createElement('div');
  modal.id = 'gradeLevelModal';
  modal.className = 'modal';
  
  // 設置模態框內容
  modal.innerHTML = `
    <div class="modal-content grade-level-modal-content">
      <button class="new-close-button" onclick="closeGradeLevelModal()">
        <i class="fas fa-times"></i>
      </button>
      <div class="grade-level-header">
        <h2><i class="fas fa-chart-line icon"></i> 會考答對題數與分數等級標示對照表</h2>
        <div class="update-info">
          <i class="fas fa-clock"></i> 最後更新：2024/06/03
        </div>
        <div class="score-inquiry-link">
          <a href="https://cap.rcpet.edu.tw/" target="_blank" rel="noopener noreferrer">
            <i class="fas fa-external-link-alt"></i>
            前往會考成績查詢系統
          </a>
        </div>
      </div>
      <div class="grade-level-tabs">
        <button class="grade-level-tab active" onclick="switchGradeYear(event, '114')">114年</button>
        <button class="grade-level-tab" onclick="switchGradeYear(event, '113')">113年</button>
      </div>
<div class="grade-level-year active" id="year-114">
  <div class="grade-level-container">
    <table class="grade-level-table">
      <thead>
        <tr>
          <th>成績等級標示</th>
          <th>國文</th>
          <th>社會</th>
          <th>自然</th>
          <th>英文<br>(加權成績)</th>
          <th>數學<br>(加權成績)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="grade-excellent">
          <td>精熟<br>A++</td>
          <td>答對40–42題</td>
          <td>答對52–54題</td>
          <td>答對48–50題</td>
          <td>98.14–100.00</td>
          <td>93.20–100.00</td>
        </tr>
        <tr class="grade-excellent">
          <td>精熟<br>A+</td>
          <td>答對38–39題</td>
          <td>答對51題</td>
          <td>答對46–47題</td>
          <td>95.33–98.13</td>
          <td>85.70–93.19</td>
        </tr>
        <tr class="grade-excellent">
          <td>精熟<br>A</td>
          <td>答對36–37題</td>
          <td>答對48–50題</td>
          <td>答對43–45題</td>
          <td>90.70–95.32</td>
          <td>76.20–85.69</td>
        </tr>
        <tr class="grade-basic">
          <td>基礎<br>B++</td>
          <td>答對32–35題</td>
          <td>答對41–47題</td>
          <td>答對36–42題</td>
          <td>83.21–90.69</td>
          <td>67.10–76.19</td>
        </tr>
        <tr class="grade-basic">
          <td>基礎<br>B+</td>
          <td>答對28–31題</td>
          <td>答對35–40題</td>
          <td>答對29–35題</td>
          <td>71.05–83.20</td>
          <td>59.40–67.09</td>
        </tr>
        <tr class="grade-basic">
          <td>基礎<br>B</td>
          <td>答對18–27題</td>
          <td>答對21–34題</td>
          <td>答對18–28題</td>
          <td>38.43–71.04</td>
          <td>40.60–59.39</td>
        </tr>
        <tr class="grade-need-improve">
          <td>待加強<br>C</td>
          <td>答對0–17題</td>
          <td>答對0–20題</td>
          <td>答對0–17題</td>
          <td>00.00–38.42</td>
          <td>00.00–40.59</td>
        </tr>
      </tbody>
    </table>
  </div>
</div>

        <div class="grade-level-year" id="year-113">
          <div class="grade-level-container">
            <table class="grade-level-table">
              <thead>
                <tr>
          <th>成績等級標示</th>
          <th>國文</th>
          <th>社會</th>
          <th>自然</th>
          <th>英文<br>(加權成績)</th>
          <th>數學<br>(加權成績)</th>
        </tr>
      </thead>
      <tbody>
        <tr class="grade-excellent">
          <td>精熟<br>A++</td>
          <td>答對40-42題</td>
          <td>答對52-54題</td>
          <td>答對48-50題</td>
          <td>98.14-100.00</td>
          <td>93.20-100.00</td>
        </tr>
        <tr class="grade-excellent">
          <td>精熟<br>A+</td>
          <td>答對39題</td>
          <td>答對50-51題</td>
          <td>答對47題</td>
          <td>96.23-98.13</td>
          <td>86.40-93.19</td>
        </tr>
        <tr class="grade-excellent">
          <td>精熟<br>A</td>
          <td>答對37-38題</td>
          <td>答對48-49題</td>
          <td>答對44-46題</td>
          <td>90.70-96.22</td>
          <td>76.40-86.39</td>
        </tr>
        <tr class="grade-basic">
          <td>基礎<br>B++</td>
          <td>答對33-36題</td>
          <td>答對42-47題</td>
          <td>答對37-43題</td>
          <td>82.30-90.69</td>
          <td>66.20-76.39</td>
        </tr>
        <tr class="grade-basic">
          <td>基礎<br>B+</td>
          <td>答對30-32題</td>
          <td>答對36-41題</td>
          <td>答對30-36題</td>
          <td>70.01-82.29</td>
          <td>56.90-66.19</td>
        </tr>
        <tr class="grade-basic">
          <td>基礎<br>B</td>
          <td>答對18-29題</td>
          <td>答對21-35題</td>
          <td>答對19-29題</td>
          <td>38.43-70.00</td>
          <td>38.10-56.89</td>
        </tr>
        <tr class="grade-need-improve">
          <td>待加強<br>C</td>
          <td>答對0-17題</td>
          <td>答對0-20題</td>
          <td>答對0-18題</td>
          <td>00.00-38.42</td>
          <td>00.00-38.09</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  `;
  
  // 添加到文檔中
  document.body.appendChild(modal);
  
  // 顯示模態框
  modal.style.display = 'block';
  
  // 添加動畫效果
  setTimeout(() => {
    modal.querySelector('.grade-level-modal-content').classList.add('show');
  }, 10);
}

function closeGradeLevelModal() {
  const modal = document.getElementById('gradeLevelModal');
  if (modal) {
    const modalContent = modal.querySelector('.grade-level-modal-content');
    modalContent.classList.remove('show');
    modalContent.classList.add('hide');
    
    setTimeout(() => {
      modal.style.display = 'none';
      modal.remove();
    }, 300);
  }
}

function switchGradeYear(event, year) {
  event.preventDefault();
  
  // 移除所有標籤和內容的活動狀態
  document.querySelectorAll('.grade-level-tab').forEach(tab => tab.classList.remove('active'));
  document.querySelectorAll('.grade-level-year').forEach(content => content.classList.remove('active'));
  
  // 添加活動狀態到選中的標籤和內容
  event.target.classList.add('active');
  document.getElementById('year-' + year).classList.add('active');
}