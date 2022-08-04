interface Timers {
	name: string;
	start: number;
	end?: number;
}

class PerfTracker {
	private contexts = new WeakMap<any, Timers[]>();
	
	public Track(context:any, name: string) {
		let timer: Timers = {name, start: performance.now()};
		this.GetContextData(context).push(timer);

		return () => timer.end = performance.now();
	}

	public GetServerTimingHeader(context: any) {
		let timers = this.GetContextData(context);
		let values = timers.map(item => {
			let duration = item.end? item.end - item.start : Number.MAX_SAFE_INTEGER;
			return `app;desc="${item.name}";dur=${duration.toFixed(1)}`;
		});

		return values.join(',');
	}
	
	private GetContextData(context: any) {
		let data = this.contexts.get(context);
		if (data === undefined)
		{
			data = [];
			this.contexts.set(context, data);
		}

		return data;
	}
};

let tracker: PerfTracker;
export function Perf() {
	if (!tracker)
		tracker = new PerfTracker();

	return tracker;
}