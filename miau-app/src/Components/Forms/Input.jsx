import React from "react";
import styles from "./Input.module.css";

function Input({ label, name, type, value, onChange, error, onBlur }) {
    return (
        <div className={styles.wrapper}>
            <label className={styles.label} htmlFor={name}>
                {label}
            </label>
            <input
                className={styles.input}
                id={name}
                name={name}
                type={type}
                value={value}
                onChange={onChange}
                onBlur={onBlur}
            />
            {error && <p className={styles.error}>{error}</p>}
        </div>
    );
}

export default Input;
