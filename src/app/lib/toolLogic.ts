const API_BASE = "http://192.168.50.13/agc/api.php";
const SOURCE = "test";
const USER = "BOTo";
const PASSWORD = "Cyberbot2024";
const AGENT_USER = "BOTo";

export async function handleToolCall(
  toolName: string,
  args: Record<string, any>
): Promise<{ result: boolean; data?: any }> {
  try {
    let url = "";

    switch (toolName) {
      case "external_hangup":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_hangup` +
          `&value=1`;
        break;

      case "external_status_NI":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=NI`;
        break;

      case "external_status_SCMADI":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=SCMADI`;
        break;

      case "external_status_PAUSADO":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=PAUSADO`;
        break;

      case "external_status_SCCCUE":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=SCCCUE`;
        break;

      case "external_status_NCBUZ":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=NCBUZ`;
        break;

      case "external_status_SCNUEQ":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=SCNUEQ`;
        break;

      case "external_status_SCCEXI":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=SCCEXI`;
        break;

      case "external_status_SCNUAD":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_status` +
          `&value=SCNUAD`;
        break;

      case "external_pause":
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=external_pause` +
          `&value=RESUME`;
        break;

      case "transfer_conference":
        // usa args.value / args.ingroup si cambian,
        // o caen en los defaults que pasamos arriba
        const val = args.value ?? "1";
        const grp = args.ingroup ?? "SOME";
        url =
          `${API_BASE}` +
          `?source=${SOURCE}` +
          `&user=${USER}` +
          `&pass=${PASSWORD}` +
          `&agent_user=${AGENT_USER}` +
          `&function=transfer_conference` +
          `&value=${encodeURIComponent(val)}` +
          `&ingroup_choices=${encodeURIComponent(grp)}`;
        break;

      default:
        throw new Error(`Tool desconocido: ${toolName}`);
    }

    const res = await fetch(url, { method: "GET" });
    return { result: res.ok };
  } catch (error) {
    console.error("Error en handleToolCall:", error);
    return { result: false };
  }
}
