document.addEventListener('DOMContentLoaded', function () {
    const summaryDiv = document.getElementById('summary');
    const titleDiv = document.getElementById('title');
    const descriptionDiv = document.getElementById('description');
    const toggleButton = document.getElementById('toggle-hover');
    // Fetch and display the summary of h1 and h2 tags
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.scripting.executeScript({
            target: { tabId: tabs[0].id },
            function: getTagSummary
        }, (results) => {
            const { summary, titleText, descriptionText } = results[0].result;
            summaryDiv.innerHTML = summary
            titleDiv.innerHTML = titleText
            descriptionDiv.innerHTML = descriptionText
        });
    });

    toggleButton.addEventListener('click', function () {
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: toggleHoverFeature
            });
        });
    });
});







function getTagSummary() {
    function getMetaContentByName(name) {
        const selectedMetaTags = document.querySelectorAll('meta[name="description"], meta[name="title"]');
        const metaTag = Array.from(selectedMetaTags).find(meta => meta.getAttribute('name') === name);
        if (metaTag) {
            return metaTag.getAttribute("content");
        } else {
            console.error();
            return `Oh Boost it🚀🎉 "${name}" not found.`;
        }
    }

    const title = getMetaContentByName('title')
    const description = getMetaContentByName('description')
    const h1Tags = document.querySelectorAll('h1');
    const h2Tags = document.querySelectorAll('h2');

    const titleText = `<p>${title}</p>`
    const descriptionText = `<p>${description}</p>`
    let summary = `<p>Number of h1 tags: ${h1Tags.length}</p>`;
    summary += `<p>Number of h2 tags: ${h2Tags.length}</p>`;

    return { summary, titleText, descriptionText };
}

function toggleHoverFeature() {
    const hoverEnabled = document.body.classList.toggle('hover-feature-enabled');
    return hoverEnabled;
}

