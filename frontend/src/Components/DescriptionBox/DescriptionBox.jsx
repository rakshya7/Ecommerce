import React from 'react'
import './DescriptionBox.css'

// Approximate conversions for the US sizes on sale, keyed by product category.
// Each row: [US, UK, EU, foot length in cm]
export const SIZE_CHARTS = {
  men: [
    ['6', '5.5', '38.5', '24'],
    ['7', '6', '40', '25'],
    ['8', '7', '41', '26'],
    ['9', '8', '42.5', '27'],
    ['10', '9', '44', '28'],
    ['11', '10', '45', '29'],
    ['12', '11', '46', '30'],
  ],
  women: [
    ['6', '3.5', '36.5', '23'],
    ['7', '4.5', '38', '24'],
    ['8', '5.5', '39', '25'],
    ['9', '6.5', '40.5', '26'],
    ['10', '7.5', '42', '27'],
    ['11', '8.5', '43', '28'],
    ['12', '9.5', '44.5', '29'],
  ],
  kid: [
    ['6', '5.5', '22', '12'],
    ['7', '6.5', '23.5', '13'],
    ['8', '7.5', '25', '14'],
    ['9', '8.5', '26', '15'],
    ['10', '9.5', '27', '16'],
    ['11', '10.5', '28', '17'],
    ['12', '11.5', '29.5', '18'],
  ],
}

const DescriptionBox = ({ product }) => {
  const chart = SIZE_CHARTS[product.category]

  return (
    <div className='descriptionbox'>
      {chart && (
        <details id='size-guide'>
          <summary>Size guide</summary>
          <div className='descriptionbox-body'>
            <p>
              Measure your foot from heel to longest toe and pick the closest length.
              Between two sizes? Take the larger one.
            </p>
            <table className='size-table'>
              <thead>
                <tr>
                  <th scope='col'>US</th>
                  <th scope='col'>UK</th>
                  <th scope='col'>EU</th>
                  <th scope='col'>Foot length</th>
                </tr>
              </thead>
              <tbody>
                {chart.map(([us, uk, eu, cm]) => (
                  <tr key={us}>
                    <td>{us}</td>
                    <td>{uk}</td>
                    <td>{eu}</td>
                    <td>{cm} cm</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className='hint'>Conversions are approximate and fit can vary by style.</p>
          </div>
        </details>
      )}

      <details>
        <summary>Care</summary>
        <ul className='descriptionbox-body descriptionbox-list'>
          <li>Clean with a soft brush and mild soap.</li>
          <li>Air dry naturally, away from direct heat.</li>
          <li>Store in a cool, dry place.</li>
          <li>Rotate pairs and leave 24 hours between wears.</li>
        </ul>
      </details>
    </div>
  )
}

export default DescriptionBox
