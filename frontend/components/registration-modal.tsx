"use client";

import type React from "react";

import { useState } from "react";
import { Mail, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { http } from "@/lib/http";

interface RegistrationModalProps {
  open: boolean;
  onClose: () => void;
  onComplete: (email: string, locationGranted: boolean) => void;
}

export function RegistrationModal({
  open,
  onClose,
  onComplete,
}: RegistrationModalProps) {
  const [email, setEmail] = useState("");
  const [locationGranted, setLocationGranted] = useState(false);
  const [condition, setCondition] = useState("");

  const handleRequestLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        () => {
          setLocationGranted(true);
        },
        (error) => {
          console.error("Location permission denied:", error);
          setLocationGranted(false);
        }
      );
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await http.post("/usuarios", {
        email,
        locationGranted,
        condition,
      });

      console.log("✅ Registration success:", response);

      onComplete(email, locationGranted);
    } catch (error) {
      console.error("❌ Registration failed:", error);
    }
    onComplete(email, locationGranted);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Bienvenido</DialogTitle>
          <DialogDescription className="text-base leading-relaxed">
            Para brindarte información precisa sobre la calidad del aire,
            necesitamos algunos permisos.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          {/* Email Input */}
          <div className="space-y-2">
            <Label htmlFor="email" className="flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Correo Electrónico
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="tu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-lg"
            />
            <p className="text-xs text-muted-foreground">
              Recibirás alertas sobre la calidad del aire
            </p>
          </div>

          {/* Location Permission */}
          <div className="space-y-3">
            <Label className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Permiso de Ubicación
            </Label>
            <div className="rounded-lg border bg-muted/30 p-4">
              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                Necesitamos acceso a tu ubicación para mostrarte datos precisos
                de tu área.
              </p>
              <Button
                type="button"
                variant={locationGranted ? "secondary" : "default"}
                onClick={handleRequestLocation}
                disabled={locationGranted}
                className="w-full rounded-full"
              >
                {locationGranted ? (
                  <>
                    <MapPin className="mr-2 h-4 w-4" />
                    Ubicación Otorgada
                  </>
                ) : (
                  "Permitir Ubicación"
                )}
              </Button>
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="condition" className="flex items-center gap-2">
              Condición de Salud
            </Label>
            <select
              id="condition"
              value={condition}
              onChange={(e) => setCondition(e.target.value)}
              required
              className="w-full rounded-lg border border-input bg-background p-2 text-sm"
              aria-required
            >
              <option value="">Selecciona una opción</option>
              <option value="asma">Asma</option>
              <option value="epoc">EPOC</option>
              <option value="cardiopatia">Cardiopatía</option>
              <option value="ninguno">Ninguno</option>
            </select>
            <p className="text-xs text-muted-foreground">
              Esta información ayuda a personalizar las alertas sobre la calidad
              del aire.
            </p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full rounded-full"
            disabled={!email || !locationGranted || !condition}
          >
            Continuar
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
