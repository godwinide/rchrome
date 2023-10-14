document.getElementById("refreshButton").addEventListener("click", () => {
    const main = () => {
        chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
            chrome.action.setBadgeText({ tabId: tabs[0].id, text: "R" });

            // Refresh the page
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: () => {
                    location.reload();
                },
            });
        });
        setTimeout(main, 5 * 60 * 1000)
    }
    main()
});
