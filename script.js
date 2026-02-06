document.addEventListener("DOMContentLoaded", () => {
  const API_BASE_URL = "http://localhost:4000/api";
  const userStatus = document.getElementById("userStatus");
  const signupForm = document.getElementById("signupForm");
  const loginForm = document.getElementById("loginForm");
  const logoutBtn = document.getElementById("logoutBtn");
  const joinSessionForm = document.getElementById("joinSessionForm");
  const createSessionForm = document.getElementById("createSessionForm");
  const createSessionBtn = document.getElementById("createSessionBtn");
  const createSessionHint = document.getElementById("createSessionHint");
  const scrollCreateSession = document.getElementById("scrollCreateSession");

  const saveAuth = (data) => {
    localStorage.setItem("btls_token", data.token);
    localStorage.setItem("btls_user", JSON.stringify(data.user));
  };

  const clearAuth = () => {
    localStorage.removeItem("btls_token");
    localStorage.removeItem("btls_user");
  };

  const getToken = () => localStorage.getItem("btls_token");
  const getUser = () => {
    const raw = localStorage.getItem("btls_user");
    return raw ? JSON.parse(raw) : null;
  };

  const updateAuthUI = () => {
    const user = getUser();
    if (userStatus) {
      userStatus.textContent = user ? `Hi, ${user.name}` : "Guest";
    }
    if (logoutBtn) {
      logoutBtn.style.display = user ? "inline-block" : "none";
    }
    if (createSessionBtn) {
      createSessionBtn.disabled = !user;
    }
    if (createSessionHint) {
      createSessionHint.textContent = user
        ? "Create a new room and share the Room ID."
        : "Log in to create a session.";
    }
  };

  updateAuthUI();

  const notifyBtn = document.getElementById("notifyBtn");
  if (notifyBtn) {
    notifyBtn.addEventListener("click", () => {
      Swal.fire({
        title: "Updates Enabled",
        text: "We'll notify you before your next BT Live Stream session.",
        icon: "success",
        confirmButtonColor: "#234756",
      });
    });
  }

  if (scrollCreateSession) {
    scrollCreateSession.addEventListener("click", () => {
      createSessionForm?.scrollIntoView({ behavior: "smooth" });
    });
  }

  if (signupForm) {
    signupForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(signupForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${API_BASE_URL}/auth/signup`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to sign up");
        }

        saveAuth(data);
        updateAuthUI();
        signupForm.reset();
        Swal.fire({
          title: "Account created",
          text: "Welcome to BT Live Stream!",
          icon: "success",
          confirmButtonColor: "#234756",
        });
      } catch (error) {
        Swal.fire({
          title: "Sign up failed",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#234756",
        });
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(loginForm);
      const payload = Object.fromEntries(formData.entries());

      try {
        const response = await fetch(`${API_BASE_URL}/auth/login`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to log in");
        }

        saveAuth(data);
        updateAuthUI();
        loginForm.reset();
        Swal.fire({
          title: "Logged in",
          text: "You can now create sessions.",
          icon: "success",
          confirmButtonColor: "#234756",
        });
      } catch (error) {
        Swal.fire({
          title: "Login failed",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#234756",
        });
      }
    });
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", () => {
      clearAuth();
      updateAuthUI();
      Swal.fire({
        title: "Logged out",
        text: "You are now browsing as a guest.",
        icon: "info",
        confirmButtonColor: "#234756",
      });
    });
  }

  if (joinSessionForm) {
    joinSessionForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const formData = new FormData(joinSessionForm);
      const roomId = String(formData.get("roomId") || "").trim();

      if (!roomId) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/sessions/${roomId}`);
        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Room not found");
        }

        Swal.fire({
          title: "Session found",
          text: `Room ${data.session.room_id} is ready.`,
          icon: "success",
          confirmButtonColor: "#234756",
        });
        joinSessionForm.reset();
      } catch (error) {
        Swal.fire({
          title: "Unable to join",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#234756",
        });
      }
    });
  }

  if (createSessionForm) {
    createSessionForm.addEventListener("submit", async (event) => {
      event.preventDefault();
      const token = getToken();
      if (!token) {
        Swal.fire({
          title: "Login required",
          text: "Please log in to create a session.",
          icon: "warning",
          confirmButtonColor: "#234756",
        });
        return;
      }

      const formData = new FormData(createSessionForm);
      const payload = Object.fromEntries(formData.entries());
      if (!payload.title) {
        return;
      }

      try {
        const response = await fetch(`${API_BASE_URL}/sessions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Unable to create session");
        }

        Swal.fire({
          title: "Session created",
          text: `Room ID: ${data.session.room_id}`,
          icon: "success",
          confirmButtonColor: "#234756",
        });
        createSessionForm.reset();
      } catch (error) {
        Swal.fire({
          title: "Creation failed",
          text: error.message,
          icon: "error",
          confirmButtonColor: "#234756",
        });
      }
    });
  }

  const localVideo = document.getElementById("localVideo");
  const startSessionBtn = document.getElementById("startSessionBtn");
  const toggleCameraBtn = document.getElementById("toggleCameraBtn");
  const toggleMicBtn = document.getElementById("toggleMicBtn");
  const endSessionBtn = document.getElementById("endSessionBtn");

  let localStream = null;
  let sessionActive = false;

  const setButtonState = () => {
    if (toggleCameraBtn) {
      toggleCameraBtn.textContent = localStream ? "Turn Off Camera" : "Turn On Camera";
    }
    if (toggleMicBtn) {
      const micEnabled = localStream?.getAudioTracks().some((track) => track.enabled);
      toggleMicBtn.textContent = micEnabled ? "Mute" : "Unmute";
    }
    if (endSessionBtn) {
      endSessionBtn.disabled = !sessionActive;
    }
  };

  const attachStream = (stream) => {
    if (localVideo) {
      localVideo.srcObject = stream;
    }
  };

  const startLocalStream = async () => {
    if (localStream) {
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: true,
      });
      localStream = stream;
      attachStream(stream);
      setButtonState();
    } catch (error) {
      Swal.fire({
        title: "Camera access blocked",
        text: "Please allow camera and microphone permissions to start a live session.",
        icon: "error",
        confirmButtonColor: "#234756",
      });
    }
  };

  const stopLocalStream = () => {
    if (!localStream) {
      return;
    }
    localStream.getTracks().forEach((track) => track.stop());
    localStream = null;
    if (localVideo) {
      localVideo.srcObject = null;
    }
    setButtonState();
  };

  if (toggleCameraBtn) {
    toggleCameraBtn.addEventListener("click", async () => {
      if (localStream) {
        stopLocalStream();
      } else {
        await startLocalStream();
      }
    });
  }

  if (toggleMicBtn) {
    toggleMicBtn.addEventListener("click", async () => {
      if (!localStream) {
        await startLocalStream();
      }
      if (!localStream) {
        return;
      }
      localStream.getAudioTracks().forEach((track) => {
        track.enabled = !track.enabled;
      });
      setButtonState();
    });
  }

  if (startSessionBtn) {
    startSessionBtn.addEventListener("click", async () => {
      if (!localStream) {
        await startLocalStream();
      }
      if (!localStream) {
        return;
      }
      sessionActive = true;
      setButtonState();
      Swal.fire({
        title: "Live session started",
        text: "Your camera is live and ready for peer-to-peer connections.",
        icon: "success",
        confirmButtonColor: "#234756",
      });
    });
  }

  if (endSessionBtn) {
    endSessionBtn.addEventListener("click", () => {
      sessionActive = false;
      stopLocalStream();
      Swal.fire({
        title: "Session ended",
        text: "Your live session has been closed.",
        icon: "info",
        confirmButtonColor: "#234756",
      });
    });
  }

  const ctx = document.getElementById("engagementChart");
  if (ctx) {
    new Chart(ctx, {
      type: "line",
      data: {
        labels: ["08:00", "10:00", "12:00", "14:00", "16:00", "18:00"],
        datasets: [
          {
            label: "Active Participants",
            data: [120, 150, 210, 180, 230, 200],
            borderColor: "#234756",
            backgroundColor: "rgba(35, 71, 86, 0.15)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#c66f3d",
          },
          {
            label: "Bandwidth (Mbps)",
            data: [80, 95, 140, 130, 160, 150],
            borderColor: "#c66f3d",
            backgroundColor: "rgba(198, 111, 61, 0.12)",
            tension: 0.4,
            fill: true,
            pointBackgroundColor: "#234756",
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#234756",
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#234756" },
            grid: { display: false },
          },
          y: {
            ticks: { color: "#234756" },
            grid: { color: "rgba(35, 71, 86, 0.1)" },
          },
        },
      },
    });
  }

  if (window.jQuery && document.getElementById("sessionsTable")) {
    $("#sessionsTable").DataTable({
      pageLength: 4,
      lengthChange: false,
      searching: true,
      info: false,
      language: {
        search: "Search sessions:",
      },
    });
  }
});
