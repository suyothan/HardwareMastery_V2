import { motion } from 'framer-motion';

// CSS Art Character System — fantasy warriors, not diagrams
// Each character is built from CSS shapes, gradients, and shadows

const idle = {
  animate: { y: [0, -4, 0] },
  transition: { duration: 2, repeat: Infinity, ease: 'easeInOut' },
};

function VoltArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Body */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-10 rounded-t-full bg-gradient-to-b from-[#3498db] to-[#2980b9]" />
      {/* Lightning spiky hair */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2">
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#f1c40f] -rotate-12 absolute -left-2" />
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[16px] border-l-transparent border-r-transparent border-b-[#f1c40f] absolute left-0" />
        <div className="w-0 h-0 border-l-[6px] border-r-[6px] border-b-[14px] border-l-transparent border-r-transparent border-b-[#f1c40f] rotate-12 absolute left-2" />
      </div>
      {/* Face */}
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-6 h-5 rounded-full bg-[#ecf0f1]" />
      {/* Eyes */}
      <div className="absolute top-6 left-[calc(50%-5px)] w-1.5 h-1.5 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-6 left-[calc(50%+3px)] w-1.5 h-1.5 rounded-full bg-[#2c3e50]" />
      {/* Lightning staff */}
      <div className="absolute bottom-0 right-1 w-1.5 h-14 bg-gradient-to-b from-[#f1c40f] to-[#f39c12] rounded-full rotate-12" />
      <div className="absolute bottom-10 right-0 w-4 h-3 bg-[#f1c40f] rotate-12" style={{ clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      {/* Glow */}
      <div className="absolute inset-0 rounded-full bg-[#3498db] opacity-20 blur-lg" />
    </motion.div>
  );
}

function OhmArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Body — stocky armored */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-9 rounded-t-lg bg-gradient-to-b from-[#95a5a6] to-[#7f8c8d]" />
      {/* Helmet */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-9 h-7 rounded-t-full bg-gradient-to-b from-[#bdc3c7] to-[#95a5a6]" />
      {/* Color band stripes on helmet */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#e74c3c] rounded-full" />
      <div className="absolute top-5 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#f39c12] rounded-full" />
      <div className="absolute top-7 left-1/2 -translate-x-1/2 w-8 h-1 bg-[#2ecc71] rounded-full" />
      {/* Shield */}
      <div className="absolute bottom-3 left-0 w-6 h-8 rounded-b-full bg-gradient-to-b from-[#bdc3c7] to-[#7f8c8d] border-2 border-[#95a5a6] flex items-center justify-center">
        <div className="text-[8px] font-bold text-[#2c3e50]">Ω</div>
      </div>
      {/* Face */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-5 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-5 left-[calc(50%-4px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-5 left-[calc(50%+2px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
    </motion.div>
  );
}

function CapellaArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Flowing cape */}
      <motion.div
        animate={{ rotate: [0, 3, -3, 0] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-12 h-12 rounded-b-full bg-gradient-to-b from-[#1abc9c] to-[#16a085] opacity-60"
      />
      {/* Body — robed */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-8 h-11 rounded-t-full bg-gradient-to-b from-[#1abc9c] to-[#0d8f76]" />
      {/* Head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-6 rounded-full bg-gradient-to-b from-[#1abc9c] to-[#16a085]" />
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-4 left-[calc(50%-4px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-4 left-[calc(50%+2px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      {/* Swirling waves around hands */}
      <motion.div
        animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.8, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-6 left-0 w-4 h-4 rounded-full bg-[#00d4ff] blur-sm"
      />
      <motion.div
        animate={{ scale: [1.2, 1, 1.2], opacity: [0.8, 0.5, 0.8] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute bottom-6 right-0 w-4 h-4 rounded-full bg-[#00d4ff] blur-sm"
      />
    </motion.div>
  );
}

function DiodexArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Body — sleek scout */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-7 h-10 rounded-t-lg bg-gradient-to-b from-[#e74c3c] to-[#c0392b]" />
      {/* Head */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-6 h-5 rounded-full bg-gradient-to-b from-[#e74c3c] to-[#c0392b]" />
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-4 left-[calc(50%-4px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-4 left-[calc(50%+2px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      {/* One-way arrow on chest */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-0 h-0 border-l-[6px] border-r-[6px] border-b-[8px] border-l-transparent border-r-transparent border-b-[#f39c12]" />
      {/* Arrow shaft */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-1.5 h-4 bg-[#f39c12] rounded-full" />
    </motion.div>
  );
}

function TransistoArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Split body — NPN/PNP */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-10 rounded-t-lg overflow-hidden">
        <div className="absolute left-0 w-1/2 h-full bg-gradient-to-b from-[#8e44ad] to-[#6c3483]" />
        <div className="absolute right-0 w-1/2 h-full bg-gradient-to-b from-[#c0392b] to-[#922b21]" />
      </div>
      {/* Head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-6 rounded-t-full overflow-hidden">
        <div className="absolute left-0 w-1/2 h-full bg-[#8e44ad]" />
        <div className="absolute right-0 w-1/2 h-full bg-[#c0392b]" />
      </div>
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-4 left-[calc(50%-5px)] w-1.5 h-1.5 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-4 left-[calc(50%+3px)] w-1.5 h-1.5 rounded-full bg-[#2c3e50]" />
      {/* BJT symbol on chest */}
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 text-[10px] font-bold text-white/80">BJT</div>
    </motion.div>
  );
}

function KirchhoffArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Judge robe */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-12 rounded-t-lg bg-gradient-to-b from-[#2980b9] to-[#1a5276]" />
      {/* Head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-6 rounded-full bg-gradient-to-b from-[#2980b9] to-[#1a5276]" />
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-4 left-[calc(50%-4px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-4 left-[calc(50%+2px)] w-1 h-1 rounded-full bg-[#2c3e50]" />
      {/* Scales of justice */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <div className="w-8 h-0.5 bg-[#f39c12] rounded-full" />
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-0.5 h-2 bg-[#f39c12]" />
        <div className="absolute -left-1 -top-1 w-3 h-2 border border-[#f39c12] rounded-b-full" />
        <div className="absolute -right-1 -top-1 w-3 h-2 border border-[#f39c12] rounded-b-full" />
      </div>
      {/* Glowing law text */}
      <motion.div
        animate={{ opacity: [0.3, 0.7, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -right-2 top-4 text-[6px] text-[#f39c12] font-bold"
      >
        KVL
      </motion.div>
      <motion.div
        animate={{ opacity: [0.7, 0.3, 0.7] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -left-2 top-4 text-[6px] text-[#f39c12] font-bold"
      >
        KCL
      </motion.div>
    </motion.div>
  );
}

function AmpliusArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Large muscular body */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-12 h-10 rounded-t-xl bg-gradient-to-b from-[#e67e22] to-[#d35400]" />
      {/* Head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full bg-gradient-to-b from-[#e67e22] to-[#d35400]" />
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-4 left-[calc(50%-5px)] w-1.5 h-1.5 rounded-full bg-[#2c3e50]" />
      <div className="absolute top-4 left-[calc(50%+3px)] w-1.5 h-1.5 rounded-full bg-[#2c3e50]" />
      {/* Sound waves */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          className="absolute right-0 top-4 border-2 border-[#e67e22] rounded-full"
          style={{ width: 12 + i * 6, height: 12 + i * 6 }}
        />
      ))}
    </motion.div>
  );
}

function TimerXArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Sleek assassin body */}
      <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-7 h-10 rounded-t-lg bg-gradient-to-b from-[#2c3e50] to-[#1a252f]" />
      {/* Head with visor */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-7 h-6 rounded-t-full bg-gradient-to-b from-[#2c3e50] to-[#1a252f]" />
      {/* Countdown timer visor */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-2 rounded bg-[#f39c12] flex items-center justify-center">
        <motion.span
          animate={{ opacity: [1, 0.3, 1] }}
          transition={{ duration: 1, repeat: Infinity }}
          className="text-[6px] font-bold text-[#2c3e50]"
        >
          5:55
        </motion.span>
      </div>
      {/* Dual-mode indicator */}
      <div className="absolute bottom-6 left-[calc(50%-6px)] w-2 h-2 rounded-full bg-[#f39c12]" />
      <div className="absolute bottom-6 left-[calc(50%+2px)] w-2 h-2 rounded-full bg-[#2c3e50] border border-[#f39c12]" />
    </motion.div>
  );
}

function MegaFetArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Massive armored body */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-11 rounded-t-xl bg-gradient-to-b from-[#8e44ad] to-[#6c3483]" />
      {/* Head with crown */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-9 h-6 rounded-t-full bg-gradient-to-b from-[#8e44ad] to-[#6c3483]" />
      {/* Lightning crown */}
      {[0, 1, 2, 3, 4].map(i => (
        <div
          key={i}
          className="absolute top-0 bg-[#f39c12]"
          style={{
            left: `${20 + i * 12}%`,
            width: 3,
            height: 8 + (i % 2 === 0 ? 4 : 0),
            clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)',
          }}
        />
      ))}
      {/* Face */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-6 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-5 left-[calc(50%-5px)] w-1.5 h-1.5 rounded-full bg-[#8e44ad]" />
      <div className="absolute top-5 left-[calc(50%+3px)] w-1.5 h-1.5 rounded-full bg-[#8e44ad]" />
      {/* Gate voltage on chest */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 text-[7px] font-bold text-[#f39c12]">Vgs</div>
      {/* Purple energy particles */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -20], opacity: [0.8, 0], scale: [1, 0] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.5 }}
          className="absolute w-1.5 h-1.5 rounded-full bg-[#8e44ad]"
          style={{ left: `${25 + i * 25}%`, bottom: '30%' }}
        />
      ))}
    </motion.div>
  );
}

function PCBPhantomArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Ghost body — transparent with PCB traces */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-12 rounded-t-full bg-gradient-to-b from-[#27ae60]/40 to-[#27ae60]/20 border border-[#27ae60]/60" />
      {/* PCB trace lines forming body */}
      <div className="absolute bottom-3 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#27ae60] rounded-full" />
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#27ae60] rounded-full" />
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#27ae60] rounded-full" />
      {/* Ghost head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-7 rounded-t-full bg-gradient-to-b from-[#27ae60]/30 to-transparent border border-[#27ae60]/40" />
      {/* Glowing eyes */}
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-4 left-[calc(50%-6px)] w-2 h-2 rounded-full bg-[#27ae60] shadow-[0_0_8px_#27ae60]"
      />
      <motion.div
        animate={{ opacity: [0.5, 1, 0.5] }}
        transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
        className="absolute top-4 left-[calc(50%+2px)] w-2 h-2 rounded-full bg-[#27ae60] shadow-[0_0_8px_#27ae60]"
      />
      {/* Via dots */}
      {[0, 1, 2].map(i => (
        <div key={i} className="absolute w-1 h-1 rounded-full bg-[#27ae60]" style={{ left: `${30 + i * 15}%`, bottom: `${40 + i * 10}%` }} />
      ))}
    </motion.div>
  );
}

function SMPSDemonArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Fire body */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-11 rounded-t-lg bg-gradient-to-b from-[#e74c3c] to-[#c0392b]" />
      {/* Fire gradient overlay */}
      <motion.div
        animate={{ opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 0.8, repeat: Infinity }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-11 rounded-t-lg bg-gradient-to-t from-[#f39c12] to-transparent"
      />
      {/* Demon head with horns */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-8 h-6 rounded-t-full bg-gradient-to-b from-[#e74c3c] to-[#922b21]" />
      {/* Horns */}
      <div className="absolute top-0 left-[calc(50%-10px)] w-0 h-0 border-l-[4px] border-r-[4px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#c0392b] -rotate-20" />
      <div className="absolute top-0 left-[calc(50%+4px)] w-0 h-0 border-l-[4px] border-r-[4px] border-b-[10px] border-l-transparent border-r-transparent border-b-[#c0392b] rotate-20" />
      {/* Glowing eyes */}
      <div className="absolute top-4 left-[calc(50%-6px)] w-2 h-1.5 rounded-full bg-[#f39c12] shadow-[0_0_6px_#f39c12]" />
      <div className="absolute top-4 left-[calc(50%+2px)] w-2 h-1.5 rounded-full bg-[#f39c12] shadow-[0_0_6px_#f39c12]" />
      {/* Fire particles */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -25], opacity: [0.8, 0], scale: [1, 0] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.3 }}
          className="absolute w-2 h-2 rounded-full bg-[#f39c12]"
          style={{ left: `${25 + i * 25}%`, bottom: '60%' }}
        />
      ))}
    </motion.div>
  );
}

function SiliconMasterArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Radiating aura */}
      <motion.div
        animate={{ scale: [1, 1.15, 1], opacity: [0.2, 0.4, 0.2] }}
        transition={{ duration: 3, repeat: Infinity }}
        className="absolute inset-0 rounded-full bg-[#f39c12] blur-xl"
      />
      {/* Body with circuit tattoos */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-11 rounded-t-lg bg-gradient-to-b from-[#f39c12] to-[#c4821a]" />
      {/* Head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-7 rounded-t-full bg-gradient-to-b from-[#f39c12] to-[#c4821a]" />
      {/* Circuit tattoo lines */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 w-6 h-0.5 bg-[#ffe599] rounded-full" />
      <div className="absolute bottom-7 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-[#ffe599] rounded-full" />
      <div className="absolute bottom-9 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-[#ffe599] rounded-full" />
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-6 h-5 rounded-full bg-[#ffe599]" />
      <div className="absolute top-5 left-[calc(50%-5px)] w-1.5 h-1.5 rounded-full bg-[#c4821a]" />
      <div className="absolute top-5 left-[calc(50%+3px)] w-1.5 h-1.5 rounded-full bg-[#c4821a]" />
      {/* Legendary particle system */}
      {[0, 1, 2, 3, 4].map(i => (
        <motion.div
          key={i}
          animate={{ y: [0, -30], opacity: [1, 0], scale: [1, 0] }}
          transition={{ duration: 2, repeat: Infinity, delay: i * 0.4 }}
          className="absolute w-1 h-1 rounded-full bg-[#ffe599]"
          style={{ left: `${15 + i * 17}%`, bottom: '40%' }}
        />
      ))}
    </motion.div>
  );
}

function TheResonantArt({ size = 80 }) {
  return (
    <motion.div {...idle} className="relative" style={{ width: size, height: size }}>
      {/* Electromagnetic coil body */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-10 h-11 rounded-t-lg bg-gradient-to-b from-[#00d4ff] to-[#0099cc]" />
      {/* Coil rings */}
      {[0, 1, 2, 3].map(i => (
        <motion.div
          key={i}
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'linear' }}
          className="absolute left-1/2 -translate-x-1/2 border-2 border-[#f4a623]/60 rounded-full"
          style={{ bottom: `${15 + i * 12}%`, width: 20 + i * 4, height: 20 + i * 4 }}
        />
      ))}
      {/* Head */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-8 h-6 rounded-t-full bg-gradient-to-b from-[#00d4ff] to-[#0099cc]" />
      {/* Face */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-5 h-4 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-4 left-[calc(50%-4px)] w-1.5 h-1.5 rounded-full bg-[#f4a623]" />
      <div className="absolute top-4 left-[calc(50%+2px)] w-1.5 h-1.5 rounded-full bg-[#f4a623]" />
      {/* Pulsing resonance waves */}
      <motion.div
        animate={{ scale: [1, 2], opacity: [0.4, 0] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 border-2 border-[#f4a623] rounded-full"
      />
    </motion.div>
  );
}

// ═══════ BOSS ART ═══════

function BossBase({ children, color1, color2: _color2, size = 120 }) {
  return (
    <motion.div
      animate={{ y: [0, -6, 0] }}
      transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
      className="relative"
      style={{ width: size, height: size }}
    >
      {/* Aura */}
      <div className="absolute inset-0 rounded-full opacity-20 blur-2xl" style={{ background: color1 }} />
      {children}
    </motion.div>
  );
}

function AnalogOverlordArt({ size = 120 }) {
  return (
    <BossBase color1="#3498db" color2="#2980b9" size={size}>
      {/* Giant sorcerer body */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-14 rounded-t-xl bg-gradient-to-b from-[#3498db] to-[#1a5276]" />
      {/* Head */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-10 rounded-t-full bg-gradient-to-b from-[#3498db] to-[#1a5276]" />
      {/* Hood */}
      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-14 h-8 rounded-t-full bg-[#2980b9]" />
      {/* Face */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full bg-[#ecf0f1]" />
      <div className="absolute top-10 left-[calc(50%-7px)] w-2 h-2 rounded-full bg-[#3498db]" />
      <div className="absolute top-10 left-[calc(50%+3px)] w-2 h-2 rounded-full bg-[#3498db]" />
      {/* Frequency waves */}
      {[0, 1, 2].map(i => (
        <motion.div
          key={i}
          animate={{ scaleX: [0.5, 1.5, 0.5], opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
          className="absolute h-0.5 bg-[#00d4ff] rounded-full"
          style={{ left: '20%', right: '20%', bottom: `${50 + i * 8}%` }}
        />
      ))}
    </BossBase>
  );
}

function PCBDemonArt({ size = 120 }) {
  return (
    <BossBase color1="#2ecc71" color2="#27ae60" size={size}>
      {/* Traced entity body */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-14 rounded-t-xl bg-gradient-to-b from-[#2ecc71]/60 to-[#27ae60]/30 border border-[#2ecc71]/40" />
      {/* Corrupted circuit lines */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute h-0.5 bg-[#2ecc71] rounded-full" style={{ left: `${15 + i * 5}%`, right: `${15 + i * 5}%`, bottom: `${25 + i * 12}%` }} />
      ))}
      {/* Head */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-9 rounded-t-full bg-gradient-to-b from-[#2ecc71]/50 to-transparent border border-[#2ecc71]/30" />
      {/* Glitch eyes */}
      <motion.div
        animate={{ x: [-2, 2, -2] }}
        transition={{ duration: 0.3, repeat: Infinity }}
        className="absolute top-7 left-[calc(50%-8px)] w-3 h-2 bg-[#2ecc71] shadow-[0_0_8px_#2ecc71]"
      />
      <motion.div
        animate={{ x: [2, -2, 2] }}
        transition={{ duration: 0.3, repeat: Infinity }}
        className="absolute top-7 left-[calc(50%+3px)] w-3 h-2 bg-[#2ecc71] shadow-[0_0_8px_#2ecc71]"
      />
    </BossBase>
  );
}

function PowerTyrantArt({ size = 120 }) {
  return (
    <BossBase color1="#f4a623" color2="#e67e22" size={size}>
      {/* Massive converter form */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-18 h-14 rounded-t-xl bg-gradient-to-b from-[#f4a623] to-[#ca6f1e]" />
      {/* Head */}
      <div className="absolute top-4 left-1/2 -translate-x-1/2 w-12 h-9 rounded-t-full bg-gradient-to-b from-[#f4a623] to-[#ca6f1e]" />
      {/* Lightning crown */}
      {[0, 1, 2, 3].map(i => (
        <div key={i} className="absolute top-0 bg-[#f4a623]" style={{ left: `${25 + i * 15}%`, width: 4, height: 10 + (i % 2 === 0 ? 5 : 0), clipPath: 'polygon(50% 0%, 0% 100%, 100% 100%)' }} />
      ))}
      {/* Face */}
      <div className="absolute top-7 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full bg-[#ffe599]" />
      <div className="absolute top-9 left-[calc(50%-7px)] w-2 h-2 rounded-full bg-[#ca6f1e]" />
      <div className="absolute top-9 left-[calc(50%+3px)] w-2 h-2 rounded-full bg-[#ca6f1e]" />
    </BossBase>
  );
}

function DigitalPhantomArt({ size = 120 }) {
  return (
    <BossBase color1="#9b59b6" color2="#8e44ad" size={size}>
      {/* Glitching dark figure */}
      <motion.div
        animate={{ x: [-1, 1, -1] }}
        transition={{ duration: 0.2, repeat: Infinity }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-14 rounded-t-xl bg-gradient-to-b from-[#9b59b6] to-[#6c3483]"
      />
      {/* Binary corruption overlay */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[6px] text-[#9b59b6]/60 font-mono leading-none">
        01101<br/>10010<br/>11001
      </div>
      {/* Head */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-8 rounded-t-full bg-gradient-to-b from-[#9b59b6] to-[#6c3483]" />
      {/* Glitch eyes */}
      <motion.div
        animate={{ scaleX: [1, 0.5, 1] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute top-6 left-[calc(50%-8px)] w-3 h-2 bg-[#e74c3c] shadow-[0_0_8px_#e74c3c]"
      />
      <motion.div
        animate={{ scaleX: [0.5, 1, 0.5] }}
        transition={{ duration: 0.5, repeat: Infinity }}
        className="absolute top-6 left-[calc(50%+3px)] w-3 h-2 bg-[#e74c3c] shadow-[0_0_8px_#e74c3c]"
      />
    </BossBase>
  );
}

function TheOscillatorArt({ size = 120 }) {
  return (
    <BossBase color1="#00d4ff" color2="#0099cc" size={size}>
      {/* Pure wave entity */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-14 h-14 rounded-full bg-gradient-to-b from-[#00d4ff]/40 to-[#0099cc]/20 border border-[#00d4ff]/30" />
      {/* Sinusoidal body */}
      <svg className="absolute inset-0" viewBox="0 0 120 120">
        <motion.path
          d="M 20 60 Q 40 30, 60 60 Q 80 90, 100 60"
          fill="none"
          stroke="#00d4ff"
          strokeWidth="3"
          animate={{ d: ['M 20 60 Q 40 30, 60 60 Q 80 90, 100 60', 'M 20 60 Q 40 90, 60 60 Q 80 30, 100 60'] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        />
      </svg>
      {/* Face */}
      <div className="absolute top-8 left-1/2 -translate-x-1/2 w-8 h-6 rounded-full bg-[#ecf0f1]/80" />
      <div className="absolute top-10 left-[calc(50%-7px)] w-2 h-2 rounded-full bg-[#00d4ff]" />
      <div className="absolute top-10 left-[calc(50%+3px)] w-2 h-2 rounded-full bg-[#00d4ff]" />
    </BossBase>
  );
}

function SiliconVoidArt({ size = 120 }) {
  return (
    <BossBase color1="#e74c3c" color2="#c0392b" size={size}>
      {/* Corrupted silhouette */}
      <div className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-16 rounded-t-xl bg-gradient-to-b from-[#e74c3c]/80 to-[#922b21]/60" />
      {/* Void effect */}
      <motion.div
        animate={{ scale: [1, 1.1, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute bottom-1 left-1/2 -translate-x-1/2 w-16 h-16 rounded-t-xl bg-gradient-to-t from-[#000] to-transparent"
      />
      {/* Head */}
      <div className="absolute top-3 left-1/2 -translate-x-1/2 w-12 h-10 rounded-t-full bg-gradient-to-b from-[#e74c3c]/60 to-[#922b21]/40" />
      {/* Void eyes */}
      <motion.div
        animate={{ scale: [1, 1.3, 1] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-7 left-[calc(50%-8px)] w-3 h-3 rounded-full bg-[#f39c12] shadow-[0_0_12px_#f39c12]"
      />
      <motion.div
        animate={{ scale: [1.3, 1, 1.3] }}
        transition={{ duration: 1.5, repeat: Infinity }}
        className="absolute top-7 left-[calc(50%+3px)] w-3 h-3 rounded-full bg-[#f39c12] shadow-[0_0_12px_#f39c12]"
      />
    </BossBase>
  );
}

// ═══════ COMPONENT MAP ═══════

const CHARACTER_MAP = {
  volt: VoltArt,
  ohm: OhmArt,
  capella: CapellaArt,
  diodex: DiodexArt,
  transisto: TransistoArt,
  kirchhoff: KirchhoffArt,
  amplius: AmpliusArt,
  timer_x: TimerXArt,
  megafet: MegaFetArt,
  pcb_phantom: PCBPhantomArt,
  smps_demon: SMPSDemonArt,
  silicon_master: SiliconMasterArt,
  the_resonant: TheResonantArt,
};

const BOSS_MAP = {
  analog_overlord: AnalogOverlordArt,
  pcb_demon: PCBDemonArt,
  power_tyrant: PowerTyrantArt,
  digital_phantom: DigitalPhantomArt,
  the_oscillator: TheOscillatorArt,
  silicon_void: SiliconVoidArt,
};

export function CharacterArt({ cardId, size = 80 }) {
  const ArtComponent = CHARACTER_MAP[cardId];
  if (!ArtComponent) return <div style={{ width: size, height: size }} className="bg-bg-card rounded-lg" />;
  return <ArtComponent size={size} />;
}

export function BossArt({ bossId, size = 120 }) {
  const ArtComponent = BOSS_MAP[bossId];
  if (!ArtComponent) return <div style={{ width: size, height: size }} className="bg-bg-card rounded-lg" />;
  return <ArtComponent size={size} />;
}
