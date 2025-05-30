"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";

export default function Login() {
  const [email, setEmail] = useState("");
  const [passcode, setPasscode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, passcode }),
      });

      const data = await response.json();

      if (response.ok) {
        Cookies.set("token", data.token, { expires: 1 });
        router.push("/slots");
      } else {
        setError(data.message);
      }
    } catch (error) {
      setError("Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        padding: "1rem",
      }}
    >
      <div
        style={{
          backgroundColor: "white",
          padding: "3rem 2.5rem",
          borderRadius: "12px",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          width: "100%",
          maxWidth: "450px",
          border: "1px solid #dee2e6",
        }}
      >
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <h1
            style={{
              color: "#0056b3",
              fontSize: "2rem",
              fontWeight: "600",
              margin: "0 0 0.5rem 0",
            }}
          >
            Interview Portal
          </h1>
          <p
            style={{
              color: "#6c757d",
              fontSize: "1rem",
              margin: "0",
              fontWeight: "400",
            }}
          >
            Slot Booking System
          </p>
          <div
            style={{
              width: "60px",
              height: "3px",
              backgroundColor: "#0056b3",
              margin: "1rem auto 0",
              borderRadius: "2px",
            }}
          ></div>
        </div>

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: "1.5rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.6rem",
                color: "#495057",
                fontSize: "0.95rem",
                fontWeight: "500",
              }}
            >
              IITG Mail (Without @iitg.ac.in)
            </label>
            <input
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                border: "2px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                backgroundColor: "#ffffff",
                color: "#495057",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0056b3";
                e.target.style.boxShadow = "0 0 0 3px rgba(0,86,179,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          <div style={{ marginBottom: "2rem" }}>
            <label
              style={{
                display: "block",
                marginBottom: "0.6rem",
                color: "#495057",
                fontSize: "0.95rem",
                fontWeight: "500",
              }}
            >
              Passcode
            </label>
            <input
              type="password"
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              required
              placeholder="Enter your passcode"
              style={{
                width: "100%",
                padding: "0.9rem 1rem",
                border: "2px solid #e9ecef",
                borderRadius: "8px",
                fontSize: "1rem",
                fontFamily: "inherit",
                transition: "all 0.2s ease",
                backgroundColor: "#ffffff",
                color: "#495057",
                boxSizing: "border-box",
              }}
              onFocus={(e) => {
                e.target.style.borderColor = "#0056b3";
                e.target.style.boxShadow = "0 0 0 3px rgba(0,86,179,0.1)";
              }}
              onBlur={(e) => {
                e.target.style.borderColor = "#e9ecef";
                e.target.style.boxShadow = "none";
              }}
            />
          </div>

          {error && (
            <div
              style={{
                backgroundColor: "#f8d7da",
                color: "#721c24",
                padding: "0.9rem 1rem",
                borderRadius: "8px",
                marginBottom: "1.5rem",
                textAlign: "center",
                border: "1px solid #f5c6cb",
                fontSize: "0.9rem",
                fontWeight: "500",
              }}
            >
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "1rem",
              backgroundColor: loading ? "#adb5bd" : "#0056b3",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "1.1rem",
              fontWeight: "600",
              cursor: loading ? "not-allowed" : "pointer",
              transition: "all 0.2s ease",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
              boxShadow: loading ? "none" : "0 4px 12px rgba(0,86,179,0.25)",
            }}
            onMouseOver={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#004494";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (!loading) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? (
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "10px",
                }}
              >
                <div
                  style={{
                    width: "16px",
                    height: "16px",
                    border: "2px solid transparent",
                    borderTop: "2px solid white",
                    borderRadius: "50%",
                    animation: "spin 1s linear infinite",
                  }}
                ></div>
                Signing In...
              </div>
            ) : (
              "Sign In"
            )}
          </button>
        </form>

        <div
          style={{
            textAlign: "center",
            marginTop: "2rem",
            paddingTop: "1.5rem",
            borderTop: "1px solid #e9ecef",
          }}
        >
          <p
            style={{
              color: "#6c757d",
              fontSize: "0.85rem",
              margin: "0",
              lineHeight: "1.4",
            }}
          >
            Access restricted to authorized personnel only.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          0% {
            transform: rotate(0deg);
          }
          100% {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
}
