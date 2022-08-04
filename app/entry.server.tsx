import type { DataFunctionArgs, EntryContext, HandleDataRequestFunction } from "@remix-run/node";
import { RemixServer } from "@remix-run/react";
import { renderToString } from "react-dom/server";
import { Perf } from "./utils/perf.server";

// perf context:
// it would have been nice to return headers for Server-Timing in these functions, however
// remix doesn't provide enough data. handleRequest() does not get the request's context,
// and the request reference isn't stable between handleRequest(), handleDataRequest() and
// the loader (when passed to the loader, remix creates a new request object from the one here)
export default function handleRequest( request: Request, responseStatusCode: number, responseHeaders: Headers, remixContext: EntryContext) {
	let markup = renderToString(
		<RemixServer context={remixContext} url={request.url} />
	);

	responseHeaders.set("Content-Type", "text/html");
	
	// see perf context comment above
	// responseHeaders.set('Server-Timing', Perf().GetServerTimingHeader(context));

	return new Response("<!DOCTYPE html>" + markup, {
		status: responseStatusCode,
		headers: responseHeaders,
	});
}

export const handleDataRequest: HandleDataRequestFunction = ( response: Response, args: DataFunctionArgs) => {
	// see perf context comment above
	// response.headers.set('Server-Timing', Perf().GetServerTimingHeader(args.context));
	return response;
};