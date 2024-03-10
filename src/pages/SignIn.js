import React, { useState } from "react";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../firebase";
import { useNavigate } from "react-router-dom";
import { FaGoogle } from "react-icons/fa";

const SignIn = () => {
    const navigate = useNavigate();
    const [setIsLoggedIn] = useState(false);

    const handleSignInWithPopup = async () => {
        const provider = new GoogleAuthProvider();
        try {
            const result = await signInWithPopup(auth, provider);
            navigate("/community");
            setIsLoggedIn(true);
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
                            <h2 className="card-title text-center mb-4">Sign In</h2>
                            <button className="btn btn-primary w-100" onClick={handleSignInWithPopup}>
                                <FaGoogle style={{ marginRight: "10px" }} /> Sign in with Google
                            </button>
                            <a className="btn btn-danger w-100 mt-2" href="/community/reset">Reset Password</a>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SignIn;
