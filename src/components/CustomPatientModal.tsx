import React, { useState, useEffect } from 'react';
import { PatientProfile } from '../types';
import { UserCheck, X } from 'lucide-react';

interface CustomPatientModalProps {
  currentPatient: PatientProfile;
  isOpen: boolean;
  onClose: () => void;
  onSaveCustomPatient: (updatedPatient: PatientProfile) => void;
}

export const CustomPatientModal: React.FC<CustomPatientModalProps> = ({
  currentPatient,
  isOpen,
  onClose,
  onSaveCustomPatient,
}) => {
  // IMPORTANT: All hooks must run unconditionally on every render (Rules of Hooks).
  // The previous version returned null BEFORE calling useState, which breaks
  // hook call order whenever `isOpen` toggles and causes React errors/inconsistent state.
  const [name, setName] = useState(currentPatient.name);
  const [age, setAge] = useState(currentPatient.age);
  const [hba1c, setHba1c] = useState(currentPatient.hba1c);
  const [bmi, setBmi] = useState(currentPatient.bmi);
  const [activityMinutes, setActivityMinutes] = useState(currentPatient.activityMinutes);
  const [carbsGrams, setCarbsGrams] = useState(currentPatient.carbsGrams);
  const [medication, setMedication] = useState(currentPatient.medication);
  const [avgGlucose, setAvgGlucose] = useState(currentPatient.avgGlucose);

  // Keep the form in sync whenever a different patient is selected while the modal is closed.
  useEffect(() => {
    if (isOpen) {
      setName(currentPatient.name);
      setAge(currentPatient.age);
      setHba1c(currentPatient.hba1c);
      setBmi(currentPatient.bmi);
      setActivityMinutes(currentPatient.activityMinutes);
      setCarbsGrams(currentPatient.carbsGrams);
      setMedication(currentPatient.medication);
      setAvgGlucose(currentPatient.avgGlucose);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, currentPatient.id]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveCustomPatient({
      ...currentPatient,
      name,
      age: Number(age),
      hba1c: Number(hba1c),
      bmi: Number(bmi),
      activityMinutes: Number(activityMinutes),
      carbsGrams: Number(carbsGrams),
      medication,
      avgGlucose: Number(avgGlucose),
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-[2rem] max-w-lg w-full p-7 shadow-2xl border border-slate-200 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
            <UserCheck className="w-5 h-5 text-indigo-600" />
            <span>Персональные клинические показатели</span>
          </h3>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 font-bold p-1 rounded-full hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">ФИО / Имя:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Возраст (лет):</label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-semibold bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">HbA1c (%):</label>
              <input
                type="number"
                step="0.1"
                value={hba1c}
                onChange={(e) => setHba1c(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-black text-rose-600 bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">ИМТ (кг/м²):</label>
              <input
                type="number"
                step="0.5"
                value={bmi}
                onChange={(e) => setBmi(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Средний сахар:</label>
              <input
                type="number"
                step="0.1"
                value={avgGlucose}
                onChange={(e) => setAvgGlucose(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-bold bg-slate-50"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="font-bold text-slate-700 block mb-1">Активность (мин/день):</label>
              <input
                type="number"
                value={activityMinutes}
                onChange={(e) => setActivityMinutes(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50"
              />
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Углеводы в день (г):</label>
              <input
                type="number"
                value={carbsGrams}
                onChange={(e) => setCarbsGrams(Number(e.target.value))}
                className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50"
              />
            </div>
          </div>

          <div>
            <label className="font-bold text-slate-700 block mb-1">Принимаемые препараты:</label>
            <input
              type="text"
              value={medication}
              onChange={(e) => setMedication(e.target.value)}
              placeholder="Метформин 1000 мг 2 р/сутки"
              className="w-full p-3 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500 font-medium bg-slate-50"
            />
          </div>

          <div className="flex items-center justify-end space-x-2 pt-4 border-t border-slate-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold transition-colors"
            >
              Отмена
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold shadow-md shadow-indigo-200 transition-all active:scale-95"
            >
              Сохранить и обновить модели
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
