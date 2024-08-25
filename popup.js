document.addEventListener("DOMContentLoaded", function () {
  const summaryDiv = document.getElementById("summary");
  const titleDiv = document.getElementById("title");
  const descriptionDiv = document.getElementById("description");
  const toggleButton = document.getElementById("toggle-hover");
  const toggleButtonTxt = document.getElementById("textComp");
  // Fetch and display the summary of h1 and h2 tags
  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.scripting.executeScript(
      {
        target: { tabId: tabs[0].id },
        function: getTagSummary,
      },
      (results) => {
        const {
          summary = "",
          titleText = "",
          descriptionText = "",
          tagsCount = "",
        } = results?.[0]?.result || {};

        summaryDiv.innerHTML = summary;
        titleDiv.innerHTML = titleText;
        descriptionDiv.innerHTML = descriptionText;
      }
    );
  });

  toggleButton.addEventListener("click", function () {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript(
        {
          target: { tabId: tabs[0].id },
          function: toggleHoverFeature,
        },
        () => {
          if (toggleButtonTxt.innerText === "Boost 😎") {
            toggleButtonTxt.innerText = "Boost 🚀";
          } else {
            toggleButtonTxt.innerText = "Boost 😎";
          }
        }
      );
    });
  });
});

function getTagSummary() {
  console.log(document.title);
  function getMetaContentByName(name) {
    //capitalize words
    function capitalizeFirstLetter(string) {
      return string.charAt(0).toUpperCase() + string.slice(1);
    }
    const selectedMetaTags = document.querySelectorAll(
      'meta[name="description"], meta[name="title"]'
    );
    const metaTag = Array.from(selectedMetaTags).find(
      (meta) => meta.getAttribute("name") === name
    );
    if (metaTag) {
      return metaTag.getAttribute("content");
    } else {
      console.error();
      return null;
    }
  }

  const title = document.title || getMetaContentByName("title");
  const description = getMetaContentByName("description");
  const h1Tags = document.querySelectorAll("h1");
  const h2Tags = document.querySelectorAll("h2");

  const titleText = `<p>${title}</p>`;
  const descriptionText = `<p>${description}</p>`;
  let summary = `<p>Number of h1 tags: ${h1Tags.length}</p>`;
  summary += `<p>Number of h2 tags: ${h2Tags.length}</p>`;
  const tagsCount = { h1s: h1Tags.length, h2s: h2Tags.length };
  console.log(tagsCount);
  return { summary, titleText, descriptionText, tagsCount };
}

function toggleHoverFeature() {
  const hoverEnabled = document.body.classList.toggle("hover-feature-enabled");
  return hoverEnabled;
}
