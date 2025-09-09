import React from "react";
import '../styles/contact.css';
import { FaGithub } from "react-icons/fa";
import logoBackground from "../assets/img/logo-pequeño.png";

const contact = [
  { github: "https://github.com/efereda", email: "feredaeduardo@gmail.com" },
  { github: "https://github.com/SleepyDut", email: "diegoundreiner@gmail.com" },
  { github: "https://github.com/DiegoAmorin33", email: "amorinoficial33@gmail.com" },
  { github: "https://github.com/pauloams99", email: "paulo@vlu.com.ve" },
];

const Contact = () => {
  return (
    <div className="contact-container text-white">
      <div className="overlay">
        <h2 className="text-center mb-4">Contáctanos</h2>

        {/* Grid para las tarjetas */}
        <div className="contact-grid">
          {contact.map((c, i) => (
            <div key={i} className="contact-card p-3 rounded shadow">
              <a
                href={c.github}
                target="_blank"
                rel="noopener noreferrer"
                className="github-link d-flex align-items-center mb-2"
              >
                <FaGithub size={24} className="me-2" /> {c.github}
              </a>
              <a href={`mailto:${c.email}`} className="email-link">
                {c.email}
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Contact;
