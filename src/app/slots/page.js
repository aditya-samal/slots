"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function Portal() {
  const [slots, setSlots] = useState([]);
  const [userSlot, setUserSlot] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const token = Cookies.get("token");
    console.log("Token:", token);
    if (!token) {
      router.push("/");
      return;
    }

    try {
      const decoded = jwt.decode(token);
      setUser(decoded);
      loadSlots();
    } catch (error) {
      router.push("/");
    }
  }, []);

  const loadSlots = async () => {
    try {
      const response = await fetch("/api/slots/get", {
        headers: {
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
      });
      const data = await response.json();
      if (response.ok) {
        setSlots(data.slots);
        setUserSlot(data.userSlot);
        // Set selected slot to current user slot if exists
        if (data.userSlot) {
          setSelectedSlot(`${data.userSlot.date}-${data.userSlot.time}`);
        }
      }
    } catch (error) {
      console.error("Failed to load slots:", error);
    } finally {
      setLoading(false);
    }
  };

  const saveSlot = async () => {
    if (!selectedSlot) {
      alert("Please select a slot first");
      return;
    }

    setSaving(true);
    try {
      const [date, time] = selectedSlot.split("-", 3); // Split into date and time parts
      const timeStr = selectedSlot.substring(11); // Get time portion after date

      const slot = slots.find(
        (s) =>
          s.date ===
            `${date}-${selectedSlot.split("-")[1]}-${
              selectedSlot.split("-")[2]
            }` && s.time === timeStr
      );
      const slotId = slot?._id || selectedSlot;

      const response = await fetch("/api/slots/book", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${Cookies.get("token")}`,
        },
        body: JSON.stringify({ slotId }),
      });

      if (response.ok) {
        loadSlots();
        alert("Slot booked successfully!");
      } else {
        const data = await response.json();
        alert(data.message);
      }
    } catch (error) {
      alert("Failed to book slot");
    } finally {
      setSaving(false);
    }
  };

  const logout = () => {
    Cookies.remove("token");
    router.push("/");
  };

  if (loading) {
    return (
      <div
        style={{
          minHeight: "100vh",
          backgroundColor: "#f8f9fa",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
        }}
      >
        <div
          style={{
            backgroundColor: "white",
            padding: "3rem 4rem",
            borderRadius: "12px",
            boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
            textAlign: "center",
          }}
        >
          <div
            style={{
              width: "40px",
              height: "40px",
              border: "4px solid #e9ecef",
              borderTop: "4px solid #0056b3",
              borderRadius: "50%",
              animation: "spin 1s linear infinite",
              margin: "0 auto 1rem",
            }}
          ></div>
          <div
            style={{
              color: "#495057",
              fontSize: "1.1rem",
              fontWeight: "500",
            }}
          >
            Loading...
          </div>
        </div>
      </div>
    );
  }

  const timeSlots = [
    "10:00-10:20",
    "10:25-10:45",
    "10:50-11:10",
    "11:15-11:35",
    "11:40-12:00",
    "13:00-13:20",
    "13:25-13:45",
    "13:50-14:10",
    "14:15-14:35",
    "14:40-15:00",
    "15:05-15:25",
    "15:30-15:50",
  ];

  const dates = ["2025-01-10"];

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundColor: "#f8f9fa",
        fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
      }}
    >
      <div
        style={{
          padding: "2rem",
          maxWidth: "1200px",
          margin: "0 auto",
          backgroundColor: "white",
          minHeight: "100vh",
          boxShadow: "0 0 20px rgba(0,0,0,0.1)",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "2rem",
            paddingBottom: "1rem",
            borderBottom: "3px solid #0056b3",
          }}
        >
          <h1
            style={{
              color: "#0056b3",
              fontSize: "2rem",
              fontWeight: "600",
              margin: "0",
            }}
          >
            Kindly Select Your Slot
          </h1>
          <div style={{ display: "flex", alignItems: "center", gap: "1rem" }}>
            <span
              style={{
                color: "#495057",
                fontSize: "1rem",
                fontWeight: "500",
              }}
            >
              Welcome, {user?.name}
            </span>
            <button
              onClick={logout}
              style={{
                padding: "0.6rem 1.2rem",
                backgroundColor: "#dc3545",
                color: "white",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer",
                fontSize: "0.9rem",
                fontWeight: "500",
                transition: "all 0.2s ease",
                boxShadow: "0 2px 4px rgba(220,53,69,0.2)",
              }}
              onMouseOver={(e) => (e.target.style.backgroundColor = "#c82333")}
              onMouseOut={(e) => (e.target.style.backgroundColor = "#dc3545")}
            >
              Logout
            </button>
          </div>
        </div>

        {userSlot && (
          <div
            style={{
              backgroundColor: "#e7f3ff",
              border: "2px solid #0056b3",
              borderRadius: "8px",
              padding: "1.2rem",
              marginBottom: "2rem",
              boxShadow: "0 2px 8px rgba(0,86,179,0.1)",
            }}
          >
            <div
              style={{
                color: "#0056b3",
                fontSize: "1.1rem",
                fontWeight: "600",
                marginBottom: "0.5rem",
              }}
            >
              Current Booking
            </div>
            <div
              style={{
                color: "#495057",
                fontSize: "1rem",
              }}
            >
              <strong>
                {new Date(userSlot.date).toLocaleDateString("en-US", {
                  month: "long",
                  day: "numeric",
                })}
                {" , "}
                {userSlot.time.split("-")[0]} - {userSlot.time.split("-")[1]}
              </strong>
            </div>
          </div>
        )}

        <div style={{ display: "grid", gap: "3rem" }}>
          {dates.map((date) => (
            <div
              key={date}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #dee2e6",
                borderRadius: "12px",
                padding: "2rem",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
              }}
            >
              <h2
                style={{
                  color: "#0056b3",
                  fontSize: "1.5rem",
                  fontWeight: "600",
                  marginBottom: "1.5rem",
                  marginTop: "0",
                  borderBottom: "2px solid #e9ecef",
                  paddingBottom: "0.5rem",
                }}
              >
                {date === "2025-05-31" ? "May 31, 2025" : "June 1, 2025"}
              </h2>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "1rem",
                }}
              >
                {timeSlots.map((time) => {
                  const slot = slots.find(
                    (s) => s.date === date && s.time === time
                  );
                  const isBooked = slot?.isBooked;
                  const isUserSlot =
                    userSlot &&
                    userSlot.date === date &&
                    userSlot.time === time;
                  const slotKey = `${date}-${time}`;
                  const isAvailable = !isBooked || isUserSlot;

                  return (
                    <label
                      key={slotKey}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        padding: "1.2rem",
                        border: "2px solid",
                        borderRadius: "10px",
                        backgroundColor: isBooked
                          ? "#e9ecef"
                          : selectedSlot === slotKey
                          ? "#e7f3ff"
                          : "#ffffff",
                        borderColor:
                          selectedSlot === slotKey
                            ? "#0056b3"
                            : isBooked
                            ? "#ced4da"
                            : "#28a745",
                        cursor: isAvailable ? "pointer" : "not-allowed",
                        opacity: isBooked && !isUserSlot ? 0.5 : 1,
                        gap: "0.75rem",
                        transition: "all 0.2s ease",
                        boxShadow:
                          selectedSlot === slotKey
                            ? "0 4px 12px rgba(0,86,179,0.15)"
                            : isBooked
                            ? "none"
                            : "0 2px 6px rgba(0,0,0,0.08)",
                      }}
                      onMouseOver={(e) => {
                        if (
                          isAvailable &&
                          selectedSlot !== slotKey &&
                          !isBooked
                        ) {
                          e.currentTarget.style.backgroundColor = "#f8f9fa";
                          e.currentTarget.style.transform = "translateY(-2px)";
                        }
                      }}
                      onMouseOut={(e) => {
                        if (
                          isAvailable &&
                          selectedSlot !== slotKey &&
                          !isBooked
                        ) {
                          e.currentTarget.style.backgroundColor = "#ffffff";
                          e.currentTarget.style.transform = "translateY(0)";
                        }
                      }}
                    >
                      <input
                        type="radio"
                        name="timeSlot"
                        value={slotKey}
                        checked={selectedSlot === slotKey}
                        onChange={(e) => setSelectedSlot(e.target.value)}
                        disabled={isBooked}
                        style={{
                          width: "18px",
                          height: "18px",
                          cursor: isBooked ? "not-allowed" : "pointer",
                          accentColor: "#0056b3",
                        }}
                      />
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            fontSize: "1.1rem",
                            fontWeight: isUserSlot ? "600" : "500",
                            color: isBooked ? "#6c757d" : "#495057",
                            marginBottom: "0.25rem",
                          }}
                        >
                          {time}
                        </div>
                        {isBooked && !isUserSlot && (
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#6c757d",
                              fontStyle: "italic",
                            }}
                          >
                            Occupied
                          </div>
                        )}
                        {isUserSlot && (
                          <div
                            style={{
                              fontSize: "0.85rem",
                              color: "#0056b3",
                              fontWeight: "500",
                            }}
                          >
                            Your Current Slot
                          </div>
                        )}
                      </div>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        <div
          style={{
            marginTop: "3rem",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "2rem",
            paddingTop: "2rem",
            borderTop: "2px solid #e9ecef",
          }}
        >
          <button
            onClick={saveSlot}
            disabled={!selectedSlot || saving}
            style={{
              padding: "1.2rem 3rem",
              fontSize: "1.1rem",
              fontWeight: "600",
              backgroundColor: selectedSlot ? "#0056b3" : "#adb5bd",
              color: "white",
              border: "none",
              borderRadius: "8px",
              cursor: selectedSlot && !saving ? "pointer" : "not-allowed",
              minWidth: "180px",
              transition: "all 0.2s ease",
              boxShadow: selectedSlot
                ? "0 4px 12px rgba(0,86,179,0.25)"
                : "none",
              textTransform: "uppercase",
              letterSpacing: "0.5px",
            }}
            onMouseOver={(e) => {
              if (selectedSlot && !saving) {
                e.target.style.backgroundColor = "#004494";
                e.target.style.transform = "translateY(-2px)";
              }
            }}
            onMouseOut={(e) => {
              if (selectedSlot && !saving) {
                e.target.style.backgroundColor = "#0056b3";
                e.target.style.transform = "translateY(0)";
              }
            }}
          >
            {saving ? "Saving..." : "Save Slot"}
          </button>
        </div>
      </div>
    </div>
  );
}
