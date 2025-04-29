async function obtenerMensajeIA(nombreCliente, producto) {
  const prompt = `Escribe un mensaje de agradecimiento amable y profesional para ${nombreCliente}, que acaba de comprar ${producto}.`;

  try {
    const response = await fetch("https://web-m77f.onrender.com/mensaje", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ prompt })
    });

    const data = await response.json();
    document.getElementById("respuesta-ia").textContent = data.mensaje;
  } catch (error) {
    document.getElementById("respuesta-ia").textContent = "No se pudo generar el mensaje.";
  }
}
