$.get('data/data.json').done(function (data) {
  const list = data.XML_Head.Infos.Info;
  
  list.forEach((item,index) => {
    const startTime = item.Start.slice(0,10);
    const endTime = item.End.slice(0, 10);
    list[index].Time = `時間： ${startTime} ~ ${endTime}`;
  })

  document.querySelectorAll('.card-time').forEach((item, index) => {
    item.innerHTML = list[index].Time;
  })  
});