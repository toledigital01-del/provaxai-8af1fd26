/* Prova X — regras compartilhadas de gravação da base de conhecimento.
   Usado pelo console administrativo e pelos testes de integração. */
(function (root, factory) {
  var api = factory();
  if (typeof module !== 'undefined' && module.exports) module.exports = api;
  root.PXKB = api;
})(typeof globalThis !== 'undefined' ? globalThis : this, function () {
  function normalizar(v) {
    return typeof v === 'string' ? v.trim() : '';
  }

  /* Retorna a matéria válida (presente na lista oficial) ou string vazia. */
  function validarDisciplina(valor, lista) {
    var d = normalizar(valor);
    if (!d) return '';
    var ok = Array.isArray(lista) && lista.some(function (x) { return normalizar(x) === d; });
    return ok ? d : '';
  }

  /* Monta o registro de knowledge_docs. Lança erro em português se a matéria for inválida. */
  function montarDoc(opts) {
    var o = opts || {};
    var disciplina = validarDisciplina(o.disciplina, o.discList);
    if (!disciplina) throw new Error('Selecione uma matéria válida antes de salvar na base de conhecimento.');
    var topico = normalizar(o.topico);
    var conteudo = typeof o.conteudo === 'string' ? o.conteudo : '';
    return {
      course_slug: normalizar(o.courseSlug) || 'prf-2021',
      disciplina: disciplina,
      topico: topico || null,
      titulo: normalizar(o.titulo) || (topico || null),
      conteudo: conteudo,
      publicado: o.publicado !== false,
      updated_by: o.userId || null,
    };
  }

  /* Só publica aulas cuja matéria de origem continua sendo a matéria atual. */
  function filtrarAulasPublicaveis(aulas, disciplina, discList) {
    var d = validarDisciplina(disciplina, discList);
    if (!d) throw new Error('Selecione uma matéria válida antes de publicar.');
    return (aulas || []).filter(function (a) {
      return a && a.incluir !== false && normalizar(a.topico) && normalizar(a.conteudo) && normalizar(a.disciplina) === d;
    });
  }

  /* Documentos cuja matéria não existe mais no edital (órfãos). */
  function encontrarOrfaos(docs, discList) {
    return (docs || []).filter(function (d) { return !validarDisciplina(d && d.disciplina, discList); });
  }

  return {
    validarDisciplina: validarDisciplina,
    montarDoc: montarDoc,
    filtrarAulasPublicaveis: filtrarAulasPublicaveis,
    encontrarOrfaos: encontrarOrfaos,
  };
});
