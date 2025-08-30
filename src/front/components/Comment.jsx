import { useState } from "react";
const comment = () => {
  const [isClicked, setIsClicked] = useState(false);
  const handleIconClick = () => {
    setIsClicked(!isClicked);
  };

  return (
    <div className="bg-white rounded-strong d-flex mt-3">
      <img
        src="https://media.istockphoto.com/id/1386479313/es/foto/feliz-mujer-de-negocios-afroamericana-millennial-posando-aislada-en-blanco.jpg?s=612x612&w=0&k=20&c=JP0NBxlxG2-bdpTRPlTXBbX13zkNj0mR5g1KoOdbtO4="
        alt="foto de perfil"
        className="foto-circular rounded-circle m-auto mx-2"
      />
      <div>
        <h4>Nombre de usuario</h4>
        <p className="mx-2 interlineado-compacto ">
          Texto del comentario: Lorem Ipsum is simply dummy text of the printing
          and typesetting industry. Lorem Ipsum has been the industry's standard
          dummy text ever since the 1500s, when an unknown printer took a galley
          of type and scrambled it to make a type specimen book. It has survived
          not only five centuries, but also the leap into electronic
          typesetting, remaining essentially unchanged.
        </p>
      </div>
      {/* uso un controlador ternario para el color del icono */}
      <i
        onClick={handleIconClick}
       className={`icono fa-solid fa-heart fa-xl m-auto me-3 ${isClicked ? 'icono-activo' : ''}`}
      ></i>
    </div>
  );
};

export default comment;