let isEnabled = false;

chrome.action.onClicked.addListener((tab) => {
  isEnabled = !isEnabled;
  chrome.tabs.sendMessage(tab.id, { action: "toggle", isEnabled });
});

chrome.tabs.onActivated.addListener((activeInfo) => {
  chrome.scripting.executeScript({
    target: { tabId: activeInfo.tabId },
    files: ["content.js"],
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (changeInfo.status === "complete") {
    chrome.scripting.executeScript({
      target: { tabId: tabId },
      files: ["content.js"],
    });
  }
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === "showBadgeText") {
    chrome.action.setBadgeText({ text: message.text });
    chrome.action.setBadgeBackgroundColor({ color: message.color });
    sendResponse({ success: true });
  }
});
