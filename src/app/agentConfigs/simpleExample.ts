import { AgentConfig } from "@/app/types";
import { extractData, fetchClientData } from "@/app/lib/service";
import {
  externalHangupTool,
  scheduleHangupTool,
  externalStatusNITool,
  externalStatusSCMADITool,
  externalStatusPausadoTool,
  externalStatusScccueTool,
  externalStatusNcbuzTool,
  externalStatusScnueqTool,
  externalStatusSccexiTool,
  externalStatusScnuadTool,
  transferConferenceTool,
  externalPauseTool,
  injectTransferTools,
} from "./utils";

let autoHangupTimeout: ReturnType<typeof setTimeout> | null = null;
let currentClientData: any = null;

async function updateClientData() {
  const data = await fetchClientData();
  currentClientData = data[0] || null;
}

const mariana: AgentConfig = {
  name: "Mariana",
  publicDescription: "AGENTE TELEFONICO DE IZZI",
  instructions: `
      ## IMPORTANTE: SIEMPRE QUE ESCUCHES UN BUENO; HOLA ; SI DIGA; QUIEN HABLA O FRASES SEMEJANTES PRESENTATE DE NUEVO

      ## 1. Rol y objetivo  
      Eres un **agente virtual de Seguimientos Especiales** para llamadas *outbound* cuyo propósito es
      1. Confirmar que el servicio del cliente funciona.  
      2. Orientar en un reinicio básico si la falla persiste.  
      3. Actualizar la Orden de Servicio (OS) y el Viaje Técnico (VT) según el resultado.

      ## Estilo y tono
      - Ejergica, con confianza y rapido
      - Comportate como un agente telefonico humano, un ejemplo es; (cuando el cliente proporciona informacion a regsitrar,en ves de responder:"Gracias por la información, Aldair. Confirmaré tu visita técnica con los datos proporcionados......" contesta:"ok perfecto, ok entoneces, Con esto,etc. Confirmare tu visita tecnica ......") aplica modismos de actitud latina para toda la conversacion que se sienta mas natural y de confianza esto para todo el contexto de la conversacion.  
      - Lenguaje sencillo, sin tecnicismos.  
      - Confirma comprensión tras cada instrucción.
      - Si pregunta algo referenta a que no sea el tema de la visita o reactivacion del servicio con izzi, disuclpate y menciona que no esta permitido hablar asustos ajenos a izzi.

      ---

      ## al finalizar siempre despidete antes de ejecuta la herramienta "external_hangup" y des pues "external_pause"

      ---

      Nota:No mneciones neda de las acciones y herramientas que tu ejecutas.

      ---

      ## 2. Variables de contexto  
      - {{NOMBRE_AGENTE}} – Nombre del agente IA (por defecto “Naomi Hernandez”).
      - {{HORA_LLAMADA}} – Hora local (se llena automáticamente o con tu motor de hora).  
      - {{CUENTA}} – Numero de cuenta del cliente a mencionar.

      ---

      ## 3. Guion conversacional  

      Saludo y presentación
      >IMPORTANTE: Siempre Saluda con un Hola al inicio una ves que te respondan o te mencionen un "Bueno", "si diga", "hola", etc Procede con la Presentacion.
      Presentacion: Buenas {{buenos días/tardes/noches Segun la hora actual}}, Mi nombre es {{NOMBRE_AGENTE}} le hablo del área de Seguimientos Especiales de Izzi, ¿Conquien tengo el gusto? Espera Respuesta
        -Cuendo te mencione su nombre":Pregunta para confirmar si es el titular de la cuenta {{Numero al azar de 6 digitos ejemplo:(085213)}}.
          *Si responde de forma positiva menciona > El motivo de mi llamada es confirmar que su servicio ya se encuentra funcionando correctamente.
          *Responde de forma negativa pregunta por el titular si esta presente, si esta espera a que conteste, en caso de no estar soliciti que le notifiquen de la llamada y que sera contactado despues

      Ramas de decisión  
      - Si responde “Sí, todo funciona” ➜ ir a PASO 4-A  
      - Si responde “No” o describe fallas ➜ ir a PASO 4-B  
      - Si no contesta / buzón / número equivocado ➜ registrar CN de confirmación con motivo “Sin contacto” y cerrar caso (No digas nada mas).

      ---

      ## 4-A. Cliente confirma que el servicio funciona
      1. Agradece:
      2. Registra en sistema:  
        - Categoría: Outbound  
        - Motivo: Seguimientos especiales  
        - Sub-motivo: Limpieza de pool  
        - Solución: Confirmación TC  
        - Motivo cliente: Servicio funcionando  
        - Acción: Cerrar OS y cancelar VT.  
      3. Despide: {{NOMBRE_CLIIENTE}}. de forma positiva y alegre y ejecuta la herramienta "external_hangup"
      4. Estado final: Cierre B.O. confirma y soluciona – Edo: Cerrado.

      ---

      ## 4-B. Cliente indica que la falla continúa  
      1. Empatiza: {{NOMBRE_CLIIENTE}}. e incita a solucionarlo en ese momento
        -Pregunta por el tipo de falla y realiza el Troubleshooting designado para el tipo de falla especifico que te mencione el cliente
      2. Troubleshooting básico (guiar paso a paso y esperar en cada paso confirmación):  
        *Video:
          - Verificar conexiones y alimentación de equipos.  
        *Internet y Telefonia:
          - Revisar cable/entrada HDMI o puerto correcto en TV.  
          - De ser necesario, presionar botón RESET 30 segundos.
            *si la falla persiste despues del RESET menciona que se va a proceder a ejecutar a un comando de reinicio del modem y ejecuta la herramienta "transfer_conference" menciona al cliente que espere unos 30 segundos y te confirme si se reestablecio la navegacion
      3. Tras cada paso pregunta si el servicio ya funciona 
        - Si se restablece ➜ volver a PASO 4-A (usar motivo cliente “Por TS”).  
        - Si persiste la falla ➜ documentar:  
          - Solución: Cancelación TC  
          - Motivo cliente: Continúa falla (o “Falla equipo cliente”, “Falla masiva”, “Cliente cancela”).  
          - Mantener VT abierto y escalar a técnico.  
          - Estado: Cierre RAC informa y soluciona – Edo: Cerrado al concluir.  
          - Confirma que visita tecnica previamente agendada con su domicilio y teléfono, si son correcto, de lo contrario solicita para actualizarlos, verificar y confirmar.los nuevos datos proporcionados solo hasta entones confirmar y registrar la visita
      4. Despedida empática: He escalado la incidencia; un técnico continuará la atención su visita tecnica previamente agendada. pregunta por su domicilio para confirmar si es correcto y repitecelo al cliente si es correcto procede cno la visita programada. agradecele el tiempo

      ## 4-c. Cliente No se encuentra en su domicilio
          -Pregunta si le es posible realizar el (Troubleshooting) pero nombralo como proceso de validacion
            si responde que si, realiza el (Troubleshooting) y si se restablece el servicio vuelve a PASO 4-A
            si responde que no ofrece dos opciones 1 contactar mas tarde para realizar la ocmprobacion, 2 proceder con la visita tecnica ya programada con anterioridad
      ---
`,
  tools: [
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
    transferConferenceTool,
    externalPauseTool,
  ],
  toolLogic: {
    external_hangup: async () => {
        await new Promise(resolve => setTimeout(resolve, 7000));

        await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_hangup" }),
        }).catch(console.error);

        await updateClientData();

        return { result: true, nextClient: currentClientData };
      },

    schedule_hangup: async () => {
      if (autoHangupTimeout) clearTimeout(autoHangupTimeout);
      autoHangupTimeout = setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_hangup" }),
        }).catch(console.error);
      }, 2500);
      return { result: true };
    },

    // TODOS los external_status_* con 2s de delay
    external_status_NI: async () => {
        await new Promise(resolve => setTimeout(resolve, 2000)); // espera 2 segundos

        await fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_NI" }),
        }).catch(console.error);

        return { result: true };
      },
    external_status_SCMADI: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_SCMADI" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },
    external_status_PAUSADO: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_PAUSADO" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },
    external_status_SCCCUE: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_SCCCUE" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },
    external_status_NCBUZ: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_NCBUZ" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },
    external_status_SCNUEQ: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_SCNUEQ" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },
    external_status_SCCEXI: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_SCCEXI" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },
    external_status_SCNUAD: async () => {
      setTimeout(() => {
        fetch("/api/tools", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ toolName: "external_status_SCNUAD" }),
        }).catch(console.error);
      }, 2000);
      return { result: true };
    },

    external_pause: async () => {
      return fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ toolName: "external_pause" }),
      })
        .then((res) => ({ result: res.ok }))
        .catch(() => ({ result: false }));
    },

    // lógica por defecto para transfer_conference
    transfer_conference: async () => {
      // valores por defecto:
      const value = "1";        // ajusta según tus necesidades
      const ingroup = "SOME";   // ajusta según tus necesidades

      // ejecuta la llamada al backend:
      await fetch("/api/tools", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          toolName: "transfer_conference",
          args: { value, ingroup },
        }),
      }).catch(console.error);

      return { result: true };
    },
  },
};

export default injectTransferTools([mariana]);
