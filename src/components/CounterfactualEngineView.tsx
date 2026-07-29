import React, { useState } from 'react';
import { CounterfactualScenario, PatientProfile, IteRiskMetric } from '../types';
import {
  HelpCircle,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  CheckCircle2,
  Footprints,
  Utensils,
  Award,
  ChevronRight,
  Info,
} from 'lucide-react';

interface CounterfactualEngineViewProps {
  scenarios: CounterfactualScenario[];
  patient: PatientProfile;
  iteMetrics: IteRiskMetric[];
  onApplyScenarioToTwin: (scenario: CounterfactualScenario) => void;
  onAskGeminiAboutScenario: (scenario: CounterfactualScenario) => void;
}

export const CounterfactualEngineView: React.FC<CounterfactualEngineViewProps> = ({
  scenarios,
  patient,
  iteMetrics,
  onApplyScenarioToTwin,
  onAskGeminiAboutScenario,
}) => {
  const [activeScenarioId, setActiveScenarioId] = useState<string>(scenarios[0].id);
  const activeScenario = scenarios.find((s) => s.id === activeScenarioId) || scenarios[0];

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-[2rem] p-7 text-white shadow-lg border border-indigo-900/60">
        <div className="inline-flex items-center space-x-2 bg-indigo-800/80 border border-indigo-600 text-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-3">
          <HelpCircle className="w-3.5 h-3.5" />
          <span>Уровень 2: Контрфактическое моделирование (What-If & ITE)</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
          Моделирование сценариев «Что если?» и минимальных рекомендаций (MVR)
        </h2>
        <p className="text-slate-300 text-sm max-w-3xl leading-relaxed mt-2">
          Контрфактический подход дает четкий ответ: <em>«Что конкретно произойдет с вашим HbA1c и риском инвалидизации, если вы сделаете наименьшие достижимые изменения в поведении?»</em> Вместо абстрактных просьб «снизьте сахар», система предлагает точный пошаговый план.
        </p>
      </div>

      {/* Scenario Selection Cards Grid (Bento Grid) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {scenarios.map((scen) => {
          const isSelected = activeScenarioId === scen.id;
          const isNoChange = scen.category === 'no_change';
          const isMvr = scen.category === 'minimal';

          return (
            <div
              key={scen.id}
              onClick={() => setActiveScenarioId(scen.id)}
              className={`p-6 rounded-[2rem] border transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? isNoChange
                    ? 'border-rose-500 bg-rose-50/40 ring-2 ring-rose-500/30 shadow-md'
                    : 'border-indigo-600 bg-indigo-50/40 ring-2 ring-indigo-500/30 shadow-md'
                  : 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span
                    className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase tracking-wider ${
                      isMvr
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : isNoChange
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-indigo-100 text-indigo-800 border border-indigo-200'
                    }`}
                  >
                    {isMvr ? 'MVR (Минимальный шаг)' : isNoChange ? 'Риск (Без изменений)' : 'Сценарий'}
                  </span>
                  <span className="text-xs font-bold text-slate-400">
                    {scen.durationMonths} мес.
                  </span>
                </div>

                <h3 className="font-bold text-slate-900 text-base leading-snug mb-1">
                  {scen.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                  {scen.subtitle}
                </p>

                {/* Main Metrics */}
                <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-2 text-xs">
                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Прогноз HbA1c:</span>
                    <span className={`font-black text-sm ${isNoChange ? 'text-rose-600' : 'text-indigo-700'}`}>
                      {patient.hba1c}% → {scen.targetHba1c}%
                    </span>
                  </div>

                  <div className="flex justify-between items-center">
                    <span className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Снижение риска:</span>
                    <span className={`font-black text-sm ${isNoChange ? 'text-rose-600' : 'text-emerald-600'}`}>
                      {scen.riskReductionPercent > 0 ? `+${scen.riskReductionPercent}%` : `${scen.riskReductionPercent}%`}
                    </span>
                  </div>
                </div>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                <span>Подробнее</span>
                <ChevronRight className="w-4 h-4" />
              </div>
            </div>
          );
        })}
      </div>

      {/* Deep Dive into Selected Scenario & Clinical Rationales */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 cols: Detailed Breakdown of Selected Scenario */}
        <div className="lg:col-span-2 bg-white rounded-[2rem] p-7 shadow-sm border border-slate-200 space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-5 border-b border-slate-100">
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                  Детальный контрфактический разбор
                </span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-1">{activeScenario.title}</h3>
              <p className="text-xs font-medium text-slate-500">{activeScenario.subtitle}</p>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onApplyScenarioToTwin(activeScenario)}
                className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-200 flex items-center space-x-2 transition-all active:scale-95"
              >
                <span>Применить в Digital Twin</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* 3 Metric Summary Boxes */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 bg-indigo-50/70 rounded-2xl border border-indigo-100">
              <span className="text-xs font-bold text-indigo-400 uppercase tracking-wider block">Целевой HbA1c</span>
              <div className="text-3xl font-black text-indigo-950 my-1">
                {activeScenario.targetHba1c}%
              </div>
              <span className="text-[11px] font-bold text-indigo-700">
                Изменение: {activeScenario.hba1cDelta > 0 ? `+${activeScenario.hba1cDelta}%` : `${activeScenario.hba1cDelta}%`}
              </span>
            </div>

            <div className="p-5 bg-emerald-50/70 rounded-2xl border border-emerald-100">
              <span className="text-xs font-bold text-emerald-500 uppercase tracking-wider block">Снижение риска</span>
              <div className="text-3xl font-black text-emerald-950 my-1">
                {activeScenario.riskReductionPercent > 0 ? `+${activeScenario.riskReductionPercent}%` : `${activeScenario.riskReductionPercent}%`}
              </div>
              <span className="text-[11px] font-bold text-emerald-700">
                по микрососудистым событиям
              </span>
            </div>

            <div className="p-5 bg-slate-50 rounded-2xl border border-slate-200">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">Постпрандиальный пик</span>
              <div className="text-3xl font-black text-slate-800 my-1">
                {activeScenario.glucoseDropMmol > 0 ? `+${activeScenario.glucoseDropMmol}` : activeScenario.glucoseDropMmol} ммоль/л
              </div>
              <span className="text-[11px] font-bold text-slate-500">
                сглаживание сахара после еды
              </span>
            </div>
          </div>

          {/* Minimal Required Actions (MVR List) */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Минимальные необходимые действия (MVR):</span>
            </h4>

            <div className="space-y-2.5">
              {activeScenario.requiredActions.map((action, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-start space-x-3 text-xs leading-relaxed text-slate-800"
                >
                  <span className="w-6 h-6 rounded-full bg-indigo-600 text-white font-black flex items-center justify-center shrink-0 text-xs">
                    {idx + 1}
                  </span>
                  <span className="font-semibold text-slate-800 mt-0.5">{action}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Clinical Rationale */}
          <div className="p-5 bg-amber-50/80 border border-amber-200/80 rounded-2xl text-xs text-amber-900 space-y-1">
            <strong className="font-bold flex items-center space-x-1.5 text-amber-950 text-sm">
              <Info className="w-4 h-4 text-amber-600" />
              <span>Клиническое обоснование модели ( PMC Lenatti et al. ):</span>
            </strong>
            <p className="leading-relaxed font-medium">{activeScenario.clinicalRationale}</p>
          </div>

          {/* AI Endocrinologist Button */}
          <div className="pt-2">
            <button
              onClick={() => onAskGeminiAboutScenario(activeScenario)}
              className="w-full py-4 px-5 bg-slate-900 hover:bg-slate-800 text-white rounded-2xl font-bold text-xs shadow-md flex items-center justify-center space-x-2 transition-all active:scale-95 border border-slate-800"
            >
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Получить подробную ИИ-консультацию Gemini по этому сценарию</span>
            </button>
          </div>
        </div>

        {/* Right col: Individualized Treatment Effect (ITE) Calculator */}
        <div className="space-y-4">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-5">
            <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
              <ShieldCheck className="w-6 h-6 text-indigo-600" />
              <div>
                <h3 className="font-bold text-slate-900 text-base">
                  Индивидуальный эффект лечения (ITE)
                </h3>
                <p className="text-xs font-bold text-slate-400">Баланс пользы и рисков за 5 лет</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 leading-relaxed font-medium">
              Модель ITE рассчитывает персональный баланс предотвращения тяжелых осложнений и риска легкой гипогликемии.
            </p>

            <div className="space-y-3">
              {iteMetrics.map((item) => (
                <div key={item.id} className="p-4 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                  <div className="flex justify-between font-bold text-slate-900">
                    <span>{item.complication}</span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-[11px] text-center font-bold pt-1">
                    <div className="bg-white p-2 rounded-xl border border-slate-200">
                      <span className="block text-slate-400 text-[10px] uppercase tracking-wider">Текущий</span>
                      <span className="font-extrabold text-slate-800">{item.baselineRisk}%</span>
                    </div>

                    <div className="bg-emerald-50 p-2 rounded-xl border border-emerald-200 text-emerald-900">
                      <span className="block text-emerald-700 text-[10px] uppercase tracking-wider">Образ жизни</span>
                      <span className="font-extrabold">{item.lifestyleChangeRisk}%</span>
                    </div>

                    <div className="bg-indigo-50 p-2 rounded-xl border border-indigo-200 text-indigo-900">
                      <span className="block text-indigo-700 text-[10px] uppercase tracking-wider">Комплекс</span>
                      <span className="font-extrabold">{item.combinedTherapyRisk}%</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Net Benefit Banner */}
            <div className="p-5 bg-indigo-600 text-white rounded-2xl text-xs space-y-1.5 shadow-md shadow-indigo-200">
              <div className="flex items-center justify-between font-extrabold text-sm">
                <span>Чистая польза (Net Benefit):</span>
                <span className="text-emerald-300 font-black">+16% защищенности</span>
              </div>
              <p className="text-indigo-100 text-[11px] leading-relaxed">
                Снижение 5-летнего риска осложнений на 16% при минимальном повышении риска гипогликемии (+3%). Совместное решение оправдано!
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
