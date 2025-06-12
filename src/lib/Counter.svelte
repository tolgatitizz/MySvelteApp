<script lang="ts">
  // Bu sayaç bileşenimizin kendi değişkeni.
  // Sadece bu bileşenin içinde yaşar.
  let count: number = 0;

  function increment() {
    count += 1;
  }

  function decrement() {
    count -= 1;
  }
</script>

<div class="flex flex-col items-center justify-center p-6 bg-white shadow-lg rounded-xl">
  <h2 class="text-3xl font-semibold mb-6">Basit Sayaç Bileşeni</h2>

  <p class="text-6xl font-mono text-purple-600 mb-6">{count}</p>

  <div class="flex space-x-4">
    <button
      on:click={decrement}
      class="px-8 py-4 bg-red-500 text-white font-bold rounded-full text-2xl hover:bg-red-600 transition duration-300"
    >
      Azalt
    </button>
    <button
      on:click={increment}
      class="px-8 py-4 bg-green-500 text-white font-bold rounded-full text-2xl hover:bg-green-600 transition duration-300"
    >
      Artır
    </button>
  </div>
</div>

<style>
  /* Bu `<style>` bloğu sadece bu `Counter.svelte` bileşenini etkiler.
     Diğer sayfalara veya bileşenlere bulaşmaz, bu da CSS yönetimini kolaylaştırır. */
</style>