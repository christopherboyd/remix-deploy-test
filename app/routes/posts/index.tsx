import { json, LoaderArgs } from "@remix-run/node";
import { Link, useLoaderData } from "@remix-run/react";
import { CreateLoginURL, HasSession } from "~/utils/session.server";

export async function loader({request}: LoaderArgs) {
	const hasSession = await HasSession(request);
	let url = hasSession ? '/posts/new' : CreateLoginURL('/posts/new');

	return json({url: url});
};

export default function PostDefault() {
	const { url } = useLoaderData< typeof loader>();
	return (
		<Link to={ url }>Create New Post</Link>
	);
}
