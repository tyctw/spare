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
    careers: ['機械工程師', '機構設計工程師', 'CNC程式設計師', '自動化工程師', '航空維修人員'],
    holland: 'R 實用型 / I 研究型',
    hollandDesc: '適合喜歡動手操作機器、工具，且對事物運作原理感興趣，具備邏輯思考解決問題能力的人。',
    attributes: ['空間概念', '動手實作', '邏輯推理']
  },
  {
    id: '動力機械群',
    label: '動力機械群',
    icon: '🚗',
    description: '培育從事汽車、機車、飛機、農業機械等動力機械之裝配、保養及維修技術人才。',
    majors: ['汽車科', '重機科', '飛機修護科', '動力機械科', '農業機械科', '軌道車輛科'],
    careers: ['汽車維修技師', '飛機修護工程師', '車輛檢驗員', '重機維修技師', '車輛相關研發助理'],
    holland: 'R 實用型 / I 研究型',
    hollandDesc: '適合熱愛各式交通工具或動力發動機，喜歡動手拆裝修護，對於追求效率與精準有熱忱的人。',
    attributes: ['機械理解', '動手實作', '觀察敏銳']
  },
  {
    id: '電機與電子群',
    label: '電機與電子群',
    icon: '⚡',
    description: '培育電機、電子、資訊、通訊及控制等相關領域之基礎技術與實務應用人才。',
    majors: ['資訊科', '電子科', '控制科', '電機科', '冷凍空調科', '航空電子科', '電機空調科'],
    careers: ['電子工程師', '電機工程師', '軟體工程師', '網路管理員', '通訊系統維護工程師', '智慧家庭規劃師'],
    holland: 'R 實用型 / I 研究型 / C 常規型',
    hollandDesc: '適合喜歡操作電子儀器設備，對科技產品拆解有興趣，且能細心處理數據與按照規範行事的人。',
    attributes: ['數理邏輯', '細心專注', '系統思考']
  },
  {
    id: '化工群',
    label: '化工群',
    icon: '🧪',
    description: '培育生活化學、工業化學、分析化學與材料科學等製造與檢驗人才。',
    majors: ['化工科', '紡織科', '染整科'],
    careers: ['化學分析師', '化工製程工程師', '材料研發人員', '品管檢驗人員', '紡織工程師'],
    holland: 'I 研究型 / R 實用型',
    hollandDesc: '適合喜歡進行科學實驗與觀察，熱愛探究物質成分變化，且樂於從事品管與檢驗操作的人。',
    attributes: ['科學推理', '觀察敏銳', '實做精神']
  },
  {
    id: '土木與建築群',
    label: '土木與建築群',
    icon: '🏗️',
    description: '培育土木建設、建築設計、室內裝修、測量及物業管理等專業實務人才。',
    majors: ['建築科', '土木科', '空間測繪科', '消防工程科'],
    careers: ['建築設計助理', '土木工程師', '測量技師', '室內設計師', '營建管理員', '不動產經紀人'],
    holland: 'R 實用型 / I 研究型 / A 藝術型',
    hollandDesc: '適合具有空間美感與設計創意，同時擁有實務操作與嚴謹計算能力，渴望創造實體生活空間的人。',
    attributes: ['空間幾何', '美感設計', '環境覺知']
  },
  {
    id: '商業與管理群',
    label: '商業與管理群',
    icon: '💼',
    description: '培育具備商業服務、財務金融、電子商務及經營管理等基礎實用人才。',
    majors: ['商業經營科', '國際貿易科', '會計事務科', '資料處理科', '不動產事務科', '電子商務科', '流通管理科', '農產行銷科', '航運管理科'],
    careers: ['會計師', '財務規劃師', '行銷企劃', '電商運營', '國貿業務', '物流管理人才'],
    holland: 'E 企業型 / C 常規型',
    hollandDesc: '適合具有領導與說服力，樂於與人接觸並達成商業目標，同時也擅長處理數字與系統化資料的人。',
    attributes: ['人際溝通', '商業敏銳', '資料組織']
  },
  {
    id: '外語群',
    label: '外語群',
    icon: '🌍',
    description: '培育具備外語(英、日等)溝通能力，並能應用於觀光、商業及行政事務之人才。',
    majors: ['應用外語科(英文組)', '應用外語科(日文組)'],
    careers: ['翻譯人員', '外商公司秘書', '外貿業務', '觀光導覽', '外語教保員'],
    holland: 'S 社會型 / A 藝術型 / E 企業型',
    hollandDesc: '適合熱愛異國文化與語言學習，樂於與他人溝通交流，且期望具有國際視野及商業應對能力的人。',
    attributes: ['語言表達', '文化同理', '人際互動']
  },
  {
    id: '設計群',
    label: '設計群',
    icon: '🎨',
    description: '培育視覺傳達、產品設計、工藝設計及媒體動畫等多元創意設計人才。',
    majors: ['家具木工科', '美工科', '陶瓷工程科', '室內空間設計科', '圖文傳播科', '金屬工藝科', '家具設計科', '廣告設計科', '多媒體設計科', '多媒體應用科', '室內設計科'],
    careers: ['平面設計師', 'UI/UX設計師', '多媒體動畫師', '室內設計師', '商業攝影師', '包裝設計師'],
    holland: 'A 藝術型 / R 實用型',
    hollandDesc: '適合擁有豐富想像力，喜歡用視覺美感表達自我，同時願意動手將腦海中的設計轉化為實際作品的人。',
    attributes: ['創意美學', '視覺表達', '色彩敏銳']
  },
  {
    id: '農業群',
    label: '農業群',
    icon: '🌱',
    description: '培育現代化農業生產、野生動物保育、寵物美容及綠色景觀等專業人才。',
    majors: ['農場經營科', '園藝科', '森林科', '野生動物保育科', '造園科', '畜產保健科'],
    careers: ['精緻農業專家', '園藝景觀設計', '獸醫助理', '寵物美容師', '生態保育員'],
    holland: 'R 實用型 / I 研究型',
    hollandDesc: '適合喜愛大自然與動植物，不怕弄髒雙手，願意在戶外環境工作並研究生命科學的人。',
    attributes: ['自然觀察', '戶外實作', '生命關懷']
  },
  {
    id: '食品群',
    label: '食品群',
    icon: '🍔',
    description: '培育食品加工、食品檢驗與分析及烘焙實務等現代食品工業人才。',
    majors: ['食品加工科', '食品科', '水產食品科', '烘焙科'],
    careers: ['食品技師', '西點烘焙師', '食品品管', '餐飲產品研發', '調酒師/咖啡師'],
    holland: 'R 實用型 / I 研究型 / A 藝術型',
    hollandDesc: '適合對於美食與烘焙有高度熱忱，講究科學檢驗的精確性，又能發揮創意於菜色外觀設計的人。',
    attributes: ['味覺敏銳', '科學分析', '創意手作']
  },
  {
    id: '家政群',
    label: '家政群',
    icon: '🏠',
    description: '培育服飾設計、美容美髮、幼兒保育及生活家政等實用專業人才。',
    majors: ['家政科', '服裝科', '幼兒保育科', '美容科', '時尚模特兒科', '流行服飾科', '時尚造型科', '照顧服務科'],
    careers: ['彩妝/髮型設計師', '幼教老師', '服裝設計師', '長照服務人員', '婚禮企劃'],
    holland: 'S 社會型 / A 藝術型 / R 實用型',
    hollandDesc: '適合樂於服務家人與社會，對於美容服飾有美感追求，喜歡與人互動並提升他人生活品質的人。',
    attributes: ['人際關懷', '美感呈現', '服務熱忱']
  },
  {
    id: '餐旅群',
    label: '餐旅群',
    icon: '🏨',
    description: '培育餐飲製備、旅館客務服務、旅行社業務及休閒遊憩管理之基層人才。',
    majors: ['觀光事業科', '餐飲管理科'],
    careers: ['飯店管理', '中西餐主廚', '航空空服員', '旅遊規劃師', '餐飲創業'],
    holland: 'S 社會型 / E 企業型',
    hollandDesc: '適合喜歡與人互動，具備高情商與服務熱忱，期望在觀光與餐飲產業中帶給顧客美好體驗的人。',
    attributes: ['服務溝通', '應變能力', '團隊合作']
  },
  {
    id: '水產群',
    label: '水產群',
    icon: '🐟',
    description: '培育海洋漁撈技術、水產養殖、水族造景及資源養育等專才。',
    majors: ['漁業科', '水產養殖科'],
    careers: ['水產養殖技師', '遠洋航海漁業幹部', '海洋生態解說員'],
    holland: 'R 實用型 / I 研究型',
    hollandDesc: '適合喜歡接近海洋與水域環境，樂意投入水產養殖技術研究與漁撈實務工作的人。',
    attributes: ['自然生態', '環境適應', '科學紀錄']
  },
  {
    id: '海事群',
    label: '海事群',
    icon: '🚢',
    description: '培育船舶航行、輪機保養、海事管理及海洋科學等海運相關事業人才。',
    majors: ['輪機科', '航海科'],
    careers: ['商船船副/管輪', '海運承攬運送業務', '港勤船員', '海事工程人員'],
    holland: 'R 實用型 / E 企業型 / c 常規型',
    hollandDesc: '適合嚮往海洋航行，具備抗壓性及團隊紀律，能操作且維護大型船舶機械設備的人。',
    attributes: ['空間方向', '機械操作', '抗壓紀律']
  },
  {
    id: '藝術群',
    label: '藝術群',
    icon: '🎭',
    description: '培育音樂、美術、舞蹈及戲劇(電影電視)等表演及視覺藝術專業人才。',
    majors: ['戲劇科', '音樂科', '舞蹈科', '美術科', '影劇科', '西樂科', '國樂科', '電影電視科', '表演藝術科', '多媒體動畫科', '時尚工藝科'],
    careers: ['表演藝術家', '影視製作人', '音樂創作者', '藝術治療師', '策展人'],
    holland: 'A 藝術型',
    hollandDesc: '適合情緒感受豐富，勇於在舞台或作品中表現自我，具有原創性與強烈藝術企圖心的人。',
    attributes: ['藝術天賦', '自我表達', '創新思維']
  }
];

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onOpenHollandTest?: () => void;
}

export default function VocationalEncyclopediaModal({ isOpen, onClose, onOpenHollandTest }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
          <motion.div
            initial={{ opacity: 0, backdropFilter: 'blur(0px)' }} 
            animate={{ opacity: 1, backdropFilter: 'blur(4px)' }} 
            exit={{ opacity: 0, backdropFilter: 'blur(0px)' }}
            className="absolute inset-0 bg-slate-900/60"
            onClick={onClose}
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 20 }} 
            animate={{ scale: 1, opacity: 1, y: 0 }} 
            exit={{ scale: 0.95, opacity: 0, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="relative w-full max-w-6xl bg-white rounded-[2rem] shadow-2xl border-4 border-slate-900 overflow-hidden shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] h-[90vh] max-h-[850px] flex flex-col"
          >
            {/* Header */}
            <div className="px-6 py-5 border-b-4 border-slate-900 flex items-center justify-between bg-indigo-50 z-10 shrink-0 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '16px 16px' }}></div>
              <div className="flex items-center gap-4 relative z-10">
                <div className="p-3 bg-white rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transform -rotate-3 transition-transform hover:rotate-0">
                  <BookOpen className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">職群科系百科</h2>
                  <p className="text-sm font-bold text-slate-500 hidden sm:block">探索15大職群，找到最適合你的未來方向</p>
                </div>
              </div>
              <button 
                onClick={onClose} 
                className="relative z-10 w-10 h-10 flex items-center justify-center bg-white border-2 border-slate-900 rounded-xl hover:bg-slate-100 hover:text-rose-500 hover:-translate-y-0.5 hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0 active:shadow-none transition-all"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="flex flex-1 overflow-hidden relative bg-slate-50/50">
              {/* Sidebar (List) */}
              <div className={`
                ${activeGroupData ? 'hidden lg:flex' : 'flex'} 
                flex-col w-full lg:w-80 xl:w-96 border-r-0 lg:border-r-4 border-slate-900 bg-white shrink-0 h-full z-10
              `}>
                <div className="p-4 border-b-2 border-slate-200 bg-slate-50/80 backdrop-blur shrink-0">
                  <div className="relative">
                    <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input 
                      type="text" 
                      placeholder="搜尋群別、科別或相關職業..." 
                      value={searchTerm}
                      onChange={e => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-white rounded-xl border-2 border-slate-300 text-sm focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-500/20 transition-all font-bold text-slate-700 placeholder:text-slate-400 shadow-sm"
                    />
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto custom-scrollbar p-3 space-y-2 bg-slate-50/50">
                  {filteredGroups.length === 0 ? (
                    <div className="text-center py-16 flex flex-col items-center">
                      <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-4 border-2 border-slate-200">
                        <Search className="w-8 h-8 text-slate-300" />
                      </div>
                      <span className="text-slate-500 font-bold">找不到相符的結果</span>
                      <button onClick={() => setSearchTerm('')} className="mt-2 text-indigo-600 font-bold hover:underline text-sm">清除搜尋</button>
                    </div>
                  ) : (
                    filteredGroups.map(group => {
                      const isActive = selectedGroup === group.id;
                      return (
                        <button
                          key={group.id}
                          onClick={() => setSelectedGroup(group.id)}
                          className={`w-full text-left p-3.5 rounded-2xl flex items-center justify-between transition-all group/btn ${
                            isActive 
                              ? 'bg-indigo-600 text-white shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] border-2 border-slate-900 scale-[0.98]' 
                              : 'bg-white text-slate-700 hover:bg-indigo-50 border-2 border-slate-200 hover:border-slate-900 shadow-[0_2px_0_0_rgba(226,232,240,1)] hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] hover:-translate-y-0.5'
                          }`}
                        >
                          <div className="flex items-center gap-4">
                            <span className="text-3xl filter drop-shadow-sm">{group.icon}</span>
                            <span className={`font-black text-lg ${isActive ? 'text-white' : 'text-slate-700 group-hover/btn:text-slate-900'}`}>{group.label}</span>
                          </div>
                          <ChevronRight className={`w-5 h-5 ${isActive ? 'text-indigo-200' : 'text-slate-300 group-hover/btn:text-slate-900'} transition-colors ${isActive ? 'translate-x-1' : ''}`} />
                        </button>
                      );
                    })
                  )}
                </div>
              </div>

              {/* Main Content (Details) */}
              <div className={`
                ${!activeGroupData ? 'hidden lg:flex' : 'flex'} 
                flex-1 flex-col bg-slate-50 overflow-hidden relative
              `}>
                <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, black 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
                
                {activeGroupData ? (
                  <div className="flex-1 overflow-y-auto custom-scrollbar p-5 md:p-8 relative z-10">
                    <motion.div
                      key={activeGroupData.id}
                      initial={{ opacity: 0, y: 10 }} 
                      animate={{ opacity: 1, y: 0 }}
                      className="max-w-4xl mx-auto space-y-6 lg:space-y-8"
                    >
                      {/* Mobile Back Button */}
                      <button 
                        onClick={() => setSelectedGroup(null)}
                        className="lg:hidden mb-2 inline-flex items-center gap-2 text-slate-500 font-bold hover:text-slate-900 transition-colors bg-white px-4 py-2 rounded-xl border-2 border-slate-200 hover:border-slate-900 shadow-sm"
                      >
                        <ChevronRight className="w-5 h-5 rotate-180" />
                        返回職群列表
                      </button>

                      {/* Hero Section */}
                      <div className="bg-white p-6 md:p-8 rounded-[2rem] border-4 border-slate-900 shadow-[8px_8px_0px_0px_rgba(15,23,42,1)] relative overflow-hidden group">
                        <div className="absolute -right-12 -top-12 text-[150px] opacity-10 group-hover:scale-110 group-hover:rotate-12 transition-transform duration-500 pointer-events-none select-none">
                          {activeGroupData.icon}
                        </div>
                        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center gap-6">
                          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-gradient-to-br from-indigo-100 to-purple-100 border-4 border-slate-900 rounded-[1.5rem] flex items-center justify-center text-6xl shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] -rotate-6 shrink-0 group-hover:rotate-0 transition-transform">
                            {activeGroupData.icon}
                          </div>
                          <div>
                            <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 text-white rounded-lg font-bold text-xs mb-3 tracking-widest uppercase">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                              Vocational Category
                            </div>
                            <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight mb-3 selection:bg-indigo-200">
                              {activeGroupData.label}
                            </h3>
                            <p className="text-slate-600 font-bold text-base md:text-lg leading-relaxed max-w-2xl selection:bg-indigo-100">
                              {activeGroupData.description}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Bento Grid layout */}
                      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 md:gap-6">
                        
                        {/* Holland Code Card - Span 6 */}
                        <div className="md:col-span-7 bg-white rounded-3xl border-4 border-slate-900 p-6 md:p-7 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col">
                          <div className="flex items-center gap-3 mb-5 pb-4 border-b-2 border-slate-100">
                            <div className="bg-blue-100 text-blue-700 p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                              <Search className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl md:text-2xl font-black text-slate-900">荷倫碼性向分析</h4>
                          </div>
                          <div className="mb-4">
                            <div className="inline-block px-4 py-2 bg-slate-900 text-white font-black text-lg md:text-xl rounded-xl shadow-inner tracking-widest">
                              {activeGroupData.holland.split(' / ').map((code, i, arr) => (
                                <React.Fragment key={code}>
                                  <span className="text-white">{code.charAt(0)}</span>
                                  <span className="text-slate-400 font-bold ml-1 text-base">{code.substring(1)}</span>
                                  {i < arr.length - 1 && <span className="mx-2 text-slate-600">/</span>}
                                </React.Fragment>
                              ))}
                            </div>
                          </div>
                          <p className="text-slate-600 font-bold text-base leading-relaxed bg-blue-50/50 p-4 rounded-2xl border-2 border-blue-100 flex-1">
                            {activeGroupData.hollandDesc}
                          </p>
                        </div>

                        {/* Attributes Card - Span 5 */}
                        <div className="md:col-span-5 bg-indigo-600 rounded-3xl border-4 border-slate-900 p-6 md:p-7 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] flex flex-col text-white">
                          <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-white/20">
                            <div className="bg-white text-indigo-700 p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rotate-3">
                              <Briefcase className="w-6 h-6" />
                            </div>
                            <h4 className="text-xl md:text-2xl font-black text-white drop-shadow-sm">具備特質</h4>
                          </div>
                          
                          <div className="grid gap-3 flex-1">
                            {activeGroupData.attributes.map((attr, idx) => (
                              <div key={attr} className="bg-white/10 backdrop-blur-sm border-2 border-white/20 p-3.5 rounded-2xl font-black text-lg flex items-center justify-between group cursor-default hover:bg-white/20 transition-colors">
                                <span>{attr}</span>
                                <span className="text-indigo-200 font-bold text-sm bg-indigo-900/40 px-2 py-1 rounded-lg">#0{idx + 1}</span>
                              </div>
                            ))}
                          </div>
                        </div>

                        {/* Majors Card - Span full */}
                        <div className="md:col-span-12 bg-emerald-50 rounded-3xl border-4 border-slate-900 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)]">
                          <div className="flex items-center justify-between mb-6 pb-4 border-b-2 border-emerald-200/50">
                            <div className="flex items-center gap-3">
                              <div className="bg-emerald-400 text-slate-900 p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] -rotate-3">
                                <GraduationCap className="w-6 h-6" />
                              </div>
                              <h4 className="text-xl md:text-2xl font-black text-slate-900">包含科系</h4>
                            </div>
                            <div className="text-sm font-black text-emerald-800 bg-emerald-200/50 px-3 py-1 rounded-xl border-2 border-emerald-300">
                              共 {activeGroupData.majors.length} 科
                            </div>
                          </div>
                          <div className="flex flex-wrap gap-2.5 md:gap-3">
                            {activeGroupData.majors.map(m => (
                              <span key={m} className="px-4 py-2.5 md:py-3 bg-white text-slate-800 border-2 border-slate-900 rounded-xl font-black text-[15px] hover:-translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(15,23,42,1)] transition-all cursor-default">
                                {m}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Careers Card - Span full */}
                        <div className="md:col-span-12 bg-white rounded-3xl border-4 border-slate-900 p-6 md:p-8 shadow-[6px_6px_0px_0px_rgba(15,23,42,1)] mt-2">
                           <div className="flex items-center gap-3 mb-6 pb-4 border-b-2 border-slate-100">
                              <div className="bg-amber-300 text-slate-900 p-2.5 rounded-xl border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] rotate-3">
                                <Briefcase className="w-6 h-6" />
                              </div>
                              <h4 className="text-xl md:text-2xl font-black text-slate-900">未來發展與職業</h4>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                              {activeGroupData.careers.map((c, i) => (
                                <div key={c} className="flex items-center gap-4 bg-slate-50 border-2 border-slate-200 p-4 rounded-2xl group hover:border-amber-400 hover:bg-amber-50 transition-colors">
                                  <div className="w-10 h-10 rounded-xl bg-white border-2 border-slate-200 flex items-center justify-center font-black text-slate-400 group-hover:border-amber-400 group-hover:text-amber-600 group-hover:shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] transition-all">
                                    {i + 1}
                                  </div>
                                  <span className="font-bold text-slate-700 text-lg group-hover:text-slate-900">{c}</span>
                                </div>
                              ))}
                            </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center p-8 text-center bg-white m-6 rounded-[2rem] border-4 border-slate-200 border-dashed">
                    <div className="w-32 h-32 bg-slate-50 text-slate-300 border-4 border-slate-100 rounded-[2rem] flex items-center justify-center rotate-6 mb-8 group-hover:rotate-12 transition-transform shadow-inner">
                      <BookOpen className="w-16 h-16" />
                    </div>
                    <h3 className="text-3xl font-black text-slate-400 mb-4 tracking-tight">選擇左側職群</h3>
                    <p className="text-slate-400 font-bold text-lg max-w-sm mb-12">
                      探索15大職群的詳細資訊、適合特質與未來發展方向，幫助你規劃高中學習藍圖！
                    </p>
                    
                    <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-6 sm:p-8 max-w-md w-full relative overflow-hidden text-left shadow-sm">
                      <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-bl-[100px] -z-10 opacity-50"></div>
                      <div className="flex items-center justify-between mb-5 pb-4 border-b-2 border-slate-200">
                        <div className="flex items-center gap-3">
                          <div className="text-2xl">💡</div>
                          <h4 className="text-xl font-black text-slate-800">認識荷倫碼性向</h4>
                        </div>
                        <button 
                          onClick={onOpenHollandTest}
                          className="bg-indigo-600 text-white text-sm font-black px-3 py-1.5 rounded-lg hover:bg-indigo-500 border-2 border-slate-900 shadow-[2px_2px_0px_0px_rgba(15,23,42,1)] active:translate-y-0.5 active:shadow-none transition-all whitespace-nowrap"
                        >
                          立即測驗
                        </button>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-indigo-100 text-indigo-700 font-black rounded-xl flex items-center justify-center border-2 border-indigo-200">R</div>
                          <span className="font-bold text-slate-600 text-base">實用型<span className="text-slate-400 ml-2 font-medium">喜歡動手做、操作機器</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-emerald-100 text-emerald-700 font-black rounded-xl flex items-center justify-center border-2 border-emerald-200">I</div>
                          <span className="font-bold text-slate-600 text-base">研究型<span className="text-slate-400 ml-2 font-medium">喜歡發掘、思考與分析</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-amber-100 text-amber-700 font-black rounded-xl flex items-center justify-center border-2 border-amber-200">A</div>
                          <span className="font-bold text-slate-600 text-base">藝術型<span className="text-slate-400 ml-2 font-medium">喜歡設計創作與表達自我</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-rose-100 text-rose-700 font-black rounded-xl flex items-center justify-center border-2 border-rose-200">S</div>
                          <span className="font-bold text-slate-600 text-base">社會型<span className="text-slate-400 ml-2 font-medium">喜歡幫助別人、與人互動</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-blue-100 text-blue-700 font-black rounded-xl flex items-center justify-center border-2 border-blue-200">E</div>
                          <span className="font-bold text-slate-600 text-base">企業型<span className="text-slate-400 ml-2 font-medium">喜歡組織、領導與影響他人</span></span>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-10 bg-slate-200 text-slate-700 font-black rounded-xl flex items-center justify-center border-2 border-slate-300">C</div>
                          <span className="font-bold text-slate-600 text-base">常規型<span className="text-slate-400 ml-2 font-medium">喜歡井然有序、處理細節</span></span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}


