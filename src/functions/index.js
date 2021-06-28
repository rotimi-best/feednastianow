/**
	 * @param {int} The month number, 0 based
	 * @param {int} The year, not zero based, required to account for leap years
	 * @return {Date[]} List with date objects for each day of the month
	 */
	export function getDaysInMonth(month, year) {
		const date = new Date(year, month, 1);
		const days = [];
		
		while (date.getMonth() === month) {
			days.push({
				label: new Date(date).toDateString(),
				fed: []
			});
			date.setDate(date.getDate() + 1);
		}
		
		return days;
	}

export async function updatFed(month, data) {
	const response = await fetch('https://shadow-frill-riddle.glitch.me/updatefed', {
		method: 'POST',
		headers: {
			'Accept': 'application/json',
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			month,
			data
		})
	});

	if (response.ok) {
		const res = await response.json();
		setTimeout(() => {
			document.getElementById('active').scrollIntoView({
				behavior: 'auto',
				block: 'center',
				inline: 'center'
			});
		}, 500);
		return res.data;
	} else {
		throw new Error('Data not found');
	}
}

export async function getMonthData() {
		const response = await fetch('https://shadow-frill-riddle.glitch.me/getmonthdata', {
			method: 'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json'
			},
		});

		if (response.ok) {
			const res = await response.json();
			setTimeout(() => {
				document.getElementById('active').scrollIntoView({
					behavior: 'auto',
					block: 'center',
					inline: 'center'
				});
			}, 500);
			
			return res.data;
		} else {
			throw new Error('Data not found');
		}
	}

export function formatTime(date) {
	return date.toLocaleTimeString('en-US')
}

