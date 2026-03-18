/* STUDIUM — Landing Page JS */

/* Scroll animations */
(function(){
  var els=document.querySelectorAll('.anim');
  if(!els.length)return;
  var obs=new IntersectionObserver(function(entries){
    entries.forEach(function(e){
      if(e.isIntersecting){
        var d=parseInt(e.target.getAttribute('data-d')||'0',10);
        setTimeout(function(){e.target.classList.add('vis')},d);
        obs.unobserve(e.target);
      }
    });
  },{threshold:0,rootMargin:'200px 0px 0px 0px'});
  els.forEach(function(el){obs.observe(el)});
  var check=function(){
    els.forEach(function(el){
      if(el.classList.contains('vis'))return;
      var r=el.getBoundingClientRect();
      if(r.top<window.innerHeight+100&&r.bottom>-100){
        var d=parseInt(el.getAttribute('data-d')||'0',10);
        setTimeout(function(){el.classList.add('vis')},d);
      }
    });
  };
  window.addEventListener('scroll',check,{passive:true});
  setTimeout(check,100);
})();

/* Nav scroll */
(function(){
  var nav=document.getElementById('nav');
  if(!nav)return;
  window.addEventListener('scroll',function(){nav.classList.toggle('scrolled',window.scrollY>20)});
})();

/* Demo chat */
(function(){
  var body=document.getElementById('demo-body'),prompts=document.getElementById('demo-prompts');
  if(!body||!prompts)return;
  var busy=false;
  prompts.querySelectorAll('.demo-chip').forEach(function(btn){
    btn.addEventListener('click',function(){
      if(busy)return;busy=true;
      var q=btn.getAttribute('data-q'),a=btn.getAttribute('data-a');
      var u=document.createElement('div');u.className='demo-msg demo-msg-user';
      u.innerHTML='<div class="demo-av">V</div><div class="demo-bubble">'+q+'</div>';
      body.appendChild(u);body.scrollTop=body.scrollHeight;
      prompts.style.opacity='.3';prompts.style.pointerEvents='none';
      setTimeout(function(){
        var t=document.createElement('div');t.className='demo-msg demo-msg-ai';t.id='typing';
        t.innerHTML='<div class="demo-av">S</div><div class="demo-bubble demo-typing">Pensando</div>';
        body.appendChild(t);body.scrollTop=body.scrollHeight;
        setTimeout(function(){
          var te=document.getElementById('typing');if(te)te.remove();
          var ai=document.createElement('div');ai.className='demo-msg demo-msg-ai';
          ai.innerHTML='<div class="demo-av">S</div><div class="demo-bubble">'+a+'</div>';
          body.appendChild(ai);body.scrollTop=body.scrollHeight;
          prompts.style.opacity='1';prompts.style.pointerEvents='auto';busy=false;
        },1200);
      },500);
    });
  });
})();

/* Pricing toggle */
(function(){
  var btn=document.getElementById('tgl-btn'),m=document.getElementById('tgl-m'),a=document.getElementById('tgl-a');
  if(!btn)return;
  var annual=false;
  btn.addEventListener('click',function(){
    annual=!annual;
    btn.classList.toggle('active',annual);
    m.classList.toggle('active',!annual);
    a.classList.toggle('active',annual);
    document.querySelectorAll('.price-val[data-m]').forEach(function(el){
      el.textContent='R$ '+(annual?el.getAttribute('data-a'):el.getAttribute('data-m'));
    });
  });
})();

/* Smooth scroll */
document.querySelectorAll('a[href^="#"]').forEach(function(l){
  l.addEventListener('click',function(e){
    var t=document.querySelector(this.getAttribute('href'));
    if(t){e.preventDefault();t.scrollIntoView({behavior:'smooth',block:'start'})}
  });
});
