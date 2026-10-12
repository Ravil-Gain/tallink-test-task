import { NavLink } from "react-router";

export default function Header() {
  const linkClassName = ({ isActive }: { isActive: boolean }) =>
    `${isActive ? "text-[#2875ff] underline decoration-1 underline-offset-2 transition-colors" : ""}`;  

  return (
    <header className="flex h-8 shrink-0 items-center justify-center px-5 compact-landscape:h-[7dvh]">
      <nav aria-label="Main navigation" className="flex items-center gap-3">
        <NavLink
          data-testid="tab-exchange"
          to="/exchange"
          className={linkClassName}
        >
          Exchange Rate
        </NavLink>
        <span aria-hidden="true">|</span>
        <NavLink
          data-testid="tab-history"
          to="/history"
          className={linkClassName}
        >
          History
        </NavLink>
      </nav>
    </header>
  );
}
