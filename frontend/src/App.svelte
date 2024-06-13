<script>
  // @ts-nocheck

  import { onMount } from "svelte";

  let name = "";
  let key = "";
  let message = "";
  let sent = false;
  let numMembers = 0;
  let errorMessage = "";

  const handleSubmit = async () => {
    const send = await fetch("http://localhost:3000/send", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ key, room: "", message }),
    });
    const data = await send.json();

    if (data.error) {
      errorMessage = data.error;
      numMembers = 0;
    } else {
      errorMessage = "";
      numMembers = data.clients;
    }

    sent = true;
    name = "";
    key = "";
    message = "";

    setTimeout(() => {
      sent = false;
    }, 2000);
  };
</script>

<svelte:head>
  <title>Messaging API</title>
</svelte:head>
<main class="flex flex-col justify-center items-center">
  <div class="text-4xl m-6 font-semibold">Messaging API</div>

  <form
    on:submit|preventDefault={handleSubmit}
    class="w-1/2 mx-auto p-6 bg-neutral-50 rounded-md shadow-lg"
  >
    <div class="mb-4">
      <label for="name" class="block text-sm font-medium text-gray-700"
        >Name</label
      >
      <input
        id="name"
        type="text"
        bind:value={name}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your name"
      />
    </div>

    <div class="mb-4">
      <label for="key" class="block text-sm font-medium text-gray-700"
        >Key</label
      >
      <input
        id="key"
        type="text"
        bind:value={key}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your key"
      />
    </div>

    <div class="mb-4">
      <label for="message" class="block text-sm font-medium text-gray-700"
        >Message</label
      >
      <textarea
        id="message"
        bind:value={message}
        class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
        placeholder="Enter your message"
      ></textarea>
    </div>

    <button
      type="submit"
      class="w-full px-4 py-2 text-white bg-blue-500 rounded-md shadow-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    >
      Submit
    </button>
  </form>
  {#if sent}
    {#if errorMessage}
      <div class="my-4 p-2 bg-red-100 text-red-700 rounded-md shadow-md">
        {errorMessage}
      </div>
    {:else}
      <div class="my-4 p-2 bg-green-100 text-green-700 rounded-md shadow-md">
        {numMembers} member{numMembers !== 1 ? "s" : ""} in the room
      </div>
    {/if}
  {/if}
</main>
