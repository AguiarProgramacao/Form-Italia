const estados = {
  "SÃO PAULO": { certidao: 185, traducao: 120, apostilamento: 95 },
  "RIO DE JANEIRO": { certidao: 295, traducao: 120, apostilamento: 95 },
  "MINAS GERAIS": { certidao: 320, traducao: 120, apostilamento: 95 },
  "ESPIRITO SANTO": { certidao: 192, traducao: 120, apostilamento: 95 },
  "SANTA CATARINA": { certidao: 170, traducao: 120, apostilamento: 95 },
  "RIO GRANDE SUL": { certidao: 185, traducao: 120, apostilamento: 95 },
  "PARANÁ": { certidao: 220, traducao: 120, apostilamento: 95 },
  "MATO GROSSO SUL": { certidao: 155, traducao: 120, apostilamento: 95 },
  "GOIÁS": { certidao: 200, traducao: 120, apostilamento: 95 },
  "MATO GROSSO": { certidao: 195, traducao: 120, apostilamento: 95 },
  "DISTRITO FEDERAL": { certidao: 147, traducao: 120, apostilamento: 95 },
  "TOCANTIS": { certidao: 163, traducao: 120, apostilamento: 95 },
  "RORAIMA": { certidao: 159, traducao: 120, apostilamento: 95 },
  "RONDONIA": { certidao: 315, traducao: 120, apostilamento: 95 },
  "PARÁ": { certidao: 510, traducao: 120, apostilamento: 95 },
  "AMAPÁ": { certidao: 213, traducao: 120, apostilamento: 95 },
  "AMAZONAS": { certidao: 240, traducao: 120, apostilamento: 95 },
  "ACRE": { certidao: 224, traducao: 120, apostilamento: 95 },
  "ALAGOAS": { certidao: 173, traducao: 120, apostilamento: 95 },
  "BAHIA": { certidao: 225, traducao: 120, apostilamento: 95 },
  "CEARÁ": { certidao: 204, traducao: 120, apostilamento: 95 },
  "MARANHÃO": { certidao: 198, traducao: 120, apostilamento: 95 },
  "PARAIBA": { certidao: 208, traducao: 120, apostilamento: 95 },
  "PERNAMBUCO": { certidao: 182, traducao: 120, apostilamento: 95 },
  "PIAUI": { certidao: 172, traducao: 120, apostilamento: 95 },
  "RIO GRANDE NORTE": { certidao: 244.78, traducao: 120, apostilamento: 95 },
  "SERGIPE": { certidao: 185, traducao: 120, apostilamento: 95 }
};

document.getElementById("form-calc").addEventListener("submit", function(event) {
  event.preventDefault();

  const nome = document.getElementById("nome").value;
  const estado = document.getElementById("estado").value;
  const geracao = parseInt(document.getElementById("geracao").value);

  if (!estado || isNaN(geracao) || geracao < 1) {
    alert("Por favor, preencha todos os campos corretamente.");
    return;
  }

  const resultados = calcularDocumentosEValores(estado, geracao);

  document.getElementById("qtd-docs").textContent = resultados.qtdDocumentos;
  document.getElementById("valor-certidoes").textContent = formatBRL(resultados.valorCertidoes);
  document.getElementById("valor-traducoes").textContent = formatBRL(resultados.valorTraducoes);
  document.getElementById("valor-apostilamentos").textContent = formatBRL(resultados.valorApostilamentos);
  document.getElementById("valor-total").textContent = formatBRL(resultados.valorTotal);
});

function calcularDocumentosEValores(estado, geracao) {
  const { certidao, traducao, apostilamento } = estados[estado];
  const valorDocumento = certidao + traducao + (2 * apostilamento);

  const documentosOriginal = 3;

  const documentosSubsequentes = (geracao - 1) * 2;

  const qtdDocumentos = documentosOriginal + documentosSubsequentes;

  const valorCertidoes = qtdDocumentos * certidao;
  const valorTraducoes = qtdDocumentos * traducao;
  const valorApostilamentos = qtdDocumentos * 2 * apostilamento;

  const valorTotal = valorCertidoes + valorTraducoes + valorApostilamentos;

  return {
    qtdDocumentos,
    valorCertidoes,
    valorTraducoes,
    valorApostilamentos,
    valorTotal
  };
}

function formatBRL(value) {
  return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}
