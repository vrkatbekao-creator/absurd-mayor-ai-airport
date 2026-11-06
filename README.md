# 荒謬市長：AI 起飛，飛機停飛！

繁體中文、English、Français、Nederlands 四語、單檔離線策略遊戲。你在 12 回合內處理一座仍然有價值的機場被宣布改建 AI 園區後的政治、財政與公共選擇。

## 立即遊玩

V0.5.2.1閱讀調整：[單檔候選版](荒謬市長_v0.5.2.1.html)、[驗收與捲動距離](QA_REPORT_v0.5.2.1.md)、[Issue處理](ISSUE_QA_v0.5.2.1.md)、[階段快照](SNAPSHOTS_v0.5.2.1.md)。先看任期摘要，再選擇展開人物、審計、資金或歷史。

目前V0.5.2：[單檔離線遊戲](荒謬市長_v0.5.2.html)。分開產業成果與政治承諾，四位人物依既有決策與實績回應，保持原玩法及存檔格式。見[QA與數據](QA_REPORT_v0.5.2.md)、[四節點快照](SNAPSHOTS_v0.5.2.md)、[PR #21](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/pull/21)。

已合併的 V0.5.0：下載 [荒謬市長_v0.5.0.html](荒謬市長_v0.5.0.html)，包含 A 版城市插畫、手機決策跳轉與原創離線配樂。已合併的 V0.5.1：[荒謬市長_v0.5.1.html](荒謬市長_v0.5.1.html)，加入專案外資、公共負擔審計與有記憶的城市敘事；驗證狀態見 [QA 記錄](QA_REPORT_v0.5.1.md) 與 [PR #19](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/pull/19)。各版本均可在瀏覽器離線開啟。 進度儲存在瀏覽器 localStorage；不同瀏覽器、不同檔案網址的儲存空間可能不相通。遊戲不需要帳號、伺服器或網路。

## 每回合流程

1. **政策事件** — 從三項政治決策中選擇一項，可能產生延遲的財政／民意影響。
2. **市政行動** — 只做一項：在原始土地建設、升級既有設施（Lv.1 → Lv.2）、執行一項尚未使用的行政措施，或暫緩行動並承擔政治後果。**不需要每回合重新建設。**
3. **結算** — 計算機場吞吐量及收入、AI 生產、電力、財政、民意與政見債務。第 4、8、12 回合有里程碑。

已建設的土地不能直接覆蓋；各行政／融資管道各限一次，升級各地塊限一次。保留機場、務實轉型及政策轉彎都可以成為有意義的玩家選擇。

## V0.5.1 與快照

V0.5.1 使用獨立存檔鍵，不覆寫 V0.5.0；舊檔只在同一儲存空間可讀到時複製匯入，歷史投資不會重複加錢。舊歷史不足時，第三項政見標示無法核實。

每個完成節點都有獨立 [快照版本](SNAPSHOTS_v0.5.1.md)。資金、存檔與敘事規格分別見 [資金規則](GAME_DESIGN_v0.5.1.md)、[存檔相容](SAVE_DESIGN_v0.5.1.md)、[敘事節點](STORY_DESIGN_v0.5.1.md)。

## 舊版與測試

- `荒謬市長_v0.2.html` — 保留的 v0.2.1 單檔遊戲。
- `荒謬市長_v0.3.html` — 新增的 v0.3 測試版單檔遊戲。
- `GAME_DESIGN_v0.3.md` — v0.3 政策預測／結局審計／決策分類設計。
- `BALANCE_REPORT_v0.2.2.md`、`BALANCE_SENSITIVITY_v0.2.2.md` — v0.2.1 引擎的 800+1,100 局策略比較與限制。
- `GAME_DESIGN_v0.2.1.md` — 新市政行動、升級、行政措施與存檔相容性。
- `GAME_DESIGN_v0.2.md` — 原有機場經濟與結局規則。
- `CHANGELOG_v0.2.1.md` — 本次變更。
- `TEST_REPORT_v0.2.md` — **舊版 v0.2** 600 局模擬，不能當作 v0.2.1 的策略平衡證據。
- `BROWSER_QA_ISSUE2.md` — 真實桌面瀏覽器（Chromium、Firefox、WebKit）響應式測試及人工截圖審查。
- `tests/regression.test.cjs`, `tests/municipal-regression.test.cjs`, `tests/browser-playtest.spec.cjs` — 邏輯與瀏覽器回歸測試。

**範圍限制：** V0.5.1 的三引擎、三尺寸、四語、鍵盤與存檔驗證範圍見新版 QA 記錄。未執行實體手機、螢幕閱讀器人工朗讀或母語編輯逐句校訂。舊版 QA 報告只證明其標示版本。

本 Repository 為私人測試，未啟用 GitHub Pages。

版本號更正：原誤標 V5.0／V5.1，正式版本為 V0.5.0／V0.5.1。舊檔名 v5.0／v5.1 保留為相容入口；新下載請用 v0.5.0／v0.5.1。存檔鍵與存檔資料版本不隨產品版本改名。

已合併的 V0.5.1.1：[離線遊戲](荒謬市長_v0.5.1.1.html)。分開呈現公共成本、待付現金與借款本金，並完成五路線配對比較；見 [策略複核](BALANCE_REPORT_v0.5.1.1.md)、[QA](QA_REPORT_v0.5.1.1.md) 與 [PR #20](https://github.com/vrkatbekao-creator/absurd-mayor-ai-airport/pull/20)。
