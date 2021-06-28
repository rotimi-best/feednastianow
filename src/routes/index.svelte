<script context="module">
	export const prerender = true;
</script>

<script>
	import { onMount } from 'svelte';
	import { getMonthData, updatFed, formatTime } from '../functions';

	let nastiaAvatar =
		'https://lh3.googleusercontent.com/9sCqRVBb0epX8u139nARgAuH-NkGoncyCn-xtERFjGyyXA6SHifSdlOXA7Sx8k4cB0Ljm9Ag9OKJXh3OFw64S5c95OHvebGFCJsf73L4p7gKeLcTqxlnbB7iGPqf6R_2g7Vyh5hRBMw_OF462zp1JLYtwFvDFlyJOdwAxglILND_Xl11kRKrwDgi77uHbCrKAP-b-LC92h_JMmYe1Fu4Tb-n_dEF4Eh2Qy9iSebHQX8suRRBb9JjUNvUdV4m1v9A2Y4_xd_Z4vXe1bc-mVSq8uj-I72MvUXdL3yHPpga9eBtXPvOolSThUF7qrQpKhLaNYOcHuWpUlLrR42bGq35j77PBN74cTrodEVZLLI5d8d6goTQYAd2baa2aX14OFi6sUbTKyGlrPJL-08XXDNopfGiq0flTuxxSKxRHDAUWi4zU-93g96C4vS25MYRqKGT49VGmM1ffTDESwfaAFx8Y18ZoPpJHAe5VXiDnuZF0hg6jb3MhSBq63tsVhPqJrOPh4qwJILw59VqArovLnZU52arUOMI-DIs7UkVFdYzZ4szDwfaOjjjqU7_5nonNiSQ0AKTYIX9-s2NVlU10yENic_BrScPPU7Irmq2qIgN_p0uu88-9yAdEnBcJ3X8SXzdX_iQpmubUi4D6p-mdqGCjv3A1hclW7b_ihCLthKbV6cppIdezHFvO-Pl8NUZ9F6nKEATLvVEbeXIGN-ry9eE_EUt-A=w2228-h1576-no?authuser=0';

	// Local state
	let selectedDay = new Date().toDateString();
	let feedingAnalytics;
	let monthDataInPromise;
	let nextFeed = 'Now';

	onMount(() => {
		monthDataInPromise = getMonthData();
	});

	function logTime(data) {
		return () => {
			const updatedData = data.map((a) => {
				if (a.label === selectedDay) {
					a.fed = [
						...a.fed,
						{
							date: new Date(),
							meal: 'No meal typed'
						}
					];
					console.log('a', a);
				}
				return a;
			});

			monthDataInPromise = updatFed(new Date(selectedDay).getMonth(), updatedData);
		};
	}

	function setFeedingAnalytics(analytics) {
		feedingAnalytics = analytics;
		return analytics || [];
	}

	function getFedAnalytics(feedingAnalytics, selectedDay) {
		if (!feedingAnalytics) return [];
		const { fed } = feedingAnalytics.find((a) => a.label === selectedDay);
		return fed;
	}

	$: {
		if (feedingAnalytics) {
			const fedArray = getFedAnalytics(feedingAnalytics, selectedDay);
			if (fedArray && Array.isArray(fedArray)) {
				const lastFed = fedArray[fedArray.length - 1];
				if (lastFed) {
					const dt = new Date(lastFed.date);
					dt.setHours(dt.getHours() + 3);
					nextFeed = formatTime(dt);
				}
			}
		}
	}
</script>

<svelte:head>
	<title>Feed Nastia Now</title>
</svelte:head>

<div class="root">
	<img alt="Nastia Avatar" src={nastiaAvatar} class="avatar" />
	<h1>When next should you feed me?</h1>
	<p>
		Approximate time: {nextFeed}
	</p>
	{#await monthDataInPromise}
		<p>...Loading</p>
	{:then feedingAnalytics}
		<div class="boxes">
			{#each setFeedingAnalytics(feedingAnalytics) as feedingAnalytic}
				<button
					id={feedingAnalytic.label === selectedDay && 'active'}
					class="box"
					on:click={() => (selectedDay = feedingAnalytic.label)}
				>
					{#if feedingAnalytic.label === new Date().toDateString()}
						<p>Today</p>
					{/if}
					{feedingAnalytic.label}
				</button>
			{/each}
		</div>

		<div class="feeding-result">
			{#each getFedAnalytics(feedingAnalytics, selectedDay) as fed, index}
				<h4>
					({index + 1}) {formatTime(new Date(fed.date))}
				</h4>
			{/each}
		</div>

		<button class="log-time" on:click={logTime(feedingAnalytics)}> Let's Feed Now !!! </button>
	{:catch error}
		<p style="color: red">{error.message}</p>
	{/await}
</div>

<style>
	.root {
		display: flex;
		flex-direction: column;
		align-items: center;
		margin: 0 auto;
	}

	.avatar {
		width: 200px;
		height: 200px;
		border-radius: 50%;
	}

	.boxes {
		margin: 10px auto;
		display: flex;
		max-width: 100%;
		overflow: auto;
		border: 1px solid #ebebeb;
	}

	button.box {
		border: 2px solid #fff;
		border-radius: 5px;
		padding: 30px 20px;
		white-space: nowrap;
	}

	.box#active {
		border: 2px solid blue;
	}

	p {
		margin: 0;
		padding: 0;
		color: blue;
		font-weight: bold;
	}

	.feeding-result {
		margin: 10px auto;
	}

	.feeding-result h4 {
		border-radius: 2px;
		background-color: #ebebeb;
	}

	.log-time {
		padding: 20px;
	}
</style>
