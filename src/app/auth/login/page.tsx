'use client';

import { cn } from "@/shared/lib/utils";
import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle, useMemo, useCallback, Children } from "react";
import { useRouter } from 'next/navigation';
import { cva, type VariantProps } from "class-variance-authority";
import { Mail, Gem, Eye, EyeOff, X, AlertCircle, PartyPopper, Loader, Search, Sparkles, Plus } from "lucide-react";
import { AnimatePresence, motion, useInView, Variants, Transition } from "framer-motion";

// --- CONFETTI LOGIC ---
import type { GlobalOptions as ConfettiGlobalOptions, CreateTypes as ConfettiInstance, Options as ConfettiOptions } from "canvas-confetti"
import confetti from "canvas-confetti"

type Api = { fire: (options?: ConfettiOptions) => void }
export type ConfettiRef = Api | null

const Confetti = forwardRef<ConfettiRef, React.ComponentPropsWithRef<"canvas"> & { options?: ConfettiOptions; globalOptions?: ConfettiGlobalOptions; manualstart?: boolean }>((props, ref) => {
  const { options, globalOptions = { resize: true, useWorker: true }, manualstart = false, ...rest } = props
  const instanceRef = useRef<ConfettiInstance | null>(null)
  const canvasRef = useCallback((node: HTMLCanvasElement) => {
    if (node !== null) {
      if (instanceRef.current) return
      instanceRef.current = confetti.create(node, { ...globalOptions, resize: true })
    } else {
      if (instanceRef.current) {
        instanceRef.current.reset()
        instanceRef.current = null
      }
    }
  }, [globalOptions])
  const fire = useCallback((opts = {}) => instanceRef.current?.({ ...options, ...opts }), [options])
  const api = useMemo(() => ({ fire }), [fire])
  useImperativeHandle(ref, () => api, [api])
  useEffect(() => { if (!manualstart) fire() }, [manualstart, fire])
  return <canvas ref={canvasRef} {...rest} />
})
Confetti.displayName = "Confetti";

// --- TEXT LOOP ANIMATION COMPONENT ---
type TextLoopProps = { children: React.ReactNode[]; className?: string; interval?: number; transition?: Transition; variants?: Variants; onIndexChange?: (index: number) => void; stopOnEnd?: boolean; };
function TextLoop({ children, className, interval = 2, transition = { duration: 0.3 }, variants, onIndexChange, stopOnEnd = false }: TextLoopProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const items = Children.toArray(children);
  useEffect(() => {
    const intervalMs = interval * 1000;
    const timer = setInterval(() => {
      setCurrentIndex((current) => {
        if (stopOnEnd && current === items.length - 1) {
          clearInterval(timer);
          return current;
        }
        const next = (current + 1) % items.length;
        onIndexChange?.(next);
        return next;
      });
    }, intervalMs);
    return () => clearInterval(timer);
  }, [items.length, interval, onIndexChange, stopOnEnd]);
  const motionVariants: Variants = {
    initial: { y: 15, opacity: 0 },
    animate: { y: 0, opacity: 1 },
    exit: { y: -15, opacity: 0 },
  };
  return (
    <div className={cn('relative inline-block whitespace-nowrap', className)}>
      <AnimatePresence mode='popLayout' initial={false}>
        <motion.div key={currentIndex} initial='initial' animate='animate' exit='exit' transition={transition} variants={variants || motionVariants}>
          {items[currentIndex]}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

// --- BUILT-IN BLUR FADE ANIMATION COMPONENT ---
interface BlurFadeProps { children: React.ReactNode; className?: string; variant?: { hidden: { y: number }; visible: { y: number } }; duration?: number; delay?: number; yOffset?: number; inView?: boolean; inViewMargin?: string; blur?: string; }
function BlurFade({ children, className, variant, duration = 0.4, delay = 0, yOffset = 6, inView = true, inViewMargin = "-50px", blur = "6px" }: BlurFadeProps) {
  const ref = useRef(null);
  const inViewResult = useInView(ref, { once: true, margin: inViewMargin as any });
  const isInView = !inView || inViewResult;
  const defaultVariants: Variants = {
    hidden: { y: yOffset, opacity: 0, filter: `blur(${blur})` },
    visible: { y: -yOffset, opacity: 1, filter: `blur(0px)` },
  };
  const combinedVariants = variant || defaultVariants;
  return (
    <motion.div ref={ref} initial="hidden" animate={isInView ? "visible" : "hidden"} exit="hidden" variants={combinedVariants} transition={{ delay: 0.04 + delay, duration, ease: "easeOut" }} className={className}>
      {children}
    </motion.div>
  );
}

// --- BUILT-IN GLASS BUTTON COMPONENT ---
const glassButtonVariants = cva("relative isolate all-unset cursor-pointer rounded-full transition-all w-full text-center", { variants: { size: { default: "text-base font-semibold", sm: "text-sm font-semibold", lg: "text-lg font-bold" } }, defaultVariants: { size: "default" } });
const glassButtonTextVariants = cva("glass-button-text relative block select-none tracking-tight text-center w-full", { variants: { size: { default: "px-6 py-3.5", sm: "px-4 py-2", lg: "px-8 py-4" } }, defaultVariants: { size: "default" } });
export interface GlassButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof glassButtonVariants> { contentClassName?: string; }
const GlassButton = React.forwardRef<HTMLButtonElement, GlassButtonProps>(
  ({ className, children, size, contentClassName, onClick, ...props }, ref) => {
    const handleWrapperClick = (e: React.MouseEvent<HTMLDivElement>) => {
      const button = e.currentTarget.querySelector('button');
      if (button && e.target !== button) button.click();
    };
    return (
      <div className={cn("glass-button-wrap cursor-pointer rounded-full relative w-full", className)} onClick={handleWrapperClick}>
        <button className={cn("glass-button relative z-10 w-full", glassButtonVariants({ size }))} ref={ref} onClick={onClick} {...props}>
          <span className={cn(glassButtonTextVariants({ size }), contentClassName)}>{children}</span>
        </button>
        <div className="glass-button-shadow rounded-full pointer-events-none"></div>
      </div>
    );
  }
);
GlassButton.displayName = "GlassButton";

// --- THEME-AWARE SVG GRADIENT BACKGROUND ---
const GradientBackground = () => (
    <>
        <style>
            {` @keyframes float1 { 0% { transform: translate(0, 0); } 50% { transform: translate(-15px, 15px); } 100% { transform: translate(0, 0); } } @keyframes float2 { 0% { transform: translate(0, 0); } 50% { transform: translate(15px, -15px); } 100% { transform: translate(0, 0); } } `}
        </style>
        <svg width="100%" height="100%" viewBox="0 0 800 600" fill="none" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice" className="absolute top-0 left-0 w-full h-full">
            <defs>
                <linearGradient id="rev_grad1" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: 'var(--primary)', stopOpacity:0.25}} /><stop offset="100%" style={{stopColor: 'var(--primary)', stopOpacity:0.05}} /></linearGradient>
                <linearGradient id="rev_grad2" x1="0%" y1="0%" x2="100%" y2="100%"><stop offset="0%" style={{stopColor: 'var(--accent)', stopOpacity:0.2}} /><stop offset="50%" style={{stopColor: 'var(--secondary)', stopOpacity:0.15}} /><stop offset="100%" style={{stopColor: 'var(--primary)', stopOpacity:0.05}} /></linearGradient>
                <radialGradient id="rev_grad3" cx="50%" cy="50%" r="50%"><stop offset="0%" style={{stopColor: 'var(--primary)', stopOpacity:0.15}} /><stop offset="100%" style={{stopColor: 'var(--primary)', stopOpacity:0}} /></radialGradient>
                <filter id="rev_blur1" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="40"/></filter>
                <filter id="rev_blur2" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
                <filter id="rev_blur3" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="50"/></filter>
            </defs>
            <g style={{ animation: 'float1 18s ease-in-out infinite' }}>
                <ellipse cx="200" cy="500" rx="300" ry="220" fill="url(#rev_grad1)" filter="url(#rev_blur1)" transform="rotate(-30 200 500)"/>
                <rect x="500" y="100" width="350" height="300" rx="100" fill="url(#rev_grad2)" filter="url(#rev_blur2)" transform="rotate(15 650 225)"/>
            </g>
            <g style={{ animation: 'float2 22s ease-in-out infinite' }}>
                <circle cx="650" cy="450" r="180" fill="url(#rev_grad3)" filter="url(#rev_blur3)" opacity="0.8"/>
                <ellipse cx="50" cy="150" rx="200" ry="140" fill="var(--accent)" filter="url(#rev_blur2)" opacity="0.9"/>
            </g>
        </svg>
    </>
);

const modalSteps = [
    { message: "Verificando identidad...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
    { message: "Sincronizando libreta...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
    { message: "Cargando ContactFlow...", icon: <Loader className="w-12 h-12 text-primary animate-spin" /> },
    { message: "¡Acceso concedido!", icon: <PartyPopper className="w-12 h-12 text-green-500" /> }
];
const TEXT_LOOP_INTERVAL = 0.7;

// --- PREMIUM CUSTOM LOGO ---
const PremiumLogo = () => (
  <div className="flex items-center gap-3 select-none">
    <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-primary to-indigo-400 p-0.5 shadow-md shadow-primary/20">
      <div className="absolute inset-0 rounded-[10px] bg-white opacity-95"></div>
      <Gem className="h-4.5 w-4.5 text-primary z-10 animate-pulse" />
    </div>
    <div className="flex flex-col">
      <span className="text-lg font-black tracking-tight text-zinc-900 leading-none">ContactFlow</span>
      <span className="text-[9px] uppercase font-bold tracking-widest text-primary/80 mt-1">Enterprise Edition</span>
    </div>
  </div>
);

// --- INTERACTIVE MOCK CONTACTS WIDGET ---
const InteractiveContactsMock = () => {
  const [searchTerm, setSearchTerm] = useState("Vercel");
  const [selectedTag, setSelectedTag] = useState("Todos");

  const contacts = [
    { name: "Guillermo Rauch", role: "CEO", company: "Vercel", avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=80&h=80&q=80", color: "indigo" },
    { name: "Karri Saarinen", role: "Co-Founder", company: "Linear", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=80&h=80&q=80", color: "purple" },
    { name: "Sarah Drasner", role: "Director", company: "Google", avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=80&h=80&q=80", color: "rose" },
  ];

  const filteredContacts = contacts.filter(c => {
    const matchesSearch = c.company.toLowerCase().includes(searchTerm.toLowerCase()) || c.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesTag = selectedTag === "Todos" || c.company === selectedTag;
    return matchesSearch && matchesTag;
  });

  return (
    <div className="w-full bg-white/45 backdrop-blur-2xl border border-white/70 rounded-3xl p-6 shadow-xl relative overflow-hidden select-none">
      {/* Widget Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></div>
          <span className="text-xs font-extrabold text-zinc-500 uppercase tracking-widest">Vista en Tiempo Real</span>
        </div>
        <div className="flex gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300"></span>
          <span className="h-2.5 w-2.5 rounded-full bg-zinc-300"></span>
        </div>
      </div>

      {/* Mini Dashboard Search Bar */}
      <div className="relative mb-4">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400" />
        <input 
          type="text" 
          value={searchTerm} 
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Buscar empresa, rol o nombre..." 
          className="w-full bg-white/60 border border-white/90 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-semibold text-zinc-800 focus:outline-none shadow-inner"
        />
        {searchTerm && (
          <button onClick={() => setSearchTerm("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600">
            <X className="h-3 w-3" />
          </button>
        )}
      </div>

      {/* Mini Tags */}
      <div className="flex gap-2 mb-4 overflow-x-auto pb-1 scrollbar-none">
        {["Todos", "Vercel", "Linear", "Google"].map((tag) => (
          <button 
            key={tag}
            onClick={() => setSelectedTag(tag)}
            className={cn(
              "px-3 py-1.5 rounded-xl text-[10px] font-bold transition-all whitespace-nowrap border",
              selectedTag === tag 
                ? "bg-primary text-white border-primary/20 shadow-sm" 
                : "bg-white/50 text-zinc-600 border-white/80 hover:bg-white/80"
            )}
          >
            {tag}
          </button>
        ))}
      </div>

      {/* Interactive Contacts List */}
      <div className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
        <AnimatePresence mode="popLayout">
          {filteredContacts.length > 0 ? (
            filteredContacts.map((contact) => (
              <motion.div 
                key={contact.name} 
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="flex items-center justify-between p-3 rounded-2xl bg-white/70 border border-white/80 hover:bg-white/90 hover:shadow-sm transition-all duration-300 group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <img 
                    src={contact.avatar} 
                    alt={contact.name} 
                    className="h-9 w-9 rounded-full object-cover border border-white shadow-sm" 
                  />
                  <div className="flex flex-col">
                    <span className="text-xs font-extrabold text-zinc-800 group-hover:text-primary transition-colors">{contact.name}</span>
                    <span className="text-[10px] text-zinc-500 font-semibold">{contact.role} en <span className="font-bold text-zinc-700">{contact.company}</span></span>
                  </div>
                </div>
                <div className="px-2.5 py-1 rounded-lg bg-primary/10 text-primary text-[9px] font-bold tracking-wider uppercase border border-primary/10">
                  Activo
                </div>
              </motion.div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center bg-white/30 border border-dashed border-white/60 rounded-2xl">
              <Sparkles className="h-5 w-5 text-zinc-400 mb-1.5 animate-pulse" />
              <p className="text-[10px] text-zinc-500 font-bold">No se encontraron contactos</p>
            </div>
          )}
        </AnimatePresence>
      </div>

      {/* Statistics Footer inside Widget */}
      <div className="mt-4 pt-3.5 border-t border-white/40 flex items-center justify-between text-[10px] text-zinc-500 font-bold">
        <span>Total: 1,248 contactos</span>
        <span className="flex items-center gap-1 text-primary">
          <Plus className="h-3 w-3" /> Agregar nuevo
        </span>
      </div>
    </div>
  );
};

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [modalStatus, setModalStatus] = useState<'closed' | 'loading' | 'error' | 'success'>('closed');
  const [modalErrorMessage, setModalErrorMessage] = useState('');
  const confettiRef = useRef<ConfettiRef>(null);

  const isFormValid = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email) && password.length >= 6;
  
  const fireSideCanons = () => {
    const fire = confettiRef.current?.fire;
    if (fire) {
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };
        const particleCount = 50;
        fire({ ...defaults, particleCount, origin: { x: 0, y: 1 }, angle: 60 });
        fire({ ...defaults, particleCount, origin: { x: 1, y: 1 }, angle: 120 });
    }
  };

  const handleFinalSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (modalStatus !== 'closed') return;

    setModalStatus('loading');
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });

      const result = await response.json();
      if (!response.ok) {
        setModalErrorMessage(result.message || 'Credenciales incorrectas');
        setModalStatus('error');
        return;
      }

      const loadingStepsCount = modalSteps.length - 1;
      const totalDuration = loadingStepsCount * TEXT_LOOP_INTERVAL * 1000;
      
      setTimeout(() => {
        setModalStatus('success');
        fireSideCanons();
        setTimeout(() => {
          router.push('/dashboard');
        }, 800);
      }, totalDuration);

    } catch (error) {
      console.error('Login error:', error);
      setModalErrorMessage('No se pudo iniciar sesión en este momento.');
      setModalStatus('error');
    }
  };

  useEffect(() => {
    if (modalStatus === 'success') {
        fireSideCanons();
    }
  }, [modalStatus]);
  
  const Modal = () => (
    <AnimatePresence>
        {modalStatus !== 'closed' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md">
                <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="relative bg-card/90 border border-border/80 rounded-3xl p-8 w-full max-w-sm flex flex-col items-center gap-4 mx-4 shadow-2xl">
                    {modalStatus === 'error' && <button onClick={() => setModalStatus('closed')} className="absolute top-4 right-4 p-1.5 text-muted-foreground hover:text-foreground transition-colors rounded-full bg-secondary/80 hover:bg-secondary"><X className="w-4 h-4" /></button>}
                    {modalStatus === 'error' && <>
                        <AlertCircle className="w-12 h-12 text-destructive animate-bounce" />
                        <h3 className="text-lg font-bold text-foreground mt-2">Error de Acceso</h3>
                        <p className="text-sm text-muted-foreground text-center px-2">{modalErrorMessage}</p>
                        <GlassButton onClick={() => setModalStatus('closed')} size="sm" className="mt-4">Intentar de nuevo</GlassButton>
                    </>}
                    {modalStatus === 'loading' && 
                        <TextLoop interval={TEXT_LOOP_INTERVAL} stopOnEnd={true}>
                            {modalSteps.slice(0, -1).map((step, i) => 
                                <div key={i} className="flex flex-col items-center gap-4">
                                    {step.icon}
                                    <p className="text-lg font-semibold text-foreground text-center">{step.message}</p>
                                </div>
                            )}
                        </TextLoop>
                    }
                    {modalStatus === 'success' &&
                        <div className="flex flex-col items-center gap-4">
                            {modalSteps[modalSteps.length - 1].icon}
                            <p className="text-lg font-bold text-foreground text-center">{modalSteps[modalSteps.length - 1].message}</p>
                        </div>
                    }
                </motion.div>
            </motion.div>
        )}
    </AnimatePresence>
  );

  return (
    <div className="bg-background min-h-screen w-screen flex flex-col lg:flex-row relative select-none overflow-hidden light">
        <style>{`
            input[type="password"]::-ms-reveal, input[type="password"]::-ms-clear { display: none !important; } input[type="password"]::-webkit-credentials-auto-fill-button, input[type="password"]::-webkit-strong-password-auto-fill-button { display: none !important; } input:-webkit-autofill, input:-webkit-autofill:hover, input:-webkit-autofill:focus, input:-webkit-autofill:active { -webkit-box-shadow: 0 0 0 30px transparent inset !important; -webkit-text-fill-color: var(--foreground) !important; background-color: transparent !important; background-clip: content-box !important; transition: background-color 5000s ease-in-out 0s !important; color: var(--foreground) !important; caret-color: var(--foreground) !important; } input:autofill { background-color: transparent !important; background-clip: content-box !important; -webkit-text-fill-color: var(--foreground) !important; color: var(--foreground) !important; } input:-internal-autofill-selected { background-color: transparent !important; background-image: none !important; color: var(--foreground) !important; -webkit-text-fill-color: var(--foreground) !important; } input:-webkit-autofill::first-line { color: var(--foreground) !important; -webkit-text-fill-color: var(--foreground) !important; }
            @property --angle-1 { syntax: "<angle>"; inherits: false; initial-value: -75deg; } @property --angle-2 { syntax: "<angle>"; inherits: false; initial-value: -45deg; }
            .glass-button-wrap { --anim-time: 400ms; --anim-ease: cubic-bezier(0.25, 1, 0.5, 1); --border-width: clamp(1px, 0.0625em, 4px); position: relative; z-index: 2; transform-style: preserve-3d; transition: transform var(--anim-time) var(--anim-ease); } .glass-button-wrap:has(.glass-button:active) { transform: rotateX(25deg); } .glass-button-shadow { --shadow-cutoff-fix: 2em; position: absolute; width: calc(100% + var(--shadow-cutoff-fix)); height: calc(100% + var(--shadow-cutoff-fix)); top: calc(0% - var(--shadow-cutoff-fix) / 2); left: calc(0% - var(--shadow-cutoff-fix) / 2); filter: blur(clamp(2px, 0.125em, 12px)); transition: filter var(--anim-time) var(--anim-ease); pointer-events: none; z-index: 0; } .glass-button-shadow::after { content: ""; position: absolute; inset: 0; border-radius: 9999px; background: linear-gradient(180deg, oklch(from var(--foreground) l c h / 20%), oklch(from var(--foreground) l c h / 10%)); width: calc(100% - var(--shadow-cutoff-fix) - 0.25em); height: calc(100% - var(--shadow-cutoff-fix) - 0.25em); top: calc(var(--shadow-cutoff-fix) - 0.5em); left: calc(var(--shadow-cutoff-fix) - 0.875em); padding: 0.125em; box-sizing: border-box; mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease); opacity: 1; }
            .glass-button { -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all var(--anim-time) var(--anim-ease); background: linear-gradient(-75deg, oklch(from var(--background) l c h / 5%), oklch(from var(--background) l c h / 20%), oklch(from var(--background) l c h / 5%)); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.25em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%), 0 0 0 0 oklch(from var(--background) l c h); } .glass-button:hover { transform: scale(0.975); backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.15em 0.05em -0.1em oklch(from var(--foreground) l c h / 25%), 0 0.05em 0.1em inset oklch(from var(--background) l c h / 50%), 0 0 0 0 oklch(from var(--background) l c h); } .glass-button-text { color: oklch(from var(--foreground) l c h / 90%); text-shadow: 0em 0.25em 0.05em oklch(from var(--foreground) l c h / 10%); transition: all var(--anim-time) var(--anim-ease); } .glass-button:hover .glass-button-text { text-shadow: 0.025em 0.025em 0.025em oklch(from var(--foreground) l c h / 12%); } .glass-button-text::after { content: ""; display: block; position: absolute; width: calc(100% - var(--border-width)); height: calc(100% - var(--border-width)); top: calc(0% + var(--border-width) / 2); left: calc(0% + var(--border-width) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; background: linear-gradient(var(--angle-2), transparent 0%, oklch(from var(--background) l c h / 50%) 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; background-position: 0% 50%; transition: background-position calc(var(--anim-time) * 1.25) var(--anim-ease), --angle-2 calc(var(--anim-time) * 1.25) var(--anim-ease); } .glass-button:hover .glass-button-text::after { background-position: 25% 50%; } .glass-button:active .glass-button-text::after { background-position: 50% 15%; --angle-2: -15deg; } .glass-button::after { content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 9999px; width: calc(100% + var(--border-width)); height: calc(100% + var(--border-width)); top: calc(0% - var(--border-width) / 2); left: calc(0% - var(--border-width) / 2); padding: var(--border-width); box-sizing: border-box; background: conic-gradient(from var(--angle-1) at 50% 50%, oklch(from var(--foreground) l c h / 50%) 0%, transparent 5% 40%, oklch(from var(--foreground) l c h / 50%) 50%, transparent 60% 95%, oklch(from var(--foreground) l c h / 50%) 100%), linear-gradient(180deg, oklch(from var(--background) l c h / 50%), oklch(from var(--background) l c h / 50%)); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all var(--anim-time) var(--anim-ease), --angle-1 500ms ease; box-shadow: inset 0 0 0 calc(var(--border-width) / 2) oklch(from var(--background) l c h / 50%); pointer-events: none; } .glass-button:hover::after { --angle-1: -125deg; } .glass-button:active::after { --angle-1: -75deg; } .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow { filter: blur(clamp(2px, 0.0625em, 6px)); } .glass-button-wrap:has(.glass-button:hover) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.875em); opacity: 1; } .glass-button-wrap:has(.glass-button:active) .glass-button-shadow { filter: blur(clamp(2px, 0.125em, 12px)); } .glass-button-wrap:has(.glass-button:active) .glass-button-shadow::after { top: calc(var(--shadow-cutoff-fix) - 0.5em); opacity: 0.75; } .glass-button-wrap:has(.glass-button:active) .glass-button-text { text-shadow: 0.025em 0.25em 0.05em oklch(from var(--foreground) l c h / 12%); } .glass-button-wrap:has(.glass-button:active) .glass-button { box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.125em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%), 0 0.225em 0.05em 0 oklch(from var(--foreground) l c h / 5%), 0 0.25em 0 0 oklch(from var(--background) l c h / 75%), inset 0 0.25em 0.05em 0 oklch(from var(--foreground) l c h / 15%); } @media (hover: none) and (pointer: coarse) { .glass-button::after, .glass-button:hover::after, .glass-button:active::after { --angle-1: -75deg; } .glass-button .glass-button-text::after, .glass-button:active .glass-button-text::after { --angle-2: -45deg; } }
            .glass-input-wrap { position: relative; z-index: 2; transform-style: preserve-3d; border-radius: 9999px; } .glass-input { display: flex; position: relative; width: 100%; align-items: center; gap: 0.5rem; border-radius: 9999px; padding: 0.4rem; -webkit-tap-highlight-color: transparent; backdrop-filter: blur(clamp(1px, 0.125em, 4px)); transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1); background: linear-gradient(-75deg, oklch(from var(--background) l c h / 5%), oklch(from var(--background) l c h / 20%), oklch(from var(--background) l c h / 5%)); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.25em 0.125em -0.125em oklch(from var(--foreground) l c h / 20%), 0 0 0.1em 0.25em inset oklch(from var(--background) l c h / 20%), 0 0 0 0 oklch(from var(--background) l c h); } .glass-input-wrap:focus-within .glass-input { backdrop-filter: blur(0.01em); box-shadow: inset 0 0.125em 0.125em oklch(from var(--foreground) l c h / 5%), inset 0 -0.125em 0.125em oklch(from var(--background) l c h / 50%), 0 0.15em 0.05em -0.1em oklch(from var(--foreground) l c h / 25%), 0 0.05em 0.1em inset oklch(from var(--background) l c h / 50%), 0 0 0 0 oklch(from var(--background) l c h); } .glass-input::after { content: ""; position: absolute; z-index: 1; inset: 0; border-radius: 9999px; width: calc(100% + clamp(1px, 0.0625em, 4px)); height: calc(100% + clamp(1px, 0.0625em, 4px)); top: calc(0% - clamp(1px, 0.0625em, 4px) / 2); left: calc(0% - clamp(1px, 0.0625em, 4px) / 2); padding: clamp(1px, 0.0625em, 4px); box-sizing: border-box; background: conic-gradient(from var(--angle-1) at 50% 50%, oklch(from var(--foreground) l c h / 50%) 0%, transparent 5% 40%, oklch(from var(--foreground) l c h / 50%) 50%, transparent 60% 95%, oklch(from var(--foreground) l c h / 50%) 100%), linear-gradient(180deg, oklch(from var(--background) l c h / 50%), oklch(from var(--background) l c h / 50%)); mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); mask-composite: exclude; transition: all 400ms cubic-bezier(0.25, 1, 0.5, 1), --angle-1 500ms ease; box-shadow: inset 0 0 0 calc(clamp(1px, 0.0625em, 4px) / 2) oklch(from var(--background) l c h / 50%); pointer-events: none; } .glass-input-wrap:focus-within .glass-input::after { --angle-1: -125deg; } .glass-input-text-area { position: absolute; inset: 0; border-radius: 9999px; pointer-events: none; } .glass-input-text-area::after { content: ""; display: block; position: absolute; width: calc(100% - clamp(1px, 0.0625em, 4px)); height: calc(100% - clamp(1px, 0.0625em, 4px)); top: calc(0% + clamp(1px, 0.0625em, 4px) / 2); left: calc(0% + clamp(1px, 0.0625em, 4px) / 2); box-sizing: border-box; border-radius: 9999px; overflow: clip; background: linear-gradient(var(--angle-2), transparent 0%, oklch(from var(--background) l c h / 50%) 40% 50%, transparent 55%); z-index: 3; mix-blend-mode: screen; pointer-events: none; background-size: 200% 200%; background-position: 0% 50%; transition: background-position calc(400ms * 1.25) cubic-bezier(0.25, 1, 0.5, 1), --angle-2 calc(400ms * 1.25) cubic-bezier(0.25, 1, 0.5, 1); } .glass-input-wrap:focus-within .glass-input-text-area::after { background-position: 25% 50%; }
        `}</style>

        <Confetti ref={confettiRef} manualstart className="fixed top-0 left-0 w-full h-full pointer-events-none z-[999]" />
        <Modal />

        {/* --- LEFT PANEL: PREMIUM BRANDING & LIVE INTERACTIVE MOCK (60% width) --- */}
        <div className="hidden lg:flex lg:w-[58%] xl:w-[62%] relative flex-col justify-between p-12 bg-zinc-50/50 text-zinc-900 overflow-hidden border-r border-zinc-200/80 min-h-screen">
            <div className="absolute inset-0 z-0 opacity-80"><GradientBackground /></div>
            
            {/* Top Logo - Aligned in standard flex flow */}
            <div className="z-10">
                <PremiumLogo />
            </div>

            {/* Main Content (Headline & Interactive Mock) - Flexible middle section */}
            <div className="relative z-10 max-w-xl space-y-8 my-auto py-6">
                <BlurFade delay={0.1} className="space-y-5">
                    <div>
                      <span className="text-[10px] uppercase font-black tracking-widest text-primary px-3 py-1.5 rounded-full bg-primary/5 border border-primary/20 inline-block">
                        Plataforma de Relacionamiento
                      </span>
                    </div>
                    <h2 className="text-5xl xl:text-6xl font-black tracking-tight leading-[1.1] text-zinc-900">
                      La forma más elegante de <br />
                      <TextLoop interval={3} className="text-primary font-serif font-light italic mt-1 block">
                        <span>organizar tus contactos.</span>
                        <span>potenciar tu red.</span>
                        <span>conectar tus ideas.</span>
                      </TextLoop>
                    </h2>
                    <p className="text-zinc-600 text-base sm:text-lg leading-relaxed max-w-lg font-medium">
                      Una experiencia libre de distracciones diseñada para profesionales de alto rendimiento. Gestiona, filtra y optimiza tu red de contactos empresariales con fluidez.
                    </p>
                </BlurFade>

                {/* Stunning Live Interactive Preview Grid */}
                <BlurFade delay={0.2} className="w-full">
                    <InteractiveContactsMock />
                </BlurFade>
            </div>
            
            {/* Ambient Footer - Aligned in standard flex flow */}
            <div className="z-10 text-[11px] text-zinc-400 font-bold tracking-wider uppercase">
              © 2026 ContactFlow Inc. Todos los derechos reservados.
            </div>
        </div>

        {/* --- RIGHT PANEL: LOGIN FORM (40% width) --- */}
        <div className="flex-1 flex flex-col justify-center items-center relative px-6 py-12 lg:px-12 xl:px-16 min-h-screen z-10 bg-white">
            {/* Background for Mobile, otherwise elegant plain light layout */}
            <div className="absolute inset-0 z-0 lg:hidden"><GradientBackground /></div>
            
            {/* Header for Mobile only */}
            <div className="absolute top-6 left-6 right-6 z-20 flex items-center justify-between lg:hidden">
                <PremiumLogo />
            </div>

            <fieldset disabled={modalStatus !== 'closed'} className="relative z-10 w-full max-w-md mx-auto p-6 sm:p-8 bg-white/60 lg:bg-transparent backdrop-blur-xl lg:backdrop-none border border-border/40 lg:border-none rounded-[32px] shadow-2xl lg:shadow-none space-y-8">
                
                {/* Form header */}
                <div className="space-y-2 text-center lg:text-left">
                    <div className="hidden lg:block mb-10">
                      <PremiumLogo />
                    </div>
                    <h2 className="text-3xl font-extrabold tracking-tight text-foreground">Iniciar Sesión</h2>
                    <p className="text-sm text-muted-foreground font-medium">Accede a tu libreta de contactos profesionales</p>
                </div>

                <form onSubmit={handleFinalSubmit} className="space-y-5">
                    {/* EMAIL INPUT */}
                    <div className="space-y-1.5">
                        <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground px-1">Correo Electrónico</label>
                        <div className="glass-input-wrap w-full">
                            <div className="glass-input">
                                <span className="glass-input-text-area"></span>
                                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                                    <Mail className="h-4 w-4 text-foreground/60" />
                                </div>
                                <input 
                                    type="email" 
                                    placeholder="ejemplo@correo.com" 
                                    value={email} 
                                    onChange={(e) => setEmail(e.target.value)} 
                                    required 
                                    className="relative z-10 h-10 w-full bg-transparent text-foreground placeholder:text-foreground/45 focus:outline-none px-1 text-sm font-medium" 
                                />
                            </div>
                        </div>
                    </div>

                    {/* PASSWORD INPUT */}
                    <div className="space-y-1.5">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Contraseña</label>
                            <a href="#" className="text-xs text-primary font-semibold hover:underline">¿La olvidaste?</a>
                        </div>
                        <div className="glass-input-wrap w-full">
                            <div className="glass-input">
                                <span className="glass-input-text-area"></span>
                                <div className="relative z-10 flex-shrink-0 flex items-center justify-center w-10 pl-2">
                                    <button type="button" aria-label="Ver contraseña" onClick={() => setShowPassword(!showPassword)} className="text-foreground/60 hover:text-foreground transition-colors p-1.5 rounded-full">
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    placeholder="••••••••" 
                                    value={password} 
                                    onChange={(e) => setPassword(e.target.value)} 
                                    required 
                                    className="relative z-10 h-10 w-full bg-transparent text-foreground placeholder:text-foreground/45 focus:outline-none px-1 text-sm font-medium" 
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-2">
                      <GlassButton type="submit" disabled={!isFormValid}>
                        Ingresar a la Plataforma
                      </GlassButton>
                    </div>
                </form>
            </fieldset>
        </div>
    </div>
  );
}
