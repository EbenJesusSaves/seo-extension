let isEnabled = false;

chrome.action.onClicked.addListener((tab) => {
    isEnabled = !isEnabled;
    chrome.tabs.sendMessage(tab.id, { action: "toggle", isEnabled });
});