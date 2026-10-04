import { useEffect, useRef, useState } from "react";
import { AudioLines, ChevronDown, Music2, Pause, Play, Volume2, VolumeX } from "lucide-react";

const TRACK = "/assets/firmament-inner-peace-528hz.mp3";
const ENABLED_KEY = "firmament-music-enabled";
const VOLUME_KEY = "firmament-music-volume";

export function ObservatorySoundscape() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [enabled, setEnabled] = useState(true);
  const [expanded, setExpanded] = useState(false);
  const [volume, setVolume] = useState(0.22);
  const [showWelcome, setShowWelcome] = useState(false);
  const [playing, setPlaying] = useState(true);

  useEffect(() => {
    const storedVolume = Number(window.localStorage.getItem(VOLUME_KEY));
    if (Number.isFinite(storedVolume) && storedVolume >= 0 && storedVolume <= 1) setVolume(storedVolume);
    window.localStorage.setItem(ENABLED_KEY, "true");
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
    audio.volume = volume;
    audio.loop = true;
    if (enabled && playing) void audio.play().catch(() => { setPlaying(false); setShowWelcome(true); });
    if (!enabled || !playing) audio.pause();
  }, [enabled, playing, volume]);

  useEffect(() => () => { audioRef.current?.pause(); }, []);

  const togglePlayback = () => {
    const next = !playing;
    setEnabled(true);
    setPlaying(next);
    window.localStorage.setItem(ENABLED_KEY, "true");
    setShowWelcome(false);
  };

  const toggleMute = () => {
    if (playing) {
      setPlaying(false);
      return;
    }
    togglePlayback();
  };

  const updateVolume = (value: number) => {
    setVolume(value);
    window.localStorage.setItem(VOLUME_KEY, String(value));
    if (value > 0 && !playing) setPlaying(true);
    setEnabled(true);
    window.localStorage.setItem(ENABLED_KEY, "true");
  };

  return <>
    <audio ref={audioRef} src={TRACK} preload="metadata" autoPlay onPlay={() => setPlaying(true)} onPause={() => setPlaying(false)} onEnded={() => setPlaying(false)} aria-hidden="true" />
    {showWelcome && <div className="fixed bottom-20 right-4 z-40 w-[min(21rem,calc(100vw-2rem))] rounded-2xl border border-cyan-200/20 bg-[#0a1020]/95 p-4 text-slate-100 shadow-2xl shadow-black/40 backdrop-blur-xl"><div className="flex items-start gap-3"><div className="rounded-xl border border-violet-200/20 bg-violet-200/[.08] p-2"><Music2 className="h-4 w-4 text-violet-200" /></div><div className="min-w-0"><div className="text-[10px] font-bold uppercase tracking-[.18em] text-cyan-300">Soundscape ready</div><p className="mt-1 text-sm leading-5 text-slate-300">Firmament is ready to play the Inner Peace 528 Hz meditation track as you explore the sky. Your browser may require one tap to allow sound.</p><div className="mt-3 flex gap-2"><button type="button" onClick={togglePlayback} className="rounded-xl bg-cyan-300 px-3 py-2 text-xs font-bold text-slate-950 hover:bg-cyan-200">Start music</button><button type="button" onClick={() => { window.localStorage.setItem(ENABLED_KEY, "false"); setShowWelcome(false); }} className="rounded-xl border border-white/10 px-3 py-2 text-xs text-slate-400 hover:text-white">Keep silent</button></div></div></div></div>}
    <div className="fixed bottom-4 right-4 z-30 flex items-center gap-2"><div className={`overflow-hidden rounded-full border border-violet-200/20 bg-slate-950/85 shadow-xl shadow-violet-950/20 backdrop-blur-xl transition-all ${expanded ? "w-52" : "w-0"}`}><div className="flex h-10 items-center gap-2 px-3"><span className="truncate text-[9px] font-semibold uppercase tracking-[.12em] text-violet-100">Inner Peace · 528 Hz</span><input aria-label="Music volume" type="range" min="0" max="1" step="0.01" value={volume} onChange={event => updateVolume(Number(event.target.value))} className="w-16 accent-cyan-300" /></div></div><button type="button" onClick={() => setExpanded(value => !value)} aria-expanded={expanded} aria-label="Open music controls" className="rounded-full border border-violet-200/20 bg-slate-950/85 p-2 text-slate-300 shadow-xl shadow-violet-950/20 backdrop-blur-xl hover:border-violet-200/45 hover:text-white"><ChevronDown className={`h-3.5 w-3.5 transition-transform ${expanded ? "rotate-180" : ""}`} /></button><button type="button" onClick={togglePlayback} aria-pressed={playing} aria-label={playing ? "Pause background music" : "Play background music"} className="inline-flex items-center gap-2 rounded-full border border-violet-200/20 bg-slate-950/85 px-3 py-2 text-[10px] font-semibold uppercase tracking-[.16em] text-violet-100 shadow-xl shadow-violet-950/20 backdrop-blur-xl hover:border-violet-200/45 hover:bg-slate-900/90">{playing ? <Pause className="h-3.5 w-3.5 text-cyan-300" /> : <Play className="h-3.5 w-3.5 text-violet-200" />}<span className="hidden sm:inline">{playing ? "Music on" : "Music off"}</span></button><button type="button" onClick={toggleMute} aria-label={playing ? "Mute background music" : "Unmute background music"} className="rounded-full border border-violet-200/20 bg-slate-950/85 p-2 text-slate-300 shadow-xl shadow-violet-950/20 backdrop-blur-xl hover:border-violet-200/45 hover:text-white">{playing ? <Volume2 className="h-3.5 w-3.5" /> : <VolumeX className="h-3.5 w-3.5" />}</button><AudioLines className={`h-3.5 w-3.5 ${playing ? "animate-pulse text-cyan-300" : "text-slate-600"}`} aria-hidden="true" /></div>
  </>;
}
