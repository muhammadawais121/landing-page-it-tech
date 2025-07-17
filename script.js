// Global variables
let currentVideoId = ""
let isNavOpen = false
let currentMonth = new Date().getMonth()
let currentYear = new Date().getFullYear()
let selectedCourseCard = null // To track the currently selected course card

// Initialize website when DOM is loaded
document.addEventListener("DOMContentLoaded", () => {
  initializeWebsite()
})

// Main initialization function
function initializeWebsite() {
  setupNavigation()
  setupScrollEffects()
  setupForms()
  setupGallery()
  setupCourseFilters()
  setupCourseCardSelection() // New function for course card selection
  setupCalendar() // Re-added calendar setup
  setupTimeSlots() // New function for time slot selection
  setupVideoModal()
  setupSmoothScrolling()
}

// Navigation setup
function setupNavigation() {
  const navToggle = document.getElementById("nav-toggle")
  const navMenu = document.getElementById("nav-menu")
  const navLinks = document.querySelectorAll(".nav-link")
  const navbar = document.getElementById("navbar")

  // Mobile menu toggle
  if (navToggle) {
    navToggle.addEventListener("click", () => {
      navMenu.classList.toggle("active")
      navToggle.classList.toggle("active")
      isNavOpen = !isNavOpen

      // Prevent body scroll when menu is open
      document.body.style.overflow = isNavOpen ? "hidden" : "auto"
    })
  }

  // Close menu when clicking on links
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active")
      navToggle.classList.remove("active")
      isNavOpen = false
      document.body.style.overflow = "auto"
    })
  })

  // Navbar scroll effect
  window.addEventListener("scroll", () => {
    if (window.scrollY > 100) {
      navbar.classList.add("scrolled")
    } else {
      navbar.classList.remove("scrolled")
    }
  })
}

// Scroll effects setup
function setupScrollEffects() {
  // Simple scroll reveal for elements
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1"
        entry.target.style.transform = "translateY(0)"
      }
    })
  }, observerOptions)

  // Observe cards and sections
  const cards = document.querySelectorAll(".motive-card, .service-card, .course-card, .gallery-item")
  cards.forEach((card) => {
    card.style.opacity = "0"
    card.style.transform = "translateY(20px)"
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease"
    observer.observe(card)
  })
}

// Forms setup
function setupForms() {
  const appointmentForm = document.getElementById("appointmentForm")
  const contactForm = document.getElementById("contactForm")

  if (appointmentForm) {
    appointmentForm.addEventListener("submit", handleAppointmentSubmit)
  }

  if (contactForm) {
    contactForm.addEventListener("submit", handleContactSubmit)
  }

  // Form field styling
  const inputs = document.querySelectorAll("input, select, textarea")
  inputs.forEach((input) => {
    input.addEventListener("focus", function () {
      this.parentElement.classList.add("focused")
    })

    input.addEventListener("blur", function () {
      if (!this.value) {
        this.parentElement.classList.remove("focused")
      }
    })
  })
}

// Handle appointment form submission
function handleAppointmentSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const appointmentData = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = e.target.querySelector(".submit-btn")
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Booking...'
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showNotification("Appointment booked successfully! We will contact you soon.", "success")
    e.target.reset()
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
    // Clear selected states
    document.querySelectorAll(".calendar-day.selected").forEach((d) => d.classList.remove("selected"))
    document.querySelectorAll(".time-slot-item.selected").forEach((s) => s.classList.remove("selected"))
    document.getElementById("preferredDate").value = ""
    document.getElementById("preferredTime").value = ""
  }, 2000)
}

// Handle contact form submission
function handleContactSubmit(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const contactData = Object.fromEntries(formData)

  // Show loading state
  const submitBtn = e.target.querySelector(".submit-btn")
  const originalText = submitBtn.innerHTML
  submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...'
  submitBtn.disabled = true

  // Simulate API call
  setTimeout(() => {
    showNotification("Message sent successfully! We will get back to you soon.", "success")
    e.target.reset()
    submitBtn.innerHTML = originalText
    submitBtn.disabled = false
  }, 2000)
}

// Gallery setup
function setupGallery() {
  const filterBtns = document.querySelectorAll(".filter-btn")
  const galleryItems = document.querySelectorAll(".gallery-item")

  filterBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const filter = this.getAttribute("data-filter")

      // Update active button
      filterBtns.forEach((b) => {
        b.classList.remove("active")
      })
      this.classList.add("active")

      // Filter gallery items
      filterGalleryItems(filter)
    })
  })

  // Gallery item click handlers
  galleryItems.forEach((item) => {
    item.addEventListener("click", function () {
      if (this.classList.contains("video-item")) {
        openVideoModal("sample-video")
      } else {
        openImageModal(this.querySelector("img").src)
      }
    })
  })
}

// Filter gallery items
function filterGalleryItems(filter) {
  const galleryItems = document.querySelectorAll(".gallery-item")

  galleryItems.forEach((item) => {
    const category = item.getAttribute("data-category")

    if (filter === "all" || category === filter) {
      item.style.display = "block"
      item.style.opacity = "1"
    } else {
      item.style.display = "none"
    }
  })
}

// Course filters setup (updated)
function setupCourseFilters() {
  const categoryBtns = document.querySelectorAll(".category-btn")
  const courseCards = document.querySelectorAll(".course-card")

  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", function () {
      const category = this.getAttribute("data-category")

      // Update active button
      categoryBtns.forEach((b) => {
        b.classList.remove("active")
      })
      this.classList.add("active")

      // Filter course cards
      filterCourseCards(category)
    })
  })
}

// Filter course cards (existing, no change needed for new courses as they use data-category)
function filterCourseCards(category) {
  const courseCards = document.querySelectorAll(".course-card")

  courseCards.forEach((card) => {
    const cardCategory = card.getAttribute("data-category")

    if (category === "all" || cardCategory === category) {
      card.style.display = "block"
      card.style.opacity = "1"
    } else {
      card.style.display = "none"
    }
  })
}

// New function for course card selection theme change
function setupCourseCardSelection() {
  const courseButtons = document.querySelectorAll(".course-btn")

  courseButtons.forEach((button) => {
    button.addEventListener("click", function (e) {
      e.preventDefault() // Prevent default button action if it's a link

      const card = this.closest(".course-card")

      // Remove 'selected' class from previously selected card
      if (selectedCourseCard && selectedCourseCard !== card) {
        selectedCourseCard.classList.remove("selected")
      }

      // Toggle 'selected' class on the current card
      card.classList.toggle("selected")
      selectedCourseCard = card.classList.contains("selected") ? card : null

      // Optionally, you can also update a hidden input or perform other actions here
      const courseId = this.getAttribute("data-course-id")
      if (courseId) {
        console.log("Selected course:", courseId)
        // You could update a hidden form field here if needed
      }
    })
  })
}

// Calendar Setup (re-implemented and improved)
function setupCalendar() {
  const prevMonthBtn = document.getElementById("prevMonth")
  const nextMonthBtn = document.getElementById("nextMonth")

  if (prevMonthBtn) {
    prevMonthBtn.addEventListener("click", () => {
      currentMonth--
      if (currentMonth < 0) {
        currentMonth = 11
        currentYear--
      }
      generateCalendar(currentYear, currentMonth)
    })
  }

  if (nextMonthBtn) {
    nextMonthBtn.addEventListener("click", () => {
      currentMonth++
      if (currentMonth > 11) {
        currentMonth = 0
        currentYear++
      }
      generateCalendar(currentYear, currentMonth)
    })
  }

  generateCalendar(currentYear, currentMonth)
}

// Generate Calendar (re-implemented and improved)
function generateCalendar(year, month) {
  const calendarGrid = document.getElementById("calendarGrid")
  const currentMonthYearDisplay = document.getElementById("currentMonthYear")
  if (!calendarGrid || !currentMonthYearDisplay) return

  const today = new Date()
  const firstDayOfMonth = new Date(year, month, 1).getDay() // 0 for Sunday, 1 for Monday, etc.
  const daysInMonth = new Date(year, month + 1, 0).getDate()

  calendarGrid.innerHTML = "" // Clear previous days

  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ]
  currentMonthYearDisplay.textContent = `${monthNames[month]} ${year}`

  // Add day headers
  const dayHeaders = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
  dayHeaders.forEach((day) => {
    const dayHeader = document.createElement("div")
    dayHeader.textContent = day
    dayHeader.className = "calendar-day-header"
    calendarGrid.appendChild(dayHeader)
  })

  // Add empty cells for days before month starts
  for (let i = 0; i < firstDayOfMonth; i++) {
    const emptyDay = document.createElement("div")
    emptyDay.className = "calendar-day disabled"
    calendarGrid.appendChild(emptyDay)
  }

  // Add days of the month
  for (let day = 1; day <= daysInMonth; day++) {
    const dayElement = document.createElement("div")
    dayElement.textContent = day
    dayElement.className = "calendar-day"

    const currentDate = new Date(year, month, day)
    // Disable past dates
    if (currentDate < new Date(today.getFullYear(), today.getMonth(), today.getDate())) {
      dayElement.classList.add("disabled")
      dayElement.style.cursor = "not-allowed"
    } else {
      dayElement.addEventListener("click", function () {
        // Remove previous selection
        document.querySelectorAll(".calendar-day.selected").forEach((d) => {
          d.classList.remove("selected")
        })

        // Add selection to clicked day
        this.classList.add("selected")

        // Update form field
        const preferredDateInput = document.getElementById("preferredDate")
        if (preferredDateInput) {
          const formattedDate = `${year}-${(month + 1).toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
          preferredDateInput.value = formattedDate
        }
      })
    }
    calendarGrid.appendChild(dayElement)
  }
}

// New function for time slot selection theme change
function setupTimeSlots() {
  const timeSlotsGrid = document.getElementById("timeSlotsGrid")
  const preferredTimeInput = document.getElementById("preferredTime")

  if (!timeSlotsGrid || !preferredTimeInput) return

  const availableTimes = [
    "09:00 AM",
    "10:00 AM",
    "11:00 AM",
    "12:00 PM",
    "02:00 PM",
    "03:00 PM",
    "04:00 PM",
    "05:00 PM",
  ]

  timeSlotsGrid.innerHTML = "" // Clear previous slots

  availableTimes.forEach((time) => {
    const timeSlotElement = document.createElement("div")
    timeSlotElement.textContent = time
    timeSlotElement.className = "time-slot-item"
    timeSlotElement.addEventListener("click", function () {
      // Remove 'selected' from all other time slots
      document.querySelectorAll(".time-slot-item.selected").forEach((slot) => {
        slot.classList.remove("selected")
      })

      // Add 'selected' to the clicked time slot
      this.classList.add("selected")

      // Update the form input
      preferredTimeInput.value = time
    })
    timeSlotsGrid.appendChild(timeSlotElement)
  })
}

// Video modal setup
function setupVideoModal() {
  const modal = document.getElementById("videoModal")
  const closeBtn = document.querySelector(".video-close")

  if (closeBtn) {
    closeBtn.addEventListener("click", closeVideoModal)
  }

  // Close modal when clicking outside
  if (modal) {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        closeVideoModal()
      }
    })
  }

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeVideoModal()
    }
  })
}

// Open video modal
function openVideoModal(videoId) {
  const modal = document.getElementById("videoModal")
  const videoFrame = document.getElementById("videoFrame")

  // Set video source (placeholder for demo)
  const videoSrc = "https://www.youtube.com/embed/dQw4w9WgXcQ?autoplay=1"
  videoFrame.src = videoSrc

  modal.style.display = "block"
  document.body.style.overflow = "hidden"

  currentVideoId = videoId
}

// Close video modal
function closeVideoModal() {
  const modal = document.getElementById("videoModal")
  const videoFrame = document.getElementById("videoFrame")

  modal.style.display = "none"
  videoFrame.src = ""
  document.body.style.overflow = "auto"

  currentVideoId = ""
}

// Open image modal
function openImageModal(imageSrc) {
  // Create image modal dynamically
  const modal = document.createElement("div")
  modal.className = "image-modal"
  modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 2000;
        backdrop-filter: blur(10px);
    `

  const img = document.createElement("img")
  img.src = imageSrc
  img.style.cssText = `
        max-width: 90%;
        max-height: 90%;
        border-radius: 15px;
        box-shadow: 0 20px 40px rgba(0, 0, 0, 0.5);
    `

  const closeBtn = document.createElement("span")
  closeBtn.innerHTML = "&times;"
  closeBtn.style.cssText = `
        position: absolute;
        top: 20px;
        right: 30px;
        color: white;
        font-size: 3rem;
        cursor: pointer;
        transition: color 0.3s;
    `

  closeBtn.addEventListener("click", () => {
    document.body.removeChild(modal)
    document.body.style.overflow = "auto"
  })

  modal.addEventListener("click", (e) => {
    if (e.target === modal) {
      document.body.removeChild(modal)
      document.body.style.overflow = "auto"
    }
  })

  modal.appendChild(img)
  modal.appendChild(closeBtn)
  document.body.appendChild(modal)
  document.body.style.overflow = "hidden"
}

// Smooth scrolling setup
function setupSmoothScrolling() {
  const links = document.querySelectorAll('a[href^="#"]')

  links.forEach((link) => {
    link.addEventListener("click", function (e) {
      e.preventDefault()

      const targetId = this.getAttribute("href").substring(1)
      const targetSection = document.getElementById(targetId)

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - 70 // Account for fixed navbar
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        })
      }
    })
  })
}

// Show notification
function showNotification(message, type) {
  const notification = document.createElement("div")
  notification.className = "notification notification-" + type
  notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === "success" ? "#22c55e" : type === "error" ? "#ef4444" : "#3b82f6"};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        z-index: 3000;
        transform: translateX(100%);
        transition: transform 0.3s ease;
        max-width: 300px;
        word-wrap: break-word;
    `

  notification.textContent = message
  document.body.appendChild(notification)

  // Animate in
  setTimeout(() => {
    notification.style.transform = "translateX(0)"
  }, 100)

  // Auto remove after 5 seconds
  setTimeout(() => {
    notification.style.transform = "translateX(100%)"
    setTimeout(() => {
      if (document.body.contains(notification)) {
        document.body.removeChild(notification)
      }
    }, 300)
  }, 5000)
}

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction() {
    const later = function () {
      clearTimeout(timeout)
      func.apply(this, arguments)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Handle window resize
const debouncedResize = debounce(() => {
  // Handle any resize-specific logic here
  console.log("Window resized")
}, 250)

window.addEventListener("resize", debouncedResize)

// Export functions for global access
window.openVideoModal = openVideoModal
window.closeVideoModal = closeVideoModal
