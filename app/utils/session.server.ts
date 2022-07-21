import { createCookieSessionStorage, redirect } from "@remix-run/node";

const ADMIN_FIELD = "admin";

function GetSessionSecret(): string {
	if (!process.env.SESSION_SECRET)
		throw new Error("Sessions aren't configured");

	return process.env.SESSION_SECRET;
}

const sessionStorage = createCookieSessionStorage({
	cookie: {
		name: "__session",
		httpOnly: true,
		path: "/",
		sameSite: "lax",
		secrets: [GetSessionSecret()],
		secure: process.env.NODE_ENV === "production",
	},
});

async function GetSession(request: Request) {
	const cookie = request.headers.get("Cookie");
	return sessionStorage.getSession(cookie);
}

export async function HasSession(request: Request) {
	const session = await GetSession(request);
	return session.has(ADMIN_FIELD);
}

export async function RequireSession(request: Request) {
	const hasSession = await HasSession(request);
	if (hasSession)
		return true;

	let currentPath = new URL(request.url).pathname;
	throw redirect(CreateLoginURL(currentPath));
}

export async function CreateUserSession(request: Request, redirectPath: string) {
	const session = await GetSession(request);
	session.set(ADMIN_FIELD, true);
	
	// wanted to see the cookie change per login
	session.set('random', Math.random());

	let headers: HeadersInit = { "Set-Cookie": await sessionStorage.commitSession(session) };
	return redirect(redirectPath, { headers: headers });
}

export async function Logout(request: Request) {
	const session = await GetSession(request);

	let headers: HeadersInit = { "Set-Cookie": await sessionStorage.destroySession(session) };
	return redirect("/", { headers: headers });
}

export function CreateLoginURL(redirectPath: string) {
	let getParams = new URLSearchParams([ ['r', redirectPath] ]);
	return `/login?${getParams}`;
}
