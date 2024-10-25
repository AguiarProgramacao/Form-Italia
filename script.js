const estados = {
  "ACRE": { certidao: 224, traducao: 120, apostilamento: 95 },
  "ALAGOAS": { certidao: 173, traducao: 120, apostilamento: 95 },
  "AMAPÁ": { certidao: 213, traducao: 120, apostilamento: 95 },
  "AMAZONAS": { certidao: 240, traducao: 120, apostilamento: 95 },
  "BAHIA": { certidao: 225, traducao: 120, apostilamento: 95 },
  "CEARÁ": { certidao: 204, traducao: 120, apostilamento: 95 },
  "DISTRITO FEDERAL": { certidao: 147, traducao: 120, apostilamento: 95 },
  "ESPIRITO SANTO": { certidao: 192, traducao: 120, apostilamento: 95 },
  "GOIÁS": { certidao: 200, traducao: 120, apostilamento: 95 },
  "MARANHÃO": { certidao: 198, traducao: 120, apostilamento: 95 },
  "MATO GROSSO": { certidao: 195, traducao: 120, apostilamento: 95 },
  "MATO GROSSO DO SUL": { certidao: 155, traducao: 120, apostilamento: 95 },
  "MINAS GERAIS": { certidao: 320, traducao: 120, apostilamento: 95 },
  "PARÁ": { certidao: 510, traducao: 120, apostilamento: 95 },
  "PARAÍBA": { certidao: 208, traducao: 120, apostilamento: 95 },
  "PARANÁ": { certidao: 220, traducao: 120, apostilamento: 95 },
  "PERNAMBUCO": { certidao: 182, traducao: 120, apostilamento: 95 },
  "PIAUÍ": { certidao: 172, traducao: 120, apostilamento: 95 },
  "RIO DE JANEIRO": { certidao: 295, traducao: 120, apostilamento: 95 },
  "RIO GRANDE DO NORTE": { certidao: 244.78, traducao: 120, apostilamento: 95 },
  "RIO GRANDE DO SUL": { certidao: 185, traducao: 120, apostilamento: 95 },
  "RONDÔNIA": { certidao: 315, traducao: 120, apostilamento: 95 },
  "RORAIMA": { certidao: 159, traducao: 120, apostilamento: 95 },
  "SANTA CATARINA": { certidao: 170, traducao: 120, apostilamento: 95 },
  "SÃO PAULO": { certidao: 185, traducao: 120, apostilamento: 95 },
  "SERGIPE": { certidao: 185, traducao: 120, apostilamento: 95 },
  "TOCANTINS": { certidao: 163, traducao: 120, apostilamento: 95 }
};

let requerenteId = 0;
let compartilhadoId = 0;

adicionarRequerente();
adicionarCompartilhado();

document.getElementById("add-requerente").addEventListener("click", adicionarRequerente);
document.getElementById("add-compartilhado").addEventListener("click", adicionarCompartilhado);

document.getElementById("calcular").addEventListener("click", async function () {
  const cotacaoEuro = await obterCotacaoEuro();
  if (!cotacaoEuro) {
    alert("Não foi possível obter a cotação do Euro. Tente novamente mais tarde.");
    return;
  }
  calcularTodosRequerentes(cotacaoEuro);
});

async function obterCotacaoEuro() {
  try {
    const response = await fetch("https://api.exchangerate-api.com/v4/latest/EUR");
    const data = await response.json();
    return data.rates.BRL;
  } catch (error) {
    console.error("Erro ao obter a cotação do Euro:", error);
    return null;
  }
}

function adicionarRequerente() {
  requerenteId++;
  const formHtml = `
    <div id="requerente-${requerenteId}" class="form-container">
      <h4>Requerente ${requerenteId}</h4>
      <label for="nome-${requerenteId}">Nome:</label>
      <input type="text" id="nome-${requerenteId}" required>
      <label for="estado-${requerenteId}">Estado:</label>
      <select id="estado-${requerenteId}" required>
        <option value="">Selecione um Estado</option>
        ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
      </select>
      <label for="estado-civil-${requerenteId}">Estado Civil:</label>
      <select id="estado-civil-${requerenteId}" required onchange="atualizarEstadoCasamento(${requerenteId})">
        <option value="solteiro">Solteiro(a)</option>
        <option value="casado">Casado(a)</option>
      </select>
      <div id="estado-casamento-container-${requerenteId}" style="display: none;">
        <label for="estado-casamento-${requerenteId}">Estado do Casamento:</label>
        <select id="estado-casamento-${requerenteId}">
          <option value="">Selecione um Estado</option>
          ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
        </select>
      </div>
      <div id="filhos-container-${requerenteId}" class="filhos-container"></div>
      <button type="button" id="filhoButton add-filho-${requerenteId}" onclick="adicionarFilho(${requerenteId})">Adicionar Filho</button>
    </div><hr />`;
  
  document.getElementById("requerentes-container").insertAdjacentHTML("beforeend", formHtml);
}

function adicionarFilho(requerenteId) {
  const filhosContainer = document.getElementById(`filhos-container-${requerenteId}`);
  const filhoId = filhosContainer.childElementCount + 1; // Contar filhos existentes para ID

  const filhoHtml = `
    <div id="filho-${requerenteId}-${filhoId}" class="filho-container">
      <h5>Filho ${filhoId}</h5>
      <label for="estado-filho-${requerenteId}-${filhoId}">Estado de Nascimento:</label>
      <select id="estado-filho-${requerenteId}-${filhoId}" required>
        <option value="">Selecione um Estado</option>
        ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
      </select>
    </div>`;
  
  filhosContainer.insertAdjacentHTML("beforeend", filhoHtml);
}

function atualizarEstadoCasamento(requerenteId) {
  const estadoCivil = document.getElementById(`estado-civil-${requerenteId}`).value;
  const estadoCasamentoContainer = document.getElementById(`estado-casamento-container-${requerenteId}`);
  estadoCasamentoContainer.style.display = estadoCivil === "casado" ? "block" : "none";
}

function adicionarCompartilhado() {
  compartilhadoId++;
  const formHtml = `
    <div id="compartilhado-${compartilhadoId}" class="form-container">
      <h4>Compartilhado ${compartilhadoId}</h4>
      <label for="nome-compartilhado-${compartilhadoId}">Nome:</label>
      <input type="text" id="nome-compartilhado-${compartilhadoId}" required>
      <label for="estado-compartilhado-${compartilhadoId}">Estado:</label>
      <select id="estado-compartilhado-${compartilhadoId}" required>
        <option value="">Selecione um Estado</option>
        ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
      </select>
    </div><hr />`;
  document.getElementById("compartilhados-container").insertAdjacentHTML("beforeend", formHtml);
}

function calcularTodosRequerentes(cotacaoEuro) {
  const resultadosContainer = document.getElementById("resultados-container");
  resultadosContainer.innerHTML = "";

  const compartilhado = calcularCompartilhado(cotacaoEuro);
  const valorCompartilhadoPorRequerente = compartilhado.totalCompartilhado / Math.max(requerenteId, 1);

  resultadosContainer.insertAdjacentHTML("beforeend", formatarResultadoCompartilhado(compartilhado));

  for (let i = 1; i <= requerenteId; i++) {
    const estado = document.getElementById(`estado-${i}`)?.value;
    const estadoCivil = document.getElementById(`estado-civil-${i}`)?.value;
    const estadoCasamento = document.getElementById(`estado-casamento-${i}`)?.value || null;
    const quantidadeFilhos = document.getElementById(`filhos-container-${i}`)?.childElementCount || 0;

    if (!estado || !estadoCivil || (estadoCivil === "casado" && !estadoCasamento)) {
      alert(`Preencha todos os campos do Requerente ${i}.`);
      continue;
    }

    const resultadoRequerente = calcularRequerente(estado, estadoCasamento, estadoCivil, quantidadeFilhos);
    resultadosContainer.insertAdjacentHTML(
      "beforeend",
      formatarResultadoRequerente(i, resultadoRequerente, valorCompartilhadoPorRequerente)
    );
  }
}

function calcularCompartilhado(cotacaoEuro) {
  let totalCertidoes = 0, totalTraducoes = 0, totalApostilamentos = 0;

  for (let i = 1; i <= compartilhadoId; i++) {
    const estado = document.getElementById(`estado-compartilhado-${i}`).value;

    if (!estado) {
      alert(`Preencha todos os campos do Compartilhado ${i}.`);
      continue;
    }

    const { certidao, traducao, apostilamento } = estados[estado];

    totalCertidoes += 2 * certidao;
    totalTraducoes += 2 * traducao;
    totalApostilamentos += 4 * apostilamento;
  }

  const valorCertidaoItaliana = 100 * cotacaoEuro;
  const totalCompartilhado = totalCertidoes + totalTraducoes + totalApostilamentos + valorCertidaoItaliana;

  return { 
    valorCertidoes: totalCertidoes, 
    valorTraducoes: totalTraducoes, 
    valorApostilamentos: totalApostilamentos, 
    valorCertidaoItaliana, 
    totalCompartilhado 
  };
}

function calcularRequerente(estado, estadoCasamento, estadoCivil, quantidadeFilhos) {
  let totalCertidoes = 0, totalTraducoes = 0, totalApostilamentos = 0;

  // Valores iniciais para o requerente
  const { certidao, traducao, apostilamento } = estados[estado] || {};
  totalCertidoes += certidao || 0;
  totalTraducoes += traducao || 0;
  totalApostilamentos += 2 * (apostilamento || 0);

  // Adicionar documentos do casamento se houver
  if (estadoCivil === "casado" && estadoCasamento) {
    const { certidao: certCas, traducao: tradCas, apostilamento: aposCas } = estados[estadoCasamento] || {};
    totalCertidoes += certCas || 0;
    totalTraducoes += tradCas || 0;
    totalApostilamentos += 2 * (aposCas || 0);
  }

  // Adicionar documentos para cada filho, se houver
  for (let i = 1; i <= quantidadeFilhos; i++) {
    const estadoFilho = document.getElementById(`estado-filho-${requerenteId}-${i}`)?.value;
    if (estadoFilho) {
      const { certidao: certFilho, traducao: tradFilho, apostilamento: aposFilho } = estados[estadoFilho] || {};
      totalCertidoes += certFilho || 0;
      totalTraducoes += tradFilho || 0;
      totalApostilamentos += 2 * (aposFilho || 0);
    }
  }

  return {
    valorCertidoes: totalCertidoes,
    valorTraducoes: totalTraducoes,
    valorApostilamentos: totalApostilamentos,
    totalRequerente: totalCertidoes + totalTraducoes + totalApostilamentos,
  };
}

function formatarResultadoRequerente(id, resultado, valorCompartilhadoPorRequerente) {
  const totalComCompartilhado = resultado.totalRequerente + valorCompartilhadoPorRequerente;

  return `
    <div>
      <h5>Requerente ${id}</h5>
      <p>Valor Compartilhado: R$ ${valorCompartilhadoPorRequerente.toFixed(2)}</p>
      <p>Valor Certidões Requerente: R$ ${resultado.valorCertidoes.toFixed(2)}</p>
      <p>Valor Traduções: R$ ${resultado.valorTraducoes.toFixed(2)}</p>
      <p>Valor Apostilamentos: R$ ${resultado.valorApostilamentos.toFixed(2)}</p>
      <p><strong>Valor Total com Compartilhado: R$ ${totalComCompartilhado.toFixed(2)}</strong></p>
    </div>
    <hr/>
  `;
}

function formatarResultadoCompartilhado(compartilhado) {
  return `
    <div>
      <h5>Compartilhado</h5>
      <p>Valor Certidão Italiana: R$ ${compartilhado.valorCertidaoItaliana.toFixed(2)}</p>
      <p>Valor Certidões Brasileiras: R$ ${compartilhado.valorCertidoes.toFixed(2)}</p>
      <p>Valor Traduções: R$ ${compartilhado.valorTraducoes.toFixed(2)}</p>
      <p>Valor Apostilamentos: R$ ${compartilhado.valorApostilamentos.toFixed(2)}</p>
      <p>Total Compartilhado: R$ ${compartilhado.totalCompartilhado.toFixed(2)}</p>
    </div>
    <hr/>
  `;
}