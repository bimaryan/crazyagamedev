import React, { useEffect, useState } from "react";
// import { useNavigate } from 'react-router-dom';
import { auth } from '../firebase';
import { Link } from "react-router-dom";

const Navbar = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });
        const storedTheme = localStorage.getItem('theme');

        const getPreferredTheme = () => {
            if (storedTheme) {
                return storedTheme;
            }

            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        };

        const setTheme = function (theme) {
            if (theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches) {
                document.documentElement.setAttribute('data-bs-theme', 'dark');
            } else {
                document.documentElement.setAttribute('data-bs-theme', theme);
            }
        };

        setTheme(getPreferredTheme());

        const showActiveTheme = theme => {
            const activeThemeIcon = document.querySelector('.theme-icon-active');
            const btnToActive = document.querySelector(`[data-bs-theme-value="${theme}"]`);
            const iconOfActiveBtn = btnToActive.querySelector('i').dataset.themeIcon;

            document.querySelectorAll('[data-bs-theme-value]').forEach(element => {
                element.classList.remove('active');
            });

            btnToActive.classList.add('active');
            activeThemeIcon.classList.remove(activeThemeIcon.dataset.themeIconActive);
            activeThemeIcon.classList.add(iconOfActiveBtn);
            activeThemeIcon.dataset.iconActive = iconOfActiveBtn;
        };

        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
            if (storedTheme !== 'light' && storedTheme !== 'dark') {
                setTheme(getPreferredTheme());
            }
        });

        showActiveTheme(getPreferredTheme());

        document.querySelectorAll('[data-bs-theme-value]').forEach(toggle => {
            toggle.addEventListener('click', () => {
                const theme = toggle.getAttribute('data-bs-theme-value');
                localStorage.setItem('theme', theme);
                setTheme(theme);
                showActiveTheme(theme);
            });
        });

        return () => unsubscribe();
    }, []);

    const handleLogout = () => {
        auth.signOut();
    };

    const renderAuthButton = () => {
        if (user) {
            return (
                <button onClick={handleLogout} className="nav-link text-danger"><i className="bi bi-box-arrow-in-left"></i> Logout</button>
            );
        } else {
            return (
                <a href="/login" className="nav-link text-success"><i className="bi bi-box-arrow-in-right"></i> Login</a>
            );
        }
    };

    return (
        <nav className="navbar navbar-expand-lg bg-body-tertiary shadow fixed-top">
            <div className="container-fluid">
                <a className="navbar-brand" href="/">CrazyGamedev</a>
                <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav">
                        <li>
                            <a className="nav-link" href="/community">Community</a>
                        </li>
                        <li className="nav-item">
                            {renderAuthButton()}
                        </li>
                        <li className="nav-item">
                            <div className="dropdown">
                                <button className="nav-link dropdown-toggle" data-bs-toggle="dropdown">
                                    <i className="bi bi-moon-stars theme-icon-active" data-theme-icon-active="bi-sun-fill"></i>
                                </button>
                                <ul className="dropdown-menu">
                                    <li>
                                        <button className="dropdown-item" href="#light" type="button" data-bs-theme-value="light"><i className="bi bi-sun-fill me-2 opacity-50" data-theme-icon="bi-sun-fill"></i> Light</button>
                                    </li>
                                    <li>
                                        <button className="dropdown-item" href="#dark" type="button" data-bs-theme-value="dark"><i className="bi bi-moon-fill me-2 opacity-50" data-theme-icon="bi-moon-fill"></i> Dark</button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
