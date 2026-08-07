/**
 * Region labels required by the initial analysis form.  The richer picker UI
 * remains in its own chunk and is requested only after the user opens it.
 */
export const REGIONS = [
  { id: 'taoyuan', name: '桃連區' },
  { id: 'taipei', name: '基北區' },
  { id: 'central', name: '中投區' },
  { id: 'changhua', name: '彰化區' },
  { id: 'tainan', name: '臺南區' },
  { id: 'kaohsiung', name: '高雄區' },
  { id: 'hsinchu', name: '竹苗區' },
  { id: 'yunlin', name: '雲林區' },
  { id: 'chiayi', name: '嘉義區' },
  { id: 'pingtung', name: '屏東區' },
  { id: 'yilan', name: '宜蘭區' },
  { id: 'taitung', name: '臺東區' },
] as const;
