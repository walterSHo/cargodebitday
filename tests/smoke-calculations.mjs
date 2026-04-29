import assert from "node:assert/strict";

function monthly({planTurnover, planPercent, avgDiscount, avgDelayFact, overdue1, overdue2, overdue3, eurRate, crmDone}) {
  const planBase = planPercent >= 110 ? 18000 : planPercent >= 100 ? 14000 : planPercent >= 90 ? 8000 : 0;
  const planBonus = avgDiscount >= 27.5 ? planBase * 0.5 : planBase;
  const delayBonus = avgDelayFact <= 7 ? 6000 : avgDelayFact <= 14 ? 3000 : 0;
  const crmBonus = crmDone ? 10000 : 0;
  const overdueEur = overdue1 + overdue2 + overdue3;
  const overdueLocal = overdueEur * eurRate;
  return { total: planBonus + delayBonus + crmBonus - overdueLocal };
}
function quarter({groupsDone, tiresMinMet, tiresOver}) {
  const base = groupsDone >= 12 ? 40000 : groupsDone >= 10 ? 30000 : groupsDone >= 9 ? 22000 : groupsDone >= 8 ? 16000 : groupsDone >= 7 ? 10000 : 0;
  const tires = (tiresMinMet ? tiresOver * 300 : -5000);
  return { total: base + tires };
}
const cases=[
  {m:{planPercent:0,avgDiscount:0,avgDelayFact:20,overdue1:0,overdue2:0,overdue3:0,eurRate:45,crmDone:false},q:{groupsDone:0,tiresMinMet:false,tiresOver:0},exp: -5000},
  {m:{planPercent:90,avgDiscount:0,avgDelayFact:14,overdue1:0,overdue2:0,overdue3:0,eurRate:45,crmDone:false},q:{groupsDone:7,tiresMinMet:true,tiresOver:0},exp:21000},
  {m:{planPercent:100,avgDiscount:28,avgDelayFact:7,overdue1:0,overdue2:0,overdue3:0,eurRate:45,crmDone:true},q:{groupsDone:8,tiresMinMet:true,tiresOver:10},exp:42000},
  {m:{planPercent:110,avgDiscount:0,avgDelayFact:5,overdue1:10,overdue2:0,overdue3:0,eurRate:40,crmDone:true},q:{groupsDone:12,tiresMinMet:true,tiresOver:5},exp:75100},
  {m:{planPercent:99,avgDiscount:30,avgDelayFact:10,overdue1:1,overdue2:2,overdue3:3,eurRate:50,crmDone:false},q:{groupsDone:9,tiresMinMet:false,tiresOver:0},exp:23700},
  {m:{planPercent:89,avgDiscount:0,avgDelayFact:15,overdue1:0,overdue2:0,overdue3:0,eurRate:45,crmDone:false},q:{groupsDone:10,tiresMinMet:true,tiresOver:20},exp:36000},
  {m:{planPercent:105,avgDiscount:27.5,avgDelayFact:8,overdue1:0,overdue2:0,overdue3:0,eurRate:45,crmDone:true},q:{groupsDone:11,tiresMinMet:true,tiresOver:0},exp:50000},
  {m:{planPercent:110,avgDiscount:27.49,avgDelayFact:6,overdue1:0,overdue2:0,overdue3:0,eurRate:45,crmDone:true},q:{groupsDone:12,tiresMinMet:true,tiresOver:0},exp:74000}
];
for (const c of cases){ const total=monthly(c.m).total+quarter(c.q).total; assert.equal(Math.round(total), c.exp);}
console.log(`smoke scenarios passed: ${cases.length}`);
