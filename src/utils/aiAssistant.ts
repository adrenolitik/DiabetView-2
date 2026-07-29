import { PatientProfile, CounterfactualScenario } from '../types';

/**
 * Local, offline "AI assistant" response generator.
 *
 * The original app called a server-side Gemini API endpoint (`/api/gemini/analyze`)
 * hosted on a Node/Express backend. Since this build runs as a fully static
 * site (Netlify), there is no backend and no external API calls are made —
 * this keeps the app working everywhere, without VPN, and without requiring
 * any API keys or secrets.
 *
 * Instead, we generate the same kind of structured, educational answer
 * locally based on the patient profile, the selected counterfactual scenario,
 * and (loosely) the question asked. This mirrors the built-in fallback
 * behaviour the original server used when no GEMINI_API_KEY was configured.
 */

function clinicalHeadline(patient: PatientProfile): string {
  if (patient.hba1c > 8.5) {
    return 'Показатели указывают на существенно повышенный риск — есть большой потенциал для улучшения при относительно небольших изменениях.';
  }
  if (patient.hba1c > 7.0) {
    return 'Гликемический контроль умеренно повышен — целевой диапазон достижим за 3-6 месяцев регулярных небольших действий.';
  }
  return 'Текущий контроль близок к целевому — сейчас важно закрепить и поддерживать достигнутый результат.';
}

function leveragePoint(patient: PatientProfile): string {
  if (patient.activityMinutes < 20) {
    return 'Физическая активность (сейчас всего ' + patient.activityMinutes + ' мин/день) — самый мощный доступный рычаг: даже 20-30 минут ходьбы после еды снижают постпрандиальный пик глюкозы на 1.8-2.5 ммоль/л без изменения терапии.';
  }
  if (patient.carbsGrams > 180) {
    return 'Снижение суточных углеводов (сейчас ' + patient.carbsGrams + ' г/сутки) — главный рычаг: замена части быстрых углеводов клетчаткой и белком заметно выравнивает кривую глюкозы.';
  }
  return 'Дальнейшая стабилизация сна и уровня стресса — следующий значимый рычаг для закрепления достигнутого контроля гликемии.';
}

function scenarioBlock(scenario?: CounterfactualScenario): string {
  if (!scenario) return '';
  const deltaText = scenario.hba1cDelta > 0 ? `+${scenario.hba1cDelta}%` : `${scenario.hba1cDelta}%`;
  const riskText = scenario.riskReductionPercent > 0 ? `+${scenario.riskReductionPercent}%` : `${scenario.riskReductionPercent}%`;
  return `

**По выбранному сценарию «${scenario.title}»:**
- Прогноз HbA1c: изменение ${deltaText} (цель ${scenario.targetHba1c}%)
- Изменение риска осложнений: ${riskText}
- Постпрандиальный эффект: ${scenario.glucoseDropMmol > 0 ? '+' : ''}${scenario.glucoseDropMmol} ммоль/л
- Минимальные действия: ${scenario.requiredActions.map((a) => `«${a}»`).join('; ')}`;
}

function questionSpecificNote(question: string): string {
  const q = question.toLowerCase();
  if (q.includes('ходьб') || q.includes('прогул')) {
    return '\n\n**Почему прогулка после еды так эффективна:** во время ходьбы работающие мышцы поглощают глюкозу из крови через переносчики GLUT-4 практически без участия инсулина. Это напрямую снижает пиковый подъём сахара после приёма пищи — эффект заметен уже через 10-15 минут ходьбы.';
  }
  if (q.includes('углевод') || q.includes('макарон') || q.includes('рацион') || q.includes('питани')) {
    return '\n\n**По питанию:** замена быстрых углеводов (белый хлеб, макароны, сладости) на овощи, бобовые и цельнозерновые продукты снижает скорость всасывания глюкозы и уменьшает постпрандиальный пик. Начните с замены одного приёма пищи в день — это уже даёт измеримый эффект через 1-2 недели.';
  }
  if (q.includes('рычаг') || q.includes('leverage')) {
    return '\n\n**Главный рычаг для вас:** согласно причинно-следственной карте (CLD) вашего профиля, наибольшее влияние на HbA1c оказывает связка «физическая активность → утилизация глюкозы → HbA1c». Именно на неё стоит воздействовать в первую очередь.';
  }
  if (q.includes('безопасно') || q.includes('препарат') || q.includes('лекарств') || q.includes('медикамент')) {
    return '\n\n**О безопасности изменений на фоне терапии:** умеренное снижение углеводов и рост активности обычно хорошо сочетаются с текущей терапией метформином. Если вы принимаете препараты сульфонилмочевины или инсулин, любое значимое изменение рациона или нагрузки нужно обсудить с врачом — это снижает риск гипогликемии.';
  }
  return '';
}

export function generateLocalAiResponse(
  patient: PatientProfile,
  scenario: CounterfactualScenario | undefined,
  question: string
): string {
  const headline = clinicalHeadline(patient);
  const leverage = leveragePoint(patient);
  const scenarioText = scenarioBlock(scenario);
  const specific = questionSpecificNote(question);

  return `На основе введённых данных (${patient.name}, HbA1c: ${patient.hba1c}%, ИМТ ${patient.bmi} кг/м²):

- **Текущий статус:** ${headline}
- **Главная точка воздействия (Leverage Point):** ${leverage}
- **Минимальный эффективный сценарий:** снижение суточного потребления быстрых углеводов и добавление 20-30 минут ходьбы после приёма пищи обычно позволяет снизить HbA1c на ~0.5-0.7% за 3 месяца.${scenarioText}${specific}

*Дисклеймер: данный ответ сформирован локальным демонстрационным алгоритмом (без подключения к внешним ИИ-сервисам) и предназначен для образовательных целей. Итоговое изменение образа жизни и медикаментозной терапии должно согласовываться с лечащим врачом-эндокринологом.*`;
}
