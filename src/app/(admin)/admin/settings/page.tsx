"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import {
  Settings,
  ShieldCheck,
  Copy,
  ExternalLink,
  CheckCircle,
  XCircle,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function AdminSettingsPage() {
  const [saving, setSaving] = useState(false);
  const [googleId, setGoogleId] = useState("");
  const [googleSecret, setGoogleSecret] = useState("");
  const [microsoftId, setMicrosoftId] = useState("");
  const [microsoftSecret, setMicrosoftSecret] = useState("");
  const [microsoftTenant, setMicrosoftTenant] = useState("common");

  const [envStatus, setEnvStatus] = useState<{
    google: boolean;
    microsoft: boolean;
    authSecret: boolean;
    dbConnected: boolean;
  }>({ google: false, microsoft: false, authSecret: false, dbConnected: false });

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((r) => r.json())
      .then((data) => {
        if (data.status) setEnvStatus(data.status);
        if (data.config) {
          // Show masked values as placeholders
          if (data.config.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID) {
            setMicrosoftTenant(data.config.AUTH_MICROSOFT_ENTRA_ID_TENANT_ID);
          }
        }
      })
      .catch(() => {});
  }, []);

  async function handleSaveOAuth() {
    setSaving(true);
    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          AUTH_GOOGLE_ID: googleId,
          AUTH_GOOGLE_SECRET: googleSecret,
          AUTH_MICROSOFT_ENTRA_ID_ID: microsoftId,
          AUTH_MICROSOFT_ENTRA_ID_SECRET: microsoftSecret,
          AUTH_MICROSOFT_ENTRA_ID_TENANT_ID: microsoftTenant,
        }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(data.message || "Settings saved. Restart the container to apply.");
      } else {
        toast.error(data.error || "Failed to save");
      }
    } catch {
      toast.error("Failed to save settings");
    } finally {
      setSaving(false);
    }
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://inframitra.com";

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Platform Settings</h1>
        <p className="text-muted-foreground">
          Configure OAuth providers, environment, and platform settings.
        </p>
      </div>

      {/* System Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShieldCheck className="size-5" />
            System Status
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            <div className="flex items-center gap-2 rounded-lg border p-3">
              {envStatus.dbConnected ? (
                <CheckCircle className="size-4 text-emerald-600" />
              ) : (
                <XCircle className="size-4 text-red-500" />
              )}
              <span className="text-sm">Database</span>
              <Badge variant={envStatus.dbConnected ? "default" : "destructive"} className="ml-auto text-xs">
                {envStatus.dbConnected ? "Connected" : "Error"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              {envStatus.authSecret ? (
                <CheckCircle className="size-4 text-emerald-600" />
              ) : (
                <XCircle className="size-4 text-red-500" />
              )}
              <span className="text-sm">Auth Secret</span>
              <Badge variant={envStatus.authSecret ? "default" : "destructive"} className="ml-auto text-xs">
                {envStatus.authSecret ? "Set" : "Missing"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              {envStatus.google ? (
                <CheckCircle className="size-4 text-emerald-600" />
              ) : (
                <XCircle className="size-4 text-zinc-400" />
              )}
              <span className="text-sm">Google OAuth</span>
              <Badge variant={envStatus.google ? "default" : "secondary"} className="ml-auto text-xs">
                {envStatus.google ? "Active" : "Not Set"}
              </Badge>
            </div>
            <div className="flex items-center gap-2 rounded-lg border p-3">
              {envStatus.microsoft ? (
                <CheckCircle className="size-4 text-emerald-600" />
              ) : (
                <XCircle className="size-4 text-zinc-400" />
              )}
              <span className="text-sm">Microsoft OAuth</span>
              <Badge variant={envStatus.microsoft ? "default" : "secondary"} className="ml-auto text-xs">
                {envStatus.microsoft ? "Active" : "Not Set"}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google OAuth Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="size-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
            </svg>
            Google Sign-In Setup
          </CardTitle>
          <CardDescription>
            Allow customers to sign in with their Google/Gmail account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 space-y-2">
            <h4 className="font-medium text-sm text-blue-800 dark:text-blue-300">Setup Instructions:</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://console.cloud.google.com/apis/credentials" target="_blank" rel="noopener noreferrer" className="underline font-medium">Google Cloud Console <ExternalLink className="inline size-3" /></a></li>
              <li>Create a new project (or select existing)</li>
              <li>Go to <strong>APIs &amp; Services → Credentials → Create OAuth Client ID</strong></li>
              <li>Application type: <strong>Web application</strong></li>
              <li>Add authorized redirect URI (copy below)</li>
              <li>Copy the <strong>Client ID</strong> and <strong>Client Secret</strong> and paste below</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label>Redirect URI (copy this to Google Console)</Label>
            <div className="flex items-center gap-2">
              <Input value={`${baseUrl}/api/auth/callback/google`} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}/api/auth/callback/google`);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="googleId">Google Client ID</Label>
              <Input
                id="googleId"
                value={googleId}
                onChange={(e) => setGoogleId(e.target.value)}
                placeholder="xxxx.apps.googleusercontent.com"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="googleSecret">Google Client Secret</Label>
              <Input
                id="googleSecret"
                type="password"
                value={googleSecret}
                onChange={(e) => setGoogleSecret(e.target.value)}
                placeholder="GOCSPX-xxxxxxxxxxxx"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Microsoft OAuth Setup */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg className="size-5" viewBox="0 0 21 21">
              <rect x="1" y="1" width="9" height="9" fill="#F25022" />
              <rect x="11" y="1" width="9" height="9" fill="#7FBA00" />
              <rect x="1" y="11" width="9" height="9" fill="#00A4EF" />
              <rect x="11" y="11" width="9" height="9" fill="#FFB900" />
            </svg>
            Microsoft 365 Sign-In Setup
          </CardTitle>
          <CardDescription>
            Allow customers to sign in with their Microsoft/Office 365 account.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="rounded-lg bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/50 p-4 space-y-2">
            <h4 className="font-medium text-sm text-blue-800 dark:text-blue-300">Setup Instructions:</h4>
            <ol className="text-sm text-blue-700 dark:text-blue-400 space-y-1 list-decimal list-inside">
              <li>Go to <a href="https://portal.azure.com/#blade/Microsoft_AAD_RegisteredApps/ApplicationsListBlade" target="_blank" rel="noopener noreferrer" className="underline font-medium">Azure Portal → App Registrations <ExternalLink className="inline size-3" /></a></li>
              <li>Click <strong>New Registration</strong></li>
              <li>Name: <strong>InfraMitra</strong></li>
              <li>Supported account types: <strong>Accounts in any organizational directory + personal Microsoft accounts</strong></li>
              <li>Redirect URI: select <strong>Web</strong> and paste the URI below</li>
              <li>Go to <strong>Certificates &amp; secrets → New client secret</strong> → Copy the <strong>Value</strong></li>
              <li>Copy <strong>Application (client) ID</strong> from Overview page</li>
            </ol>
          </div>

          <div className="space-y-2">
            <Label>Redirect URI (copy this to Azure Portal)</Label>
            <div className="flex items-center gap-2">
              <Input value={`${baseUrl}/api/auth/callback/microsoft-entra-id`} readOnly className="font-mono text-sm" />
              <Button
                variant="outline"
                size="icon"
                onClick={() => {
                  navigator.clipboard.writeText(`${baseUrl}/api/auth/callback/microsoft-entra-id`);
                  toast.success("Copied to clipboard");
                }}
              >
                <Copy className="size-4" />
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="msId">Application (Client) ID</Label>
              <Input
                id="msId"
                value={microsoftId}
                onChange={(e) => setMicrosoftId(e.target.value)}
                placeholder="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="msSecret">Client Secret Value</Label>
              <Input
                id="msSecret"
                type="password"
                value={microsoftSecret}
                onChange={(e) => setMicrosoftSecret(e.target.value)}
                placeholder="xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="msTenant">Tenant ID</Label>
            <Input
              id="msTenant"
              value={microsoftTenant}
              onChange={(e) => setMicrosoftTenant(e.target.value)}
              placeholder="common"
            />
            <p className="text-xs text-muted-foreground">
              Use &quot;common&quot; to allow any Microsoft account (personal + work). Use a specific tenant ID to restrict to one organization.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Save & Warning */}
      <Card className="border-amber-200 dark:border-amber-800/50">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertTriangle className="size-5 text-amber-600 dark:text-amber-400 mt-0.5 shrink-0" />
            <div className="flex-1">
              <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
                Important: Container restart required
              </p>
              <p className="text-xs text-amber-700 dark:text-amber-400 mt-1">
                After saving, you need to update the environment variables in <code className="bg-amber-100 dark:bg-amber-900/50 px-1 rounded">docker-compose.yml</code> on the server and restart the container. The values below will be saved as a reference but won&apos;t take effect until the container is restarted with the new environment variables.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSaveOAuth} disabled={saving} size="lg">
          {saving && <Loader2 className="mr-2 size-4 animate-spin" />}
          Save OAuth Configuration
        </Button>
      </div>

      <Separator />

      {/* Docker Compose Environment Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="size-5" />
            Docker Environment Reference
          </CardTitle>
          <CardDescription>
            Add these to your docker-compose.yml under the web service environment section.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <pre className="rounded-lg bg-zinc-950 text-zinc-100 p-4 text-sm overflow-x-auto font-mono">
{`environment:
  # ... existing vars ...
  - AUTH_GOOGLE_ID=${googleId || "your-google-client-id"}
  - AUTH_GOOGLE_SECRET=${googleSecret || "your-google-client-secret"}
  - AUTH_MICROSOFT_ENTRA_ID_ID=${microsoftId || "your-microsoft-client-id"}
  - AUTH_MICROSOFT_ENTRA_ID_SECRET=${microsoftSecret || "your-microsoft-secret"}
  - AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=${microsoftTenant || "common"}`}
          </pre>
          <Button
            variant="outline"
            className="mt-3"
            onClick={() => {
              const text = `  - AUTH_GOOGLE_ID=${googleId}\n  - AUTH_GOOGLE_SECRET=${googleSecret}\n  - AUTH_MICROSOFT_ENTRA_ID_ID=${microsoftId}\n  - AUTH_MICROSOFT_ENTRA_ID_SECRET=${microsoftSecret}\n  - AUTH_MICROSOFT_ENTRA_ID_TENANT_ID=${microsoftTenant}`;
              navigator.clipboard.writeText(text);
              toast.success("Copied to clipboard");
            }}
          >
            <Copy className="mr-2 size-4" />
            Copy Environment Variables
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
