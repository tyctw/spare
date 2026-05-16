import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, BookOpen, GraduationCap, Briefcase, ChevronRight, Search, List as ListIcon } from 'lucide-react';

const VOCATIONAL_DATA = [
  {
    id: '機械群',
    label: '機械群',
    icon: '⚙️',
    description: '培育各種機械製造、設計、操作及維修之基礎技術人才。',
    majors: ['機械科', '鑄造科', '板金科', '機械木模科', '配管科', '模具科', '機電科', '製圖科', '生物產業機電科', '電腦機械製圖科'],
    careers: ['機械工程師', '機構設計工程師', 'CNC程式設計師', '自動化工程師', '航空維修人員']
  },
  {
    id: '動力機械群',
    label: '動力機械群',
    icon: '🚗',
    description: '培育從事汽車、機車、飛機、農業機械等動力機械之裝配、保養及維修技術人才。',
    majors: ['汽車科', '重機科', '飛機修護科', '動力機械科', '農業機械科', '軌道車輛科'],
    careers: ['汽車維修技師', '飛機修護工程師', '車輛檢驗員', '重機維修技師', '車輛相關研發助理']
  },
  {
    id: '電機與電子群',
    label: '電機與電子群',
    icon: '⚡',
    description: '培育電機、電子、資訊、通訊及控制等相關領域之基礎技術與實務應用人才。',
    majors: ['電機科', '控制科', '冷凍空調科', '電子科', '資訊科', '通訊科', '微電腦修護科'],
    careers: ['電子工程師', '電機工程師', '軟體工程師', '網路管理員', '通訊系統維護工程師', '智慧家庭規劃師']
  },
  {
    id: '化工群',
    label: '化工群',
    icon: '🧪',
    description: '培育生活化學、工業化學、分析化學與材料科學等製造與檢驗人才。',
    majors: ['化工科', '紡織科', '染整科'],
    careers: ['化學分析師', '化工製程工程師', '材料研發人員', '品管檢驗人員', '紡織工程師']
  },
  {
    id: '土木與建築群',
    label: '土木與建築群',
    icon: '🏗️',
    description: '培育土木建設、建築設計、室內裝修、測量及物業管理等專業實務人才。',
    majors: ['建築科', '土木科', '空間測繪科', '消防工程科'],
    careers: ['建築設計助理', '土木工程師', '測量技師', '室內設計師', '營建管理員', '不動產經紀人']
  },
  {
    id: '商業與管理群',
    label: '商業與管理群',
    icon: '💼',
    description: '培育具備商業服務、財務金融、電子商務及經營管理等基礎實用人才。',
    majors: ['商業經營科', '國際貿易科', '會計事務科', '資料處理科', '電子商務科', '流通管理科', '農產行銷科', '航運管理科'],
    careers: ['會計師', '財務規劃師', '行銷企劃', '電商運營', '國貿業務', '物流管理人才']
  },
  {
    id: '外語群',
    label: '外語群',
    icon: '🌍',
    description: '培育具備外語(英、日等)溝通能力，並能應用於觀光、商業及行政事務之人才。',
    majors: ['應用英語科', '應用日語科', '應用外語科'],
    careers: ['翻譯人員', '外商公司秘書', '外貿業務', '觀光導覽', '外語教保員']
  },
  {
    id: '設計群',
    label: '設計群',
    icon: '🎨',
    description: '培育視覺傳達、產品設計、工藝設計及媒體動畫等多元創意設計人才。',
    majors: ['美工科', '圖文傳播科', '金屬工藝科', '家具木工科', '室內空間設計科', '多媒體設計科', '廣告設計科', '陶瓷工程科'],
    careers: ['平面設計師', 'UI/UX設計師', '多媒體動畫師', '室內設計師', '商業攝影師', '包裝設計師']
  },
  {
    id: '農業群',
    label: '農業群',
    icon: '🌱',
    description: '培育現代化農業生產、野生動物保育、寵物美容及綠色景觀等專業人才。',
    majors: ['農場經營科', '園藝科', '森林科', '野生動物保育科', '造園科', '畜產保健科'],
    careers: ['精緻農業專家', '園藝景觀設計', '獸醫助理', '寵物美容師', '生態保育員']
  },
  {
    id: '食品群',
    label: '食品群',
    icon: '🍔',
    description: '培育食品加工、食品檢驗與分析及烘焙實務等現代食品工業人才。',
    majors: ['食品加工科', '食品科技科', '烘焙食品科', '水產食品科'],
    careers: ['食品技師', '西點烘焙師', '食品品管', '餐飲產品研發', '調酒師/咖啡師']
  },
  {
    id: '家政群',
    label: '家政群',
    icon: '🏠',
    description: '培育服飾設計、美容美髮、幼兒保育及生活家政等實用專業人才。',
    majors: ['家政科', '服裝科', '幼兒保育科', '美容科', '流行服飾科'],
    careers: ['彩妝/髮型設計師', '幼教老師', '服裝設計師', '長照服務人員', '婚禮企劃']
  },
  {
    id: '餐旅群',
    label: '餐旅群',
    icon: '🏨',
    description: '培育餐飲製備、旅館客務服務、旅行社業務及休閒遊憩管理之基層人才。',
    majors: ['觀光事業科', '餐飲管理科'],
    careers: ['飯店管理', '中西餐主廚', '航空空服員', '旅遊規劃師', '餐飲創業']
  },
  {
    id: '水產群',
    label: '水產群',
    icon: '🐟',
    description: '培育海洋漁撈技術、水產養殖、水族造景及資源養育等專才。',
    majors: ['漁業科', '水產養殖科'],
    careers: ['水產養殖技師', '遠洋航海漁業幹部', '海洋生態解說員']
  },
  {
    id: '海事群',
    label: '海事群',
    icon: '🚢',
    description: '培育船舶航行、輪機保養、海事管理及海洋科學等海運相關事業人才。',
    majors: ['輪機科', '航海科'],
    careers: ['商船船副/管輪', '海運承攬運送業務', '港勤船員', '海事工程人員']
  },
  {
    id: '藝術群',
    label: '藝術群',
    icon: '🎭',
    description: '培育音樂、美術、舞蹈及戲劇(電影電視)等表演及視覺藝術專業人才。',
    majors: ['影劇科', '音樂科', '舞蹈科', '美術科', '戲劇科', '電影電視科'],
    careers: ['表演藝術家', '影視製作人', '音樂創作者', '藝術治療師', '策展人']
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export default function VocationalEncyclopediaModal({ isOpen, onClose }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const filteredGroups = VOCATIONAL_DATA.filter(group => {
    const searchLower = searchTerm.toLowerCase();
    return (
      group.label.toLowerCase().includes(searchLower) ||
      group.majors.some(m => m.toLowerCase().includes(searchLower)) ||
      group.careers.some(c => c.toLowerCase().includes(searchLower))
    );
  });

  const activeGroupData = selectedGroup 
    ? VOCATIONAL_DATA.find(g => g.id === selectedGroup) 
    : null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }} 
            animate={{ scale: 1, opacity: 1 }} 
            exit={{ scale: 0.95, opacity: 0 }}
            className="relative w-full max-w-5xl bg-slate-50 rounded-3xl shadow-2xl border-2 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] h-[90vh] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-4 border-b-2 border-slate-900 flex items-center justify-between bg-white z-10 relative shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-indigo-100 rounded-lg border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] hidden sm:block">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">職群科系百科</h2>
              </div>
              <button 
                onClick={onClose} 
                className="p-2 hover:bg-slate-100 rounded-xl transition-colors border-2 border-transparent hover:border-slate-900"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            <div className="flex flex-col flex-1 overflow-hidden relative">
              {/* Main Area: Details */}
              <div className="flex-1 overflow-y-auto custom-scrollbar relative p-4 sm:p-8">
                
                {/* Selector Button */}
                <div className="max-w-3xl mx-auto mb-6">
                   <button 
                     onClick={() => setIsSelectorOpen(true)}
                     className="w-full sm:w-auto px-6 py-4 bg-white border-2 border-slate-900 rounded-2xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] flex items-center justify-between gap-4 font-black hover:bg-indigo-50 hover:-translate-y-0.5 active:translate-y-1 active:shadow-none transition-all text-left"
                   >
                     <div className="flex items-center gap-3 text-indigo-700">
                       {activeGroupData ? (
                          <>
                            <span className="text-3xl">{activeGroupData.icon}</span>
                            <span className="text-lg">切換職群：<span className="text-slate-900">{activeGroupData.label}</span></span>
                          </>
                       ) : (
                          <>
                            <ListIcon className="w-6 h-6" />
                            <span className="text-lg text-slate-900">請點擊選擇要查看的類群...</span>
                          </>
                       )}
                     </div>
                     <ChevronRight className="w-6 h-6 text-slate-400 rotate-90 hidden sm:block" />
                   </button>
                </div>

                {activeGroupData ? (
                  <motion.div
                    key={activeGroupData.id}
                    initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto space-y-6 pb-12"
                  >
                    <div className="flex items-center gap-4 mb-8 bg-white p-6 rounded-3xl border-2 border-slate-900 shadow-[4px_4px_0px_0px_rgba(15,23,42,1)]">
                      <div className="w-20 h-20 bg-indigo-50 border-2 border-slate-900 rounded-2xl flex items-center justify-center text-4xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-3 shrink-0">
                        {activeGroupData.icon}
                      </div>
                      <div>
                        <h3 className="text-2xl sm:text-3xl font-black text-slate-900">{activeGroupData.label}</h3>
                        <p className="text-slate-600 font-bold mt-2 text-sm sm:text-base leading-relaxed">
                          {activeGroupData.description}
                        </p>
                      </div>
                    </div>

                    <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-emerald-100 rounded-lg text-emerald-700 border-2 border-slate-900">
                          <GraduationCap className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">包含科別</h4>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {activeGroupData.majors.map(m => (
                          <span key={m} className="px-3 py-1.5 bg-emerald-50 text-emerald-900 border-2 border-emerald-200 rounded-lg font-bold text-sm">
                            {m}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white border-2 border-slate-900 rounded-3xl p-6 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                      <div className="flex items-center gap-2 mb-4">
                        <div className="p-1.5 bg-amber-100 rounded-lg text-amber-700 border-2 border-slate-900">
                          <Briefcase className="w-5 h-5" />
                        </div>
                        <h4 className="text-xl font-black text-slate-900">未來發展方向</h4>
                      </div>
                      <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                        {activeGroupData.careers.map(c => (
                          <li key={c} className="flex items-start gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 shrink-0 border border-slate-900"></span>
                            <span className="text-slate-700 font-bold">{c}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </motion.div>
                ) : (
                  <div className="h-full flex flex-col items-center justify-center text-slate-400 p-8 text-center max-w-sm mx-auto">
                    <BookOpen className="w-20 h-20 text-slate-300 mb-6 drop-shadow-sm" />
                    <h3 className="text-xl font-black text-slate-500 mb-2">點擊上方按鈕選擇類群</h3>
                    <p className="font-bold text-slate-400 text-sm">各職群包含了許多不同的科別，透過了解這些資訊，能幫助你更準確的填寫志願及規劃未來的職涯發展。</p>
                  </div>
                )}
              </div>

              {/* Group Selector Modal inside the Encyclopedia */}
              <AnimatePresence>
                {isSelectorOpen && (
                  <div className="absolute inset-0 z-20 flex flex-col bg-slate-50">
                    <motion.div
                      initial={{ y: '100%' }}
                      animate={{ y: 0 }}
                      exit={{ y: '100%' }}
                      transition={{ type: 'spring', damping: 25, stiffness: 200 }}
                      className="flex-1 flex flex-col w-full h-full bg-white shadow-[-10px_0px_20px_rgba(0,0,0,0.1)]"
                    >
                      <div className="p-4 border-b-2 border-slate-900 flex items-center justify-between bg-indigo-50">
                        <h3 className="font-black text-lg text-slate-900 flex items-center gap-2">
                          <ListIcon className="w-5 h-5 text-indigo-600" />
                          選擇職群
                        </h3>
                        <button 
                          onClick={() => setIsSelectorOpen(false)}
                          className="w-8 h-8 flex items-center justify-center bg-white border-2 border-slate-900 rounded-lg hover:bg-slate-100 active:translate-y-0.5 transition-all shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:shadow-none"
                        >
                          <X className="w-4 h-4 text-slate-900" />
                        </button>
                      </div>
                      
                      <div className="p-4 border-b border-slate-200">
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                          <input 
                            type="text" 
                            placeholder="搜尋群別、科別或職業..." 
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-9 pr-3 py-3 bg-slate-50 rounded-xl border-2 border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 transition-all font-bold"
                          />
                        </div>
                      </div>

                      <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2">
                        {filteredGroups.length === 0 ? (
                          <div className="text-center py-12 text-slate-400 font-bold">找不到相符的職群或科別</div>
                        ) : (
                          filteredGroups.map(group => (
                            <button
                              key={group.id}
                              onClick={() => {
                                setSelectedGroup(group.id);
                                setIsSelectorOpen(false);
                              }}
                              className={`w-full text-left p-4 rounded-xl flex items-center justify-between transition-all group/btn ${
                                selectedGroup === group.id 
                                  ? 'bg-indigo-600 text-white shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900' 
                                  : 'bg-white text-slate-700 hover:bg-indigo-50 border-2 border-slate-200 hover:border-slate-900 shadow-sm hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)]'
                              }`}
                            >
                              <div className="flex items-center gap-4">
                                <span className="text-2xl lg:text-3xl">{group.icon}</span>
                                <span className="font-black text-lg">{group.label}</span>
                              </div>
                              <ChevronRight className={`w-5 h-5 ${selectedGroup === group.id ? 'text-white' : 'text-slate-400 group-hover/btn:text-slate-900'} transition-colors`} />
                            </button>
                          ))
                        )}
                      </div>
                    </motion.div>
                  </div>
                )}
              </AnimatePresence>

            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

