import { Bar, BarChart, Cell, LabelList, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

export function BarTrendChart({ title, data, max, baseColor, highlightColor, unit = '' }) {
  const last = data.length - 1
  const summary = data.map((d) => `${d.day} ${d.value}${unit}`).join(', ')

  return (
    <section className="chart-card" aria-label={title}>
      <h2 className="section-label chart-card__title">{title}</h2>
      <div className="chart-card__box" role="img" aria-label={`${title}: ${summary}`}>
        <ResponsiveContainer width="100%" height={110}>
          <BarChart data={data} margin={{ top: 18, right: 0, left: 0, bottom: 0 }} barCategoryGap={6}>
            <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12.5, fill: '#8e8e93', fontWeight: 600 }} />
            <YAxis hide domain={[0, max]} />
            <Tooltip cursor={false} formatter={(v) => [`${v}${unit}`, title]} contentStyle={{ fontSize: 13, borderRadius: 8 }} />
            <Bar dataKey="value" radius={[3, 3, 0, 0]} isAnimationActive={false}>
              {data.map((d, i) => (
                <Cell key={d.day} fill={i === last ? highlightColor : baseColor} />
              ))}
              <LabelList
                dataKey="value"
                position="top"
                formatter={(v) => `${v}${unit}`}
                style={{ fontSize: 12.5, fontWeight: 700, fill: '#4b5563' }}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </section>
  )
}
