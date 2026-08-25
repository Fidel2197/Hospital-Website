const navToggle = document.querySelector("[data-nav-toggle]");
const navMenu = document.querySelector("#primary-navigation");

if (navToggle && navMenu) {
  navToggle.addEventListener("click", () => {
    const isOpen = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!isOpen));
    navMenu.classList.toggle("is-open", !isOpen);
  });
}

document.querySelectorAll(".appointment-form").forEach((form) => {
  const confirmation = form.querySelector(".appointment__confirmation");

  form.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(form);
    const firstName = String(formData.get("first-name") || "there").trim();
    const reason = String(formData.get("reason") || "your visit").trim();

    if (confirmation) {
      const title = document.createElement("strong");
      const message = document.createElement("span");
      title.textContent = "Appointment request received.";
      message.textContent = `Thank you, ${firstName || "there"}. Our scheduling team will review your request about "${reason || "your visit"}" and contact you with available times.`;
      confirmation.replaceChildren(title, message);
      confirmation.hidden = false;
      confirmation.scrollIntoView({ block: "center" });
    }

    form.reset();
  });
});

const portalRoot = document.querySelector("[data-portal-root]");

if (portalRoot) {
  const accountsKey = "fortunatocare-portal-accounts-v2";
  const sessionKey = "fortunatocare-portal-session-v2";
  const pendingKey = "fortunatocare-portal-pending-v2";

  const portalStatus = document.querySelector("#patientPortalStatus");
  const portalCreateForm = document.querySelector("#portalCreateForm");
  const portalSigninForm = document.querySelector("#portalSigninForm");
  const portalVerifyForm = document.querySelector("#portalVerifyForm");
  const portalDashboard = document.querySelector("#portalDashboard");
  const patientPortalCode = document.querySelector("#patientPortalCode");
  const portalTabs = document.querySelectorAll("[data-portal-tab]");
  const portalSignOut = document.querySelector("#portalSignOut");
  const resendPatientCode = document.querySelector("#resendPatientCode");

  const readJson = (key, fallback) => {
    try {
      return JSON.parse(localStorage.getItem(key)) || fallback;
    } catch {
      return fallback;
    }
  };

  const readAccounts = () => readJson(accountsKey, {});

  const saveAccounts = (accounts) => {
    localStorage.setItem(accountsKey, JSON.stringify(accounts));
  };

  const setPortalStatus = (message) => {
    if (portalStatus) {
      portalStatus.textContent = message;
    }
  };

  const createPortalCode = () =>
    String(Math.floor(100000 + Math.random() * 900000));

  const hashPassword = (password) => {
    let hash = 5381;
    for (let index = 0; index < password.length; index += 1) {
      hash = (hash * 33) ^ password.charCodeAt(index);
    }
    return String(hash >>> 0);
  };

  const getSessionAccount = () => {
    const sessionEmail = localStorage.getItem(sessionKey);
    if (!sessionEmail) {
      return null;
    }

    const accounts = readAccounts();
    const account = accounts[sessionEmail];
    return account && account.verified ? account : null;
  };

  const showPortalView = (viewName) => {
    const panels = {
      create: portalCreateForm,
      signin: portalSigninForm,
      verify: portalVerifyForm,
      dashboard: portalDashboard,
    };

    Object.entries(panels).forEach(([name, panel]) => {
      if (panel) {
        panel.hidden = name !== viewName;
      }
    });

    portalTabs.forEach((tab) => {
      tab.classList.toggle("is-active", tab.dataset.portalTab === viewName);
    });
  };

  const showDashboard = (account) => {
    const nameTarget = document.querySelector("[data-portal-name]");
    const emailTarget = document.querySelector("[data-portal-email]");

    if (nameTarget) {
      nameTarget.textContent = account.name;
    }

    if (emailTarget) {
      emailTarget.textContent = account.email;
    }

    setPortalStatus(`Signed in as ${account.name}.`);
    showPortalView("dashboard");
  };

  const refreshPortal = () => {
    const sessionAccount = getSessionAccount();

    if (sessionAccount) {
      showDashboard(sessionAccount);
      return;
    }

    const pendingEmail = localStorage.getItem(pendingKey);
    const pendingAccount = pendingEmail ? readAccounts()[pendingEmail] : null;

    if (pendingAccount && !pendingAccount.verified) {
      setPortalStatus(`Verification pending for ${pendingAccount.email}.`);
      if (patientPortalCode) {
        patientPortalCode.textContent = `Security code: ${pendingAccount.code}`;
      }
      showPortalView("verify");
      return;
    }

    if (patientPortalCode) {
      patientPortalCode.textContent = "Security code: ----";
    }

    setPortalStatus("No patient is signed in.");
    showPortalView("create");
  };

  portalTabs.forEach((tab) => {
    tab.addEventListener("click", () => {
      localStorage.removeItem(pendingKey);
      if (patientPortalCode) {
        patientPortalCode.textContent = "Security code: ----";
      }
      showPortalView(tab.dataset.portalTab);
      setPortalStatus(
        tab.dataset.portalTab === "signin"
          ? "Sign in with your existing FortunatoCare account."
          : "Create an account to activate your care workspace."
      );
    });
  });

  if (portalCreateForm) {
    portalCreateForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(portalCreateForm);
      const name = String(formData.get("name") || "").trim();
      const email = String(formData.get("email") || "").trim().toLowerCase();
      const password = String(formData.get("password") || "");
      const accounts = readAccounts();

      if (accounts[email]?.verified) {
        setPortalStatus("An account already exists for this email. Sign in to continue.");
        showPortalView("signin");
        return;
      }

      const code = createPortalCode();
      accounts[email] = {
        name,
        email,
        passwordHash: hashPassword(password),
        verified: false,
        code,
        createdAt: new Date().toISOString(),
      };

      saveAccounts(accounts);
      localStorage.setItem(pendingKey, email);
      localStorage.removeItem(sessionKey);
      portalCreateForm.reset();

      if (patientPortalCode) {
        patientPortalCode.textContent = `Security code: ${code}`;
      }

      setPortalStatus(`Account created for ${email}. Enter the security code to activate access.`);
      showPortalView("verify");
    });
  }

  if (portalSigninForm) {
    portalSigninForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const formData = new FormData(portalSigninForm);
      const email = String(formData.get("email") || "").trim().toLowerCase();
      const password = String(formData.get("password") || "");
      const account = readAccounts()[email];

      if (!account || account.passwordHash !== hashPassword(password)) {
        setPortalStatus("The email or password does not match an active account.");
        return;
      }

      if (!account.verified) {
        localStorage.setItem(pendingKey, email);
        if (patientPortalCode) {
          patientPortalCode.textContent = `Security code: ${account.code}`;
        }
        setPortalStatus("Account found. Verify access before continuing.");
        showPortalView("verify");
        return;
      }

      localStorage.setItem(sessionKey, email);
      localStorage.removeItem(pendingKey);
      portalSigninForm.reset();
      showDashboard(account);
    });
  }

  if (portalVerifyForm) {
    portalVerifyForm.addEventListener("submit", (event) => {
      event.preventDefault();

      const pendingEmail = localStorage.getItem(pendingKey);
      const accounts = readAccounts();
      const account = pendingEmail ? accounts[pendingEmail] : null;
      const code = String(new FormData(portalVerifyForm).get("code") || "").trim();

      if (!account || code !== account.code) {
        setPortalStatus("That code does not match the current account.");
        return;
      }

      accounts[pendingEmail] = {
        ...account,
        verified: true,
        code: "",
        verifiedAt: new Date().toISOString(),
      };

      saveAccounts(accounts);
      localStorage.setItem(sessionKey, pendingEmail);
      localStorage.removeItem(pendingKey);
      portalVerifyForm.reset();
      showDashboard(accounts[pendingEmail]);
    });
  }

  if (resendPatientCode) {
    resendPatientCode.addEventListener("click", () => {
      const pendingEmail = localStorage.getItem(pendingKey);
      const accounts = readAccounts();
      const account = pendingEmail ? accounts[pendingEmail] : null;

      if (!account) {
        setPortalStatus("Create an account before requesting a security code.");
        showPortalView("create");
        return;
      }

      const code = createPortalCode();
      accounts[pendingEmail] = { ...account, verified: false, code };
      saveAccounts(accounts);

      if (patientPortalCode) {
        patientPortalCode.textContent = `Security code: ${code}`;
      }

      setPortalStatus(`A new security code is ready for ${pendingEmail}.`);
    });
  }

  if (portalSignOut) {
    portalSignOut.addEventListener("click", () => {
      localStorage.removeItem(sessionKey);
      setPortalStatus("Signed out. You can sign in again anytime.");
      showPortalView("signin");
    });
  }

  refreshPortal();
}
