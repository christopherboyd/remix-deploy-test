interface Timers {
	name: string;
	start: number;
	end?: number;
}

class PerfTracker {
	private timings: Timers[] = [];
	
	public Track(name: string) {
		let data: Timers = {name, start: performance.now()};
		this.timings.push(data);

		return () => data.end = performance.now();
	}

	public GetServerTimingHeader() {
		let values = this.timings.map(item => {
			let duration = item.end? item.end - item.start : Number.MAX_SAFE_INTEGER;
			return `app;desc="${item.name}";dur=${duration.toFixed(1)}`;
		});

		return values.join(',');
	}
};

let tracker: PerfTracker;
export function Perf() {
	if (!tracker)
		tracker = new PerfTracker();

	return tracker;
}