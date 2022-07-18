import { LinksFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import stylesUrl from "~/styles/another.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function AnotherPage() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<Link to="/">Back</Link>
			<div>
				Served straight from public folder <br />
				<img src="/carina.jpg" />
			</div>
		</div>
	);
}
