import { ActionArgs, json, LinksFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CreatePost } from "~/utils/posts.server";
import stylesUrl from "~/styles/new.css";

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

interface ActionData {
	invalidKey?: boolean,
	invalidMessage?: boolean
}

export async function action(args: ActionArgs) {
	const formData = await args.request.formData();
	const authkey = formData.get('authkey');
	const message = formData.get('message');

	const testKey = process.env.TEST_APP_KEY;
	if ( !authkey || typeof authkey !== "string" || !testKey || authkey !== testKey )
		return json< ActionData >({ invalidKey: true });

	if ( !message || typeof message !== "string" || message.length > 255 )
		return json< ActionData >({ invalidMessage: true });

	await CreatePost(message);

	return redirect('/posts');
};

export default function NewPost() {
	const errors = useActionData< typeof action >();
	return (
		<div>
			<h3>Create New Post</h3>
			<Form method="post">
				<div>
					<label>
						Key: <input type="text" name="authkey" />
					</label>
					<Error enabled={errors?.invalidKey} text="Invalid Key" />
				</div>
				<div>
					<label>
						Message: <input type="text" name="message" maxLength={ 255 } />
					</label>
					<Error enabled={errors?.invalidMessage} text="Invalid Message" />
				</div>
				<button type="submit">Create</button>
			</Form>
		</div>
	);
}

function Error(props: {enabled: boolean | undefined, text: string}) {
	let {enabled, text} = props;
	if (!enabled)
		return null;

	return (
		<span className="SubmitError">{'<-- ' + text}</span>
	);
}
