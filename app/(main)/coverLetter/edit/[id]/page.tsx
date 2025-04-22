import React from "react";
import { getCoverLetterById } from "@/actions/coverLetter";
import { notFound } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import CoverLetterEditor from "../../_components/cover-letter-editor";

// Remove this interface definition:
// interface PageProps {
//   params: {
//     id: string;
//   };
//   searchParams?: Record<string, string | string[] | undefined>;
// }

// Type the props directly in the function signature
export default async function EditCoverLetterPage({
  params,
}: // You can also include searchParams if needed, typed similarly
// searchParams,
{
  params: { id: string };
  searchParams?: { [key: string]: string | string[] | undefined }; // Optional typing for searchParams
}) {
  const { id } = params; // This remains the same
  const coverLetter = await getCoverLetterById(id);

  if (!coverLetter) {
    notFound();
  }

  return (
    <div className="container mx-auto py-6 px-4">
      <PageHeader
        title="Edit Cover Letter"
        description="Customize and improve your cover letter"
        align="left"
        size="lg"
        className="mb-8"
      />

      <CoverLetterEditor coverLetter={coverLetter} />
    </div>
  );
}
