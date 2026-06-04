# Fluxo Simplificado de Plataformas

## Problema Original
O motorista tinha que:
1. Ir a "Apps"
2. Clicar "Adicionar"
3. Selecionar plataforma
4. **Calcular e colocar comissão manualmente** (ex: "Uber tem 25%?")
5. Confirmar

**Resultado:** Confuso e propenso a erros.

---

## Novo Fluxo — Super Simples

### 1️⃣ **Setup Inicial (Onboarding)**
- **Página com cards visuais:**
  - 🚕 **Uber** → 25% comissão
  - 🚗 **99** → 28% comissão
  - 📦 **Loggi** → 20% comissão
  - 🎯 **InDriver** → 10% comissão

- **Motorista simplesmente clica nos que usa** → ✓ Pronto!
- Se errar, pode adicionar/remover depois em "Apps"

### 2️⃣ **Página "Apps" Simplificada**
- **Grid de cards de cada plataforma disponível**
- Clica em "Adicionar Uber" → aparece na lista
- Na lista, pode:
  - ✓ Ativar/desativar (toggle checkbox)
  - 📝 Editar comissão se tiver mudado (campo inline)
  - 🗑️ Deletar

### 3️⃣ **Registrar Turno**
- **Ao registrar, dropdown com apps ativos**
- Escolhe "Uber"
- **Simulação em TEMPO REAL:**
  ```
  Faturamento bruto:    R$ 650
  Comissão (Uber 25%):  R$ 162,50
  Custo operação:       R$ 157
  ─────────────────────────────
  Você recebe:          R$ 330,50
  ```
- Já vê o valor final ANTES de confirmar

### 4️⃣ **Calculadora de Comissão (Educativo)**
- Página com **sliders interativos**
- Motorista mexe em "Faturamento" e "Comissão" e vê resultado em tempo real
- Compara automaticamente todas as plataformas
- **Entende** como funciona comissão

---

## Benefícios

✅ **Sem cálculo manual** — Presets automáticos
✅ **Visualização clara** — Vê o que recebe antes de registrar
✅ **Educação** — Calculadora interativa ensina
✅ **Flexibilidade** — Pode editar comissão se mudar
✅ **Rápido** — Setup em 2 cliques no onboarding

---

## Arquivos Novos/Modificados

- `PlatformsPage.tsx` — Grid de adição com presets
- `PlatformSetupPage.tsx` — Setup inicial com cards visuais
- `CommissionCalculatorPage.tsx` — Calculadora educativa com sliders
- `ShiftPanelPage.tsx` — Preview de ganho com comissão já descontada
- `AppContext.tsx` — Carrega plataformas do usuário

---

## Exemplo Visual: Registro de Turno

```
┌─────────────────────────────┐
│ Data: [04/06/2024]          │
│ Plataforma: [Uber ▼]        │
│ Faturamento: [R$ 650    ]   │
│ Combustível: [R$ 85     ]   │
│ Horas: [8]                  │
├─────────────────────────────┤
│ Faturamento bruto:  R$ 650  │
│ Comissão Uber 25%:  R$ 162  │ ← Automático!
│ Custo operação:     R$ 157  │
│ ─────────────────────────── │
│ ✓ Você recebe:      R$ 330  │ ← Green!
└─────────────────────────────┘
```

Motorista **não precisa** de calculadora, tudo é automático e educativo.
