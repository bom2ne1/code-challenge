import { NavLink } from "react-router";

const styles = {
  header: {
    padding: "10px",
    backgroundColor: "#333",
    color: "white",
    display: "flex",
    justifyContent: "space-around",
  },
  link: {
    color: "white",
    textDecoration: "none",
    margin: "0 10px",
  },
  activeLink: {
    fontWeight: "bold",
    textDecoration: "underline",
  }
};

export default function Header() {
  return (
    <header style={styles.header}>
      <nav>
        <NavLink
          to="/"
          style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
        >
          Home
        </NavLink>
        <NavLink
          to="/chat"
          style={({ isActive }) => isActive ? { ...styles.link, ...styles.activeLink } : styles.link}
        >
          Chat
        </NavLink>
      </nav>
    </header>
  );
}
