import React from 'react'
import Svg, { Polygon, Rect, Circle, Text as ST } from 'react-native-svg'
import { SignType } from '../data/roadSigns'

type Props = { type: SignType; size?: number }

export function RoadSignIcon({ type, size = 80 }: Props) {
  const s = size
  const cx = s / 2
  const cy = s / 2

  const octPts = Array.from({ length: 8 }, (_, i) => {
    const a = ((i * 45 - 22.5) * Math.PI) / 180
    return `${cx + s * 0.43 * Math.cos(a)},${cy + s * 0.43 * Math.sin(a)}`
  }).join(' ')

  const diamondPts = `${cx},${s*0.05} ${s*0.95},${cy} ${cx},${s*0.95} ${s*0.05},${cy}`
  const yieldOuter = `${cx},${s*0.92} ${s*0.06},${s*0.1} ${s*0.94},${s*0.1}`
  const yieldInner = `${cx},${s*0.78} ${s*0.18},${s*0.2} ${s*0.82},${s*0.2}`
  const pentPts = [-90,-18,54,126,198].map(a => {
    const r = a * Math.PI / 180
    return `${cx + s*0.44*Math.cos(r)},${cy + s*0.44*Math.sin(r)}`
  }).join(' ')

  switch (type) {
    case 'stop':
      return <Svg width={s} height={s}><Polygon points={octPts} fill="#CC0000" stroke="#fff" strokeWidth={2}/><ST x={cx} y={cy+5} textAnchor="middle" fill="#fff" fontSize={s*0.18} fontWeight="bold">STOP</ST></Svg>
    case 'yield':
      return <Svg width={s} height={s}><Polygon points={yieldOuter} fill="#CC0000"/><Polygon points={yieldInner} fill="#fff"/><ST x={cx} y={cy+4} textAnchor="middle" fill="#CC0000" fontSize={s*0.13} fontWeight="bold">YIELD</ST></Svg>
    case 'warning':
      return <Svg width={s} height={s}><Polygon points={diamondPts} fill="#FFD700" stroke="#000" strokeWidth={2}/><ST x={cx} y={cy+5} textAnchor="middle" fill="#000" fontSize={s*0.12} fontWeight="bold">WARN</ST></Svg>
    case 'construction':
      return <Svg width={s} height={s}><Polygon points={diamondPts} fill="#FF6600" stroke="#000" strokeWidth={2}/><ST x={cx} y={cy-3} textAnchor="middle" fill="#000" fontSize={s*0.11} fontWeight="bold">WORK</ST><ST x={cx} y={cy+11} textAnchor="middle" fill="#000" fontSize={s*0.11} fontWeight="bold">ZONE</ST></Svg>
    case 'speed-limit':
      return <Svg width={s} height={s}><Rect x={s*0.05} y={s*0.05} width={s*0.9} height={s*0.9} fill="#fff" stroke="#000" strokeWidth={3} rx={4}/><ST x={cx} y={s*0.38} textAnchor="middle" fill="#000" fontSize={s*0.11} fontWeight="bold">SPEED</ST><ST x={cx} y={s*0.53} textAnchor="middle" fill="#000" fontSize={s*0.11} fontWeight="bold">LIMIT</ST><ST x={cx} y={s*0.8} textAnchor="middle" fill="#000" fontSize={s*0.24} fontWeight="bold">45</ST></Svg>
    case 'regulatory':
      return <Svg width={s} height={s}><Rect x={s*0.05} y={s*0.05} width={s*0.9} height={s*0.9} fill="#fff" stroke="#000" strokeWidth={3} rx={4}/><ST x={cx} y={cy+5} textAnchor="middle" fill="#000" fontSize={s*0.12} fontWeight="bold">RULE</ST></Svg>
    case 'guide':
      return <Svg width={s} height={s}><Rect x={s*0.05} y={s*0.05} width={s*0.9} height={s*0.9} fill="#006600" rx={4}/><ST x={cx} y={cy+5} textAnchor="middle" fill="#fff" fontSize={s*0.12} fontWeight="bold">EXIT</ST></Svg>
    case 'services':
      return <Svg width={s} height={s}><Rect x={s*0.05} y={s*0.05} width={s*0.9} height={s*0.9} fill="#0055BB" rx={4}/><ST x={cx} y={cy-3} textAnchor="middle" fill="#fff" fontSize={s*0.11} fontWeight="bold">GAS</ST><ST x={cx} y={cy+11} textAnchor="middle" fill="#fff" fontSize={s*0.11} fontWeight="bold">HOSP</ST></Svg>
    case 'recreation':
      return <Svg width={s} height={s}><Rect x={s*0.05} y={s*0.05} width={s*0.9} height={s*0.9} fill="#663300" rx={4}/><ST x={cx} y={cy+5} textAnchor="middle" fill="#fff" fontSize={s*0.12} fontWeight="bold">PARK</ST></Svg>
    case 'no-uturn':
      return <Svg width={s} height={s}><Circle cx={cx} cy={cy} r={s*0.45} fill="#fff" stroke="#000" strokeWidth={2}/><ST x={cx} y={cy-4} textAnchor="middle" fill="#CC0000" fontSize={s*0.2} fontWeight="bold">↩</ST><ST x={cx} y={cy+14} textAnchor="middle" fill="#CC0000" fontSize={s*0.12} fontWeight="bold">BANNED</ST></Svg>
    case 'railroad':
      return <Svg width={s} height={s}><Circle cx={cx} cy={cy} r={s*0.45} fill="#FFD700" stroke="#000" strokeWidth={2}/><ST x={cx} y={cy+6} textAnchor="middle" fill="#000" fontSize={s*0.22} fontWeight="bold">RR</ST></Svg>
    case 'school':
      return <Svg width={s} height={s}><Polygon points={pentPts} fill="#EAEA00" stroke="#000" strokeWidth={2}/><ST x={cx} y={cy+4} textAnchor="middle" fill="#000" fontSize={s*0.12} fontWeight="bold">SCHOOL</ST></Svg>
    case 'hov':
      return <Svg width={s} height={s}><Rect x={0} y={0} width={s} height={s} fill="#111"/><Polygon points={diamondPts} fill="#fff"/><ST x={cx} y={cy+5} textAnchor="middle" fill="#000" fontSize={s*0.15} fontWeight="bold">HOV</ST></Svg>
    default:
      return null
  }
}
