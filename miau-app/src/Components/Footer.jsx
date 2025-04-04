import React from "react";
import styles from "./Footer.module.css";
import Miau from "../Assets/miau-icon.svg?react";
function Footer() {
    return (
        <footer className={styles.footer}>
            <Miau />
            <p>Miau. Feito por Ryan Rodrigues. 2025</p>
        </footer>
    );
}

export default Footer;
