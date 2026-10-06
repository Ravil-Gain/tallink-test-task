import { NavLink } from "react-router";

export default function Header() {
  return (
    <div>
      <nav>
        <NavLink to="/exchange">Exchange Rate</NavLink>
        <NavLink to="/history">History</NavLink>
      </nav>
    </div>
  );
}
