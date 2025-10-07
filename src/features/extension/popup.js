document.getElementById('logButton').addEventListener('click', async () => {
  const data = document.getElementById('dataInput').value;
  const statusDiv = document.getElementById('status');
  
  try {
    // Get the active tab
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    
    // Execute script in the page's context to log to console
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      func: (dataToLog) => {
        console.log(dataToLog);
      },
      args: [data]
    });
    
    // Show success message
    statusDiv.textContent = 'Data logged to console!';
    statusDiv.className = 'status success show';
    
    // Hide status message after 2 seconds
    setTimeout(() => {
      statusDiv.className = 'status';
    }, 2000);
    
  } catch (error) {
    statusDiv.textContent = 'Error: ' + error.message;
    statusDiv.className = 'status show';
    statusDiv.style.backgroundColor = '#f8d7da';
    statusDiv.style.color = '#721c24';
  }
});