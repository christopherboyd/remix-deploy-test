import { createRequestHandler } from "@remix-run/vercel";
import { createRemixRequest, sendRemixResponse } from "@remix-run/vercel/dist/server";
import * as node from "@remix-run/node";
import * as build from "@remix-run/dev/server-build";
import { Perf } from "./app/utils/perf.server";

/**
 * Copy/paste of @remix-run/vercel createRequestHandler() with header injection 
 * so we can add headers to every request because handleRequest() in entry.server.tsx 
 * doesn't receive the context provided through getLoadContext
 */
function remixVercelCreateRequest({ build, getLoadContext, mode = process.env.NODE_ENV }) {
	let handleRequest = node.createRequestHandler(build, mode);
	return async (req, res) => {
		let request = createRemixRequest(req);
		let loadContext = getLoadContext === null || getLoadContext === void 0 ? void 0 : getLoadContext(req, res);
		let response = await handleRequest(request, loadContext);

		// add in the timing header on all responses
		response.headers.append('Server-Timing', Perf().GetServerTimingHeader(loadContext));

		await sendRemixResponse(res, response);
	};
}

export default async function RequestHandler(request, response) {
	// any object will do
	let getLoadContext = (request, response) => { return { vercelRequest: true } };
	let remix = remixVercelCreateRequest({ build, mode: process.env.NODE_ENV, getLoadContext });
	await remix(request, response);
}
