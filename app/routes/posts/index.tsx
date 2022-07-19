import { Link } from "@remix-run/react";

export default function PostDefault() {
	return (
		<Link to="/posts/new">Create New Post</Link>
	);
}
