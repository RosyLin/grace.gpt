chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "translateWord") {
            fetch('http://localhost:5000/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ word: request.word })
            })
            .then(response => response.json())
            .then(data => {
                // Ensure the action name here matches what content.js is expecting
                chrome.tabs.sendMessage(sender.tab.id, {action: "translatedText", translation: data.translation});
            })
            .catch(error => console.error('Error:', error));
        }
    }
);
