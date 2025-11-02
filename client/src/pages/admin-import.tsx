import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertCircle, Loader2, Database, Download, Upload } from "lucide-react";

export default function AdminImport() {
  const [password, setPassword] = useState("");
  const [csvFile, setCsvFile] = useState<File | null>(null);

  const importMutation = useMutation({
    mutationFn: async ({ password, file }: { password: string; file: File }) => {
      const formData = new FormData();
      formData.append('password', password);
      formData.append('csvFile', file);

      const res = await fetch('/api/admin/import-data', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Erro ao importar dados');
      }

      return await res.json();
    },
  });

  const handleImport = (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || !csvFile) return;
    importMutation.mutate({ password, file: csvFile });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCsvFile(file);
    }
  };

  const handleDownload = async () => {
    try {
      const res = await fetch('/api/admin/download-csv');
      if (!res.ok) throw new Error('Erro ao baixar arquivo');
      
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'areas_londrina.csv';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('Erro ao baixar CSV:', error);
    }
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
            Importe as 1125 áreas de roçagem para o banco de produção
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {!importMutation.isSuccess ? (
            <form onSubmit={handleImport} className="space-y-4">
              <div className="space-y-2">
                <Label>Passo 1: Baixar CSV do Servidor</Label>
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleDownload}
                  className="w-full"
                  data-testid="button-download-csv"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Baixar areas_londrina.csv
                </Button>
                <p className="text-xs text-muted-foreground">
                  Baixe o arquivo CSV do ambiente de desenvolvimento
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="csvFile">Passo 2: Selecionar Arquivo CSV</Label>
                <Input
                  id="csvFile"
                  data-testid="input-csv-file"
                  type="file"
                  accept=".csv"
                  onChange={handleFileChange}
                  disabled={importMutation.isPending}
                />
                {csvFile && (
                  <p className="text-xs text-green-600 dark:text-green-400">
                    ✓ Arquivo selecionado: {csvFile.name}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Passo 3: Senha de Administrador</Label>
                <Input
                  id="password"
                  data-testid="input-admin-password"
                  type="password"
                  placeholder="Digite a senha"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={importMutation.isPending}
                />
                <p className="text-xs text-muted-foreground">
                  Senha padrão: <code className="font-mono">cmtu2025</code>
                </p>
              </div>

              {importMutation.isError && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription data-testid="text-error-message">
                    {(importMutation.error as any)?.message || "Erro ao importar dados. Verifique a senha e o arquivo."}
                  </AlertDescription>
                </Alert>
              )}

              <Button
                type="submit"
                data-testid="button-import"
                className="w-full"
                disabled={!password || !csvFile || importMutation.isPending}
              >
                {importMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Importando...
                  </>
                ) : (
                  <>
                    <Upload className="mr-2 h-4 w-4" />
                    Importar 1125 Áreas
                  </>
                )}
              </Button>
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

          <div className="pt-4 border-t">
            <p className="text-xs text-muted-foreground">
              ⚠️ <strong>Importante:</strong> Esta ação irá substituir todos os dados atuais do banco de produção.
              Use apenas uma vez para popular o banco inicial.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
