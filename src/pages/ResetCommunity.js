import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";

const ResetCommunity = () => {
    const history = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        const emailVal = e.target.email.value;
        sendPasswordResetEmail(auth, emailVal)
            .then(() => {
                alert("Check your email for password reset instructions.");
                history("/");
            })
            .catch((err) => {
                alert(err.message);
            });
    };
    return (
        <>
            <div className="container">
                <h2 className="text-center">
                    CrazyGamedev Community
                </h2>
                <div className="row justify-content-center mt-4">
                    <div className="col-md-6">
                        <div className="card">
                            <div className="card-body">
                                <h2 className="card-title text-center mb-4">Reset Password</h2>
                                <form onSubmit={(e) => handleSubmit(e)}>
                                    <input name="email" type="email" placeholder="Enter your email" className="form-control" /><br /><br />
                                    <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                                    <a className="btn btn-success w-100 mt-2" href="/community/login">Login</a>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default ResetCommunity;