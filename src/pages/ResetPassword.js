import { sendPasswordResetEmail } from "firebase/auth";
import React from "react";
import { auth } from '../firebase';
import { useNavigate } from "react-router-dom";

function ResetPassword() {
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
        <div className="container">
            <div className="row justify-content-center">
                <div className="col-md-6">
                    <div className="card">
                        <div className="card-body">
                            <h2 className="card-title text-center mb-4">Reset Password</h2>
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <input name="email" type="email" placeholder="Enter your email" className="form-control" /><br /><br />
                                <button type="submit" className="btn btn-primary w-100">Reset Password</button>
                                <a className="btn btn-success w-100 mt-2" href="/login">Login</a>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ResetPassword;