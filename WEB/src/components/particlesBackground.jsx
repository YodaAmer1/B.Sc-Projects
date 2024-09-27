import React, { useEffect } from "react";

// Function to load an external script
const loadExternalScript = (url) => {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = url;
    script.async = true;
    script.onload = () => resolve(script);
    script.onerror = () => reject(new Error(`Script load error for ${url}`));
    document.body.appendChild(script);
  });
};

// This component is used to display the particles background
const ParticlesBackground = () => {
  useEffect(() => {
    // Load the tsParticles script dynamically
    loadExternalScript(
      "https://cdn.jsdelivr.net/npm/tsparticles@1.37.4/tsparticles.min.js",
    )
      .then(() => {
        // Initialize tsParticles after the script is loaded
        window.tsParticles.load("tsparticles", {
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "bubble",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 20,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#4bc0c0",
              opacity: 1,
            },
            links: {
              color: "#4bc0c0",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "inside",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 2,
              straight: true,
            },
            number: {
              density: {
                enable: true,
                value_area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: false,
              value: 5,
            },
          },
        });
      })
      .catch((error) => console.error("Script loading failed.", error));
  }, []);

  return (
    <div id="tsparticles" className="absolute top-0 left-0 w-full h-full"></div>
  );
};

export default ParticlesBackground;
