"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function SettingsTab() {
  const { data: session, update } = useSession();
  const user = session?.user;

  const [username, setUsername] = useState(user?.username ?? "");
  const [name, setName] = useState(user?.name ?? "");
  const [bio, setBio] = useState("");
  const [locale, setLocale] = useState("en");
  const [image, setImage] = useState(user?.image ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/user/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, name, bio, locale, image }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage({ type: "error", text: data.error ?? "Failed to save" });
        setLoading(false);
        return;
      }

      // Update session
      await update({ ...session, user: { ...session?.user, name: data.name, username: data.username } });
      setMessage({ type: "success", text: "Settings saved successfully" });
    } catch {
      setMessage({ type: "error", text: "Failed to save settings" });
    }

    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-lg flex flex-col gap-5">
      <Input
        label="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="your-username"
        required
      />

      <Input
        label="Display Name"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Your Name"
      />

      <Textarea
        label="Bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
        placeholder="Tell the community about yourself..."
        charCount={{ current: bio.length, max: 500 }}
      />

      <Input
        label="Avatar URL"
        value={image}
        onChange={(e) => setImage(e.target.value)}
        placeholder="https://..."
      />

      <Select
        label="Preferred Language"
        value={locale}
        onChange={(e) => setLocale(e.target.value)}
        options={[
          { value: "en", label: "English" },
          { value: "es", label: "Español" },
        ]}
      />

      {message && (
        <p
          className={
            message.type === "success" ? "text-sm text-green-600" : "text-sm text-red-500"
          }
        >
          {message.text}
        </p>
      )}

      <Button type="submit" disabled={loading} className="self-start">
        {loading ? "Saving..." : "Save Settings"}
      </Button>
    </form>
  );
}
