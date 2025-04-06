import { PageHeader } from "@/components/page-header";
import React from "react";
import { BarLoader } from "react-spinners";
import { Suspense } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
interface Props {
  children: React.ReactNode;
}

function Layout(props: Props) {
  const { children } = props;

  return (
    <div className="px-5">
      <Suspense fallback={<BarLoader className="mt-4" width={100} />}>
        {children}
      </Suspense>
    </div>
  );
}

export default Layout;
