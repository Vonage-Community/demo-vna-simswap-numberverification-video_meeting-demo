/* global OT SAMPLE_SERVER_BASE_URL */

let applicationId;
let sessionId;
let token;
let archive;

const archiveStartBtn = document.querySelector('#start');
const archiveStopBtn = document.querySelector('#stop');
const archiveLinkSpan = document.querySelector('#archiveLink');
const cameraSelect = document.getElementById('cameraSelect');
const micSelect  = document.getElementById('micSelect');
let session;
let publisher;

archiveStopBtn.style.display = "none";

function handleError(error) {
  if (error) {
    console.error(error);
  }
}

function getCameras() {
  OT.getDevices(function (error, devices) {
    if (error) {
      console.error("Error getting devices: ", error);
      return;
    }

    // Clear existing options
    cameraSelect.innerHTML = '';

    // Add options for each camera
    devices.forEach(function (device) {
      if (device.kind === 'videoInput') {
        var option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label   || 'Camera ' + (cameraSelect.length + 1);
        cameraSelect.appendChild(option);  
      }
    });
  });
}

function getMicrophones() {
  OT.getDevices(function (error, devices) {
    if (error) {
      console.error("Error getting devices: ", error);
      return;
    }

    // Clear existing options
    micSelect.innerHTML = '';

    // Add options for each microphone
    devices.forEach(function (device) {
      if (device.kind === 'audioInput') {
        var option = document.createElement('option');
        option.value = device.deviceId;
        option.text = device.label   || 'Microphone ' + (micSelect.length + 1);
        micSelect.appendChild(option);   

      }
    });
  });
}

getCameras();
getMicrophones();

function initializeSession() {
  session = OT.initSession(applicationId, sessionId);

  // Subscribe to a newly created stream
  session.on('streamCreated', (event) => {
    const subscriberOptions = {
      insertMode: 'append',
      width: '100%',
      height: '100%'
    };
    session.subscribe(event.stream, 'subscriber', subscriberOptions, handleError);
  });

  session.on('archiveStarted', (event) => {
    archive = event;
    console.log('Archive started ' + archive.id);
    archiveStartBtn.style.display = 'none';
    archiveStopBtn.style.display = 'inline';
    archiveLinkSpan.innerHTML = '';
  });

  session.on('archiveStopped', (event) => {
    archive = event;
    console.log('Archive stopped ' + archive.id);
    archiveStartBtn.style.display = 'inline';
    archiveStopBtn.style.display = 'none';
  });

  session.on('sessionDisconnected', (event) => {
    console.log('You were disconnected from the session.', event.reason);
  });

  initializePublisher();
}

function initializePublisher() {
  if (publisher) {
    publisher.destroy();
  }

  // initialize the publisher
  const publisherOptions = {
    camera: cameraSelect.value,
    audioSource: micSelect.value,
    insertMode: 'append',
    width: '100%',
    height: '100%'
  };
  publisher = OT.initPublisher('publisher', publisherOptions, handleError);

  // Connect to the session
  session.connect(token, (error) => {
    if (error) {
      handleError(error);
    } else {
      // If the connection is successful, publish the publisher to the session
      session.publish(publisher, handleError);
    }
  });
}

async function postData(url='', data={}){
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(data)
    });
    if (!response.ok){
      throw new Error('error getting data!');
    }
    return response.json();
  }
  catch (error){
    handleError(error);
  }
}

async function startArchiving(){
  console.log('start archiving');
  try {
    archive = await postData(SAMPLE_SERVER_BASE_URL +'/api/archive/start',{sessionId});
    console.log('archive started: ', archive);
    if (archive.status !== 'started'){
      handleError(archive.error);
    } else {
      console.log('successfully started archiving: ',archive);
    }
  }
  catch(error){
    handleError(error);
  }
}

async function stopArchiving(){
  console.log('stop archiving');
  try {
    archive = await postData(`${SAMPLE_SERVER_BASE_URL}/api/archive/${archive.id}/stop`,{});
    console.log('archive stopped: ', archive);
    if (archive.status !== 'stopped'){
      handleError(archive.error);
    } else {
      console.log('successfully stopped archiving: ',archive);
    }
  }
  catch(error){
    handleError(error);
  }
}

// See the config.js file.
if (SAMPLE_SERVER_BASE_URL) {
  // Make a GET request to get the Vonage Application ID, session ID, and token from the server
  const path = window.location.pathname;

  const regex = /\/room\/([a-zA-Z0-9-]+)/;
  const match = regex.exec(path);
  fetch(`${SAMPLE_SERVER_BASE_URL}/api/room/${match[1]}`)
  .then((response) => response.json())
  .then((json) => {
    applicationId = json.applicationId;
    sessionId = json.sessionId;
    token = json.token;
    // Initialize a Vonage Video Session object
    initializeSession();
  }).catch((error) => {
    handleError(error);
    alert('Failed to get Vonage Video sessionId and token. Make sure you have updated the config.js file.');
  });
}

archiveStartBtn.addEventListener('click', startArchiving, false);
archiveStopBtn.addEventListener('click', stopArchiving, false);
cameraSelect.addEventListener('change', initializePublisher);
micSelect.addEventListener('change', initializePublisher);
