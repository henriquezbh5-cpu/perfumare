"use client";

import { useSession } from "next-auth/react";
import { useState, type ReactNode } from "react";
import { Modal } from "@/components/ui/modal";
import { SignInButtons } from "./sign-in-buttons";

interface AuthGuardProps {
  children: ReactNode;
  fallback?: ReactNode;
}

export function AuthGuard({ children, fallback }: AuthGuardProps) {
  const { data: session } = useSession();
  const [showModal, setShowModal] = useState(false);

  if (session?.user) {
    return <>{children}</>;
  }

  return (
    <>
      <div
        onClick={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setShowModal(true);
        }}
        className="cursor-pointer"
      >
        {fallback ?? children}
      </div>

      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Sign in to continue"
      >
        <p className="text-sm text-bark-300 mb-4">
          Create an account or sign in to access this feature.
        </p>
        <SignInButtons />
      </Modal>
    </>
  );
}
