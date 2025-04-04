import React from "react";
import styles from "./Header.module.css";
import { Link } from "react-router-dom";
import Miau from "../Assets/miau-icon.svg?react";
import { UserContext } from "../UserContext";
function Header() {
    const { data } = React.useContext(UserContext);
    console.log(data);
    return (
        <header className={styles.header}>
            <nav className={`${styles.nav} container`}>
                <Link className={styles.logo} to="/" aria-label="Miau - Home">
                    <Miau />
                </Link>
                {data ? (
                    <Link className={styles.login} to="/conta">
                        {data.username}
                    </Link>
                ) : (
                    <Link className={styles.login} to="/login">
                        Login / Criar
                    </Link>
                )}
            </nav>
        </header>
    );
}

export default Header;
