(function () {
  const timeline = document.querySelector("#cv-timeline");
  const scrollWrapper = timeline?.closest(".timeline-scroll");
  const modal = document.querySelector("#cv-modal");
  const modalDialog = document.querySelector("#cv-modal-dialog");
  const modalTitle = document.querySelector("#cv-modal-title");
  const modalDate = document.querySelector("#cv-modal-date");
  const modalSubtitle = document.querySelector("#cv-modal-subtitle");
  const modalLocation = document.querySelector("#cv-modal-location");
  const modalDescription = document.querySelector("#cv-modal-description");
  const modalMedia = document.querySelector("#cv-modal-media");
  const modalCloseButton = document.querySelector("#cv-modal-close");

  if (!timeline || !scrollWrapper || !modal || !modalDialog || !modalCloseButton) {
    return;
  }

  const experienceContainer = timeline.querySelector(".timeline-track--experience .timeline-items");
  const educationContainer = timeline.querySelector(".timeline-track--education .timeline-items");
  const yearsContainer = timeline.querySelector(".timeline-years");

  if (!experienceContainer || !educationContainer || !yearsContainer) {
    return;
  }

  // Source-of-truth data mapped from:
  // /Users/lenagerken/Library/Mobile Documents/iCloud~md~obsidian/Documents/Kommonplace Notebook/Notes/Lebenslauf CV.md
  const cvTimelineData = {
    experience: [
      {
        id: "exp-lab-assistant-2020",
        type: "experience",
        title: "Laboratory Assistant",
        subtitle: "Gelita AG",
        date: "22.August 2020 - 05. Dezember 2020",
        location: "Eberbach, Germany",
        description:
          "Right after high school, I was hired as a replacement laboratory assistant for someone who was sick. I handled mostly routine inspections.",
        media: [],
        fixedLane: 1,
        start: "2020-08",
        end: "2020-12"
      },
      {
        id: "exp-lab-assistant-2021",
        type: "experience",
        title: "Laboratory Assistant",
        subtitle: "Gelita AG",
        date: "16.08.2021 - 24.09.2021",
        location: "Eberbach, Germany",
        description:
          "I got rehired in a different department in the same laboratory after the person I was replacing got healthy again.",
        media: [],
        fixedLane: 1,
        start: "2021-08",
        end: "2021-09"
      },
      {
        id: "exp-working-student-gameforge",
        type: "experience",
        title: "Gameforge",
        subtitle: "Gameforge",
        date: "01.04.2023 - 24.Sept 2023",
        location: "Karlsruhe",
        description:
          "Originally I got hired as a working student in the influencer management department. I quickly got assigned design-related tasks such as video editing and helping with branding for the department.",
        media: [
          {
            type: "pdf",
            label: "Arbeitszeugnis",
            url: "./assets/images/docuents/Gameforge_Arbeitzeugnis_Lena_Gerken.pdf"
          },
          {
            type: "image",
            label: "Discord Logo",
            url: "./assets/images/projects/Gameforge/Discord_Logo.png"
          },
          {
            type: "pdf",
            label: "Lt.koro CD Card",
            url: "./assets/images/projects/Gameforge/Fina_Lt.koro_CD_Card.pdf"
          }
        ],
        fixedLane: 1,
        start: "2023-04",
        end: "2023-09"
      },
      {
        id: "exp-tutor-student-assistant-2024-a",
        type: "experience",
        title: "Tutor &\nStudent Assistant",
        subtitle: "Hochschule Mannheim",
        date: "01.04.2024 - 31.08.2024",
        location: "Mannheim, Germany",
        description:
          "At the University of Applied Sciences, I got hired as a tutor for Photoshop, teaching first-semester basics. I was also hired as a general designer, helping with university branding.",
        media: [],
        fixedLane: 1,
        start: "2024-04",
        end: "2024-08"
      },
      {
        id: "exp-tutor-2024-b",
        type: "experience",
        title: "Tutor",
        subtitle: "Hochschule Mannheim",
        date: "01.10.2024 - 31.12.2024",
        location: "Mannheim, Germany",
        description:
          "I continued my tutor position during this period while also supporting university design tasks.",
        media: [],
        fixedLane: 0,
        start: "2024-10",
        end: "2024-12"
      },
      {
        id: "exp-internship-korra",
        type: "experience",
        title: "Internship",
        subtitle: "Korra Media",
        date: "10.2024 - 15.03.2025",
        location: "Mannheim",
        description:
          "The internship at Korra Media was part of my studies. I joined a small advertising film studio based in Mannheim and gained industry experience with clients like Red Bull and startups.",
        media: [],
        fixedLane: 1,
        start: "2024-10",
        end: "2025-03"
      },
      {
        id: "exp-tutor-green-office",
        type: "experience",
        title: "Tutor & Green Office",
        subtitle: "Hochschule Mannheim",
        date: "10.10.2025 - 28.02.2026",
        location: "Mannheim",
        description:
          "After my exchange semester in Japan, I was rehired as a Photoshop tutor and joined the Green Office as a designer responsible for social media and print products.",
        media: [],
        fixedLane: 1,
        start: "2025-10",
        end: "2026-02"
      }
    ],
    education: [
      {
        id: "edu-primary-school",
        type: "education",
        title: "Elementary School",
        subtitle: "Dr. Weiß Grundschule",
        date: "09.2008 - 07.2012",
        location: "Eberbach, Germany",
        description: "",
        media: [],
        start: "2008-09",
        end: "2012-07",
        offsetPx: 16
      },
      {
        id: "edu-abitur",
        type: "education",
        title: "Abitur (High School Diploma)",
        subtitle: "Hohen-Staufen-Gymnasium",
        date: "09.2012 - 07.2020",
        location: "Eberbach, Germany",
        description: "Graduated July 2020",
        media: [
          {
            type: "pdf",
            label: "Abitur Zeugnis",
            url: "./assets/images/docuents/abitur_zeugniss.pdf"
          }
        ],
        start: "2012-09",
        end: "2020-07",
        offsetPx: 16
      },
      {
        id: "edu-communication-design",
        type: "education",
        title: "Communication Design",
        subtitle: "Hochschule Mannheim (University of Applied Sciences Mannheim)",
        date: "September 2021 - Februar 2026",
        location: "Mannheim, Germany",
        description:
          "Technische Hochschule Mannheim\nFakultät für Gestaltung\nStudium mit Bachelor of Arts absolviert.\nMit einem Auslandssemester in Japan und einem Pflichtpraktikum.",
        media: [
          {
            type: "pdf",
            label: "Durchschnittsnotenbescheinigung",
            url: "./assets/images/docuents/Durchschnittsnotenbescheinigung TH Mannheim.pdf"
          }
        ],
        start: "2021-09",
        end: "2026-02",
        offsetPx: 16
      },
      {
        id: "edu-exchange-semester",
        type: "education",
        title: "Exchange Semester",
        subtitle: "Seian University of Art and Design",
        date: "March - September 2025",
        location: "Japan",
        description: "Exchange semester program.",
        media: [],
        start: "2025-03",
        end: "2025-09"
      }
    ]
  };

  const allEntries = [...cvTimelineData.experience, ...cvTimelineData.education];
  const entryById = new Map(allEntries.map((entry) => [entry.id, entry]));

  const pxPerMonth = Number(timeline.dataset.pxPerMonth) || 14;
  const axisStartYear = Number(timeline.dataset.axisStartYear) || 2002;
  const configuredAxisEndYear = Number(timeline.dataset.axisEndYear) || 2027;
  const axisEndYear = configuredAxisEndYear >= axisStartYear ? configuredAxisEndYear : axisStartYear;
  const axisStartIndex = axisStartYear * 12;
  const axisEndExclusiveIndex = (axisEndYear + 1) * 12;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const parseYearMonth = (value) => {
    const match = /^(\d{4})-(\d{2})$/.exec(value);

    if (!match) {
      return null;
    }

    const year = Number(match[1]);
    const month = Number(match[2]);

    if (!Number.isInteger(year) || !Number.isInteger(month) || month < 1 || month > 12) {
      return null;
    }

    return { year, month };
  };

  const toMonthIndex = (date) => {
    return date.year * 12 + (date.month - 1);
  };

  const parseTrackEntries = (entries) => {
    return entries
      .map((entry) => {
        const start = parseYearMonth(entry.start || "");
        const end = parseYearMonth(entry.end || "");

        if (!start || !end) {
          return null;
        }

        const startIndex = toMonthIndex(start);
        const endExclusiveIndex = toMonthIndex(end) + 1;

        if (endExclusiveIndex <= startIndex) {
          return null;
        }

        return {
          ...entry,
          start,
          end,
          offsetPx: Number(entry.offsetPx) || 0,
          fixedLane: Number.isInteger(entry.fixedLane) ? entry.fixedLane : null,
          startIndex,
          endExclusiveIndex
        };
      })
      .filter(Boolean)
      .sort((a, b) => {
        if (a.startIndex !== b.startIndex) {
          return a.startIndex - b.startIndex;
        }

        return a.endExclusiveIndex - b.endExclusiveIndex;
      });
  };

  // Greedy lane assignment: each new overlapping interval gets the next free lane.
  const assignLanes = (entries) => {
    const laneEnds = [];

    entries.forEach((entry) => {
      if (Number.isInteger(entry.fixedLane) && entry.fixedLane >= 0) {
        const laneIndex = entry.fixedLane;

        while (laneEnds.length <= laneIndex) {
          laneEnds.push(-Infinity);
        }

        laneEnds[laneIndex] = Math.max(laneEnds[laneIndex], entry.endExclusiveIndex);
        entry.lane = laneIndex;
        return;
      }

      let laneIndex = laneEnds.findIndex((laneEndExclusive) => {
        return entry.startIndex >= laneEndExclusive;
      });

      if (laneIndex === -1) {
        laneIndex = laneEnds.length;
        laneEnds.push(entry.endExclusiveIndex);
      } else {
        laneEnds[laneIndex] = entry.endExclusiveIndex;
      }

      entry.lane = laneIndex;
    });

    return Math.max(laneEnds.length, 1);
  };

  const renderMedia = (entry) => {
    modalMedia.innerHTML = "";
    modalMedia.classList.remove("cv-modal-media--empty");
    modalDialog.classList.remove("cv-modal-dialog--no-media");

    if (!entry.media || !entry.media.length) {
      modalMedia.classList.add("cv-modal-media--empty");
      modalDialog.classList.add("cv-modal-dialog--no-media");
      return;
    }

    const list = document.createElement("div");
    list.className = "cv-modal-media-list";

    const inferMediaType = (mediaItem) => {
      if (mediaItem.type) {
        return mediaItem.type;
      }

      const source = String(mediaItem.url || "");

      if (/\.pdf($|[?#])/i.test(source)) {
        return "pdf";
      }

      if (/\.(png|jpe?g|gif|webp|svg)($|[?#])/i.test(source)) {
        return "image";
      }

      return "link";
    };

    entry.media.forEach((mediaItem) => {
      const itemType = inferMediaType(mediaItem);
      const mediaUrl = encodeURI(mediaItem.url);
      const item = document.createElement("article");
      const title = document.createElement("p");
      const link = document.createElement("a");

      item.className = `cv-modal-media-item cv-modal-media-item--${itemType}`;
      title.className = "cv-modal-media-item-title";
      title.textContent = mediaItem.label || "Document";

      link.className = "cv-modal-media-link";
      link.href = mediaUrl;
      link.target = "_blank";
      link.rel = "noreferrer noopener";
      link.textContent = itemType === "image" ? "Open Image" : "Open Document";

      item.append(title);

      if (itemType === "image") {
        const img = document.createElement("img");
        img.className = "cv-modal-media-image";
        img.src = mediaUrl;
        img.alt = mediaItem.label || "Media preview";
        img.loading = "lazy";
        item.append(img);
      } else if (itemType === "pdf") {
        const frame = document.createElement("iframe");
        frame.className = "cv-modal-media-pdf";
        frame.src = `${mediaUrl}#view=FitH`;
        frame.title = mediaItem.label || "PDF preview";
        frame.loading = "lazy";
        item.append(frame);
      }

      item.append(link);
      list.append(item);
    });

    modalMedia.append(list);
  };

  let previousFocusedElement = null;

  const closeModal = () => {
    if (modal.hidden) {
      return;
    }

    modal.hidden = true;
    modal.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");

    if (previousFocusedElement instanceof HTMLElement) {
      previousFocusedElement.focus();
    }
  };

  const openModal = (entryId) => {
    const entry = entryById.get(entryId);

    if (!entry) {
      return;
    }

    modalDialog.dataset.entryType = entry.type;

    modalTitle.textContent = entry.title;
    modalDate.textContent = entry.date;
    modalSubtitle.textContent = entry.subtitle;
    modalLocation.textContent = entry.location;
    modalDescription.textContent = entry.description || "No additional description provided yet.";

    renderMedia(entry);

    previousFocusedElement = document.activeElement;
    modal.hidden = false;
    modal.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    modalCloseButton.focus();
  };

  const renderTrack = ({ container, entries, itemClass, laneStep, trackOffset = 0 }) => {
    container.innerHTML = "";

    const parsedEntries = parseTrackEntries(entries);

    if (!parsedEntries.length) {
      container.style.height = `${laneStep}px`;
      return laneStep;
    }

    assignLanes(parsedEntries);

    let maxTop = 0;

    parsedEntries.forEach((entry) => {
      const left = (entry.startIndex - axisStartIndex) * pxPerMonth;
      const width = Math.max((entry.endExclusiveIndex - entry.startIndex) * pxPerMonth, pxPerMonth);
      const top = trackOffset + entry.lane * laneStep + entry.offsetPx;
      const accessibleTitle = entry.title.replace(/\s+/g, " ").trim();
      const item = document.createElement("button");
      const label = document.createElement("h3");

      item.type = "button";
      item.className = `timeline-item ${itemClass}`;
      item.style.left = `${left}px`;
      item.style.width = `${width}px`;
      item.style.top = `${top}px`;
      item.dataset.entryId = entry.id;
      item.dataset.start = `${entry.start.year}-${String(entry.start.month).padStart(2, "0")}`;
      item.dataset.end = `${entry.end.year}-${String(entry.end.month).padStart(2, "0")}`;
      item.setAttribute("aria-haspopup", "dialog");
      item.setAttribute(
        "aria-label",
        `${accessibleTitle} (${entry.date}). Open details.`
      );
      item.addEventListener("click", () => openModal(entry.id));

      label.textContent = entry.title;
      item.append(label);
      container.append(item);

      maxTop = Math.max(maxTop, top);
    });

    const containerHeight = maxTop + laneStep;
    container.style.height = `${containerHeight}px`;

    return containerHeight;
  };

  const timelineWidth = (axisEndExclusiveIndex - axisStartIndex) * pxPerMonth;
  const experienceLaneStep = 94;
  const educationLaneStep = 82;
  const yearRowHeight = 32;
  const rowGap = 18;

  timeline.style.width = `${timelineWidth}px`;
  timeline.style.minWidth = `${timelineWidth}px`;
  timeline.style.setProperty("--timeline-width", `${timelineWidth}px`);
  timeline.style.setProperty("--px-per-month", `${pxPerMonth}px`);
  timeline.style.setProperty("--year-row-height", `${yearRowHeight}px`);
  timeline.style.setProperty("--timeline-row-gap", `${rowGap}px`);

  const experienceRowHeight = renderTrack({
    container: experienceContainer,
    entries: cvTimelineData.experience,
    itemClass: "timeline-item--experience",
    laneStep: experienceLaneStep,
    trackOffset: 60
  });

  const educationRowHeight = renderTrack({
    container: educationContainer,
    entries: cvTimelineData.education,
    itemClass: "timeline-item--education",
    laneStep: educationLaneStep,
    trackOffset: 34
  });

  timeline.style.setProperty("--experience-row-height", `${experienceRowHeight}px`);
  timeline.style.setProperty("--education-row-height", `${educationRowHeight}px`);

  yearsContainer.innerHTML = "";

  for (let year = axisStartYear; year <= axisEndYear; year += 1) {
    const marker = document.createElement("span");
    const label = document.createElement("span");

    marker.className = "timeline-year";
    marker.style.left = `${(year - axisStartYear) * 12 * pxPerMonth}px`;

    label.textContent = String(year);
    marker.append(label);
    yearsContainer.append(marker);
  }

  const scrollToCurrentYear = () => {
    const now = new Date();
    const currentYear = now.getFullYear();
    const clampedYear = clamp(currentYear, axisStartYear, axisEndYear);
    const markerX = (clampedYear - axisStartYear) * 12 * pxPerMonth;
    const maxScrollLeft = Math.max(scrollWrapper.scrollWidth - scrollWrapper.clientWidth, 0);
    const targetScrollLeft = clamp(markerX - scrollWrapper.clientWidth / 2, 0, maxScrollLeft);
    const startScrollLeft = scrollWrapper.scrollLeft;
    const distance = targetScrollLeft - startScrollLeft;
    const duration = 520;

    if (Math.abs(distance) < 1 || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      scrollWrapper.scrollLeft = targetScrollLeft;
      return;
    }

    let startTime = 0;

    const easeInOutCubic = (time) => {
      return time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;
    };

    const animate = (timestamp) => {
      if (!startTime) {
        startTime = timestamp;
      }

      const progress = clamp((timestamp - startTime) / duration, 0, 1);
      const easedProgress = easeInOutCubic(progress);

      scrollWrapper.scrollLeft = startScrollLeft + distance * easedProgress;

      if (progress < 1) {
        window.requestAnimationFrame(animate);
      }
    };

    window.requestAnimationFrame(animate);
  };

  window.requestAnimationFrame(() => {
    window.requestAnimationFrame(scrollToCurrentYear);
  });

  const EPSILON = 1;

  const canScrollHorizontally = () => {
    return scrollWrapper.scrollWidth - scrollWrapper.clientWidth > EPSILON;
  };

  const isAtStart = () => {
    return scrollWrapper.scrollLeft <= EPSILON;
  };

  const isAtEnd = () => {
    const maxScrollLeft = scrollWrapper.scrollWidth - scrollWrapper.clientWidth;
    return scrollWrapper.scrollLeft >= maxScrollLeft - EPSILON;
  };

  const normalizeWheelDelta = (event) => {
    const dominantDelta = Math.abs(event.deltaY) >= Math.abs(event.deltaX)
      ? event.deltaY
      : event.deltaX;

    if (event.deltaMode === 1) {
      return dominantDelta * 16;
    }

    if (event.deltaMode === 2) {
      return dominantDelta * scrollWrapper.clientWidth;
    }

    return dominantDelta;
  };

  scrollWrapper.addEventListener(
    "wheel",
    (event) => {
      if (!canScrollHorizontally()) {
        return;
      }

      const delta = normalizeWheelDelta(event);

      if (!Number.isFinite(delta) || delta === 0) {
        return;
      }

      const movingRight = delta > 0;
      const canMoveInDirection = movingRight ? !isAtEnd() : !isAtStart();

      if (!canMoveInDirection) {
        return;
      }

      event.preventDefault();
      scrollWrapper.scrollLeft += delta;
    },
    { passive: false }
  );

  modalCloseButton.addEventListener("click", closeModal);

  modal.addEventListener("click", (event) => {
    if (event.target === modal) {
      closeModal();
    }
  });

  document.addEventListener("keydown", (event) => {
    if (modal.hidden) {
      return;
    }

    if (event.key === "Escape") {
      event.preventDefault();
      closeModal();
      return;
    }

    if (event.key !== "Tab") {
      return;
    }

    const focusable = Array.from(
      modalDialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
    ).filter((element) => {
      return element instanceof HTMLElement && !element.hasAttribute("disabled");
    });

    if (!focusable.length) {
      return;
    }

    const first = focusable[0];
    const last = focusable[focusable.length - 1];

    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
      return;
    }

    if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  });
})();
