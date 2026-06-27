import "../css/main.css";

const weddingEvent = {
  title: "Walimatulurus Syahir & Zubairah",
  location:
    "Alam Maya Kajang, Jalan Sungai Kantan, Taman Melati, Kajang, Selangor, Malaysia",
  details: "Walimatulurus Syahir & Zubairah",
  start: "20260808T030000Z",
  end: "20260808T080000Z",
};

const defaultWishes = [
  {
    name: "Keluarga",
    message: "Semoga berbahagia hingga ke Jannah.",
  },
  {
    name: "Sahabat",
    message:
      "Tahniah buat Syahir dan Zubairah. Semoga dipermudahkan segalanya.",
  },
  {
    name: "Keluarga",
    message: "Semoga berbahagia hingga ke Jannah.",
  },
  {
    name: "Sahabat",
    message:
      "Tahniah buat Syahir dan Zubairah. Semoga dipermudahkan segalanya.",
  },
  {
    name: "Keluarga",
    message: "Semoga berbahagia hingga ke Jannah.",
  },
  {
    name: "Sahabat",
    message:
      "Tahniah buat Syahir dan Zubairah. Semoga dipermudahkan segalanya.",
  },
];

document.addEventListener("DOMContentLoaded", () => {
  document
    .getElementById("openInvitation")
    ?.addEventListener("click", unveilInvitation);

  document
    .getElementById("musicToggle")
    ?.addEventListener("click", toggleMusic);

  document
    .getElementById("wishForm")
    ?.addEventListener("submit", handleWishSubmit);

  document
    .getElementById("wishShortcut")
    ?.addEventListener("click", scrollToWishes);

  document.querySelectorAll("[data-sheet-target]").forEach((button) => {
    button.addEventListener("click", () =>
      openSheet(button.dataset.sheetTarget),
    );
  });

  document.querySelectorAll(".sheet-close").forEach((button) => {
    button.addEventListener("click", closeSheets);
  });

  document.querySelectorAll("[data-close-sheet]").forEach((button) => {
    button.addEventListener("click", closeSheets);
  });

  document
    .getElementById("sheetBackdrop")
    ?.addEventListener("click", closeSheets);

  setupCalendarLinks();
  renderWishes();
});

function unveilInvitation() {
  const envelope = document.getElementById("envelope-cover");
  const invitationShell = document.getElementById("invitationShell");
  const mainArea = document.getElementById("main-scroll-view");
  const musicBox = document.getElementById("musicToggle");
  const mediaTrack = document.getElementById("bgMusic");

  invitationShell?.scrollTo({ top: 0, behavior: "auto" });
  mainArea?.classList.remove("main-body-lock");
  mainArea?.classList.add("main-body-active");
  envelope?.classList.add("door-opening");

  mediaTrack
    ?.play()
    .then(() => {
      document.getElementById("musicDisk")?.classList.add("spin-active");
    })
    .catch((err) => {
      console.warn("Music playback needs a user gesture on this device.", err);
    });

  activateScrollWatcher();

  window.setTimeout(() => {
    invitationShell?.classList.remove("invitation-locked");
    invitationShell?.classList.add("invitation-opened");
    musicBox?.classList.remove("hidden");
    document.getElementById("footerActions")?.classList.remove("hidden");
  }, 1600);

  window.setTimeout(() => {
    envelope?.classList.add("hidden");
  }, 2100);
}

function toggleMusic() {
  const track = document.getElementById("bgMusic");
  const spinningDisk = document.getElementById("musicDisk");

  if (!track || !spinningDisk) return;

  if (track.paused) {
    track.play();
    spinningDisk.classList.add("spin-active");
    spinningDisk.innerHTML = "&#9835;";
  } else {
    track.pause();
    spinningDisk.classList.remove("spin-active");
    spinningDisk.innerHTML = "&#128263;";
  }
}

function activateScrollWatcher() {
  const viewItems = document.querySelectorAll(".reveal-item");

  const configObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((item) => {
        if (item.isIntersecting) {
          item.target.classList.add("show-now");
        }
      });
    },
    { threshold: 0.12 },
  );

  viewItems.forEach((targetObj) => {
    configObserver.observe(targetObj);
  });
}

function openSheet(sheetId) {
  closeSheets();
  document.getElementById("invitationShell")?.classList.add("sheet-is-open");
  document
    .querySelector(`[data-sheet-target="${sheetId}"]`)
    ?.classList.add("is-active");
  const musicToggle = document.getElementById("musicToggle");
  const sheet = document.getElementById(sheetId);

  musicToggle?.classList.add("sheet-floating-top");
  document.getElementById("sheetBackdrop")?.classList.remove("hidden");
  sheet?.classList.remove("hidden");

  if (musicToggle && sheet) {
    const sheetStyles = window.getComputedStyle(sheet);
    const sheetBottom = Number.parseFloat(sheetStyles.bottom) || 0;
    const sheetHeight = sheet.offsetHeight;
    const musicGap = sheetBottom + sheetHeight + 24;

    musicToggle.style.bottom = `${Math.round(musicGap)}px`;
  }
}

function closeSheets() {
  document.getElementById("invitationShell")?.classList.remove("sheet-is-open");
  const musicToggle = document.getElementById("musicToggle");

  musicToggle?.classList.remove("sheet-floating-top");
  if (musicToggle) {
    musicToggle.style.bottom = "";
  }

  document.getElementById("sheetBackdrop")?.classList.add("hidden");
  document.querySelectorAll("[data-sheet-target]").forEach((button) => {
    button.classList.remove("is-active");
  });
  document.querySelectorAll(".action-sheet").forEach((sheet) => {
    sheet.classList.add("hidden");
  });
}

function scrollToWishes() {
  closeSheets();
  document
    .getElementById("wishesSection")
    ?.scrollIntoView({ behavior: "smooth" });
}

function setupCalendarLinks() {
  const googleCalendar = new URL("https://calendar.google.com/calendar/render");
  googleCalendar.searchParams.set("action", "TEMPLATE");
  googleCalendar.searchParams.set("text", weddingEvent.title);
  googleCalendar.searchParams.set(
    "dates",
    `${weddingEvent.start}/${weddingEvent.end}`,
  );
  googleCalendar.searchParams.set("details", weddingEvent.details);
  googleCalendar.searchParams.set("location", weddingEvent.location);

  const ics = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Wedding E-card//EN",
    "BEGIN:VEVENT",
    "UID:syahir-zubairah-20260808@wedding-ecard",
    `DTSTAMP:${weddingEvent.start}`,
    `DTSTART:${weddingEvent.start}`,
    `DTEND:${weddingEvent.end}`,
    `SUMMARY:${weddingEvent.title}`,
    `DESCRIPTION:${weddingEvent.details}`,
    `LOCATION:${weddingEvent.location}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");

  document
    .getElementById("googleCalendarLink")
    ?.setAttribute("href", googleCalendar);
  document
    .getElementById("appleCalendarLink")
    ?.setAttribute(
      "href",
      `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`,
    );
}

function getWishes() {
  const savedWishes = window.localStorage.getItem("weddingWishes");
  return savedWishes ? JSON.parse(savedWishes) : defaultWishes;
}

function saveWishes(wishes) {
  window.localStorage.setItem("weddingWishes", JSON.stringify(wishes));
}

function renderWishes() {
  const wishTrack = document.getElementById("wishTrack");
  if (!wishTrack) return;

  const wishes = getWishes();
  const repeatedWishes = [...wishes, ...wishes];

  wishTrack.replaceChildren(
    ...repeatedWishes.map((wish) => {
      const item = document.createElement("article");
      const message = document.createElement("p");
      const name = document.createElement("strong");

      item.className = "wish-chip";
      message.textContent = `"${wish.message}"`;
      name.textContent = wish.name;

      item.append(message, name);
      return item;
    }),
  );
}

function handleWishSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const feedback = document.getElementById("wishStatusFeedback");
  const formData = new FormData(form);
  const wish = {
    name: formData.get("wishName").trim(),
    message: formData.get("wishMessage").trim(),
  };

  if (!wish.name || !wish.message) return;

  const wishes = [wish, ...getWishes()];
  saveWishes(wishes);
  renderWishes();

  feedback.className = "api-feedback-msg is-success";
  feedback.textContent = "Terima kasih, ucapan anda telah disimpan.";
  form.reset();
}
