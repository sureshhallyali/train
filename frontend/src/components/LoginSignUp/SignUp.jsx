import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import OtpInput from "react-otp-input";

const SignUp = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setphone] = useState();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreeTerms, setAgreeTerms] = useState(false);
  const [otp, setOtp] = useState("");
  const [isOtpSent, setIsOtpSent] = useState(false);

  const handleSignUp = async (e) => {
    e.preventDefault();
    if (
      !name ||
      !email ||
      !phone ||
      !password ||
      !confirmPassword ||
      !agreeTerms
    ) {
      alert("Please fill in all fields, agree to terms, and enter OTP.");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match.");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          password,
          confirmPass: confirmPassword,
        }),
      });
      const res = await response.json();
      if (response.status === 201) {
        alert(res.message);
        navigate("/login");
      } else if (response.status === 500) {
        alert("server error");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const generateOTP = () => {
    const generatedOTP = Math.floor(1000 + Math.random() * 9000);
    setOtp(generatedOTP.toString());
    setIsOtpSent(true);
  };

  return (
    <div className="header">
      <div className="container">
        <h1>Sign Up</h1>
        <form>
          <input
            type="text"
            placeholder="First Name"
            value={name}
            onChange={(e) => setname(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="phone"
            placeholder="Phone Number"
            value={phone}
            onChange={(e) => setphone(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Re-Enter Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <div className="term">
            <input
              type="checkbox"
              id="checkbox"
              checked={agreeTerms}
              onChange={() => setAgreeTerms(!agreeTerms)}
            />
            <label htmlFor="checkbox">
              I agree to the <Link to="#">Terms & Conditions</Link>
            </label>
          </div>
          <button onClick={handleSignUp}>Sign Up</button>
          <div className="member">
            Already have an account? <Link to="/login">Login</Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
