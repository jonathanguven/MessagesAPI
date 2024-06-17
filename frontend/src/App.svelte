<script>
  import Form from "./lib/Form.svelte";
  import Feed from "./lib/Feed.svelte";
</script>

<svelte:head>
  <title>Messaging API</title>
</svelte:head>
<main class="flex flex-col justify-center items-center">
  <div class="text-4xl m-6 font-semibold">Messaging API</div>
  <Form />
  <Feed />
</main>