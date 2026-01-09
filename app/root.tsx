import { Loader2, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import {
	isRouteErrorResponse,
	Links,
	Meta,
	Outlet,
	Scripts,
	ScrollRestoration,
} from "react-router";
import type { Route } from "./+types/root";
import stylesheet from "./app.css?url";

function ThemeToggle() {
	const [dark, setDark] = useState(false);
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		const stored = localStorage.getItem("theme");
		const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
		const shouldBeDark = stored === "dark" || (!stored && prefersDark);
		setDark(shouldBeDark);
		document.documentElement.classList.toggle("dark", shouldBeDark);
		setMounted(true);
	}, []);

	const toggle = () => {
		const next = !dark;
		setDark(next);
		document.documentElement.classList.toggle("dark", next);
		localStorage.setItem("theme", next ? "dark" : "light");
	};

	if (!mounted) return <div className="size-6" />;

	return (
		<button
			type="button"
			onClick={toggle}
			className="p-1 border border-border hover:bg-muted transition-colors"
			aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
		>
			{dark ? <Sun className="size-4" /> : <Moon className="size-4" />}
		</button>
	);
}

export { ThemeToggle };

export const links: Route.LinksFunction = () => [
	{ rel: "stylesheet", href: stylesheet },
	{
		rel: "preload",
		href: "/fonts/Cairopixel.woff",
		as: "font",
		type: "font/woff",
		crossOrigin: "anonymous",
	},
];

export function HydrateFallback() {
	return (
		<div className="w-screen h-screen flex items-center justify-center">
			<Loader2 className="animate-spin" />
			<Scripts />
		</div>
	);
}

export function Layout({ children }: { children: React.ReactNode }) {
	return (
		<html lang="en">
			<head>
				<meta charSet="utf-8" />
				<meta name="viewport" content="width=device-width, initial-scale=1" />
				<Meta />
				<Links />
			</head>
			<body>
				{children}
				<ScrollRestoration />
				<Scripts />
			</body>
		</html>
	);
}

export default function App() {
	return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
	let message = "Oops!";
	let details = "An unexpected error occurred.";
	let stack: string | undefined;

	if (isRouteErrorResponse(error)) {
		message = error.status === 404 ? "404" : "Error";
		details =
			error.status === 404
				? "The requested page could not be found."
				: error.statusText || details;
	} else if (import.meta.env.DEV && error && error instanceof Error) {
		details = error.message;
		stack = error.stack;
	}

	console.log(error);

	return (
		<main className="pt-16 p-4 container mx-auto">
			<h1>{message}</h1>
			<p>{details}</p>
			{stack && (
				<pre className="w-full p-4 overflow-x-auto">
					<code>{stack}</code>
				</pre>
			)}
		</main>
	);
}
