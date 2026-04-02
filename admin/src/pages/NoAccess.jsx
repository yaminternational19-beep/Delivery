import React from "react";

const NoAccess = () => {
    const userName = localStorage.getItem("userName") || "User";
    const userRole = localStorage.getItem("userRole") || "Unknown Role";

    return (
        <div style={{
            height: "100vh",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#f8fafc",
            fontFamily: "var(--font-family, sans-serif)"
        }}>
            <div style={{
                background: "white",
                padding: "2rem 3rem",
                borderRadius: "16px",
                boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                textAlign: "center",
                maxWidth: "400px"
            }}>
                <div style={{
                    width: "64px",
                    height: "64px",
                    backgroundColor: "#fee2e2",
                    color: "#dc2626",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    margin: "0 auto 1.5rem auto",
                    fontSize: "32px",
                    fontWeight: "bold"
                }}>
                    !
                </div>
                <h1 style={{ color: "#0f172a", marginBottom: "0.5rem", fontSize: "1.5rem" }}>
                    Welcome {userName}
                </h1>
                <p style={{ color: "#64748b", margin: 0, fontWeight: 500 }}>
                    Role: {userRole.replace("_", " ")}
                </p>

                <div style={{
                    marginTop: "1.5rem",
                    padding: "1rem",
                    backgroundColor: "#f1f5f9",
                    borderRadius: "8px",
                    color: "#334155",
                    fontSize: "0.95rem",
                    lineHeight: 1.5
                }}>
                    You currently do not have any module permissions.
                    <br />
                    Please contact Super Admin.
                </div>

                <button
                    onClick={() => {
                        localStorage.clear();
                        window.location.href = "/login";
                    }}
                    style={{
                        marginTop: "2rem",
                        padding: "0.75rem 1.5rem",
                        backgroundColor: "var(--primary-color)",
                        color: "white",
                        border: "none",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontWeight: 600,
                        width: "100%"
                    }}
                >
                    Return to Login
                </button>
            </div>
        </div>
    );
};

export default NoAccess;
