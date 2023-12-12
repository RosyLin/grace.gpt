let avatarElem;

 function handleTextSelection(){
    let selectedText = window.getSelection().toString().trim();
    if (selectedText.length > 0) {
        chrome.runtime.sendMessage({action: "translateWord", word: selectedText});
        changeAvatarImage('3.png');
    }
}

document.addEventListener('dblclick', handleTextSelection);

document.addEventListener('mouseup', function(e) {
    if (e.detail === 1) { // Only proceed for single click; ignore double-click
        handleTextSelection();
    }
});

chrome.runtime.onMessage.addListener(
    function(request, sender, sendResponse) {
        if (request.action === "translatedText") {
            showPopup(request.translation);
            changeAvatarImage('2.png');
        }
    }
);

function showPopup(translation) {
    // Remove existing popup if any
    const existingPopup = document.getElementById('jargonPopup');
    if (existingPopup) {
        existingPopup.remove();
    }

    // Create a new popup
    const popup = document.createElement('div');
    popup.id = 'jargonPopup';

    // Apply the CSS styles
    popup.style.width = '180px';
    popup.style.padding = '12px';
    popup.style.fontFamily = "Georgia, 'Times New Roman', Times, serif";
    popup.style.border = '5px solid #fff0c4';
    popup.style.backgroundColor = '#c2c9ff';
    popup.style.justifyContent = 'center';
    popup.style.alignItems = 'center';
    popup.style.borderRadius = '8px';
    popup.style.color = '#180c3d';
    popup.style.textAlign = 'center';
    popup.style.fontSize = '13px';
    popup.style.position = 'fixed';
    popup.style.bottom = '105px';
    popup.style.right = '10px';
    popup.style.zIndex = '1000';

    const title = document.createElement('h4');
    title.textContent = "GRACE says,";
    title.style.fontFamily = "'Helvetica Neue', Arial, sans-serif";
    title.style.color = '#4c378c';
    title.style.marginBottom = '7px';
    title.style.marginTop = '5px';
    title.style.textAlign = 'center';
    title.style.fontSize = '17px';

    popup.appendChild(title);

    // Add translation text to the popup
    const translationDiv = document.createElement('div');
    translationDiv.innerText = translation;
    popup.appendChild(translationDiv);

    // Append popup to the body
    document.body.appendChild(popup);

    //changeAvatarImage('1.png');
}


function createAvatar() {
    avatarElem = document.createElement('img');
    avatarElem.src = chrome.runtime.getURL('1.png'); // Replace with the path to your avatar image
    avatarElem.id = 'my-extension-avatar';
    avatarElem.style.cssText = 'position: fixed; bottom: 5px; right: 60px; height: 100px; z-index: 1000; cursor: pointer;';

    // Append the Avatar to the Body
    document.body.appendChild(avatarElem);

    // Optional: Add Click Event Listener to Avatar
    avatarElem.addEventListener('click', function() {
        console.log('Avatar clicked!');
    });
}

function changeAvatarImage(imageFileName) {
    if (avatarElem) {
        avatarElem.src = chrome.runtime.getURL(imageFileName);
    }
}

// Call the function to create and append the avatar
createAvatar();

