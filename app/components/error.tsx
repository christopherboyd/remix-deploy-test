export function Error(props: {enabled: boolean | undefined, text: string}) {
	let {enabled, text} = props;
	if (!enabled)
		return null;

	return (
		<span className="SubmitError">{'<-- ' + text}</span>
	);
}