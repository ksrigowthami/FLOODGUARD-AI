import { Droplets } from 'lucide-react'
import { motion } from 'framer-motion'

export default function Logo({ collapsed = false }) {
  return (
    <div className="flex items-center gap-3 px-2 py-1">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-dark shadow-lg shadow-accent/20"
      >
        <Droplets className="w-5 h-5 text-white" />
      </motion.div>
      {!collapsed && (
        <div className="leading-tight">
          <h1 className="text-sm font-bold text-white tracking-tight">FloodGuard</h1>
          <p className="text-[10px] text-slate-500 font-medium tracking-wider">AI EARLY WARNING</p>
        </div>
      )}
    </div>
  )
}
