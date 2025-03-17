"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import supabase from "@/database/supabase";

export default function ContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{
    text: string;
    type: "success" | "error";
  } | null>(null);

  // Form data state
  const [email, setEmail] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [messageText, setMessageText] = useState("");
  const [type, setType] = useState("general"); // Default type

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage(null);

    try {
      // Create the data object matching your database schema
      const inquiryData = {
        email,
        firstName,
        lastName,
        message: messageText,
        type,
        created_at: new Date().toISOString(),
      };

      // Insert directly into the database
      const { error } = await supabase.from("inquiries").insert(inquiryData);

      if (error) throw error;

      // Success
      setMessage({
        text: "Váš dotaz byl úspěšně odeslán. Děkujeme!",
        type: "success",
      });

      // Reset form
      setEmail("");
      setFirstName("");
      setLastName("");
      setMessageText("");
      setType("general");
    } catch (error) {
      console.error("Error submitting form:", error);
      setMessage({
        text: "Došlo k chybě při odesílání. Zkuste to prosím znovu.",
        type: "error",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={`p-4 rounded-md ${
            message.type === "success"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {message.text}
        </div>
      )}

      <div>
        <Input
          type="email"
          placeholder="Email *"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          placeholder="Jméno *"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          required
        />
        <Input
          placeholder="Příjmení *"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          required
        />
      </div>

      <div>
        <select
          className="w-full p-2 border rounded-md"
          value={type}
          onChange={(e) => setType(e.target.value)}
        >
          <option value="general">Obecný dotaz</option>
          <option value="reservation">Rezervace</option>
          <option value="feedback">Zpětná vazba</option>
          <option value="complaint">Reklamace</option>
        </select>
      </div>

      <div>
        <Textarea
          placeholder="Vaše zpráva *"
          rows={5}
          value={messageText}
          onChange={(e) => setMessageText(e.target.value)}
          required
        />
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Odesílání..." : "Odeslat dotaz"}
      </Button>
    </form>
  );
}
