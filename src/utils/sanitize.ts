/**
 * Remove a estrutura DN do LDAP e retorna apenas os nomes limpos dos grupos.
 * Exemplo: "CN=ACESSO_VPN,OU=SERVICOS,DC=villefort..." -> "ACESSO_VPN"
 */
export function sanitizarGruposLDAP(gruposRaw: string | string[]): string[] {
  // 1. Garante que sempre teremos um array, mesmo se o LDAP retornar uma única string
  const listaGrupos = Array.isArray(gruposRaw) 
    ? gruposRaw 
    : [gruposRaw].filter(Boolean);

  return listaGrupos.map(grupoDn => {
    // Regex que busca o que está logo após "CN=" até encontrar a primeira vírgula ou fim da linha
    const match = grupoDn.match(/^CN=([^,]+)/i);
    
    // Se encontrar o padrão, retorna o nome limpo. Se não, retorna a string original como fallback.
    return match ? match[1].trim().toLowerCase() : grupoDn.trim().toLowerCase();
  });
}