const estados = {
  "ITALIA": {certidao: 100, traducao: 0, apostilamento: 0},
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
    const response = await fetch(
      "https://economia.awesomeapi.com.br/json/last/EUR-BRL"
    );
    const data = await response.json();
    return data.EURBRL.bid;
  } catch (error) {
    console.error("Erro ao obter a cotação do Euro:", error);
    return null;
  }
}

function adicionarRequerente() {
  requerenteId++;
  const formHtml = `
    <div id="requerente-container-${requerenteId}">
      <div id="requerente-${requerenteId}" class="form-container">
        <h4>Requerente ${requerenteId}</h4>
        <label for="nome-${requerenteId}">Nome:</label>
        <input type="text" id="nome-${requerenteId}" required>
        <label for="estado-${requerenteId}">Localidade:</label>
        <select id="estado-${requerenteId}" required>
          <option value="">Selecione uma localidade</option>
          ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
        </select>
        <label for="estado-civil-${requerenteId}">Estado Civil:</label>
        <select id="estado-civil-${requerenteId}" required onchange="atualizarEstadoCasamento(${requerenteId})">
          <option value="solteiro">Solteiro(a)</option>
          <option value="casado">Casado(a)</option>
          <option value="divorcioJudicial">Divórcio Judicial</option>
          <option value="divorcioAdministrativo">Divórcio Administrativo</option>
        </select>
        <div id="estado-casamento-container-${requerenteId}" style="display: none;">
          <label for="estado-casamento-${requerenteId}">Localidade:</label>
          <select id="estado-casamento-${requerenteId}">
            <option value="">Selecione uma Localidade</option>
            ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
          </select>
        </div>
        <div id="filhos-container-${requerenteId}" class="filhos-container"></div>
        <button type="button" id="add-filho-${requerenteId}" onclick="adicionarFilho(${requerenteId})">Adicionar Filho</button>
        <button class="button-remove" onclick="removerRequerente(${requerenteId})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <hr />
    </div>`;

  document.getElementById("requerentes-container").insertAdjacentHTML("beforeend", formHtml);
}

function removerRequerente(id) {
  const container = document.getElementById(`requerente-container-${id}`);
  if (container) {
    container.remove();
    atualizarNumeracao("requerentes-container", "Requerente");
    requerenteId--;
  }
}

function adicionarFilho(requerenteId) {
  const filhosContainer = document.getElementById(`filhos-container-${requerenteId}`);
  const filhoId = filhosContainer.childElementCount + 1;

  const filhoHtml = `
    <div id="filho-${requerenteId}-${filhoId}" class="filho-container">
      <h5>Filho ${filhoId}</h5>
      <label for="estado-filho-${requerenteId}-${filhoId}">Localidade do Nascimento:</label>
      <select id="estado-filho-${requerenteId}-${filhoId}" required>
        <option value="">Selecione uma localidade</option>
        ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
      </select>
    </div>`;

  filhosContainer.insertAdjacentHTML("beforeend", filhoHtml);
}

function atualizarEstadoCasamento(requerenteId) {
  const estadoCivil = document.getElementById(`estado-civil-${requerenteId}`).value;
  const estadoCasamentoContainer = document.getElementById(`estado-casamento-container-${requerenteId}`);

  estadoCasamentoContainer.style.display = (estadoCivil === "casado" || estadoCivil === "divorcioJudicial" || estadoCivil === "divorcioAdministrativo") 
    ? "block" 
    : "none";
}

function adicionarCompartilhado() {
  compartilhadoId++;
  const formHtml = `
    <div id="compartilhado-container-${compartilhadoId}">
      <div id="compartilhado-${compartilhadoId}" class="form-container">
        <h4>Compartilhado ${compartilhadoId}</h4>
        <label for="nome-compartilhado-${compartilhadoId}">Nome:</label>
        <input type="text" id="nome-compartilhado-${compartilhadoId}" required>
        
        <label for="estado-compartilhado-${compartilhadoId}">Localidade:</label>
        <select id="estado-compartilhado-${compartilhadoId}" required>
          <option value="">Selecione uma localidade</option>
          ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
        </select>
        
        <label for="estado-civil-compartilhado-${compartilhadoId}">Estado Civil:</label>
        <select id="estado-civil-compartilhado-${compartilhadoId}" required onchange="atualizarEstadoCasamentoCompartilhado(${compartilhadoId})">
          <option value="solteiro">Solteiro(a)</option>
          <option value="casado">Casado(a)</option>
          <option value="divorcioJudicial">Divórcio Judicial</option>
          <option value="divorcioAdministrativo">Divórcio Administrativo</option>
        </select>
        
        <div id="estado-casamento-container-compartilhado-${compartilhadoId}" style="display: none;">
          <label for="estado-casamento-compartilhado-${compartilhadoId}">Localidade do Casamento:</label>
          <select id="estado-casamento-compartilhado-${compartilhadoId}">
            <option value="">Selecione uma Localidade</option>
            ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
          </select>
        </div>
        
        <label for="procuracoes-compartilhado-${compartilhadoId}">Procurações:</label>
        <input type="number" id="procuracoes-compartilhado-${compartilhadoId}" value="0" min="0">
        
        <button class="button-remove" onclick="removerCompartilhado(${compartilhadoId})">
          <i class="fa-solid fa-trash"></i>
        </button>
      </div>
      <hr />
    </div>`;

  document.getElementById("compartilhados-container").insertAdjacentHTML("beforeend", formHtml);
}

function atualizarEstadoCasamentoCompartilhado(compartilhadoId) {
  const estadoCivil = document.getElementById(`estado-civil-compartilhado-${compartilhadoId}`).value;
  const estadoCasamentoContainer = document.getElementById(`estado-casamento-container-compartilhado-${compartilhadoId}`);

  estadoCasamentoContainer.style.display = (estadoCivil === "casado" || estadoCivil === "divorcioJudicial" || estadoCivil === "divorcioAdministrativo") 
    ? "block" 
    : "none";
}

function removerCompartilhado(id) {
  const container = document.getElementById(`compartilhado-container-${id}`);
  if (container) {
    container.remove();
    atualizarNumeracao("compartilhados-container", "Compartilhado");
    compartilhadoId--;
  }
}

function atualizarNumeracao(containerId, tipo) {
  const container = document.getElementById(containerId);
  const itens = container.querySelectorAll(".form-container");

  itens.forEach((item, index) => {
    const titulo = item.querySelector("h4");
    if (titulo) titulo.textContent = `${tipo} ${index + 1}`;
  });
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

    const resultadoRequerente = calcularRequerente(estado, estadoCasamento, estadoCivil, quantidadeFilhos, i);
    resultadosContainer.insertAdjacentHTML(
      "beforeend",
      formatarResultadoRequerente(i, resultadoRequerente, valorCompartilhadoPorRequerente)
    );
  }
}

function calcularCompartilhado(cotacaoEuro) {
  const valorCNNTraducao = 120;
  const valorCNNApostilamento = 2 * 95;
  let totalCertidoesNascimento = 0;
  let totalCertidoesCasamento = 0;
  let totalTraducoes = valorCNNTraducao;
  let totalApostilamentos = valorCNNApostilamento;
  let valorCertidaoNascimentoItaliana = 0;
  let valorCertidaoCasamentoItaliana = 0;

  for (let i = 1; i <= compartilhadoId; i++) {
    const estado = document.getElementById(`estado-compartilhado-${i}`).value;
    const estadoCivil = document.getElementById(`estado-civil-compartilhado-${i}`).value;
    const estadoCasamento = document.getElementById(`estado-casamento-compartilhado-${i}`)?.value;
    const procurações = parseInt(document.getElementById(`procuracoes-compartilhado-${i}`).value) || 0;

    const multiplicador = procurações > 0 ? procurações + 1 : 1;

    if (estado === "ITALIA") { 
      valorCertidaoNascimentoItaliana += estados[estado].certidao * cotacaoEuro;
    } else {
      const { certidao, traducao, apostilamento } = estados[estado] || {};
      totalCertidoesNascimento += certidao || 0;
      totalTraducoes += (traducao || 0) * multiplicador;
      totalApostilamentos += 2 * (apostilamento || 0) * multiplicador;
    }

    if (estadoCivil === "casado" && estadoCasamento) {
      if (estadoCasamento === "ITALIA") {
        valorCertidaoCasamentoItaliana += estados[estadoCasamento].certidao * cotacaoEuro;
      } else {
        const { certidao: certCas, traducao: tradCas, apostilamento: aposCas } = estados[estadoCasamento] || {};
        totalCertidoesCasamento += certCas || 0;
        totalTraducoes += (tradCas || 0) * multiplicador;
        totalApostilamentos += 2 * (aposCas || 0) * multiplicador;
      }
    } else if (estadoCivil === "divorcioJudicial" || estadoCivil === "divorcioAdministrativo") {
      const multiplicadorDiv = estadoCivil === "divorcioJudicial" ? 4 : 2;
      const { certidao: certDiv, traducao: tradDiv, apostilamento: aposDiv } = estados[estadoCasamento] || {};
      totalCertidoesCasamento += multiplicadorDiv * (certDiv || 0);
      totalTraducoes += multiplicadorDiv * (tradDiv || 0) * multiplicador;
      totalApostilamentos += multiplicadorDiv * 2 * (aposDiv || 0) * multiplicador;
    }
  }

  const totalCompartilhado = totalCertidoesNascimento + totalCertidoesCasamento + totalTraducoes + totalApostilamentos + valorCertidaoNascimentoItaliana + valorCertidaoCasamentoItaliana;

  return { 
    valorCertidoesNascimento: totalCertidoesNascimento, 
    valorCertidoesCasamento: totalCertidoesCasamento, 
    valorTraducoes: totalTraducoes, 
    valorApostilamentos: totalApostilamentos, 
    valorCertidaoNascimentoItaliana,
    valorCertidaoCasamentoItaliana,
    totalCompartilhado 
  };
}

function calcularRequerente(estado, estadoCasamento, estadoCivil, quantidadeFilhos, requerenteId) {
  let totalCertidoesNascimento = 0;
  let totalCertidoesCasamento = 0;
  let totalTraducoes = 0;
  let totalApostilamentos = 0;

  const { certidao: certNascimento, traducao, apostilamento } = estados[estado] || {};
  
  totalCertidoesNascimento += certNascimento || 0;
  totalTraducoes += traducao || 0;
  totalApostilamentos += 2 * (apostilamento || 0);

  if (estadoCivil === "casado" && estadoCasamento) {
    const { certidao: certCas, traducao: tradCas, apostilamento: aposCas } = estados[estadoCasamento] || {};
    totalCertidoesCasamento += certCas || 0;
    totalTraducoes += tradCas || 0;
    totalApostilamentos += 2 * (aposCas || 0);
  } else if (estadoCivil === "divorcioJudicial") {
    const { certidao: certDivorcio, traducao: tradDivorcio, apostilamento: aposDivorcio } = estados[estadoCasamento] || {};
    totalCertidoesCasamento += 4 * (certDivorcio || 0);
    totalTraducoes += 4 * (tradDivorcio || 0);
    totalApostilamentos += 8 * (aposDivorcio || 0);
  } else if (estadoCivil === "divorcioAdministrativo") {
    const { certidao: certDivorcioAdm, traducao: tradDivorcioAdm, apostilamento: aposDivorcioAdm } = estados[estadoCasamento] || {};
    totalCertidoesCasamento += 2 * (certDivorcioAdm || 0);
    totalTraducoes += 2 * (tradDivorcioAdm || 0);
    totalApostilamentos += 4 * (aposDivorcioAdm || 0);
  }

  for (let i = 1; i <= quantidadeFilhos; i++) {
    const estadoFilho = document.getElementById(`estado-filho-${requerenteId}-${i}`)?.value;
    if (estadoFilho) {
      const { certidao: certFilho, traducao: tradFilho, apostilamento: aposFilho } = estados[estadoFilho] || {};
      totalCertidoesNascimento += certFilho || 0;
      totalTraducoes += tradFilho || 0;
      totalApostilamentos += 2 * (aposFilho || 0);
    }
  }

  const totalRequerente = totalCertidoesNascimento + totalCertidoesCasamento + totalTraducoes + totalApostilamentos;

  return {
    valorCertidoesNascimento: totalCertidoesNascimento,
    valorCertidoesCasamento: totalCertidoesCasamento,
    valorTraducoes: totalTraducoes,
    valorApostilamentos: totalApostilamentos,
    totalRequerente: totalRequerente,
  };
}

function formatarResultadoRequerente(id, resultado, valorCompartilhadoPorRequerente) {
  const nomeRequerente = document.getElementById(`nome-${id}`).value || `Requerente ${id}`;

  const totalComCompartilhado = resultado.totalRequerente + valorCompartilhadoPorRequerente;

  return `
    <div>
      <h3>${nomeRequerente}</h3>
      <p>Valor Compartilhado: R$ ${valorCompartilhadoPorRequerente.toFixed(2)}</p>
      <p>Valor Certidões Nascimentos: R$ ${resultado.valorCertidoesNascimento.toFixed(2)}</p>
      <p>Certidão Casamento/Divórcio: R$ ${resultado.valorCertidoesCasamento.toFixed(2)}</p>
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
      ${compartilhado.valorCertidaoNascimentoItaliana ? `<p>Certidão Nascimento Italiano: R$ ${compartilhado.valorCertidaoNascimentoItaliana.toFixed(2)}</p>` : ""}
      ${compartilhado.valorCertidaoCasamentoItaliana ? `<p>Certidão Casamento Italiano: R$ ${compartilhado.valorCertidaoCasamentoItaliana.toFixed(2)}</p>` : ""}
      <p>Valor Certidões Nascimento Brasileiras: R$ ${compartilhado.valorCertidoesNascimento.toFixed(2)}</p>
      <p>Certidão Casamento/Divórcio: R$ ${compartilhado.valorCertidoesCasamento.toFixed(2)}</p>
      <p>Valor Traduções: R$ ${compartilhado.valorTraducoes.toFixed(2)}</p>
      <p>Valor Apostilamentos: R$ ${compartilhado.valorApostilamentos.toFixed(2)}</p>
      <p><strong>Total Compartilhado: R$ ${compartilhado.totalCompartilhado.toFixed(2)}</strong></p>
    </div>
    <hr/>
  `;
}