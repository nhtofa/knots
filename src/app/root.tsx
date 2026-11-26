import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  isRouteErrorResponse,
} from "react-router";
import { SITE_DESCRIPTION, SITE_NAME } from "./shared/site";
import { THEME_SCRIPT } from "./shared/ui/ThemeToggle";
import "./styles/global.css";
import type { Route } from "./+types/root";

export function Layout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ece7de" />
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
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

export const links = () => [
  {
    rel: "preload",
    as: "font",
    type: "font/woff2",
    href: "/fonts/schibsted-grotesk-latin.woff2",
    crossOrigin: "anonymous",
  },
];

export const meta = () => [
  { title: SITE_NAME },
  { name: "description", content: SITE_DESCRIPTION },
];

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  const message = isRouteErrorResponse(error)
    ? error.status === 404
      ? "This page isn’t here"
      : "This page didn’t load"
    : "This page didn’t load";
  return (
    <main
      style={{ display: "grid", placeContent: "center", height: "100dvh", textAlign: "center" }}
    >
      <h1>{message}</h1>
      <p>
        <a href="/">Back to the knots</a>
      </p>
    </main>
  );
}
