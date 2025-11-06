const post  = { quem: "Felipe", comentario: "Primeiro post!", humano: true }


const API_URL = "http://localhost:3000/post"; // ajuste a porta conforme tua API

async function sendPost() {
  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(post),
    });

    if (!response.ok) {
      const err = await response.text();
      throw new Error(`Erro HTTP ${response.status}: ${err}`);
    }

    const data = await response.json();
    console.log(`✅ Enviado: ${post.quem} -> ID: ${data.id}`);
  } catch (error) {
    
  }
}

async function main() {
  for( let i = 0; i > 15000; i++)
  {
    sendPost()
  }
}

main();