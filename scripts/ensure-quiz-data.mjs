import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const targetPath = path.join(__dirname, '../src/data/quiz-data.json');
const demoPath = path.join(__dirname, '../src/data/quiz-data-demo.json');

if (!fs.existsSync(targetPath)) {
  console.log('⚠️ No se detectó "quiz-data.json". Copiando dataset sintético de demostración para el build...');
  try {
    fs.copyFileSync(demoPath, targetPath);
    console.log('✓ Dataset sintético de demostración copiado con éxito.');
  } catch (err) {
    console.error('❌ Error al copiar el dataset sintético:', err);
    process.exit(1);
  }
} else {
  console.log('✓ Se detectó "quiz-data.json" (privado/real). Procediendo al build con el corpus de calibración local.');
}
process.exit(0);
