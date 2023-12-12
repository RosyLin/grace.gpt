chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
    if (request.action === "translated") {
        document.getElementById('translation').textContent = request.translation;
    }
});

