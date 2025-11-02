import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, Database } from "lucide-react";

export default function AdminImport() {
  const [password, setPassword] = useState("");

  const importMutation = useMutation({
    mutationFn: async (password: string) => {
      const res = await apiRequest("POST", "/api/admin/import-data", { password });
      return await res.json();
    },
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password) return;
    importMutation.mutate(password);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex items-center gap-2">
            <Database className="h-6 w-6 text-primary" />
            <CardTitle className="text-2xl">Importação de Dados</CardTitle>
          </div>
          <CardDescription>
            Importe as 1125 áreas de roçagem para o banco de dados
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!importMutation.isSuccess ? (
            <form onSubmit={handleImport} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="password">Senha de Administrador</Label>
                <Input
                  id="password"
                  data-testid="input-admin-password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={importMutation.isPending}
                  autoFocus
                />
                <p className="text-xs text-muted-foreground">
                  Senha padrão: <code className="font-mono bg-muted px-1 py-0.5 rounded">cmtu2025</code>
                </p>
              </div>

              {importMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription data-testid="text-error-message">
                    {(importMutation.error as any)?.message || "Erro ao importar dados. Verifique a senha."}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                data-testid="button-import"
                className="w-full"
                disabled={!password || importMutation.isPending}
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando 1125 áreas...
                  </>
                ) : (
                  <>
                    <Database className="mr-2 h-4 w-4" />
                    Importar 1125 Áreas
                  </>
                )}
              </Button>

              <div className="pt-2 border-t text-xs text-muted-foreground space-y-1">
                <p>📄 O arquivo CSV já está incluído no projeto</p>
                <p>⚠️ Esta ação substitui todos os dados atuais</p>
              </div>
            </form>
          ) : (
            <Alert className="border-green-500 bg-green-50 dark:bg-green-950">
              <CheckCircle2 className="h-4 w-4 text-green-600" />
              <AlertDescription data-testid="text-success-message" className="text-green-800 dark:text-green-200">
                <div className="space-y-2">
                  <p className="font-semibold">
                    {(importMutation.data as any)?.message || "Importação concluída!"}
                  </p>
                  <p className="text-sm">
                    ✅ {(importMutation.data as any)?.inserted || 0} áreas importadas
                  </p>
                  {(importMutation.data as any)?.skipped > 0 && (
                    <p className="text-sm">
                      ⚠️ {(importMutation.data as any)?.skipped} linhas ignoradas
                    </p>
                  )}
                  <p className="text-sm mt-4">
                    Agora você pode acessar o dashboard e ver os 1125 pontos verdes no mapa!
                  </p>
                  <Button
                    data-testid="button-go-dashboard"
                    onClick={() => window.location.href = "/"}
                    className="w-full mt-2"
                  >
                    Ir para o Dashboard
                  </Button>
                </div>
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
