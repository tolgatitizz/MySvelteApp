<script lang="ts">
  import { v4 as uuidv4 } from 'uuid';
  import TodoItem from '$lib/TodoItem.svelte';
  import Counter from '$lib/Counter.svelte';

  import type { PageData } from './$types'; // Bu satır önemli!
  export let data: PageData; // data prop'una PageData tipini atayın

  let todos = data.todos;

  type Todo = {
    id: string;
    text: string;
    completed: boolean;
  };

  let newTodoText: string = '';

  function addTodo() {
    if (newTodoText.trim() === '') {
      return;
    }
    todos = [...todos, { id: uuidv4(), text: newTodoText, completed: false }];
    newTodoText = '';
  }

  function toggleTodo(event: CustomEvent<{ id: string }>) {
    const todoId = event.detail.id;
    todos = todos.map(todo =>
      todo.id === todoId ? { ...todo, completed: !todo.completed } : todo
    );
  }

  function clearCompletedTodos() {
    todos = todos.filter(todo => !todo.completed);
  }

  // Tarih formatlama için yardımcı fonksiyon
  function formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleDateString('tr-TR', { weekday: 'long', day: 'numeric', month: 'long' });
  }

  // Meteoblue ikon URL'si oluşturma (pictocode'a göre)
  // Bu, meteoblue'nun varsayılan ikonlarını kullanır
  function getMeteoblueIconUrl(pictocode: number): string {
      // Meteoblue ikonlarının bulunduğu standart bir URL formatı
      // Burada 2x (retina) versiyonunu kullanıyoruz
      // Lütfen bu URL'nin geçerliliğini Meteoblue dokümantasyonundan kontrol edin.
      // Eğer çalışmazsa, kendi ikon setinizi kullanmanız gerekebilir.
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
    <form on:submit|preventDefault={addTodo} class="flex mb-6 space-x-2">
      <input
        type="text"
        placeholder="Yeni bir yapılacak ekle..."
        bind:value={newTodoText}
        class="flex-grow p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      <button
        type="submit"
        class="px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition duration-300"
      >
        Ekle
      </button>
    </form>

    <div class="space-y-3">
      {#each todos as todo (todo.id)}
        <TodoItem
          id={todo.id}
          text={todo.text}
          completed={todo.completed}
          on:toggle={toggleTodo} />
      {/each}
    </div>

    {#if todos.length > 0}
      <button
        on:click={clearCompletedTodos}
        class="mt-6 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition duration-300 w-full"
      >
        Bitirilenleri Temizle
      </button>
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