"use client";

export default function UploadExcel() {
  const upload = async (e: any) => {
    const file = e.target.files[0];
    const form = new FormData();
    form.append("file", file);

    await fetch("/api/upload", {
      method: "POST",
      body: form,
    });
  };

  return <input type="file" accept=".xlsx,.xls" onChange={upload} />;
}
