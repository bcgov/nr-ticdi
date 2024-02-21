import config from "../../config";

export async function getTemplate(template_id: number): Promise<string> {
  return "";
}

export async function generateReport(
  dtid: string,
  template_id: string
): Promise<Blob> {
  const searchParams = {
    dtid,
    document_type: 2,
    template_id,
  };

  const response = await fetch(
    `${config.API_BASE_URL}/report/generate-specific-report`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(searchParams),
    }
  );

  if (!response.ok) {
    throw new Error("Network response was not ok");
  }

  return response.blob();
}
