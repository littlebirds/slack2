<script setup>
import HelloWebRTC from './components/HelloWebRTC.vue'
import TheWelcome from './components/TheWelcome.vue'
import { ref } from 'vue'
import { io } from "socket.io-client"

const socket = io("ws://127.0.0.1:5173/ws", {});
const msg = ref('hello websocket!');

const callButtonClass = ref('leave');

socket.on('message', (msg) => {
  console.log(msg);
})


function handleCall(evt) {
  const button = evt.target;
  console.log(JSON.stringify(button), 'clicked!');
  if (callButtonClass.value === 'join') {
    callButtonClass.value = 'leave';
  } else {
    callButtonClass.value = 'join';
  }
}

</script>

<template>
  <main id="interface">
    <header id="header" role="banner">
      <HelloWebRTC msg="Hello WebRTC!" />
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
