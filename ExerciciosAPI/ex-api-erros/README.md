## Exercício

 A partir do seguinte trecho de código:
```javascript
app.put('/api/usuarios/:idUsuario, async (requisicao, resposta) => {
  try {
    const dados = requisicao.body
    const id = requisicao.params.idUsuario

    const encontrado = await TabelaDeUsuarios.pegarPorId(id)

    if (!encontrado) {
      throw new Error('Usuário não encontrado')
    }

    if (dados.nome.length === 0) {
      throw new Error('O campo "nome" está vazio')
    }

    const usuario = new Usuario(Object.assign({}, dados, { id: id }))
    await usuario.atualizar()
    resposta.end()
  } catch (erro) {
    resposta.send(JSON.stringify({ mensagem: erro.mensagem }))
  }
})
```
Identifique quais tipos de erros podem ser customizados e crie-os.
