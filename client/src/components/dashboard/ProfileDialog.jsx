import { useEffect, useState } from "react";
import { Camera, LoaderCircle, UserRound } from "lucide-react";

import { profileService } from "@/services/profile.service";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ProfileDialog({
  open,
  onOpenChange,
  user,
  onProfileUpdated,
}) {
  const [profile, setProfile] = useState(user);
  const [displayName, setDisplayName] = useState("");
  const [bio, setBio] = useState("");

  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    if (!open) return;

    let cancelled = false;

    const loadProfile = async () => {
      setLoading(true);
      setError("");
      setSuccess("");

      try {
        const data = await profileService.getProfile();

        if (cancelled) return;

        const fetchedProfile = data.profile;

        setProfile(fetchedProfile);
        setDisplayName(fetchedProfile.displayName || "");
        setBio(fetchedProfile.bio || "");
      } catch (err) {
        if (!cancelled) {
          setError(err.message);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadProfile();

    return () => {
      cancelled = true;
    };
  }, [open]);

  const handleSave = async (event) => {
    event.preventDefault();

    setError("");
    setSuccess("");

    const trimmedName = displayName.trim();
    const trimmedBio = bio.trim();

    if (!trimmedName) {
      setError("Display name cannot be empty.");
      return;
    }

    if (trimmedName.length > 50 || trimmedBio.length > 150) {
      setError("Please check the character limits.");
      return;
    }

    const updates = {};

    if (trimmedName !== profile.displayName) {
      updates.displayName = trimmedName;
    }

    if (trimmedBio !== (profile.bio || "")) {
      updates.bio = trimmedBio;
    }

    if (Object.keys(updates).length === 0) {
      setSuccess("Your profile is already up to date.");
      return;
    }

    setSaving(true);

    try {
      const data = await profileService.updateProfile(updates);

      setProfile(data.profile);
      setDisplayName(data.profile.displayName);
      setBio(data.profile.bio || "");

      onProfileUpdated?.(data.profile);
      setSuccess("Profile updated successfully.");
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto border-app-border bg-surface sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-ink">
            Your Profile
          </DialogTitle>

          <DialogDescription className="text-text-secondary">
            Manage your personal information.
          </DialogDescription>
        </DialogHeader>

        {loading ? (
          <div className="flex min-h-60 items-center justify-center">
            <LoaderCircle
              size={24}
              className="animate-spin text-primary-hover"
            />
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-5">
            {/* Profile Picture */}
            <div className="flex flex-col items-center gap-2 py-2">
              <div className="relative">
                <Avatar className="size-20">
                  <AvatarImage
                    src={profile?.avatarUrl || undefined}
                    alt={profile?.displayName || "Profile"}
                  />

                  <AvatarFallback className="bg-surface-secondary text-ink">
                    <UserRound size={30} />
                  </AvatarFallback>
                </Avatar>

                <div className="absolute bottom-0 right-0 grid size-7 place-items-center rounded-full border-2 border-surface bg-primary text-ink">
                  <Camera size={13} />
                </div>
              </div>

              <span className="text-xs text-text-secondary">
                Profile picture upload coming next
              </span>
            </div>

            {/* Username */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Username
              </label>

              <Input
                value={profile?.username || ""}
                readOnly
                className="h-10 border-app-border bg-surface-secondary text-text-secondary"
              />

              <p className="text-[11px] text-text-muted">
                Your username cannot be changed.
              </p>
            </div>

            {/* Display Name */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-display-name"
                className="text-xs font-medium text-text-secondary"
              >
                Display name
              </label>

              <Input
                id="profile-display-name"
                value={displayName}
                onChange={(event) => setDisplayName(event.target.value)}
                maxLength={50}
                placeholder="Your display name"
                className="h-10 border-app-border bg-surface"
              />

              <p className="text-right text-[11px] text-text-muted">
                {displayName.length}/50
              </p>
            </div>

            {/* Email */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium text-text-secondary">
                Registered email
              </label>

              <Input
                value={profile?.email || ""}
                readOnly
                className="h-10 border-app-border bg-surface-secondary text-text-secondary"
              />

              <p className="text-[11px] text-text-muted">
                Your registered email address.
              </p>
            </div>

            {/* Bio */}
            <div className="space-y-1.5">
              <label
                htmlFor="profile-bio"
                className="text-xs font-medium text-text-secondary"
              >
                About you
              </label>

              <textarea
                id="profile-bio"
                value={bio}
                onChange={(event) => setBio(event.target.value)}
                maxLength={150}
                rows={3}
                placeholder="Tell people a little about yourself..."
                className="w-full resize-none rounded-lg border border-app-border bg-surface px-3 py-2.5 text-sm text-ink outline-none transition placeholder:text-text-muted focus:border-primary"
              />

              <p className="text-right text-[11px] text-text-muted">
                {bio.length}/150
              </p>
            </div>

            {error && (
              <p role="alert" className="text-xs text-red-600">
                {error}
              </p>
            )}

            {success && (
              <p role="status" className="text-xs text-green-700">
                {success}
              </p>
            )}

            <DialogFooter className="border-app-border bg-surface-secondary/50">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={saving}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={saving || loading}
                className="bg-primary text-ink hover:bg-primary-hover"
              >
                {saving && <LoaderCircle size={15} className="animate-spin" />}
                {saving ? "Saving..." : "Save changes"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
