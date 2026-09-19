(function () {
  var hash = new URLSearchParams(window.location.hash.slice(1));
  var key = hash.get('collab');
  if (!key) return;
  window.__collaborationKey = key;
  window.history.replaceState(null, '', window.location.pathname + window.location.search);
}());
