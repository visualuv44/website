/* ══════════════════════════════════════
   REVELADO · Motor del juego
   ══════════════════════════════════════ */

(function () {
  const CLAVE = "visualuv-revelado";

  /* ─── estado ─── */
  let estado = {
    empezado: false,
    misiones: {},        // "autosync-0": true
    jefePasos: [],       // [true, false, ...]
    jefeHecho: false,
    mejorTiempo: null,   // segundos
    cronoInicio: null,   // timestamp si está corriendo
    cronoAcum: 0         // segundos acumulados al pausar
  };

  try {
    const guardado = JSON.parse(localStorage.getItem(CLAVE));
    if (guardado) estado = Object.assign(estado, guardado);
  } catch (e) { /* estado limpio */ }

  function guardar() {
    localStorage.setItem(CLAVE, JSON.stringify(estado));
  }

  /* ─── helpers ─── */
  const $ = (sel) => document.querySelector(sel);

  function nivelCompleto(nivel) {
    return nivel.misiones.every((_, j) => estado.misiones[nivel.id + "-" + j]);
  }

  function nivelDesbloqueado(i) {
    return i === 0 || nivelCompleto(NIVELES[i - 1]);
  }

  function todosLosNiveles() {
    return NIVELES.every(nivelCompleto);
  }

  function nivelActualIdx() {
    for (let i = 0; i < NIVELES.length; i++) {
      if (!nivelCompleto(NIVELES[i])) return i;
    }
    return NIVELES.length; // todos hechos → jefe
  }

  /* ─── tira de contactos ─── */
  function pintarTira() {
    const inner = $("#tiraInner");
    inner.innerHTML = "";
    const actual = nivelActualIdx();

    NIVELES.forEach((nivel, i) => {
      const f = document.createElement("button");
      f.className = "frame";
      f.dataset.estado = nivelCompleto(nivel) ? "hecho" : (i === actual ? "actual" : (nivelDesbloqueado(i) ? "actual" : "bloqueado"));
      f.innerHTML = nivelCompleto(nivel)
        ? nivel.num + ' <span class="frame-flag">⚑</span>'
        : nivel.num;
      f.setAttribute("aria-label", "Nivel " + nivel.num + " — " + nivel.titulo);
      if (f.dataset.estado !== "bloqueado") {
        f.addEventListener("click", () => {
          document.getElementById("nivel-" + nivel.id)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } else {
        f.disabled = true;
      }
      inner.appendChild(f);
    });

    // frame del jefe
    const fj = document.createElement("button");
    fj.className = "frame";
    fj.dataset.estado = estado.jefeHecho ? "hecho" : (todosLosNiveles() ? "actual" : "bloqueado");
    fj.textContent = "✺";
    fj.setAttribute("aria-label", "Jefe final — " + JEFE.titulo);
    if (fj.dataset.estado !== "bloqueado") {
      fj.addEventListener("click", () => $("#jefe").scrollIntoView({ behavior: "smooth", block: "start" }));
    } else {
      fj.disabled = true;
    }
    inner.appendChild(fj);
  }

  /* ─── niveles y misiones ─── */
  function pintarNiveles() {
    const cont = $("#niveles");
    cont.innerHTML = "";

    NIVELES.forEach((nivel, i) => {
      const art = document.createElement("article");
      art.className = "nivel";
      art.id = "nivel-" + nivel.id;
      const bloqueado = !nivelDesbloqueado(i);
      if (bloqueado) art.dataset.bloqueado = "";

      art.innerHTML = `
        <header class="nivel-head">
          <p class="nivel-eyebrow">
            <span class="nivel-num">Nivel ${nivel.num}</span>
            <span class="nivel-tema">${nivel.tema}</span>
          </p>
          <h2 class="nivel-titulo">${nivel.titulo}</h2>
          <p class="nivel-intro">${nivel.intro}</p>
          <p class="nivel-candado">⚿ Se desbloquea al terminar el nivel anterior.</p>
        </header>
        <div class="nivel-body"></div>
      `;

      const body = art.querySelector(".nivel-body");

      nivel.misiones.forEach((m, j) => {
        const clave = nivel.id + "-" + j;
        const hecha = !!estado.misiones[clave];
        const card = document.createElement("div");
        card.className = "mision";
        if (hecha) card.dataset.hecha = "";

        card.innerHTML = `
          <div class="mision-top">
            <h3 class="mision-titulo">${m.titulo}</h3>
            <button class="flag" aria-pressed="${hecha}">
              ⚑ <span>${hecha ? "Hecha" : "Marcar hecha"}</span>
            </button>
          </div>
          <p class="mision-porque">${m.porque}</p>
          <ol class="mision-pasos">${m.pasos.map(p => "<li>" + p + "</li>").join("")}</ol>
          ${m.tip ? '<p class="mision-tip">' + m.tip + "</p>" : ""}
        `;

        card.querySelector(".flag").addEventListener("click", () => {
          const antes = nivelCompleto(nivel);
          estado.misiones[clave] = !estado.misiones[clave];
          guardar();
          const ahora = nivelCompleto(nivel);
          if (antes !== ahora) {
            pintarTodo(); // cambió un desbloqueo → repintar
          } else {
            const on = !!estado.misiones[clave];
            card.toggleAttribute("data-hecha", on);
            const btn = card.querySelector(".flag");
            btn.setAttribute("aria-pressed", on);
            btn.querySelector("span").textContent = on ? "Hecha" : "Marcar hecha";
          }
        });

        body.appendChild(card);
      });

      if (!bloqueado && !nivelCompleto(nivel)) {
        const skip = document.createElement("button");
        skip.className = "nivel-skip";
        skip.textContent = "¿Ya dominás esto? Saltear el nivel";
        skip.addEventListener("click", () => {
          nivel.misiones.forEach((_, j) => { estado.misiones[nivel.id + "-" + j] = true; });
          guardar();
          pintarTodo();
        });
        body.appendChild(skip);
      }

      cont.appendChild(art);
    });
  }

  /* ─── jefe final ─── */
  let cronoTimer = null;

  function segundosCrono() {
    let s = estado.cronoAcum;
    if (estado.cronoInicio) s += Math.floor((Date.now() - estado.cronoInicio) / 1000);
    return s;
  }

  function fmt(s) {
    const h = Math.floor(s / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    const mm = String(m).padStart(2, "0"), ss = String(sec).padStart(2, "0");
    return h > 0 ? h + ":" + mm + ":" + ss : mm + ":" + ss;
  }

  function pintarCrono() {
    $("#cronoDisplay").textContent = fmt(segundosCrono());
    const corriendo = !!estado.cronoInicio;
    $("#cronoStart").hidden = corriendo;
    $("#cronoStart").textContent = segundosCrono() > 0 ? "Seguir" : "Arrancar";
    $("#cronoPause").hidden = !corriendo;
    $("#cronoReset").hidden = segundosCrono() === 0;
    if (estado.mejorTiempo) {
      $("#cronoBest").hidden = false;
      $("#cronoBest").textContent = "Tu mejor sesión: " + fmt(estado.mejorTiempo);
    }
  }

  function arrancarTick() {
    clearInterval(cronoTimer);
    cronoTimer = setInterval(() => { $("#cronoDisplay").textContent = fmt(segundosCrono()); }, 1000);
  }

  function pintarJefe() {
    $("#jefeTitulo").textContent = JEFE.titulo;
    $("#jefeIntro").textContent = JEFE.intro;

    const abierto = todosLosNiveles();
    $("#jefeLocked").hidden = abierto;
    $("#jefeOpen").hidden = !abierto || estado.jefeHecho;
    $("#victoria").hidden = !estado.jefeHecho;

    if (estado.jefeHecho && estado.mejorTiempo) {
      $("#victoriaText").textContent = "Sesión completa, de la tarjeta a la entrega, en " + fmt(estado.mejorTiempo) + ".";
    } else if (estado.jefeHecho) {
      $("#victoriaText").textContent = "Sesión completa, de la tarjeta a la entrega.";
    }

    if (!abierto || estado.jefeHecho) return;

    // checklist
    const ol = $("#jefePasos");
    ol.innerHTML = "";
    JEFE.pasos.forEach((p, i) => {
      const li = document.createElement("li");
      const hecho = !!estado.jefePasos[i];
      if (hecho) li.classList.add("hecho");
      const cb = document.createElement("input");
      cb.type = "checkbox";
      cb.checked = hecho;
      cb.id = "jp-" + i;
      cb.addEventListener("change", () => {
        estado.jefePasos[i] = cb.checked;
        guardar();
        li.classList.toggle("hecho", cb.checked);
        $("#jefeWin").disabled = !JEFE.pasos.every((_, k) => estado.jefePasos[k]);
      });
      const lab = document.createElement("label");
      lab.htmlFor = cb.id;
      lab.textContent = p;
      li.appendChild(cb);
      li.appendChild(lab);
      ol.appendChild(li);
    });

    $("#jefeWin").disabled = !JEFE.pasos.every((_, k) => estado.jefePasos[k]);
    pintarCrono();
    if (estado.cronoInicio) arrancarTick();
  }

  function pintarTodo() {
    pintarTira();
    pintarNiveles();
    pintarJefe();
  }

  /* ─── hero / slider de exposición ─── */
  const hero = $("#hero");
  const slider = $("#expoSlider");
  const valor = $("#expoValue");

  function fmtExpo(v) {
    const n = (v / 100).toFixed(2).replace(".", ",");
    return v > 0 ? "+" + n : (v < 0 ? "−" + n.replace("-", "") : n);
  }

  function aplicarExpo(v) {
    valor.textContent = fmtExpo(v);
    const t = (v + 300) / 400; // 0..1
    hero.style.setProperty("--expo", (0.25 + 0.75 * t).toFixed(3));
  }

  function empezar() {
    if (!estado.empezado) {
      estado.empezado = true;
      guardar();
    }
    $("#tira").hidden = false;
    $("#juego").hidden = false;
    pintarTodo();
  }

  slider.addEventListener("input", () => {
    const v = Number(slider.value);
    aplicarExpo(v);
    if (v >= 100) {
      $("#expoHint").innerHTML = "Revelado <strong>✓</strong>";
      empezar();
      setTimeout(() => {
        $(".reglas").scrollIntoView({ behavior: "smooth", block: "start" });
      }, 450);
    }
  });

  /* ─── arranque ─── */
  document.getElementById("anio").textContent = new Date().getFullYear();

  if (estado.empezado) {
    slider.value = 100;
    aplicarExpo(100);
    $("#expoHint").innerHTML = "Revelado <strong>✓</strong>";
    const cont = $("#heroContinue");
    cont.hidden = false;
    cont.addEventListener("click", () => {
      const idx = nivelActualIdx();
      const destino = idx >= NIVELES.length ? "#jefe" : "#nivel-" + NIVELES[idx].id;
      document.querySelector(destino)?.scrollIntoView({ behavior: "smooth", block: "start" });
    });
    empezar();
  }

  /* ─── cronómetro ─── */
  $("#cronoStart").addEventListener("click", () => {
    estado.cronoInicio = Date.now();
    guardar();
    pintarCrono();
    arrancarTick();
  });

  $("#cronoPause").addEventListener("click", () => {
    estado.cronoAcum = segundosCrono();
    estado.cronoInicio = null;
    guardar();
    clearInterval(cronoTimer);
    pintarCrono();
  });

  $("#cronoReset").addEventListener("click", () => {
    estado.cronoAcum = 0;
    estado.cronoInicio = null;
    guardar();
    clearInterval(cronoTimer);
    pintarCrono();
  });

  $("#jefeWin").addEventListener("click", () => {
    const total = segundosCrono();
    clearInterval(cronoTimer);
    estado.cronoInicio = null;
    estado.cronoAcum = 0;
    if (total > 0 && (!estado.mejorTiempo || total < estado.mejorTiempo)) {
      estado.mejorTiempo = total;
    }
    estado.jefeHecho = true;
    guardar();
    pintarTodo();
    $("#victoria").scrollIntoView({ behavior: "smooth", block: "center" });
  });

  $("#victoriaAgain").addEventListener("click", () => {
    estado.jefeHecho = false;
    estado.jefePasos = [];
    estado.cronoAcum = 0;
    estado.cronoInicio = null;
    guardar();
    pintarTodo();
    $("#jefe").scrollIntoView({ behavior: "smooth", block: "start" });
  });
})();
