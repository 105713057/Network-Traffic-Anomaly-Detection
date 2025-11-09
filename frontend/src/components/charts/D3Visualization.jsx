import React, { useEffect, useRef, useMemo } from 'react'
import * as d3 from 'd3'
import './D3Visualization.css'

const D3Visualization = ({ predictionResult, predictionHistory, modelInfo }) => {
  const svgRef = useRef(null)
  const barChartRef = useRef(null)
  const pieChartRef = useRef(null)

  // D3 Bar Chart for prediction history
  useEffect(() => {
    if (!barChartRef.current || predictionHistory.length === 0) return

    d3.select(barChartRef.current).selectAll('*').remove()
    d3.selectAll('.d3-tooltip').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = 550 - margin.left - margin.right
    const height = 280 - margin.top - margin.bottom

    const svg = d3
      .select(barChartRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleBand()
      .domain(predictionHistory.map((_, i) => `P${i + 1}`))
      .range([0, width])
      .padding(0.1)

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height, 0])

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x))
      .selectAll('text')
      .style('fill', '#a0a0a0')
      .style('font-size', '10px')

    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => d + '%'))
      .selectAll('text')
      .style('fill', '#a0a0a0')
      .style('font-size', '10px')
    
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#3a3a3a')

    // Add tooltip
    const tooltip = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', '#1a1a1a')
      .style('border', '1px solid #2a2a2a')
      .style('border-radius', '6px')
      .style('padding', '8px')
      .style('color', '#e0e0e0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)

    svg
      .selectAll('.bar')
      .data(predictionHistory)
      .enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('x', (_, i) => x(`P${i + 1}`))
      .attr('width', x.bandwidth())
      .attr('y', d => y(d.probability * 100))
      .attr('height', d => height - y(d.probability * 100))
      .attr('fill', d => (d.prediction === 1 ? '#f44336' : '#4caf50'))
      .attr('opacity', 0.8)
      .on('mouseover', function(event, d) {
        d3.select(this).attr('opacity', 1)
        tooltip.transition().duration(200).style('opacity', 1)
        tooltip.html(`Prediction: ${d.prediction === 1 ? 'Attack' : 'Normal'}<br/>Probability: ${(d.probability * 100).toFixed(1)}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).attr('opacity', 0.8)
        tooltip.transition().duration(200).style('opacity', 0)
      })

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#ffffff')
      .text('Prediction History - Attack Probability')

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#a0a0a0')
      .style('font-size', '11px')
      .text('Probability (%)')
  }, [predictionHistory])

  // D3 Pie Chart for current prediction
  useEffect(() => {
    if (!pieChartRef.current || !predictionResult) return

    d3.select(pieChartRef.current).selectAll('*').remove()
    d3.selectAll('.d3-tooltip').remove()

    const width = 260
    const height = 260
    const radius = Math.min(width, height) / 2 - 15

    const svg = d3
      .select(pieChartRef.current)
      .append('svg')
      .attr('width', width)
      .attr('height', height)
      .style('overflow', 'visible')
      .append('g')
      .attr('transform', `translate(${width / 2},${height / 2})`)

    const data = [
      {
        label: 'Normal',
        value: predictionResult.prediction === 0 ? 100 : 0,
        color: '#4caf50',
      },
      {
        label: 'Attack',
        value: predictionResult.prediction === 1 ? 100 : 0,
        color: '#f44336',
      },
    ]

    const pie = d3.pie().value(d => d.value)

    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(radius - 10)

    const arcs = svg.selectAll('.arc').data(pie(data)).enter().append('g').attr('class', 'arc')

    arcs
      .append('path')
      .attr('d', arc)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#fff')
      .attr('stroke-width', 2)

    arcs
      .append('text')
      .attr('transform', d => `translate(${arc.centroid(d)})`)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#ffffff')
      .text(d => (d.data.value > 0 ? d.data.label : ''))

    svg
      .append('text')
      .attr('text-anchor', 'middle')
      .attr('dy', '0.35em')
      .style('font-size', '14px')
      .style('font-weight', '600')
      .style('fill', '#4a9eff')
      .text(`${(predictionResult.probability * 100).toFixed(1)}%`)
  }, [predictionResult])

  // D3 Line Chart
  useEffect(() => {
    if (!svgRef.current || predictionHistory.length === 0) return

    d3.select(svgRef.current).selectAll('*').remove()
    d3.selectAll('.d3-tooltip').remove()

    const margin = { top: 20, right: 30, bottom: 40, left: 50 }
    const width = 550 - margin.left - margin.right
    const height = 280 - margin.top - margin.bottom

    const svg = d3
      .select(svgRef.current)
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', `translate(${margin.left},${margin.top})`)

    const x = d3
      .scaleLinear()
      .domain([1, predictionHistory.length])
      .range([0, width])

    const y = d3
      .scaleLinear()
      .domain([0, 100])
      .nice()
      .range([height, 0])

    const line = d3
      .line()
      .x((_, i) => x(i + 1))
      .y(d => y(d.probability * 100))
      .curve(d3.curveMonotoneX)

    svg
      .append('path')
      .datum(predictionHistory)
      .attr('fill', 'none')
      .attr('stroke', '#4a9eff')
      .attr('stroke-width', 2)
      .attr('d', line)

    // Add tooltip for line chart
    const tooltipLine = d3.select('body').append('div')
      .attr('class', 'd3-tooltip')
      .style('opacity', 0)
      .style('position', 'absolute')
      .style('background', '#1a1a1a')
      .style('border', '1px solid #2a2a2a')
      .style('border-radius', '6px')
      .style('padding', '8px')
      .style('color', '#e0e0e0')
      .style('font-size', '12px')
      .style('pointer-events', 'none')
      .style('z-index', 1000)

    svg
      .selectAll('.dot')
      .data(predictionHistory)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('cx', (_, i) => x(i + 1))
      .attr('cy', d => y(d.probability * 100))
      .attr('r', 6)
      .attr('fill', d => (d.prediction === 1 ? '#f44336' : '#4caf50'))
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 2)
      .on('mouseover', function(event, d, i) {
        d3.select(this).attr('r', 8)
        tooltipLine.transition().duration(200).style('opacity', 1)
        tooltipLine.html(`Prediction #${i + 1}<br/>Type: ${d.prediction === 1 ? 'Attack' : 'Normal'}<br/>Probability: ${(d.probability * 100).toFixed(1)}%`)
          .style('left', (event.pageX + 10) + 'px')
          .style('top', (event.pageY - 10) + 'px')
      })
      .on('mouseout', function() {
        d3.select(this).attr('r', 6)
        tooltipLine.transition().duration(200).style('opacity', 0)
      })

    svg
      .append('g')
      .attr('transform', `translate(0,${height})`)
      .call(d3.axisBottom(x).ticks(predictionHistory.length))
      .selectAll('text')
      .style('fill', '#a0a0a0')
      .style('font-size', '10px')

    svg.append('g')
      .call(d3.axisLeft(y).tickFormat(d => d + '%'))
      .selectAll('text')
      .style('fill', '#a0a0a0')
      .style('font-size', '10px')
    
    svg.selectAll('.domain, .tick line')
      .style('stroke', '#3a3a3a')

    svg
      .append('text')
      .attr('x', width / 2)
      .attr('y', -10)
      .attr('text-anchor', 'middle')
      .style('font-size', '12px')
      .style('font-weight', '600')
      .style('fill', '#ffffff')
      .text('Attack Probability Timeline')

    svg
      .append('text')
      .attr('transform', 'rotate(-90)')
      .attr('y', 0 - margin.left)
      .attr('x', 0 - height / 2)
      .attr('dy', '1em')
      .style('text-anchor', 'middle')
      .style('fill', '#a0a0a0')
      .style('font-size', '11px')
      .text('Probability (%)')
  }, [predictionHistory])

  return (
    <div className="d3-container">
      <div className="charts-grid">
        {predictionResult && (
          <div className="chart-item">
            <h3>Current Prediction (D3 Pie Chart)</h3>
            <div className="chart-wrapper">
              <div ref={pieChartRef} className="d3-chart"></div>
            </div>
          </div>
        )}

        {predictionHistory.length > 0 && (
          <>
            <div className="chart-item">
              <h3>Prediction History (D3 Bar Chart)</h3>
              <div className="chart-wrapper">
                <div ref={barChartRef} className="d3-chart"></div>
              </div>
            </div>

            <div className="chart-item full-width">
              <h3>Probability Timeline (D3 Line Chart)</h3>
              <div className="chart-wrapper">
                <div ref={svgRef} className="d3-chart"></div>
              </div>
            </div>
          </>
        )}

        {!predictionResult && predictionHistory.length === 0 && (
          <div className="no-data">
            <p>Make a prediction to see D3.js visualizations</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default D3Visualization

