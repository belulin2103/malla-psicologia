// --- PLAN (por años y semestres) ---
// Cargué aquí el AÑO 1 (Semestre 1 y Semestre 2) según tu PDF.
// Fuente: plan subido por vos. :contentReference[oaicite:1]{index=1}

const plan = [
  {
    ano: 1,
    semestres: [
      {
        nro: 1,
        materias: [
          { nombre: "Historia del Pensamiento Sociopolítico", correlativas: [] },
          { nombre: "Filosofía I", correlativas: [] },
          { nombre: "Neuropsicología", correlativas: [] },
          { nombre: "Psicología General", correlativas: [] },
          { nombre: "Lingüística", correlativas: [] },
          { nombre: "Historia de la Psicología", correlativas: [] },
          { nombre: "Metodología de la Investigación en Psicología I", correlativas: [] }
        ]
      },
      {
        nro: 2,
        materias: [
          { nombre: "Teología I", correlativas: [] },
          { nombre: "Estadística (Descriptiva y Muestral)", correlativas: [] },
          { nombre: "Psicología Experimental", correlativas: [] },
          { nombre: "Introducción al Psicodiagnóstico", correlativas: [] },
          { nombre: "Psicología Evolutiva y Cultura (Niño y Adolescente)", correlativas: [] },
          { nombre: "Sociología", correlativas: [] },
          { nombre: "Antropología Cultural", correlativas: [] }
        ]
      }
    ]
  }
  // Próximos años los voy agregando paso a paso cuando me digas "seguí con el año 2"
];

// --- estado (aprobadas) guardado en localStorage ---
let aprobadas = JSON.parse(localStorage.getItem('aprobadas_plan105')) || [];

// util
function estáAprobada(nombre){ return aprobadas.includes(nombre); }

// render
function render() {
  const app = document.getElementById('app');
  app.innerHTML = '';

  plan.forEach(year => {
    const contYear = document.createElement('section');
    contYear.className = 'año';
    const h = document.createElement('h2');
    h.textContent = `Año ${year.ano}`;
    contYear.appendChild(h);

    const semCont = document.createElement('div');
    semCont.className = 'semestre';

    year.semestres.forEach(sem => {
      const box = document.createElement('div');
      box.className = 'sem-box';
      const title = document.createElement('h3');
      title.textContent = `Semestre ${sem.nro}`;
      title.style.fontSize = '14px';
      title.style.margin = '0 0 8px 0';
      box.appendChild(title);

      sem.materias.forEach(m => {
        const card = document.createElement('div');
        card.className = 'materia';
        const name = document.createElement('div');
        name.className = 'name';
        name.textContent = m.nombre;

        const badge = document.createElement('div');
        badge.className = 'badge';
        badge.textContent = estáAprobada(m.nombre) ? 'Aprobada' : (m.correlativas.length ? 'C/ correlativas' : 'Libre');

        card.appendChild(name);
        card.appendChild(badge);

        // verificar si está bloqueada (tiene correlativas no aprobadas)
        const necesita = m.correlativas || [];
        const correOk = necesita.every(c => estáAprobada(c));
        if (!correOk && necesita.length > 0 && !estáAprobada(m.nombre)) {
          card.classList.add('bloqueada');
        }
        if (estáAprobada(m.nombre)) card.classList.add('aprobada');

        // click: marcar/desmarcar (si no está bloqueada)
        card.addEventListener('click', () => {
          if (!correOk && necesita.length > 0 && !estáAprobada(m.nombre)) {
            // bloqueada, no hace nada
            return;
          }
          if (estáAprobada(m.nombre)) {
            aprobadas = aprobadas.filter(a => a !== m.nombre);
          } else {
            aprobadas.push(m.nombre);
          }
          localStorage.setItem('aprobadas_plan105', JSON.stringify(aprobadas));
          actualizarStatus();
          render();
        });

        box.appendChild(card);
      });

      semCont.appendChild(box);
    });

    contYear.appendChild(semCont);
    app.appendChild(contYear);
  });
}

// status y reset
function actualizarStatus(){
  const s = document.getElementById('status');
  const total = plan.flatMap(y => y.semestres).flatMap(s => s.materias).length;
  s.textContent = `Progreso: ${aprobadas.length} / ${total} materias aprobadas`;
}

document.getElementById('resetBtn').addEventListener('click', () => {
  if (!confirm('¿Querés restablecer todo tu progreso?')) return;
  aprobadas = [];
  localStorage.removeItem('aprobadas_plan105');
  actualizarStatus();
  render();
});

// init
actualizarStatus();
render();
