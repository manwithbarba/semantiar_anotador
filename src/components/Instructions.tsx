"use client";

import { useState } from "react";

export default function Instructions() {
  const [open, setOpen] = useState(true);

  function handleReset() {
    // Recarga la página: al ser el estado del juego local (useState en
    // QuizGame), esto lo reinicia por completo a la pantalla de inicio.
    window.location.href = "/";
  }

  return (
    <div className="p-4 max-w-3xl mx-auto w-full">
      <div className="bg-gray-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-lg shadow-sm">
        <button
          onClick={() => setOpen((v) => !v)}
          className="w-full flex justify-between items-center px-4 py-3 text-left font-bold text-lg"
        >
          <span>📋 Instrucciones</span>
          <span className="text-sm font-normal text-neutral-500">
            {open ? "Ocultar ▲" : "Mostrar ▼"}
          </span>
        </button>
        {open && (
          <div className="px-4 pb-4">
            <p className="text-sm text-neutral-600 dark:text-neutral-300">
              Este es un juego de carácter educativo y recreativo para practicar la identificación de conceptos y atributos en semántica clínica. Por cada
              caso real anotado se muestra un fragmento de texto resaltado y
              debés indicar su <strong>categoría</strong>,{" "}
              <strong>polaridad</strong>, <strong>certeza</strong>,{" "}
              <strong>temporalidad</strong>, <strong>sujeto de la relación</strong> y el <strong>término SNOMED CT</strong>{" "}
              correcto. Confirmá tus respuestas para ver el resultado antes de
              pasar al siguiente caso.
            </p>
            <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-800/40 rounded text-xs text-amber-800 dark:text-amber-300">
              <strong>⚠️ Descargo Educativo:</strong> Esta aplicación no cuenta con validación clínica formal ni está destinada al diagnóstico, soporte asistencial o toma de decisiones médicas. Se presenta exclusivamente como un recurso lúdico y formativo.
            </div>
            
            <details className="mt-3 border border-neutral-200 dark:border-neutral-800 rounded bg-white dark:bg-neutral-950 text-xs">
              <summary className="px-3 py-2 font-bold cursor-pointer text-neutral-700 dark:text-neutral-300 outline-none">
                📜 Criterios de Consenso Clínico (Reglas de Modelado)
              </summary>
              <div className="p-3 border-t border-neutral-100 dark:border-neutral-900 space-y-2 text-neutral-600 dark:text-neutral-400">
                <p>Para resolver discrepancias comunes en la codificación de SNOMED CT, el juego aplica las siguientes reglas de modelado semántico:</p>
                <ul className="list-disc pl-4 space-y-1.5">
                  <li>
                    <strong>SPO2 (Oxigenometría):</strong> Valores como <code>SPO2 93%</code> o <code>buena spo2</code> se categorizan como <strong>Hallazgos clínicos</strong> (ej. <em>saturación de oxígeno dentro del rango de referencia</em>), y <strong>no</strong> como procedimientos de medición oximétrica.
                  </li>
                  <li>
                    <strong>BIC (Infusiones Continuas):</strong> Expresiones como <code>BIC FNT</code> o <code>BIC MDZ</code> se codifican como <strong>Fármaco</strong> (refiriendo al producto terapéutico infundido), no como procedimientos de infusión.
                  </li>
                  <li>
                    <strong>ARM (Asistencia Respiratoria):</strong> Frases como <code>en ARM</code> o <code>parámetros ventilatorios</code> se clasifican como <strong>Procedimiento</strong> (con el término específico de <em>ventilación mecánica invasiva</em>).
                  </li>
                </ul>
              </div>
            </details>

            <button
              className="mt-4 bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition-colors text-sm font-medium"
              onClick={handleReset}
            >
              Reiniciar juego
            </button>
          </div>
        )}
      </div>
    </div>
  );
}