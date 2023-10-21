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
        console.log("loaded")
        setTimeout(main, 30000);
    }
    main()
});
