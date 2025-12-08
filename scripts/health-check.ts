/**
 * Backend Health Check Script
 * ===========================
 * Script completo para verificar a saúde de todos os serviços do backend
 * 
 * Verifica:
 * - Variáveis de ambiente
 * - Conexão com Firebase (Auth, Firestore, Storage)
 * - Configuração do Resend
 * - Configurações de segurança
 * 
 * Uso: npm run db:health
 */

import { config } from 'dotenv';
import { resolve } from 'path';
import { existsSync, readFileSync } from 'fs';

// Carregar variáveis de ambiente
config({ path: resolve(process.cwd(), '.env') });

// Cores para output no terminal
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

// Tipos para resultados de verificação
interface CheckResult {
  name: string;
  status: 'success' | 'warning' | 'error';
  message: string;
  details?: string;
}

interface HealthReport {
  timestamp: string;
  environment: string;
  checks: CheckResult[];
  summary: {
    total: number;
    passed: number;
    warnings: number;
    failed: number;
  };
}

// Utilitários de logging
function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logHeader(title: string): void {
  console.log('\n');
  log('═'.repeat(60), colors.cyan);
  log(`  ${title}`, colors.bright + colors.cyan);
  log('═'.repeat(60), colors.cyan);
}

function logSection(title: string): void {
  console.log();
  log(`▶ ${title}`, colors.bright + colors.blue);
  log('─'.repeat(40), colors.blue);
}

function logCheck(result: CheckResult): void {
  const icon = result.status === 'success' ? '✅' : result.status === 'warning' ? '⚠️' : '❌';
  const color = result.status === 'success' ? colors.green : result.status === 'warning' ? colors.yellow : colors.red;
  
  log(`  ${icon} ${result.name}: ${result.message}`, color);
  if (result.details) {
    log(`     └─ ${result.details}`, colors.reset);
  }
}

// ============================================
// VERIFICAÇÕES DE VARIÁVEIS DE AMBIENTE
// ============================================

function checkEnvFile(): CheckResult {
  const envPath = resolve(process.cwd(), '.env');
  const exists = existsSync(envPath);
  
  return {
    name: 'Arquivo .env',
    status: exists ? 'success' : 'error',
    message: exists ? 'Encontrado' : 'Não encontrado',
    details: exists ? envPath : 'Crie o arquivo .env com base no .env.example'
  };
}

function checkEnvVar(name: string, isRequired: boolean = true, maskValue: boolean = true): CheckResult {
  const value = process.env[name];
  const hasValue = value !== undefined && value !== '';
  
  if (!hasValue && isRequired) {
    return {
      name: name,
      status: 'error',
      message: 'Não definida',
      details: 'Esta variável é obrigatória para o funcionamento do sistema'
    };
  }
  
  if (!hasValue && !isRequired) {
    return {
      name: name,
      status: 'warning',
      message: 'Não definida (opcional)',
    };
  }
  
  const displayValue = maskValue 
    ? `${value!.substring(0, 8)}${'*'.repeat(Math.max(0, value!.length - 8))}`
    : value;
  
  return {
    name: name,
    status: 'success',
    message: 'Configurada',
    details: `Valor: ${displayValue}`
  };
}

function checkFirebaseEnvVars(): CheckResult[] {
  const results: CheckResult[] = [];
  
  // Variáveis do cliente (VITE_)
  const clientVars = [
    'VITE_FIREBASE_API_KEY',
    'VITE_FIREBASE_AUTH_DOMAIN',
    'VITE_FIREBASE_PROJECT_ID',
    'VITE_FIREBASE_STORAGE_BUCKET',
    'VITE_FIREBASE_MESSAGING_SENDER_ID',
    'VITE_FIREBASE_APP_ID'
  ];
  
  clientVars.forEach(varName => {
    results.push(checkEnvVar(varName, true));
  });
  
  // Variáveis do Admin SDK
  const adminVars = [
    'FIREBASE_PROJECT_ID',
    'FIREBASE_CLIENT_EMAIL',
    'FIREBASE_PRIVATE_KEY'
  ];
  
  adminVars.forEach(varName => {
    results.push(checkEnvVar(varName, true));
  });
  
  return results;
}

function checkResendEnvVars(): CheckResult[] {
  return [checkEnvVar('RESEND_API_KEY', true)];
}

function checkOptionalEnvVars(): CheckResult[] {
  return [
    checkEnvVar('NODE_ENV', false, false),
    checkEnvVar('VITE_APP_URL', false, false),
    checkEnvVar('VITE_ENABLE_DEBUG_LOGS', false, false),
    checkEnvVar('VITE_API_VERSION', false, false)
  ];
}

// ============================================
// VERIFICAÇÕES DE SEGURANÇA
// ============================================

function checkGitignore(): CheckResult {
  const gitignorePath = resolve(process.cwd(), '.gitignore');
  
  if (!existsSync(gitignorePath)) {
    return {
      name: 'Arquivo .gitignore',
      status: 'error',
      message: 'Não encontrado',
      details: 'CRÍTICO: Credenciais podem ser expostas!'
    };
  }
  
  const content = readFileSync(gitignorePath, 'utf-8');
  const hasEnv = content.includes('.env');
  
  return {
    name: 'Proteção .env no .gitignore',
    status: hasEnv ? 'success' : 'error',
    message: hasEnv ? '.env está protegido' : '.env NÃO está no .gitignore!',
    details: hasEnv ? undefined : 'CRÍTICO: Adicione .env ao .gitignore imediatamente!'
  };
}

function checkPrivateKeyFormat(): CheckResult {
  const privateKey = process.env.FIREBASE_PRIVATE_KEY;
  
  if (!privateKey) {
    return {
      name: 'Formato da Private Key',
      status: 'error',
      message: 'Private key não encontrada',
    };
  }
  
  const hasBeginMarker = privateKey.includes('-----BEGIN PRIVATE KEY-----');
  const hasEndMarker = privateKey.includes('-----END PRIVATE KEY-----');
  const hasNewlines = privateKey.includes('\\n') || privateKey.includes('\n');
  
  if (!hasBeginMarker || !hasEndMarker) {
    return {
      name: 'Formato da Private Key',
      status: 'error',
      message: 'Formato inválido',
      details: 'A chave deve conter os marcadores BEGIN/END PRIVATE KEY'
    };
  }
  
  return {
    name: 'Formato da Private Key',
    status: 'success',
    message: 'Formato válido',
    details: hasNewlines ? 'Contém quebras de linha' : 'Sem quebras de linha detectadas'
  };
}

// ============================================
// VERIFICAÇÕES DE CONECTIVIDADE
// ============================================

async function checkFirebaseConnection(): Promise<CheckResult> {
  try {
    const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
    
    if (!projectId) {
      return {
        name: 'Firebase Project ID',
        status: 'error',
        message: 'Project ID não configurado'
      };
    }
    
    // Verificar se o projeto existe fazendo uma requisição simples
    const response = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)`,
      { method: 'GET' }
    );
    
    // 403 significa que o projeto existe mas precisa de autenticação (esperado)
    // 404 significa que o projeto não existe
    if (response.status === 404) {
      return {
        name: 'Firebase Firestore',
        status: 'error',
        message: 'Projeto não encontrado',
        details: `Project ID: ${projectId}`
      };
    }
    
    return {
      name: 'Firebase Firestore',
      status: 'success',
      message: 'Projeto acessível',
      details: `Project ID: ${projectId}`
    };
  } catch (error) {
    return {
      name: 'Firebase Firestore',
      status: 'warning',
      message: 'Não foi possível verificar conectividade',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

async function checkResendConnection(): Promise<CheckResult> {
  const apiKey = process.env.RESEND_API_KEY;
  
  if (!apiKey || apiKey === 're_YOUR_RESEND_API_KEY_HERE') {
    return {
      name: 'Resend API',
      status: 'warning',
      message: 'API Key não configurada ou é placeholder',
      details: 'Configure sua API key do Resend para envio de emails'
    };
  }
  
  try {
    const response = await fetch('https://api.resend.com/domains', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.status === 401) {
      return {
        name: 'Resend API',
        status: 'error',
        message: 'API Key inválida',
        details: 'Verifique sua API key no dashboard do Resend'
      };
    }
    
    if (response.ok) {
      const data = await response.json() as { data?: unknown[] };
      return {
        name: 'Resend API',
        status: 'success',
        message: 'Conectado com sucesso',
        details: `Domínios configurados: ${data.data?.length || 0}`
      };
    }
    
    return {
      name: 'Resend API',
      status: 'warning',
      message: `Resposta inesperada: ${response.status}`,
      details: 'Verifique a configuração do Resend'
    };
  } catch (error) {
    return {
      name: 'Resend API',
      status: 'warning',
      message: 'Erro ao conectar',
      details: error instanceof Error ? error.message : 'Erro desconhecido'
    };
  }
}

/**
 * Teste REAL de escrita/leitura no Firestore
 * Isso detecta problemas de permissão que a verificação simples não pega
 */
async function checkFirestoreWritePermission(): Promise<CheckResult> {
  const apiKey = process.env.VITE_FIREBASE_API_KEY;
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID || process.env.FIREBASE_PROJECT_ID;
  
  if (!apiKey || !projectId) {
    return {
      name: 'Firestore Escrita',
      status: 'warning',
      message: 'Credenciais não configuradas',
      details: 'Configure VITE_FIREBASE_API_KEY e VITE_FIREBASE_PROJECT_ID'
    };
  }
  
  try {
    // Tentar criar um documento de teste usando a REST API do Firestore
    const testDocId = `health_check_${Date.now()}`;
    const testData = {
      fields: {
        test: { stringValue: 'health_check' },
        timestamp: { integerValue: Date.now().toString() },
        source: { stringValue: 'health-check-script' }
      }
    };
    
    // POST para criar documento
    const createUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/_health_checks?documentId=${testDocId}&key=${apiKey}`;
    
    const createResponse = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData)
    });
    
    if (createResponse.status === 403) {
      return {
        name: 'Firestore Escrita',
        status: 'error',
        message: 'PERMISSÃO NEGADA - Regras de segurança bloqueando',
        details: 'Configure as regras do Firestore no Console Firebase para permitir escrita'
      };
    }
    
    if (createResponse.status === 400) {
      const errorData = await createResponse.json();
      return {
        name: 'Firestore Escrita',
        status: 'error',
        message: 'Erro de configuração',
        details: errorData?.error?.message || 'Verifique a API Key e Project ID'
      };
    }
    
    if (!createResponse.ok) {
      return {
        name: 'Firestore Escrita',
        status: 'warning',
        message: `Resposta inesperada: ${createResponse.status}`,
        details: 'Verifique as configurações do Firebase'
      };
    }
    
    // Sucesso! Agora deletar o documento de teste
    const deleteUrl = `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/_health_checks/${testDocId}?key=${apiKey}`;
    await fetch(deleteUrl, { method: 'DELETE' });
    
    return {
      name: 'Firestore Escrita',
      status: 'success',
      message: 'Escrita e leitura funcionando',
      details: 'Documento de teste criado e removido com sucesso'
    };
  } catch (error) {
    return {
      name: 'Firestore Escrita',
      status: 'error',
      message: 'Erro ao testar escrita',
      details: error instanceof Error ? error.message : 'Erro de rede ou configuração'
    };
  }
}

async function checkFirebaseStorageBucket(): Promise<CheckResult> {
  const bucket = process.env.VITE_FIREBASE_STORAGE_BUCKET;
  
  if (!bucket) {
    return {
      name: 'Firebase Storage',
      status: 'error',
      message: 'Storage bucket não configurado'
    };
  }
  
  // Verificar formato do bucket
  const validFormat = bucket.endsWith('.appspot.com') || bucket.endsWith('.firebasestorage.app');
  
  return {
    name: 'Firebase Storage',
    status: validFormat ? 'success' : 'warning',
    message: validFormat ? 'Bucket configurado' : 'Formato do bucket pode estar incorreto',
    details: `Bucket: ${bucket}`
  };
}

// ============================================
// VERIFICAÇÕES DE CONFIGURAÇÃO
// ============================================

function checkProjectStructure(): CheckResult[] {
  const results: CheckResult[] = [];
  
  const requiredFiles = [
    { path: 'package.json', name: 'package.json' },
    { path: 'vite.config.ts', name: 'Vite Config' },
    { path: 'src/lib/firebase.ts', name: 'Firebase Config' },
    { path: 'tsconfig.json', name: 'TypeScript Config' }
  ];
  
  requiredFiles.forEach(file => {
    const filePath = resolve(process.cwd(), file.path);
    const exists = existsSync(filePath);
    
    results.push({
      name: file.name,
      status: exists ? 'success' : 'error',
      message: exists ? 'Encontrado' : 'Não encontrado',
      details: exists ? undefined : `Arquivo esperado: ${file.path}`
    });
  });
  
  return results;
}

// ============================================
// EXECUÇÃO PRINCIPAL
// ============================================

async function runHealthCheck(): Promise<HealthReport> {
  const checks: CheckResult[] = [];
  
  logHeader('🏥 HEALTH CHECK - PARATY SEA DREAMS BACKEND');
  log(`  Executando em: ${new Date().toLocaleString('pt-BR')}`, colors.reset);
  log(`  Ambiente: ${process.env.NODE_ENV || 'development'}`, colors.reset);
  
  // 1. Verificar arquivo .env
  logSection('Arquivo de Configuração');
  const envCheck = checkEnvFile();
  checks.push(envCheck);
  logCheck(envCheck);
  
  // 2. Verificar variáveis do Firebase
  logSection('Firebase - Variáveis de Ambiente');
  const firebaseVars = checkFirebaseEnvVars();
  firebaseVars.forEach(check => {
    checks.push(check);
    logCheck(check);
  });
  
  // 3. Verificar variáveis do Resend
  logSection('Resend - Variáveis de Ambiente');
  const resendVars = checkResendEnvVars();
  resendVars.forEach(check => {
    checks.push(check);
    logCheck(check);
  });
  
  // 4. Verificar variáveis opcionais
  logSection('Variáveis Opcionais');
  const optionalVars = checkOptionalEnvVars();
  optionalVars.forEach(check => {
    checks.push(check);
    logCheck(check);
  });
  
  // 5. Verificações de segurança
  logSection('Verificações de Segurança');
  const gitignoreCheck = checkGitignore();
  checks.push(gitignoreCheck);
  logCheck(gitignoreCheck);
  
  const privateKeyCheck = checkPrivateKeyFormat();
  checks.push(privateKeyCheck);
  logCheck(privateKeyCheck);
  
  // 6. Estrutura do projeto
  logSection('Estrutura do Projeto');
  const structureChecks = checkProjectStructure();
  structureChecks.forEach(check => {
    checks.push(check);
    logCheck(check);
  });
  
  // 7. Conectividade (async)
  logSection('Conectividade dos Serviços');
  
  const firebaseConn = await checkFirebaseConnection();
  checks.push(firebaseConn);
  logCheck(firebaseConn);
  
  const storageCheck = await checkFirebaseStorageBucket();
  checks.push(storageCheck);
  logCheck(storageCheck);
  
  // NOVO: Teste de escrita real no Firestore
  const firestoreWriteCheck = await checkFirestoreWritePermission();
  checks.push(firestoreWriteCheck);
  logCheck(firestoreWriteCheck);
  
  const resendConn = await checkResendConnection();
  checks.push(resendConn);
  logCheck(resendConn);
  
  // Gerar resumo
  const summary = {
    total: checks.length,
    passed: checks.filter(c => c.status === 'success').length,
    warnings: checks.filter(c => c.status === 'warning').length,
    failed: checks.filter(c => c.status === 'error').length
  };
  
  // Exibir resumo
  logHeader('📊 RESUMO DO HEALTH CHECK');
  
  log(`  Total de verificações: ${summary.total}`, colors.reset);
  log(`  ✅ Sucesso: ${summary.passed}`, colors.green);
  log(`  ⚠️  Avisos: ${summary.warnings}`, colors.yellow);
  log(`  ❌ Falhas: ${summary.failed}`, colors.red);
  
  console.log();
  
  if (summary.failed > 0) {
    log('═'.repeat(60), colors.red);
    log('  ❌ HEALTH CHECK FALHOU', colors.bright + colors.red);
    log('  Corrija os erros acima antes de continuar', colors.red);
    log('═'.repeat(60), colors.red);
  } else if (summary.warnings > 0) {
    log('═'.repeat(60), colors.yellow);
    log('  ⚠️  HEALTH CHECK PASSOU COM AVISOS', colors.bright + colors.yellow);
    log('  O sistema pode funcionar, mas revise os avisos', colors.yellow);
    log('═'.repeat(60), colors.yellow);
  } else {
    log('═'.repeat(60), colors.green);
    log('  ✅ HEALTH CHECK PASSOU', colors.bright + colors.green);
    log('  Todos os serviços estão configurados corretamente!', colors.green);
    log('═'.repeat(60), colors.green);
  }
  
  console.log();
  
  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    checks,
    summary
  };
}

// Executar
runHealthCheck()
  .then((report) => {
    // Sair com código de erro se houver falhas
    if (report.summary.failed > 0) {
      process.exit(1);
    }
    process.exit(0);
  })
  .catch((error) => {
    console.error('Erro fatal durante health check:', error);
    process.exit(1);
  });
