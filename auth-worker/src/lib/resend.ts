/**
 * Helper to send magic link emails via Resend API.
 */
export async function sendMagicLink(
  email: string,
  url: string,
  apiKey: string,
  from: string
): Promise<void> {
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      from,
      to: email,
      subject: 'Login to Your Account',
      html: `Click <a href="${url}">here</a> to login. This link expires in 5 minutes.`,
    }),
  });
  if (!res.ok) {
    let data: any = {};
    try {
      data = await res.json();
    } catch {}
    const msg = data.error?.message ?? data.message ?? `Resend API error ${res.status}`;
    throw new Error(msg);
  }
}
