let eventSource;

const debugButton = document.getElementById('debug_button');
debugButton.icon = sessionStorage.getItem('debug_enabled') ? 'connect-solid' : 'connect-line';
if(sessionStorage.getItem('debug_enabled')) {
    enableDebugging();
}

document.getElementById('debug_button').addEventListener('click', (e) => {
    const debugEnabled = sessionStorage.getItem('debug_enabled');

    if (debugEnabled) {
        debugButton.icon = 'connect-line';
        sessionStorage.removeItem('debug_enabled');
        sessionStorage.removeItem('debug_information');
        sessionStorage.removeItem('debug_id');
    } else {
        debugButton.icon = 'connect-solid';
        sessionStorage.setItem('debug_enabled', 'true');
        sessionStorage.setItem('debug_information', JSON.stringify([`${new Date().toISOString()} - Debug enabled`]));
        enableDebugging();
    }
});

function rebuildLogs() {
    const logMessages = document.getElementById('debug_messages');
    let logs = JSON.parse(sessionStorage.getItem('debug_information'));

    logMessages.innerHTML = '';
    for(const message of logs) {
        const div = document.createElement('div');
        div.innerHTML = message;
        logMessages.appendChild(div);
    }
}

function enableDebugging() {
    const lastEvent = sessionStorage.getItem('debug_id') || 0;
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

// window.onbeforeunload = () => {
//     if (eventSource) {
//         eventSource.close();
//     }
// }

