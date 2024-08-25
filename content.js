// Function to show tag type on hover
function showTagType(event, tag) {
  const tagType = event.target.tagName.toLowerCase();
  const tooltip = document.createElement("div");
  tooltip.className = "hover-tooltip";
  tooltip.innerText = `Tag: ${tag?.tagName}`;
  document.body.appendChild(tooltip);

  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;

  event.target.addEventListener("mouseout", () => {
    tooltip.remove();
  });
}

// Function to show alt text on hover
function showAltText(event) {
  const altText = event.target.alt;
  const tooltip = document.createElement("div");
  tooltip.className = "hover-tooltip";
  tooltip.innerText = `Alt: ${altText}`;
  document.body.appendChild(tooltip);

  tooltip.style.left = `${event.pageX + 10}px`;
  tooltip.style.top = `${event.pageY + 10}px`;

  event.target.addEventListener("mouseout", () => {
    tooltip.remove();
  });
}

// Add event listeners to h1 and h2 tags
document.querySelectorAll("h1, h2").forEach((tag) => {
  // console.log(tag)
  tag.addEventListener("mouseover", (event) => showTagType(event, tag));
});

// Add event listeners to images
document.querySelectorAll("img").forEach((img) => {
  img.addEventListener("mouseover", showAltText);
});

console.log("hi");
// Toggle hover feature on/off
function toggleHoverFeature() {
  if (document.body.classList.contains("hover-feature-enabled")) {
    document.querySelectorAll("h1, h2").forEach((tag) => {
      tag.removeEventListener("mouseover", showTagType);
    });
    document.querySelectorAll("img").forEach((img) => {
      img.removeEventListener("mouseover", showAltText);
    });
  } else {
    document.querySelectorAll("h1, h2").forEach((tag) => {
      tag.addEventListener("mouseover", showTagType);
    });
    document.querySelectorAll("img").forEach((img) => {
      img.addEventListener("mouseover", showAltText);
    });
  }
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message === "toggleHoverFeature") {
    toggleHoverFeature();
    sendResponse({ success: true });
  }
});

function getMetaContentByName(name) {
  const metaTag = document.querySelector(`meta[name="${name}"]`);
  return metaTag ? metaTag.getAttribute("content") : null;
}

const title = document.title || getMetaContentByName("title");
const description = getMetaContentByName("description");
const h1Tags = document.querySelectorAll("h1");
const h2Tags = document.querySelectorAll("h2");

const tagsCount = { h1s: h1Tags.length, h2s: h2Tags.length };
const isInvalid =
  !tagsCount.h1s ||
  tagsCount.h1s !== 1 ||
  !tagsCount.h2s ||
  !title ||
  !description;

const badgeText = isInvalid ? "G" : "W";
const badgeColor = isInvalid ? "red" : "green";

chrome.runtime.sendMessage({
  action: "showBadgeText",
  text: badgeText,
  color: badgeColor,
});

// Function to add a button to the page
function addButton() {
  const button = document.createElement("button");
  button.innerText = "Toggle Highlight";
  button.style.position = "fixed";
  button.style.top = "10px";
  button.style.right = "10px";
  button.style.zIndex = 1000001;
  document.body.appendChild(button);

  let isHighlighted = false;

  button.addEventListener("click", () => {
    if (isHighlighted) {
      removeHighlights();
    } else {
      highlightTags();
    }
    isHighlighted = !isHighlighted;
  });
}

// Function to highlight h1, h2, and img tags
function highlightTags() {
  const h1Tags = document.querySelectorAll("h1");
  const h2Tags = document.querySelectorAll("h2");
  const imgTags = document.querySelectorAll("img");

  h1Tags.forEach((tag) => {
    tag.style.backgroundColor = "yellow";
    tag.classList.add("highlighted-h1");
  });

  h2Tags.forEach((tag) => {
    tag.style.backgroundColor = "lightblue";
    tag.classList.add("highlighted-h2");
  });

  imgTags.forEach((tag) => {
    tag.style.backgroundColor = "lightgreen";
    tag.classList.add("highlighted-img");

    // Create a new element to display the alt text
    const altText = document.createElement("div");
    altText.innerText = tag.alt;
    altText.classList.add("alt-text");
    altText.style.position = "absolute";
    altText.style.backgroundColor = "rgba(2, 233, 244, 0.7)";
    altText.style.color = "black";
    altText.style.fontWeight = "700";

    altText.style.padding = "10px 15px";
    altText.style.fontSize = "15px";
    altText.style.zIndex = 10000001;
    altText.style.top = `${tag.offsetTop}px`;
    altText.style.left = `${tag.offsetLeft}px`;
    // Append the alt text element to the body
    document.body.appendChild(altText);
  });
}

// Function to remove highlights and alt text
function removeHighlights() {
  const h1Tags = document.querySelectorAll(".highlighted-h1");
  const h2Tags = document.querySelectorAll(".highlighted-h2");
  const imgTags = document.querySelectorAll(".highlighted-img");
  const altTexts = document.querySelectorAll(".alt-text");

  h1Tags.forEach((tag) => {
    tag.style.backgroundColor = "";
    tag.classList.remove("highlighted-h1");
  });

  h2Tags.forEach((tag) => {
    tag.style.backgroundColor = "";
    tag.classList.remove("highlighted-h2");
  });

  imgTags.forEach((tag) => {
    tag.style.backgroundColor = "";
    tag.classList.remove("highlighted-img");
  });

  altTexts.forEach((altText) => {
    altText.remove();
  });
}

// Add the button to the page
addButton();
