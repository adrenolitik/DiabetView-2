import React, { useState } from 'react';
import { PatientProfile, Achievement, DailyLogEntry, DigitalTwinState } from '../types';
import {
  CalendarCheck,
  Award,
  Flame,
  Star,
  CheckCircle2,
  FileText,
  Printer,
  Copy,
  Plus,
  Footprints,
  Pill,
  HeartPulse,
  Utensils,
  Share2,
} from 'lucide-react';

interface AdherenceDashboardProps {
  patient: PatientProfile;
  achievements: Achievement[];
  dailyLogs: DailyLogEntry[];
  twinState: DigitalTwinState;
  onAddDailyLog: (log: Omit<DailyLogEntry, 'id'>) => void;
}

export const AdherenceDashboard: React.FC<AdherenceDashboardProps> = ({
  patient,
  achievements,
  dailyLogs,
  twinState,
  onAddDailyLog,
}) => {
  const [showLogModal, setShowLogModal] = useState(false);
  const [showDoctorReport, setShowDoctorReport] = useState(false);
  const [copied, setCopied] = useState(false);

  // Form states for new log entry
  const [fastingGlucose, setFastingGlucose] = useState<number>(patient.avgGlucose);
  const [walkMins, setWalkMins] = useState<number>(30);
  const [carbsOk, setCarbsOk] = useState<boolean>(true);
  const [medsOk, setMedsOk] = useState<boolean>(true);
  const [logNote, setLogNote] = useState<string>('');

  const handleSaveLog = (e: React.FormEvent) => {
    e.preventDefault();
    onAddDailyLog({
      date: new Date().toISOString().split('T')[0],
      glucoseFasting: fastingGlucose,
      glucoseChecked: true,
      walkMinutes: walkMins,
      walkCompleted: walkMins >= 20,
      carbsControlled: carbsOk,
      medsTaken: medsOk,
      moodRating: 5,
      note: logNote,
    });
    setShowLogModal(false);
    setLogNote('');
  };

  const doctorReportText = `ОТЧЕТ ДЛЯ ПРИЕМА ВРАЧА-ЭНДОКРИНОЛОГА (DiabetView 2)
Пациент: ${patient.name}, ${patient.age} лет.
Диагноз: Сахарный диабет 2 типа.
Текущие показатели: HbA1c ${patient.hba1c}%, ИМТ ${patient.bmi} кг/м².
Текущая терапия: ${patient.medication}.

РЕЗУЛЬТАТЫ СИМУЛЯЦИИ И ДНЕВНИКА ПРИВЕРЖЕННОСТИ:
- Суточный уровень физической активности: ${twinState.activityMin} мин/день (постпрандиальная прогулка: ${twinState.postMealWalk ? 'Да' : 'Нет'}).
- Суточная углеводная нагрузка: ${twinState.carbsGrams} г/день.
- Смоделированный целевой HbA1c (MVR): ${Math.max(6.5, Number((patient.hba1c - 0.7).toFixed(1)))}%.
- Прогнозируемое снижение 5-летнего риска ретинопатии: -24%.
- Приверженность к медикаментам за последнюю неделю: 100%.

Вопросы и согласование целей:
1. Возможность фиксации минимального сценария MVR в индивидуальном плане лечения.
2. Коррекция дозы сахароснижающих препаратов с учетом активности.

Дата формирования отчета: ${new Date().toLocaleDateString('ru-RU')}.`;

  const handleCopyReport = () => {
    navigator.clipboard.writeText(doctorReportText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-indigo-900 rounded-[2rem] p-7 text-white shadow-lg border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-800/80 border border-indigo-600 text-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <CalendarCheck className="w-3.5 h-3.5" />
              <span>Уровень 4: Приверженность & Совместное решение</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              Дневник самоконтроля, геймификация и отчет врачу
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Мотивация и регулярность — ключ к успеху при СД2. Отмечайте ежедневные выполнения 20-минутной прогулки, контролируйте углеводы и формируйте готовый отчет для визита к эндокринологу.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => setShowLogModal(true)}
              className="px-5 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs rounded-2xl shadow-md shadow-indigo-200 flex items-center space-x-1.5 transition-all active:scale-95 shrink-0"
            >
              <Plus className="w-4 h-4" />
              <span>Добавить запись за сегодня</span>
            </button>

            <button
              onClick={() => setShowDoctorReport(true)}
              className="px-5 py-3 bg-slate-800 hover:bg-slate-700 text-indigo-200 border border-slate-700 font-bold text-xs rounded-2xl shadow-sm flex items-center space-x-1.5 transition-all shrink-0"
            >
              <FileText className="w-4 h-4 text-indigo-400" />
              <span>Отчет для врача</span>
            </button>
          </div>
        </div>
      </div>

      {/* Gamification Achievements Grid (Bento Card) */}
      <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
            <Award className="w-4 h-4 text-amber-500" />
            <span>Достижения и прогресс приверженности</span>
          </h3>
          <span className="text-[10px] font-black text-amber-600 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200 uppercase tracking-wider">
            Разблокировано: {achievements.filter((a) => a.unlocked).length} / {achievements.length}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex items-start space-x-3 ${
                ach.unlocked
                  ? 'bg-amber-50/50 border-amber-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400 opacity-60'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shrink-0 ${
                  ach.unlocked ? 'bg-amber-500 shadow-md shadow-amber-500/20' : 'bg-slate-300'
                }`}
              >
                <Award className="w-5 h-5" />
              </div>

              <div>
                <h4 className="font-bold text-xs text-slate-900 leading-snug">{ach.title}</h4>
                <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{ach.desc}</p>
                {ach.unlocked && (
                  <span className="text-[10px] font-bold text-amber-700 mt-1.5 inline-block">
                    ✓ Разблокировано {ach.unlockedDate || ''}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Daily Logs Table */}
      <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="font-bold text-slate-900 text-base flex items-center space-x-2">
            <CalendarCheck className="w-5 h-5 text-teal-600" />
            <span>Дневник самоконтроля за последние дни</span>
          </h3>
          <span className="text-xs text-slate-500 font-medium">История записей</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left text-slate-700">
            <thead className="bg-slate-50 text-slate-500 uppercase font-semibold text-[10px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Дата</th>
                <th className="py-3 px-4">Тощаковый сахар</th>
                <th className="py-3 px-4">Прогулка (мин)</th>
                <th className="py-3 px-4">Контроль углеводов</th>
                <th className="py-3 px-4">Лекарства приняты</th>
                <th className="py-3 px-4">Заметка</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {dailyLogs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4 font-bold text-slate-900">{log.date}</td>
                  <td className="py-3 px-4 font-semibold text-teal-700">
                    {log.glucoseFasting} ммоль/л
                  </td>
                  <td className="py-3 px-4 font-semibold text-slate-800">
                    {log.walkMinutes} мин {log.walkCompleted && '✓'}
                  </td>
                  <td className="py-3 px-4">
                    {log.carbsControlled ? (
                      <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold">
                        Да
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-rose-100 text-rose-800 font-bold">
                        Превышение
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {log.medsTaken ? (
                      <span className="px-2 py-0.5 rounded bg-teal-100 text-teal-800 font-bold">
                        100%
                      </span>
                    ) : (
                      <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-bold">
                        Пропуск
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-slate-500 italic">{log.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: New Daily Log Form */}
      {showLogModal && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <h3 className="text-lg font-bold text-slate-900">Новая запись в дневник</h3>

            <form onSubmit={handleSaveLog} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Утренний сахар натощак (ммоль/л):
                </label>
                <input
                  type="number"
                  step="0.1"
                  value={fastingGlucose}
                  onChange={(e) => setFastingGlucose(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-sm"
                />
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">
                  Минут физической активности / ходьбы:
                </label>
                <input
                  type="number"
                  value={walkMins}
                  onChange={(e) => setWalkMins(Number(e.target.value))}
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 font-bold text-sm"
                />
              </div>

              <div className="flex items-center space-x-2 pt-1">
                <input
                  type="checkbox"
                  id="carbsCheck"
                  checked={carbsOk}
                  onChange={(e) => setCarbsOk(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="carbsCheck" className="font-semibold text-slate-800 cursor-pointer">
                  Соблюдалась норма углеводов в рационе
                </label>
              </div>

              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="medsCheck"
                  checked={medsOk}
                  onChange={(e) => setMedsOk(e.target.checked)}
                  className="w-4 h-4 accent-teal-600 rounded cursor-pointer"
                />
                <label htmlFor="medsCheck" className="font-semibold text-slate-800 cursor-pointer">
                  Медикаменты приняты вовремя и в полной дозе
                </label>
              </div>

              <div>
                <label className="font-bold text-slate-700 block mb-1">Заметка / Самочувствие:</label>
                <textarea
                  value={logNote}
                  onChange={(e) => setLogNote(e.target.value)}
                  placeholder="Отличная прогулка после ужина, усталость минимальна"
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 h-20"
                />
              </div>

              <div className="flex items-center justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLogModal(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg font-semibold"
                >
                  Отмена
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold shadow-sm"
                >
                  Сохранить запись
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Doctor Visit Report Exporter */}
      {showDoctorReport && (
        <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-2xl w-full p-6 shadow-2xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-5 h-5 text-teal-600" />
                <span>Готовый отчет для приема врача-эндокринолога</span>
              </h3>
              <button
                onClick={() => setShowDoctorReport(false)}
                className="text-slate-400 hover:text-slate-700 font-bold"
              >
                ✕
              </button>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              Этот документ структурирован для совместного принятия решений (Shared Decision Making). Скопируйте его или распечатайте перед визитом к врачу.
            </p>

            <pre className="p-4 bg-slate-900 text-teal-300 rounded-xl text-xs font-mono leading-relaxed overflow-x-auto whitespace-pre-wrap border border-slate-800">
              {doctorReportText}
            </pre>

            <div className="flex items-center justify-between pt-2">
              <span className="text-xs text-emerald-600 font-semibold">
                {copied && '✓ Текст успешно скопирован в буфер обмена!'}
              </span>

              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyReport}
                  className="px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-bold text-xs shadow-sm flex items-center space-x-1.5"
                >
                  <Copy className="w-4 h-4" />
                  <span>Скопировать текст</span>
                </button>
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg font-bold text-xs flex items-center space-x-1.5"
                >
                  <Printer className="w-4 h-4" />
                  <span>Распечатать</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
