import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './ResetPasswordPage.css';
import resetImage from '../../assets/images/Resetpasswordimage.png';

const API_BASE = 'http://localhost:5000/api/auth'; // adjust to your backend URL

const ResetPasswordPage = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState(1);            // 1 = request OTP, 2 = verify & reset
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const requestOtp = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/forgot-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send OTP');
      alert('OTP sent to your email!');
      setStep(2);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const res = await fetch(`${API_BASE}/reset-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp, newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Reset failed');
      alert('Password reset successful! Please login.');
      navigate('/login');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="reset-container">
      <div className="reset-form-container">
        <div className="reset-form">
          <h1>Reset Password</h1>
          <p className="reset-description">
            {step === 1
              ? 'Enter your email below to receive an OTP'
              : 'Enter the OTP sent to your email and choose a new password'}
          </p>

          {error && <p className="error-text">{error}</p>}

          <form
            id="resetForm"
            onSubmit={step === 1 ? requestOtp : resetPassword}
          >
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                placeholder="me@example.com"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={step === 2} // lock email after sending OTP
              />
            </div>

            {step === 2 && (
              <>
                <div className="form-group">
                  <label htmlFor="otp">OTP</label>
                  <input
                    type="text"
                    id="otp"
                    placeholder="6-digit code"
                    required
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="newPassword">New Password</label>
                  <input
                    type="password"
                    id="newPassword"
                    placeholder="New password"
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                  />
                </div>
              </>
            )}

            <button type="submit" className="reset-button" disabled={loading}>
              {loading
                ? 'Please wait…'
                : step === 1
                ? 'Send OTP'
                : 'Reset Password'}
            </button>
          </form>

          <div className="login-link">
            Back to <Link to="/login">Login</Link>
          </div>
        </div>
      </div>

      <div className="reset-image">
        <img src={resetImage} alt="Reset Password Illustration" />
      </div>
    </div>
  );
};

export default ResetPasswordPage;
