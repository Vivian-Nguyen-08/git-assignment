import React, { useRef, useEffect } from "react";
import "../styles/AboutUs.css";
import globeLogo from "../assets/globe.png";

// Images
import diya from "../assets/diya.jpg";
import vivian from "../assets/vivian.jpg";
import shreya from "../assets/shreya.jpg";
import shreyak from "../assets/shreyak.jpg";
import eric from "../assets/eric.png";
import rohit from "../assets/rohit.jpg";
import aarya from "../assets/aarya.jpg";
import sarah from "../assets/sarah.png";

const creators = [
  { id: 1, name: "Vivian Nguyen", title: "CS Major", image: vivian, bio: "Vivian wants to be a Software Engineer.", action: "View LinkedIn", link:"https://www.linkedin.com/in/vivian-nguyen-38a0b1290/" },
  { id: 2, name: "Shreya S Ramani", title: "CS Major, Finance Minor", image: shreya, bio: "Shreya wants to go into Project Management", action: "View LinkedIn", link: "https://www.linkedin.com/in/shreya-s-ramani/" },
  { id: 3, name: "Diya Mehta", title: "CS Major", image: diya, bio: "Diya wants to be a Software Engineer", action: "View LinkedIn", link: "https://www.linkedin.com/in/diya-mehta-14721b1b5/" },
  { id: 4, name: "Aarya Ravishankar", title: "CS Major", image: aarya, bio: "Aarya wants to be a Software Engineer.", action: "View LinkedIn", link:"https://www.linkedin.com/in/aarya-ravishankar-6397102a1/" },
  { id: 5, name: "Rohit Penna", title: "CS Major", image: rohit, bio: "Rohit wants to be a Data Analyst in the tech field.", action: "View LinkedIn", link:"https://www.linkedin.com/in/rohit-penna/" },
  { id: 6, name: "Shreya Kumari", title: "CE Major", image: shreyak, bio: "Shreya wants to be a Software Engineer.", action: "View LinkedIn", link: "https://www.linkedin.com/in/shreya-kumari2026/" },
  { id: 7, name: "Sarah Park", title: "CS Major", image: sarah, bio: "Sarah wants to be a Software Engineer.", action: "View LinkedIn", link: "https://www.linkedin.com/in/sjpsarah/" },
  { id: 8, name: "Eric Lewellen", title: "CS Major", image: eric, bio: "Eric currently works as a Software Engineer", action: "View LinkedIn", link: "https://www.linkedin.com/in/eric-lewellen-0828901a8/"},
];

export default function AboutUs() {
  const carouselRef = useRef(null);

  const scroll = (dir) => {
    carouselRef.current.scrollBy({
      left: dir === "right" ? 320 : -320,
      behavior: "smooth",
    });
  };

  // Intersection Observer for scroll-triggered fade-in
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.1 }
    );

    const fadeEls = document.querySelectorAll(".fade-in");
    fadeEls.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, []);

  return (
    <div className="about-page no-sidebar">
      <a href="/" className="logo-button">
        <img src={globeLogo} alt="Planora Logo" />
      </a>

      <div className="about-main">
        <h1 className="section-title">About Us</h1>

        <div className="carousel-wrapper">
          <button onClick={() => scroll("left")} className="carousel-arrow left">←</button>
          <div className="carousel" ref={carouselRef}>
            {creators.map((creator) => (
              <div key={creator.id} className="team-card fade-in">
                <img src={creator.image} alt={creator.name} />
                <h2>{creator.name}</h2>
                <h3>{creator.title}</h3>
                <p>{creator.bio}</p>
                <a
                    href={creator.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="action-link"
                >
                    {creator.action}
                </a>

              </div>
            ))}
          </div>
          <button onClick={() => scroll("right")} className="carousel-arrow right">→</button>
        </div>

        <section className="mission-section fade-in">
          <h2>Our Mission</h2>
          <p>
            We are dedicated to crafting innovative solutions that simplify event planning
            for individuals and organizations across the globe.
          </p>
          <p>
            Our platform empowers users with intuitive interfaces, seamless collaboration,
            and flexible tools to create meaningful events with ease.
          </p>

          <h2>Our Goals</h2>
          <ul>
            <li>Enhance productivity through simple, effective interfaces.</li>
            <li>Ensure accessibility and inclusivity in all features.</li>
            <li>Prioritize data privacy and system uptime.</li>
            <li>Adapt and evolve with user needs and technologies.</li>
          </ul>
        </section>

        <section className="vision-section fade-in">
          <h2>Our Vision</h2>
          <p>
            To redefine the way people connect, collaborate, and celebrate by building
            the most intuitive event planning experience ever created.
          </p>
        </section>

        <section className="values-section fade-in">
          <h2>Our Core Values</h2>
          <ul>
            <li><strong>Empathy:</strong> We put users first and listen deeply.</li>
            <li><strong>Innovation:</strong> We embrace change and challenge norms.</li>
            <li><strong>Accountability:</strong> We own our work with integrity.</li>
            <li><strong>Collaboration:</strong> We grow better together.</li>
          </ul>
        </section>

        <section className="story-section fade-in">
          <h2>Our Story</h2>
          <p>
            Planora began as a student-led capstone idea. Over countless late-night
            debugging sessions and coffee-fueled Discord calls, our vision came to life.
            What started as a calendar grew into a community-centered tool for real collaboration.
          </p>
        </section>
      </div>
    </div>
  );
}
