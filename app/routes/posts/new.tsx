import { ActionArgs, json, LinksFunction, redirect } from "@remix-run/node";
import { Form, useActionData } from "@remix-run/react";
import { CreatePost } from "~/utils/posts.server";
import stylesUrl from "~/styles/new.css";
import { RequireSession } from "~/utils/session.server";
import { Error } from '~/components/error';

export const links: LinksFunction = () => {
	return [{ rel: "stylesheet", href: stylesUrl }];
};

export async function action({request, context}: ActionArgs) {
	await RequireSession(request);
	const formData = await request.formData();
	const message = formData.get('message');

	if ( !message || typeof message !== "string" || message.length > 255 )
		return json({ invalidMessage: true });

	await CreatePost(context, message);

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
						Message: <input type="text" name="message" maxLength={ 255 } />
					</label>
					<Error enabled={errors?.invalidMessage} text="Invalid Message" />
				</div>
				<button type="submit">Create</button>
			</Form>
		</div>
	);
}
