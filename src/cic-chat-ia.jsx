import { useState } from "react";

// --- 1. CONFIGURAÇÕES E ESTILOS ---
const T = {
  bg: "#05050A",
  card: "#11111A",
  amber: "#F5A623",
  amberD: "#B87A10",
  white: "#EFECE5",
  mid: "#68656E",
  green: "#22C55E",
};

const hora = () =>
  new Date().toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

// --- 2. LÓGICA DO PROMPT (O CÉREBRO) ---
const getSystemPrompt = (u) => `
Você é o COACH do C.I.C.

CONTEXTO:
Nome: ${u.nome || "Motorista"}
Meta: ${u.meta || "Carro"}

PERSONALIDADE:
- Amigo e parceiro de corrida.
- Evite termos bancários.
- Use "guardar" e "meta".

FORMATO:
- Respostas curtas (até 3 parágrafos).
`;

// --- 3. COMPONENTE PRINCIPAL ---
export default function CICChat() {
  const [msgs, setMsgs] = useState([
    {
      role: "assistant",
      content: "E aí! Como foi a corrida hoje?",
      time: hora(),
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  // Função de voz simples
  const falar = (texto) => {
    if (!window.speechSynthesis) return;

    const u = new SpeechSynthesisUtterance(texto);
    u.lang = "pt-BR";
    window.speechSynthesis.speak(u);
  };

  // Função de envio para o GROQ
  async function enviar() {
    if (!input.trim() || loading) return;

    const q = input.trim();

    setInput("");

    const hist = [
      ...msgs,
      {
        role: "user",
        content: q,
        time: hora(),
      },
    ];

    setMsgs(hist);
    setLoading(true);

    const usuario = JSON.parse(
      localStorage.getItem("cic_usuario") || "{}"
    );

    try {
      const res = await fetch(
        "https://api.groq.com/openai/v1/chat/completions",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${import.meta.env.VITE_GROQ_API_KEY}`,
          },
          body: JSON.stringify({
            model: "llama3-8b-8192",
            messages: [
              {
                role: "system",
                content: getSystemPrompt(usuario),
              },
              ...hist.map((m) => ({
                role: m.role,
                content: m.content,
              })),
            ],
          }),
        }
      );

      if (!res.ok) {
        throw new Error(`Erro ${res.status}`);
      }

      const data = await res.json();

      const resposta =
        data?.choices?.[0]?.message?.content ||
        "Desculpe, não consegui responder agora.";

      setMsgs((p) => [
        ...p,
        {
          role: "assistant",
          content: resposta,
          time: hora(),
        },
      ]);

      falar(resposta);
    } catch (e) {
      alert("Erro na conexão: " + e.message);
      console.error(e);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: T.bg,
        color: T.white,
        minHeight: "100vh",
        padding: 20,
        maxWidth: 440,
        margin: "0 auto",
      }}
    >
      {msgs.map((m, i) => (
        <div
          key={i}
          style={{
            marginBottom: 15,
            padding: 10,
            borderRadius: 12,
            background:
              m.role === "user" ? T.amber : T.card,
            color:
              m.role === "user" ? "#000" : T.white,
          }}
        >
          <p style={{ margin: 0 }}>{m.content}</p>
        </div>
      ))}

      {loading && (
        <p style={{ color: T.amber }}>
          Coach está pensando...
        </p>
      )}

      <div
        style={{
          position: "fixed",
          bottom: 20,
          width: "100%",
          maxWidth: 400,
          display: "flex",
          gap: 8,
        }}
      >
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && enviar()}
          style={{
            flex: 1,
            padding: 10,
            borderRadius: 8,
            border: "none",
          }}
          placeholder="Digite sua mensagem..."
        />

        <button
          onClick={enviar}
          disabled={loading}
          style={{
            padding: "10px 16px",
            border: "none",
            borderRadius: 8,
            background: T.amber,
            cursor: "pointer",
          }}
        >
          Enviar
        </button>
      </div>
    </div>
  );
}
