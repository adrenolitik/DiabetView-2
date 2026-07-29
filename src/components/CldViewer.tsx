import React, { useState } from 'react';
import { CldNode, CldEdge, CldLoop, PatientProfile } from '../types';
import {
  Activity,
  ArrowRight,
  Info,
  Layers,
  Sparkles,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  HelpCircle,
  Award,
  ZapOff,
  Footprints,
  Utensils,
  Target,
  ShieldAlert,
  HeartPulse,
  Pill,
  BookOpen,
} from 'lucide-react';

interface CldViewerProps {
  nodes: CldNode[];
  edges: CldEdge[];
  loops: CldLoop[];
  patient: PatientProfile;
  onSelectNodeForWhatIf: (nodeId: string) => void;
  onNavigateToDigitalTwin: () => void;
}

const ICON_MAP: Record<string, React.FC<{ className?: string }>> = {
  Utensils,
  Activity,
  Award,
  ZapOff,
  Footprints,
  AlertTriangle,
  Target,
  ShieldAlert,
  HeartPulse,
  Pill,
  BookOpen,
};

export const CldViewer: React.FC<CldViewerProps> = ({
  nodes,
  edges,
  loops,
  patient,
  onSelectNodeForWhatIf,
  onNavigateToDigitalTwin,
}) => {
  const [selectedLoopId, setSelectedLoopId] = useState<string | null>(null);
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('glucose');

  const selectedNode = nodes.find((n) => n.id === selectedNodeId);
  const selectedLoop = loops.find((l) => l.id === selectedLoopId);

  // Filtered nodes based on selected loop
  const isNodeHighlighted = (nodeId: string) => {
    if (!selectedLoopId) return true;
    return selectedLoop?.nodeIds.includes(nodeId);
  };

  const getStatusBadge = (status: 'green' | 'yellow' | 'red') => {
    switch (status) {
      case 'green':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-300">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            <span>Норма / Зеленая зона</span>
          </span>
        );
      case 'yellow':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-300">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
            <span>Внимание / Желтая зона</span>
          </span>
        );
      case 'red':
        return (
          <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-100 text-rose-800 border border-rose-300">
            <XCircle className="w-3.5 h-3.5 text-rose-600" />
            <span>Действие! Красная зона</span>
          </span>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Banner (Bento Hero Card) */}
      <div className="bg-gradient-to-r from-indigo-900 via-slate-900 to-indigo-950 rounded-[2rem] p-7 text-white shadow-lg border border-indigo-900/60">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="space-y-2">
            <div className="inline-flex items-center space-x-2 bg-indigo-800/80 border border-indigo-600 text-indigo-200 px-3.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider">
              <Layers className="w-3.5 h-3.5" />
              <span>Уровень 1: Causal Loop Diagrams (CLD)</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
              «Карта моего диабета»: Причинно-следственные связи
            </h2>
            <p className="text-slate-300 text-sm max-w-3xl leading-relaxed">
              Многие пациенты с диабетом 2 типа не видят прямую связь между диетой, движениями и гликированным гемоглобином (HbA1c). Данная интерактивная система Bento-карт показывает все замкнутые петли обратной связи вашего организма.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-5 rounded-2xl flex flex-col justify-center items-center min-w-[210px] shrink-0">
            <span className="text-xs text-indigo-200 font-bold uppercase tracking-widest">Зелёный коридор</span>
            <div className="text-4xl font-black text-white my-1">
              {nodes.filter((n) => n.status === 'green').length} / {nodes.length}
            </div>
            <span className="text-xs text-indigo-200 font-semibold">факторов под контролем</span>
          </div>
        </div>
      </div>

      {/* Loop Filter Tabs (Bento Card) */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center space-x-2">
            <Activity className="w-4 h-4 text-indigo-600" />
            <span>Фильтр петель обратной связи (Causal Loops):</span>
          </h3>
          {selectedLoopId && (
            <button
              onClick={() => setSelectedLoopId(null)}
              className="text-xs text-indigo-600 hover:text-indigo-800 font-bold underline"
            >
              Сбросить фильтр (Показать все 11 факторов)
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => setSelectedLoopId(null)}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
              selectedLoopId === null
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200'
                : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
            }`}
          >
            Все факторы ({nodes.length})
          </button>

          {loops.map((loop) => {
            const isSelected = selectedLoopId === loop.id;
            return (
              <button
                key={loop.id}
                onClick={() => setSelectedLoopId(loop.id)}
                className={`flex items-center space-x-1.5 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? loop.type === 'R'
                      ? 'bg-amber-500 text-white shadow-md shadow-amber-200'
                      : 'bg-emerald-600 text-white shadow-md shadow-emerald-200'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    loop.type === 'R' ? 'bg-amber-300' : 'bg-emerald-300'
                  }`}
                />
                <span>
                  {loop.code}: {loop.title}
                </span>
              </button>
            );
          })}
        </div>

        {selectedLoop && (
          <div className="mt-4 p-4 bg-indigo-50/70 border border-indigo-100 rounded-2xl text-xs text-indigo-950 leading-relaxed">
            <strong className="font-bold text-indigo-950">
              {selectedLoop.code} [{selectedLoop.type === 'R' ? 'Усиливающая петля (R)' : 'Балансирующая петля (B)'}]:
            </strong>{' '}
            {selectedLoop.description}
          </div>
        )}
      </div>

      {/* Main Grid: Interactive Canvas Nodes + Detail Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): CLD Interactive Node Cards */}
        <div className="lg:col-span-2 space-y-5">
          <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest">
                Карта 11 факторов и рычагов воздействия
              </h3>
              <span className="text-xs text-indigo-600 font-bold">
                Нажмите для детализации
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {nodes.map((node) => {
                const isHighlighted = isNodeHighlighted(node.id);
                const isSelected = selectedNodeId === node.id;
                const IconComponent = ICON_MAP[node.iconName] || Activity;

                return (
                  <div
                    key={node.id}
                    onClick={() => setSelectedNodeId(node.id)}
                    className={`p-5 rounded-2xl border transition-all cursor-pointer relative overflow-hidden ${
                      isSelected
                        ? 'border-indigo-600 bg-indigo-50/50 shadow-md ring-2 ring-indigo-500/20'
                        : isHighlighted
                        ? 'border-slate-200 bg-white hover:border-indigo-300 hover:shadow-sm'
                        : 'border-slate-200 bg-slate-50/50 opacity-40 hover:opacity-80'
                    }`}
                  >
                    {/* Top row: Icon + Label + Status */}
                    <div className="flex items-start justify-between gap-2">
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-white shadow-sm ${
                            node.status === 'red'
                              ? 'bg-rose-500'
                              : node.status === 'yellow'
                              ? 'bg-amber-500'
                              : 'bg-emerald-500'
                          }`}
                        >
                          <IconComponent className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-900 text-sm leading-tight">
                            {node.label}
                          </h4>
                          <span className="text-xs font-bold text-slate-400">
                            {node.valueDisplay} ({node.unit})
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col items-end">
                        {getStatusBadge(node.status)}
                      </div>
                    </div>

                    {/* Leverage Score Badge & Loops */}
                    <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-1 text-slate-600">
                        <span className="font-semibold text-slate-400 text-[11px] uppercase tracking-wider">Рычаг:</span>
                        <span className="font-black text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-lg border border-indigo-100">
                          {node.leverageScore}/10
                        </span>
                      </div>

                      <div className="flex items-center space-x-1">
                        {node.loopsPassed.map((lp) => (
                          <span
                            key={lp}
                            className="px-2 py-0.5 rounded-md text-[10px] font-bold bg-slate-100 text-slate-700 border border-slate-200"
                          >
                            {lp}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Core Leverage Points Section (Bento Card) */}
          <div className="bg-slate-900 rounded-[2rem] p-6 text-white shadow-md border border-slate-800">
            <h3 className="text-xs font-bold text-indigo-400 uppercase tracking-widest flex items-center space-x-2 mb-4">
              <Sparkles className="w-4 h-4 text-indigo-400" />
              <span>Главные рычаги влияния (Leverage Points):</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">1. Связь поведение → HbA1c</span>
                  <span className="text-indigo-400 font-black text-sm">10 / 10</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  Когда пациент видит причинный граф, страх осложнений превращается в осознанную мотивацию.
                </p>
              </div>

              <div className="p-4 bg-slate-800/80 rounded-2xl border border-slate-700/80">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="font-bold text-white">2. Постпрандиальная ходьба</span>
                  <span className="text-indigo-400 font-black text-sm">9 / 10</span>
                </div>
                <p className="text-slate-300 leading-relaxed">
                  20-30 минут ходьбы после еды напрямую утилизируют глюкозу через GLUT-4 без дополнительного инсулина.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Node Inspector & Counterfactual Trigger */}
        <div className="space-y-4">
          {selectedNode ? (
            <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200 sticky top-20 space-y-4">
              <div className="flex items-center space-x-3 pb-4 border-b border-slate-100">
                <div
                  className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold text-white shadow-sm ${
                    selectedNode.status === 'red'
                      ? 'bg-rose-500'
                      : selectedNode.status === 'yellow'
                      ? 'bg-amber-500'
                      : 'bg-emerald-500'
                  }`}
                >
                  <Activity className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 text-base">{selectedNode.label}</h3>
                  <span className="text-xs font-bold text-slate-400">
                    Текущее значение: {selectedNode.valueDisplay}
                  </span>
                </div>
              </div>

              <div className="space-y-4 text-xs leading-relaxed text-slate-700">
                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">Описание:</h4>
                  <p className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                    {selectedNode.description}
                  </p>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-indigo-700 uppercase tracking-wider flex items-center space-x-1 mb-1">
                    <HelpCircle className="w-3.5 h-3.5 text-indigo-600" />
                    <span>Вопрос «Что если?»:</span>
                  </h4>
                  <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-xl text-indigo-950 font-bold">
                    «{selectedNode.counterfactualHint}»
                  </div>
                </div>

                <div>
                  <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1.5">Петли обратной связи:</h4>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedNode.loopsPassed.map((loopCode) => {
                      const lp = loops.find((l) => l.code === loopCode);
                      return (
                        <span
                          key={loopCode}
                          className="px-2.5 py-1 bg-slate-100 border border-slate-200 rounded-lg text-[11px] font-bold text-slate-800"
                        >
                          {loopCode}: {lp?.title || ''}
                        </span>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-4 space-y-2 border-t border-slate-100">
                <button
                  onClick={() => onSelectNodeForWhatIf(selectedNode.id)}
                  className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white rounded-2xl font-bold text-xs shadow-md shadow-indigo-200 flex items-center justify-center space-x-2 transition-all active:scale-95"
                >
                  <span>Моделировать сценарий {selectedNode.label}</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={onNavigateToDigitalTwin}
                  className="w-full py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-2xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <span>Перейти в Digital Twin симулятор</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-center text-slate-500 text-xs">
              <Info className="w-8 h-8 mx-auto text-slate-400 mb-2" />
              <p>Выберите фактор из списка слева для детализации.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
