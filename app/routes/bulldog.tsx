import { LinksFunction } from '@remix-run/node';
import { Link } from '@remix-run/react'
import bulldog from '~/images/bulldog.jpg';
import stylesUrl from "~/styles/bulldog.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export default function BulldogPage() {
	return (
		<div style={{ fontFamily: "system-ui, sans-serif", lineHeight: "1.4" }}>
			<Link to="/">Back</Link>
			<div>
				<img className='Bulldog' src={bulldog} />
			</div>
		</div>
	);
}
