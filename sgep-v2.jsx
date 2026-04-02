import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Play, Pause, Plus, Shield, Users, BarChart3,
  Clock, AlertTriangle, CheckCircle2,
  FileText, Table2, AlertCircle, Calendar,
  Filter, ArrowRight, Target, Trash2, Search, X,
  Undo2, Redo2, Save, History as HistoryIcon, Download, Settings, Info, Upload, GripVertical,
  User as UserIcon, ChevronRight, Layers, Activity, BookOpen, Columns
} from 'lucide-react';

// ============================================================================
// CONFIGURAÇÃO BACKEND
// ============================================================================
const USE_MOCK_BACKEND = true;

// ============================================================================
// DADOS
// ============================================================================
const INITIAL_USERS = [
  { id: 1, name: 'Antônio (Chefe DIGEP)', email: 'admin',                        role: 'admin', modality: 'Teletrabalho parcial', hoursPerMonth: 56, monitoramentos: 0 },
  { id: 2, name: 'Luiz Felipe D\'Almeida', email: 'luiz.felipe@inpi.gov.br',     role: 'user',  modality: 'Presencial',            hoursPerMonth: 56, monitoramentos: 3 },
  { id: 3, name: 'Thais Carvalho',         email: 'thais.carvalho@inpi.gov.br',  role: 'user',  modality: 'Teletrabalho parcial', hoursPerMonth: 56, monitoramentos: 2 },
  { id: 4, name: 'Diego Hervé',            email: 'diego.herve@inpi.gov.br',     role: 'user',  modality: 'Teletrabalho parcial', hoursPerMonth: 56, monitoramentos: 2 },
];

const INITIAL_ENTREGAS_MACRO = [
  { id:  1, processos: 'Entregas de Rotina',      entrega: 'Central de Monitoramento do Plano de Ação atualizada com resultados de dezembro',                peso: 30, prazo: '2026-12-31', area: 'DIGEP' },
  { id:  2, processos: 'Entregas de Rotina',      entrega: 'Reuniões de M&A de projetos estratégicos realizadas e base de dados qualitativa atualizada',     peso: 30, prazo: '2026-12-31', area: 'DIGEP' },
  { id:  3, processos: 'Entregas de Rotina',      entrega: 'Relatório de recursos críticos atualizados',                                                     peso: 30, prazo: '2026-12-31', area: 'DIGEP' },
  { id:  4, processos: 'Entregas de Rotina',      entrega: 'Relatório de M&A do Plano de Ação 2026 elaborado',                                               peso: 30, prazo: '2026-12-31', area: 'DIGEP' },
  { id:  5, processos: 'Entregas de Rotina',      entrega: 'Relatório de monitoramento das metas e entregas do INPI no Plano de Ação da ENPI elaborado',      peso: 30, prazo: '2026-12-31', area: 'DIGEP' },
  { id:  6, processos: 'Entregas de Rotina',      entrega: 'Relatório de monitoramento das metas e entregas do INPI no PPA 2024-2027 elaborado',              peso: 30, prazo: '2026-12-31', area: 'DIGEP' },
  { id:  7, processos: 'Projetos de Melhoria',    entrega: 'Portfólio de projetos estratégicos do Plano de Ação 2027 aprovado',                              peso: 60, prazo: '2026-11-30', area: 'DIGEP' },
  { id:  8, processos: 'Projetos de Melhoria',    entrega: 'Proposta de diretrizes gerais para ocupação e capacitação dos Cargos de Chefe de Projeto II',    peso: 30, prazo: '2026-04-30', area: 'DIGEP' },
  { id:  9, processos: 'Projetos de Melhoria',    entrega: 'Criação do Comitê de Projetos Estratégicos',                                                     peso: 30, prazo: '2026-03-31', area: 'DIGEP' },
  { id: 10, processos: 'Projetos de Melhoria',    entrega: 'Guia de Gerenciamento de Projetos Estratégicos do INPI elaborado',                               peso: 60, prazo: '2026-06-30', area: 'DIGEP' },
  { id: 11, processos: 'Projetos de Melhoria',    entrega: 'Nova versão da Central de Monitoramento do Plano de Ação implantada',                            peso: 30, prazo: '2026-04-30', area: 'DIGEP' },
  { id: 12, processos: 'Projetos de Melhoria',    entrega: 'Versão para celular do BI da Central de Monitoramento do Plano de Ação construída',              peso: 30, prazo: '2026-06-30', area: 'DIGEP' },
  { id: 13, processos: 'Projetos de Melhoria',    entrega: 'Treinamento interno na metodologia de gerenciamento de projetos do INPI realizado',              peso: 30, prazo: '2026-06-30', area: 'DIGEP' },
];

const INITIAL_TASKS = [
  { id: 101, title: 'Central de Monitoramento do Plano de Ação atualizada com resultados de dezembro', etapas: 'Extração e atualização dos dados (5º dia útil)', assigned_to: 2, has_collaborator: true,  status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 102, title: 'Central de Monitoramento do Plano de Ação atualizada com resultados de dezembro', etapas: 'Publicação (dia 10)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 103, title: 'Central de Monitoramento do Plano de Ação atualizada com resultados de dezembro', etapas: 'Divulgação no INPI Informa (dia 15)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 201, title: 'Reuniões de M&A de projetos estratégicos realizadas e base de dados qualitativa atualizada', etapas: 'Reuniões com Gerentes de Projeto (5º dia útil)', assigned_to: 1, has_collaborator: true, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 202, title: 'Reuniões de M&A de projetos estratégicos realizadas e base de dados qualitativa atualizada', etapas: 'Consolidação das atualizações na matriz qualitativa (6º dia útil)', assigned_to: 1, has_collaborator: true, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 301, title: 'Relatório de recursos críticos atualizados', etapas: 'Consolidação das informações', assigned_to: 3, has_collaborator: true, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 302, title: 'Relatório de recursos críticos atualizados', etapas: 'Envio à CGPE, CGTI, CGLI e CGOF (8º dia útil)', assigned_to: 3, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 401, title: 'Relatório de M&A do Plano de Ação 2026 elaborado', etapas: 'Consolidação das informações de projetos na minuta (dia 19)', assigned_to: 4, has_collaborator: true, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 402, title: 'Relatório de M&A do Plano de Ação 2026 elaborado', etapas: 'Instrução processual no SEI para envio à DIREX', assigned_to: 4, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 501, title: 'Relatório de monitoramento das metas e entregas do INPI no Plano de Ação da ENPI elaborado', etapas: 'Validação das informações de status junto aos gestores (Pontos Focais ENPI)', assigned_to: 3, has_collaborator: true, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 502, title: 'Relatório de monitoramento das metas e entregas do INPI no Plano de Ação da ENPI elaborado', etapas: 'Consolidação da planilha e preparação para envio ao MDIC', assigned_to: 3, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 503, title: 'Relatório de monitoramento das metas e entregas do INPI no Plano de Ação da ENPI elaborado', etapas: 'Instrução processual no SEI para envio à DIREX', assigned_to: 3, has_collaborator: false, status: 'Pendente', data_criacao: '2026-02-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 601, title: 'Relatório de monitoramento das metas e entregas do INPI no PPA 2024-2027 elaborado', etapas: 'Monitoramento e atualização dos dados do PPA junto às áreas', assigned_to: 4, has_collaborator: true, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 602, title: 'Relatório de monitoramento das metas e entregas do INPI no PPA 2024-2027 elaborado', etapas: 'Instrução processual no SEI para envio à DIREX', assigned_to: 4, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-12-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 701, title: 'Portfólio de projetos estratégicos do Plano de Ação 2027 aprovado', etapas: 'Pré-Projeto', assigned_to: 2, has_collaborator: true, status: 'Pendente', data_criacao: '2026-07-01', data_fim: '2026-08-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 60 },
  { id: 702, title: 'Portfólio de projetos estratégicos do Plano de Ação 2027 aprovado', etapas: 'Projeto Básico', assigned_to: 3, has_collaborator: true, status: 'Pendente', data_criacao: '2026-09-01', data_fim: '2026-09-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 60 },
  { id: 703, title: 'Portfólio de projetos estratégicos do Plano de Ação 2027 aprovado', etapas: 'Projeto Executivo', assigned_to: 4, has_collaborator: true, status: 'Pendente', data_criacao: '2026-10-01', data_fim: '2026-11-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 60 },
  { id: 801, title: 'Proposta de diretrizes gerais para ocupação e capacitação dos Cargos de Chefe de Projeto II', etapas: 'Elaboração de proposta preliminar (Março)', assigned_to: 4, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 802, title: 'Proposta de diretrizes gerais para ocupação e capacitação dos Cargos de Chefe de Projeto II', etapas: 'Alinhamento de expectativas com Dirigentes (Fev/Março)', assigned_to: 4, has_collaborator: false, status: 'Pendente', data_criacao: '2026-02-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 803, title: 'Proposta de diretrizes gerais para ocupação e capacitação dos Cargos de Chefe de Projeto II', etapas: 'Apresentação de proposta ao CGI (Abril)', assigned_to: 4, has_collaborator: false, status: 'Pendente', data_criacao: '2026-04-01', data_fim: '2026-04-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 901, title: 'Criação do Comitê de Projetos Estratégicos', etapas: 'Validação da proposta com CGTI, CGLI, CGOF e áreas de governança (Mar)', assigned_to: 1, has_collaborator: false, status: 'Pendente', data_criacao: '2026-01-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 902, title: 'Criação do Comitê de Projetos Estratégicos', etapas: 'Proposta validada com DIREX (Março)', assigned_to: 1, has_collaborator: false, status: 'Pendente', data_criacao: '2026-03-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1001, title: 'Guia de Gerenciamento de Projetos Estratégicos do INPI elaborado', etapas: 'Consolidação da experiência piloto na elaboração do PA2026 (Abril)', assigned_to: 3, has_collaborator: false, status: 'Pendente', data_criacao: '2026-03-01', data_fim: '2026-04-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 60 },
  { id: 1002, title: 'Guia de Gerenciamento de Projetos Estratégicos do INPI elaborado', etapas: 'Validação do guia com comunidade de projetos (Maio)', assigned_to: 3, has_collaborator: true, status: 'Pendente', data_criacao: '2026-05-01', data_fim: '2026-05-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 60 },
  { id: 1003, title: 'Guia de Gerenciamento de Projetos Estratégicos do INPI elaborado', etapas: 'Aprovação pela DIREX e publicação (Junho)', assigned_to: 3, has_collaborator: false, status: 'Pendente', data_criacao: '2026-06-01', data_fim: '2026-06-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 60 },
  { id: 1101, title: 'Nova versão da Central de Monitoramento do Plano de Ação implantada', etapas: 'Elaboração de novo layout (Mar)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-03-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1102, title: 'Nova versão da Central de Monitoramento do Plano de Ação implantada', etapas: 'Desenvolvimento dos indicadores estratégicos de projetos (Mar)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-03-01', data_fim: '2026-03-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1103, title: 'Nova versão da Central de Monitoramento do Plano de Ação implantada', etapas: 'Homologação dos indicadores pela CGPE/DIREX e divulgação (Abril)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-04-01', data_fim: '2026-04-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1201, title: 'Versão para celular do BI da Central de Monitoramento do Plano de Ação construída', etapas: 'Estudo de ferramentas viáveis (Abril)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-04-01', data_fim: '2026-04-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1202, title: 'Versão para celular do BI da Central de Monitoramento do Plano de Ação construída', etapas: 'Desenvolvimento da versão para celular (Junho)', assigned_to: 2, has_collaborator: false, status: 'Pendente', data_criacao: '2026-05-01', data_fim: '2026-06-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1301, title: 'Treinamento interno na metodologia de gerenciamento de projetos do INPI realizado', etapas: 'Preparação do treinamento (Maio)', assigned_to: 1, has_collaborator: false, status: 'Pendente', data_criacao: '2026-05-01', data_fim: '2026-05-31', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
  { id: 1302, title: 'Treinamento interno na metodologia de gerenciamento de projetos do INPI realizado', etapas: 'Realização de pelo menos 2 turmas com todos os Gerentes de Projeto (Junho)', assigned_to: 1, has_collaborator: true, status: 'Pendente', data_criacao: '2026-06-01', data_fim: '2026-06-30', is_running: false, actual_seconds: 0, data_conclusao: null, peso2: 30 },
];

const DEFAULT_CONFIG = {
  alphaParameter:   0.5,
  factorPresencial: 1.0,
  factorParcial:    1.2,
  factorIntegral:   1.3,
  entregasMacro:    INITIAL_ENTREGAS_MACRO,
  logoUrl:          '',
};

// Ordem padrão das colunas da tabela
const DEFAULT_COLUMN_ORDER = [
  'actions', 'farol', 'entrega', 'peso2', 'atividade',
  'cronograma', 'carga', 'responsavel', 'colabs', 'tempo', 'conclusao', 'status'
];

// ============================================================================
// UTILITÁRIOS
// ============================================================================
const getMonthsDifference = (s, e) => {
  const start = new Date(s + 'T12:00:00'), end = new Date(e + 'T12:00:00');
  let m = (end.getFullYear() - start.getFullYear()) * 12 - start.getMonth() + end.getMonth();
  return Math.max(1, m + 1);
};
const formatTime = (ts) => {
  if (!ts) return '00:00:00';
  return [Math.floor(ts/3600), Math.floor((ts%3600)/60), ts%60].map(n => String(n).padStart(2,'0')).join(':');
};
const formatMonthName = (ym) => {
  if (ym === 'all') return 'Todo o Período';
  const [y, m] = ym.split('-');
  return new Date(+y, +m-1, 1).toLocaleString('pt-BR', { month:'long', year:'numeric' }).toUpperCase();
};

// ============================================================================
// COMPONENTES REUTILIZÁVEIS
// ============================================================================
const FarolBadge = ({ label }) => {
  const cfgMap = {
    'Concluído': { cls: 'bg-blue-50 text-blue-700 border-blue-200',       icon: <CheckCircle2 size={11}/> },
    'Atrasado':  { cls: 'bg-red-50 text-red-700 border-red-200',           icon: <AlertTriangle size={11}/> },
    'Perto':     { cls: 'bg-amber-50 text-amber-700 border-amber-200',     icon: <AlertCircle size={11}/> },
    'Longe':     { cls: 'bg-emerald-50 text-emerald-700 border-emerald-200', icon: <CheckCircle2 size={11}/> },
  };
  const { cls, icon } = cfgMap[label] || { cls: 'bg-gray-50 text-gray-500 border-gray-200', icon: null };
  return <span className={`inline-flex items-center gap-1 px-2 py-1 rounded text-[11px] font-bold border ${cls}`}>{icon}{label}</span>;
};

const PesoBadge = ({ peso, label = 'MACRO' }) => {
  const cls = { 10:'bg-slate-100 text-slate-500 border-slate-200', 30:'bg-indigo-50 text-indigo-600 border-indigo-200', 60:'bg-violet-50 text-violet-700 border-violet-200' }[peso] || 'bg-gray-100 text-gray-500 border-gray-200';
  return <span className={`text-[9px] font-black tracking-widest px-1.5 py-0.5 rounded border uppercase ${cls}`}>{label}: {peso}</span>;
};

const ProgressRing = ({ pct, color, size = 60 }) => {
  const r = (size - 8) / 2, circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} style={{ transform:'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#E5E7EB" strokeWidth="6"/>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="6"
        strokeDasharray={circ} strokeDashoffset={circ - (Math.min(pct,100)/100)*circ}
        strokeLinecap="round" style={{ transition:'stroke-dashoffset .8s ease' }}/>
    </svg>
  );
};

const NavItem = ({ icon, label, active, onClick }) => (
  <button onClick={onClick}
    className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 ${active ? 'bg-white/15 text-white shadow-sm' : 'text-blue-200/70 hover:bg-white/8 hover:text-white'}`}>
    <span className={`flex-shrink-0 ${active ? 'text-white' : 'text-blue-300/60'}`}>{icon}</span>
    <span className="truncate">{label}</span>
    {active && <ChevronRight size={14} className="ml-auto text-blue-300/60"/>}
  </button>
);

const Peso2Select = ({ value, onChange, disabled }) => {
  const cls = { 10:'bg-slate-50 text-slate-600 border-slate-200', 30:'bg-indigo-50 text-indigo-700 border-indigo-200', 60:'bg-violet-50 text-violet-700 border-violet-200' }[value] || 'bg-gray-50 text-gray-600 border-gray-200';
  return (
    <select value={value} onChange={e => onChange(parseInt(e.target.value))} disabled={disabled}
      className={`text-[11px] font-black rounded-lg px-2 py-1.5 border focus:outline-none transition-colors ${cls} ${disabled ? 'cursor-default opacity-60' : 'cursor-pointer'}`}>
      <option value={10}>10 pts</option>
      <option value={30}>30 pts</option>
      <option value={60}>60 pts</option>
    </select>
  );
};

// ============================================================================
// APP
// ============================================================================
export default function App() {
  const [users,          setUsers]          = useState(INITIAL_USERS);
  const [currentUser,    setCurrentUser]    = useState(INITIAL_USERS[0]);
  const [currentView,    setCurrentView]    = useState('tabela_dinamica');
  const [selectedMonth,  setSelectedMonth]  = useState('all');
  const [systemConfig,   setSystemConfig]   = useState(DEFAULT_CONFIG);
  const [tempConfig,     setTempConfig]     = useState(DEFAULT_CONFIG);
  const [tempUsers,      setTempUsers]      = useState(INITIAL_USERS);
  const [tasks,          setTasks]          = useState(INITIAL_TASKS);
  const [history,        setHistory]        = useState([{ timestamp: Date.now(), data: INITIAL_TASKS }]);
  const [historyIndex,   setHistoryIndex]   = useState(0);
  const [draggedRowId,   setDraggedRowId]   = useState(null);
  const [draggedColId,   setDraggedColId]   = useState(null);
  const [columnOrder,    setColumnOrder]    = useState(DEFAULT_COLUMN_ORDER);
  const [showTaskForm,   setShowTaskForm]   = useState(false);
  const [taskToDelete,   setTaskToDelete]   = useState(null);
  const [toastMessage,   setToastMessage]   = useState(null);
  const [showBackupModal,setShowBackupModal]= useState(false);
  const [backupToRestore,setBackupToRestore]= useState(null);
  const [backups,        setBackups]        = useState([]);
  const [tableFilters,   setTableFilters]   = useState({ projeto:'all', etapa:'', mes:'all', responsavel:'all', status:'all', colaborador:'all' });
  const [newTask, setNewTask] = useState({
    title: INITIAL_ENTREGAS_MACRO[0]?.entrega || '', etapas: '', assigned_to: 1,
    data_criacao: new Date().toISOString().split('T')[0],
    data_fim:     new Date().toISOString().split('T')[0],
    peso2: 30
  });

  useEffect(() => { setTempUsers(users); }, [users]);
  useEffect(() => {
    const t = setInterval(() => {
      setTasks(prev => prev.map(tk => tk.is_running ? { ...tk, actual_seconds: (tk.actual_seconds || 0) + 1 } : tk));
    }, 1000);
    return () => clearInterval(t);
  }, []);

  const showToast = (msg) => { setToastMessage(msg); setTimeout(() => setToastMessage(null), 3500); };

  // Fator de modalidade — lê do systemConfig
  const getModalityFactor = (modality) => {
    if (!modality) return systemConfig.factorPresencial;
    const m = modality.toLowerCase();
    if (m.includes('parcial'))  return systemConfig.factorParcial;
    if (m.includes('integral')) return systemConfig.factorIntegral;
    return systemConfig.factorPresencial;
  };

  const uniqueProjects = useMemo(() => Array.from(new Set(systemConfig.entregasMacro.map(m => m.entrega))), [systemConfig.entregasMacro]);

  // Helpers CRUD
  const commitTasks = (newTasks) => {
    setTasks(newTasks);
    const h = history.slice(0, historyIndex + 1);
    h.push({ timestamp: Date.now(), data: newTasks });
    setHistory(h);
    setHistoryIndex(h.length - 1);
  };
  const handleUndo = () => { if (historyIndex > 0) { setHistoryIndex(historyIndex-1); setTasks(history[historyIndex-1].data); } };
  const handleRedo = () => { if (historyIndex < history.length-1) { setHistoryIndex(historyIndex+1); setTasks(history[historyIndex+1].data); } };

  const handleCreateBackup   = () => { const b = { id: Date.now(), label: `Imagem — ${new Date().toLocaleString('pt-BR')}`, data: tasks }; setBackups([b, ...backups]); showToast("Imagem salva!"); };
  const confirmRestoreBackup = () => { if (backupToRestore) { commitTasks(backupToRestore.data); setBackupToRestore(null); setShowBackupModal(false); showToast("Sistema restaurado!"); } };

  const handleStatusChange   = (id, v) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, status:v, is_running:(v==='Concluído'||v==='Pendente')?false:t.is_running, data_conclusao:v==='Concluído'?(t.data_conclusao||new Date().toISOString()):null }));
  const toggleTimer          = (id) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, is_running:!t.is_running, status:!t.is_running?'Em andamento':t.status }));
  const toggleCollaborator   = (id) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, has_collaborator:!t.has_collaborator }));
  const handleTitleChange    = (id, v) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, title:v }));
  const handleAssigneeChange = (id, v) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, assigned_to:v }));
  const handleDateChange     = (id, f, v) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, [f]:v }));
  const handlePeso2Change    = (id, v) => commitTasks(tasks.map(t => t.id!==id?t:{ ...t, peso2:v }));

  const handleAddTask = (e) => {
    e.preventDefault();
    const task = { id: Date.now(), title:newTask.title, etapas:newTask.etapas, assigned_to:newTask.assigned_to, has_collaborator:false, status:'Pendente', data_criacao:newTask.data_criacao, data_fim:newTask.data_fim, is_running:false, actual_seconds:0, data_conclusao:null, peso2:newTask.peso2||30 };
    commitTasks([task, ...tasks]);
    if (!systemConfig.entregasMacro.find(m => m.entrega===task.title)) {
      const nm = { id:Date.now()+1, processos:'A Definir', entrega:task.title, peso:30, prazo:'', area:'DIGEP' };
      const upd = [nm, ...systemConfig.entregasMacro];
      setSystemConfig(p => ({ ...p, entregasMacro:upd }));
      setTempConfig(p => ({ ...p, entregasMacro:upd }));
    }
    setShowTaskForm(false);
    setNewTask({ title:systemConfig.entregasMacro[0]?.entrega||'', etapas:'', assigned_to:1, data_criacao:new Date().toISOString().split('T')[0], data_fim:new Date().toISOString().split('T')[0], peso2:30 });
    showToast("Atividade cadastrada!");
  };
  const confirmDelete = () => { if (taskToDelete) { commitTasks(tasks.filter(t => t.id!==taskToDelete)); setTaskToDelete(null); showToast("Atividade removida!"); } };

  const handleSaveConfig = (e) => {
    e.preventDefault();
    const nc = { alphaParameter:parseFloat(tempConfig.alphaParameter), factorPresencial:parseFloat(tempConfig.factorPresencial), factorParcial:parseFloat(tempConfig.factorParcial), factorIntegral:parseFloat(tempConfig.factorIntegral), entregasMacro:[...tempConfig.entregasMacro], logoUrl:tempConfig.logoUrl };
    setSystemConfig(nc);
    setUsers(tempUsers);
    const upd = tempUsers.find(u => u.id===currentUser.id);
    if (upd) { setCurrentUser(upd); if (upd.role!=='admin' && currentView==='configuracoes') setCurrentView('tabela_dinamica'); }
    showToast("Configurações salvas!");
  };

  const handleAddEntregaMacro    = () => setTempConfig(p => ({ ...p, entregasMacro:[{ id:Date.now(), processos:'', entrega:'Nova Entrega', peso:30, prazo:'', area:'' }, ...p.entregasMacro] }));
  const handleRemoveEntregaMacro = (id) => setTempConfig(p => ({ ...p, entregasMacro:p.entregasMacro.filter(m => m.id!==id) }));
  const handleEntregaMacroChange = (id, f, v) => setTempConfig(p => ({ ...p, entregasMacro:p.entregasMacro.map(m => m.id===id?{...m,[f]:v}:m) }));
  const handleAddTempUser        = () => setTempUsers([...tempUsers, { id:Date.now(), name:'Novo Servidor', email:'servidor@inpi.gov.br', role:'user', modality:'Presencial', hoursPerMonth:56, monitoramentos:0 }]);
  const handleRemoveTempUser     = (id) => tempUsers.length>1 && setTempUsers(tempUsers.filter(u => u.id!==id));
  const handleTempUserChange     = (id, f, v) => setTempUsers(tempUsers.map(u => u.id===id?{...u,[f]:v}:u));
  const handleLogoUpload = (e) => { const f=e.target.files[0]; if(!f) return; const r=new FileReader(); r.onload=ev=>{ setSystemConfig(p=>({...p,logoUrl:ev.target.result})); setTempConfig(p=>({...p,logoUrl:ev.target.result})); showToast("Logotipo atualizado!"); }; r.readAsDataURL(f); };
  const handleFileUpload = (e) => {
    const f=e.target.files[0]; if(!f) return;
    const r=new FileReader();
    r.onload=ev=>{
      try {
        const csv=ev.target.result, sep=csv.includes(';')?';':',';
        const rows=csv.split('\n').map(r=>r.trim()).filter(Boolean);
        if(rows.length<2) throw new Error();
        const ne=[];
        for(let i=1;i<rows.length;i++){const row=rows[i].split(sep);if(row.length>=2)ne.push({id:Date.now()+i,processos:row[0]?.replace(/["']/g,'')||'',entrega:row[1]?.replace(/["']/g,'')||'',peso:parseInt(row[2])||30,prazo:row[3]?.replace(/["']/g,'')||'',area:row[4]?.replace(/["']/g,'')||''});}
        if(ne.length>0){setTempConfig(p=>({...p,entregasMacro:ne}));showToast(`${ne.length} entregas importadas!`);}
      } catch { showToast("Erro ao processar CSV."); }
    };
    r.readAsText(f,'UTF-8');
  };

  // Drag & drop — LINHAS
  const handleRowDragStart = (e, id) => { setDraggedRowId(id); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('type','row'); };
  const handleRowDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect='move'; };
  const handleRowDrop = (e, targetId) => {
    e.preventDefault();
    if (draggedRowId===targetId || !draggedRowId) return;
    const arr=[...tasks], fi=arr.findIndex(t=>t.id===draggedRowId), ti=arr.findIndex(t=>t.id===targetId);
    if(fi===-1||ti===-1) return;
    const [item]=arr.splice(fi,1); arr.splice(ti,0,item);
    commitTasks(arr); setDraggedRowId(null);
  };

  // Drag & drop — COLUNAS
  const handleColDragStart = (e, colId) => { e.stopPropagation(); setDraggedColId(colId); e.dataTransfer.effectAllowed='move'; e.dataTransfer.setData('type','col'); };
  const handleColDragOver  = (e) => { e.preventDefault(); e.dataTransfer.dropEffect='move'; };
  const handleColDrop = (e, targetColId) => {
    e.preventDefault();
    if (!draggedColId || draggedColId===targetColId || draggedColId==='actions') return;
    const arr=[...columnOrder];
    const fi=arr.indexOf(draggedColId), ti=arr.indexOf(targetColId);
    if(fi===-1||ti===-1) return;
    arr.splice(fi,1); arr.splice(ti,0,draggedColId);
    setColumnOrder(arr); setDraggedColId(null);
  };

  // ============================================================================
  // MOTOR MATEMÁTICO — CARGA HORÁRIA (usa peso MACRO)
  // ============================================================================
  const tasksWithCalculations = useMemo(() => {
    return tasks.map(task => {
      const user = users.find(u => u.id===task.assigned_to) || { id:task.assigned_to, name:'Excluído', modality:'Presencial', hoursPerMonth:0 };
      const H_total = user.hoursPerMonth;
      const taskEnd = new Date(task.data_fim+'T12:00:00');
      const refM = taskEnd.getMonth(), refY = taskEnd.getFullYear();
      const duration_months = getMonthsDifference(task.data_criacao, task.data_fim);

      const monthTasks = tasks.filter(t => {
        if(t.assigned_to!==task.assigned_to) return false;
        const d=new Date(t.data_fim+'T12:00:00');
        return d.getMonth()===refM && d.getFullYear()===refY;
      });

      const eMap = {};
      monthTasks.forEach(t => {
        if(!eMap[t.title]){ const m=systemConfig.entregasMacro.find(m=>m.entrega===t.title); eMap[t.title]={weight:m?m.peso:30,count:0}; }
        eMap[t.title].count++;
      });

      const sumW = Object.values(eMap).reduce((a,v)=>a+v.weight,0);
      const alpha = systemConfig.alphaParameter??0.5;
      let sum_H_req=0;
      monthTasks.forEach(t => {
        const eD=eMap[t.title];
        const h_e=sumW>0?H_total*(eD.weight/sumW):0;
        const h_b=eD.count>0?h_e/eD.count:0;
        sum_H_req+=h_b*(1/Math.pow(t.has_collaborator?2:1,alpha));
      });
      const pool=Math.max(0,H_total-sum_H_req);

      const myED=eMap[task.title]||{weight:30,count:1};
      const H_e_i=sumW>0?H_total*(myED.weight/sumW):0;
      const H_b=myED.count>0?H_e_i/myED.count:0;
      const c=task.has_collaborator?2:1;
      const FR=1/Math.pow(c,alpha);
      const H_req=H_b*FR;
      const H_extra=pool*(H_total>0?H_b/H_total:0);
      const H_final=H_req+H_extra;

      let duracaoHoras=null;
      if(task.status==='Concluído'&&task.data_conclusao&&task.data_criacao)
        duracaoHoras=Math.abs(new Date(task.data_conclusao)-new Date(task.data_criacao+'T00:00:00'))/36e5;

      let farol={label:'Longe'};
      if(task.status==='Concluído') farol={label:'Concluído'};
      else { const d=Math.ceil((taskEnd-new Date())/864e5); if(d<0) farol={label:'Atrasado'}; else if(d<=7) farol={label:'Perto'}; }

      // Peso2 efetivo: se Projetos de Melhoria + colabs → 60 cai para 30
      const macro = systemConfig.entregasMacro.find(m => m.entrega===task.title);
      const isMelhoria = macro?.processos === 'Projetos de Melhoria';
      const effectivePeso2 = (isMelhoria && task.has_collaborator && task.peso2===60) ? 30 : task.peso2;

      return { ...task, user, inherited_weight:myED.weight, duration_months, carga_horaria_mensal:H_final, carga_horaria_total:H_final*duration_months, duracao_calculada:duracaoHoras, farol, effectivePeso2, isMelhoria,
        calcData:{ H_total, sumW, W_i:myED.weight, H_entrega_i:H_e_i, n_i:myED.count, H_atividade_base:H_b, c, alpha, FR, H_req_a:H_req, H_extra, pool_salvo:pool } };
    });
  }, [tasks, users, systemConfig]);

  const availableMonths = useMemo(() => {
    const s=new Set();
    tasks.forEach(t=>{if(t.data_fim){const d=new Date(t.data_fim+'T12:00:00');s.add(`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`);}});
    return Array.from(s).sort();
  }, [tasks]);

  const filteredTasksForTable = useMemo(() => tasksWithCalculations.filter(task => {
    if(tableFilters.projeto!=='all'&&task.title!==tableFilters.projeto) return false;
    if(tableFilters.etapa&&!task.etapas.toLowerCase().includes(tableFilters.etapa.toLowerCase())) return false;
    if(tableFilters.mes!=='all'&&task.data_fim.substring(0,7)!==tableFilters.mes) return false;
    if(tableFilters.responsavel!=='all'&&task.assigned_to.toString()!==tableFilters.responsavel) return false;
    if(tableFilters.status!=='all'&&task.status!==tableFilters.status) return false;
    if(tableFilters.colaborador==='com_colab'&&!task.has_collaborator) return false;
    if(tableFilters.colaborador==='sem_colab'&&task.has_collaborator) return false;
    return true;
  }), [tasksWithCalculations, tableFilters]);

  const clearFilters = () => setTableFilters({ projeto:'all', etapa:'', mes:'all', responsavel:'all', status:'all', colaborador:'all' });
  const hasActiveFilters = Object.values(tableFilters).some(v => v!=='all'&&v!=='');

  // ============================================================================
  // CARGA DE TRABALHO (ex-Dashboard) — usa effectivePeso2 + monitoramentos×60
  // ============================================================================
  const cargaStats = useMemo(() => {
    const filtered = tasksWithCalculations.filter(t => {
      if(selectedMonth==='all') return true;
      const d=new Date(t.data_fim+'T12:00:00');
      return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}`===selectedMonth;
    });

    const presencialFactor = systemConfig.factorPresencial;
    const presencialUsers = users.filter(u => getModalityFactor(u.modality)===presencialFactor);
    let baselinePoints=0;
    if(presencialUsers.length>0){
      const pTasks=filtered.filter(t=>presencialUsers.map(u=>u.id).includes(t.assigned_to));
      const pPts=pTasks.reduce((acc,t)=>acc+(t.effectivePeso2||30),0);
      const pMon=presencialUsers.reduce((acc,u)=>acc+(u.monitoramentos||0)*60,0);
      baselinePoints=(pPts+pMon)/presencialUsers.length;
    }

    return users.map(user => {
      const userTasks=filtered.filter(t=>t.assigned_to===user.id);
      const taskPoints=userTasks.reduce((acc,t)=>acc+(t.effectivePeso2||30),0);
      const monPoints=(user.monitoramentos||0)*60;
      const assignedPoints=taskPoints+monPoints;

      const userFactor=getModalityFactor(user.modality);
      const expectedPoints=Math.round(baselinePoints*userFactor);
      const diff=assignedPoints-expectedPoints;
      const pct=expectedPoints>0?Math.round((assignedPoints/expectedPoints)*100):0;

      let suggestion='', statusColor='', ringColor='#0B2461';
      if(userFactor===presencialFactor){
        suggestion='Linha de Base (100%) — referência do setor.';
        statusColor='bg-blue-50 text-blue-800 border-blue-200'; ringColor='#0B2461';
      } else if(diff===0){
        suggestion=`Carga alinhada (+${Math.round((userFactor-1)*100)}%).`;
        statusColor='bg-emerald-50 text-emerald-800 border-emerald-200'; ringColor='#10B981';
      } else if(diff<0){
        suggestion=`Faltam ${Math.abs(diff)} pts para a meta da modalidade.`;
        statusColor='bg-red-50 text-red-800 border-red-200'; ringColor='#EF4444';
      } else {
        suggestion=`Excesso de ${diff} pts além da meta.`;
        statusColor='bg-amber-50 text-amber-800 border-amber-200'; ringColor='#F59E0B';
      }

      return { ...user, assignedPoints, taskPoints, monPoints, expectedPoints, diff, suggestion, statusColor, userFactor, pct, ringColor };
    });
  }, [tasksWithCalculations, users, selectedMonth, systemConfig]);

  // ============================================================================
  // DEFINIÇÃO DAS COLUNAS (para reordenação)
  // ============================================================================
  const COLUMN_DEFS = {
    actions:    { label: '',            width: 52,  fixed: true },
    farol:      { label: 'Farol',       minWidth: 90 },
    entrega:    { label: 'Entrega Macro', minWidth: 220 },
    peso2:      { label: 'Peso 2',      width: 90,  center: true, highlight: 'emerald' },
    atividade:  { label: 'Atividade',   minWidth: 220 },
    cronograma: { label: 'Cronograma',  minWidth: 200 },
    carga:      { label: 'Carga Mensal', minWidth: 120, center: true, highlight: 'blue' },
    responsavel:{ label: 'Responsável', minWidth: 110 },
    colabs:     { label: 'Colabs',      width: 64,  center: true },
    tempo:      { label: 'Tempo Real',  minWidth: 100, center: true },
    conclusao:  { label: 'Conclusão',   minWidth: 120 },
    status:     { label: 'Status',      minWidth: 160 },
  };

  const inputCls  = "w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#0B2461]/20 focus:border-[#0B2461] bg-white transition-all";
  const selectCls = `${inputCls} cursor-pointer`;

  // Render de célula da tabela por coluna
  const renderCell = (colId, task) => {
    const isMyTask = task.assigned_to===currentUser.id || currentUser.role==='admin';
    const isAdmin  = currentUser.role==='admin';

    switch(colId) {
      case 'actions':
        return (
          <td key={colId} className="py-2.5 px-2 text-center">
            <div className="flex items-center justify-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              {isAdmin && <span className="cursor-grab text-gray-300 hover:text-gray-500"><GripVertical size={14}/></span>}
              {isAdmin && <button onClick={()=>setTaskToDelete(task.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1 rounded transition-colors"><Trash2 size={13}/></button>}
            </div>
          </td>
        );
      case 'farol':
        return <td key={colId} className="py-2.5 px-3"><FarolBadge label={task.farol.label}/></td>;
      case 'entrega':
        return (
          <td key={colId} className="py-2.5 px-3">
            <div className="flex flex-col gap-1.5">
              {isAdmin
                ? <select value={task.title} onChange={e=>handleTitleChange(task.id,e.target.value)} className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs font-semibold text-[#0B2461] focus:outline-none bg-white cursor-pointer">
                    {systemConfig.entregasMacro.map(m=><option key={m.id} value={m.entrega}>{m.entrega}</option>)}
                  </select>
                : <span className="font-semibold text-[#0B2461] text-xs line-clamp-2" title={task.title}>{task.title}</span>}
              <div className="flex items-center gap-1 flex-wrap">
                <PesoBadge peso={task.inherited_weight} label="MACRO"/>
                {task.isMelhoria && task.has_collaborator && task.peso2===60 && (
                  <span className="text-[9px] bg-amber-50 text-amber-700 border border-amber-200 px-1.5 py-0.5 rounded font-bold">Colab → 30pts</span>
                )}
              </div>
            </div>
          </td>
        );
      case 'peso2':
        return (
          <td key={colId} className="py-2.5 px-3 text-center" style={{background:'rgba(16,185,129,0.03)'}}>
            <div className="flex flex-col items-center gap-1">
              <Peso2Select value={task.peso2||30} onChange={v=>handlePeso2Change(task.id,v)} disabled={!isMyTask||task.status==='Concluído'}/>
              {task.effectivePeso2 !== task.peso2 && (
                <span className="text-[9px] text-amber-600 font-bold">Efetivo: {task.effectivePeso2}pts</span>
              )}
            </div>
          </td>
        );
      case 'atividade':
        return <td key={colId} className="py-2.5 px-3"><span className="text-xs text-gray-700 line-clamp-2" title={task.etapas}>{task.etapas}</span></td>;
      case 'cronograma':
        return (
          <td key={colId} className="py-2.5 px-3">
            <div className="flex items-center gap-1.5 text-[11px]">
              <input type="date" value={task.data_criacao} onChange={e=>handleDateChange(task.id,'data_criacao',e.target.value)} disabled={!isAdmin}
                className={`border rounded px-1.5 py-1 text-[11px] ${isAdmin?'border-gray-200 bg-white':'border-transparent bg-transparent text-gray-600'}`}/>
              <ChevronRight size={10} className="flex-shrink-0 text-gray-300"/>
              <input type="date" value={task.data_fim} onChange={e=>handleDateChange(task.id,'data_fim',e.target.value)} disabled={!isAdmin}
                className={`border rounded px-1.5 py-1 text-[11px] font-semibold ${isAdmin?'border-gray-200 bg-white':'border-transparent bg-transparent text-gray-700'}`}/>
            </div>
          </td>
        );
      case 'carga':
        return (
          <td key={colId} className="py-2.5 px-3 text-center" style={{background:'rgba(11,36,97,0.025)'}}>
            <div className="relative inline-block group/tip">
              <div className="cursor-help">
                <p className="font-sora font-bold text-[#0B2461] text-base leading-none">
                  {task.carga_horaria_mensal.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}
                  <span className="text-[10px] font-normal text-gray-400 ml-0.5">h/mês</span>
                </p>
                <p className="text-[10px] text-gray-400 mt-0.5">Total: {task.carga_horaria_total.toLocaleString('pt-BR',{minimumFractionDigits:1,maximumFractionDigits:1})}h</p>
              </div>
              <div className="absolute bottom-full right-0 mb-2 hidden group-hover/tip:block z-50 pointer-events-none w-72">
                <div className="bg-[#0B2461] text-white text-[11px] p-4 rounded-xl shadow-2xl border border-blue-400/20">
                  <p className="font-sora font-bold text-[10px] tracking-widest uppercase text-blue-200 mb-3 border-b border-blue-700 pb-2">Auditoria de Cálculo</p>
                  <table className="w-full font-mono">
                    <tbody className="divide-y divide-blue-800/30">
                      {[['H Total Mensal',`${task.calcData.H_total}h`],['Peso Macro',`${task.calcData.W_i}pts`],['Horas da Entrega',`${task.calcData.H_entrega_i.toFixed(1)}h`],['H Atividade Base',`${task.calcData.H_atividade_base.toFixed(1)}h`],['Colaboradores',`${task.calcData.c}`],['Fator Redutor',`${task.calcData.FR.toFixed(2)}×`],['Redistribuição',`+${task.calcData.H_extra.toFixed(1)}h`]]
                        .map(([k,v])=><tr key={k}><td className="py-1 text-blue-300">{k}</td><td className="py-1 text-right text-white font-bold">{v}</td></tr>)}
                    </tbody>
                  </table>
                  <div className="flex justify-between mt-3 pt-2 border-t border-blue-500/30">
                    <span className="font-sora font-bold text-white text-[11px]">Carga Final</span>
                    <span className="font-sora font-bold text-emerald-400 text-sm">{task.carga_horaria_mensal.toFixed(1)}h</span>
                  </div>
                </div>
                <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[7px] border-l-transparent border-r-transparent border-t-[#0B2461] ml-auto mr-6"/>
              </div>
            </div>
          </td>
        );
      case 'responsavel':
        return (
          <td key={colId} className="py-2.5 px-3">
            {isAdmin
              ? <select value={task.assigned_to} onChange={e=>handleAssigneeChange(task.id,parseInt(e.target.value))} className="w-full border border-gray-200 rounded-md px-2 py-1.5 text-xs font-semibold text-gray-700 focus:outline-none bg-white cursor-pointer">
                  {users.map(u=><option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>)}
                </select>
              : <div><p className="text-xs font-semibold text-gray-800">{(task.user?.name||'—').split(' ')[0]}</p><p className="text-[10px] text-gray-400">{task.user?.modality||'—'}</p></div>}
          </td>
        );
      case 'colabs':
        return (
          <td key={colId} className="py-2.5 px-3 text-center">
            <input type="checkbox" checked={task.has_collaborator} onChange={()=>isMyTask&&toggleCollaborator(task.id)} disabled={!isMyTask||task.status==='Concluído'}
              className="w-4 h-4 rounded border-gray-300 accent-[#0B2461] cursor-pointer disabled:opacity-50"/>
          </td>
        );
      case 'tempo':
        return (
          <td key={colId} className="py-2.5 px-3 text-center font-mono">
            {task.is_running
              ? <span className="text-amber-600 bg-amber-50 border border-amber-200 px-2 py-1 rounded-md text-[11px] font-bold animate-pulse">{formatTime(task.actual_seconds)}</span>
              : task.actual_seconds>0
                ? <span className="text-gray-600 bg-gray-100 border border-gray-200 px-2 py-1 rounded-md text-[11px]">{formatTime(task.actual_seconds)}</span>
                : task.status==='Concluído'&&task.duracao_calculada!==null
                  ? <span className="text-blue-600 bg-blue-50 border border-blue-200 px-2 py-1 rounded-md text-[11px]">{Math.round(task.duracao_calculada)}h</span>
                  : <span className="text-gray-300 text-xs">—</span>}
          </td>
        );
      case 'conclusao':
        return (
          <td key={colId} className="py-2.5 px-3 text-[11px] text-gray-500">
            {task.data_conclusao?new Date(task.data_conclusao).toLocaleString('pt-BR',{day:'2-digit',month:'2-digit',year:'2-digit',hour:'2-digit',minute:'2-digit'}):<span className="text-gray-300">—</span>}
          </td>
        );
      case 'status':
        return (
          <td key={colId} className="py-2.5 px-3">
            <div className="flex items-center gap-2">
              {isMyTask&&task.status!=='Concluído'&&(
                <button onClick={()=>toggleTimer(task.id)}
                  className={`w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm transition-colors ${task.is_running?'bg-amber-500 text-white hover:bg-amber-600':'bg-white border border-gray-200 text-gray-500 hover:border-[#0B2461] hover:text-[#0B2461]'}`}>
                  {task.is_running?<Pause size={11} fill="currentColor"/>:<Play size={11} fill="currentColor"/>}
                </button>
              )}
              <select value={task.status} onChange={e=>isMyTask&&handleStatusChange(task.id,e.target.value)} disabled={!isMyTask}
                className={`flex-1 text-[11px] font-semibold rounded-lg px-2.5 py-1.5 border focus:outline-none transition-colors ${task.status==='Concluído'?'bg-blue-50 text-blue-700 border-blue-200':task.status==='Em andamento'?'bg-amber-50 text-amber-700 border-amber-200':'bg-white text-gray-600 border-gray-200'} ${!isMyTask?'cursor-default opacity-75':'cursor-pointer'}`}>
                <option>Pendente</option>
                <option>Em andamento</option>
                <option>Concluído</option>
              </select>
            </div>
          </td>
        );
      default: return <td key={colId}/>;
    }
  };

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;0,9..40,700&display=swap');
        * { font-family:'DM Sans',-apple-system,sans-serif; box-sizing:border-box; }
        .font-sora { font-family:'Sora',sans-serif; }
        ::-webkit-scrollbar { width:5px; height:5px; }
        ::-webkit-scrollbar-track { background:transparent; }
        ::-webkit-scrollbar-thumb { background:#CBD5E1; border-radius:99px; }
        ::-webkit-scrollbar-thumb:hover { background:#0B2461; }
        .sidebar-grd { background:linear-gradient(175deg,#0d2970 0%,#0B2461 40%,#081e52 100%); }
        .sidebar-grd::before { content:'';position:absolute;inset:0;background:url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.02'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");pointer-events:none; }
        @keyframes slideUp { from{opacity:0;transform:translateY(12px)} to{opacity:1;transform:none} }
        @keyframes fadeIn  { from{opacity:0;transform:translateY(-8px) scale(.98)} to{opacity:1;transform:none} }
        .toast-anim { animation:slideUp .3s cubic-bezier(.22,.68,0,1.2) both; }
        .modal-anim { animation:fadeIn .2s ease-out both; }
        .tr-hover:hover { background:#F8FAFF; }
        .tr-running { background:linear-gradient(to right,#FFF7ED,#FFFBF5); }
        .col-dragging { opacity:0.5; }
        .col-drag-over { background:#EEF2FF !important; }
        th[draggable=true] { cursor:grab; }
        th[draggable=true]:active { cursor:grabbing; }
      `}</style>

      <div className="flex h-screen" style={{background:'#F1F3F7'}}>

        {/* TOAST */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-[100] toast-anim">
            <div className="flex items-center gap-2.5 bg-[#0B2461] text-white px-5 py-3.5 rounded-xl shadow-2xl text-sm font-semibold">
              <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0"/>{toastMessage}
            </div>
          </div>
        )}

        {/* SIDEBAR */}
        <aside className="sidebar-grd relative w-60 flex flex-col shadow-2xl z-20 shrink-0">
          <div className="px-5 pt-6 pb-5 relative group flex-shrink-0">
            <div className="flex items-center justify-center mb-1">
              <img src={systemConfig.logoUrl||"https://upload.wikimedia.org/wikipedia/commons/thumb/1/1a/Logo_do_INPI.svg/1200px-Logo_do_INPI.svg.png"} alt="INPI" className="h-9 object-contain filter brightness-0 invert opacity-90"/>
            </div>
            <p className="text-center text-[9px] font-sora font-semibold tracking-[0.18em] text-blue-300/50 uppercase mt-2">DIGEP · Gestão de Projetos</p>
            {currentUser?.role==='admin' && (
              <label className="absolute top-5 right-4 bg-white/10 p-1.5 rounded cursor-pointer opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20">
                <Upload size={12} className="text-white"/>
                <input type="file" accept="image/*" className="hidden" onChange={handleLogoUpload}/>
              </label>
            )}
          </div>
          <div className="mx-4 border-t border-white/10 mb-4"/>
          <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto">
            <p className="px-3 mb-2 text-[9px] font-sora font-semibold tracking-[0.15em] text-blue-300/40 uppercase">Principal</p>
            <NavItem icon={<Table2 size={16}/>}   label="Projetos de Melhoria" active={currentView==='tabela_dinamica'} onClick={()=>setCurrentView('tabela_dinamica')}/>
            <NavItem icon={<BarChart3 size={16}/>} label="Carga de Trabalho"    active={currentView==='dashboard'}       onClick={()=>setCurrentView('dashboard')}/>
            {currentUser?.role==='admin' && (
              <>
                <p className="px-3 pt-4 mb-2 text-[9px] font-sora font-semibold tracking-[0.15em] text-blue-300/40 uppercase">Administração</p>
                <NavItem icon={<Settings size={16}/>} label="Configurações Globais" active={currentView==='configuracoes'} onClick={()=>setCurrentView('configuracoes')}/>
              </>
            )}
          </nav>
          <div className="px-3 pb-4 pt-2 flex-shrink-0 border-t border-white/10">
            <p className="text-[9px] font-sora font-semibold tracking-[0.12em] text-blue-300/40 uppercase mb-2 px-1 mt-3">Simular sessão</p>
            <select value={currentUser?.id}
              onChange={e=>{const u=users.find(u=>u.id===parseInt(e.target.value));setCurrentUser(u);if(u.role!=='admin'&&currentView==='configuracoes')setCurrentView('tabela_dinamica');}}
              className="w-full bg-white/10 text-white border border-white/15 rounded-lg px-3 py-2 text-xs focus:outline-none cursor-pointer">
              {users.map(u=><option key={u.id} value={u.id} className="text-gray-900 bg-white">{u.name.split(' ')[0]} ({u.role==='admin'?'Admin':'Usuário'})</option>)}
            </select>
          </div>
        </aside>

        {/* MAIN */}
        <main className="flex-1 flex flex-col overflow-hidden">
          <header className="bg-white border-b border-gray-200/80 px-6 py-4 flex justify-between items-center flex-shrink-0 shadow-sm">
            <h1 className="font-sora font-bold text-[#0B2461] text-base">
              {currentView==='tabela_dinamica' && 'Projetos de Melhoria — Plano de Entregas DIGEP 2026'}
              {currentView==='dashboard'       && 'Carga de Trabalho'}
              {currentView==='configuracoes'   && 'Configurações Globais'}
            </h1>
            <div className="flex items-center gap-3">
              <div className="text-right mr-1">
                <p className="text-sm font-semibold text-gray-800 flex items-center gap-1.5 justify-end">
                  {currentUser.role==='admin'?<Shield size={12} className="text-[#0B2461]"/>:<UserIcon size={12} className="text-gray-400"/>}
                  {currentUser.name.split('(')[0].trim()}
                </p>
                <p className="text-[11px] text-gray-400">{currentUser.hoursPerMonth}h/mês · <span className="font-medium">{currentUser.modality}</span></p>
              </div>
              <div className="w-9 h-9 rounded-full bg-[#0B2461] flex items-center justify-center font-sora font-bold text-white text-sm shadow-sm">{currentUser.name.charAt(0)}</div>
            </div>
          </header>

          <div className="flex-1 overflow-auto p-6">

            {/* ═══ TABELA ═══ */}
            {currentView==='tabela_dinamica' && (
              <div className="flex flex-col gap-4 h-full">

                {/* Toolbar topo */}
                <div className="flex items-center justify-between flex-wrap gap-3 flex-shrink-0">
                  <div className="flex items-center gap-1.5 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                    <button onClick={handleUndo} disabled={historyIndex===0} className={`p-1.5 rounded transition-colors ${historyIndex===0?'text-gray-300 cursor-not-allowed':'text-gray-500 hover:bg-gray-100'}`}><Undo2 size={15}/></button>
                    <button onClick={handleRedo} disabled={historyIndex===history.length-1} className={`p-1.5 rounded transition-colors ${historyIndex===history.length-1?'text-gray-300 cursor-not-allowed':'text-gray-500 hover:bg-gray-100'}`}><Redo2 size={15}/></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="text-[10px] text-gray-400 flex items-center gap-1 bg-white border border-gray-200 px-2.5 py-2 rounded-lg shadow-sm">
                      <Columns size={12} className="text-gray-400"/> Arraste os cabeçalhos para reordenar colunas
                    </div>
                    <button onClick={handleCreateBackup} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors"><Save size={14} className="text-[#0B2461]"/> Salvar Imagem</button>
                    <button onClick={()=>setShowBackupModal(true)} className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 shadow-sm transition-colors">
                      <HistoryIcon size={14}/> Backups {backups.length>0&&<span className="bg-[#0B2461] text-white text-[9px] px-1.5 py-0.5 rounded-full font-bold">{backups.length}</span>}
                    </button>
                  </div>
                </div>

                {/* Filtros */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 flex-shrink-0">
                  <div className="flex items-center justify-between mb-3">
                    <p className="text-xs font-sora font-semibold text-[#0B2461] uppercase tracking-wider flex items-center gap-1.5"><Filter size={13}/> Filtros</p>
                    {hasActiveFilters&&<button onClick={clearFilters} className="text-[11px] text-red-500 hover:text-red-700 font-semibold flex items-center gap-1"><X size={12}/> Limpar</button>}
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-2.5">
                    {[
                      {l:'Entrega', n:<select value={tableFilters.projeto} onChange={e=>setTableFilters({...tableFilters,projeto:e.target.value})} className={selectCls}><option value="all">Todas</option>{uniqueProjects.map(p=><option key={p} value={p}>{p.length>28?p.substring(0,28)+'…':p}</option>)}</select>},
                      {l:'Atividade', n:<div className="relative"><Search size={13} className="absolute left-2.5 top-2.5 text-gray-400 pointer-events-none"/><input type="text" placeholder="Buscar…" value={tableFilters.etapa} onChange={e=>setTableFilters({...tableFilters,etapa:e.target.value})} className={`${inputCls} pl-7`}/></div>},
                      {l:'Mês (Prazo)', n:<select value={tableFilters.mes} onChange={e=>setTableFilters({...tableFilters,mes:e.target.value})} className={selectCls}><option value="all">Todos</option>{availableMonths.map(m=><option key={m} value={m}>{formatMonthName(m)}</option>)}</select>},
                      {l:'Responsável', n:<select value={tableFilters.responsavel} onChange={e=>setTableFilters({...tableFilters,responsavel:e.target.value})} className={selectCls}><option value="all">Toda a equipe</option>{users.map(u=><option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>)}</select>},
                      {l:'Status', n:<select value={tableFilters.status} onChange={e=>setTableFilters({...tableFilters,status:e.target.value})} className={selectCls}><option value="all">Qualquer</option><option>Pendente</option><option>Em andamento</option><option>Concluído</option></select>},
                      {l:'Colaborador', n:<select value={tableFilters.colaborador} onChange={e=>setTableFilters({...tableFilters,colaborador:e.target.value})} className={selectCls}><option value="all">Indiferente</option><option value="com_colab">Com colaborador</option><option value="sem_colab">Sem colaborador</option></select>},
                    ].map(({l,n})=>(
                      <div key={l} className="flex flex-col gap-1">
                        <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{l}</label>
                        {n}
                      </div>
                    ))}
                  </div>
                </div>

                {/* ── BOTÃO NOVA ATIVIDADE — verde neon, texto INPI ── */}
                <div className="flex items-center justify-between flex-shrink-0">
                  {currentUser.role==='admin'
                    ? (
                      <button onClick={()=>setShowTaskForm(true)}
                        className="flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-sm shadow-md transition-all hover:scale-[1.02] active:scale-[0.98]"
                        style={{ background:'#AAFF00', color:'#0B2461', boxShadow:'0 0 16px rgba(170,255,0,0.5), 0 2px 8px rgba(0,0,0,0.15)' }}>
                        <Plus size={17} strokeWidth={3}/> Adicionar Nova Atividade
                      </button>
                    )
                    : (
                      <div className="flex items-center gap-2 text-xs text-gray-500 bg-white border border-gray-200 px-3 py-2.5 rounded-lg shadow-sm">
                        <Info size={14} className="text-blue-400"/> Somente administradores criam tarefas.
                      </div>
                    )
                  }
                  <p className="text-[11px] text-gray-400">{filteredTasksForTable.length} de {tasks.length} atividades</p>
                </div>

                {/* Tabela com colunas reordenáveis */}
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col flex-1 min-h-0">
                  <div className="overflow-auto flex-1">
                    <table className="w-full border-collapse text-sm" style={{minWidth:1600}}>
                      <thead>
                        <tr className="border-b border-gray-200" style={{background:'#F8F9FB'}}>
                          {columnOrder.map(colId => {
                            const def = COLUMN_DEFS[colId];
                            const isFixed = def.fixed;
                            const hlCls = def.highlight==='blue' ? 'bg-blue-50/60 text-[#0B2461]' : def.highlight==='emerald' ? 'bg-emerald-50/50 text-emerald-700' : 'text-gray-400';
                            return (
                              <th key={colId}
                                draggable={!isFixed}
                                onDragStart={e=>handleColDragStart(e,colId)}
                                onDragOver={handleColDragOver}
                                onDrop={e=>handleColDrop(e,colId)}
                                className={`py-3 px-3 text-left font-sora text-[10px] font-semibold tracking-widest uppercase select-none ${hlCls} ${draggedColId===colId?'col-dragging':''}`}
                                style={{ width:def.width, minWidth:def.minWidth, textAlign:def.center?'center':undefined }}>
                                <span className="flex items-center gap-1.5" style={{justifyContent:def.center?'center':undefined}}>
                                  {!isFixed && <GripVertical size={10} className="text-gray-300 flex-shrink-0"/>}
                                  {def.label}
                                </span>
                              </th>
                            );
                          })}
                        </tr>
                      </thead>
                      <tbody>
                        {filteredTasksForTable.length===0
                          ? <tr><td colSpan={columnOrder.length} className="py-16 text-center text-gray-400 text-sm">Nenhuma atividade encontrada.</td></tr>
                          : filteredTasksForTable.map(task => {
                            const farolBorder = {'Concluído':'#3B82F6','Atrasado':'#EF4444','Perto':'#F59E0B','Longe':'#10B981'}[task.farol.label]||'#10B981';
                            return (
                              <tr key={task.id}
                                draggable={currentUser.role==='admin'}
                                onDragStart={e=>handleRowDragStart(e,task.id)}
                                onDragOver={handleRowDragOver}
                                onDrop={e=>handleRowDrop(e,task.id)}
                                className={`border-b border-gray-100 group tr-hover transition-colors ${task.is_running?'tr-running':''} ${draggedRowId===task.id?'opacity-40':''}`}
                                style={{borderLeft:`3px solid ${farolBorder}`}}>
                                {columnOrder.map(colId => renderCell(colId, task))}
                              </tr>
                            );
                          })}
                      </tbody>
                    </table>
                  </div>
                  <div className="border-t border-gray-100 px-4 py-2.5 flex items-center justify-between flex-shrink-0" style={{background:'#FAFBFC'}}>
                    <p className="text-[11px] text-gray-400">Peso 2 com <strong className="text-amber-600">colabs em Projetos de Melhoria</strong>: redução automática de 60 → 30 pts</p>
                    <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-2 py-0.5 rounded-full font-semibold">Peso 2 efetivo → Carga de Trabalho</span>
                  </div>
                </div>
              </div>
            )}

            {/* ═══ CARGA DE TRABALHO ═══ */}
            {currentView==='dashboard' && (
              <div className="max-w-4xl mx-auto flex flex-col gap-6">
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#0B2461] rounded-xl flex items-center justify-center shadow-md"><Target size={22} className="text-white"/></div>
                    <div>
                      <h2 className="font-sora font-bold text-[#0B2461] text-lg leading-tight">Carga de Trabalho</h2>
                      <p className="text-xs text-gray-500 mt-0.5">Peso 2 por atividade + Monitoramentos × 60 · Ajustado por modalidade</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 bg-gray-50 px-3 py-2 rounded-lg border border-gray-200">
                    <Filter size={14} className="text-gray-400"/>
                    <select value={selectedMonth} onChange={e=>setSelectedMonth(e.target.value)} className="bg-transparent border-none text-sm font-semibold text-[#0B2461] focus:outline-none cursor-pointer">
                      <option value="all">Todo o Plano</option>
                      {availableMonths.map(m=><option key={m} value={m}>{formatMonthName(m)}</option>)}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {cargaStats.map(stat => {
                    const isBase = stat.userFactor===systemConfig.factorPresencial;
                    const factorLabel = stat.modality.toLowerCase().includes('parcial') ? `×${systemConfig.factorParcial}` : stat.modality.toLowerCase().includes('integral') ? `×${systemConfig.factorIntegral}` : '×1.0 (base)';
                    return (
                      <div key={stat.id} className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="p-5 border-b border-gray-100 flex items-center justify-between gap-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full bg-[#0B2461] flex items-center justify-center font-sora font-bold text-white text-sm shadow-sm">{stat.name.charAt(0)}</div>
                            <div>
                              <p className="font-semibold text-gray-800 text-sm leading-tight">{stat.name.split('(')[0].trim()}</p>
                              <div className="flex items-center gap-1.5 mt-0.5">
                                <span className="text-[10px] text-gray-400 uppercase tracking-wide">{stat.modality}</span>
                                <span className="text-[9px] bg-blue-50 text-blue-600 border border-blue-200 px-1.5 py-0.5 rounded font-bold">{factorLabel}</span>
                              </div>
                            </div>
                          </div>
                          <div className="relative flex-shrink-0">
                            <ProgressRing pct={stat.pct} color={stat.ringColor} size={60}/>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <span className="font-sora font-bold text-[#0B2461] text-xs">{stat.pct}%</span>
                            </div>
                          </div>
                        </div>
                        <div className="p-5 space-y-3">
                          {/* Breakdown */}
                          <div className="bg-gray-50 rounded-lg p-3 space-y-1.5 border border-gray-100">
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Pontos de atividades (Peso 2)</span>
                              <span className="font-semibold text-gray-700">{stat.taskPoints} pts</span>
                            </div>
                            <div className="flex justify-between text-xs">
                              <span className="text-gray-500">Monitoramentos ({stat.monitoramentos||0} × 60)</span>
                              <span className="font-semibold text-gray-700">{stat.monPoints} pts</span>
                            </div>
                            <div className="flex justify-between text-xs border-t border-gray-200 pt-1.5 mt-1.5">
                              <span className="font-bold text-gray-700">Total atribuído</span>
                              <span className="font-sora font-bold text-[#0B2461] text-base leading-none">{stat.assignedPoints} <span className="text-[11px] font-normal text-gray-400">pts</span></span>
                            </div>
                          </div>

                          {!isBase && (
                            <div className="flex justify-between items-center">
                              <span className="text-xs text-gray-500">Meta proporcional</span>
                              <span className="text-sm font-semibold text-gray-700">{stat.expectedPoints} pts <span className="text-[10px] text-gray-400">(Base {factorLabel})</span></span>
                            </div>
                          )}

                          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full rounded-full transition-all duration-700" style={{width:`${stat.pct}%`,background:stat.ringColor}}/>
                          </div>

                          {!isBase && (
                            <div className="flex justify-between items-center text-xs">
                              <span className="text-gray-400">Discrepância</span>
                              <span className={`font-bold px-2 py-0.5 rounded-full text-[11px] border ${stat.diff<0?'bg-red-50 text-red-700 border-red-200':stat.diff>0?'bg-amber-50 text-amber-700 border-amber-200':'bg-emerald-50 text-emerald-700 border-emerald-200'}`}>
                                {stat.diff>0?`+${stat.diff}`:stat.diff} pts
                              </span>
                            </div>
                          )}
                          <div className={`flex items-start gap-2 p-3 rounded-lg border text-xs ${stat.statusColor}`}>
                            <ArrowRight size={13} className="mt-0.5 flex-shrink-0"/>
                            <span className="font-medium leading-relaxed">{stat.suggestion}</span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>

                <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 text-xs text-blue-900 leading-relaxed space-y-1">
                  <p><strong>Metodologia — Carga de Trabalho:</strong> Soma dos pontos de Peso 2 de cada atividade + (Qtd. Monitoramentos × 60 pts por servidor). O fator de modalidade é aplicado como multiplicador da meta esperada, usando os parâmetros definidos em Configurações Globais.</p>
                  <p><strong>Regra automática:</strong> Atividades de "Projetos de Melhoria" com colaborador marcado têm o Peso 2 reduzido de 60 para 30 pontos no cálculo.</p>
                </div>
              </div>
            )}

            {/* ═══ CONFIGURAÇÕES ═══ */}
            {currentView==='configuracoes' && currentUser.role==='admin' && (
              <div className="max-w-6xl mx-auto pb-28">
                <form onSubmit={handleSaveConfig} className="space-y-6">

                  {/* Equipe */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2"><Users size={17} className="text-[#0B2461]"/><h3 className="font-sora font-bold text-gray-800">Gestão de Acessos e Equipe</h3></div>
                      <button type="button" onClick={handleAddTempUser} className="flex items-center gap-1.5 text-sm font-semibold text-[#0B2461] bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"><Plus size={14}/> Novo Servidor</button>
                    </div>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm" style={{minWidth:980}}>
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            {['Nome','E-mail','Perfil','Modalidade → Fator','Carga/mês','Qtd Monitoramentos',''].map(h=>(
                              <th key={h} className="text-left px-4 py-3 text-[10px] font-sora font-semibold uppercase tracking-widest text-gray-400">{h}</th>
                            ))}
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {tempUsers.map(u => {
                            // Calcula fator baseado na modalidade do usuário e tempConfig
                            const m = u.modality?.toLowerCase()||'';
                            const factor = m.includes('parcial') ? parseFloat(tempConfig.factorParcial)
                              : m.includes('integral') ? parseFloat(tempConfig.factorIntegral)
                              : parseFloat(tempConfig.factorPresencial);
                            const factorColor = factor===parseFloat(tempConfig.factorPresencial)?'text-gray-500 bg-gray-50 border-gray-200':factor===parseFloat(tempConfig.factorParcial)?'text-blue-700 bg-blue-50 border-blue-200':'text-violet-700 bg-violet-50 border-violet-200';

                            return (
                              <tr key={u.id} className="hover:bg-gray-50/60 transition-colors">
                                <td className="px-4 py-3"><input type="text" value={u.name} onChange={e=>handleTempUserChange(u.id,'name',e.target.value)} className={inputCls} required/></td>
                                <td className="px-4 py-3"><input type="email" value={u.email} onChange={e=>handleTempUserChange(u.id,'email',e.target.value)} className={inputCls}/></td>
                                <td className="px-4 py-3">
                                  <select value={u.role} onChange={e=>handleTempUserChange(u.id,'role',e.target.value)} className={`${selectCls} font-semibold ${u.role==='admin'?'text-[#0B2461] border-blue-300 bg-blue-50':'text-gray-600'}`}>
                                    <option value="user">Usuário</option>
                                    <option value="admin">Administrador</option>
                                  </select>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-2">
                                    <select value={u.modality} onChange={e=>handleTempUserChange(u.id,'modality',e.target.value)} className={selectCls}>
                                      <option>Presencial</option>
                                      <option value="Teletrabalho parcial">Teletrabalho Parcial</option>
                                      <option value="Teletrabalho integral">Teletrabalho Integral</option>
                                    </select>
                                    {/* Fator calculado dinamicamente */}
                                    <span className={`text-[10px] font-black px-2 py-1 rounded border whitespace-nowrap ${factorColor}`}>×{factor.toFixed(1)}</span>
                                  </div>
                                </td>
                                <td className="px-4 py-3">
                                  <div className="flex items-center gap-1">
                                    <input type="number" step="1" min="1" value={u.hoursPerMonth} onChange={e=>handleTempUserChange(u.id,'hoursPerMonth',parseInt(e.target.value))} className={`${inputCls} w-20 text-center font-sora font-bold text-[#0B2461]`}/>
                                    <span className="text-gray-400 text-xs font-medium">h</span>
                                  </div>
                                </td>
                                {/* Qtd Monitoramentos */}
                                <td className="px-4 py-3">
                                  <div className="flex flex-col gap-1">
                                    <div className="flex items-center gap-1">
                                      <input type="number" step="1" min="0" value={u.monitoramentos||0} onChange={e=>handleTempUserChange(u.id,'monitoramentos',parseInt(e.target.value)||0)}
                                        className={`${inputCls} w-20 text-center font-sora font-bold text-emerald-700`}/>
                                      <span className="text-gray-400 text-xs">mon.</span>
                                    </div>
                                    <span className="text-[10px] text-gray-400">=<strong className="text-emerald-600"> {(u.monitoramentos||0)*60} pts</strong></span>
                                  </div>
                                </td>
                                <td className="px-4 py-3"><button type="button" onClick={()=>handleRemoveTempUser(u.id)} disabled={tempUsers.length===1} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors disabled:opacity-30"><Trash2 size={15}/></button></td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  {/* Parâmetros */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
                    {/* Fatores de Modalidade — conectados */}
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-2 border-b pb-3">
                        <Target size={16} className="text-[#0B2461]"/>
                        <h3 className="font-sora font-bold text-gray-800 text-sm">Fatores de Modalidade</h3>
                        <span className="text-[10px] bg-emerald-50 text-emerald-700 border border-emerald-200 px-1.5 py-0.5 rounded font-bold ml-auto">Conectados à equipe</span>
                      </div>
                      <p className="text-xs text-gray-500 mb-4 leading-relaxed">Alterações aqui refletem imediatamente na coluna "Modalidade → Fator" da equipe e nos cálculos de Carga de Trabalho.</p>
                      <div className="space-y-3">
                        {[
                          {label:'Presencial (Linha Base)',  key:'factorPresencial', color:'bg-gray-50 border-gray-200',   badge:'×1.0'},
                          {label:'Teletrabalho Parcial',     key:'factorParcial',    color:'bg-blue-50 border-blue-200',   badge:`×${parseFloat(tempConfig.factorParcial).toFixed(1)}`},
                          {label:'Teletrabalho Integral',    key:'factorIntegral',   color:'bg-violet-50 border-violet-200', badge:`×${parseFloat(tempConfig.factorIntegral).toFixed(1)}`},
                        ].map(({label,key,color,badge})=>(
                          <div key={key} className={`flex items-center justify-between p-3.5 rounded-lg border ${color}`}>
                            <label className="text-sm font-semibold text-gray-700">{label}</label>
                            <div className="flex items-center gap-2">
                              <input type="number" step="0.1" required value={tempConfig[key]} onChange={e=>setTempConfig({...tempConfig,[key]:e.target.value})} className="w-20 border border-gray-300 rounded-lg p-2 font-sora font-bold text-center text-[#0B2461] focus:outline-none focus:ring-2 focus:ring-[#0B2461]/20 text-sm"/>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
                      <div className="flex items-center gap-2 mb-5 border-b pb-3"><Users size={16} className="text-[#0B2461]"/><h3 className="font-sora font-bold text-gray-800 text-sm">Fator Redutor α</h3></div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-4">Define a redução de horas ao trabalhar em equipe: <code className="bg-gray-100 px-1.5 py-0.5 rounded text-[11px]">FR = 1 / c^α</code></p>
                      <div className="flex items-center justify-between mb-1">
                        <label className="text-sm font-semibold text-gray-700">Intensidade Exponencial</label>
                        <span className="font-sora font-bold text-[#0B2461] text-lg">{tempConfig.alphaParameter}</span>
                      </div>
                      <input type="range" step="0.1" min="0.0" max="1.0" value={tempConfig.alphaParameter} onChange={e=>setTempConfig({...tempConfig,alphaParameter:parseFloat(e.target.value)})} className="w-full accent-[#0B2461]"/>
                      <div className="flex justify-between text-[10px] text-gray-400 mt-1"><span>0.0 (sem redução)</span><span>1.0 (máxima)</span></div>
                    </div>
                  </div>

                  {/* Entregas macro */}
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                    <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
                      <div className="flex items-center gap-2"><BookOpen size={16} className="text-[#0B2461]"/><h3 className="font-sora font-bold text-gray-800 text-sm">Entregas Macro</h3><span className="text-[11px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-semibold">{tempConfig.entregasMacro.length}</span></div>
                      <div className="flex items-center gap-2">
                        <label className="flex items-center gap-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-2 rounded-lg cursor-pointer hover:bg-emerald-100 transition-colors">
                          <Upload size={13}/> CSV <input type="file" accept=".csv" className="hidden" onChange={handleFileUpload}/>
                        </label>
                        <button type="button" onClick={handleAddEntregaMacro} className="flex items-center gap-1.5 text-xs font-semibold text-[#0B2461] bg-blue-50 border border-blue-200 px-3 py-2 rounded-lg hover:bg-blue-100 transition-colors"><Plus size={13}/> Nova</button>
                      </div>
                    </div>
                    <div className="overflow-auto" style={{maxHeight:380}}>
                      <table className="w-full text-xs" style={{minWidth:800}}>
                        <thead className="bg-gray-50 border-b border-gray-100 sticky top-0">
                          <tr>{['Processo','Entrega','Peso Macro','Prazo','Área',''].map(h=><th key={h} className="text-left px-3 py-3 font-sora font-semibold text-[10px] uppercase tracking-widest text-gray-400">{h}</th>)}</tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {tempConfig.entregasMacro.map(m=>(
                            <tr key={m.id} className="hover:bg-gray-50/60 transition-colors">
                              <td className="px-3 py-2">
                                <input type="text" value={m.processos} onChange={e=>handleEntregaMacroChange(m.id,'processos',e.target.value)} className={inputCls}/>
                                {m.processos==='Projetos de Melhoria' && <span className="text-[9px] bg-amber-50 text-amber-600 border border-amber-200 px-1.5 py-0.5 rounded mt-1 block font-bold w-fit">Regra colabs ativa</span>}
                              </td>
                              <td className="px-3 py-2"><input type="text" value={m.entrega} onChange={e=>handleEntregaMacroChange(m.id,'entrega',e.target.value)} className={`${inputCls} font-semibold`} required/></td>
                              <td className="px-3 py-2">
                                <select value={m.peso} onChange={e=>handleEntregaMacroChange(m.id,'peso',parseInt(e.target.value))} className={`${selectCls} font-bold w-24`}>
                                  <option value={10}>10</option><option value={30}>30</option><option value={60}>60</option>
                                </select>
                              </td>
                              <td className="px-3 py-2"><input type="text" value={m.prazo} onChange={e=>handleEntregaMacroChange(m.id,'prazo',e.target.value)} className={inputCls} placeholder="31/12/2026"/></td>
                              <td className="px-3 py-2"><input type="text" value={m.area} onChange={e=>handleEntregaMacroChange(m.id,'area',e.target.value)} className={inputCls}/></td>
                              <td className="px-3 py-2"><button type="button" onClick={()=>handleRemoveEntregaMacro(m.id)} className="text-red-400 hover:text-red-600 hover:bg-red-50 p-1.5 rounded transition-colors"><Trash2 size={13}/></button></td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <div className="fixed bottom-0 left-60 right-0 bg-white border-t border-gray-200 px-8 py-4 flex justify-end gap-3 z-20 shadow-lg">
                    <button type="button" onClick={()=>{setTempConfig(systemConfig);setTempUsers(users);}} className="px-5 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">Descartar</button>
                    <button type="submit" className="px-6 py-2.5 bg-[#0B2461] text-white rounded-lg font-semibold hover:bg-[#1a3885] transition-colors shadow-md flex items-center gap-2 text-sm"><Save size={15}/> Salvar Configurações</button>
                  </div>
                </form>
              </div>
            )}
          </div>
        </main>

        {/* MODAL: NOVA ATIVIDADE */}
        {showTaskForm && currentUser.role==='admin' && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-xl modal-anim overflow-hidden">
              <div className="bg-[#0B2461] px-6 py-5 flex items-center justify-between">
                <div className="flex items-center gap-3"><div className="w-8 h-8 bg-white/15 rounded-lg flex items-center justify-center"><Plus size={16} className="text-white"/></div><h2 className="font-sora font-bold text-white text-base">Nova Atividade</h2></div>
                <button onClick={()=>setShowTaskForm(false)} className="text-blue-200 hover:text-white w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"><X size={18}/></button>
              </div>
              <form onSubmit={handleAddTask} className="p-6 space-y-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Entrega Macro</label>
                  <select value={newTask.title} onChange={e=>setNewTask({...newTask,title:e.target.value})} required className={`${selectCls} font-semibold text-[#0B2461]`}>
                    <option value="" disabled>Selecione…</option>
                    {systemConfig.entregasMacro.map(m=><option key={m.id} value={m.entrega}>{m.entrega} (Peso Macro: {m.peso})</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Atividade / Etapa</label>
                  <textarea required rows={3} value={newTask.etapas} onChange={e=>setNewTask({...newTask,etapas:e.target.value})} className={inputCls} placeholder="Descreva a etapa…"/>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Responsável</label>
                    <select value={newTask.assigned_to} onChange={e=>setNewTask({...newTask,assigned_to:parseInt(e.target.value)})} className={selectCls}>
                      {users.map(u=><option key={u.id} value={u.id}>{u.name.split(' ')[0]}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Peso 2 (Carga de Trabalho)</label>
                    <select value={newTask.peso2} onChange={e=>setNewTask({...newTask,peso2:parseInt(e.target.value)})} className={`${selectCls} font-bold`}>
                      <option value={10}>10 pts</option><option value={30}>30 pts</option><option value={60}>60 pts</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Início</label>
                    <input required type="date" value={newTask.data_criacao} onChange={e=>setNewTask({...newTask,data_criacao:e.target.value})} className={inputCls}/>
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-gray-600 uppercase tracking-wider mb-1.5">Prazo Final</label>
                    <input required type="date" value={newTask.data_fim} onChange={e=>setNewTask({...newTask,data_fim:e.target.value})} className={inputCls}/>
                  </div>
                </div>
                <div className="flex gap-3 pt-2 border-t border-gray-100">
                  <button type="button" onClick={()=>setShowTaskForm(false)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-lg font-semibold hover:bg-gray-50 transition-colors text-sm">Cancelar</button>
                  <button type="submit" className="flex-[2] py-2.5 text-[#0B2461] rounded-lg font-bold transition-all shadow-md text-sm" style={{background:'#AAFF00',boxShadow:'0 0 12px rgba(170,255,0,0.4)'}}>Salvar Atividade</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BACKUPS */}
        {showBackupModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg modal-anim flex flex-col" style={{maxHeight:'80vh'}}>
              <div className="bg-[#0B2461] px-6 py-5 flex items-center justify-between flex-shrink-0 rounded-t-2xl">
                <div className="flex items-center gap-3"><HistoryIcon size={18} className="text-white"/><h2 className="font-sora font-bold text-white">Backups Locais</h2></div>
                <button onClick={()=>setShowBackupModal(false)} className="text-blue-200 hover:text-white w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10"><X size={18}/></button>
              </div>
              <div className="p-6 overflow-y-auto flex-1">
                {backups.length===0
                  ? <div className="text-center py-10 text-gray-400"><Save size={40} className="mx-auto mb-3 text-gray-200"/><p className="font-semibold text-gray-500">Nenhum backup encontrado.</p></div>
                  : backups.map(b=>(
                    <div key={b.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0 gap-3">
                      <div><p className="font-semibold text-gray-800 text-sm flex items-center gap-2"><Clock size={14} className="text-gray-400"/>{b.label}</p><p className="text-xs text-gray-400 mt-0.5">{b.data.length} atividades</p></div>
                      <button onClick={()=>setBackupToRestore(b)} className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-[#0B2461] bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0"><Download size={13}/> Restaurar</button>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {backupToRestore!==null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[70] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm modal-anim p-7 text-center">
              <div className="w-14 h-14 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-4"><AlertTriangle size={26} className="text-amber-600"/></div>
              <h2 className="font-sora font-bold text-gray-800 text-lg mb-2">Restaurar Imagem?</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Substituirá atividades atuais pelas de <strong>"{backupToRestore.label}"</strong>.</p>
              <div className="flex gap-3">
                <button onClick={()=>setBackupToRestore(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancelar</button>
                <button onClick={confirmRestoreBackup} className="flex-1 py-2.5 bg-amber-500 text-white rounded-xl font-semibold hover:bg-amber-600 shadow text-sm">Restaurar</button>
              </div>
            </div>
          </div>
        )}

        {taskToDelete!==null && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm modal-anim p-7 text-center">
              <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={26} className="text-red-600"/></div>
              <h2 className="font-sora font-bold text-gray-800 text-lg mb-2">Remover Atividade?</h2>
              <p className="text-gray-500 text-sm leading-relaxed mb-6">Esta ação é permanente. Use o undo se precisar reverter.</p>
              <div className="flex gap-3">
                <button onClick={()=>setTaskToDelete(null)} className="flex-1 py-2.5 border border-gray-200 text-gray-600 rounded-xl font-semibold hover:bg-gray-50 text-sm">Cancelar</button>
                <button onClick={confirmDelete} className="flex-1 py-2.5 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 shadow text-sm">Remover</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </>
  );
}
