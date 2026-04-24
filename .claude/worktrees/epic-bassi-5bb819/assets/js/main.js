(function () {
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const revealElements = document.querySelectorAll(".reveal, .stagger");

  if (!revealElements.length || reducedMotion) {
    revealElements.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.2,
        rootMargin: "0px 0px -10% 0px"
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  }

  const initAboutReveal = () => {
    const aboutSheet = document.querySelector(".about-reveal");

    if (!aboutSheet) {
      return;
    }

    if (reducedMotion) {
      aboutSheet.classList.add("is-visible");
      return;
    }

    // Keep observing so the sheet can blur in and out on scroll.
    const aboutObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          aboutSheet.classList.toggle("is-visible", entry.isIntersecting);
        });
      },
      {
        threshold: 0.45
      }
    );

    aboutObserver.observe(aboutSheet);
  };

  const initProjectFlip = () => {
    if (reducedMotion) {
      return;
    }

    const track = document.querySelector(".works-track");
    const panels = Array.from(document.querySelectorAll(".project-panel"));

    if (!track || panels.length < 2) {
      return;
    }

    const segmentCount = panels.length - 1;
    let ticking = false;

    const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

    const setPageState = (progress) => {
      const boundedProgress = clamp(progress, 0, 1);
      const rawSegment = boundedProgress * segmentCount;
      const fromIndex = Math.min(Math.floor(rawSegment), panels.length - 1);
      const localProgress = fromIndex >= panels.length - 1 ? 0 : rawSegment - fromIndex;

      panels.forEach((panel, index) => {
        panel.classList.remove("is-active", "is-next", "is-turned");

        if (index < fromIndex) {
          panel.classList.add("is-turned");
          panel.style.setProperty("--turn", "-170deg");
          panel.style.setProperty("--page-shadow", "0");
          return;
        }

        panel.style.setProperty("--turn", "12deg");
        panel.style.setProperty("--page-shadow", "0");
      });

      // Final panel remains flat when the scroll reaches the end.
      if (fromIndex >= panels.length - 1) {
        const lastPanel = panels[panels.length - 1];
        lastPanel.classList.add("is-active");
        lastPanel.style.setProperty("--turn", "0deg");
        lastPanel.style.setProperty("--page-shadow", "0.05");
        return;
      }

      const currentPanel = panels[fromIndex];
      const nextPanel = panels[fromIndex + 1];

      currentPanel.classList.add("is-active");
      currentPanel.style.setProperty("--turn", `${-170 * localProgress}deg`);
      currentPanel.style.setProperty("--page-shadow", `${(0.55 * localProgress).toFixed(3)}`);

      nextPanel.classList.add("is-next");
      nextPanel.style.setProperty("--turn", `${12 - 12 * localProgress}deg`);
      nextPanel.style.setProperty("--page-shadow", `${(0.18 * (1 - localProgress)).toFixed(3)}`);
    };

    const updateFromScroll = () => {
      const rect = track.getBoundingClientRect();
      const scrollableDistance = rect.height - window.innerHeight;

      if (scrollableDistance <= 0) {
        setPageState(0);
        return;
      }

      const progress = clamp((-rect.top) / scrollableDistance, 0, 1);
      setPageState(progress);
    };

    const scheduleUpdate = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      window.requestAnimationFrame(() => {
        updateFromScroll();
        ticking = false;
      });
    };

    setPageState(0);
    updateFromScroll();

    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);
  };

  const initAboutCtaScroll = () => {
    const aboutCta = document.querySelector(".about-cta");

    if (!aboutCta || reducedMotion) {
      return;
    }

    aboutCta.addEventListener("click", (event) => {
      const targetSelector = aboutCta.getAttribute("href");

      if (!targetSelector || !targetSelector.startsWith("#")) {
        return;
      }

      const target = document.querySelector(targetSelector);

      if (!target) {
        return;
      }

      event.preventDefault();

      const headerHeight = document.querySelector(".site-header")?.offsetHeight ?? 0;
      const startY = window.scrollY;
      const targetY = Math.max(
        target.getBoundingClientRect().top + window.scrollY - headerHeight,
        0
      );
      const distance = targetY - startY;
      const duration = 900;
      let rafId = 0;
      let startTime = 0;

      const easeInOutCubic = (time) => {
        return time < 0.5 ? 4 * time * time * time : 1 - Math.pow(-2 * time + 2, 3) / 2;
      };

      // Stop the scripted scroll immediately if the user starts interacting.
      const stopAnimation = () => {
        if (rafId) {
          window.cancelAnimationFrame(rafId);
          rafId = 0;
        }

        window.removeEventListener("wheel", stopAnimation);
        window.removeEventListener("touchstart", stopAnimation);
        window.removeEventListener("keydown", stopAnimation);
      };

      const animate = (timeStamp) => {
        if (!startTime) {
          startTime = timeStamp;
        }

        const elapsed = timeStamp - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = easeInOutCubic(progress);

        window.scrollTo(0, startY + distance * easedProgress);

        if (progress < 1 && rafId) {
          rafId = window.requestAnimationFrame(animate);
          return;
        }

        stopAnimation();
      };

      window.addEventListener("wheel", stopAnimation, { passive: true });
      window.addEventListener("touchstart", stopAnimation, { passive: true });
      window.addEventListener("keydown", stopAnimation);

      rafId = window.requestAnimationFrame(animate);
    });
  };

  const initNavScrollBehavior = () => {
    const aboutNavLink = document.querySelector('.nav-list a[href="#about-details"]');
    const contactNavLink = document.querySelector('.nav-list a[href="#contact"]');
    const aboutSection = document.querySelector("#about-details");
    const contactSection = document.querySelector("#contact");

    if (aboutNavLink && aboutSection) {
      aboutNavLink.addEventListener("click", (event) => {
        event.preventDefault();

        // Place the About section in the middle of the viewport for better framing.
        aboutSection.scrollIntoView({
          behavior: reducedMotion ? "auto" : "smooth",
          block: "center"
        });
      });
    }

    if (contactNavLink && contactSection) {
      contactNavLink.addEventListener("click", (event) => {
        event.preventDefault();

        // Jump directly to Contact so the portfolio flip area is not traversed.
        contactSection.scrollIntoView({
          behavior: "auto",
          block: "start"
        });
      });
    }
  };

  const parseProjectMarkdown = (markdown) => {
    const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const titleMatch = markdown.match(/^#\s+(.+)$/m);

    const getLineValue = (label) => {
      const lineMatch = markdown.match(new RegExp(`^${escapeRegExp(label)}:\\s*(.+)$`, "mi"));
      return lineMatch ? lineMatch[1].trim() : "";
    };

    const getSection = (heading) => {
      const sectionRegex = new RegExp(
        `^##\\s+${escapeRegExp(heading)}\\s*\\n([\\s\\S]*?)(?=^##\\s+|\\Z)`,
        "mi"
      );
      const sectionMatch = markdown.match(sectionRegex);
      return sectionMatch ? sectionMatch[1].trim() : "";
    };

    const getListSection = (heading) => {
      const section = getSection(heading);

      if (!section) {
        return [];
      }

      return section
        .split("\n")
        .map((line) => line.trim())
        .filter((line) => line.startsWith("- "))
        .map((line) => line.slice(2).trim())
        .filter(Boolean);
    };

    const description = getSection("Description");
    const context = getSection("Context");
    const focus = getSection("Focus");
    const modalDescription = getSection("Modal Description");
    const longDescription = modalDescription || [description, context, focus].filter(Boolean).join("\n\n");

    return {
      title: titleMatch ? titleMatch[1].trim() : "Untitled Project",
      year: getLineValue("Year"),
      type: getLineValue("Type"),
      longDescription,
      gallery: getListSection("Gallery"),
      images: getListSection("Images")
    };
  };

  const initProjectModal = () => {
    const modal = document.querySelector("#project-modal");

    if (!modal) {
      return;
    }

    const modalTitle = document.querySelector("#project-modal-title");
    const modalMeta = document.querySelector("#project-modal-meta");
    const modalDescription = document.querySelector("#project-modal-description");
    const modalMainImage = document.querySelector("#project-modal-main-image");
    const modalThumbs = document.querySelector("#project-modal-thumbs");
    const prevButton = document.querySelector("#project-modal-prev");
    const nextButton = document.querySelector("#project-modal-next");
    const projectPanels = Array.from(
      document.querySelectorAll(".project-panel[data-project-md][data-project-folder]")
    );

    if (
      !modalTitle ||
      !modalMeta ||
      !modalDescription ||
      !modalMainImage ||
      !modalThumbs ||
      !prevButton ||
      !nextButton ||
      !projectPanels.length
    ) {
      return;
    }

    let currentImages = [];
    let currentImageIndex = 0;
    let currentProjectTitle = "";
    let loadToken = 0;

    const encodeAssetPath = (path) => {
      return path
        .split("/")
        .map((segment) => {
          if (!segment || segment === "." || segment === "..") {
            return segment;
          }

          return encodeURIComponent(segment);
        })
        .join("/");
    };

    const toImagePath = (folderPath, imageName) => {
      return encodeAssetPath(`${folderPath}/${imageName}`);
    };

    const openModal = () => {
      modal.classList.add("is-open");
      modal.setAttribute("aria-hidden", "false");
      document.body.classList.add("modal-open");
    };

    const closeModal = () => {
      // Increment token so pending async loads do not overwrite a closed modal.
      loadToken += 1;
      modal.classList.remove("is-open");
      modal.setAttribute("aria-hidden", "true");
      document.body.classList.remove("modal-open");
    };

    const renderDescription = (text) => {
      modalDescription.innerHTML = "";

      const paragraphs = text
        .split(/\n\s*\n/)
        .map((paragraph) => paragraph.replace(/\n+/g, " ").trim())
        .filter(Boolean);

      if (!paragraphs.length) {
        const fallbackParagraph = document.createElement("p");
        fallbackParagraph.textContent = "No project description available yet.";
        modalDescription.appendChild(fallbackParagraph);
        return;
      }

      paragraphs.forEach((paragraph) => {
        const paragraphElement = document.createElement("p");
        paragraphElement.textContent = paragraph;
        modalDescription.appendChild(paragraphElement);
      });
    };

    const renderCurrentImage = () => {
      const hasImages = currentImages.length > 0;

      if (!hasImages) {
        modalMainImage.removeAttribute("src");
        modalMainImage.alt = "";
        prevButton.disabled = true;
        nextButton.disabled = true;
        return;
      }

      const activeImagePath = currentImages[currentImageIndex];
      modalMainImage.src = activeImagePath;
      modalMainImage.alt = `${currentProjectTitle} image ${currentImageIndex + 1}`;
      prevButton.disabled = currentImages.length <= 1;
      nextButton.disabled = currentImages.length <= 1;
    };

    const renderThumbnails = () => {
      modalThumbs.innerHTML = "";

      currentImages.forEach((imagePath, index) => {
        const thumbnailButton = document.createElement("button");
        thumbnailButton.type = "button";
        thumbnailButton.className = "project-modal-thumb";
        thumbnailButton.setAttribute("aria-label", `Open image ${index + 1}`);

        if (index === currentImageIndex) {
          thumbnailButton.classList.add("is-active");
        }

        const thumbnailImage = document.createElement("img");
        thumbnailImage.src = imagePath;
        thumbnailImage.alt = `${currentProjectTitle} thumbnail ${index + 1}`;

        thumbnailButton.appendChild(thumbnailImage);
        thumbnailButton.addEventListener("click", () => {
          currentImageIndex = index;
          renderCurrentImage();
          renderThumbnails();
        });

        modalThumbs.appendChild(thumbnailButton);
      });
    };

    const showLoadingState = () => {
      modalMeta.textContent = "";
      modalTitle.textContent = "Loading project...";
      renderDescription("Please wait while project details are loaded.");
      currentImages = [];
      currentImageIndex = 0;
      currentProjectTitle = "Project";
      renderCurrentImage();
      renderThumbnails();
    };

    const showErrorState = () => {
      modalMeta.textContent = "";
      modalTitle.textContent = "Project unavailable";
      renderDescription("Project details could not be loaded. Please try again.");
      currentImages = [];
      currentImageIndex = 0;
      currentProjectTitle = "Project";
      renderCurrentImage();
      renderThumbnails();
    };

    const loadProjectDetails = async (panel) => {
      const mdPath = panel.dataset.projectMd;
      const folderPath = panel.dataset.projectFolder;
      const fallbackImage = panel.querySelector(".project-image")?.getAttribute("src") || "";

      if (!mdPath || !folderPath) {
        return;
      }

      const thisLoadToken = ++loadToken;

      openModal();
      showLoadingState();

      try {
        const response = await fetch(encodeAssetPath(mdPath));

        if (!response.ok) {
          throw new Error("Failed to fetch markdown");
        }

        const markdown = await response.text();

        if (thisLoadToken !== loadToken) {
          return;
        }

        const projectData = parseProjectMarkdown(markdown);
        const galleryFileNames = projectData.gallery.length ? projectData.gallery : projectData.images;
        const galleryImagePaths = galleryFileNames.map((fileName) => toImagePath(folderPath, fileName));
        const finalImages = galleryImagePaths.length ? galleryImagePaths : [fallbackImage].filter(Boolean);

        currentImages = finalImages;
        currentImageIndex = 0;
        currentProjectTitle = projectData.title;

        modalMeta.textContent = [projectData.year, projectData.type].filter(Boolean).join(" | ");
        modalTitle.textContent = projectData.title;
        renderDescription(projectData.longDescription);
        renderCurrentImage();
        renderThumbnails();
      } catch (error) {
        if (thisLoadToken !== loadToken) {
          return;
        }

        showErrorState();
      }
    };

    projectPanels.forEach((panel) => {
      panel.addEventListener("click", () => {
        // In motion mode, only the visible panel should open.
        if (!reducedMotion && !panel.classList.contains("is-active")) {
          return;
        }

        loadProjectDetails(panel);
      });
    });

    modal.querySelectorAll("[data-modal-close]").forEach((closeTrigger) => {
      closeTrigger.addEventListener("click", closeModal);
    });

    prevButton.addEventListener("click", () => {
      if (!currentImages.length) {
        return;
      }

      currentImageIndex = (currentImageIndex - 1 + currentImages.length) % currentImages.length;
      renderCurrentImage();
      renderThumbnails();
    });

    nextButton.addEventListener("click", () => {
      if (!currentImages.length) {
        return;
      }

      currentImageIndex = (currentImageIndex + 1) % currentImages.length;
      renderCurrentImage();
      renderThumbnails();
    });

    document.addEventListener("keydown", (event) => {
      if (!modal.classList.contains("is-open")) {
        return;
      }

      if (event.key === "Escape") {
        closeModal();
        return;
      }

      if (event.key === "ArrowLeft") {
        prevButton.click();
        return;
      }

      if (event.key === "ArrowRight") {
        nextButton.click();
      }
    });
  };

  initAboutReveal();
  initProjectFlip();
  initAboutCtaScroll();
  initNavScrollBehavior();
  initProjectModal();

  const form = document.querySelector("#contact-form");
  const statusEl = document.querySelector("#form-status");

  if (!form || !statusEl) {
    return;
  }

  const validateEmail = (email) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  form.addEventListener("submit", (event) => {
    const formData = new FormData(form);
    const name = (formData.get("name") || "").toString().trim();
    const email = (formData.get("email") || "").toString().trim();
    const projectType = (formData.get("project_type") || "").toString().trim();
    const message = (formData.get("message") || "").toString().trim();

    statusEl.textContent = "";
    statusEl.className = "form-status";

    if (!name || !email || !projectType || !message) {
      event.preventDefault();
      statusEl.textContent = "Please complete all required fields before sending.";
      statusEl.classList.add("error");
      return;
    }

    if (!validateEmail(email)) {
      event.preventDefault();
      statusEl.textContent = "Please enter a valid email address.";
      statusEl.classList.add("error");
      return;
    }

    if (form.action.endsWith("FORM_ENDPOINT_URL")) {
      event.preventDefault();
      statusEl.textContent = "Set your form endpoint in contact.html to enable submissions.";
      statusEl.classList.add("ok");
    }
  });
})();
