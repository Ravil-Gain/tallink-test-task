import { Outlet } from "react-router";
import { AppStateProvider } from "../../app/AppStateProvider";
import KeypadWidget from "../../widgets/Keypad";
import Header from "./Header";

export default function Layout() {
  return (
    <AppStateProvider>
      <div className="min-h-dvh bg-[#F3EEEE1A] sm:flex sm:items-center sm:justify-center sm:p-6">
        <div className="flex h-dvh w-full flex-col sm:h-[844px] sm:w-[390px] sm:overflow-hidden sm:rounded-[30px] sm:bg-white sm:shadow-lg">
          <Header />
          <main className="flex min-h-0 flex-1 flex-col">
            <Outlet />
            <KeypadWidget />
          </main>
        </div>
      </div>
    </AppStateProvider>
  );
}
