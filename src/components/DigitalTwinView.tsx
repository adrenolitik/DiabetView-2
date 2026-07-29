import React, { useMemo } from 'react';
import { PatientProfile, DigitalTwinState } from '../types';
import { generateCgmProfile } from '../utils/counterfactualEngine';
import {
  ResponsiveContainer,
  ComposedChart,
  Line,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ReferenceArea,
} from 'recharts';
import {
  Cpu,
  Sliders,
  Activity,
  Award,
  TrendingDown,
  ShieldCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  Moon,
  Flame,
  Footprints,
  Utensils,
  Pill,
  HeartPulse,
} from 'lucide-react';

interface DigitalTwinViewProps {
  patient: PatientProfile;
  twinState: DigitalTwinState;
  onUpdateTwinState: (newState: Partial<DigitalTwinState>) => void;
  onResetTwinState: () => void;
  onAskGeminiAboutTwin: () => void;
}

export const DigitalTwinView: React.FC<DigitalTwinViewProps> = ({
  patient,
  twinState,
  onUpdateTwinState,
  onResetTwinState,
  onAskGeminiAboutTwin,
}) => {
  // Compute CGM simulation profile dynamically
  const simulation = useMemo(() => {
    return generateCgmProfile(patient, twinState);
  }, [patient, twinState]);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-[2rem] p-7 text-white shadow-lg border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-800/80 border border-indigo-600 text-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>Уровень 3: Digital Twin (Персональный Двойник)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Интерактивный физиологический двойник пациента
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Моделируйте физиологическую реакцию вашего организма на изменения суточного рациона, нагрузки, медикаментов и сна. График в реальном времени покажет 24-часовую кривую глюкозы (CGM), прогнозируемый HbA1c и снижение риска осложнений.
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={onResetTwinState}
              className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 rounded-2xl text-xs font-bold flex items-center space-x-1.5 transition-all shadow-sm"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Сбросить к исходным</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Controls (Sliders) + Right Charts & Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Col (1 col): Interactive Parameter Sliders */}
        <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-5">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-indigo-600" />
              <span>Параметры симуляции</span>
            </h3>
            <span className="text-[10px] font-black text-indigo-600 bg-indigo-50 px-2.5 py-1 rounded-full border border-indigo-100 uppercase tracking-wider">
              Эксперимент
            </span>
          </div>

          {/* Slider 1: Activity Minutes */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span className="flex items-center space-x-1.5">
                <Footprints className="w-4 h-4 text-emerald-600" />
                <span>Физическая активность:</span>
              </span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-0.5 rounded-lg border border-emerald-200">
                {twinState.activityMin} мин/день
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="90"
              step="5"
              value={twinState.activityMin}
              onChange={(e) => onUpdateTwinState({ activityMin: Number(e.target.value) })}
              className="w-full accent-emerald-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0 мин (сидячий)</span>
              <span>45 мин</span>
              <span>90 мин (активный)</span>
            </div>
          </div>

          {/* Slider 2: Carb intake */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span className="flex items-center space-x-1.5">
                <Utensils className="w-4 h-4 text-amber-600" />
                <span>Углеводы в рационе:</span>
              </span>
              <span className="text-amber-700 font-bold bg-amber-50 px-2.5 py-0.5 rounded-lg border border-amber-200">
                {twinState.carbsGrams} г/день
              </span>
            </div>
            <input
              type="range"
              min="50"
              max="260"
              step="10"
              value={twinState.carbsGrams}
              onChange={(e) => onUpdateTwinState({ carbsGrams: Number(e.target.value) })}
              className="w-full accent-amber-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>50 г (низкоуглев.)</span>
              <span>150 г</span>
              <span>260 г (высокоуглев.)</span>
            </div>
          </div>

          {/* Slider 3: Medication Adherence */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span className="flex items-center space-x-1.5">
                <Pill className="w-4 h-4 text-indigo-600" />
                <span>Прием медикаментов:</span>
              </span>
              <span className="text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                {twinState.medicationAdherence}%
              </span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="10"
              value={twinState.medicationAdherence}
              onChange={(e) => onUpdateTwinState({ medicationAdherence: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
            <div className="flex justify-between text-[10px] text-slate-400 font-medium">
              <span>0% (пропуски)</span>
              <span>50%</span>
              <span>100% (строго)</span>
            </div>
          </div>

          {/* Toggle: Post-meal Dinner Walk */}
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 flex items-center justify-between">
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                20-мин прогулка после ужина
              </span>
              <span className="text-[11px] text-slate-500 font-medium">
                Гашение вечернего гликемического пика
              </span>
            </div>

            <button
              onClick={() => onUpdateTwinState({ postMealWalk: !twinState.postMealWalk })}
              className={`w-12 h-6 rounded-full transition-colors relative p-0.5 ${
                twinState.postMealWalk ? 'bg-emerald-500' : 'bg-slate-300'
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full bg-white shadow-md block transition-transform ${
                  twinState.postMealWalk ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* Slider 4: Sleep Hours */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span className="flex items-center space-x-1.5">
                <Moon className="w-4 h-4 text-indigo-600" />
                <span>Ночной сон:</span>
              </span>
              <span className="text-indigo-700 font-bold bg-indigo-50 px-2.5 py-0.5 rounded-lg border border-indigo-200">
                {twinState.sleepHours} ч
              </span>
            </div>
            <input
              type="range"
              min="4"
              max="10"
              step="0.5"
              value={twinState.sleepHours}
              onChange={(e) => onUpdateTwinState({ sleepHours: Number(e.target.value) })}
              className="w-full accent-indigo-600 cursor-pointer"
            />
          </div>

          {/* Slider 5: Stress Level */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-semibold text-slate-800">
              <span className="flex items-center space-x-1.5">
                <HeartPulse className="w-4 h-4 text-rose-600" />
                <span>Уровень стресса:</span>
              </span>
              <span className="text-rose-700 font-bold bg-rose-50 px-2.5 py-0.5 rounded-lg border border-rose-200">
                {twinState.stressLevel} / 10
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="1"
              value={twinState.stressLevel}
              onChange={(e) => onUpdateTwinState({ stressLevel: Number(e.target.value) })}
              className="w-full accent-rose-600 cursor-pointer"
            />
          </div>
        </div>

        {/* Right Cols (2 cols): Dynamic CGM Curve & Forecast Cards */}
        <div className="lg:col-span-2 space-y-6">
          {/* Top 4 Summary Bento Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Card 1: Predicted HbA1c */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Прогноз HbA1c (3 мес)</span>
              <div className="text-3xl font-black text-indigo-900">
                {simulation.predictedHba1c}%
              </div>
              <span className="text-[11px] font-bold text-emerald-600 block">
                {patient.hba1c > simulation.predictedHba1c
                  ? `Снижение на -${(patient.hba1c - simulation.predictedHba1c).toFixed(1)}%`
                  : `Рост на +${(simulation.predictedHba1c - patient.hba1c).toFixed(1)}%`}
              </span>
            </div>

            {/* Card 2: TIR % */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Диапазон (TIR)</span>
              <div className="text-3xl font-black text-emerald-600">
                {simulation.simulatedTir}%
              </div>
              <span className="text-[11px] font-bold text-slate-400 block">
                Исходный: {simulation.baselineTir}%
              </span>
            </div>

            {/* Card 3: Retinopathy Risk */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Защита органов</span>
              <div className="text-3xl font-black text-indigo-700">
                -{simulation.retinopathyRiskReduction}%
              </div>
              <span className="text-[11px] font-bold text-indigo-600 block">
                5-летний риск осложнений
              </span>
            </div>

            {/* Card 4: Hypo Risk */}
            <div className="p-5 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Риск гипогликемии</span>
              <div className="text-3xl font-black text-amber-600">
                {simulation.hypoRiskPercent}%
              </div>
              <span className="text-[11px] font-bold text-slate-400 block">
                {simulation.hypoRiskPercent < 5 ? 'Безопасная зона' : 'Внимание!'}
              </span>
            </div>
          </div>

          {/* CGM Continuous Glucose Curve Chart (Bento Card) */}
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
                  <Activity className="w-4 h-4 text-indigo-600" />
                  <span>24-часовой суточный профиль глюкозы (CGM)</span>
                </h3>
                <p className="text-xs text-slate-500 font-medium mt-0.5">
                  Сравнение исходного профиля (красная линия) с моделируемым Digital Twin (зеленая линия)
                </p>
              </div>

              <div className="flex items-center space-x-3 text-xs font-bold">
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-rose-500 inline-block" />
                  <span className="text-slate-600">Текущий</span>
                </div>
                <div className="flex items-center space-x-1.5">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 inline-block" />
                  <span className="text-indigo-900 font-extrabold">Двойник</span>
                </div>
              </div>
            </div>

            <div className="h-72 w-full pt-2">
              <ResponsiveContainer width="100%" height="100%">
                <ComposedChart data={simulation.points} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                  <XAxis dataKey="time" tick={{ fontSize: 10, fill: '#64748b' }} interval={3} />
                  <YAxis domain={[3, 14]} tick={{ fontSize: 10, fill: '#64748b' }} unit=" ммоль" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', borderRadius: '16px', color: '#fff', fontSize: '12px' }}
                    formatter={(val: any, name: any) => [
                      `${val} ммоль/л`,
                      name === 'baselineGlucose' ? 'Исходный сахар' : 'Моделируемый Двойник',
                    ]}
                  />
                  <Legend wrapperStyle={{ fontSize: '11px' }} />

                  {/* Target Range Highlight (3.9 - 10.0 mmol/L) */}
                  <ReferenceArea {...({ y1: 3.9, y2: 10.0, fill: '#10b981', fillOpacity: 0.08 } as any)} label={{ value: 'Целевой коридор (3.9 - 10.0)', fill: '#059669', fontSize: 10, position: 'insideTopLeft' }} />

                  {/* Baseline Glucose Line */}
                  <Line
                    type="monotone"
                    dataKey="baselineGlucose"
                    name="Исходный профиль"
                    stroke="#f43f5e"
                    strokeWidth={2}
                    dot={false}
                  />

                  {/* Simulated Twin Glucose Line */}
                  <Line
                    type="monotone"
                    dataKey="simulatedGlucose"
                    name="Digital Twin (Что если)"
                    stroke="#10b981"
                    strokeWidth={3}
                    dot={false}
                  />
                </ComposedChart>
              </ResponsiveContainer>
            </div>

            <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-xs text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>
                  Среднесуточный сахар: <strong className="text-slate-900 font-extrabold">{simulation.baselineAvg} ммоль/л</strong> → <strong className="text-emerald-700 font-extrabold">{simulation.simulatedAvg} ммоль/л</strong>
                </span>
              </div>

              <span className="text-[11px] text-slate-500 font-bold">
                Время в целевом диапазоне (TIR &gt; 70%): <strong className={simulation.simulatedTir >= 70 ? 'text-emerald-600 font-black' : 'text-amber-600 font-black'}>{simulation.simulatedTir}%</strong>
              </span>
            </div>
          </div>

          {/* AI Trigger Banner */}
          <div className="bg-gradient-to-r from-indigo-900 to-slate-900 rounded-[2rem] p-6 text-white flex flex-col sm:flex-row items-center justify-between gap-4 border border-indigo-900/60 shadow-md">
            <div className="space-y-1">
              <h4 className="font-bold text-sm text-indigo-300 flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-indigo-400" />
                <span>Оценка эксперта Gemini по вашему эксперименту</span>
              </h4>
              <p className="text-xs text-slate-300 max-w-xl font-medium">
                Отправьте параметры симуляции в Gemini ИИ-Эндокринолог для получения подробных персональных рекомендаций по меню и физической активности.
              </p>
            </div>

            <button
              onClick={onAskGeminiAboutTwin}
              className="px-6 py-3 bg-indigo-500 hover:bg-indigo-400 text-white font-black text-xs rounded-2xl shadow-md whitespace-nowrap transition-all active:scale-95 shrink-0"
            >
              Спросить Gemini ИИ-Врача
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
