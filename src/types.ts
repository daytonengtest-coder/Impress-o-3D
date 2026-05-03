/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface PrintingRecord {
  id: string;
  peca: string;
  setor: string;
  data: string;
  qty: number;
  custo: number;
  orcamento: number;
  saving: number;
  filamento?: number;
  observacao?: string;
  images?: string[];
}

export type NewPrintingRecord = Omit<PrintingRecord, 'id' | 'saving'>;

export const MOCK_RECORDS: PrintingRecord[] = [
  { id: '1', peca: 'Base pra cortina do sensor da preca', setor: 'Industrial', data: '04/02/2026', qty: 2, custo: 82, orcamento: 500, saving: 418, filamento: 15.5 },
  { id: '2', peca: 'Berço de Parafusamento do P3H E P3K', setor: 'Montagem', data: '03/02/2026', qty: 1, custo: 76, orcamento: 1800, saving: 1724, filamento: 12.2 },
  { id: '3', peca: 'Pá para limitar a quantidade de parafusos', setor: 'Logística', data: '04/02/2026', qty: 5, custo: 74, orcamento: 100, saving: 26, filamento: 8.0 },
  { id: '4', peca: 'Berço de Parafusamento do D140', setor: 'Montagem', data: '07/02/2026', qty: 1, custo: 145, orcamento: 2200, saving: 2055, filamento: 22.1 },
  { id: '5', peca: 'Tampa do cortador de fita', setor: 'Industrial', data: '10/02/2026', qty: 1, custo: 14, orcamento: 50, saving: 36, filamento: 2.5 },
  { id: '6', peca: 'Dispositivo para prença da lente camera do a960', setor: 'Industrial', data: '10/02/2026', qty: 2, custo: 75, orcamento: 500, saving: 425, filamento: 14.8 },
  { id: '7', peca: 'Dispositivo para prença do LCD do a960', setor: 'Industrial', data: '10/02/2026', qty: 3, custo: 280, orcamento: 3900, saving: 3620, filamento: 45.0 },
  { id: '13', peca: 'Berço de Parafusamento do T8', setor: 'Montagem', data: '18/01/2026', qty: 1, custo: 58, orcamento: 1500, saving: 1442, filamento: 11.5 },
  { id: '15', peca: 'Dispositivo para prença do LCD do a915', setor: 'Industrial', data: '20/01/2026', qty: 4, custo: 314, orcamento: 4800, saving: 4486, filamento: 52.3 },
  { id: '20', peca: 'Berço de Parafusamento do D230', setor: 'Montagem', data: '14/04/2026', qty: 5, custo: 486, orcamento: 14000, saving: 13514, filamento: 85.0 },
  { id: '21', peca: 'Suporte de ferramentas v2', setor: 'Logística', data: '15/03/2026', qty: 2, custo: 45, orcamento: 300, saving: 255, filamento: 7.5 },
  { id: '22', peca: 'Gabarito de furação X1', setor: 'Montagem', data: '20/03/2026', qty: 1, custo: 120, orcamento: 2500, saving: 2380, filamento: 18.2 },
];

export const MONTHLY_DATA = [
  { name: 'Fev/26', orcamento: 14500, custo: 1200 },
  { name: 'Mar/26', orcamento: 12800, custo: 1100 },
  { name: 'Abr/26', orcamento: 24500, custo: 1800 },
];

export const TOP_SAVINGS_DATA = [
  { name: 'Berço de Parafusamento... (D230)', value: 13514 },
  { name: 'Dispositivo para prença... (LCD a915)', value: 4486 },
  { name: 'Dispositivo para prença... (LCD a960)', value: 3620 },
  { name: 'Berço de Parafusamento... (D140)', value: 2055 },
  { name: 'Berço de Parafusamento... (P3H/P3K)', value: 1724 },
  { name: 'Berço de Parafusamento... (T8)', value: 1442 },
  { name: 'Base pra cortina... (Sensor)', value: 418 },
];

export const SECTOR_DATA = [
  { name: 'Industrial', value: 12, color: '#00f0ff' },
  { name: 'Montagem', value: 8, color: '#00c2cc' },
  { name: 'Logística', value: 2, color: '#00949c' },
];
