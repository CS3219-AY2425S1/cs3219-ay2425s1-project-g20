import { Outlet, createRootRoute } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/router-devtools";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { CopilotKit } from "@copilotkit/react-core";

export const Route = createRootRoute({
  component: RootLayout,
});

function RootLayout() {
  return (
    <>
      <Outlet />
      {import.meta.env.DEV && <ReactQueryDevtools buttonPosition="top-right" />}
      {import.meta.env.DEV && <TanStackRouterDevtools position="top-right" />}
    </>
  );
}
