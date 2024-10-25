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

// Listeners para adicionar mais requerentes ou compartilhados
document.getElementById("add-requerente").addEventListener("click", adicionarRequerente);
document.getElementById("add-compartilhado").addEventListener("click", adicionarCompartilhado);

// Listener para calcular todos os requerentes
document.getElementById("calcular").addEventListener("click", async function () {
  const cotacaoEuro = await obterCotacaoEuro();
  if (!cotacaoEuro) {
    alert("Não foi possível obter a cotação do Euro. Tente novamente mais tarde.");
    return;
  }
  calcularTodosRequerentes(cotacaoEuro);
});

// Função para obter a cotação do Euro
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

// Função para adicionar um novo requerente
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
    </div><hr />`;
  document.getElementById("requerentes-container").insertAdjacentHTML("beforeend", formHtml);
}

// Função para adicionar um novo compartilhado
function adicionarCompartilhado() {
  compartilhadoId++;
  const formHtml = `
    <div id="compartilhado-${compartilhadoId}" class="form-container">
      <h4>Compartilhado ${compartilhadoId}</h4>
      <label for="nome-compartilhado-${compartilhadoId}">Nome:</label>
      <input type="text" id="nome-compartilhado-${compartilhadoId}" required>

      <div class="select">
        <label for="estado-compartilhado-${compartilhadoId}">Estado:</label>
        <select id="estado-compartilhado-${compartilhadoId}" required>
          <option value="">Selecione um Estado</option>
          ${Object.keys(estados).map(estado => `<option value="${estado}">${estado}</option>`).join('')}
        </select>
      </div>
    </div><hr />`;
  document.getElementById("compartilhados-container").insertAdjacentHTML("beforeend", formHtml);
}

// Função para calcular todos os requerentes
function calcularTodosRequerentes(cotacaoEuro) {
  const resultadosContainer = document.getElementById("resultados-container");
  resultadosContainer.innerHTML = ""; // Limpar resultados anteriores

  // Calcula e exibe os valores compartilhados
  const compartilhado = calcularCompartilhado(cotacaoEuro);
  resultadosContainer.insertAdjacentHTML("beforeend", formatarResultadoCompartilhado(compartilhado));

  // Divide o valor compartilhado pelo número de requerentes
  const valorCompartilhadoPorRequerente = compartilhado.totalCompartilhado / requerenteId;

  // Itera sobre todos os requerentes e exibe os resultados
  for (let i = 1; i <= requerenteId; i++) {
    const estado = document.getElementById(`estado-${i}`).value;

    if (!estado) {
      alert(`Preencha todos os campos do Requerente ${i}.`);
      continue;
    }

    const resultadoRequerente = calcularRequerente(estado);
    resultadosContainer.insertAdjacentHTML(
      "beforeend", 
      formatarResultadoRequerente(i, resultadoRequerente, valorCompartilhadoPorRequerente)
    );
  }
}

// Função para calcular os valores compartilhados
function calcularCompartilhado(cotacaoEuro) {
  let totalCertidoes = 0, totalTraducoes = 0, totalApostilamentos = 0;

  // Itera sobre todos os compartilhados para calcular os valores de acordo com o estado
  for (let i = 1; i <= compartilhadoId; i++) {
    const estado = document.getElementById(`estado-compartilhado-${i}`).value;

    if (!estado) {
      alert(`Preencha todos os campos do Compartilhado ${i}.`);
      continue;
    }

    const { certidao, traducao, apostilamento } = estados[estado];

    totalCertidoes += 2 * certidao; // 2 certidões por compartilhado
    totalTraducoes += 2 * traducao; // 2 traduções por compartilhado
    totalApostilamentos += 4 * apostilamento; // 4 apostilamentos por compartilhado
  }

  const valorCertidaoItaliana = 100 * cotacaoEuro; // Valor fixo da certidão italiana
  const totalCompartilhado = totalCertidoes + totalTraducoes + totalApostilamentos + valorCertidaoItaliana;

  return { 
    valorCertidoes: totalCertidoes, 
    valorTraducoes: totalTraducoes, 
    valorApostilamentos: totalApostilamentos, 
    valorCertidaoItaliana, 
    totalCompartilhado 
  };
}

// Função para calcular o custo de cada requerente sem a certidão italiana
function calcularRequerente(estado) {
  const { certidao, traducao, apostilamento } = estados[estado];

  const valorCertidoes = 2 * certidao; // 2 certidões
  const valorTraducoes = 2 * traducao; // 2 traduções
  const valorApostilamentos = 4 * apostilamento; // 4 apostilamentos

  const total = valorCertidoes + valorTraducoes + valorApostilamentos;

  return { valorCertidoes, valorTraducoes, valorApostilamentos, total };
}

// Função para exibir os valores compartilhados
function formatarResultadoCompartilhado(compartilhado) {
  return `
    <div class="compartilhado-container">
      <h4>Valores Compartilhados</h4>
      <p>Valor Certidões Brasileiras: R$ ${compartilhado.valorCertidoes.toFixed(2)}</p>
      <p>Valor Traduções: R$ ${compartilhado.valorTraducoes.toFixed(2)}</p>
      <p>Valor Apostilamentos: R$ ${compartilhado.valorApostilamentos.toFixed(2)}</p>
      <p>Valor Certidão Italiana: R$ ${compartilhado.valorCertidaoItaliana.toFixed(2)}</p>
      <p><strong>Total Compartilhado:</strong> R$ ${compartilhado.totalCompartilhado.toFixed(2)}</p>
      <hr />
    </div>`;
}

// Função para exibir os resultados de cada requerente
function formatarResultadoRequerente(id, resultado, valorCompartilhadoPorRequerente) {
  return `
    <div class="requerente-container">
      <h4>Requerente ${id}</h4>
      <p>Valor Certidões Compartilhadas: R$ ${valorCompartilhadoPorRequerente.toFixed(2)}</p>
      <p>Valor Certidões Brasileiras: R$ ${resultado.valorCertidoes.toFixed(2)}</p>
      <p>Valor Traduções: R$ ${resultado.valorTraducoes.toFixed(2)}</p>
      <p>Valor Apostilamentos: R$ ${resultado.valorApostilamentos.toFixed(2)}</p>
      <p><strong>Valor Total:</strong> R$ ${(resultado.total + valorCompartilhadoPorRequerente).toFixed(2)}</p>
      <hr />
    </div>`;
}