(function(){
  function photo(x){
    return '<img src="'+x.img+'" alt="'+x.n+'" loading="lazy" style="--pos:'+x.pos+'">';
  }

  /* ---- data ---- */
  var P=[
    {n:'Монстера Деліціоза',p:890,m:'Ø 17 см · 65 см',t:['easy','big'],b:'Бестселер',img:'images/photo2.jpg',pos:'50% 70%'},
    {n:'Фікус Лірата',p:1190,m:'Ø 19 см · 75 см',t:['big','office'],b:'Новинка',img:'images/photo3.jpg',pos:'40% 50%'},
    {n:'Заміокулькас',p:720,m:'Ø 15 см · 50 см',t:['easy','shade','office'],img:'images/photo4.jpg',pos:'60% 65%'},
    {n:'Калатея Орбіфолія',p:680,old:800,m:'Ø 14 см · 45 см',t:['shade'],b:'−15%',img:'images/photo5.jpg',pos:'45% 70%'}
  ];
  var filter='all',query='';
  var grid=document.getElementById('grid'),badge=document.getElementById('badge'),toast=document.getElementById('toast'),tt;
  var fmt=function(n){return String(n).replace(/\B(?=(\d{3})+(?!\d))/g,'\u00a0')+'\u00a0₴'};
  function say(m){toast.textContent=m;toast.classList.add('on');clearTimeout(tt);tt=setTimeout(function(){toast.classList.remove('on')},2200)}
  var cart={},STORE='zk-cart',FREE=1500;
  try{cart=JSON.parse(localStorage.getItem(STORE))||{}}catch(e){cart={}}
  Object.keys(cart).forEach(function(k){if(!P[k]||!(cart[k]>0))delete cart[k]});
  var drawer=document.getElementById('drawer'),shade=document.getElementById('shade'),cl=document.getElementById('cartList'),cf=document.getElementById('cartFoot');
  function save(){try{localStorage.setItem(STORE,JSON.stringify(cart))}catch(e){}}
  function sum(f){return Object.keys(cart).reduce(function(s,k){return s+f(k)},0)}
  function paint(){
    var n=sum(function(k){return cart[k]}),t=sum(function(k){return P[k].p*cart[k]}),h='';
    badge.textContent=n;badge.classList.toggle('on',n>0);
    Object.keys(cart).forEach(function(k){var x=P[k];
      h+='<div class="ci"><img src="'+x.img+'" alt="" style="--pos:'+x.pos+'"><div><h4>'+x.n+'</h4><span class="price">'+fmt(x.p)+'</span>'+
        '<div class="qty"><button data-d="-1" data-k="'+k+'" aria-label="Менше">−</button><b>'+cart[k]+'</b><button data-d="1" data-k="'+k+'" aria-label="Більше">+</button></div></div>'+
        '<button class="rm" data-rm="'+k+'" aria-label="Видалити"><svg class="ico"><use href="#i-x"/></svg></button></div>';
    });
    cl.innerHTML=h||'<p class="empty">Кошик поки порожній. Оберіть рослину в каталозі.</p>';
    cf.innerHTML=n?'<p class="ship">'+(t>=FREE?'Доставка по Києву безкоштовна':'До безкоштовної доставки ще '+fmt(FREE-t))+'</p>'+
      '<div class="bar"><i style="width:'+Math.min(100,t/FREE*100)+'%"></i></div>'+
      '<div class="tot"><span>Разом</span><b>'+fmt(t)+'</b></div><button class="btn" id="checkout" style="justify-content:center;width:100%">Оформити замовлення</button>':'';
  }
  function add(i){cart[i]=(cart[i]||0)+1;save();paint();say('«'+P[i].n+'» додано до кошика')}
  function openD(){drawer.classList.add('open');shade.classList.add('open');drawer.setAttribute('aria-hidden','false')}
  function closeD(){drawer.classList.remove('open');shade.classList.remove('open');drawer.setAttribute('aria-hidden','true')}
  document.addEventListener('keydown',function(e){if(e.key==='Escape')closeD()});
  shade.addEventListener('click',closeD);
  document.getElementById('drawerClose').addEventListener('click',closeD);
  drawer.addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    if(b.dataset.d){var k=b.dataset.k;cart[k]+=+b.dataset.d;if(cart[k]<=0)delete cart[k];save();paint()}
    else if(b.dataset.rm){delete cart[b.dataset.rm];save();paint()}
    else if(b.id==='checkout')checkout();
  });
  function checkout(){
    var t=sum(function(k){return P[k].p*cart[k]});
    closeD();
    body.innerHTML='<h3>Оформлення замовлення</h3><p class="qstep">Сума: '+fmt(t)+'</p>'+
      '<form class="co" id="coForm"><label>Ім’я<input name="n" required autocomplete="name"></label>'+
      '<label>Телефон<input name="t" type="tel" required autocomplete="tel" placeholder="+380…"></label>'+
      '<label>Адреса доставки<input name="a" required autocomplete="street-address"></label>'+
      '<button class="btn" style="justify-content:center">Підтвердити замовлення</button></form>';
    dlg.showModal();
  }

  function render(){
    var h='',c=0;
    P.forEach(function(x,i){
      if(filter!=='all'&&x.t.indexOf(filter)<0)return;
      if(query&&x.n.toLowerCase().indexOf(query)<0)return;
      c++;
      h+='<article class="pc"><div class="pic">'+photo(x)+(x.b?'<span class="tag">'+x.b+'</span>':'')+
        '<button class="fav" aria-pressed="false" aria-label="В обране"><svg class="ico"><use href="#i-heart"/></svg></button></div>'+
        '<div class="row"><h3>'+x.n+'</h3><span class="price">'+(x.old?'<s>'+fmt(x.old)+'</s>':'')+fmt(x.p)+'</span></div>'+
        '<div class="meta">'+x.m+'</div><button class="add" data-i="'+i+'">Додати в кошик</button></article>';
    });
    grid.innerHTML=h||'<p class="empty">Нічого не знайдено. Спробуйте інший фільтр або запит.</p>';
  }
  render();

  grid.addEventListener('click',function(e){
    var f=e.target.closest('.fav'),a=e.target.closest('.add');
    if(f){f.setAttribute('aria-pressed',f.getAttribute('aria-pressed')!=='true')}
    if(a){add(+a.dataset.i)}
  });
  document.getElementById('chips').addEventListener('click',function(e){
    var b=e.target.closest('.chip');if(!b)return;
    filter=b.dataset.f;
    this.querySelectorAll('.chip').forEach(function(c){c.setAttribute('aria-pressed',c===b)});
    render();
  });

  /* header: search, burger, cart */
  var sb=document.getElementById('searchbar'),sBtn=document.getElementById('searchBtn'),q=document.getElementById('q');
  sBtn.addEventListener('click',function(){
    var o=sb.classList.toggle('open');sBtn.setAttribute('aria-expanded',o);
    if(o)q.focus();else{q.value='';query='';render()}
  });
  q.addEventListener('input',function(){query=q.value.trim().toLowerCase();render();if(query)document.getElementById('catalog').scrollIntoView({behavior:'smooth'})});
  var nav=document.getElementById('nav'),bg=document.getElementById('burger');
  bg.addEventListener('click',function(){var o=nav.classList.toggle('open');bg.setAttribute('aria-expanded',o)});
  nav.addEventListener('click',function(e){if(e.target.closest('a')){nav.classList.remove('open');bg.setAttribute('aria-expanded',false)}});
  document.getElementById('cartBtn').addEventListener('click',openD);

  /* quiz */
  var dlg=document.getElementById('dlg'),body=document.getElementById('dlgBody');
  var Q=[
    {q:'Скільки світла в кімнаті?',o:['Мало — вікна на північ','Помірно — розсіяне світло','Багато — сонячна сторона']},
    {q:'Скільки часу на догляд?',o:['Майже зовсім немає','Раз на тиждень','Люблю доглядати щодня']},
    {q:'Який розмір рослини хочете?',o:['Компактна, на полицю','Велика, на підлогу']}
  ],ans=[],step=0;
  function ask(){
    if(step>=Q.length)return result();
    body.innerHTML='<h3>'+Q[step].q+'</h3><p class="qstep">Запитання '+(step+1)+' з '+Q.length+'</p><div class="opts">'+
      Q[step].o.map(function(t,i){return '<button data-a="'+i+'">'+t+'</button>'}).join('')+'</div>';
  }
  function result(){
    var l=ans[0],c=ans[1],big=ans[2]===1,i;
    if(l===0) i=c===0?2:3;
    else if(big) i=l===2?0:1;
    else i=c===0?2:0;
    var x=P[i];
    body.innerHTML='<h3>Ваша рослина</h3><div class="res"><div class="pic">'+photo(x)+'</div><div class="row" style="margin:0"><h3>'+x.n+'</h3><span class="price">'+fmt(x.p)+'</span></div>'+
      '<button class="btn" id="qAdd" style="justify-content:center">Додати в кошик</button><button class="link" id="qAgain" style="justify-self:center;border:0;text-decoration:underline">Пройти ще раз</button></div>';
    document.getElementById('qAdd').onclick=function(){add(i);dlg.close()};
    document.getElementById('qAgain').onclick=function(){ans=[];step=0;ask()};
  }
  body.addEventListener('click',function(e){var b=e.target.closest('[data-a]');if(!b)return;ans.push(+b.dataset.a);step++;ask()});
  document.getElementById('quizBtn').addEventListener('click',function(){ans=[];step=0;ask();dlg.showModal()});
  document.getElementById('dlgClose').addEventListener('click',function(){dlg.close()});
  dlg.addEventListener('click',function(e){if(e.target===dlg)dlg.close()});
  body.addEventListener('submit',function(e){
    e.preventDefault();
    var name=e.target.elements.n.value.trim();
    cart={};save();paint();
    body.innerHTML='<h3>Дякуємо, '+name.replace(/[<>&"]/g,'')+'!</h3><p class="qstep">Ваше замовлення прийнято.</p><button class="btn" id="coOk" style="justify-content:center;width:100%">Закрити</button>';
    document.getElementById('coOk').onclick=function(){dlg.close()};
  });
  paint();
})();
