import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Extrae tags de pruebas fallidas del archivo @rerun.txt y las re-ejecuta
 * 
 * Este script:
 * 1. Lee el archivo @rerun.txt generado por Cucumber
 * 2. Extrae los tags @TEST_TC-* de las 10 líneas anteriores a cada escenario fallido
 * 3. Construye una expresión de tags con OR
 * 4. Ejecuta cucumber-js con los tags extraídos
 * 5. Elimina el archivo @rerun.txt después de extraer los tags
 * 
 * @returns Promise<void>
 */
export async function extractAndRerunFailedTests(): Promise<void> {
  const rerunFile = '@rerun.txt';
  
  // Check if rerun file exists
  if (!fs.existsSync(rerunFile)) {
    console.log('No hay tests fallidos para reintentar');
    return;
  }
  
  // Read rerun file
  const content = fs.readFileSync(rerunFile, 'utf-8').trim();
  
  if (!content) {
    console.log('No hay tests fallidos para reintentar');
    fs.unlinkSync(rerunFile);
    return;
  }
  
  // Extract scenario locations
  const scenarios = content.split(' ').filter(s => s.trim());
  const tags: Set<string> = new Set();
  
  console.log(`Procesando ${scenarios.length} escenario(s) fallido(s)...`);
  
  // For each scenario, extract tags from feature file
  for (const scenario of scenarios) {
    const [featureFile, lineNumber] = scenario.split(':');
    
    if (!featureFile || !lineNumber) {
      console.warn(`Formato inválido de escenario: ${scenario}`);
      continue;
    }
    
    try {
      const featureContent = fs.readFileSync(featureFile, 'utf-8');
      const lines = featureContent.split('\n');
      const targetLine = parseInt(lineNumber);
      
      // Look for tags in the 10 lines before the scenario
      const startLine = Math.max(0, targetLine - 10);
      const endLine = targetLine;
      
      for (let i = startLine; i < endLine; i++) {
        const line = lines[i];
        const tagMatches = line.match(/@TEST_TC-\d+/g);
        
        if (tagMatches) {
          tagMatches.forEach(tag => {
            tags.add(tag);
            console.log(`  Tag encontrado: ${tag} en ${featureFile}:${i + 1}`);
          });
        }
      }
    } catch (error) {
      console.error(`Error leyendo archivo de feature ${featureFile}:`, error);
    }
  }
  
  if (tags.size === 0) {
    console.log('No se encontraron tags @TEST_TC-* en los escenarios fallidos');
    fs.unlinkSync(rerunFile);
    return;
  }
  
  // Build tag expression (OR logic)
  const tagExpression = Array.from(tags).join(' or ');
  
  console.log(`\nRe-ejecutando ${tags.size} prueba(s) fallida(s) con tags: ${tagExpression}`);
  
  // Execute cucumber with extracted tags
  const command = `npx cucumber-js --tags "${tagExpression}" --retry 1`;
  
  console.log(`Ejecutando comando: ${command}\n`);
  
  try {
    const { stdout, stderr } = await execAsync(command);
    console.log(stdout);
    if (stderr) console.error(stderr);
  } catch (error: any) {
    console.error('Error re-ejecutando pruebas:', error.message);
    // Don't throw, we still want to clean up the rerun file
  } finally {
    // Clean up rerun file
    if (fs.existsSync(rerunFile)) {
      fs.unlinkSync(rerunFile);
      console.log('\nArchivo @rerun.txt eliminado');
    }
  }
}

// Execute extraction and rerun when run directly
if (require.main === module) {
  extractAndRerunFailedTests().catch(error => {
    console.error('Error fatal:', error);
    process.exit(1);
  });
}
