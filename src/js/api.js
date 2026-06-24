const RSVP_ENDPOINT = "";

export async function submitRsvp(payload) {
  if (!RSVP_ENDPOINT) {
    console.info("RSVP saved in demo mode:", payload);
    await new Promise((resolve) => setTimeout(resolve, 600));
    return { ok: true, demo: true };
  }

  const response = await fetch(RSVP_ENDPOINT, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    throw new Error("Unable to submit RSVP");
  }

  return response.json().catch(() => ({ ok: true }));
}
