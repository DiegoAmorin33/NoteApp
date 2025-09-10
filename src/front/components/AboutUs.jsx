import React from "react";
import "../styles/aboutus.css";

const AboutUs = () => {
  return (
    <div className="aboutus-container">
      <div className="overlay">
        <h1 className="title">Sobre Nosotros</h1>

        <section className="section">
          <h3>¿Qué es NOTED?</h3>
          <p><strong>NOTED</strong> es un espacio digital creado para que las personas compartan,
          descubran y discutan ideas de forma sencilla. Nuestra plataforma
          permite publicar notas anónimas o desde un perfil personal, fomentando
          el diálogo abierto, la colaboración y la construcción de comunidad.
        </p>
        <p>
          En su esencia, NOTED nace como un lugar donde la escritura y el
          compartir experiencias funcionan también como un acto terapéutico.
          Entendemos que en la dinámica actual muchas veces resulta difícil
          hablar de lo que nos pasa con alguien cercano o incluso acudir a un
          profesional. Por eso, buscamos brindar un espacio seguro donde
          expresar pensamientos y emociones sea un primer paso para sentirse
          acompañado y escuchado.
        </p>

        </section>

        <section className="section">
          <h3>Misión</h3>
          <p>
            Brindar un entorno seguro y accesible donde cualquier persona pueda expresar 
            sus ideas, recibir apoyo y colaborar con otros, utilizando la escritura como 
            herramienta de conexión y crecimiento personal.
          </p>
        </section>

        <section className="section">
          <h3>Visión</h3>
          <p>
            Convertirnos en la plataforma líder para el intercambio de ideas y notas en 
            Latinoamérica, donde la comunidad encuentre un espacio confiable para aprender, 
            compartir y acompañarse mutuamente.
          </p>
        </section>

        <section className="section">
          <h3>Valores</h3>
          <ul className="values-list">
            <li><strong>Colaboración:</strong> Creemos en la fuerza de las ideas compartidas.</li>
            <li><strong>Respeto:</strong> Fomentamos un espacio inclusivo y libre de juicios.</li>
            <li><strong>Accesibilidad:</strong> Queremos que cualquier persona pueda participar sin barreras.</li>
            <li><strong>Innovación:</strong> Buscamos mejorar constantemente la experiencia del usuario.</li>
            <li><strong>Comunidad:</strong> Promovemos la ayuda mutua y el aprendizaje colectivo.</li>
          </ul>
        </section>
      </div>
    </div>
  );
};

export default AboutUs;
