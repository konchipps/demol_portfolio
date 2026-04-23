const FORM_SUBMIT_ENDPOINT =
  "https://formsubmit.co/ajax/aarondemol2004@gmail.com";

export const sendContactEmail = async ({ email, message, name }) => {
  const payload = new FormData();

  payload.append("name", name);
  payload.append("email", email);
  payload.append("message", message);
  payload.append("_subject", `New portfolio inquiry from ${name}`);
  payload.append("_template", "table");
  payload.append("_url", `${window.location.origin}/#contact`);

  const response = await fetch(FORM_SUBMIT_ENDPOINT, {
    method: "POST",
    headers: {
      Accept: "application/json"
    },
    body: payload
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok || data?.success === false) {
    throw new Error(data?.message || "FormSubmit could not send the email.");
  }

  return data;
};
