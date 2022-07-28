import type { DataFunctionArgs, EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { Perf } from "./utils/perf.server";

export default function handleRequest( request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext) {
	let markup = renderToString(
		<RemixServer context={remixContext} url={request.url} />
	);

	responseHeaders.set("Content-Type", "text/html");
	responseHeaders.set('Server-Timing', Perf().GetServerTimingHeader());

	return new Response("<!DOCTYPE html>" + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}

export const handleDataRequest: HandleDataRequestFunction = ( response: Response, args: DataFunctionArgs) => {
	response.headers.set('Server-Timing', Perf().GetServerTimingHeader());
	return response;
};