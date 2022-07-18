import { Link } from '@remix-run/react'

export default function Index() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<h1>Test Deployment Website</h1>
			<ul>
				<li>
					<Link to="/bulldog">Bulldog</Link>
				</li>
				<li>
					<Link to="/another">Another Page</Link>
				</li>
			</ul>
		</div>
	);
}
