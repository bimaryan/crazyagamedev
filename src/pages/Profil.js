import React, { useState, useEffect } from 'react';
import { auth } from '../firebase';

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
            <h2>User Profile</h2>
            <div>
                <p>Name: {user.displayName}</p>
                <p>Email: {user.email}</p>
            </div>
        </div>
    );
}

export default Profil;
