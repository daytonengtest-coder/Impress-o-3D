/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Calendar, 
  Plus, 
  Settings, 
  TrendingUp, 
  Database, 
  Package, 
  Wallet,
  ChevronDown,
  MoreHorizontal,
  ExternalLink,
  Target,
  PiggyBank,
  Coins,
  Layers,
  Boxes,
  X,
  Upload,
  User,
  Lock,
  Trash2,
  Edit2,
  LogOut,
  Image as ImageIcon,
  Maximize2
} from 'lucide-react';
import { 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer, 
  AreaChart, 
  Area,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { 
  onSnapshot, 
  collection, 
  doc, 
  setDoc, 
  deleteDoc, 
  query, 
  where, 
  orderBy
} from 'firebase/firestore';
import { 
  onAuthStateChanged, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut,
  User as FirebaseUser
} from 'firebase/auth';
import { db, auth } from './firebase';
import { PrintingRecord, NewPrintingRecord } from './types';
import { motion, AnimatePresence } from 'motion/react';

enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  }
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}


function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- Login Screen Component ---
function LoginScreen() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError('');
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
    } catch (err: any) {
      setError('Erro ao autenticar com Google. Tente novamente.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06090f] flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-[#0d131f] border border-gray-800 p-10 rounded-[40px] shadow-2xl space-y-10"
      >
        <div className="text-center space-y-4">
          <div className="mx-auto w-20 h-20 bg-[#111828] rounded-[24px] flex items-center justify-center shadow-inner border border-gray-800/50">
            <Package className="w-10 h-10 text-cyan-400" />
          </div>
          <div className="space-y-1">
            <h1 className="text-3xl font-black text-white tracking-tight">Bem-vindo ao Dashboard</h1>
            <p className="text-gray-500 text-sm font-medium">Gerencie suas impressões 3D em qualquer lugar</p>
          </div>
        </div>

        <div className="space-y-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center" aria-hidden="true">
              <div className="w-full border-t border-gray-800"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#0d131f] px-4 text-gray-500 font-bold tracking-widest">Acesso Seguro</span>
            </div>
          </div>

          {error && <p className="text-red-500 text-xs font-bold text-center bg-red-500/10 p-3 rounded-xl border border-red-500/20">{error}</p>}
          
          <button 
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full py-5 bg-white hover:bg-gray-100 disabled:bg-gray-800 text-gray-900 font-black rounded-2xl shadow-xl transition-all active:scale-[0.98] outline-none text-sm tracking-wide flex items-center justify-center gap-3"
          >
            {loading ? (
              <div className="w-5 h-5 border-2 border-gray-900/20 border-t-gray-900 rounded-full animate-spin" />
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                </svg>
                Entrar com Google
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

// Custom Tooltip for Charts
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#111827] border border-gray-800 p-2 rounded-lg shadow-xl outline-none">
        <p className="text-gray-400 text-[10px] uppercase font-bold mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} className="text-xs font-semibold" style={{ color: entry.color }}>
            {entry.name}: R$ {entry.value.toLocaleString('pt-BR')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// --- Image Viewer Modal ---
interface ImageViewerProps {
  isOpen: boolean;
  onClose: () => void;
  images: string[];
  pezName: string;
}

function ImageViewerModal({ isOpen, onClose, images, pezName }: ImageViewerProps) {
  if (!isOpen || !images.length) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/95 backdrop-blur-md" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="relative w-full max-w-4xl bg-[#0d131f] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-4 border-b border-gray-800 flex items-center justify-between bg-black/20">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-cyan-500/10 rounded-lg">
                <ImageIcon className="w-4 h-4 text-cyan-400" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">Imagens do projeto</h3>
                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-tight">{pezName}</p>
              </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors bg-white/5">
              <X className="w-5 h-5" />
            </button>
          </div>
          
          <div className="p-6 overflow-y-auto custom-scrollbar flex-1 bg-black/10">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {images.map((img, idx) => (
                <div key={idx} className="group relative rounded-2xl overflow-hidden border border-gray-800 bg-gray-900 shadow-xl">
                  <img src={img} alt="" className="w-full h-auto object-contain bg-gray-900 min-h-[200px]" />
                  <div className="absolute inset-0 bg-cyan-500/0 group-hover:bg-cyan-500/10 transition-all pointer-events-none" />
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

// --- Modal Component ---
interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (record: NewPrintingRecord | PrintingRecord) => void;
  editRecord?: PrintingRecord;
  availableSectors: string[];
}

function NewItemModal({ isOpen, onClose, onSave, editRecord, availableSectors }: ModalProps) {
  const [formData, setFormData] = useState<NewPrintingRecord>({
    peca: '',
    setor: '',
    data: new Date().toLocaleDateString('pt-BR'),
    qty: 1,
    custo: 0,
    orcamento: 0,
    filamento: 0,
    observacao: '',
    images: []
  });

  const [isAddingNewSector, setIsAddingNewSector] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (editRecord) {
      setFormData({
        peca: editRecord.peca,
        setor: editRecord.setor,
        data: editRecord.data,
        qty: editRecord.qty,
        custo: editRecord.custo,
        orcamento: editRecord.orcamento,
        filamento: editRecord.filamento || 0,
        observacao: editRecord.observacao || '',
        images: editRecord.images || []
      });
      setIsAddingNewSector(false);
    } else {
      setFormData({
        peca: '',
        setor: '',
        data: new Date().toLocaleDateString('pt-BR'),
        qty: 1,
        custo: 0,
        orcamento: 0,
        filamento: 0,
        observacao: '',
        images: []
      });
      setIsAddingNewSector(false);
    }
  }, [editRecord, isOpen]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newImages: string[] = [...(formData.images || [])];
      Array.from(files).forEach((file: File) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          newImages.push(reader.result as string);
          setFormData(prev => ({ ...prev, images: [...newImages] }));
        };
        reader.readAsDataURL(file);
      });
    }
  };

  const removeImage = (index: number) => {
    const newImages = [...(formData.images || [])];
    newImages.splice(index, 1);
    setFormData({ ...formData, images: newImages });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editRecord) {
      onSave({ ...editRecord, ...formData, saving: formData.orcamento - formData.custo } as PrintingRecord);
    } else {
      onSave(formData);
    }
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6">
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-sm" 
        />
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          className="relative w-full max-w-2xl bg-[#0d131f] border border-gray-800 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh]"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="p-6 border-b border-gray-800/50 bg-black/10">
            <div className="flex items-start justify-between">
              <div>
                <h2 className="text-2xl font-bold text-white mb-1">
                  {editRecord ? 'Editar impressão' : 'Cadastrar nova impressão'}
                </h2>
                <p className="text-sm text-gray-400">Registre a peça impressa, o setor solicitante e anexe imagens do projeto.</p>
              </div>
              <button onClick={onClose} className="p-2 hover:bg-white/5 rounded-full text-gray-500 hover:text-white transition-colors">
                <X className="w-6 h-6" />
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Descrição da peça *</label>
                <input 
                  required
                  type="text" 
                  placeholder="Ex: Berço de parafusamento do A960"
                  value={formData.peca}
                  onChange={(e) => setFormData({...formData, peca: e.target.value})}
                  className="w-full bg-[#111828]/50 border border-cyan-500/30 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-gray-600"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Data da impressão *</label>
                  <div className="relative">
                    <input 
                      required
                      type="text" 
                      placeholder="DD/MM/AAAA"
                      value={formData.data}
                      onChange={(e) => setFormData({...formData, data: e.target.value})}
                      className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/40 transition-all placeholder:text-gray-600"
                    />
                    <Calendar className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Setor solicitante</label>
                  <div className="relative">
                    {!isAddingNewSector ? (
                      <>
                        <select 
                          required
                          value={formData.setor}
                          onChange={(e) => {
                            if (e.target.value === 'ADD_NEW') {
                              setIsAddingNewSector(true);
                              setFormData({ ...formData, setor: '' });
                            } else {
                              setFormData({ ...formData, setor: e.target.value });
                            }
                          }}
                          className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/40 transition-all text-white appearance-none outline-none"
                        >
                          <option value="" disabled className="bg-[#0d131f]">Selecione um setor</option>
                          {availableSectors.filter(s => s !== "Todos os setores").map(opt => (
                            <option key={opt} value={opt} className="bg-[#0d131f]">{opt}</option>
                          ))}
                          <option value="ADD_NEW" className="bg-[#0d131f] text-cyan-400 font-bold">+ Adicionar novo setor...</option>
                        </select>
                        <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
                      </>
                    ) : (
                      <div className="flex gap-2">
                        <input 
                          required
                          type="text"
                          placeholder="Digite o nome do novo setor"
                          autoFocus
                          value={formData.setor}
                          onChange={(e) => setFormData({ ...formData, setor: e.target.value })}
                          className="w-full bg-[#111828]/50 border border-cyan-500/50 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all text-white outline-none"
                        />
                        <button 
                          type="button"
                          onClick={() => setIsAddingNewSector(false)}
                          className="p-3 bg-gray-800 border border-gray-700 rounded-xl text-gray-400 hover:text-white transition-all shadow-lg"
                          title="Voltar para lista"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Qty</label>
                  <input 
                    type="number" 
                    value={formData.qty}
                    onChange={(e) => setFormData({...formData, qty: parseInt(e.target.value) || 0})}
                    className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Filamento (m)</label>
                  <input 
                    type="number" 
                    value={formData.filamento}
                    onChange={(e) => setFormData({...formData, filamento: parseFloat(e.target.value) || 0})}
                    className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Custo (R$)</label>
                  <input 
                    type="number" 
                    value={formData.custo}
                    onChange={(e) => setFormData({...formData, custo: parseFloat(e.target.value) || 0})}
                    className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Orçamento un. (R$)</label>
                  <input 
                    type="number" 
                    value={formData.orcamento}
                    onChange={(e) => setFormData({...formData, orcamento: parseFloat(e.target.value) || 0})}
                    className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 transition-all"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Necessidade / observação</label>
                <textarea 
                  rows={3}
                  placeholder="Para que a peça foi solicitada?"
                  value={formData.observacao}
                  onChange={(e) => setFormData({...formData, observacao: e.target.value})}
                  className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-3 px-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/10 focus:border-cyan-500/40 transition-all placeholder:text-gray-600 resize-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-400 uppercase tracking-widest">Imagens do projeto</label>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  className="hidden" 
                  multiple 
                  accept="image/*"
                  onChange={handleImageUpload}
                />
                
                <div className="grid grid-cols-4 sm:grid-cols-6 gap-2 mb-2">
                  {(formData.images || []).map((img, idx) => (
                    <div key={idx} className="relative group aspect-square rounded-xl overflow-hidden border border-gray-800 bg-gray-900">
                      <img src={img} alt="" className="w-full h-full object-cover" />
                      <button 
                        type="button"
                        onClick={() => removeImage(idx)}
                        className="absolute top-1 right-1 p-1 bg-red-500 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="aspect-square border-2 border-dashed border-gray-800 rounded-xl flex items-center justify-center text-gray-500 hover:text-gray-400 hover:border-gray-700 transition-all cursor-pointer bg-[#111828]/30"
                  >
                    <Plus className="w-5 h-5" />
                  </div>
                </div>

                {!formData.images?.length && (
                  <div 
                    onClick={() => fileInputRef.current?.click()}
                    className="w-full h-24 border-2 border-dashed border-gray-800 rounded-2xl flex flex-col items-center justify-center gap-2 text-gray-500 hover:text-gray-400 hover:border-gray-700 transition-all cursor-pointer bg-[#111828]/30"
                  >
                    <Upload className="w-5 h-5" />
                    <span className="text-xs font-semibold">Clique para anexar imagens</span>
                  </div>
                )}
              </div>

              <div className="flex gap-4 pt-4">
                <button 
                  type="button" 
                  onClick={onClose}
                  className="flex-1 px-6 py-3 rounded-xl border border-gray-800 font-bold text-gray-400 hover:bg-white/5 transition-all outline-none"
                >
                  Cancelar
                </button>
                <button 
                  type="submit" 
                  className="flex-1 px-6 py-3 rounded-xl bg-cyan-600 hover:bg-cyan-500 font-bold text-white shadow-lg shadow-cyan-900/40 transition-all active:scale-95 outline-none"
                >
                  {editRecord ? 'Salvar alterações' : 'Salvar registro'}
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}

export default function App() {
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isAuthReady, setIsAuthReady] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [records, setRecords] = useState<PrintingRecord[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editRecord, setEditRecord] = useState<PrintingRecord | undefined>(undefined);
  const [sectors, setSectors] = useState<string[]>(["Produção", "Manutenção", "Qualidade", "Engenharia", "Industrial", "Montagem", "Logística"]);
  
  // Image Viewer State
  const [isViewerOpen, setIsViewerOpen] = useState(false);
  const [viewerImages, setViewerImages] = useState<string[]>([]);
  const [viewerTitle, setViewerTitle] = useState('');

  const [filters, setFilters] = useState({
    year: 'Todos os anos',
    month: 'Todos os meses',
    sector: 'Todos os setores'
  });

  // Auth State Listener
  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
      setIsAuthReady(true);
    });
    return () => unsubscribe();
  }, []);

  // Records & Config Listener
  React.useEffect(() => {
    if (!user) {
      setRecords([]);
      return;
    }

    const q = query(
      collection(db, 'records'), 
      where('userId', '==', user.uid),
      orderBy('data', 'desc')
    );

    const unsubRecords = onSnapshot(q, (snapshot) => {
      const docs = snapshot.docs.map(doc => ({ 
        id: doc.id, 
        ...doc.data() 
      } as PrintingRecord));
      setRecords(docs);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'records');
    });

    const unsubConfig = onSnapshot(doc(db, 'configs', `sectors_${user.uid}`), (snapshot) => {
      if (snapshot.exists()) {
        setSectors(snapshot.data().list);
      }
    });

    return () => {
      unsubRecords();
      unsubConfig();
    };
  }, [user]);

  // --- Derived Data & Filtering ---
  const filteredRecords = useMemo(() => {
    return records.filter(record => {
      const parts = record.data.split('/');
      const month = parts[1];
      const year = parts[2];
      
      const monthNames = [
        "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
        "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
      ];
      const recordMonthName = monthNames[parseInt(month) - 1];

      const matchesSearch = record.peca.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesYear = filters.year === 'Todos os anos' || filters.year === year;
      const matchesMonth = filters.month === 'Todos os meses' || filters.month === recordMonthName;
      const matchesSector = filters.sector === 'Todos os setores' || filters.sector === record.setor;

      return matchesSearch && matchesYear && matchesMonth && matchesSector;
    });
  }, [records, searchTerm, filters]);

  const kpis = useMemo(() => {
    const totalSaving = filteredRecords.reduce((acc, curr) => acc + curr.saving, 0);
    const totalCusto = filteredRecords.reduce((acc, curr) => acc + curr.custo, 0);
    const totalOrcamento = filteredRecords.reduce((acc, curr) => acc + curr.orcamento, 0);
    const totalFilamento = filteredRecords.reduce((acc, curr) => acc + (curr.filamento || 0), 0);
    const totalPrinted = filteredRecords.reduce((acc, curr) => acc + curr.qty, 0);

    return { totalSaving, totalCusto, totalOrcamento, totalFilamento, totalPrinted, count: filteredRecords.length };
  }, [filteredRecords]);

  const chartDataMonthly = useMemo(() => {
    const months: Record<string, { name: string, orcamento: number, custo: number }> = {};
    filteredRecords.forEach(r => {
      const parts = r.data.split('/');
      const monthStr = `${parts[1]}/${parts[2].slice(-2)}`; // e.g. 02/26
      if (!months[monthStr]) {
        months[monthStr] = { name: monthStr, orcamento: 0, custo: 0 };
      }
      months[monthStr].orcamento += r.orcamento;
      months[monthStr].custo += r.custo;
    });
    return Object.values(months).sort((a, b) => {
      const [ma, ya] = a.name.split('/').map(Number);
      const [mb, yb] = b.name.split('/').map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    });
  }, [filteredRecords]);

  const chartDataSector = useMemo(() => {
    const sectors: Record<string, number> = {};
    filteredRecords.forEach(r => {
      sectors[r.setor] = (sectors[r.setor] || 0) + 1;
    });
    const colors = ['#00f0ff', '#00c2cc', '#00949c', '#0ea5e9', '#38bdf8', '#7dd3fc'];
    return Object.entries(sectors).map(([name, value], i) => ({
      name, 
      value, 
      color: colors[i % colors.length]
    }));
  }, [filteredRecords]);

  const topSavingsData = useMemo(() => {
    return [...filteredRecords]
      .sort((a, b) => b.saving - a.saving)
      .slice(0, 7)
      .map(r => ({
        name: r.peca.length > 25 ? r.peca.substring(0, 22) + '...' : r.peca,
        value: r.saving
      }));
  }, [filteredRecords]);

  // --- Handlers ---
  const handleSaveRecord = async (data: NewPrintingRecord | PrintingRecord) => {
    if (!user) return;
    
    try {
      const recordId = 'id' in data ? data.id : Math.random().toString(36).substring(2, 9);
      const saving = data.orcamento - data.custo;
      
      const recordToSave = {
        ...data,
        userId: user.uid,
        saving,
        createdAt: 'id' in data ? (data as any).createdAt : new Date().toISOString()
      };

      await setDoc(doc(db, 'records', recordId), recordToSave);
      
      // Update sectors if new
      if (!sectors.includes(data.setor)) {
        const newList = [...sectors, data.setor];
        setSectors(newList);
        await setDoc(doc(db, 'configs', `sectors_${user.uid}`), { list: newList });
      }
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, 'records');
    }
    setEditRecord(undefined);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este registro?')) {
      try {
        await deleteDoc(doc(db, 'records', id));
      } catch (error) {
        handleFirestoreError(error, OperationType.DELETE, `records/${id}`);
      }
    }
  };

  const handleEdit = (record: PrintingRecord) => {
    setEditRecord(record);
    setIsModalOpen(true);
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const years = useMemo(() => ["Todos os anos", ...new Set(records.map(r => r.data.split('/')[2]))], [records]);
  const months = useMemo(() => [
    "Todos os meses", "Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho",
    "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"
  ], []);
  const availableSectors = useMemo(() => ["Todos os setores", ...new Set(records.map(r => r.setor))], [records]);

  const handleFilterChange = (key: keyof typeof filters, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  if (!isAuthReady) {
    return (
      <div className="min-h-screen bg-[#06090f] flex items-center justify-center">
        <div className="w-12 h-12 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="min-h-screen bg-[#06090f] text-slate-100 font-sans selection:bg-cyan-500/30">
      
      {/* Header */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-gray-800/50 bg-[#0a0f18]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="bg-cyan-500/10 p-2 rounded-lg">
            <Package className="w-6 h-6 text-cyan-400" />
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
              Dashboard de Impressão 3D
            </h1>
            <p className="text-xs text-gray-400 font-medium">Controle de gastos com filamento e savings vs. orçamento externo</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-cyan-500/10 rounded-full border border-cyan-500/20">
            <TrendingUp className="w-3.5 h-3.5 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-tighter">ROI {((kpis.totalSaving / kpis.totalCusto) * 100).toFixed(0)}%</span>
          </div>
          <button 
            onClick={() => {
              setEditRecord(undefined);
              setIsModalOpen(true);
            }}
            className="flex items-center gap-2 bg-cyan-600 hover:bg-cyan-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold transition-all active:scale-95 shadow-lg shadow-cyan-900/20 outline-none"
          >
            <Plus className="w-4 h-4" />
            Novo item
          </button>
          <button 
            onClick={handleLogout}
            className="p-2.5 text-gray-400 hover:text-white hover:bg-white/5 rounded-xl transition-all outline-none"
            title="Sair"
          >
            <LogOut className="w-5 h-5" />
          </button>
        </div>
      </header>

      <main className="max-w-[1600px] mx-auto p-6 space-y-6">
        
        {/* Filters */}
        <section className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[300px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input 
              type="text" 
              placeholder="Buscar peça..." 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-[#111828]/50 border border-gray-800 rounded-xl py-2.5 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-cyan-500/20 focus:border-cyan-500/50 transition-all placeholder:text-gray-600 outline-none"
            />
          </div>
          <div className="flex items-center gap-2">
            <DropdownFilter 
              options={years} 
              value={filters.year} 
              onChange={(v) => handleFilterChange('year', v)} 
            />
            <DropdownFilter 
              options={months} 
              value={filters.month} 
              onChange={(v) => handleFilterChange('month', v)} 
            />
            <DropdownFilter 
              options={availableSectors} 
              value={filters.sector} 
              onChange={(v) => handleFilterChange('sector', v)} 
            />
          </div>
        </section>

        {/* KPI Grid */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <KPICard 
            title="SAVING TOTAL" 
            value={`R$ ${kpis.totalSaving.toLocaleString('pt-BR')}`} 
            subtitle="Orçamento externo – custo filamento" 
            icon={<PiggyBank className="w-5 h-5" />} 
            color="text-cyan-400"
            bg="bg-cyan-500/10"
          />
          <KPICard 
            title="CUSTO FILAMENTO" 
            value={`R$ ${kpis.totalCusto.toLocaleString('pt-BR')}`} 
            subtitle={`${kpis.totalFilamento.toLocaleString('pt-BR', { minimumFractionDigits: 1 })} m consumidos`} 
            icon={<Coins className="w-5 h-5" />} 
            color="text-orange-400"
            bg="bg-orange-500/10"
          />
          <KPICard 
            title="ORÇAMENTO EXTERNO" 
            value={`R$ ${kpis.totalOrcamento.toLocaleString('pt-BR')}`} 
            subtitle="Valor evitado em fornecedores" 
            icon={<Layers className="w-5 h-5" />} 
            color="text-green-400"
            bg="bg-green-500/10"
          />
          <KPICard 
            title="PEÇAS IMPRESSAS" 
            value={`${kpis.totalPrinted}`} 
            subtitle={`${kpis.count} registros de impressão`} 
            icon={<Boxes className="w-5 h-5" />} 
            color="text-slate-400"
            bg="bg-slate-500/10"
          />
        </section>

        {/* Charts Row */}
        <section className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-[#111828]/30 border border-gray-800 rounded-2xl p-6 relative overflow-hidden group">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Evolução Mensal</h3>
                <h4 className="text-lg font-semibold text-white">Custo vs. Orçamento Externo</h4>
              </div>
              <div className="bg-cyan-500/10 p-2 rounded-lg">
                <TrendingUp className="w-4 h-4 text-cyan-400" />
              </div>
            </div>
            <div className="h-[280px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartDataMonthly}>
                  <defs>
                    <linearGradient id="colorOrcamento" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#f97316" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#f97316" stopOpacity={0}/>
                    </linearGradient>
                    <linearGradient id="colorCusto" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#06b6d4" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1f2937" />
                  <XAxis 
                    dataKey="name" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: '#6b7280', fontSize: 10, fontWeight: 700 }}
                    tickFormatter={(val) => `R$${val/1000}k`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="orcamento" 
                    stroke="#f97316" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorOrcamento)" 
                    name="Orçamento externo"
                  />
                  <Area 
                    type="monotone" 
                    dataKey="custo" 
                    stroke="#00f0ff" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCusto)" 
                    name="Custo filamento"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-orange-500 shadow-md shadow-orange-900/50" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Orçamento externo</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-cyan-400 shadow-md shadow-cyan-900/50" />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-tighter">Custo filamento</span>
              </div>
            </div>
          </div>

          <div className="bg-[#111828]/30 border border-gray-800 rounded-2xl p-6 flex flex-col">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Por Setor</h3>
                <h4 className="text-lg font-semibold text-white">Frequência de uso</h4>
              </div>
              <div className="bg-purple-500/10 p-2 rounded-lg">
                <Package className="w-4 h-4 text-purple-400" />
              </div>
            </div>
            <div className="flex-1 h-[250px] w-full relative">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={chartDataSector}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={90}
                    paddingAngle={8}
                    dataKey="value"
                  >
                    {chartDataSector.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip content={<CustomTooltip />} />
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-2xl font-black text-white">{kpis.count}</span>
                <span className="text-[10px] text-gray-500 font-bold uppercase tracking-tighter">Total</span>
              </div>
            </div>
            <div className="space-y-2 mt-4 max-h-[120px] overflow-y-auto pr-2 custom-scrollbar">
              {chartDataSector.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
                    <span className="text-xs text-gray-400">{item.name}</span>
                  </div>
                  <span className="text-xs font-bold text-white tracking-widest">{item.value}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Top Savings Section */}
        <section className="bg-[#111828]/30 border border-gray-800 rounded-2xl p-6">
          <div className="mb-8">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Top Savings</h3>
            <h4 className="text-lg font-semibold text-white">Itens com maior economia gerada</h4>
          </div>
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={topSavingsData} layout="vertical" margin={{ left: 100 }}>
                <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1f2937" />
                <XAxis type="number" hide />
                <YAxis 
                  dataKey="name" 
                  type="category" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{ fill: '#9ca3af', fontSize: 10, fontWeight: 700 }}
                  width={150}
                />
                <Tooltip content={<CustomTooltip />} cursor={{ fill: '#ffffff05' }} />
                <Bar 
                  dataKey="value" 
                  fill="#00f0ff" 
                  radius={[0, 4, 4, 0]} 
                  barSize={16}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </section>

        {/* Table Section */}
        <section className="bg-[#111828]/20 border border-gray-800 rounded-2xl overflow-hidden shadow-2xl">
          <div className="p-6 border-b border-gray-800 flex items-center justify-between">
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">Registros</h3>
              <h4 className="text-lg font-semibold text-white flex items-center gap-2">
                {filteredRecords.length} Impressões
                <span className="text-xs bg-cyan-500/10 text-cyan-400 px-2 py-0.5 rounded-full border border-cyan-500/20">Histórico filtrado</span>
              </h4>
            </div>
            <button className="p-2 text-gray-500 hover:text-white transition-colors">
              <MoreHorizontal className="w-5 h-5" />
            </button>
          </div>
          <div className="overflow-x-auto custom-scrollbar">
            <table className="w-full text-left border-collapse min-w-[1000px]">
              <thead>
                <tr className="bg-black/20">
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Peça</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Setor</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Data</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Qty</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Custo</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest">Orçamento</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-cyan-400">Saving</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-center">Imagens</th>
                  <th className="px-6 py-4 text-[10px] font-black text-gray-500 uppercase tracking-widest text-right px-8">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-800/50">
                {filteredRecords.length > 0 ? filteredRecords.map((record) => (
                  <tr key={record.id} className="hover:bg-white/5 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-medium text-white group-hover:text-cyan-400 transition-colors uppercase">{record.peca}</span>
                        <span className="text-[10px] text-gray-500 font-mono">ID-{record.id.padStart(4, '0')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs text-gray-400 font-medium uppercase tracking-tight">{record.setor || '—'}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-xs text-gray-400 font-bold">
                        <Calendar className="w-3 h-3 text-cyan-500/50" />
                        {record.data}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className="inline-flex items-center justify-center min-w-[28px] h-7 px-2 rounded-lg bg-gray-800 border border-gray-700/50 text-xs font-black text-white">
                        {record.qty}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-bold text-white">R$ {record.custo}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-500 italic decoration-gray-700">R$ {record.orcamento}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col">
                        <span className="text-sm font-black text-cyan-400">R$ {record.saving.toLocaleString('pt-BR')}</span>
                        <span className="text-[9px] text-cyan-600 font-black uppercase tracking-widest">+{((record.saving / record.orcamento) * 100).toFixed(0)}% saving</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {record.images && record.images.length > 0 ? (
                        <button 
                          onClick={() => {
                            setViewerImages(record.images || []);
                            setViewerTitle(record.peca);
                            setIsViewerOpen(true);
                          }}
                          className="inline-flex items-center gap-2 px-2 py-1 bg-gray-800/50 border border-gray-700/50 rounded-lg hover:bg-cyan-500/10 hover:border-cyan-500/30 transition-all outline-none"
                        >
                          <div className="w-5 h-5 rounded-md overflow-hidden bg-gray-900 border border-gray-700">
                            <img src={record.images[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                          <div className="flex items-center gap-1">
                            <ImageIcon className="w-3 h-3 text-gray-500" />
                            <span className="text-[10px] font-bold text-gray-400">{record.images.length}</span>
                          </div>
                        </button>
                      ) : (
                        <span className="text-gray-700">—</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right px-8">
                      <div className="flex items-center justify-end gap-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => handleEdit(record)}
                            className="p-2 hover:bg-cyan-500/10 rounded-lg text-gray-600 hover:text-cyan-400 transition-all outline-none"
                            title="Editar"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button 
                            onClick={() => handleDelete(record.id)}
                            className="p-2 hover:bg-red-500/10 rounded-lg text-gray-600 hover:text-red-400 transition-all outline-none"
                            title="Excluir"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={8} className="px-6 py-12 text-center text-gray-500 italic text-sm">
                      Nenhum registro encontrado para os filtros selecionados
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <footer className="px-6 py-4 border-t border-gray-800 bg-[#06090f]/80 text-center">
        <p className="text-[10px] font-bold text-gray-600 uppercase tracking-widest">
          Sistema de Gestão de Impressão 3D • v1.4.2 • 2026
        </p>
      </footer>

      {/* Modals */}
      <NewItemModal 
        isOpen={isModalOpen} 
        onClose={() => {
          setIsModalOpen(false);
          setEditRecord(undefined);
        }} 
        onSave={handleSaveRecord} 
        editRecord={editRecord}
        availableSectors={sectors}
      />

      <ImageViewerModal 
        isOpen={isViewerOpen}
        onClose={() => setIsViewerOpen(false)}
        images={viewerImages}
        pezName={viewerTitle}
      />
    </div>
  );
}

// --- Helper Components ---

function DropdownFilter({ options, value, onChange }: { options: string[], value: string, onChange: (v: string) => void }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "flex items-center gap-2 px-4 py-2.5 bg-[#111828]/50 border rounded-xl text-xs font-bold text-gray-400 transition-all outline-none",
          isOpen || value.includes('Todos') ? "border-gray-800" : "border-cyan-500/50 text-cyan-400"
        )}
      >
        {value}
        <ChevronDown className={cn("w-3 h-3 transition-transform", isOpen && "rotate-180")} />
      </button>
      
      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute top-full right-0 mt-2 w-48 bg-[#0d131f] border border-gray-800 rounded-xl overflow-hidden shadow-2xl z-50 animate-in fade-in zoom-in duration-200">
            <div className="max-h-64 overflow-y-auto custom-scrollbar">
              {options.map((opt) => (
                <button
                  key={opt}
                  onClick={() => {
                    onChange(opt);
                    setIsOpen(false);
                  }}
                  className={cn(
                    "w-full text-left px-4 py-3 text-xs font-bold transition-colors hover:bg-white/5",
                    value === opt ? "text-cyan-400 bg-cyan-400/5" : "text-gray-400"
                  )}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

interface KPICardProps {
  title: string;
  value: string;
  subtitle: string;
  icon: React.ReactNode;
  color: string;
  bg: string;
}

function KPICard({ title, value, subtitle, icon, color, bg }: KPICardProps) {
  return (
    <div className="bg-[#111828]/30 border border-gray-800 rounded-2xl p-5 hover:border-gray-700 transition-all group overflow-hidden relative">
      <div className="flex items-start justify-between relative z-10">
        <div className="space-y-1">
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest group-hover:text-gray-400 transition-colors">
            {title}
          </p>
          <p className={cn("text-2xl font-black tracking-tight", color)}>
            {value}
          </p>
          <p className="text-[10px] font-bold text-gray-600">
            {subtitle}
          </p>
        </div>
        <div className={cn("p-2 rounded-xl transition-all group-hover:scale-110", bg)}>
          {React.cloneElement(icon as React.ReactElement, { className: cn("w-5 h-5", color) })}
        </div>
      </div>
      <div className={cn("absolute -right-4 -top-4 w-16 h-16 blur-2xl opacity-10 group-hover:opacity-20 transition-opacity rounded-full", bg)} />
    </div>
  );
}
