# V0.5.2 節點快照

分支固定於各節點完成提交，不隨後續開發移動。

| 節點 | 分支 | 內容 | 固定提交 |
|---|---|---|---|
| S1 | snapshot/v0.5.2-stage-1 | 單一啟動、逐階段政策對照 | 64a46416693eb53f76346d5a21ee277824099b2d |
| S2 | snapshot/v0.5.2-stage-2 | 產業／政治評價、歷史檢驗點 | 42070497f583d0c2cc44e0e4e84d858404735b1b |
| S3 | snapshot/v0.5.2-stage-3 | 四位人物依決策與現況回應 | df7aeb83c49fc97b7869f135e76060d07b582287 |
| S4 | snapshot/v0.5.2-stage-4 | 完整驗收、視覺修正、QA與數據 | 合併前通過最新Checks的最終提交 |

S4驗收成功後建立，固定SHA可由該分支及PR #21查核。release/v0.5.2合併後指向main合併提交。每節點可下載當時HTML，離線快照包另列雜湊。

保留release/v0.5.0、release/v0.5.1、release/v0.5.1.1與snapshot/v0.5.2-planning。
