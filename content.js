// Function to show tag type on hover
function showTagType(event, tag) {
    const tagType = event.target.tagName.toLowerCase();
    const tooltip = document.createElement('div');
    tooltip.className = 'hover-tooltip';
    tooltip.innerText = `Tag: ${tag?.tagName}`;
    document.body.appendChild(tooltip);

    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;

    event.target.addEventListener('mouseout', () => {
        tooltip.remove();
    });
}

// Function to show alt text on hover
function showAltText(event) {
    const altText = event.target.alt;
    const tooltip = document.createElement('div');
    tooltip.className = 'hover-tooltip';
    tooltip.innerText = `Alt: ${altText}`;
    document.body.appendChild(tooltip);

    tooltip.style.left = `${event.pageX + 10}px`;
    tooltip.style.top = `${event.pageY + 10}px`;

    event.target.addEventListener('mouseout', () => {
        tooltip.remove();
    });
}


// Add event listeners to h1 and h2 tags
document.querySelectorAll('h1, h2').forEach(tag => {
    // console.log(tag)
    tag.addEventListener('mouseover', (event) => showTagType(event, tag));
});

// Add event listeners to images
document.querySelectorAll('img').forEach(img => {
    img.addEventListener('mouseover', showAltText);
});

// Toggle hover feature on/off
function toggleHoverFeature() {
    if (document.body.classList.contains('hover-feature-enabled')) {
        document.querySelectorAll('h1, h2').forEach(tag => {
            tag.removeEventListener('mouseover', showTagType);
        });
        document.querySelectorAll('img').forEach(img => {
            img.removeEventListener('mouseover', showAltText);
        });
    } else {
        document.querySelectorAll('h1, h2').forEach(tag => {
            tag.addEventListener('mouseover', showTagType);
        });
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('mouseover', showAltText);
        });
    }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message === 'toggleHoverFeature') {
        toggleHoverFeature();
        sendResponse({ success: true });
    }
});
