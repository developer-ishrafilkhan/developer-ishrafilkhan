(function () {
  const STORAGE_KEYS = {
    settings: "posterSettings",
    campaign: "posterCampaign",
    theme: "posterTheme"
  };

  const defaultSettings = {
    clientLogoText: "Client Logo",
    companyLogoText: "Company Logo",
    clientLogo: "",
    companyLogo: "",
    footerTitle: "SKYWORLD OVERSEAS SERVICES PVT. LTD.",
    footerSubtitle: "Approved by Ministry of External Affairs, Govt. of India",
    footerLines: [
      "Shop No. KD/7, Company Floor, Near Honda Showroom, Sector 4, Bokaro Steel City",
      "Email: sales@skyworldoverseas.com | skyworldoverseas@gmail.com",
      "Call: +91 8876088888 / 8876088889 / 8797407806 / 8797407809"
    ]
  };

  const defaultCampaign = {
    urgentHeadline: "Urgently required for M/s Metro Fire System LLC - UAE",
    interviewStatus: "Online interview soon | Shortlisting in progress",
    highlightBanner:
      "Share your updated CV, experience certificates, passport copy & photo on a white background",
    salaryLabel: "Salary in AED",
    positions: [
      { title: "Fire Alarm Technician", qty: "25", salary: "2000 - 3000" },
      { title: "Another role can be added", qty: "", salary: "" },
      { title: "Another role can be added", qty: "", salary: "" }
    ],
    visaInfo: "Visa ready | Age limit: 21-38 years",
    dutyInfo: "Duty: 09 hours + 1 hour break",
    contractInfo: "02 years of contract (renewable)",
    contractNote:
      "Submit CV, experience certificates, passport copy & photograph (white background).",
    benefits: "Accommodation, medical & transportation provided by company",
    managedBy: "Managed by Ministry of External Affairs, Govt. of India",
    contactLines: [
      "Email: hr@skyworldoverseas.com | sales@skyworldoverseas.com",
      "WhatsApp / Call: +91 8876088888, 8876088889, 8797407806, 8797407809",
      "Website: www.skyworldoverseas.com"
    ],
    location: "Bokaro Steel City - Jharkhand, India"
  };

  const colorPalettes = [
    {
      name: "Fire & Amber",
      primary: "#c42026",
      dark: "#8d0f13",
      accent: "#ffc533",
      neutral: "#fff4d6"
    },
    {
      name: "Indigo Coral",
      primary: "#1f3c88",
      dark: "#15285f",
      accent: "#ff725e",
      neutral: "#ffe3db"
    },
    {
      name: "Emerald Blaze",
      primary: "#006778",
      dark: "#004c58",
      accent: "#ffb703",
      neutral: "#eaf8f9"
    },
    {
      name: "Royal Violet",
      primary: "#5a189a",
      dark: "#3c096c",
      accent: "#f4a261",
      neutral: "#f6edff"
    },
    {
      name: "Graphite Neon",
      primary: "#313638",
      dark: "#1f2325",
      accent: "#f5cb5c",
      neutral: "#f2f4f8"
    }
  ];

  const state = {
    settings: clone(defaultSettings),
    campaign: clone(defaultCampaign),
    theme: colorPalettes[0],
    paletteIndex: 0
  };

  const settingsForm = document.getElementById("settingsForm");
  const campaignForm = document.getElementById("campaignForm");
  const addPositionBtn = document.getElementById("addPositionBtn");
  const generateBtn = document.getElementById("generateBtn");
  const colorGeneratorBtn = document.getElementById("colorGeneratorBtn");
  const positionsList = document.getElementById("positionsList");
  const themePreview = document.getElementById("themePreview");

  const clientLogoInput = document.getElementById("clientLogoInput");
  const companyLogoInput = document.getElementById("companyLogoInput");

  const clientLogoPreview = document.getElementById("clientLogoPreview");
  const companyLogoPreview = document.getElementById("companyLogoPreview");
  const clientLogoImage = document.getElementById("clientLogoImage");
  const companyLogoImage = document.getElementById("companyLogoImage");

  const urgentHeadlinePreview = document.getElementById("urgentHeadlinePreview");
  const interviewStatusPreview = document.getElementById("interviewStatusPreview");
  const highlightBannerPreview = document.getElementById("highlightBannerPreview");
  const salaryLabelPreview = document.getElementById("salaryLabelPreview");
  const positionsTableBody = document.getElementById("positionsTableBody");
  const infoStrip = document.getElementById("infoStrip");
  const visaInfoPreview = document.getElementById("visaInfoPreview");
  const dutyInfoPreview = document.getElementById("dutyInfoPreview");
  const contractInfoPreview = document.getElementById("contractInfoPreview");
  const contractNotePreview = document.getElementById("contractNotePreview");
  const benefitsPreview = document.getElementById("benefitsPreview");
  const managedByPreview = document.getElementById("managedByPreview");
  const contactLinesPreview = document.getElementById("contactLinesPreview");
  const footerTitlePreview = document.getElementById("footerTitlePreview");
  const footerSubtitlePreview = document.getElementById("footerSubtitlePreview");
  const footerLinesPreview = document.getElementById("footerLinesPreview");
  const locationPreview = document.getElementById("locationPreview");

  const positionRowTemplate = document.getElementById("positionRowTemplate");

  function init() {
    loadState();
    hydrateForms();
    updateTheme(state.theme);
    renderPoster();
    bindEvents();
  }

  function bindEvents() {
    settingsForm.addEventListener("input", handleSettingsChange);
    campaignForm.addEventListener("input", handleCampaignInput);
    campaignForm.addEventListener("change", handleCampaignInput);
    addPositionBtn.addEventListener("click", handleAddPosition);
    generateBtn.addEventListener("click", renderPoster);
    colorGeneratorBtn.addEventListener("click", cycleTheme);

    clientLogoInput.addEventListener("change", () => handleLogoUpload(clientLogoInput, "clientLogo"));
    companyLogoInput.addEventListener("change", () => handleLogoUpload(companyLogoInput, "companyLogo"));
  }

  function handleSettingsChange(event) {
    const { name, value } = event.target;
    if (!name) return;

    if (name === "footerLines") {
      state.settings[name] = splitLines(value);
    } else {
      state.settings[name] = value;
    }

    persistSettings();
    renderPoster();
  }

  function handleCampaignInput(event) {
    const target = event.target;
    const { name, value } = target;
    if (target.classList.contains("position-title") || target.classList.contains("position-qty") || target.classList.contains("position-salary")) {
      const index = Number(target.closest(".position-row").dataset.index);
      const prop = target.classList.contains("position-title")
        ? "title"
        : target.classList.contains("position-qty")
        ? "qty"
        : "salary";
      state.campaign.positions[index][prop] = value;
      persistCampaign();
      renderPoster();
      return;
    }

    if (!name) return;

    if (name === "contactLines") {
      state.campaign[name] = splitLines(value);
    } else if (name === "contractNote") {
      state.campaign[name] = value;
    } else {
      state.campaign[name] = value;
    }

    persistCampaign();
    // real-time update for headline sections
    renderPoster();
  }

  function handleAddPosition() {
    state.campaign.positions.push({ title: "New position", qty: "", salary: "" });
    persistCampaign();
    renderPositionsForm();
    renderPoster();
  }

  function handleLogoUpload(input, key) {
    const file = input.files && input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      state.settings[key] = e.target.result;
      persistSettings();
      renderPoster();
    };
    reader.readAsDataURL(file);
  }

  function cycleTheme() {
    state.paletteIndex = (state.paletteIndex + 1) % colorPalettes.length;
    state.theme = colorPalettes[state.paletteIndex];
    updateTheme(state.theme);
    persistTheme();
  }

  function updateTheme(theme) {
    const root = document.documentElement;
    root.style.setProperty("--primary-color", theme.primary);
    root.style.setProperty("--primary-dark", theme.dark || theme.primary);
    root.style.setProperty("--accent-color", theme.accent);
    root.style.setProperty("--accent-dark", theme.dark || theme.primary);
    root.style.setProperty("--background", theme.neutral || "#f4f6fb");
    updateThemePreview(theme);
  }

  function updateThemePreview(theme) {
    themePreview.innerHTML = "";
    const colors = [theme.primary, theme.accent, theme.neutral || "#ffffff"];
    colors.forEach((color) => {
      const swatch = document.createElement("span");
      swatch.style.background = color;
      swatch.title = color;
      themePreview.appendChild(swatch);
    });
    const label = document.createElement("small");
    label.textContent = `${theme.name} palette`;
    label.className = "theme-label";
    themePreview.appendChild(label);
  }

  function hydrateForms() {
    settingsForm.clientLogoText.value = state.settings.clientLogoText || "";
    settingsForm.companyLogoText.value = state.settings.companyLogoText || "";
    settingsForm.footerTitle.value = state.settings.footerTitle || "";
    settingsForm.footerSubtitle.value = state.settings.footerSubtitle || "";
    settingsForm.footerLines.value = (state.settings.footerLines || []).join("\n");

    campaignForm.urgentHeadline.value = state.campaign.urgentHeadline || "";
    campaignForm.interviewStatus.value = state.campaign.interviewStatus || "";
    campaignForm.highlightBanner.value = state.campaign.highlightBanner || "";
    campaignForm.salaryLabel.value = state.campaign.salaryLabel || "";
    campaignForm.visaInfo.value = state.campaign.visaInfo || "";
    campaignForm.dutyInfo.value = state.campaign.dutyInfo || "";
    campaignForm.contractInfo.value = state.campaign.contractInfo || "";
    campaignForm.contractNote.value = state.campaign.contractNote || "";
    campaignForm.benefits.value = state.campaign.benefits || "";
    campaignForm.managedBy.value = state.campaign.managedBy || "";
    campaignForm.contactLines.value = (state.campaign.contactLines || []).join("\n");
    campaignForm.location.value = state.campaign.location || "";

    renderPositionsForm();
  }

  function renderPositionsForm() {
    positionsList.innerHTML = "";
    state.campaign.positions.forEach((position, index) => {
      const row = positionRowTemplate.content.firstElementChild.cloneNode(true);
      row.dataset.index = index;
      const titleInput = row.querySelector(".position-title");
      const qtyInput = row.querySelector(".position-qty");
      const salaryInput = row.querySelector(".position-salary");
      titleInput.value = position.title || "";
      qtyInput.value = position.qty || "";
      salaryInput.value = position.salary || "";
      row.querySelector(".remove-position").addEventListener("click", () => removePosition(index));
      positionsList.appendChild(row);
    });
  }

  function removePosition(index) {
    if (state.campaign.positions.length <= 1) {
      state.campaign.positions = [{ title: "", qty: "", salary: "" }];
    } else {
      state.campaign.positions.splice(index, 1);
    }
    persistCampaign();
    renderPositionsForm();
    renderPoster();
  }

  function renderPoster() {
    urgentHeadlinePreview.textContent = toUpper(state.campaign.urgentHeadline);
    interviewStatusPreview.textContent = toUpper(state.campaign.interviewStatus);
    if (state.campaign.highlightBanner) {
      highlightBannerPreview.classList.remove("hidden");
      highlightBannerPreview.textContent = toUpper(state.campaign.highlightBanner);
    } else {
      highlightBannerPreview.classList.add("hidden");
      highlightBannerPreview.textContent = "";
    }
    salaryLabelPreview.textContent = state.campaign.salaryLabel || "Salary";

    renderLogo(clientLogoPreview, clientLogoImage, state.settings.clientLogo, state.settings.clientLogoText);
    renderLogo(companyLogoPreview, companyLogoImage, state.settings.companyLogo, state.settings.companyLogoText);

    const positions = state.campaign.positions.filter((pos) => pos.title || pos.qty || pos.salary);
    positionsTableBody.innerHTML = "";

    const rows = positions.length ? positions : [{ title: "Add positions to populate the poster", qty: "", salary: "" }];

    rows.forEach((position, index) => {
      const tr = document.createElement("tr");
      const indexCell = document.createElement("td");
      indexCell.textContent = positions.length ? index + 1 : "";
      const titleCell = document.createElement("td");
      titleCell.textContent = toUpper(position.title);
      const qtyCell = document.createElement("td");
      qtyCell.textContent = position.qty;
      const salaryCell = document.createElement("td");
      salaryCell.textContent = position.salary;
      tr.append(indexCell, titleCell, qtyCell, salaryCell);
      positionsTableBody.appendChild(tr);
    });

    updateTextContent(visaInfoPreview, state.campaign.visaInfo);
    updateTextContent(dutyInfoPreview, state.campaign.dutyInfo);
    const showInfoStrip = !visaInfoPreview.classList.contains("hidden") || !dutyInfoPreview.classList.contains("hidden");
    infoStrip.classList.toggle("hidden", !showInfoStrip);
    updateTextContent(contractInfoPreview, state.campaign.contractInfo);
    updateTextContent(contractNotePreview, state.campaign.contractNote);
    updateTextContent(benefitsPreview, state.campaign.benefits);
    updateTextContent(managedByPreview, state.campaign.managedBy);

    renderLines(contactLinesPreview, state.campaign.contactLines);

    footerTitlePreview.textContent = toUpper(state.settings.footerTitle);
    footerSubtitlePreview.textContent = toUpper(state.settings.footerSubtitle);
    renderLines(footerLinesPreview, state.settings.footerLines);
    locationPreview.textContent = toUpper(state.campaign.location);
  }

  function renderLogo(container, imageElement, dataUrl, placeholder) {
    const textElement = container.querySelector("span");
    if (dataUrl) {
      container.classList.add("has-image");
      imageElement.src = dataUrl;
      textElement.textContent = placeholder || "";
    } else {
      container.classList.remove("has-image");
      imageElement.removeAttribute("src");
      textElement.textContent = (placeholder || "").toUpperCase();
    }
  }

  function updateTextContent(element, value) {
    if (!value) {
      element.classList.add("hidden");
      element.textContent = "";
      return;
    }
    element.classList.remove("hidden");
    element.textContent = toUpper(value);
  }

  function renderLines(container, lines) {
    container.innerHTML = "";
    if (!lines || !lines.length) {
      container.classList.add("hidden");
      return;
    }
    container.classList.remove("hidden");
    lines.filter(Boolean).forEach((line) => {
      const span = document.createElement("span");
      span.textContent = toUpper(line);
      container.appendChild(span);
    });
  }

  function loadState() {
    const savedSettings = readLocalStorage(STORAGE_KEYS.settings);
    const savedCampaign = readLocalStorage(STORAGE_KEYS.campaign);
    const savedTheme = readLocalStorage(STORAGE_KEYS.theme);

    if (savedSettings) {
      state.settings = Object.assign({}, defaultSettings, savedSettings);
      if (!Array.isArray(state.settings.footerLines)) {
        state.settings.footerLines = clone(defaultSettings.footerLines);
      }
    }

    if (savedCampaign) {
      state.campaign = Object.assign({}, defaultCampaign, savedCampaign);
      state.campaign.positions = Array.isArray(savedCampaign.positions)
        ? savedCampaign.positions
        : clone(defaultCampaign.positions);
      if (!state.campaign.positions.length) {
        state.campaign.positions = clone(defaultCampaign.positions);
      }
      state.campaign.contactLines = Array.isArray(savedCampaign.contactLines)
        ? savedCampaign.contactLines
        : clone(defaultCampaign.contactLines);
      if (!state.campaign.contactLines.length) {
        state.campaign.contactLines = clone(defaultCampaign.contactLines);
      }
    }

    if (savedTheme) {
      const matchIndex = colorPalettes.findIndex((palette) => palette.name === savedTheme.name);
      state.paletteIndex = matchIndex >= 0 ? matchIndex : 0;
      state.theme = Object.assign({}, colorPalettes[state.paletteIndex], savedTheme);
    }
  }

  function persistSettings() {
    writeLocalStorage(STORAGE_KEYS.settings, state.settings);
  }

  function persistCampaign() {
    writeLocalStorage(STORAGE_KEYS.campaign, state.campaign);
  }

  function persistTheme() {
    writeLocalStorage(STORAGE_KEYS.theme, state.theme);
  }

  function readLocalStorage(key) {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } catch (error) {
      console.warn(`Unable to read ${key}`, error);
      return null;
    }
  }

  function writeLocalStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (error) {
      console.warn(`Unable to persist ${key}`, error);
    }
  }

  function splitLines(value) {
    return value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0);
  }

  function toUpper(value) {
    return value ? value.toString().toUpperCase() : "";
  }

  function clone(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  init();
})();
