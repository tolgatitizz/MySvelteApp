<script lang="ts">
  // Bu bileşen, dışarıdan veri alacak.
  // Bu verilere "props" denir.
  // `export let` kullanarak bir prop tanımlarız.
  // Dışarıdan gelecek her veri için bir `export let` satırı yazarız.

  export let id: string; // Her yapılacak öğesinin benzersiz bir kimliği (string tipinde)
  export let text: string; // Yapılacak öğesinin metni (string tipinde)
  export let completed: boolean; // Yapılacak öğesinin tamamlandı durumu (true/false, boolean tipinde)

  // Bu bileşenden dışarıya bir olay gönderebiliriz.
  // Bu olaya "custom event" (özel olay) denir.
  // `createEventDispatcher` fonksiyonu ile olay gönderme fonksiyonu oluştururuz.
  import { createEventDispatcher } from 'svelte';
  const dispatch = createEventDispatcher();

  // Bir yapılacak öğesinin tamamlandı durumunu değiştirmek için bir fonksiyon
  function toggleCompleted() {
    // "toggle" adında özel bir olay gönderiyoruz.
    // Bu olayı dinleyen ana bileşen (bizim durumumuzda +page.svelte),
    // hangi öğenin durumunun değiştiğini anlamak için 'id' bilgisini de gönderiyoruz.
    dispatch('toggle', { id });
  }
</script>

<div
  class="flex items-center p-3 border rounded-lg shadow-sm mb-2
         {completed ? 'bg-green-100 border-green-300' : 'bg-gray-50 border-gray-200'}">

  <input
    type="checkbox"
    id={`todo-${id}`} bind:checked={completed} on:change={toggleCompleted} class="form-checkbox h-5 w-5 text-blue-600 rounded"
  />

  <label
    for={`todo-${id}`}
    class="ml-3 text-lg flex-grow 
           {completed ? 'line-through text-gray-500' : 'text-gray-800'}">
    {text} </label>
</div>

<style>
  /* Bu `<style>` bloğu sadece bu `TodoItem.svelte` bileşenini etkiler.
     Diğer sayfalara veya bileşenlere bulaşmaz, bu da CSS yönetimini kolaylaştırır. */
  /* `form-checkbox` gibi sınıflar Tailwind CSS'in forms eklentisinden gelir. */
</style>