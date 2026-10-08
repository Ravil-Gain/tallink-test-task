import { Outlet } from "react-router";
import { AppStateProvider } from "../../app/AppStateProvider";
import KeypadWidget from "../../widgets/Keypad";
import Header from "./Header";

export default function Layout() {
  return (
    <>
      <Header />
      <AppStateProvider>
        <main>
          <Outlet />
          <KeypadWidget />
        </main>
      </AppStateProvider>
    </>
  );
}
