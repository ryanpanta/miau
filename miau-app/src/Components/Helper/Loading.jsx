import React from "react";
import styles from "./Loading.module.css";
function Loading() {
    const [step, setStep] = React.useState(0);

    React.useEffect(() => {
        function updateStep() {
            setStep((step) => {
                if (step < 3) return step + 1;
                else return 0;
            });
        }
        const interval = setInterval(updateStep, 300);
        return () => {  
          clearInterval(interval)
        }
    }, []);

    function displayStep(i) {
        return {
            display: step === i ? "block" : "none",
        };
    }
    return (
        <div className={styles.wrapper}>
            <div className={styles.loading}>
                <svg
                    width="46"
                    height="31"
                    viewBox="0 0 46 31"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <g style={displayStep(0)}>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M28.3414 18C29.6129 18 30.7462 18.8015 31.1699 20.0003C31.5832 21.1695 32.6985 22 34 22C35.6569 22 37 20.6569 37 19C37 18.2297 36.7136 17.5335 36.2368 17.0007C35.2173 15.8617 35.2173 14.1383 36.2368 12.9993C36.7136 12.4665 37 11.7703 37 11C37 9.34315 35.6569 8 34 8C32.6985 8 31.5832 8.8305 31.1699 9.99974C30.7462 11.1985 29.6129 12 28.3414 12L11.6586 12C10.3871 12 9.25377 11.1985 8.83007 9.99974C8.4168 8.8305 7.30153 8 6 8C4.34314 8 3 9.34314 3 11C3 11.7703 3.28637 12.4665 3.76319 12.9993C4.78265 14.1383 4.78265 15.8617 3.76319 17.0007C3.28637 17.5335 3 18.2297 3 19C3 20.6569 4.34314 22 6 22C7.30153 22 8.4168 21.1695 8.83007 20.0003C9.25377 18.8015 10.3871 18 11.6586 18L28.3414 18ZM11.6586 21C10.8349 23.3304 8.61244 25 6 25C2.68629 25 -7.56806e-07 22.3137 -6.11959e-07 19C-5.44788e-07 17.4633 0.577705 16.0615 1.52779 15C0.577705 13.9385 -3.2944e-07 12.5367 -2.62268e-07 11C-1.17422e-07 7.68629 2.68629 5 6 5C8.61244 5 10.8349 6.66961 11.6586 9L28.3414 9C29.1651 6.66961 31.3876 5 34 5C37.3137 5 40 7.68629 40 11C40 12.5367 39.4223 13.9385 38.4722 15C39.4223 16.0615 40 17.4633 40 19C40 22.3137 37.3137 25 34 25C31.3876 25 29.1651 23.3304 28.3414 21L11.6586 21Z"
                            fill="#333"
                        />
                    </g>
                    <g style={displayStep(1)}>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M39.4683 16.5271C39.8098 17.2811 40 18.1184 40 19C40 22.3137 37.3137 25 34 25C31.3876 25 29.1651 23.3304 28.3414 21H11.6586C10.8349 23.3304 8.61244 25 6 25C2.68629 25 0 22.3137 0 19C0 17.4633 0.577705 16.0615 1.52779 15C0.577705 13.9385 0 12.5367 0 11C0 7.68629 2.68629 5 6 5C8.61244 5 10.8349 6.66961 11.6586 9L27.1178 9C27.2875 10.07 27.6358 11.0805 28.1313 12L11.6586 12C10.3871 12 9.25377 11.1985 8.83007 9.99974C8.4168 8.8305 7.30153 8 6 8C4.34314 8 3 9.34314 3 11C3 11.7703 3.28637 12.4665 3.76319 12.9993C4.78265 14.1383 4.78265 15.8617 3.76319 17.0007C3.28637 17.5335 3 18.2297 3 19C3 20.6569 4.34314 22 6 22C7.30153 22 8.4168 21.1695 8.83007 20.0003C9.25377 18.8015 10.3871 18 11.6586 18H28.3414C29.6129 18 30.7462 18.8015 31.1699 20.0003C31.5832 21.1695 32.6985 22 34 22C35.6569 22 37 20.6569 37 19C37 18.2297 36.7136 17.5335 36.2368 17.0007C36.2355 16.9993 36.2342 16.9978 36.2329 16.9963C36.3216 16.9988 36.4107 17 36.5 17C37.5366 17 38.5344 16.834 39.4683 16.5271Z"
                            fill="#333"
                        />
                        <path
                            d="M29.353 2.75224C29.1581 1.94707 29.6528 1.13633 30.4579 0.941391C31.2631 0.746455 32.0738 1.24114 32.2688 2.04631L32.9747 4.96207C33.1696 5.76724 32.6749 6.57798 31.8698 6.77291C31.0646 6.96785 30.2539 6.47316 30.0589 5.668L29.353 2.75224Z"
                            fill="#333"
                        />
                        <path
                            d="M38.174 3.06412C38.6055 2.35694 39.5286 2.13346 40.2357 2.56495C40.9429 2.99645 41.1664 3.91953 40.7349 4.62671L39.1723 7.18763C38.7408 7.89481 37.8177 8.11829 37.1105 7.68679C36.4034 7.2553 36.1799 6.33222 36.6114 5.62504L38.174 3.06412Z"
                            fill="#333"
                        />
                        <path
                            d="M43.7375 9.04412C44.5426 8.84919 45.3534 9.34387 45.5483 10.149C45.7432 10.9542 45.2485 11.7649 44.4434 11.9599L41.5276 12.6658C40.7225 12.8607 39.9117 12.3661 39.7168 11.5609C39.5218 10.7557 40.0165 9.94498 40.8217 9.75005L43.7375 9.04412Z"
                            fill="#333"
                        />
                    </g>
                    <g style={displayStep(2)}>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M22.0129 21H11.6586C10.8349 23.3304 8.61244 25 6 25C2.68629 25 0 22.3137 0 19C0 17.4633 0.577705 16.0615 1.52779 15C0.577705 13.9385 0 12.5367 0 11C0 7.68629 2.68629 5 6 5C8.61244 5 10.8349 6.66961 11.6586 9L27.1178 9C27.2875 10.07 27.6358 11.0805 28.1313 12L11.6586 12C10.3871 12 9.25377 11.1985 8.83007 9.99974C8.4168 8.8305 7.30153 8 6 8C4.34314 8 3 9.34314 3 11C3 11.7703 3.28637 12.4665 3.76319 12.9993C4.78265 14.1383 4.78265 15.8617 3.76319 17.0007C3.28637 17.5335 3 18.2297 3 19C3 20.6569 4.34314 22 6 22C7.30153 22 8.4168 21.1695 8.83007 20.0003C9.25377 18.8015 10.3871 18 11.6586 18H22.6655C22.2943 18.9361 22.0676 19.9453 22.0129 21Z"
                            fill="#333"
                        />

                        <path
                            d="M34.2595 13.207C35.0288 12.8997 35.9016 13.2743 36.2088 14.0437C36.5161 14.813 36.1415 15.6858 35.3721 15.993L32.5861 17.1057C31.8167 17.4129 30.944 17.0383 30.6367 16.2689C30.3295 15.4996 30.7041 14.6269 31.4734 14.3196L34.2595 13.207Z"
                            fill="#333"
                        />
                        <path
                            d="M35.2028 21.9829C35.964 22.3097 36.3163 23.1917 35.9895 23.9529C35.6627 24.7142 34.7807 25.0664 34.0195 24.7397L31.2627 23.5564C30.5014 23.2296 30.1492 22.3476 30.4759 21.5864C30.8027 20.8251 31.6847 20.4729 32.446 20.7996L35.2028 21.9829Z"
                            fill="#333"
                        />
                        <path
                            d="M30.0729 28.3388C30.3802 29.1082 30.0056 29.9809 29.2362 30.2882C28.4669 30.5954 27.5941 30.2208 27.2869 29.4515L26.1743 26.6654C25.867 25.8961 26.2416 25.0233 27.011 24.7161C27.7803 24.4088 28.6531 24.7834 28.9603 25.5528L30.0729 28.3388Z"
                            fill="#333"
                        />
                    </g>
                    <g style={displayStep(3)}>
                        <path
                            fillRule="evenodd"
                            clipRule="evenodd"
                            d="M9.71327 11.2838C9.31961 10.9487 9.0105 10.5102 8.83007 9.99974C8.4168 8.8305 7.30153 8 6 8C4.34314 8 3 9.34314 3 11C3 11.7703 3.28637 12.4665 3.76319 12.9993C4.78265 14.1383 4.78265 15.8617 3.76319 17.0007C3.28637 17.5335 3 18.2297 3 19C3 20.6569 4.34314 22 6 22C7.30153 22 8.4168 21.1695 8.83007 20.0003C9.0105 19.4898 9.31961 19.0513 9.71327 18.7162C10.1296 19.7556 10.7154 20.709 11.4365 21.5419C10.4796 23.5849 8.40507 25 6 25C2.68629 25 0 22.3137 0 19C0 17.4633 0.577705 16.0615 1.52779 15C0.577705 13.9385 0 12.5367 0 11C0 7.68629 2.68629 5 6 5C8.40508 5 10.4796 6.41508 11.4365 8.45807C10.7154 9.29104 10.1296 10.2444 9.71327 11.2838ZM27.1532 9.20856C27.1406 9.1393 27.1288 9.06978 27.1178 9H27.0007C27.0524 9.06884 27.1033 9.13836 27.1532 9.20856Z"
                            fill="#333"
                        />
                        <path
                            d="M16.839 6.06068C17.4248 5.47489 18.3745 5.47489 18.9603 6.06068C19.5461 6.64646 19.5461 7.59621 18.9603 8.182L16.839 10.3033C16.2532 10.8891 15.3034 10.8891 14.7177 10.3033C14.1319 9.71753 14.1319 8.76778 14.7177 8.182L16.839 6.06068Z"
                            fill="#333"
                        />
                        <path
                            d="M21.1673 13.7531C21.9957 13.7531 22.6673 14.4246 22.6673 15.2531C22.6673 16.0815 21.9957 16.7531 21.1673 16.7531H18.1673C17.3388 16.7531 16.6673 16.0815 16.6673 15.2531C16.6673 14.4246 17.3388 13.7531 18.1673 13.7531H21.1673Z"
                            fill="#333"
                        />
                        <path
                            d="M18.9603 21.617C19.5461 22.2028 19.5461 23.1526 18.9603 23.7383C18.3745 24.3241 17.4248 24.3241 16.839 23.7383L14.7177 21.617C14.1319 21.0312 14.1319 20.0815 14.7177 19.4957C15.3034 18.9099 16.2532 18.9099 16.839 19.4957L18.9603 21.617Z"
                            fill="#333"
                        />
                    </g>
                </svg>
            </div>
        </div>
    );
}

export default Loading;
