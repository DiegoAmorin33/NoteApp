const Notes = () => {
    return (
        <div>
            <div className="card my-4">
                <div className="card-body">
                    <h1 className="card-title">Contrary to popular belief, Lorem Ipsum is not simply random text. It has roots in a piece of classical </h1>
                    <div className="d-flex">
                        <img
                            src="https://media.istockphoto.com/id/1386479313/es/foto/feliz-mujer-de-negocios-afroamericana-millennial-posando-aislada-en-blanco.jpg?s=612x612&w=0&k=20&c=JP0NBxlxG2-bdpTRPlTXBbX13zkNj0mR5g1KoOdbtO4="
                            alt="foto de perfil"
                            className="foto-miniatura rounded-circle m-auto mx-2"
                        />
                        <div>
                            <p>TAGS</p>
                            <h6>Nombre del usuario</h6>
                            <p>fecha de publicación</p>
                        </div>

                    </div>
                </div>
            </div>
        </div>
    );
}

export default Notes;