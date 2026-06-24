import "../css/main.css";
import { submitRsvp } from "./api.js";

const weddingEvent = {
  title: "Walimatul Urus Syahir & Zubairah",
  location: "Alam Maya, Kajang, Selangor",
  details: "Majlis perkahwinan Syahir dan Zubairah.",
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
    message: "Tahniah buat Syahir dan Zubairah. Semoga dipermudahkan segalanya.",
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
    .getElementById("weddingRsvpForm")
    ?.addEventListener("submit", handleRsvpSubmit);

  document
    .getElementById("wishForm")
    ?.addEventListener("submit", handleWishSubmit);

  document
    .getElementById("wishShortcut")
    ?.addEventListener("click", scrollToWishes);

  document.querySelectorAll("[data-sheet-target]").forEach((button) => {
    button.addEventListener("click", () => openSheet(button.dataset.sheetTarget));
  });

  document.querySelectorAll(".sheet-close").forEach((button) => {
    button.addEventListener("click", closeSheets);
  });

  document.getElementById("sheetBackdrop")?.addEventListener("click", closeSheets);

  setupCalendarLinks();
  renderWishes();
});

function unveilInvitation() {
  const envelope = document.getElementById("envelope-cover");
  const invitationShell = document.getElementById("invitationShell");
  const mainArea = document.getElementById("main-scroll-view");
  const musicBox = document.getElementById("musicToggle");
  const mediaTrack = document.getElementById("bgMusic");

  envelope?.classList.add("exit-slide-up");
  invitationShell?.classList.remove("invitation-locked");
  invitationShell?.classList.add("invitation-opened");
  invitationShell?.scrollTo({ top: 0, behavior: "auto" });
  mainArea?.classList.remove("main-body-lock");
  mainArea?.classList.add("main-body-active");
  musicBox?.classList.remove("hidden");
  document.getElementById("footerActions")?.classList.remove("hidden");

  mediaTrack
    ?.play()
    .then(() => {
      document.getElementById("musicDisk")?.classList.add("spin-active");
    })
    .catch((err) => {
      console.warn("Music playback needs a user gesture on this device.", err);
    });

  activateScrollWatcher();
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

async function handleRsvpSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const feedback = document.getElementById("rsvpStatusFeedback");
  const formData = new FormData(form);
  const selection = formData.get("attendanceStatus");
  const rawPax = Number.parseInt(formData.get("paxCount"), 10);

  feedback.className = "api-feedback-msg is-pending";
  feedback.textContent = "Sila tunggu sebentar...";

  const payload = {
    guest_name: formData.get("guestName").trim(),
    attending: selection === "yes",
    pax_count: Number.isNaN(rawPax) ? 1 : rawPax,
  };

  try {
    await submitRsvp(payload);
    feedback.className = "api-feedback-msg is-success";
    feedback.textContent = "Terima kasih! RSVP anda berjaya dihantar.";
    form.reset();
  } catch (failure) {
    feedback.className = "api-feedback-msg is-error";
    feedback.textContent = "Ralat sistem. Sila cuba sekali lagi.";
  }
}

function openSheet(sheetId) {
  closeSheets();
  document.getElementById("sheetBackdrop")?.classList.remove("hidden");
  document.getElementById(sheetId)?.classList.remove("hidden");
}

function closeSheets() {
  document.getElementById("sheetBackdrop")?.classList.add("hidden");
  document.querySelectorAll(".action-sheet").forEach((sheet) => {
    sheet.classList.add("hidden");
  });
}

function scrollToWishes() {
  closeSheets();
  document.getElementById("wishesSection")?.scrollIntoView({ behavior: "smooth" });
}

function setupCalendarLinks() {
  const googleCalendar = new URL("https://calendar.google.com/calendar/render");
  googleCalendar.searchParams.set("action", "TEMPLATE");
  googleCalendar.searchParams.set("text", weddingEvent.title);
  googleCalendar.searchParams.set("dates", `${weddingEvent.start}/${weddingEvent.end}`);
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

  document.getElementById("googleCalendarLink")?.setAttribute("href", googleCalendar);
  document
    .getElementById("appleCalendarLink")
    ?.setAttribute("href", `data:text/calendar;charset=utf8,${encodeURIComponent(ics)}`);
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
      const name = document.createElement("strong");
      const message = document.createElement("span");

      item.className = "wish-chip";
      name.textContent = wish.name;
      message.textContent = wish.message;

      item.append(name, message);
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
