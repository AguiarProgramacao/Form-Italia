const estados = {
  "SÃO PAULO": { certidao: 185, traducao: 120, apostilamento: 95 },
  "RIO DE JANEIRO": { certidao: 295, traducao: 120, apostilamento: 95 },
  "MINAS GERAIS": { certidao: 320, traducao: 120, apostilamento: 95 },
  "ESPIRITO SANTO": { certidao: 192, traducao: 120, apostilamento: 95 },
  "SANTA CATARINA": { certidao: 170, traducao: 120, apostilamento: 95 },
  "RIO GRANDE SUL": { certidao: 185, traducao: 120, apostilamento: 95 },
  PARANÁ: { certidao: 220, traducao: 120, apostilamento: 95 },
  "MATO GROSSO SUL": { certidao: 155, traducao: 120, apostilamento: 95 },
  GOIÁS: { certidao: 200, traducao: 120, apostilamento: 95 },
  "MATO GROSSO": { certidao: 195, traducao: 120, apostilamento: 95 },
  "DISTRITO FEDERAL": { certidao: 147, traducao: 120, apostilamento: 95 },
  TOCANTINS: { certidao: 163, traducao: 120, apostilamento: 95 },
  RORAIMA: { certidao: 159, traducao: 120, apostilamento: 95 },
  RONDÔNIA: { certidao: 315, traducao: 120, apostilamento: 95 },
  PARÁ: { certidao: 510, traducao: 120, apostilamento: 95 },
  AMAPÁ: { certidao: 213, traducao: 120, apostilamento: 95 },
  AMAZONAS: { certidao: 240, traducao: 120, apostilamento: 95 },
  ACRE: { certidao: 224, traducao: 120, apostilamento: 95 },
  ALAGOAS: { certidao: 173, traducao: 120, apostilamento: 95 },
  BAHIA: { certidao: 225, traducao: 120, apostilamento: 95 },
  CEARÁ: { certidao: 204, traducao: 120, apostilamento: 95 },
  MARANHÃO: { certidao: 198, traducao: 120, apostilamento: 95 },
  PARAÍBA: { certidao: 208, traducao: 120, apostilamento: 95 },
  PERNAMBUCO: { certidao: 182, traducao: 120, apostilamento: 95 },
  PIAUÍ: { certidao: 172, traducao: 120, apostilamento: 95 },
  "RIO GRANDE NORTE": { certidao: 244.78, traducao: 120, apostilamento: 95 },
  SERGIPE: { certidao: 185, traducao: 120, apostilamento: 95 },
};

let requerenteId = 0;

adicionarRequerente();

document
  .getElementById("add-requerente")
  .addEventListener("click", function () {
    adicionarRequerente();
  });

document.getElementById("calcular").addEventListener("click", function () {
  calcularTodosRequerentes();
});

function adicionarRequerente() {
  requerenteId++;

  const formHtml = `
    <div id="requerente-${requerenteId}" class="form-container">
      <h4>Requerente ${requerenteId}</h4>
      <label for="nome-${requerenteId}">Nome:</label>
      <input type="text" id="nome-${requerenteId}" name="nome" required>
      <div class="container-item">
        <div>
          <label for="estado-${requerenteId}">Estado:</label>
          <select id="estado-${requerenteId}" name="estado" required>
            <option value="">Estado</option>
            <option value="ACRE">Acre</option>
            <option value="ALAGOAS">Alagoas</option>
            <option value="AMAPÁ">Amapá</option>
            <option value="AMAZONAS">Amazonas</option>
            <option value="BAHIA">Bahia</option>
            <option value="CEARÁ">Ceará</option>
            <option value="DISTRITO FEDERAL">Distrito Federal</option>
            <option value="ESPIRITO SANTO">Espírito Santo</option>
            <option value="GOIÁS">Goiás</option>
            <option value="MARANHÃO">Maranhão</option>
            <option value="MATO GROSSO">Mato Grosso</option>
            <option value="MATO GROSSO SUL">Mato Grosso do Sul</option>
            <option value="MINAS GERAIS">Minas Gerais</option>
            <option value="PARANÁ">Paraná</option>
            <option value="PARÁ">Pará</option>
            <option value="PARAÍBA">Paraíba</option>
            <option value="PERNAMBUCO">Pernambuco</option>
            <option value="PIAUÍ">Piauí</option>
            <option value="RIO DE JANEIRO">Rio de Janeiro</option>
            <option value="RIO GRANDE NORTE">Rio Grande do Norte</option>
            <option value="RIO GRANDE SUL">Rio Grande do Sul</option>
            <option value="RONDÔNIA">Rondônia</option>
            <option value="RORAIMA">Roraima</option>
            <option value="SANTA CATARINA">Santa Catarina</option>
            <option value="SÃO PAULO">São Paulo</option>
            <option value="SERGIPE">Sergipe</option>
            <option value="TOCANTINS">Tocantins</option>
          </select>
        </div>
        <div>
          <label for="geracao-${requerenteId}">Geração:</label>
          <input type="number" id="geracao-${requerenteId}" name="geracao" min="1" required placeholder="Exemplo: 3 para trineto">
        </div>
      </div>
    </div>

    <hr />
  `;

  document
    .getElementById("requerentes-container")
    .insertAdjacentHTML("beforeend", formHtml);
}

function calcularTodosRequerentes() {
  const resultadosContainer = document.getElementById("resultados-container");
  resultadosContainer.innerHTML = "";

  for (let i = 1; i <= requerenteId; i++) {
    const estado = document.getElementById(`estado-${i}`).value;
    const geracao = parseInt(document.getElementById(`geracao-${i}`).value);

    if (!estado || isNaN(geracao) || geracao < 1) {
      alert(
        `Por favor, preencha todos os campos corretamente para o Requerente ${i}.`
      );
      continue;
    }

    const resultados = calcularDocumentosEValores(estado, geracao);

    const resultadoHTML = `
      <div>
        <h4>Resultados para Requerente ${i}</h4>
        <p>Quantidade de Documentos: ${resultados.qtdDocumentos}</p>
        <p>Valor Certidões: R$ ${resultados.valorCertidoes.toFixed(2)}</p>
        <p>Valor Traduções: R$ ${resultados.valorTraducoes.toFixed(2)}</p>
        <p>Valor Apostilamentos: R$ ${resultados.valorApostilamentos.toFixed(
          2
        )}</p>
        <p>Valor Total: R$ ${resultados.valorTotal.toFixed(2)}</p>
        <hr />
      </div>
    `;

    resultadosContainer.insertAdjacentHTML("beforeend", resultadoHTML);
  }
}

function calcularDocumentosEValores(estado, geracao) {
  const { certidao, traducao, apostilamento } = estados[estado];

  const valorDocumentosOriginais = 300;

  const documentosSubsequentes = (geracao - 1) * 2;
  const qtdDocumentos = 3 + documentosSubsequentes;

  const valorCertidoesSubsequentes = documentosSubsequentes * certidao;
  const valorTraducoes = qtdDocumentos * traducao;
  const valorApostilamentos = qtdDocumentos * 2 * apostilamento;

  const valorTotal =
    valorDocumentosOriginais +
    valorCertidoesSubsequentes +
    valorTraducoes +
    valorApostilamentos;

  return {
    qtdDocumentos,
    valorCertidoes: valorCertidoesSubsequentes + valorDocumentosOriginais,
    valorTraducoes,
    valorApostilamentos,
    valorTotal,
  };
}
