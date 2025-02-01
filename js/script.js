document.addEventListener("DOMContentLoaded", () => {
  /* ---------------------------
     Menu Toggle Functionality
  -----------------------------*/
  const toggleMenu = () => {
    const menuContent = document.querySelector(".menu_content")
    const clickElements = document.querySelectorAll(".open_menu, .close_menu")
    const menuContainer = document.querySelector(".menu_container")
    const overflowBlock = document.querySelector(".hide-scrollbar")

    clickElements.forEach((element) => {
      element.addEventListener("click", () => {
        const isActive = menuContent.classList.contains("active")

        if (!isActive) {
          // Show menu: add active class and update styles
          setTimeout(() => {
            menuContent.classList.add("active")
            menuContent.classList.remove("default")
          }, 0)
          overflowBlock.style.overflow = "hidden"
          menuContainer.style.display = "flex"
        } else {
          // Hide menu: remove active class after delay and reset styles
          setTimeout(() => {
            menuContainer.style.display = "none"
            overflowBlock.style.overflow = "auto"
          }, 800)
          menuContent.classList.remove("active")
          menuContent.classList.add("default")
        }
      })
    })
  }

  toggleMenu()

  /* ---------------------------
     Preloader Animation
  -----------------------------*/
  ;(() => {
    const preloader = document.getElementById("preloader")
    const progressText = preloader.querySelector("h1")
    const elementsToAnimate = document.querySelectorAll(
      ".header, .header_hero, .header_description, .cta, .stats-list, .stats_title, .stats_header"
    )
    let progress = 0

    const updateProgress = () => {
      if (progress < 100) {
        progress += Math.floor(Math.random() * 5) + 1
        if (progress > 100) progress = 100
        progressText.textContent = `${progress}%`
        const delay = Math.random() * 100 + 50
        setTimeout(updateProgress, delay)
      }
    }

    updateProgress()

    setTimeout(() => {
      progress = 100
      progressText.textContent = "100%"
      preloader.classList.add("fade-out")
      document.body.classList.remove("hide-scrollbar") // Show scrollbar
      elementsToAnimate.forEach((element) => {
        element.classList.add("animate")
        element.addEventListener("animationend", () => {
          element.classList.remove("animate")
        })
      })
    }, 4000)
  })()

  /* ---------------------------
     Stats Animation
  -----------------------------*/
  class StatsAnimation {
    constructor() {
      this.statsLists = document.querySelectorAll(".stats_list")
      this.observer = null
      this.init()
    }

    init() {
      this.observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              this.animateStats(entry.target)
              this.observer.unobserve(entry.target)
            }
          })
        },
        { threshold: 0.1 }
      )

      this.statsLists.forEach((stats) => {
        this.observer.observe(stats)
      })
    }

    animateStats(statsElement) {
      statsElement.classList.add("visible")
      const clipElement = statsElement.querySelector(".clip")
      const numberElement = clipElement.querySelector(".stats_header")
      const targetNumber = parseInt(numberElement.innerText)
      const startNumber = this.calculateStartNumber(targetNumber)

      this.animateNumber(numberElement, startNumber, targetNumber)

      // Trigger clip animation after a delay
      setTimeout(() => {
        clipElement.classList.add("animate")
      }, 8000)
    }

    calculateStartNumber(target) {
      if (target > 1000) return Math.floor(target * 0.5)
      if (target > 500) return Math.floor(target * 0.3)
      if (target > 100) return Math.floor(target * 0.2)
      return 0
    }

    animateNumber(element, start, target) {
      const duration = 9000
      const fps = 60
      const frames = duration / (1000 / fps)
      let current = start
      element.classList.add("counting")

      const easeOutQuad = (t) => t * (2 - t)
      let frame = 0

      const updateNumber = () => {
        frame++
        const progress = frame / frames
        const easedProgress = easeOutQuad(progress)
        current = start + (target - start) * easedProgress

        if (progress >= 1) {
          element.textContent =
            target + (element.textContent.includes("+") ? "+" : "")
          element.classList.remove("counting")
          return
        }

        const formattedNumber = this.formatNumber(Math.round(current))
        element.textContent =
          formattedNumber + (element.textContent.includes("+") ? "+" : "")
        requestAnimationFrame(updateNumber)
      }

      requestAnimationFrame(updateNumber)
    }

    formatNumber(num) {
      return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    }
  }

  new StatsAnimation()

  /* ---------------------------
     Infinite Scroll Animation
  -----------------------------*/
  class InfiniteScroll {
    constructor(elementId, options = {}) {
      this.scrollElement = document.getElementById(elementId)
      this.mobileElement = document.querySelector(".scroll-text-mobile")
      this.options = {
        speed: options.speed || 1,
        direction: options.direction || "left",
      }
      this.init()
    }

    init() {
      if (window.innerWidth < 780) {
        this.scrollElement.style.display = "none"
        if (this.mobileElement) {
          this.mobileElement.style.display = "flex"
        }
        return
      } else {
        this.scrollElement.style.display = "flex"
        if (this.mobileElement) {
          this.mobileElement.style.display = "none"
        }
      }

      const itemWidth = this.scrollElement.firstElementChild.offsetWidth
      const copiesNeeded = Math.ceil(window.innerWidth / itemWidth) + 1

      for (let i = 0; i < copiesNeeded; i++) {
        const clone = this.scrollElement.firstElementChild.cloneNode(true)
        this.scrollElement.appendChild(clone)
      }

      this.animate()
    }

    animate() {
      let position = 0
      const firstItem = this.scrollElement.firstElementChild
      const itemWidth = firstItem.offsetWidth

      const step = () => {
        position -= this.options.speed
        if (Math.abs(position) >= itemWidth) {
          position = 0
          this.scrollElement.appendChild(this.scrollElement.firstElementChild)
        }
        this.scrollElement.style.transform = `translateX(${position}px)`
        requestAnimationFrame(step)
      }

      requestAnimationFrame(step)
    }
  }

  new InfiniteScroll("scrollText", {
    speed: 2,
    direction: "left",
  })
})
