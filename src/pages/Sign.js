import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const Sign = () => {
    const navigate = useNavigate();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const handleSignInWithGoogle = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            // Redirect to community page after successful sign-in
            navigate("/community");
            setIsLoggedIn(true); // Set isLoggedIn to true after successful sign-in
        } catch (error) {
            console.error("Error signing in with Google:", error.message);
        }
    };

    return (
        <div className="container">
            <h2 className="text-center">
                CrazyGamedev Community
            </h2>
            <div className="row justify-content-center mt-4">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Login</h2>
                            {isLoggedIn ? (
                                <button className="btn btn-success w-100" disabled>
                                    Logged In
                                </button>
                            ) : (
                                <button className="btn btn-primary w-100" onClick={handleSignInWithGoogle}>
                                    <FaGoogle style={{ marginRight: "10px" }} /> Sign in with Google
                                </button>
                            )}
                            <a className="btn btn-danger w-100 mt-2" href="/community/reset">Reset Password</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Sign;
