# Instruções para Importar Dados em Produção

## ✅ Sistema de Importação Implementado

Foi criado um sistema web simples e seguro para importar as 1125 áreas de serviço no banco de produção, sem precisar acessar o Database Pane.

---

## 📋 Passo a Passo para Uso em Produção

### 1. Publicar o Aplicativo

Primeiro, você precisa publicar (deploy) o aplicativo no Replit:

1. Clique no botão **"Deploy"** no Replit
2. Aguarde a publicação ser concluída
3. Anote a URL de produção (será algo como `https://seu-app.replit.app`)

### 2. Acessar a Página de Importação

1. Abra seu navegador e acesse: `https://seu-app.replit.app/admin/import`
2. Você verá uma página simples com:
   - Um campo de senha
   - Um botão "Importar 1125 Áreas"
   - Instruções sobre a senha padrão

### 3. Executar a Importação

1. Digite a senha padrão: **cmtu2025**
2. Clique em **"Importar 1125 Áreas"**
3. Aguarde (pode levar até 30 segundos)
4. Você verá uma mensagem de sucesso informando:
   - Quantas áreas foram importadas
   - Quantas foram ignoradas (se já existiam)
5. Clique em **"Ir para o Dashboard"** para verificar os dados

### 4. Verificar a Importação

No dashboard principal:

1. Verifique se o mapa mostra **1125 marcadores verdes**
2. Use os filtros "Lote 1" e "Lote 2" para confirmar:
   - Lote 1: ~579 áreas
   - Lote 2: ~546 áreas
3. Teste a busca com alguns nomes de áreas

---

## 🔒 Segurança

### Senha Personalizada (Opcional mas Recomendado)

Para maior segurança, você pode definir uma senha personalizada:

1. No Replit, vá em **Secrets** (cadeado no painel lateral)
2. Adicione uma nova secret:
   - **Nome**: `ADMIN_IMPORT_PASSWORD`
   - **Valor**: Sua senha personalizada (exemplo: `londrina@2025!`)
3. Salve e reinicie o aplicativo

Agora use sua senha personalizada em vez de "cmtu2025".

### ⚠️ IMPORTANTE: Remover o Sistema Após Uso

**Por segurança, este sistema de importação deve ser removido após o primeiro uso!**

Quando terminar a importação em produção, me avise que eu removo:
- O endpoint `/api/admin/import-data`
- A página `/admin/import`
- O arquivo CSV do servidor

Isso garante que ninguém possa executar a importação novamente sem autorização.

---

## ❓ Resolução de Problemas

### Erro de Senha Incorreta
- Verifique se digitou corretamente
- Se definiu senha personalizada, use ela (não a padrão)

### Erro ao Importar
- Verifique se o banco de produção está ativo
- Tente novamente em alguns minutos

### Nenhum Marcador no Mapa
- Aguarde alguns segundos para o mapa carregar
- Recarregue a página (F5)
- Verifique se não há filtros ativos

### Importação Parcial
- O sistema não duplica áreas
- Se já existiam dados, mostrará quantas foram ignoradas
- Isso é normal e seguro

---

## 📊 O Que é Importado

A importação adiciona ao banco:

1. **1125 Áreas de Serviço**
   - Lote 1: 579 áreas (Giro Zero)
   - Lote 2: 546 áreas (JGR Zeladoria)
   - Cada área com: nome, lote, tipo, tamanho, polígono geográfico

2. **Configurações de Produção**
   - Lote 1: 110.000 m²/dia
   - Lote 2: 80.000 m²/dia

3. **6 Equipes Padrão**
   - 3 equipes de roçagem (Lote 1)
   - 3 equipes de roçagem (Lote 2)

---

## 🎯 Próximos Passos

Após importação bem-sucedida:

1. ✅ Verifique os dados no dashboard
2. ✅ Teste os filtros e a busca
3. ✅ Me avise para remover o sistema de importação
4. ✅ Comece a usar o sistema normalmente!

---

**Dúvidas?** É só me avisar que eu ajudo!
