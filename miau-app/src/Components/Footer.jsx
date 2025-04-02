import React from "react";
import styles from "./Footer.module.css";
import DogsFooter from "../Assets/dogs-footer.svg?react";
function Footer() {
    return (
        <footer className={styles.footer}>
            <DogsFooter />
            <p>Dogs. Alguns direitos reservados.</p>
        </footer>
    );
}

export default Footer;
