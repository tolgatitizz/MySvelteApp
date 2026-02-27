<script>
	const rawPhone = "905385000140";
	const formattedPhone = "+90 538 500 01 40";

	const telLink = `tel:+${rawPhone}`;
	const whatsappLink = `https://wa.me/${rawPhone}`;
</script>

<svelte:head>
	<title>Bakımdayız</title>
	<link rel="icon" href="/favicon.ico" />
</svelte:head>

<section
	class="min-h-screen flex items-center justify-center px-6 bg-[#fffcf5] font-['Decolatype',sans-serif] relative overflow-hidden"
>
	<!-- %50 Transparan Overlay -->
	<div class="absolute inset-0 bg-[#d8d5ca]/50 backdrop-blur-sm"></div>

	<!-- Card -->
	<div
		class="relative bg-white rounded-2xl shadow-xl max-w-xl w-full p-10 text-center"
	>
		<!-- Logo -->
		<img
			src="/logo.png"
			alt="Logo"
			class="mx-auto mb-8 max-w-[160px]"
		/>

		<h1 class="text-3xl font-semibold text-[#2f2f2f] mb-4">
			Şu Anda Bakımdayız
		</h1>

		<p class="text-[#6b6b6b] leading-relaxed mb-10">
			Web sitemizi daha iyi bir deneyim sunmak için güncelliyoruz.
			Kısa süre içerisinde tekrar yayında olacağız.
		</p>

		<!-- Contact -->
		<div class="space-y-6">
			<div>
				<p class="font-medium text-[#2f2f2f] mb-3">
					{formattedPhone}
				</p>

				<div class="flex justify-center gap-4 flex-wrap">
					<a
						href={telLink}
						class="px-5 py-2.5 rounded-lg bg-[#40b29c] text-white text-sm font-medium transition hover:bg-[#6fa39a]"
					>
						Ara
					</a>

					<a
						href={whatsappLink}
						target="_blank"
						rel="noopener noreferrer"
						class="px-5 py-2.5 rounded-lg bg-[#5f7f78] text-white text-sm font-medium transition hover:opacity-90"
					>
						WhatsApp
					</a>
				</div>
			</div>

			<a
				href="mailto:tolgatitizz@hotmail.com"
				class="block text-sm text-[#6b6b6b] hover:text-[#40b29c] transition"
			>
				tolgatitizz@hotmail.com
			</a>
		</div>
	</div>
</section>