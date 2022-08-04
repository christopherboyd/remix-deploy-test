import { LinksFunction, LoaderArgs } from '@remix-run/node';
import { Link, Outlet } from '@remix-run/react'
import { json } from "@remix-run/node";
import { useLoaderData } from "@remix-run/react";
import stylesUrl from "~/styles/posts.css";
import { GetRecentPosts } from '~/utils/posts.server';

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

// don't return IP. createAt turns into a string on serialization, so can't use Pick
type PublicPostData = { id: number, message: string, createdAt: string };

export async function loader({request, context}: LoaderArgs) {
	let data = await GetRecentPosts(context, 10);
	let posts = data.map((record) => { return { id: record.id, createdAt: record.createdAt, message: record.message }; });

	return json({posts: posts});
};

export default function PostsPage() {
	const { posts } = useLoaderData<typeof loader>();
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<Link to="/">Back</Link>
			<div className="PostWall">
				{posts.map(post => <Post key={post.id} post={post} />)}
			</div>
			<Outlet />
		</div>
	);
}

function Post(props: { post: PublicPostData }) {
	const { post } = props;
	let createdAt = new Date(post.createdAt);

	return (
		<div className="Post">
			<div>Posted: {createdAt.toLocaleString()}</div>
			<div>{post.message}</div>
		</div>
	)
}
