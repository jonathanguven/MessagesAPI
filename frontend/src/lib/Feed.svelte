<script>
  import { onDestroy } from 'svelte';
  import { writable } from 'svelte/store';

  let room = "";
  let messages = writable([]);
  let eventSource;
  let connected = false;

  const connectToRoom = () => {
    if (eventSource) {
      eventSource.close();
    }

    connected = true;
    const roomName = room.trim() || 'general';
    eventSource = new EventSource(`http://localhost:3000/listen?room=${encodeURIComponent(roomName)}`);

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      messages.update(msgs => [...msgs, data.message]);
    };

    eventSource.onerror = (event) => {
      console.error("Error connecting to SSE:", event);
    };

  };

  const disconnectFromRoom = () => {
    if (eventSource) {
      eventSource.close();
      eventSource = null;
    }
    room = "";
    connected = false;
    messages.set([]);
  };

  onDestroy(() => {
    disconnectFromRoom();
  });
</script>

<style>
  .live-feed {
    border: 1px solid #ddd;
    padding: 10px;
    height: 200px;
    overflow-y: auto;
    background-color: #f9f9f9;
    width: 50%;
    border-radius: 8px;
    margin-top: 12px;
  }
  .message {
    padding: 5px;
    margin-bottom: 5px;
    border-bottom: 1px solid #eee;
  }
</style>

<form on:submit|preventDefault={connected ? disconnectFromRoom : connectToRoom} class="justify-center w-full flex">
  <div class="w-1/3">
    <input
      autocomplete="off"
      id="room"
      type="text"
      bind:value={room}
      class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
      placeholder="Enter room name (default: general)"
      disabled={connected}
    />
  </div>
  <button
    type="submit"
    class="mt-1 w-24 h-10 px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
  >
    {connected ? "Leave" : "Connect"}
  </button>
</form>

<div class="live-feed">
  {#each $messages as message}
    <div class="message">{message}</div>
  {/each}
</div>
