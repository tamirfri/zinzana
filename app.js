chrome.tabs.query({ active: true, currentWindow: true }, ([activeTab]) => {
  chrome.scripting.executeScript({
    target: { tabId: activeTab.id },
    func: () => {
      const regex = /https:\/\/embed-ssl\.wistia\.com\/deliveries\/[a-z0-9]+\.jpg/g;
      const extractedUrls = [...new Set(document.documentElement.innerHTML.match(regex))].sort().map(url =>
        url.replace("https://embed-ssl", "http://embed").replace(".jpg", ".bin")
      );
      if (extractedUrls.length === 0) return "<h1>No matches found</h1>";
      const links = extractedUrls.map(url => `<a target="_blank" href="${url}">${url}</a><br/>`);
      const videos = extractedUrls.map(url => `<video width="300" height="167" autoplay muted controls><source src="${url}" type="video/mp4"></video>`);
      return `<p>${links.join("")}</p>${videos.join("")}`;
    }
  }, injectionResults => {
    document.body.innerHTML = injectionResults ? injectionResults[0].result : `<h1>Cannot access page</h1>`;
  });
});
