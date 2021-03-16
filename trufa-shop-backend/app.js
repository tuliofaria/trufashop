const express = require('express')
const cors = require('cors')
const { saveOrder, updateOrder } = require('./lib/spreadsheet')
const { createPixCharge } = require('./lib/pix')

const app = express()

app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send({ ok: true })
})
app.post('/create-order', async (req, res) => {
  const pixCharge = await createPixCharge(req.body)
  const { qrcode, cobranca } = pixCharge
  await saveOrder({ ...req.body, id: cobranca.txid })
  res.send({ ok: 1, qrcode, cobranca })
})

app.post('/webhook/pix*', async (req, res) => {
  console.log('webhook received')
  const { pix } = req.body
  if (!req.client.authorized) {
    return res.status(401).send('Invalid client certificate.')
  }
  await updateOrder(pix[0].txid, 'Pago com PIX')

  /*
{
  pix: [
    {
      endToEndId: 'E18236120202103160222s0026449ICB',
      txid: '690cb8a083d3491983ef25b33dbe1035',
      chave: '2842338b-ad31-4b95-903d-d44295cc549c',
      valor: '0.14',
      horario: '2021-03-16T02:22:26.000Z'
    }
  ]
}
*/

  res.send({ ok: 1 })
})

module.exports = app
