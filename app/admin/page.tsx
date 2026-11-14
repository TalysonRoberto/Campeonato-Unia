'use client';

import { useState, useEffect, FormEvent } from 'react';
import Link from 'next/link';
import Image from 'next/image';

interface Time {
  id: string;
  nome: string;
  jogadores: string[];
  logo: string;
  logoId?: string | null;
  cor: string;
  vitorias: number;
  empates: number;
  derrotas: number;
  pontos: number;
  mapasGanhos: number;
  mapasPerdidos: number;
}

const CORES_TIME = [
  { nome: 'Teal', valor: '#14b8a6' },
  { nome: 'Roxo', valor: '#a855f7' },
  { nome: 'Amarelo', valor: '#facc15' },
  { nome: 'Verde', valor: '#22c55e' },
  { nome: 'Vermelho', valor: '#ef4444' },
  { nome: 'Azul', valor: '#3b82f6' },
  { nome: 'Laranja', valor: '#f97316' },
  { nome: 'Rosa', valor: '#ec4899' },
  { nome: 'Ciano', valor: '#06b6d4' },
  { nome: 'Índigo', valor: '#6366f1' },
  { nome: 'Lima', valor: '#84cc16' },
  { nome: 'Coral', valor: '#f43f5e' }
];

interface Partida {
  id: string;
  timeA: string;
  timeB: string;
  data: string | null;
  horario: string | null;
  transmissao: string;
  fase: string;
  status: 'agendada' | 'ao_vivo' | 'finalizada';
  placarA: number;
  placarB: number;
  vencedor: string | null;
}

interface Torneio {
  nome: string;
  faseAtual: 'grupos' | 'playoffs';
  status: string;
}

export default function AdminPage() {
  const [logado, setLogado] = useState(false);
  const [senha, setSenha] = useState('');
  const [erroLogin, setErroLogin] = useState(false);
  const [secao, setSecao] = useState('dashboard');
  const [times, setTimes] = useState<Time[]>([]);
  const [partidas, setPartidas] = useState<Partida[]>([]);
  const [torneio, setTorneio] = useState<Torneio | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [partidaEditando, setPartidaEditando] = useState<Partida | null>(null);
  const [partidaEditandoInfo, setPartidaEditandoInfo] = useState<Partida | null>(null);
  const [timeEditando, setTimeEditando] = useState<Time | null>(null);
  const [montado, setMontado] = useState(false);

  useEffect(() => {
    setMontado(true);
    if (typeof window !== 'undefined' && sessionStorage.getItem('admin_logged') === 'true') {
      setLogado(true);
    }
  }, []);

  useEffect(() => {
    if (logado) {
      carregarDados();
    }
  }, [logado]);

  async function carregarDados() {
    setCarregando(true);
    try {
      const [timesRes, partidasRes, torneioRes] = await Promise.all([
        fetch('/api/times'),
        fetch('/api/partidas'),
        fetch('/api/torneio')
      ]);
      setTimes(await timesRes.json());
      setPartidas(await partidasRes.json());
      setTorneio(await torneioRes.json());
    } catch (erro) {
      console.error(erro);
      alert('Erro ao carregar dados');
    } finally {
      setCarregando(false);
    }
  }

  async function fazerLogin(e: FormEvent) {
    e.preventDefault();
    e.stopPropagation();

    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ senha })
      });

      if (res.ok) {
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('admin_logged', 'true');
        }
        setLogado(true);
        setErroLogin(false);
      } else {
        setErroLogin(true);
      }
    } catch (erro) {
      console.error(erro);
      setErroLogin(true);
    }
  }

  async function salvarTime(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch('/api/times', { method: 'POST', body: formData });
      if (res.ok) {
        form.reset();
        await carregarDados();
        alert('Time salvo com sucesso!');
      } else {
        alert('Erro ao salvar time');
      }
    } catch {
      alert('Erro ao salvar time');
    }
  }

  async function salvarEdicaoTime(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!timeEditando) return;
    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      const res = await fetch(`/api/times/${timeEditando.id}`, { method: 'PUT', body: formData });
      if (res.ok) {
        setTimeEditando(null);
        await carregarDados();
        alert('Time atualizado com sucesso!');
      } else {
        alert('Erro ao atualizar time');
      }
    } catch {
      alert('Erro ao atualizar time');
    }
  }

  async function excluirTime(id: string) {
    if (!confirm('Tem certeza que deseja excluir este time?')) return;
    try {
      await fetch(`/api/times/${id}`, { method: 'DELETE' });
      await carregarDados();
    } catch {
      alert('Erro ao excluir time');
    }
  }

  async function gerarFaseDeGrupos() {
    if (!confirm('Isso gerará todas as partidas da fase de grupos (todos contra todos). Continuar?')) return;
    try {
      const res = await fetch('/api/partidas/gerar-grupos', { method: 'POST' });
      if (res.ok) {
        await carregarDados();
        alert('Fase de grupos gerada com sucesso!');
      } else {
        const erro = await res.json();
        alert(erro.erro || 'Erro ao gerar fase de grupos');
      }
    } catch {
      alert('Erro ao gerar fase de grupos');
    }
  }

  async function salvarPartidaInfo(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!partidaEditandoInfo) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dados: any = {};
    formData.forEach((value, key) => dados[key] = value);

    const payload = {
      data: dados.data || null,
      horario: dados.horario || null,
      transmissao: dados.transmissao || '',
      fase: dados.fase || partidaEditandoInfo.fase
    };

    try {
      const res = await fetch(`/api/partidas/${partidaEditandoInfo.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setPartidaEditandoInfo(null);
        await carregarDados();
        alert('Partida atualizada com sucesso!');
      } else {
        alert('Erro ao atualizar partida');
      }
    } catch {
      alert('Erro ao atualizar partida');
    }
  }

  async function salvarResultado(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!partidaEditando) return;
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dados: any = {};
    formData.forEach((value, key) => dados[key] = value);

    const placarA = parseInt(dados.placarA) || 0;
    const placarB = parseInt(dados.placarB) || 0;

    const payload = {
      status: dados.status,
      placarA,
      placarB,
      transmissao: dados.transmissao || ''
    };

    try {
      const res = await fetch(`/api/partidas/${partidaEditando.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        setPartidaEditando(null);
        await carregarDados();
        alert('Resultado salvo com sucesso!');
      } else {
        alert('Erro ao salvar resultado');
      }
    } catch {
      alert('Erro ao salvar resultado');
    }
  }

  async function excluirPartida(id: string) {
    if (!confirm('Tem certeza que deseja excluir esta partida?')) return;
    try {
      await fetch(`/api/partidas/${id}`, { method: 'DELETE' });
      await carregarDados();
    } catch {
      alert('Erro ao excluir partida');
    }
  }

  async function gerarPlayoffs() {
    if (!confirm('Isso gerará o chaveamento de playoffs com base na classificação atual. Continuar?')) return;
    try {
      const res = await fetch('/api/chaveamento/gerar', { method: 'POST' });
      if (res.ok) {
        await carregarDados();
        alert('Playoffs gerados com sucesso!');
      } else {
        const erro = await res.json();
        alert(erro.erro || 'Erro ao gerar playoffs');
      }
    } catch {
      alert('Erro ao gerar playoffs');
    }
  }

  function renderizarListaPartidas(lista: Partida[], titulo: string) {
    return (
      <div className="bg-white/5 border border-white/10 p-6 mb-6">
        <h3 className="font-rajdhani font-bold text-xl mb-6">{titulo}</h3>
        {lista.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Nenhuma partida agendada</p>
        ) : (
          <div className="space-y-4">
            {lista.map(partida => {
              const timeA = getTimePorId(partida.timeA);
              const timeB = getTimePorId(partida.timeB);
              return (
                <div key={partida.id} className="bg-white/5 border border-white/10 p-4 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <span className="font-rajdhani font-bold">{timeA.nome}</span>
                    <span className="text-valorant-red font-bold">VS</span>
                    <span className="font-rajdhani font-bold">{timeB.nome}</span>
                  </div>
                  <div className="flex items-center gap-4 flex-wrap">
                    <span className="text-gray-400 text-sm font-rajdhani uppercase">{partida.fase}</span>
                    <span className="text-gray-400 text-sm font-rajdhani">{partida.data || 'A definir'} {partida.horario || ''}</span>
                    <span className={`px-3 py-1 text-xs font-rajdhani font-bold tracking-wider ${
                      partida.status === 'ao_vivo' ? 'bg-red-600 text-white' :
                      partida.status === 'finalizada' ? 'bg-yellow-400/10 text-yellow-400' :
                      'bg-white/10 text-gray-300'
                    }`}>
                      {partida.status === 'ao_vivo' ? 'AO VIVO' : partida.status === 'finalizada' ? 'FINALIZADA' : 'AGENDADA'}
                    </span>
                    {partida.status === 'finalizada' && <span className="font-rajdhani font-bold">{partida.placarA} - {partida.placarB}</span>}
                    <button onClick={() => setPartidaEditandoInfo(partida)} className="px-3 py-2 bg-valorant-blue/10 text-valorant-blue hover:bg-valorant-blue/20 font-rajdhani font-bold text-sm transition-all">EDITAR</button>
                    <button onClick={() => setPartidaEditando(partida)} className="px-3 py-2 bg-yellow-400/10 text-yellow-400 hover:bg-yellow-400/20 font-rajdhani font-bold text-sm transition-all">RESULTADO</button>
                    <button onClick={() => excluirPartida(partida.id)} className="px-3 py-2 bg-valorant-red/10 text-valorant-red hover:bg-valorant-red/20 font-rajdhani font-bold text-sm transition-all">EXCLUIR</button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  async function salvarConfig(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    const formData = new FormData(form);
    const dados: any = {};
    formData.forEach((value, key) => dados[key] = value);

    try {
      const res = await fetch('/api/torneio', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      });
      if (res.ok) {
        await carregarDados();
        alert('Configurações salvas com sucesso!');
      } else {
        alert('Erro ao salvar configurações');
      }
    } catch {
      alert('Erro ao salvar configurações');
    }
  }

  function getTimePorId(id: string) {
    return times.find(t => t.id === id) || { nome: 'Desconhecido', logo: '/img/logo.png' };
  }

  if (!montado || !logado) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-valorant-darker">
        <div className="w-full max-w-md p-8 border border-white/10 bg-white/5">
          <div className="text-center mb-8">
            <Image src="/img/logo.png" alt="Campeonato Unia" width={80} height={80} className="h-20 mx-auto mb-4 object-contain" />
            <h1 className="font-rajdhani font-bold text-3xl">PAINEL <span className="text-valorant-red">ADMINISTRATIVO</span></h1>
            <p className="text-gray-400 mt-2">Acesso restrito ao administrador</p>
          </div>
          <form onSubmit={fazerLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">SENHA</label>
              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                className="admin-input"
                placeholder="Digite a senha"
              />
            </div>
            <button type="submit" className="w-full px-6 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider clip-button transition-all duration-300">
              ENTRAR
            </button>
            {erroLogin && <p className="text-valorant-red text-sm text-center">Senha incorreta</p>}
          </form>
        </div>
      </div>
    );
  }

  if (carregando) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-valorant-dark">
        <p className="font-rajdhani text-xl text-gray-400">Carregando...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-valorant-dark flex">
      {/* Sidebar */}
      <aside className="hidden lg:flex flex-col w-64 bg-valorant-darker border-r border-white/10 fixed h-full">
        <div className="p-6 border-b border-white/10">
          <Image src="/img/logo.png" alt="Campeonato Unia" width={48} height={48} className="h-12 mx-auto object-contain" />
        </div>
        <nav className="p-4 space-y-2 flex-1">
          {[
            { id: 'dashboard', label: 'DASHBOARD' },
            { id: 'times', label: 'TIMES' },
            { id: 'partidas', label: 'PARTIDAS' },
            { id: 'classificacao', label: 'CLASSIFICAÇÃO' },
            { id: 'playoffs', label: 'PLAYOFFS' },
            { id: 'configuracoes', label: 'CONFIGURAÇÕES' }
          ].map(item => (
            <button
              key={item.id}
              onClick={() => setSecao(item.id)}
              className={`w-full text-left px-4 py-3 font-rajdhani font-bold tracking-wider transition-all border-l-4 ${
                secao === item.id
                  ? 'bg-valorant-red/10 border-valorant-red text-white'
                  : 'border-transparent text-white/60 hover:text-white hover:bg-white/5'
              }`}
            >
              {item.label}
            </button>
          ))}
        </nav>
        <div className="p-4 border-t border-white/10">
          <Link href="/" target="_blank" className="block w-full px-4 py-3 border border-white/20 text-center font-rajdhani font-bold tracking-wider hover:border-valorant-red hover:text-valorant-red transition-all text-white">
            VER SITE
          </Link>
          <button
            onClick={() => { sessionStorage.removeItem('admin_logged'); setLogado(false); }}
            className="w-full mt-2 px-4 py-3 text-gray-500 font-rajdhani font-bold tracking-wider hover:text-white transition-all"
          >
            SAIR
          </button>
        </div>
      </aside>

      {/* Mobile header */}
      <div className="lg:hidden fixed top-0 w-full bg-valorant-darker border-b border-white/10 z-40 px-4 py-3 flex items-center justify-between">
        <Image src="/img/logo.png" alt="Campeonato Unia" width={40} height={40} className="h-10 object-contain" />
        <select
          value={secao}
          onChange={(e) => setSecao(e.target.value)}
          className="admin-input w-auto"
        >
          <option value="dashboard">Dashboard</option>
          <option value="times">Times</option>
          <option value="partidas">Partidas</option>
          <option value="classificacao">Classificação</option>
          <option value="playoffs">Playoffs</option>
          <option value="configuracoes">Configurações</option>
        </select>
      </div>

      {/* Main content */}
      <main className="lg:ml-64 flex-1 pt-20 lg:pt-0 min-h-screen">
        <div className="p-6 lg:p-10">
          <div className="mb-8">
            <h1 className="font-rajdhani font-bold text-4xl mb-2">PAINEL <span className="text-valorant-red">ADMINISTRATIVO</span></h1>
            <p className="text-gray-400">Gerencie times, partidas e acompanhe o campeonato</p>
          </div>

          {secao === 'dashboard' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2">
                  <span className="text-gray-400 text-sm font-rajdhani tracking-wider">TIMES</span>
                  <span className="text-3xl font-rajdhani font-bold text-valorant-red">{times.length}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2">
                  <span className="text-gray-400 text-sm font-rajdhani tracking-wider">PARTIDAS</span>
                  <span className="text-3xl font-rajdhani font-bold text-white">{partidas.length}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2">
                  <span className="text-gray-400 text-sm font-rajdhani tracking-wider">FINALIZADAS</span>
                  <span className="text-3xl font-rajdhani font-bold text-valorant-purple">{partidas.filter(p => p.status === 'finalizada').length}</span>
                </div>
                <div className="bg-white/5 border border-white/10 p-6 flex flex-col gap-2">
                  <span className="text-gray-400 text-sm font-rajdhani tracking-wider">FASE</span>
                  <span className="text-3xl font-rajdhani font-bold text-yellow-400">{torneio?.faseAtual === 'grupos' ? 'GRUPOS' : 'PLAYOFFS'}</span>
                </div>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="font-rajdhani font-bold text-xl mb-4">AÇÕES RÁPIDAS</h3>
                <div className="flex flex-wrap gap-4">
                  <button onClick={() => setSecao('times')} className="px-6 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider clip-button transition-all">+ NOVO TIME</button>
                  <button onClick={gerarFaseDeGrupos} disabled={times.length < 2} className="px-6 py-3 bg-white/10 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider clip-button transition-all">AGENDAR FASE DE GRUPOS</button>
                  <button onClick={gerarPlayoffs} className="px-6 py-3 border border-valorant-red text-valorant-red hover:bg-valorant-red hover:text-white font-rajdhani font-bold tracking-wider clip-button transition-all">GERAR PLAYOFFS</button>
                </div>
              </div>
            </div>
          )}

          {secao === 'times' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="font-rajdhani font-bold text-xl mb-6">CADASTRAR NOVO TIME</h3>
                <form onSubmit={salvarTime} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">NOME DO TIME</label>
                    <input type="text" name="nome" required className="admin-input" placeholder="Ex: Sentinels" />
                  </div>
                  <div>
                    <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">JOGADORES (separados por vírgula)</label>
                    <input type="text" name="jogadores" required className="admin-input" placeholder="Ex: Sacy, pANcada, aspas" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">COR DO TIME</label>
                    <div className="grid grid-cols-6 sm:grid-cols-12 gap-3">
                      {CORES_TIME.map(cor => {
                        const usada = times.some(t => t.cor === cor.valor);
                        return (
                          <label key={cor.valor} title={usada ? `${cor.nome} (já em uso)` : cor.nome} className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${usada ? 'opacity-40 cursor-not-allowed' : 'border-transparent hover:border-white'}`}>
                            <input type="radio" name="cor" value={cor.valor} defaultChecked={cor.valor === CORES_TIME[0].valor} disabled={usada} className="peer sr-only" />
                            <div className="h-10 w-full" style={{ backgroundColor: cor.valor }} />
                            {usada && <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">&times;</span>}
                          </label>
                        );
                      })}
                    </div>
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">LOGO DO TIME</label>
                    <input type="file" name="logo" accept="image/*" className="admin-input py-2" />
                  </div>
                  <div className="md:col-span-2">
                    <button type="submit" className="px-8 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider clip-button transition-all">SALVAR TIME</button>
                  </div>
                </form>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="font-rajdhani font-bold text-xl mb-6">TIMES CADASTRADOS</h3>
                {times.length === 0 ? (
                  <p className="text-gray-500 text-center py-4">Nenhum time cadastrado</p>
                ) : (
                  <div className="space-y-4">
                    {times.map(time => (
                      <div key={time.id} className="bg-white/5 border border-white/10 p-4 flex items-center justify-between hover:border-valorant-red/20 transition-colors">
                        <div className="flex items-center gap-4">
                          <div className="w-2 h-12 rounded-sm" style={{ backgroundColor: time.cor }} />
                          <Image src={time.logo} alt={time.nome} width={48} height={48} className="w-12 h-12 object-contain" />
                          <div>
                            <h4 className="font-rajdhani font-bold text-lg">{time.nome}</h4>
                            <p className="text-gray-400 text-sm">{time.jogadores.join(', ')}</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <button onClick={() => setTimeEditando(time)} className="px-4 py-2 bg-valorant-blue/10 text-valorant-blue hover:bg-valorant-blue/20 font-rajdhani font-bold text-sm transition-all">EDITAR</button>
                          <button onClick={() => excluirTime(time.id)} className="px-4 py-2 bg-valorant-red/10 text-valorant-red hover:bg-valorant-red/20 font-rajdhani font-bold text-sm transition-all">EXCLUIR</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}

          {secao === 'partidas' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="font-rajdhani font-bold text-xl mb-4">FASE DE GRUPOS</h3>
                <p className="text-gray-400 mb-6">
                  Cadastre todos os times primeiro. Depois clique em "AGENDAR FASE DE GRUPOS" para gerar automaticamente todas as partidas no formato todos contra todos.
                </p>
                <button
                  onClick={gerarFaseDeGrupos}
                  disabled={times.length < 2}
                  className="px-8 py-3 bg-valorant-red hover:bg-valorant-red-light disabled:opacity-50 disabled:cursor-not-allowed text-white font-rajdhani font-bold tracking-wider clip-button transition-all"
                >
                  AGENDAR FASE DE GRUPOS
                </button>
              </div>
              {renderizarListaPartidas(partidas.filter(p => p.fase === 'grupos'), 'FASE DE GRUPOS')}
              {partidas.some(p => p.fase !== 'grupos') && renderizarListaPartidas(partidas.filter(p => p.fase !== 'grupos'), 'PLAYOFFS')}
            </div>
          )}

          {secao === 'classificacao' && (
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="font-rajdhani font-bold text-xl mb-6">TABELA DE CLASSIFICAÇÃO</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr>
                      <th className="text-left bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">POS</th>
                      <th className="text-left bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">TIME</th>
                      <th className="text-center bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">V</th>
                      <th className="text-center bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">E</th>
                      <th className="text-center bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">D</th>
                      <th className="text-center bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">SALDO</th>
                      <th className="text-center bg-valorant-red/10 px-4 py-3 font-rajdhani font-bold text-valorant-red border-b-2 border-valorant-red">PTS</th>
                    </tr>
                  </thead>
                  <tbody>
                    {times.length === 0 ? (
                      <tr><td colSpan={7} className="text-center py-4 text-gray-500">Nenhum time classificado</td></tr>
                    ) : (
                      [...times]
                        .sort((a, b) => {
                          if (b.pontos !== a.pontos) return b.pontos - a.pontos;
                          const saldoA = a.mapasGanhos - a.mapasPerdidos;
                          const saldoB = b.mapasGanhos - b.mapasPerdidos;
                          if (saldoB !== saldoA) return saldoB - saldoA;
                          if (b.vitorias !== a.vitorias) return b.vitorias - a.vitorias;
                          return a.derrotas - b.derrotas;
                        })
                        .map((time, index) => (
                          <tr key={time.id} className="border-b border-white/5 hover:bg-valorant-red/5 transition-colors">
                            <td className="px-4 py-3 font-rajdhani font-bold">#{index + 1}</td>
                            <td className="px-4 py-3">
                              <div className="flex items-center gap-3">
                                <div className="w-1 h-8 rounded-sm" style={{ backgroundColor: time.cor }} />
                                <Image src={time.logo} alt={time.nome} width={32} height={32} className="w-8 h-8 object-contain" />
                                <span className="font-semibold">{time.nome}</span>
                              </div>
                            </td>
                            <td className="text-center px-4 py-3 font-rajdhani font-bold">{time.vitorias}</td>
                            <td className="text-center px-4 py-3 font-rajdhani font-bold">{time.empates}</td>
                            <td className="text-center px-4 py-3 font-rajdhani font-bold">{time.derrotas}</td>
                            <td className="text-center px-4 py-3 font-rajdhani font-bold">{time.mapasGanhos - time.mapasPerdidos}</td>
                            <td className="text-center px-4 py-3 font-rajdhani font-bold text-valorant-red">{time.pontos}</td>
                          </tr>
                        ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {secao === 'playoffs' && (
            <div className="space-y-6">
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="font-rajdhani font-bold text-xl mb-4">CHAVEAMENTO DE PLAYOFFS</h3>
                <p className="text-gray-400 mb-6">
                  {torneio?.faseAtual === 'playoffs'
                    ? 'Os playoffs foram gerados automaticamente ao finalizar a fase de grupos. Você pode gerenciar as partidas abaixo.'
                    : 'Ao finalizar a fase de grupos, o sistema criará automaticamente as partidas de playoffs com base na classificação. Você também pode gerar manualmente.'}
                </p>
                <button onClick={gerarPlayoffs} className="px-8 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider clip-button transition-all">GERAR PLAYOFFS MANUALMENTE</button>
              </div>
              <div className="bg-white/5 border border-white/10 p-6">
                <h3 className="font-rajdhani font-bold text-xl mb-6">PARTIDAS DE PLAYOFFS</h3>
                {times.length < 4 ? (
                  <p className="text-gray-500 text-center py-4">São necessários pelo menos 4 times para gerar playoffs</p>
                ) : partidas.some(p => p.fase !== 'grupos') ? (
                  renderizarListaPartidas(partidas.filter(p => p.fase !== 'grupos'), '')
                ) : (
                  <p className="text-gray-500 text-center py-4">Nenhum playoff gerado ainda. Finalize a fase de grupos ou clique em "GERAR PLAYOFFS MANUALMENTE".</p>
                )}
              </div>
            </div>
          )}

          {secao === 'configuracoes' && torneio && (
            <div className="bg-white/5 border border-white/10 p-6">
              <h3 className="font-rajdhani font-bold text-xl mb-6">CONFIGURAÇÕES DO TORNEIO</h3>
              <form onSubmit={salvarConfig} className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">NOME DO TORNEIO</label>
                  <input type="text" name="nome" defaultValue={torneio.nome} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">STATUS</label>
                  <select name="status" defaultValue={torneio.status} className="admin-input">
                    <option value="Em andamento">Em andamento</option>
                    <option value="Aguardando">Aguardando</option>
                    <option value="Encerrado">Encerrado</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">FASE ATUAL</label>
                  <select name="faseAtual" defaultValue={torneio.faseAtual} className="admin-input">
                    <option value="grupos">Fase de Grupos</option>
                    <option value="playoffs">Playoffs</option>
                  </select>
                </div>
                <div className="md:col-span-2">
                  <button type="submit" className="px-8 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider clip-button transition-all">SALVAR CONFIGURAÇÕES</button>
                </div>
              </form>
            </div>
          )}
        </div>
      </main>

      {/* Modal Editar Informações */}
      {partidaEditandoInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 border border-white/10 bg-valorant-darker max-h-[90vh] overflow-y-auto">
            <h3 className="font-rajdhani font-bold text-2xl mb-6">EDITAR PARTIDA</h3>
            <form onSubmit={salvarPartidaInfo} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">DATA</label>
                  <input type="date" name="data" defaultValue={partidaEditandoInfo.data || ''} className="admin-input" />
                </div>
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">HORÁRIO</label>
                  <input type="time" name="horario" defaultValue={partidaEditandoInfo.horario || ''} className="admin-input" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">LINK DA TRANSMISSÃO</label>
                <input type="url" name="transmissao" defaultValue={partidaEditandoInfo.transmissao} className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">FASE</label>
                <select name="fase" defaultValue={partidaEditandoInfo.fase} className="admin-input">
                  <option value="grupos">Fase de Grupos</option>
                  <option value="semifinal">Semifinal (4 times)</option>
                  <option value="semifinal1">Semifinal 1</option>
                  <option value="semifinal2">Semifinal 2</option>
                  <option value="terceiro">Disputa 3º Lugar</option>
                  <option value="final">Final</option>
                </select>
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setPartidaEditandoInfo(null)} className="flex-1 px-4 py-3 border border-white/20 text-white font-rajdhani font-bold tracking-wider hover:border-valorant-red hover:text-valorant-red transition-all">CANCELAR</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider transition-all">SALVAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Editar Time */}
      {timeEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 border border-white/10 bg-valorant-darker max-h-[90vh] overflow-y-auto">
            <h3 className="font-rajdhani font-bold text-2xl mb-6">EDITAR TIME</h3>
            <form onSubmit={salvarEdicaoTime} className="space-y-4">
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">NOME DO TIME</label>
                <input type="text" name="nome" defaultValue={timeEditando.nome} required className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">JOGADORES (separados por vírgula)</label>
                <input type="text" name="jogadores" defaultValue={timeEditando.jogadores.join(', ')} required className="admin-input" />
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">COR DO TIME</label>
                <div className="grid grid-cols-6 gap-3">
                  {CORES_TIME.map(cor => {
                    const usadaPorOutro = times.some(t => t.cor === cor.valor && t.id !== timeEditando.id);
                    return (
                      <label key={cor.valor} title={usadaPorOutro ? `${cor.nome} (já em uso)` : cor.nome} className={`relative cursor-pointer rounded-md overflow-hidden border-2 transition-all ${usadaPorOutro ? 'opacity-40 cursor-not-allowed' : 'border-transparent hover:border-white'}`}>
                        <input type="radio" name="cor" value={cor.valor} defaultChecked={timeEditando.cor === cor.valor} disabled={usadaPorOutro} className="peer sr-only" />
                        <div className="h-10 w-full" style={{ backgroundColor: cor.valor }} />
                        {usadaPorOutro && <span className="absolute inset-0 flex items-center justify-center text-white text-xs font-bold">&times;</span>}
                      </label>
                    );
                  })}
                </div>
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">LOGO DO TIME (deixe em branco para manter o atual)</label>
                <input type="file" name="logo" accept="image/*" className="admin-input py-2" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setTimeEditando(null)} className="flex-1 px-4 py-3 border border-white/20 text-white font-rajdhani font-bold tracking-wider hover:border-valorant-red hover:text-valorant-red transition-all">CANCELAR</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider transition-all">SALVAR</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Resultado */}
      {partidaEditando && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="w-full max-w-lg p-6 border border-white/10 bg-valorant-darker max-h-[90vh] overflow-y-auto">
            <h3 className="font-rajdhani font-bold text-2xl mb-2">REGISTRAR RESULTADO</h3>
            <p className="text-gray-400 text-sm mb-6">
              {partidaEditando.fase === 'grupos'
                ? 'Fase de grupos: melhor de 2 mapas. 2x0 = vitória, 1x1 = empate.'
                : 'Playoffs: melhor de 3 mapas. Quem fizer 2 pontos primeiro vence.'}
            </p>

            <div className="flex items-center justify-between gap-4 mb-6 p-4 bg-white/5 border border-white/10">
              <div className="flex items-center gap-3 flex-1 justify-center">
                <Image src={getTimePorId(partidaEditando.timeA).logo} alt="" width={40} height={40} className="w-10 h-10 object-contain" />
                <span className="font-rajdhani font-bold text-lg">{getTimePorId(partidaEditando.timeA).nome}</span>
              </div>
              <span className="text-valorant-red font-bold">VS</span>
              <div className="flex items-center gap-3 flex-1 justify-center">
                <span className="font-rajdhani font-bold text-lg">{getTimePorId(partidaEditando.timeB).nome}</span>
                <Image src={getTimePorId(partidaEditando.timeB).logo} alt="" width={40} height={40} className="w-10 h-10 object-contain" />
              </div>
            </div>

            <form onSubmit={salvarResultado} className="space-y-4">
              <input type="hidden" name="partidaId" value={partidaEditando.id} />
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">STATUS</label>
                <select name="status" defaultValue={partidaEditando.status} className="admin-input">
                  <option value="agendada">Agendada</option>
                  <option value="ao_vivo">Ao Vivo</option>
                  <option value="finalizada">Finalizada</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">{getTimePorId(partidaEditando.timeA).nome}</label>
                  <input type="number" name="placarA" min="0" max={partidaEditando.fase === 'grupos' ? 2 : 3} defaultValue={partidaEditando.placarA} className="admin-input text-center text-2xl py-4" />
                </div>
                <div>
                  <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">{getTimePorId(partidaEditando.timeB).nome}</label>
                  <input type="number" name="placarB" min="0" max={partidaEditando.fase === 'grupos' ? 2 : 3} defaultValue={partidaEditando.placarB} className="admin-input text-center text-2xl py-4" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-rajdhani font-bold tracking-wider text-gray-400 mb-2">LINK DA TRANSMISSÃO</label>
                <input type="url" name="transmissao" defaultValue={partidaEditando.transmissao} className="admin-input" />
              </div>
              <div className="flex gap-4 pt-4">
                <button type="button" onClick={() => setPartidaEditando(null)} className="flex-1 px-4 py-3 border border-white/20 text-white font-rajdhani font-bold tracking-wider hover:border-valorant-red hover:text-valorant-red transition-all">CANCELAR</button>
                <button type="submit" className="flex-1 px-4 py-3 bg-valorant-red hover:bg-valorant-red-light text-white font-rajdhani font-bold tracking-wider transition-all">SALVAR</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
