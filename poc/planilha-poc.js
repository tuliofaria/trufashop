require('dotenv').config({ path: '../.env.homologacao' })

const fs = require('fs')
const { GoogleSpreadsheet } = require('google-spreadsheet')
const credenciais = require('./credenciais.json')

const doc = new GoogleSpreadsheet(
  '1D4uaQW3oU1-TlLnD09G0ZRpGvxsksfK1cWkq1wi7LZY'
)

const run = async () => {
  await doc.useServiceAccountAuth({
    client_email: process.env.EMAIL_GOOGLE_API,
    private_key: credenciais.private_key,
  })
  await doc.loadInfo()
  const sheet = doc.sheetsByIndex[1]
  await sheet.addRows([
    {
      'Pedido:': 123,
      'Nome cliente:': 'Tulio Faria POC',
      'Telefone cliente:': '55 66666666',
      Produto: 'Trufa x',
      Quantidade: 1,
      Subtotal: 5,
      'Total pedido:': 5,
      'Status:': 'Aguardando pagamento',
    },
  ])
}
run()
