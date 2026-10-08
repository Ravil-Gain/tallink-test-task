import { NavLink } from "react-router";

export default function Header() {
  return (
    <div>
      <nav>
        <NavLink data-testid="tab-exchange" to="/exchange">
          Exchange Rate
        </NavLink>
        <NavLink data-testid="tab-history" to="/history">
          History
        </NavLink>
      </nav>
    </div>
  );
}
