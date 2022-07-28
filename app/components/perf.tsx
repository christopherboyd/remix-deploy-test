import * as React from 'react';

export function Perf( props: {} ) {
	let requests = usePerf();
	return (
		<div className="Perf">
			{requests.map(request => <LoggedRequest key={request.id} data={request} />)}
		</div>
	);
}

function LoggedRequest( props: {data: RequestData} ) {
	const {data} = props;
	return (
		<div className="LoggedRequest">
			<PerfEntryRow description={data.name} duration={data.totalDuration} />
			{data.timings.map( (entry, i) => {
				return <PerfEntryRow key={i} description={'- ' + entry.name} duration={entry.duration} />
			})}
		</div>
	)
}

function PerfEntryRow(props: {description: string, duration: number}) {
	const {description, duration} = props;
	return (
		<div className="PerfEntryRow">
			<div className="PerfEntryName" title={description}>{description}</div>
			<div className="PerfEntryDuration">{Math.round(duration)}ms</div>
		</div>
	);
}

interface RequestData {
	id: number;
	name: string;
    totalDuration: number;
    timings: {name: string, duration: number}[];
}

function ParsePerfEntry(entry: PerformanceEntry | PerformanceNavigationTiming | PerformanceResourceTiming) {
	if (!("initiatorType" in entry))
		return null;

	if (entry.initiatorType != 'navigation' && entry.initiatorType != 'fetch')
		return null;

	// add an id to give react something to key off later
	let data: RequestData = {
		id: GetNextID(),
		name: entry.name,
		totalDuration: Math.round(entry.responseEnd - entry.requestStart),
		timings: []
	};

	for (let server of entry.serverTiming) {
		data.timings.push({name: server.description, duration: server.duration});
	}

	return data;
}

function InitialPerfData() {
	let initial: RequestData[] = [];
	for (let entry of performance.getEntries()) {
		let data = ParsePerfEntry(entry);
		if (data)
			initial.push(data);
	}

	return initial.reverse();
}

function usePerf() {
	let [timings, setTimings] = React.useState<RequestData[]>([]);
	let initRef = React.useRef(false);

	React.useEffect( () => {
		let obs = new PerformanceObserver( (list) => {
			// would have preferred to do the following above, but server side rendering
			// complains on hydration on the client:
			// React.useState<RequestData[]>( () => InitialPerfData() );
			let entries: RequestData[] = [];
			if (!initRef.current) {
				entries = InitialPerfData();
				initRef.current = true;
			}

			for ( const entry of list.getEntries() ) {
				let data = ParsePerfEntry(entry);
				if (data)
					entries.push(data);
			}

			if (entries) {
				entries.reverse();
				setTimings(prevState => entries.concat(prevState));
			}
		});

		obs.observe({entryTypes: ['navigation', 'resource'], buffered: false});

		return () => obs.disconnect();
	}, [setTimings] );

	return timings;
}

let nextID = 1;
function GetNextID() {
	return nextID++;
}