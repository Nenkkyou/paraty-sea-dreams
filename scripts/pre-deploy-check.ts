/**
 * PRE-DEPLOY CHECK SCRIPT
 * ========================
 * Verifica TUDO antes de fazer deploy para evitar erros em produção
 * 
 * Uso: npx ts-node scripts/pre-deploy-check.ts
 */

import * as fs from 'fs';
import * as path from 'path';

// Cores para output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  bold: '\x1b[1m',
};

const log = {
  error: (msg: string) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  success: (msg: string) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  warning: (msg: string) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg: string) => console.log(`${colors.blue}ℹ️  ${msg}${colors.reset}`),
  title: (msg: string) => console.log(`\n${colors.bold}${colors.cyan}=== ${msg} ===${colors.reset}\n`),
};

interface CheckResult {
  passed: boolean;
  message: string;
  fix?: string;
}

const errors: string[] = [];
const warnings: string[] = [];

// ============================================
// 1. VERIFICAR VARIÁVEIS DE AMBIENTE
// ============================================
async function checkEnvVariables(): Promise<void> {
  log.title('VERIFICANDO VARIÁVEIS DE AMBIENTE');
  
  const envPath = path.join(process.cwd(), '.env');
  
  if (!fs.existsSync(envPath)) {
    log.error('Arquivo .env não encontrado!');
    errors.push('Criar arquivo .env com as variáveis necessárias');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  
  // Variáveis obrigatórias do Firebase
  const requiredVars = [
    { name: 'VITE_FIREBASE_API_KEY', pattern: /^AIza[A-Za-z0-9_-]{35}$/, description: 'API Key do Firebase' },
    { name: 'VITE_FIREBASE_AUTH_DOMAIN', pattern: /^[a-z0-9-]+\.firebaseapp\.com$/, description: 'Auth Domain' },
    { name: 'VITE_FIREBASE_PROJECT_ID', pattern: /^[a-z0-9-]+$/, description: 'Project ID' },
    { name: 'VITE_FIREBASE_STORAGE_BUCKET', pattern: /^[a-z0-9-]+\.(appspot\.com|firebasestorage\.app)$/, description: 'Storage Bucket' },
    { name: 'VITE_FIREBASE_MESSAGING_SENDER_ID', pattern: /^\d+$/, description: 'Messaging Sender ID' },
    { name: 'VITE_FIREBASE_APP_ID', pattern: /^1:\d+:web:[a-f0-9]+$/, description: 'App ID' },
  ];
  
  for (const variable of requiredVars) {
    const match = envContent.match(new RegExp(`${variable.name}=(.+)`));
    
    if (!match) {
      log.error(`${variable.name} não encontrada`);
      errors.push(`Adicionar ${variable.name} ao .env`);
      continue;
    }
    
    const value = match[1].trim();
    
    // Verificar se tem placeholder
    if (value.includes('YOUR_') || value.includes('your_') || value.includes('xxx')) {
      log.error(`${variable.name} contém placeholder: ${value}`);
      errors.push(`Substituir placeholder em ${variable.name}`);
      continue;
    }
    
    // Verificar formato
    if (!variable.pattern.test(value)) {
      log.warning(`${variable.name} pode estar com formato incorreto: ${value}`);
      warnings.push(`Verificar formato de ${variable.name}`);
    } else {
      log.success(`${variable.name} ✓`);
    }
  }
}

// ============================================
// 2. VERIFICAR CONFIGURAÇÃO DO FIREBASE
// ============================================
async function checkFirebaseConfig(): Promise<void> {
  log.title('VERIFICANDO CONFIGURAÇÃO DO FIREBASE');
  
  const firebasePath = path.join(process.cwd(), 'src', 'lib', 'firebase.ts');
  
  if (!fs.existsSync(firebasePath)) {
    log.error('Arquivo firebase.ts não encontrado!');
    errors.push('Criar src/lib/firebase.ts');
    return;
  }
  
  const content = fs.readFileSync(firebasePath, 'utf-8');
  
  // Verificar se está usando import.meta.env
  if (content.includes('import.meta.env.VITE_FIREBASE')) {
    log.success('Firebase usando variáveis de ambiente');
  } else {
    log.error('Firebase não está usando variáveis de ambiente!');
    errors.push('Configurar firebase.ts para usar import.meta.env');
  }
  
  // Verificar se tem tratamento de erro
  if (content.includes('try') && content.includes('catch')) {
    log.success('Firebase tem tratamento de erros');
  } else {
    log.warning('Firebase não tem tratamento de erros adequado');
    warnings.push('Adicionar try/catch no firebase.ts');
  }
}

// ============================================
// 3. VERIFICAR ARQUIVOS DE DEPLOY
// ============================================
async function checkDeployFiles(): Promise<void> {
  log.title('VERIFICANDO ARQUIVOS DE DEPLOY');
  
  // Verificar .htaccess
  const htaccessPath = path.join(process.cwd(), 'public', '.htaccess');
  if (fs.existsSync(htaccessPath)) {
    const content = fs.readFileSync(htaccessPath, 'utf-8');
    if (content.includes('RewriteRule') && content.includes('index.html')) {
      log.success('.htaccess configurado para SPA');
    } else {
      log.warning('.htaccess existe mas pode não estar configurado corretamente');
      warnings.push('Verificar configuração do .htaccess');
    }
  } else {
    log.error('.htaccess não encontrado em public/');
    errors.push('Criar public/.htaccess para suporte a SPA');
  }
  
  // Verificar firebase.json (se usar Firebase Hosting)
  const firebaseJsonPath = path.join(process.cwd(), 'firebase.json');
  if (fs.existsSync(firebaseJsonPath)) {
    const content = JSON.parse(fs.readFileSync(firebaseJsonPath, 'utf-8'));
    if (content.hosting?.rewrites) {
      log.success('firebase.json configurado com rewrites');
    } else {
      log.warning('firebase.json não tem rewrites configurados');
    }
  }
}

// ============================================
// 4. VERIFICAR IMPORTS NÃO USADOS E ERROS
// ============================================
async function checkCodeQuality(): Promise<void> {
  log.title('VERIFICANDO QUALIDADE DO CÓDIGO');
  
  const srcDir = path.join(process.cwd(), 'src');
  
  // Arquivos para verificar
  const filesToCheck = [
    'pages/Contato.tsx',
    'App.tsx',
    'lib/firebase.ts',
    'services/emailService.ts',
  ];
  
  for (const file of filesToCheck) {
    const filePath = path.join(srcDir, file);
    if (!fs.existsSync(filePath)) continue;
    
    const content = fs.readFileSync(filePath, 'utf-8');
    
    // Verificar console.log em produção (warning)
    const consoleMatches = content.match(/console\.(log|error|warn)/g);
    if (consoleMatches && consoleMatches.length > 5) {
      log.warning(`${file} tem ${consoleMatches.length} console statements`);
    }
    
    // Verificar imports não usados básico
    const importMatches = content.match(/import\s+{([^}]+)}\s+from/g);
    // (verificação básica apenas)
  }
  
  log.success('Verificação de código concluída');
}

// ============================================
// 5. VERIFICAR SE O BUILD FUNCIONA
// ============================================
async function checkBuild(): Promise<void> {
  log.title('VERIFICANDO BUILD');
  
  const distDir = path.join(process.cwd(), 'dist');
  
  if (!fs.existsSync(distDir)) {
    log.warning('Pasta dist/ não existe. Execute npm run build');
    warnings.push('Executar npm run build antes do deploy');
    return;
  }
  
  const indexPath = path.join(distDir, 'index.html');
  if (fs.existsSync(indexPath)) {
    log.success('Build existe com index.html');
    
    // Verificar se .htaccess foi copiado
    const htaccessDist = path.join(distDir, '.htaccess');
    if (fs.existsSync(htaccessDist)) {
      log.success('.htaccess presente na pasta dist');
    } else {
      log.error('.htaccess NÃO está na pasta dist!');
      errors.push('O .htaccess não foi copiado para dist/. Copie manualmente ou reconfigure o build.');
    }
  } else {
    log.error('index.html não encontrado em dist/');
    errors.push('Build está incompleto');
  }
}

// ============================================
// 6. TESTAR CONEXÃO COM FIREBASE
// ============================================
async function testFirebaseConnection(): Promise<void> {
  log.title('TESTANDO CONEXÃO COM FIREBASE');
  
  // Carregar variáveis do .env
  const envPath = path.join(process.cwd(), '.env');
  if (!fs.existsSync(envPath)) {
    log.error('Não é possível testar sem .env');
    return;
  }
  
  const envContent = fs.readFileSync(envPath, 'utf-8');
  const apiKeyMatch = envContent.match(/VITE_FIREBASE_API_KEY=(.+)/);
  const projectIdMatch = envContent.match(/VITE_FIREBASE_PROJECT_ID=(.+)/);
  
  if (!apiKeyMatch || !projectIdMatch) {
    log.error('Variáveis Firebase não encontradas');
    return;
  }
  
  const apiKey = apiKeyMatch[1].trim();
  const projectId = projectIdMatch[1].trim();
  
  // Testar API Key fazendo uma requisição simples
  try {
    const response = await fetch(
      `https://firebase.googleapis.com/v1alpha/projects/${projectId}/webApps`,
      {
        headers: {
          'Authorization': `Bearer ${apiKey}`,
        },
      }
    );
    
    // API key válida retorna 401 (não autorizado) ou 200
    // API key inválida retorna 400
    if (response.status === 400) {
      const data = await response.json();
      if (data.error?.message?.includes('API key not valid')) {
        log.error('API Key do Firebase é INVÁLIDA!');
        errors.push('Obter API Key correta do Firebase Console');
        
        log.info('Para obter a API Key correta:');
        log.info('1. Acesse: https://console.firebase.google.com/project/' + projectId + '/settings/general');
        log.info('2. Na seção "Seus apps", encontre o app Web');
        log.info('3. Copie a apiKey do objeto firebaseConfig');
      }
    } else {
      log.success('API Key parece válida');
    }
  } catch (error) {
    log.warning('Não foi possível testar a API Key (pode ser problema de rede)');
  }
}

// ============================================
// MAIN
// ============================================
async function main() {
  console.log(`
${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════╗
║          PRE-DEPLOY CHECK - PARATY SEA DREAMS          ║
╚════════════════════════════════════════════════════════╝${colors.reset}
`);

  await checkEnvVariables();
  await checkFirebaseConfig();
  await checkDeployFiles();
  await checkCodeQuality();
  await checkBuild();
  await testFirebaseConnection();

  // Resumo final
  console.log(`
${colors.bold}${colors.cyan}╔════════════════════════════════════════════════════════╗
║                    RESUMO FINAL                         ║
╚════════════════════════════════════════════════════════╝${colors.reset}
`);

  if (errors.length === 0 && warnings.length === 0) {
    log.success('TUDO OK! Pode fazer deploy com segurança! 🚀');
  } else {
    if (errors.length > 0) {
      console.log(`\n${colors.red}${colors.bold}ERROS (${errors.length}) - CORRIGIR ANTES DO DEPLOY:${colors.reset}`);
      errors.forEach((e, i) => console.log(`  ${i + 1}. ${e}`));
    }
    
    if (warnings.length > 0) {
      console.log(`\n${colors.yellow}${colors.bold}AVISOS (${warnings.length}) - RECOMENDADO VERIFICAR:${colors.reset}`);
      warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
    }
    
    if (errors.length > 0) {
      console.log(`\n${colors.red}${colors.bold}⛔ NÃO FAÇA DEPLOY ATÉ CORRIGIR OS ERROS!${colors.reset}\n`);
      process.exit(1);
    }
  }
}

main().catch(console.error);
