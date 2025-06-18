<script lang="ts">
  // Artık dispatch veya toggleCompleted/handleDelete fonksiyonlarına gerek yok,
  // çünkü bu işlemler +page.svelte'deki formlar tarafından tetiklenecek.
  export let id: string;
  export let text: string;
  export let completed: boolean;
</script>

<div
  class="
    flex items-center p-3 border rounded-lg shadow-md mb-2 transition-all duration-300 ease-in-out
    {completed ? 'bg-green-50 border-green-200' : 'bg-white border-gray-200'}
  "
>
  <input
    type="checkbox"
    id={`todo-${id}`}
    checked={completed}
    class="
      form-checkbox h-5 w-5 text-blue-600 rounded
      focus:ring-blue-500 focus:ring-offset-2
      transition-colors duration-200 ease-in-out
      mr-3 "
    disabled />

  <label
    for={`todo-${id}`}
    class="
      flex-grow text-lg cursor-pointer select-none
      {completed ? 'line-through text-gray-500 italic' : 'text-gray-800 font-medium'}
      transition-all duration-200 ease-in-out
    "
  >
    {text}
  </label>

  </div>

<style>
  /* Buraya özel stil kalıntıları varsa temizlenebilir */
</style>