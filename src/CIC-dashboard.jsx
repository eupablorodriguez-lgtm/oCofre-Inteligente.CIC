  {/* ── AMBIENT GLOW ── */}
  <div style={{position:"fixed",top:-100,left:-80,width:320,height:320,background:`radial-gradient(circle,${T.amber}0C 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>
  <div style={{position:"fixed",bottom:80,right:-60,width:260,height:260,background:`radial-gradient(circle,${T.blue}08 0%,transparent 70%)`,pointerEvents:"none",zIndex:0}}/>

  <div style={{position:"relative",zIndex:1,paddingBottom:100,opacity:animIn?1:0,transform:animIn?"translateY(0)":"translateY(16px)",transition:"opacity 0.6s ease,transform 0.6s ease"}}>

    {/* ══ HEADER ══ */}
    <div style={{padding:"52px 20px 0",borderBottom:`1px solid ${T.border}`,paddingBottom:20}}>
      <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
        <div>
          <p style={{margin:"0 0 3px",fontSize:10,color:T.mid,letterSpacing:3,fontWeight:700}}>PAINEL DO MOTORISTA</p>
          <h1 style={{margin:0,fontSize:28,fontWeight:900,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:-0.5,lineHeight:1}}>
            Olá, João <span style={{color:T.amber}}>Silva</span>
          </h1>
          <div style={{display:"flex",alignItems:"center",gap:8,marginTop:6}}>
            <span style={{fontSize:12,color:nivel.cor,fontWeight:700,letterSpacing:1,fontFamily:"'Barlow Condensed',sans-serif"}}>{nivel.nome}</span>
            <span style={{fontSize:10,color:T.dim}}>•</span>
            <span style={{fontSize:11,color:T.mid}}>🔥 {cofres.reduce((a,c)=>Math.max(a,c.streak),0)} dias de streak</span>
          </div>
        </div>
        <div style={{textAlign:"right"}}>
          <div style={{width:48,height:48,borderRadius:16,background:`linear-gradient(135deg,${T.amber},${T.amberD})`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,fontWeight:900,color:"#000",fontFamily:"'Barlow Condensed',sans-serif",boxShadow:`0 6px 20px ${T.amber}44`,animation:"pulseAmber 3s infinite"}}>JS</div>
          <p style={{margin:"6px 0 0",fontSize:9,color:T.mid,letterSpacing:1}}>ID: #4821</p>
        </div>
      </div>

      {/* ── SCORE + ILF ── */}
      <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:12,marginBottom:16}}>
        {/* Score Card */}
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:18,padding:"16px 12px",textAlign:"center"}}>
          <p style={{margin:"0 0 8px",fontSize:9,color:T.mid,letterSpacing:2,fontWeight:700}}>SCORE DE DISCIPLINA</p>
          <ScoreGauge score={score}/>
        </div>
        {/* ILF + Total */}
        <div style={{background:T.surface,border:`1px solid ${T.border}`,borderRadius:18,padding:"16px 14px",display:"flex",flexDirection:"column",justifyContent:"space-between"}}>
          <div>
            <p style={{margin:"0 0 4px",fontSize:9,color:T.mid,letterSpacing:2,fontWeight:700}}>TOTAL GUARDADO</p>
            <p style={{margin:0,fontSize:28,fontWeight:900,color:T.amber,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:-0.5,lineHeight:1}}>{R(totalGuardado)}</p>
            <p style={{margin:"3px 0 0",fontSize:10,color:T.mid}}>{cofres.filter(c=>pct(c.saldo,c.meta)>=100).length} meta(s) concluída(s)</p>
          </div>
          <ILFBar score={ilf}/>
        </div>
      </div>
    </div>

    {/* ══ META PRINCIPAL ══ */}
    <div style={{padding:"20px 20px 0"}}>
      <div style={{position:"relative",background:`linear-gradient(135deg,${T.amber}18,${T.amber}06)`,border:`1px solid ${T.amber}33`,borderRadius:20,padding:"20px",marginBottom:20,overflow:"hidden"}}>
        <div style={{position:"absolute",top:-20,right:-20,fontSize:80,opacity:0.07,transform:"rotate(-15deg)"}}>{metaPrincipal.img}</div>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:14}}>
          <div>
            <p style={{margin:"0 0 3px",fontSize:9,color:T.amber,letterSpacing:2,fontWeight:700}}>META PRINCIPAL</p>
            <p style={{margin:0,fontSize:20,fontWeight:800,color:T.white,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.3}}>{metaPrincipal.nome}</p>
          </div>
          <Ring p={pct(metaPrincipal.saldo,metaPrincipal.meta)} color={T.amber} size={56} thick={5}>
            <span style={{fontSize:12,fontWeight:800,color:T.amber,fontFamily:"'Barlow Condensed',sans-serif"}}>{pct(metaPrincipal.saldo,metaPrincipal.meta)}%</span>
          </Ring>
        </div>
        <div style={{marginBottom:12}}>
          <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
            <span style={{fontSize:12,color:T.offwhite,fontFamily:"'DM Mono',monospace"}}>{R(metaPrincipal.saldo)}</span>
            <span style={{fontSize:12,color:T.mid,fontFamily:"'DM Mono',monospace"}}>{R(metaPrincipal.meta)}</span>
          </div>
          <div style={{height:8,background:T.dim,borderRadius:4,overflow:"hidden"}}>
            <div style={{height:"100%",borderRadius:4,background:`linear-gradient(90deg,${T.amberD},${T.amber},${T.amberL})`,width:`${pct(metaPrincipal.saldo,metaPrincipal.meta)}%`,transition:"width 1.4s cubic-bezier(.4,0,.2,1)",boxShadow:`0 0 16px ${T.amber}66`}}/>
          </div>
        </div>
        <div style={{display:"flex",gap:12}}>
          <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"8px 10px"}}>
            <p style={{margin:0,fontSize:9,color:T.mid,letterSpacing:1}}>FALTA</p>
            <p style={{margin:0,fontSize:14,fontWeight:800,color:T.white,fontFamily:"'Barlow Condensed',sans-serif"}}>{R(metaPrincipal.meta-metaPrincipal.saldo)}</p>
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"8px 10px"}}>
            <p style={{margin:0,fontSize:9,color:T.mid,letterSpacing:1}}>PRAZO</p>
            <p style={{margin:0,fontSize:14,fontWeight:800,color:T.white,fontFamily:"'Barlow Condensed',sans-serif"}}>{dias(metaPrincipal.prazo)}d</p>
          </div>
          <div style={{flex:1,background:"rgba(0,0,0,0.3)",borderRadius:10,padding:"8px 10px"}}>
            <p style={{margin:0,fontSize:9,color:T.mid,letterSpacing:1}}>POR DIA</p>
            <p style={{margin:0,fontSize:14,fontWeight:800,color:T.amber,fontFamily:"'Barlow Condensed',sans-serif"}}>{R(Math.ceil((metaPrincipal.meta-metaPrincipal.saldo)/Math.max(1,dias(metaPrincipal.prazo))))}</p>
          </div>
        </div>
      </div>
    </div>

    {/* ══ APORTE RÁPIDO ══ */}
    <div style={{padding:"0 20px 20px"}}>
      <p style={{margin:"0 0 12px",fontSize:10,color:T.mid,letterSpacing:2,fontWeight:700}}>APORTE RÁPIDO</p>
      <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:8}}>
        {[
          {sub:"🌧️",label:"Difícil",val:5},
          {sub:"☁️",label:"Médio",val:10},
          {sub:"☀️",label:"Bom",val:20},
          {sub:"🌟",label:"Excelente",val:50},
        ].map(b=>(
          <button key={b.val} onClick={()=>{ setModal({type:"aporte",cofre:metaPrincipal,valorSugerido:b.val}); }} style={{
            background:T.surface,border:`1px solid ${T.border}`,
            borderRadius:14,padding:"12px 6px",cursor:"pointer",
            transition:"all 0.15s",textAlign:"center",
          }}
            onMouseEnter={e=>{e.currentTarget.style.borderColor=T.amber;e.currentTarget.style.background=`${T.amber}12`;}}
            onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.background=T.surface;}}
          >
            <div style={{fontSize:18,marginBottom:3}}>{b.sub}</div>
            <div style={{fontSize:9,color:T.mid,letterSpacing:0.5,marginBottom:2}}>{b.label}</div>
            <div style={{fontSize:14,fontWeight:800,color:T.amber,fontFamily:"'Barlow Condensed',sans-serif"}}>R${b.val}</div>
          </button>
        ))}
      </div>
    </div>

    {/* ══ TABS ══ */}
    <div style={{padding:"0 20px",marginBottom:16}}>
      <div style={{display:"flex",gap:6,background:T.surface,border:`1px solid ${T.border}`,borderRadius:12,padding:4}}>
        {["cofres","missões","conquistas"].map(t=>(
          <button key={t} onClick={()=>setTab(t)} style={{
            flex:1,padding:"8px 4px",borderRadius:9,border:"none",cursor:"pointer",
            fontFamily:"'Barlow',sans-serif",fontWeight:600,fontSize:11,letterSpacing:0.5,
            background:tab===t?T.amber:"transparent",
            color:tab===t?"#000":T.mid,
            transition:"all 0.2s",textTransform:"capitalize",
          }}>{t}</button>
        ))}
      </div>
    </div>

    {/* ══ COFRES LIST ══ */}
    {tab==="cofres"&&(
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:12}}>
        {cofres.map((c,idx)=>{
          const p=pct(c.saldo,c.meta), done=p>=100;
          return(
            <div key={c.id} className="card-hover" style={{background:T.card,border:`1px solid ${done?c.cor+"55":T.border}`,borderRadius:18,padding:"16px",position:"relative",overflow:"hidden",animation:`fadeUp 0.4s ease ${idx*0.07}s both`}}>
              {done&&<div style={{position:"absolute",top:0,left:0,right:0,height:2,background:`linear-gradient(90deg,${c.cor},${c.cor}00)`}}/>}
              {c.autoMode&&<div style={{position:"absolute",top:12,right:12,background:`${T.green}22`,border:`1px solid ${T.green}44`,borderRadius:6,padding:"2px 7px",fontSize:9,color:T.green,fontWeight:700,letterSpacing:0.5}}>AUTO</div>}
              <div style={{display:"flex",gap:12,alignItems:"flex-start"}}>
                <Ring p={p} color={done?"#22C55E":c.cor} size={58} thick={4}>
                  <span style={{fontSize:done?18:16,transform:done?"none":"none"}}>{done?"✅":c.icon}</span>
                </Ring>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:4}}>
                    <p style={{margin:0,fontSize:15,fontWeight:700,color:T.white,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.3}}>{c.nome}</p>
                    <span style={{fontSize:12,fontWeight:800,color:done?T.green:c.cor,fontFamily:"'Barlow Condensed',sans-serif",letterSpacing:0.5}}>{done?"CONCLUÍDO":p+"%"}</span>
                  </div>
                  <p style={{margin:"0 0 8px",fontSize:11,color:T.mid,fontFamily:"'DM Mono',monospace"}}>{R(c.saldo)} <span style={{color:T.dim}}>/ {R(c.meta)}</span></p>
                  <div style={{height:4,background:T.dim,borderRadius:2,marginBottom:8,overflow:"hidden"}}>
                    <div style={{height:"100%",borderRadius:2,background:done?T.green:c.cor,width:`${p}%`,transition:"width 1s ease",boxShadow:done?`0 0 8px ${T.green}55`:`0 0 8px ${c.cor}55`}}/>
                  </div>
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-end"}}>
                    <div style={{display:"flex",gap:10}}>
                      {!done&&<span style={{fontSize:10,color:T.mid}}>📅 {dias(c.prazo)}d</span>}
                      <span style={{fontSize:10,color:T.amber}}>🔥 {c.streak}d</span>
                    </div>
                    <MiniSpark vals={c.historico} color={done?T.green:c.cor} h={24}/>
                  </div>
                </div>
              </div>
              {!done&&(
                <div style={{display:"flex",gap:8,marginTop:12}}>
                  <button onClick={()=>handleAporte(c)} style={{flex:2,padding:"10px",borderRadius:10,border:"none",background:T.amber,color:"#000",fontFamily:"'Barlow Condensed',sans-serif",fontWeight:800,fontSize:14,letterSpacing:0.5,cursor:"pointer",boxShadow:`0 4px 16px ${T.amber}44`}}>GUARDAR →</button>
                  <button onClick={()=>handleSaque(c)} style={{flex:1,padding:"10px",borderRadius:10,border:`1px solid ${T.border}`,background:"transparent",color:T.mid,fontFamily:"'Barlow',sans-serif",fontWeight:500,fontSize:12,cursor:"pointer"}}>Sacar</button>
                </div>
              )}
            </div>
          );
        })}
        {/* Novo cofre */}
        <button style={{background:"transparent",border:`2px dashed ${T.border}`,borderRadius:18,padding:"18px",color:T.dim,fontFamily:"'Barlow Condensed',sans-serif",fontSize:16,fontWeight:700,letterSpacing:0.5,cursor:"pointer",display:"flex",alignItems:"center",justifyContent:"center",gap:8,transition:"all 0.2s"}}
          onMouseEnter={e=>{e.currentTarget.style.borderColor=T.amber;e.currentTarget.style.color=T.amber;}}
          onMouseLeave={e=>{e.currentTarget.style.borderColor=T.border;e.currentTarget.style.color=T.dim;}}
        >+ CRIAR NOVO COFRE</button>
      </div>
    )}

    {/* ══ MISSÕES ══ */}
    {tab==="missões"&&(
      <div style={{padding:"0 20px",display:"flex",flexDirection:"column",gap:10}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
          <p style={{margin:0,fontSize:10,color:T.mid,letterSpacing:2,fontWeight:700}}>MISSÕES ATIVAS</p>
          <span style={{fontSize:11,color:T.amber,fontWeight:700}}>Redefine segunda-feira</span>
        </div>
        {MISSOES.map((m,i)=>{
          const p=Math.round((m.progresso/m.total)*100);
          return(
            <div key={i} style={{background:T.card,border:`1px solid ${T.border}`,borderRadius:16,padding:"16px",animation:`fadeUp 0.4s ease ${i*0.08}s both`}}>
              <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                <p style={{margin:0,fontSize:14,fontWeight:600,color:T.white,flex:1,paddingRight:12,lineHeight:1.4}}>{m.texto}</p>
                <div style={{background:`${T.amber}18`,border:`1px solid ${T.amber}33`,borderRadius:8,padding:"4px 10px",flexShrink:0}}>
                  <span style={{fontSize:11,fontWeight:800,color:T.amber,fontFamily:"'Barlow Condensed',sans-serif"}}>+{m.xp} XP</span>
                </div>
              </div>
              <div style={{marginBottom:8}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:5}}>
                  <span style={{fontSize:11,color:T.mid}}>{m.progresso} / {m.total}</span>
                  <span style={{fontSize:11,fontWeight:700,color:T.amber}}>{p}%</span>
                </div>
                <div style={{height:6,background:T.dim,borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",borderRadius:3,background:p>=100?T.green:T.amber,width:`${p}%`,transition:"width 1s ease",boxShadow:`0 0 8px ${p>=100?T.green:T.amber}55`}}/>
                </div>
              </div>
            </div>
          );
        })}
        {/* Missão concluída */}
        <div style={{background:`${T.green}10`,border:`1px solid ${T.green}33`,borderRadius:16,padding:"14px 16px",display:"flex",alignItems:"center",gap:12}}>
          <span style={{fontSize:24}}>✅</span>
          <div>
            <p style={{margin:0,fontSize:14,fontWeight:600,color:T.green,textDecoration:"line-through",opacity:0.7}}>Fazer primeiro aporte do mês</p>
            <p style={{margin:"3px 0 0",fontSize:11,color:T.mid}}>Concluída · +50 XP ganhos</p>
          </div>
        </div>
      </div>
    )}

    {/* ══ CONQUISTAS ══ */}
    {tab==="conquistas"&&(
      <div style={{padding:"0 20px"}}>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <p style={{margin:0,fontSize:10,color:T.mid,letterSpacing:2,fontWeight:700}}>MEDALHAS</p>
          <span style={{fontSize:11,color:T.amber,fontWeight:700}}>{CONQUISTAS.filter(c=>c.desbloqueado).length} / {CONQUISTAS.length}</span>
        </div>
        <div style={{display:"grid",gridTemplateColumns:"repeat(4,1fr)",gap:10}}>
          {CONQUISTAS.map((c,i)=>(
            <div key={i} style={{background:c.desbloqueado?`${T.amber}12`:T.surface,border:`1px solid ${c.desbloqueado?T.amber+"44":T.border}`,borderRadius:14,padding:"14px 8px",textAlign:"center",opacity:c.desbloqueado?1:0.4,animation:`fadeUp 0.4s ease ${i*0.05}s both`,transition:"all 0.2s"}}>
              <div style={{fontSize:26,marginBottom:6,filter:c.desbloqueado?"none":"grayscale(1)"}}>{c.icon}</div>
              <p style={{margin:0,fontSize:9,color:c.desbloqueado?T.amber:T.mid,fontWeight:700,lineHeight:1.3,letterSpacing:0.3}}>{c.nome}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>

  {/* ══ BOTTOM NAV ══ */}
  <div style={{position:"fixed",bottom:0,left:"50%",transform:"translateX(-50%)",width:"100%",maxWidth:440,background:"rgba(6,6,8,0.97)",backdropFilter:"blur(24px)",borderTop:`1px solid ${T.border}`,padding:"12px 0 28px",display:"flex",justifyContent:"space-around",alignItems:"center",zIndex:50}}>
    {[["🏠","Início"],["🎯","Metas"],["📊","Relatório"],["🤖","C.I.C. IA"],["⚙️","Config"]].map(([ic,lb])=>(
      <button key={lb} style={{background:"none",border:"none",color:lb==="Início"?T.amber:T.dim,fontFamily:"'Barlow',sans-serif",fontSize:9,fontWeight:700,cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",gap:4,letterSpacing:0.5,textTransform:"uppercase",transition:"color 0.2s"}}
        onMouseEnter={e=>e.currentTarget.style.color=T.amber}
        onMouseLeave={e=>e.currentTarget.style.color=lb==="Início"?T.amber:T.dim}
      >
        <span style={{fontSize:22}}>{ic}</span>{lb}
      </button>
    ))}
  </div>

  {/* ══ MODALS ══ */}
  {modal?.type==="aporte"&&(
    <Modal onClose={()=>setModal(null)} title="Fazer Aporte">
      <AporteRapido cofre={modal.cofre} onClose={()=>setModal(null)} onConfirm={confirmarAporte}/>
    </Modal>
  )}
  {modal?.type==="saque"&&(
    <Modal onClose={()=>setModal(null)} title="Proteção Anti-Saque">
      <AntiSaque cofre={modal.cofre} onClose={()=>setModal(null)}/>
    </Modal>
  )}
</div>
