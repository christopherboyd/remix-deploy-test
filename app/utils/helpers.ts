/**
 * pulled from remix example project
 */
export function SafeRedirect(to: FormDataEntryValue | string | null | undefined) {
	if (!to || typeof to !== "string")
		return '/';

	if (!to.startsWith("/") || to.startsWith("//"))
		return '/';

	return to;
}
