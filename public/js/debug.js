let eventSource;

const debugButton = document.getElementById('debug_button');
debugButton.icon = sessionStorage.getItem('debug_enabled') ? 'connect-solid' : 'connect-line';

const debugMessageLogDisplayButton = document.getElementById('debugMessagesToggleButton');
const debugBar = document.getElementById('debugBar');
const lastDebugMessage = document.getElementById('lastDebugMessage');
const debugMessageLog = document.getElementById('debugMessageLog');

if(sessionStorage.getItem('debug_enabled')) {
    enableDebugging();
    debugBar.classList.add('enabled');
    debugMessageLogDisplayButton.classList.add('on');
}

if(sessionStorage.getItem('messageLogExpanded')) {
    debugMessageLog.classList.add('enabled');
}

document.getElementById('debug_button').addEventListener('click', (e) => {
    const debugEnabled = sessionStorage.getItem('debug_enabled');

    if (debugEnabled) {
        debugButton.icon = 'connect-line';
        sessionStorage.removeItem('debug_enabled');
        sessionStorage.removeItem('debug_information');
        debugBar.classList.remove('enabled');
    } else {
        debugButton.icon = 'connect-solid';
        sessionStorage.setItem('debug_enabled', 'true');
        sessionStorage.setItem('debug_information', JSON.stringify([`${new Date().toISOString()} - Debug enabled`]));
        debugBar.classList.add('enabled');
        enableDebugging();
    }
});

function rebuildLogs() {
    const logMessages = document.getElementById('debugMessageLog');
    let logs = JSON.parse(sessionStorage.getItem('debug_information'));

    logMessages.innerHTML = '';
    for(const message of logs) {
        const alert = document.createElement('div');
        alert.innerHTML = message;
        alert.classList.add('p-2', 'm-2', 'rounded-xl', 'bg-white', 'text-black');
        logMessages.prepend(alert);
        lastDebugMessage.innerHTML = message;
    }
}

function enableDebugging() {
    let lastEvent = sessionStorage.getItem('debug_id') || Date.now();
    if (lastEvent === 'NaN') {
        lastEvent = Date.now();
    }
    console.log('Last event boot', lastEvent);
    eventSource = new EventSource(`/api/debug-stream?lastEventId=${lastEvent}`);
    eventSource.onmessage = (event) => {
        console.log(event);
        let logs = JSON.parse(sessionStorage.getItem('debug_information'));
        logs.push(event.data);
        sessionStorage.setItem('debug_information', JSON.stringify(logs));
        sessionStorage.setItem('debug_id', event.lastEventId);
        rebuildLogs();
    };
    rebuildLogs();
}

function disableDebugging() {
    eventSource.close();
}

debugMessageLogDisplayButton.addEventListener('click', (e) => {
    if (debugMessageLogDisplayButton.classList.contains('on')) {
        debugMessageLog.classList.remove('enabled');
        debugMessageLogDisplayButton.classList.remove('on');
        debugMessageLogDisplayButton.icon = "chevron-circle-down-line";
    } else {
        debugMessageLogDisplayButton.classList.add('on');
        debugMessageLog.classList.add('enabled');
        debugMessageLogDisplayButton.icon = "chevron-circle-down-solid";
        sessionStorage.setItem('messageLogExpanded', 'true');
    }
})