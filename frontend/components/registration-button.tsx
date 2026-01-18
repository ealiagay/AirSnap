"use client";

import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { UserPlus } from "lucide-react";
import { RegistrationModal } from "./registration-modal";


export default function RegistrationButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="fixed top-4 right-4 z-50">
        <Button
          onClick={() => setOpen(true)}
          className="rounded-full px-4 py-2 flex items-center gap-2"
        >
          <UserPlus className="h-4 w-4" />
          Registrarse
        </Button>
      </div>

      <RegistrationModal
        open={open}
        onClose={() => setOpen(false)}
        onComplete={(email, locationGranted) => {
          // Simple client-side handling; replace with real logic later
          console.log("Registered:", { email, locationGranted });
          setOpen(false);
        }}
      />
    </>
  );
}
