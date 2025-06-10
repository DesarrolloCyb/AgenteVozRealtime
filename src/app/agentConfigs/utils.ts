import { AgentConfig, Tool } from "@/app/types";

// 1) external_hangup
export const externalHangupTool: Tool = {
  type: "function",
  name: "external_hangup",
  description: "Realiza una desconexión externa de la llamada a través de la API de Vicidial.",
  parameters: { type: "object", properties: {}, required: [] },
};

// 2) schedule_hangup
export const scheduleHangupTool: Tool = {
  type: "function",
  name: "schedule_hangup",
  description:
    "Reinicia un temporizador de 10 s: si no vuelven a invocarla antes de que expire, dispara external_hangup.",
  parameters: { type: "object", properties: {}, required: [] },
};

// 3) external_status_NI
export const externalStatusNITool: Tool = {
  type: "function",
  name: "external_status_NI",
  description: "Estado ‘NI’ (rechazo definitivo).",
  parameters: {
    type: "object",
    properties: {
      callback_datetime: { type: "string" },
      callback_type: { type: "string" },
      callback_comments: { type: "string" },
      qm_dispo_code: { type: "string" },
    },
    required: [],
  },
};

// 4) external_status_SCMADI
export const externalStatusSCMADITool: Tool = {
  type: "function",
  name: "external_status_SCMADI",
  description: "Estado ‘SCMADI’ (reagendar más tarde).",
  parameters: {
    type: "object",
    properties: {
      callback_datetime: { type: "string" },
      callback_type: { type: "string" },
      callback_comments: { type: "string" },
      qm_dispo_code: { type: "string" },
    },
    required: [],
  },
};

// 5) external_status_PAUSADO
export const externalStatusPausadoTool: Tool = {
  type: "function",
  name: "external_status_PAUSADO",
  description: "Estado genérico de despedida ‘PAUSADO’.",
  parameters: {
    type: "object",
    properties: {
      callback_datetime: { type: "string" },
      callback_type: { type: "string" },
      callback_comments: { type: "string" },
      qm_dispo_code: { type: "string" },
    },
    required: [],
  },
};

// ----- NUEVOS SUB-STATUS -----

// SCCCUE: silbido detectado
export const externalStatusScccueTool: Tool = {
  type: "function",
  name: "external_status_SCCCUE",
  description: "Estado ‘SCCCUE’ (silbido detectado).",
  parameters: { type: "object", properties: {}, required: [] },
};

// NCBUZ: buzón de voz
export const externalStatusNcbuzTool: Tool = {
  type: "function",
  name: "external_status_NCBUZ",
  description: "Estado ‘NCBUZ’ (buzón de voz).",
  parameters: { type: "object", properties: {}, required: [] },
};

// SCNUEQ: número equivocado
export const externalStatusScnueqTool: Tool = {
  type: "function",
  name: "external_status_SCNUEQ",
  description: "Estado ‘SCNUEQ’ (número equivocado).",
  parameters: { type: "object", properties: {}, required: [] },
};

export const transferConferenceTool: Tool = {
  type: "function",
  name: "transfer_conference",
  description: "Transfiere la llamada en conferencia vía API de Vicidial.",
  parameters: {
    type: "object",
    properties: {},
    required: [],
  },
};

// SCCEXI: venta exitosa
export const externalStatusSccexiTool: Tool = {
  type: "function",
  name: "external_status_SCCEXI",
  description: "Estado ‘SCCEXI’ (venta exitosa).",
  parameters: { type: "object", properties: {}, required: [] },
};

// SCNUAD: marcar otro número
export const externalStatusScnuadTool: Tool = {
  type: "function",
  name: "external_status_SCNUAD",
  description: "Estado ‘SCNUAD’ (marcar otro número).",
  parameters: { type: "object", properties: {}, required: [] },
};

// 6) external_pause
export const externalPauseTool: Tool = {
  type: "function",
  name: "external_pause",
  description: "Realiza una pausa externa en Vicidial (siempre RESUME).",
  parameters: { type: "object", properties: {}, required: [] },
};

export function injectTransferTools(agentDefs: AgentConfig[]): AgentConfig[] {
  agentDefs.forEach((agentDef) => {
    agentDef.tools = agentDef.tools ?? [];
    // inserta todas las herramientas en el orden deseado
    agentDef.tools.push(
      scheduleHangupTool,
      externalHangupTool,
      externalStatusNITool,
      externalStatusSCMADITool,
      externalStatusPausadoTool,
      externalStatusScccueTool,
      externalStatusNcbuzTool,
      externalStatusScnueqTool,
      externalStatusSccexiTool,
      externalStatusScnuadTool,
      externalPauseTool
    );
    // evita ciclos
    agentDef.downstreamAgents = (agentDef.downstreamAgents || []).map(
      ({ name, publicDescription }) => ({ name, publicDescription })
    );
  });
  return agentDefs;
}
