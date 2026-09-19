(function () {
  // Membership is determined only by the verified server response. Never use
  // localStorage, URL values, or other browser-controlled values as an ad-free
  // entitlement signal.
  window.__admissionAdsDisabled = false;

  function loadScript(src, attributes) {
    const script = document.createElement('script');
    script.async = true;
    script.src = src;
    Object.assign(script, attributes || {});
    document.head.appendChild(script);
  }

  // Ads are loaded only after the application has checked membership status.
  window.loadAdmissionAds = function () {
    if (window.__admissionAdsDisabled || window.__admissionAdsLoaded) return;
    window.__admissionAdsLoaded = true;
    loadScript('https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-6966991656561179', { crossOrigin: 'anonymous' });
    loadScript('https://fundingchoicesmessages.google.com/i/pub-6966991656561179?ers=1');
  };

  window.disableAdmissionAds = function () {
    window.__admissionAdsDisabled = true;
  };

  function signalGooglefcPresent() {
    if (!window.frames.googlefcPresent) {
      if (document.body) {
        const iframe = document.createElement('iframe');
        iframe.style.cssText = 'width:0;height:0;border:none;z-index:-1000;left:-1000px;top:-1000px;display:none;';
        iframe.name = 'googlefcPresent';
        document.body.appendChild(iframe);
      } else {
        setTimeout(signalGooglefcPresent, 0);
      }
    }
  }

  // Called only after the user explicitly logs out. Re-enable the normal
  // non-member experience without waiting for a full page reload.
  window.enableAdmissionAds = function () {
    window.__admissionAdsDisabled = false;
    window.loadAdmissionAds();
    signalGooglefcPresent();
  };

  function startThirdPartyServices() {
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', 'G-H9X7EC127P');
    loadScript('https://www.googletagmanager.com/gtag/js?id=G-H9X7EC127P');
    if (!window.__admissionAdsDisabled) signalGooglefcPresent();
  }

  // A LINE callback may contain a one-time exchange code. Wait until the
  // guard has removed and exchanged it before loading any third-party script.
  // Third-party tags are intentionally outside the first-render window so
  // they cannot delay the homepage's content or interaction readiness.
  var servicesStarted = false;
  function startWhenAllowed() {
    if (servicesStarted) return;
    servicesStarted = true;
    Promise.resolve(window.__lineLoginExchangePromise).catch(function () { return false; }).then(startThirdPartyServices);
  }
  window.addEventListener('admission-third-party-ready', startWhenAllowed, { once: true });
  window.setTimeout(startWhenAllowed, 5000);
}());
