import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { auth } from '../firebase';

const Verify = () => {
    const { action, oobCode } = useParams();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (action === 'resetPassword') {
            // Verifying password reset code
            auth.verifyPasswordResetCode(oobCode)
                .then((email) => {
                    setEmail(email);
                })
                .catch((error) => {
                    setError(error.message);
                });
        }
    }, [action, oobCode]);

    const handleResetPassword = async () => {
        try {
            await auth.confirmPasswordReset(oobCode, password);
            // Password reset successful, you can redirect the user to a login page
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <div className="container">
            <h2>Password Reset</h2>
            {action === 'resetPassword' && email ? (
                <form onSubmit={handleResetPassword}>
                    <div className="mb-3">
                        <label htmlFor="password" className="form-label">New Password:</label>
                        <input
                            type="password"
                            className="form-control"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <button type="submit" className="btn btn-primary">Reset Password</button>
                    {error && <p className="text-danger mt-3">{error}</p>}
                </form>
            ) : (
                <p>Invalid action or password reset link has expired.</p>
            )}
        </div>
    );
};

export default Verify;