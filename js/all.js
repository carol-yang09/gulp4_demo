"use strict";$.get("data/data.json").done(function(n){var c=n.XML_Head.Infos.Info;c.forEach(function(n,e){var t=n.Start.slice(0,10),a=n.End.slice(0,10);c[e].Time="時間： "+t+" ~ "+a}),document.querySelectorAll(".card-time").forEach(function(n,e){n.innerHTML=c[e].Time})});var newFun2=function(){};newFun2();
//# sourceMappingURL=all.js.map
