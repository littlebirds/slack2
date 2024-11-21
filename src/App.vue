<script setup>
import HelloWebRTC from './components/HelloWebRTC.vue'
import TheWelcome from './components/TheWelcome.vue'
import { ref } from 'vue'
import { io } from "socket.io-client"


function prepareNamespace(hash, set_location) {
  let ns = hash.replace(/^#/, ''); // remove leading #
  if (/^[0-9]{7}$/.test(ns)) {
    console.log('Checked existing namespace', ns);
    return ns;
  }

  ns = Math.random().toString().substring(2,9);
  console.log('Created new namespace', ns);
  if (set_location) {
    window.location.hash = ns;
  }
  return ns;
}

const namespace = prepareNamespace(window.location.hash, true);
console.log(namespace);
const sc = io('/' + namespace, { autoConnect: false });
registerScCallback();

const $self = {
  rtcConfig: null,
  isPolite: false,
  isMakingOffer: false,
  isIgnoringOffer: false,
  isSettingRemoteAnswerPending: false,
  mediaConstraints: {audio: false, video: true},
};

/**
 * User-Media Fucntions
 */
function displayStream(stream, selector) {
  document.querySelector(selector).srcObject = stream;
}

async function requestUserMedia(media_constraints) {
  $self.mediaStream = new MediaStream();
  $self.media = await navigator.mediaDevices.getUserMedia(media_constraints);
  $self.mediaStream.addTrack($self.media.getTracks()[0]);
  displayStream($self.mediaStream, '#self');
}

/**
 * User-Meida Setup
 */
requestUserMedia($self.mediaConstraints);

const callButtonClass = ref('leave');

function handleScConnect() {
  console.log('Successfully connected to the signalling server!');
  establishCallFeatures($peer);
}

function handleScConnectedPeer() {
}

function handleScDisconnectedPeer() {
}

function handleScSignal() {
}
function registerScCallback() {
  sc.on('conect', handleScConnect);
  sc.on('connected peer', handleScConnectedPeer);
  sc.on('disconnected peer', handleScDisconnectedPeer);
  sc.on('signal', handleScSignal);
}

function handleRtcPeerTrack() {

}
function handleRtcIceCandidate() {

}

async function handleRtcConnectionNegotiation() {

}

function addStreamingMedia(stream, peer) {
  if (stream) {
    for (let track of stream.getTracks()) {
      peer.connection.addTrack(track, stream);
    }
  }
}

function establishCallFeatures(peer) {
  registerRtcCallbacks(peer);
  addStreamingMedia($self.mediaStream, peer);
}

function registerRtcCallbacks(peer) {
  peer.connection.onnegotiationneeded = handleRtcConnectionNegotiation;
  peer.connection.onicecandidate = handleRtcIceCandidate;
  peer.connection.ontrack = handleRtcPeerTrack;
}

function joinCall() {
  sc.open();
}
function leaveCall() {
  sc.close();
}

function handleCall(evt) {
  const button = evt.target;
  console.log(JSON.stringify(button), 'clicked!');
  if (callButtonClass.value === 'join') {
    callButtonClass.value = 'leave';
    joinCall();
  } else {
    callButtonClass.value = 'join';
    leaveCall();
  }
}



</script>

<template>
  <main id="interface">
    <header id="header" role="banner">
      <HelloWebRTC :msg="'Join room #' + namespace" />
      <button :class="callButtonClass" type="button" id="call-button" @click="handleCall"> {{ callButtonClass === 'leave' ? "Leave Call" : "Join Call" }}</button>
    </header>
    <article id="videos">
      <h2 class="preserve-access">Streaming Videos</h2>
      <video id="self"
        autoplay
        muted
        playsinline
        poster="@/assets/placeholder.png"
      ></video>
      <video id="peer"
        autoplay
        playsinline
        poster="@/assets/placeholder.png"
      ></video>
    </article>
  </main>
</template>

<style scoped>
* {
  font-family: "Lucida Grande", Arial, sans-serif;
  font-size: 18px;
  font-weight: bold;
}
#interface {
  padding: 22px;
}
header {
  line-height: 1.5;
  margin-bottom: 11px;
}
button {
  font-family: inherit;
  font-size: inherit;
  font-weight: inherit;
  line-height: inherit;
  cursor: pointer;
  display: block;
  border: 1;
  border-radius: 3px;
  padding: 11px;
}

#call-button {
  width: 180px;
  margin-right: 11px;
}

.join {
  background-color: green;
}
.leave {
  background-color: red;
}

video {
  background-color: #DDD;
  display: block;
  max-width: 100%;
}
#self {
  width: 50%;
  max-width: 320 px;
  margin-bottom: 11px;
}
@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    padding-right: calc(var(--section-gap) / 2);
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }
}
</style>
