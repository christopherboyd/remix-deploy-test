import * as React from 'react';
import { ActionArgs, json, LinksFunction, LoaderArgs, redirect } from "@remix-run/node";
import { Form, useActionData, useSearchParams } from "@remix-run/react";
import stylesUrl from "~/styles/new.css";
import { CreateUserSession, HasSession } from "~/utils/session.server";
import { Error } from "~/components/error";
import { SafeRedirect } from '~/utils/helpers';

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export async function loader({ request }: LoaderArgs) {
	const hasSession = await HasSession(request);
	if (hasSession)
		return redirect("/");

	return json({});
}

export async function action({request}: ActionArgs) {
	const formData = await request.formData();
	const authkey = formData.get('authkey');
	const redirectPath = SafeRedirect(formData.get('r'));

	const testKey = process.env.TEST_APP_KEY;
	if ( !authkey || typeof authkey !== "string" || !testKey || authkey !== testKey )
		return json({ invalidKey: true });

	return await CreateUserSession(request, redirectPath);
};

export default function LoginPage() {
	const redirectPath = useRedirectPath();
	const errors = useActionData<typeof action>();
	const keyRef = React.useRef<HTMLInputElement>(null);

	// focus on error
	React.useEffect( () => {
		if (errors?.invalidKey) {
			keyRef.current?.focus();
		}
	}, [errors, keyRef] );

	return (
		<div>
			<h3>Login</h3>
			<Form method="post">
				<div>
					<label>
						Key: <input ref={ keyRef } type="text" name="authkey" />
					</label>
					<Error enabled={errors?.invalidKey} text="Invalid Key" />
				</div>
				<input type="hidden" name="r" value={redirectPath} />
				<button type="submit">Login</button>
			</Form>
		</div>
	);
}

function useRedirectPath() {
	const [searchParams] = useSearchParams();
	return searchParams.get("r") || "/";
}
