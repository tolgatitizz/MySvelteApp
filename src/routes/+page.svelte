<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import TodoItem from '$lib/TodoItem.svelte';
  import Counter from '$lib/Counter.svelte';

  import type { PageData } from './$types';
  export let data: PageData;

  let newTodoText: string = '';

  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  function getMeteoblueIconUrl(pictocode: number): string {
    return `https://www.meteoblue.com/assets/images/icons/weather_icons/alpha/${pictocode}.svg`;
  }
</script>

<h1 class="text-4xl font-extrabold text-gray-900 mb-6 mt-4 text-center">
  SvelteKit Uygulamam
</h1>

<div class="max-w-screen-lg mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8">
  <div class="bg-gradient-to-br from-blue-400 to-blue-600 text-white p-6 rounded-xl shadow-lg flex flex-col justify-between">
    <h2 class="text-3xl font-semibold mb-4 text-center">Hava Durumu ({data.weather?.city || 'Şehitkamil'})</h2>
    {#if data.error}
      <p class="text-red-200 text-lg text-center">{data.error}</p>
    {:else if data.weather && data.weather.daily.length > 0}
      {@const todayWeather = data.weather.daily[0]}
      <div class="text-center mb-6 border-b border-blue-300 pb-4">
        <h3 class="text-2xl font-bold mb-2">{formatDate(todayWeather.time)} (Bugün)</h3>
        <img
          src={getMeteoblueIconUrl(todayWeather.pictocode)}
          alt={todayWeather.weatherDescription}
          class="w-24 h-24 mx-auto"
        />
        <p class="text-5xl font-extrabold">{Math.round(todayWeather.maxTemp)}°C / {Math.round(todayWeather.minTemp)}°C</p>
        <p class="text-2xl capitalize">{todayWeather.weatherDescription}</p>
        {#if todayWeather.precipitationProb > 0}
          <p class="text-xl mt-2">Yağış İhtimali: {todayWeather.precipitationProb}%</p>
        {/if}
      </div>

      {#if data.weather.daily.length > 1}
        {@const tomorrowWeather = data.weather.daily[1]}
        <div class="text-center">
          <h3 class="text-xl font-bold mb-2">{formatDate(tomorrowWeather.time)} (Yarın)</h3>
          <img
            src={getMeteoblueIconUrl(tomorrowWeather.pictocode)}
            alt={tomorrowWeather.weatherDescription}
            class="w-20 h-20 mx-auto"
          />
          <p class="text-4xl font-extrabold">{Math.round(tomorrowWeather.maxTemp)}°C / {Math.round(tomorrowWeather.minTemp)}°C</p>
          <p class="text-xl capitalize">{tomorrowWeather.weatherDescription}</p>
          {#if tomorrowWeather.precipitationProb > 0}
            <p class="text-lg mt-2">Yağış İhtimali: {tomorrowWeather.precipitationProb}%</p>
          {/if}
        </div>
      {/if}
    {:else}
      <p class="text-center text-lg">Hava durumu verisi yükleniyor...</p>
    {/if}
  </div>

  <div class="bg-white p-6 rounded-xl shadow-lg">
    <h2 class="text-3xl font-extrabold text-gray-900 mb-6 text-center">
      Yapılacaklar Listem
    </h2>
    <form method="POST" action="?/addTodo" class="flex mb-6 space-x-2">
      <input
        type="text"
        placeholder="Yeni bir yapılacak ekle..."
        bind:value={newTodoText}
        name="newTodoText"
        class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500
               text-lg"
      />
      <button
        type="submit"
        class="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300
               shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
      >
        Ekle
      </button>
    </form>

    <div class="prose max-w-none">
      {#if data.todos.length === 0}
        <p class="text-center text-gray-500 italic py-4">Henüz yapılacak bir görev yok!</p>
      {:else}
        <ul class="list-none p-0 space-y-3">
          {#each data.todos as todo (todo.id)}
            <li class="relative">
              <form method="POST" action="?/toggleTodo" class="flex items-center">
                <input type="hidden" name="id" value={todo.id} />
                <input
                  type="checkbox"
                  id={`todo-${todo.id}`}
                  checked={todo.completed}
                  on:change={() => { /* Form gönderilecek, on:change'e gerek yok */ }}
                  class="form-checkbox h-5 w-5 text-blue-600 rounded mr-3"
                  name="completed"
                  on:click={(e) => (e.target as HTMLInputElement).form?.requestSubmit()}
                />
                <label
                  for={`todo-${todo.id}`}
                  class="flex-grow text-lg cursor-pointer select-none
                         {todo.completed ? 'line-through text-gray-500 italic' : 'text-gray-800 font-medium'}
                         transition-all duration-200 ease-in-out"
                >
                  {todo.text}
                </label>
              </form>
              <form method="POST" action="?/deleteTodo" class="absolute right-0 top-0 bottom-0 flex items-center pr-2">
                <input type="hidden" name="id" value={todo.id} />
                <button
                  type="submit"
                  class="p-1 rounded-full text-red-500 hover:bg-red-100 hover:text-red-700
                         focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
                         transition-colors duration-200 ease-in-out"
                  aria-label="Yapılacak görevi sil" >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clip-rule="evenodd" />
                  </svg>
                </button>
              </form>
            </li>
          {/each}
        </ul>
      {/if}
    </div>

    {#if data.todos.length > 0}
      <form method="POST" action="?/clearCompleted" class="mt-6">
        <button
          type="submit"
          class="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 w-full
                 shadow-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2"
        >
          Bitirilenleri Temizle
        </button>
      </form>
    {/if}
  </div>
</div>

<div class="mt-8 p-4 border rounded-lg shadow-md bg-gray-50 max-w-md mx-auto">
  <h2 class="text-2xl font-semibold mb-4 text-center">Ayrı Sayaç Bileşeni</h2>
  <Counter />
</div>

<style>
  /* Bu sayfanın kendine özgü stilleri (varsa) buraya gelir. */
</style>