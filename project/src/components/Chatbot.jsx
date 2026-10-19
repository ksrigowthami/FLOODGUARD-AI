import { useState, useRef, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { MessageCircle, X, Send, Bot, User } from 'lucide-react'
import { useLanguage } from '../i18n/LanguageContext'
import { riskZones, weatherData, dashboardStats, shelters, hospitals, emergencyContacts } from '../data/mockData'

const responses = {
  en: {
    floodRisk: `Current flood risk level is ${dashboardStats.riskLevel.value}% (High). ${dashboardStats.affectedAreas.value} zones are currently affected. The most critical zones are: ${riskZones.filter(z => z.risk === 'critical' || z.risk === 'high').map(z => z.name).join(', ')}. I recommend staying alert and following evacuation orders if issued.`,
    rainfall: `Rainfall in the last 24 hours: ${dashboardStats.rainfall.value}mm (trending up). Current weather: ${weatherData.temp}°C, ${weatherData.condition}, humidity ${weatherData.humidity}%, wind ${weatherData.windSpeed} km/h. AI models predict continued heavy rainfall in the next 24-48 hours.`,
    safetyTips: `Here are key flood safety tips:\n1. Move to higher ground immediately if in a flood-prone area\n2. Keep emergency supplies ready (food, water, medicines, documents)\n3. Charge your phone and keep a power bank handy\n4. Stay tuned to official alerts and warnings\n5. Do not walk or drive through flooded areas\n6. Keep children and elderly away from water\n7. Turn off utilities if evacuation is ordered`,
    emergency: `Emergency Instructions:\n1. Call 108 for ambulance, 100 for police, 1078 for flood helpline\n2. If trapped, move to the highest floor or roof\n3. Signal for help using a flashlight or bright cloth\n4. Do not attempt to swim through fast-moving water\n5. If in a vehicle, abandon it and seek higher ground\n6. Keep your phone dry and conserve battery\n7. Wait for official rescue — do not re-enter flooded buildings`,
    shelters: `Nearby relief shelters:\n${shelters.map(s => `• ${s.name} — ${s.address} (${s.distance}, ${s.occupied}/${s.capacity} occupied)`).join('\n')}\n\nNearby hospitals:\n${hospitals.map(h => `• ${h.name} — ${h.address} (${h.distance}, ${h.available} beds available)`).join('\n')}`,
    dashboard: `Dashboard Guide:\n• Dashboard: Live overview with stats, map, weather, and predictions\n• Monitoring: Real-time sensor data from monitoring stations\n• Prediction: AI model forecasts and risk analysis\n• Risk Map: Interactive map of flood risk zones\n• Alerts: Active and historical alerts\n• Historical: Past flood records and trends\n• Emergency: SOS, contacts, shelters, hospitals\n• Settings: Configure preferences and notifications\n\nUse the sidebar to navigate between sections.`,
    default: `I can help with flood risk information, rainfall details, safety tips, emergency instructions, nearby shelters/hospitals, and dashboard navigation. Try one of the quick questions below or type your own question.`,
  },
  hi: {
    floodRisk: `वर्तमान बाढ़ जोखिम स्तर ${dashboardStats.riskLevel.value}% (उच्च) है। ${dashboardStats.affectedAreas.value} क्षेत्र वर्तमान में प्रभावित हैं। सबसे गंभीर क्षेत्र हैं: ${riskZones.filter(z => z.risk === 'critical' || z.risk === 'high').map(z => z.name).join(', ')}। यदि निर्देश जारी हों तो सतर्क रहें और � evacuation आदेशों का पालन करें।`,
    rainfall: `पिछले 24 घंटों में वर्षा: ${dashboardStats.rainfall.value}मिमी (बढ़ती हुई)। वर्तमान मौसम: ${weatherData.temp}°सी, ${weatherData.condition}, आर्द्रता ${weatherData.humidity}%, हवा ${weatherData.windSpeed} किमी/घंटा। एआई मॉडल अगले 24-48 घंटों में भारी वर्षा की भविष्यवाणी करते हैं।`,
    safetyTips: `बाढ़ सुरक्षा युक्तियां:\n1. बाढ़-प्रवण क्षेत्र में होने पर तुरंत ऊंची जगह पर जाएं\n2. आपातकालीन आपूर्ति तैयार रखें (भोजन, पानी, दवाइयां, दस्तावेज)\n3. फोन चार्ज रखें और पावर बैंक पास रखें\n4. आधिकारिक अलर्ट पर ध्यान दें\n5. बाढ़ग्रस्त क्षेत्र से पैदल या वाहन से न जाएं\n6. बच्चों और बुजुर्गों को पानी से दूर रखें\n7. खाली करने के आदेश पर उपयोगिताएं बंद करें`,
    emergency: `आपातकालीन निर्देश:\n1. एम्बुलेंस के लिए 108, पुलिस के लिए 100, बाढ़ हेल्पलाइन के लिए 1078 कॉल करें\n2. यदि फंस गए हों तो सबसे ऊपरी मंजिल या छत पर जाएं\n3. टॉर्च या चमकीले कपड़े से मदद का संकेत दें\n4. तेज बहते पानी में तैरने का प्रयास न करें\n5. वाहन में हों तो उसे छोड़कर ऊंची जगह खोजें\n6. फोन सूखा रखें और बैटरी बचाएं\n7. आधिकारिक बचाव की प्रतीक्षा करें`,
    shelters: `नजदीकी राहत आश्रय:\n${shelters.map(s => `• ${s.name} — ${s.address} (${s.distance}, ${s.occupied}/${s.capacity} भरे हुए)`).join('\n')}\n\nनजदीकी अस्पताल:\n${hospitals.map(h => `• ${h.name} — ${h.address} (${h.distance}, ${h.available} बिस्तर उपलब्ध)`).join('\n')}`,
    dashboard: `डैशबोर्ड गाइड:\n• डैशबोर्ड: आँकड़े, मानचित्र, मौसम और भविष्यवाणी के साथ लाइव अवलोकन\n• निगरानी: स्टेशनों से वास्तविक समय डेटा\n• भविष्यवाणी: एआई मॉडल पूर्वानुमान\n• जोखिम मानचित्र: बाढ़ जोखिम क्षेत्रों का नक्शा\n• अलर्ट: सक्रिय और ऐतिहासिक अलर्ट\n• ऐतिहासिक: पिछले बाढ़ रिकॉर्ड\n• आपातकाल: एसओएस, संपर्क, आश्रय, अस्पताल\n• सेटिंग्स: प्राथमिकताएं कॉन्फ़िगर करें`,
    default: `मैं बाढ़ जोखिम जानकारी, वर्षा विवरण, सुरक्षा युक्तियां, आपातकालीन निर्देश, नजदीकी आश्रय/अस्पताल, और डैशबोर्ड नेविगेशन में मदद कर सकता हूं। नीचे दिए गए त्वरित प्रश्नों में से एक आज़माएं या अपना प्रश्न टाइप करें।`,
  },
  te: {
    floodRisk: `ప్రస్తుత వరద ప్రమాద స్థాయి ${dashboardStats.riskLevel.value}% (అధిక). ${dashboardStats.affectedAreas.value} మండలాలు ప్రస్తుతం ప్రభావితమయ్యాయి. అత్యంత గంభీర మండలాలు: ${riskZones.filter(z => z.risk === 'critical' || z.risk === 'high').map(z => z.name).join(', ')}. స్పందించండి మరియు ఖాళీ ఆదేశాలను పాటించండి.`,
    rainfall: `చివరి 24 గంటల్లో వర్షపాతం: ${dashboardStats.rainfall.value}మిమీ (పెరుగుతోంది). ప్రస్తుత వాతావరణం: ${weatherData.temp}°సి, ${weatherData.condition}, తేమ ${weatherData.humidity}%, గాలి ${weatherData.windSpeed} కిమీ/గం. ఏఐ మోడళ్లు తదుపరి 24-48 గంటల్లో భారీ వర్షపాతం అంచనా వేస్తున్నాయి.`,
    safetyTips: `వరద భద్రతా చిట్కాలు:\n1. వరద-ప్రవణ ప్రాంతంలో ఉంటే వెంటనే ఎత్తైన ప్రదేశానికి వెళ్ళండి\n2. అత్యవసర సామాగ్రి సిద్ధంగా ఉంచండి\n3. ఫోన్ చార్జ్ చేసి పవర్ బ్యాంక్ దగ్గర ఉంచండి\n4. అధికారిక హెచ్చరికలపై దృష్టి పెట్టండి\n5. మునిగిన ప్రాంతాలలో నడవండి లేదా వాహనం నడపవద్దు\n6. పిల్లలు మరియు వృద్ధులను నీటి నుండి దూరంగా ఉంచండి\n7. ఖాళీ ఆదేశించినట్లైతే యుటిలిటీలు ఆపండి`,
    emergency: `అత్యవసర సూచనలు:\n1. అంబులెన్స్ కోసం 108, పోలీసు కోసం 100, వరద హెల్ప్‌లైన్ కోసం 1078 కాల్ చేయండి\n2. చిక్కుకుంటే అత్యంత పై అంతస్తుకు లేదా కప్పుకు వెళ్ళండి\n3. ఫ్లాష్‌లైట్ లేదా ప్రకాశవంతమైన గుడ్డతో సహాయం కోసం సంకేతం ఇవ్వండి\n4. వేగంగా ప్రవహించే నీటిలో ఈత కొట్టవద్దు\n5. వాహనంలో ఉంటే దానిని వదిలి ఎత్తైన ప్రదేశం కోరుకోండి\n6. ఫోన్ పొడిగా ఉంచండి, బ్యాటరీ ఆదా చేయండి\n7. అధికారిక రక్షణ కోసం వేచి ఉండండి`,
    shelters: `సమీపంలోని ఉపశమన ఆశ్రయాలు:\n${shelters.map(s => `• ${s.name} — ${s.address} (${s.distance}, ${s.occupied}/${s.capacity} నిండిన)`).join('\n')}\n\nసమీపంలోని ఆసుపత్రులు:\n${hospitals.map(h => `• ${h.name} — ${h.address} (${h.distance}, ${h.available} పడకలు అందుబాటులో)`).join('\n')}`,
    dashboard: `డాష్‌బోర్డ్ గైడ్:\n• డాష్‌బోర్డ్: గణాంకాలు, మానచిత్రం, వాతావరణం, అంచనాలతో ప్రత్యక్ష అవలోకనం\n• పర్యవేక్షణ: స్టేషన్‌ల నుండి నిజ-సమయ డేటా\n• అంచనా: ఏఐ మోడల్ అంచనాలు\n• ప్రమాద మానచిత్రం: వరద ప్రమాద మండలాల మానచిత్రం\n• హెచ్చరికలు: సక్రియ మరియు చారిత్రక హెచ్చరికలు\n• చారిత్రక: గత వరద రికార్డులు\n• అత్యవసర: ఎస్‌ఓఎస్, సంబంధాలు, ఆశ్రయాలు, ఆసుపత్రులు\n• సెట్టింగ్‌లు: ప్రాధాన్యతలు కాన్ఫిగర్ చేయండి`,
    default: `నేను వరద ప్రమాద సమాచారం, వర్షపాత వివరాలు, భద్రతా చిట్కాలు, అత్యవసర సూచనలు, సమీపంలోని ఆశ్రయాలు/ఆసుపత్రులు, మరియు డాష్‌బోర్డ్ నావిగేషన్‌లో సహాయం చేయగలను. దిగువ త్వరిత ప్రశ్నలలో ఒకదాన్ని ప్రయత్నించండి లేదా మీ ప్రశ్నను టైప్ చేయండి.`,
  },
}

function getResponse(lang, question) {
  const q = question.toLowerCase()
  const r = responses[lang] || responses.en
  if (q.includes('risk') || q.includes('जोखिम') || q.includes('प्रमाद') || q.includes('प्रमादం')) return r.floodRisk
  if (q.includes('rain') || q.includes('वर्ष') || q.includes('వర్ష')) return r.rainfall
  if (q.includes('safety') || q.includes('tip') || q.includes('सुरक्ष') || q.includes('భద్ర')) return r.safetyTips
  if (q.includes('emergency') || q.includes('आपात') || q.includes('అత్యవస')) return r.emergency
  if (q.includes('shelter') || q.includes('hospital') || q.includes('आश्र') || q.includes('अस्प') || q.includes('ఆశ్ర') || q.includes('ఆసు')) return r.shelters
  if (q.includes('dashboard') || q.includes('help') || q.includes('डैश') || q.includes('డాష్')) return r.dashboard
  return r.default
}

export default function Chatbot() {
  const { t, lang } = useLanguage()
  const [open, setOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [input, setInput] = useState('')
  const scrollRef = useRef(null)

  useEffect(() => {
    if (open && messages.length === 0) {
      setMessages([{ role: 'bot', text: t('chatbotWelcome') }])
    }
  }, [open])

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages])

  const quickQuestions = [
    t('quickFloodRisk'),
    t('quickRainfall'),
    t('quickSafetyTips'),
    t('quickEmergency'),
    t('quickShelters'),
    t('quickDashboard'),
  ]

  const sendMessage = (text) => {
    if (!text.trim()) return
    const userMsg = { role: 'user', text }
    setMessages((prev) => [...prev, userMsg])
    setInput('')
    setTimeout(() => {
      const reply = getResponse(lang, text)
      setMessages((prev) => [...prev, { role: 'bot', text: reply }])
    }, 500)
  }

  return (
    <>
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-accent to-accent-dark shadow-lg shadow-accent/30"
      >
        <AnimatePresence mode="wait">
          {open ? (
            <motion.div key="close" initial={{ rotate: -90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: 90, opacity: 0 }}>
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div key="open" initial={{ rotate: 90, opacity: 0 }} animate={{ rotate: 0, opacity: 1 }} exit={{ rotate: -90, opacity: 0 }}>
              <MessageCircle className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
        {!open && (
          <span className="absolute inset-0 rounded-full bg-accent/30 animate-ping" />
        )}
      </motion.button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-24 right-6 z-50 w-[calc(100vw-3rem)] sm:w-96 card flex flex-col overflow-hidden"
            style={{ maxHeight: '70vh' }}
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 border-b border-white/5 bg-accent/5">
              <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-gradient-to-br from-accent to-accent-dark">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-white">{t('chatbotTitle')}</h3>
                <p className="text-xs text-slate-500">{t('chatbotSubtitle')}</p>
              </div>
            </div>

            {/* Messages */}
            <div ref={scrollRef} className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex gap-2 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`flex items-center justify-center w-7 h-7 rounded-lg flex-shrink-0 ${
                    msg.role === 'bot' ? 'bg-accent/15 text-accent' : 'bg-white/5 text-slate-400'
                  }`}>
                    {msg.role === 'bot' ? <Bot className="w-4 h-4" /> : <User className="w-4 h-4" />}
                  </div>
                  <div className={`rounded-lg px-3 py-2 text-sm max-w-[80%] whitespace-pre-line ${
                    msg.role === 'bot' ? 'bg-bg-input text-slate-200' : 'bg-accent text-white'
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>

            {/* Quick Questions */}
            {messages.length <= 1 && (
              <div className="px-4 pb-2 flex flex-wrap gap-1.5">
                {quickQuestions.map((q) => (
                  <button
                    key={q}
                    onClick={() => sendMessage(q)}
                    className="px-2.5 py-1.5 rounded-lg text-xs font-medium bg-bg-input text-slate-400 hover:text-white hover:bg-accent/15 transition-colors border border-white/5"
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="p-3 border-t border-white/5 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && sendMessage(input)}
                placeholder={t('chatbotPlaceholder')}
                className="flex-1 bg-bg-input border border-white/10 rounded-lg px-3 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-accent transition-colors"
              />
              <button
                onClick={() => sendMessage(input)}
                className="flex items-center justify-center w-9 h-9 rounded-lg bg-accent text-white hover:bg-accent-dark transition-colors flex-shrink-0"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
