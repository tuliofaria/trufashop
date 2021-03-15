require('dotenv').config({ path: '../.env.homologacao' })

const { v4 } = require('uuid')

const { GoogleSpreadsheet } = require('google-spreadsheet')
const credenciais = require('../credenciais.json')

const doc = new GoogleSpreadsheet(
  '1D4uaQW3oU1-TlLnD09G0ZRpGvxsksfK1cWkq1wi7LZY'
)

const saveOrder = async (order) => {
  await doc.useServiceAccountAuth({
    client_email: process.env.EMAIL_GOOGLE_API,
    private_key: credenciais.private_key,
  })
  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[1]
  const orderId = order.id
  const total = order.items.reduce((prev, curr) => {
    return prev + curr.price * curr.quantity
  }, 0)
  const rows = order.items.map((item) => {
    const row = {
      'Pedido:': orderId,
      'Nome cliente:': order.nome,
      'Telefone cliente:': order.telefone,
      Produto: item.name,
      Quantidade: item.quantity,
      'Valor unitário:': item.price,
      Subtotal: item.price * item.quantity,
      'Total pedido:': total,
      'Status:': 'Aguardando pagamento',
      'CPF:': order.cpf,
    }
    return row
  })

  await sheet.addRows(rows)
}

module.exports = {
  saveOrder,
}
