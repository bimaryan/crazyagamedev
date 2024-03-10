import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';
import { Link } from 'react-router-dom';

const Profil = () => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setUser(user);
        });

        return () => unsubscribe();
    }, []);

    if (!user) {
        return (
            <div className="container">
                <h2>Loading...</h2>
            </div>
        );
    }

    return (
        <div className="container">
            <ul className="nav nav-pills nav-fill gap-2 p-1 small rounded-5 shadow" id="pillNav2" role="tablist">
                <li className="nav-item" role="presentation">
                    <Link to="/community" className="nav-link rounded-5">Home</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/community/profil" className="nav-link rounded-5">Profil</Link>
                </li>
                <li className="nav-item" role="presentation">
                    <Link to="/community/post" className="nav-link rounded-5">Upload Post</Link>
                </li>
            </ul>
            <h2>User Profile</h2>
            <div>
                <p>Name: {user.displayName}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
    );
}

export default Profil;
